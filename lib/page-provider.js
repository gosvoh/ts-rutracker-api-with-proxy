"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("url");
var axios_1 = require("axios");
var errors_1 = require("./errors");
var middlewares_1 = require("./middlewares");
var utils_1 = require("./utils");
var fs = require("node:fs");
var PageProvider = /** @class */ (function () {
    function PageProvider(host, httpClientConfigs) {
        if (host === void 0) { host = "https://rutracker.org"; }
        this.authorized = false;
        this.cookie = null;
        this.host = host;
        this.loginUrl = "".concat(this.host, "/forum/login.php");
        this.searchUrl = "".concat(this.host, "/forum/tracker.php");
        this.threadUrl = "".concat(this.host, "/forum/viewtopic.php");
        this.downloadUrl = "".concat(this.host, "/forum/dl.php");
        this.searchMiddlewares = [middlewares_1.queryMiddleware, middlewares_1.sortMiddleware, middlewares_1.orderMiddleware];
        this.request = axios_1.default.create(httpClientConfigs);
    }
    Object.defineProperty(PageProvider.prototype, "isAuthorized", {
        get: function () {
            return this.authorized;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PageProvider.prototype, "cookieString", {
        get: function () {
            return this.cookie;
        },
        enumerable: false,
        configurable: true
    });
    PageProvider.prototype.login = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var err_1, body, response, setCookie, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!fs.existsSync("cookie.txt")) return [3 /*break*/, 4];
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        this.cookie = fs.readFileSync("cookie.txt", "utf-8");
                        return [4 /*yield*/, this.request({
                                url: this.loginUrl,
                                method: "GET",
                                headers: {
                                    Cookie: this.cookie,
                                },
                                maxRedirects: 0,
                            })];
                    case 2:
                        _b.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_1 = _b.sent();
                        if (err_1.response.status === 302) {
                            this.authorized = true;
                            return [2 /*return*/, true];
                        }
                        return [3 /*break*/, 4];
                    case 4:
                        body = new url_1.URLSearchParams();
                        body.append("login_username", username);
                        body.append("login_password", password);
                        body.append("login", "Вход");
                        _b.label = 5;
                    case 5:
                        _b.trys.push([5, 7, , 8]);
                        return [4 /*yield*/, this.request({
                                url: this.loginUrl,
                                method: "POST",
                                data: body.toString(),
                                maxRedirects: 0,
                                validateStatus: function (status) {
                                    return status === 302;
                                },
                            })];
                    case 6:
                        response = _b.sent();
                        setCookie = response.headers["set-cookie"];
                        this.cookie =
                            (setCookie === null || setCookie === void 0 ? void 0 : setCookie.map(function (cookie) { return cookie.split(";")[0]; }).join(";")) || null;
                        this.authorized = true;
                        fs.writeFileSync("cookie.txt", this.cookie || "");
                        return [2 /*return*/, true];
                    case 7:
                        _a = _b.sent();
                        throw new errors_1.AuthorizationError();
                    case 8: return [2 /*return*/];
                }
            });
        });
    };
    PageProvider.prototype.search = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var url, body, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.authorized) {
                            return [2 /*return*/, Promise.reject(new errors_1.NotAuthorizedError())];
                        }
                        url = new url_1.URL(this.searchUrl);
                        body = new url_1.URLSearchParams();
                        try {
                            this.searchMiddlewares.forEach(function (middleware) {
                                middleware(params, body, url);
                            });
                        }
                        catch (err) {
                            return [2 /*return*/, Promise.reject(err)];
                        }
                        return [4 /*yield*/, this.request({
                                url: url.toString(),
                                data: body.toString(),
                                method: "POST",
                                responseType: "arraybuffer",
                                headers: {
                                    Cookie: this.cookie,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.decodeWindows1251)(response.data)];
                }
            });
        });
    };
    PageProvider.prototype.thread = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.authorized) {
                            return [2 /*return*/, Promise.reject(new errors_1.NotAuthorizedError())];
                        }
                        url = "".concat(this.threadUrl, "?t=").concat(encodeURIComponent(id));
                        return [4 /*yield*/, this.request({
                                url: url,
                                method: "GET",
                                responseType: "arraybuffer",
                                headers: {
                                    Cookie: this.cookie,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, (0, utils_1.decodeWindows1251)(response.data)];
                }
            });
        });
    };
    PageProvider.prototype.torrentFile = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var url, response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.authorized) {
                            return [2 /*return*/, Promise.reject(new errors_1.NotAuthorizedError())];
                        }
                        url = "".concat(this.downloadUrl, "?t=").concat(encodeURIComponent(id));
                        return [4 /*yield*/, this.request({
                                url: url,
                                method: "GET",
                                responseType: "stream",
                                headers: {
                                    Cookie: this.cookie,
                                },
                            })];
                    case 1:
                        response = _a.sent();
                        return [2 /*return*/, response.data];
                }
            });
        });
    };
    return PageProvider;
}());
exports.default = PageProvider;
