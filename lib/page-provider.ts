import { URL, URLSearchParams } from "url";
import axios from "axios";
import { AuthorizationError, NotAuthorizedError } from "./errors";
import {
  orderMiddleware,
  queryMiddleware,
  sortMiddleware,
} from "./middlewares";
import { decodeWindows1251 } from "./utils";
import type { AxiosInstance, CreateAxiosDefaults } from "axios";
import * as fs from "node:fs";

export default class PageProvider {
  private authorized: boolean;
  private cookie: string | null;
  private host: string;
  private loginUrl: string;
  private searchUrl: string;
  private threadUrl: string;
  private downloadUrl: string;
  private searchMiddlewares: Function[];
  private request: AxiosInstance;

  get isAuthorized() {
    return this.authorized;
  }
  get cookieString() {
    return this.cookie;
  }

  constructor(
    host: string = "https://rutracker.org",
    httpClientConfigs?: CreateAxiosDefaults
  ) {
    this.authorized = false;
    this.cookie = null;
    this.host = host;
    this.loginUrl = `${this.host}/forum/login.php`;
    this.searchUrl = `${this.host}/forum/tracker.php`;
    this.threadUrl = `${this.host}/forum/viewtopic.php`;
    this.downloadUrl = `${this.host}/forum/dl.php`;

    this.searchMiddlewares = [queryMiddleware, sortMiddleware, orderMiddleware];
    this.request = axios.create(httpClientConfigs);
  }

  async login(username: string, password: string) {
    if (fs.existsSync("cookie.txt")) {
      try {
        this.cookie = fs.readFileSync("cookie.txt", "utf-8");
        await this.request({
          url: this.loginUrl,
          method: "GET",
          headers: {
            Cookie: this.cookie,
          },
          maxRedirects: 0,
        });
      } catch (err: any) {
        if (err.response.status === 302) {
          this.authorized = true;
          return true;
        }
      }
    }

    const body = new URLSearchParams();

    body.append("login_username", username);
    body.append("login_password", password);
    body.append("login", "Вход");

    try {
      const response = await this.request({
        url: this.loginUrl,
        method: "POST",
        data: body.toString(),
        maxRedirects: 0,
        validateStatus(status: number) {
          return status === 302;
        },
      });
      const setCookie = response.headers["set-cookie"];
      this.cookie =
        setCookie?.map((cookie) => cookie.split(";")[0]).join(";") || null;
      this.authorized = true;
      fs.writeFileSync("cookie.txt", this.cookie || "");
      return true;
    } catch {
      throw new AuthorizationError();
    }
  }

  async search(params: { query?: string; sort?: string; order?: string }) {
    if (!this.authorized) {
      return Promise.reject(new NotAuthorizedError());
    }

    const url = new URL(this.searchUrl);
    const body = new URLSearchParams();

    try {
      this.searchMiddlewares.forEach((middleware) => {
        middleware(params, body, url);
      });
    } catch (err) {
      return Promise.reject(err);
    }

    const response = await this.request({
      url: url.toString(),
      data: body.toString(),
      method: "POST",
      responseType: "arraybuffer",
      headers: {
        Cookie: this.cookie,
      },
    });
    return decodeWindows1251(response.data);
  }

  async thread(id: string) {
    if (!this.authorized) {
      return Promise.reject(new NotAuthorizedError());
    }

    const url = `${this.threadUrl}?t=${encodeURIComponent(id)}`;

    const response = await this.request({
      url,
      method: "GET",
      responseType: "arraybuffer",
      headers: {
        Cookie: this.cookie,
      },
    });
    return decodeWindows1251(response.data);
  }

  async torrentFile(id: string) {
    if (!this.authorized) {
      return Promise.reject(new NotAuthorizedError());
    }

    const url = `${this.downloadUrl}?t=${encodeURIComponent(id)}`;

    const response = await this.request({
      url,
      method: "GET",
      responseType: "stream",
      headers: {
        Cookie: this.cookie,
      },
    });
    return response.data;
  }
}
