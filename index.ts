import Parser from "./lib/parser";
import PageProvider from "./lib/page-provider";
import type { SortType, OrderType } from "./lib/middlewares/types";
import type Torrent from "./lib/torrent";
import type { CreateAxiosDefaults } from "axios";

export default class RutrackerApi {
  private parser: Parser;
  private pageProvider: PageProvider;

  constructor(
    host = "https://rutracker.org",
    httpClientConfigs?: CreateAxiosDefaults
  ) {
    this.parser = new Parser(host);
    this.pageProvider = new PageProvider(host, httpClientConfigs);
  }

  login({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<boolean>;
  login(username: string, password: string): Promise<boolean>;
  login(username: any, password?: string) {
    let usernameCopy = JSON.parse(JSON.stringify(username));

    if (typeof username === "object") {
      password = usernameCopy.password;
      usernameCopy = usernameCopy.username;
    }
    return this.pageProvider.login(username, password as string);
  }

  async search({
    query,
    order,
    sort,
    fetchPosters = true,
  }: {
    query: string;
    sort?: SortType;
    order?: OrderType;
    fetchPosters?: boolean;
  }): Promise<Torrent[] | null>;
  async search(
    query: string,
    sort?: SortType,
    order?: OrderType,
    fetchPosters?: boolean
  ): Promise<Torrent[] | null>;

  async search(
    query: any,
    sort?: SortType,
    order?: OrderType,
    fetchPosters?: boolean
  ) {
    let queryCopy = JSON.parse(JSON.stringify(query));

    if (typeof query === "object") {
      sort = queryCopy.sort;
      order = queryCopy.order;
      queryCopy = queryCopy.query;
      fetchPosters = queryCopy.fetchPosters;
    }

    if (fetchPosters === undefined) fetchPosters = false;

    const html = await this.pageProvider.search({
      queryCopy,
      sort,
      order,
    } as any);
    if (!html) return null;
    const torrents = this.parser.parseSearch(html);
    if (!fetchPosters) return torrents;

    await Promise.all(
      torrents.map(async (torrent, index, arr) => {
        const res = await fetch(torrent.url, {
          headers: {
            Cookie: this.pageProvider.cookieString || "",
          },
        });
        const buffer = await res.arrayBuffer();
        const page = new TextDecoder("windows-1251").decode(buffer);
        if (!page) return;
        const mainTopic = page.match(
          /<tbody id=".*?" class="row1">.*?<\/tbody>/s
        )?.[0];
        if (!mainTopic) return;

        const img = mainTopic.match(
          /<var class="postImg .*?" title=".*?">.*?<\/var>/s
        )?.[0];
        if (!img) return;

        const title = img.match(/title=".*?"/s)?.[0]?.slice(7, -1);
        if (!title) return;

        torrent.imageUri = title;
      })
    );

    return torrents;
  }

  download(id: string) {
    return this.pageProvider.torrentFile(id);
  }

  async getMagnetLink(id: string) {
    const html = await this.pageProvider.thread(id);
    if (!html) return null;
    return this.parser.parseMagnetLink(html);
  }

  get pageProviderInstance() {
    return this.pageProvider;
  }

  get parserInstance() {
    return this.parser;
  }
}
