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
var parser_1 = require("./lib/parser");
var page_provider_1 = require("./lib/page-provider");
var RutrackerApi = /** @class */ (function () {
    function RutrackerApi(host, httpClientConfigs) {
        if (host === void 0) { host = "https://rutracker.org"; }
        this.parser = new parser_1.default(host);
        this.pageProvider = new page_provider_1.default(host, httpClientConfigs);
    }
    RutrackerApi.prototype.login = function (username, password) {
        var usernameCopy = JSON.parse(JSON.stringify(username));
        if (typeof username === "object") {
            password = usernameCopy.password;
            usernameCopy = usernameCopy.username;
        }
        return this.pageProvider.login(username, password);
    };
    RutrackerApi.prototype.search = function (query, sort, order, fetchPosters) {
        return __awaiter(this, void 0, void 0, function () {
            var queryCopy, html, torrents;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queryCopy = JSON.parse(JSON.stringify(query));
                        if (typeof query === "object") {
                            sort = queryCopy.sort;
                            order = queryCopy.order;
                            queryCopy = queryCopy.query;
                            fetchPosters = queryCopy.fetchPosters;
                        }
                        if (fetchPosters === undefined)
                            fetchPosters = false;
                        return [4 /*yield*/, this.pageProvider.search({
                                queryCopy: queryCopy,
                                sort: sort,
                                order: order,
                            })];
                    case 1:
                        html = _a.sent();
                        if (!html)
                            return [2 /*return*/, null];
                        torrents = this.parser.parseSearch(html);
                        if (!fetchPosters)
                            return [2 /*return*/, torrents];
                        return [4 /*yield*/, Promise.all(torrents.map(function (torrent, index, arr) { return __awaiter(_this, void 0, void 0, function () {
                                var res, buffer, page, mainTopic, img, title;
                                var _a, _b, _c, _d;
                                return __generator(this, function (_e) {
                                    switch (_e.label) {
                                        case 0: return [4 /*yield*/, fetch(torrent.url, {
                                                headers: {
                                                    Cookie: this.pageProvider.cookieString || "",
                                                },
                                            })];
                                        case 1:
                                            res = _e.sent();
                                            return [4 /*yield*/, res.arrayBuffer()];
                                        case 2:
                                            buffer = _e.sent();
                                            page = new TextDecoder("windows-1251").decode(buffer);
                                            if (!page)
                                                return [2 /*return*/];
                                            mainTopic = (_a = page.match(/<tbody id=".*?" class="row1">.*?<\/tbody>/s)) === null || _a === void 0 ? void 0 : _a[0];
                                            if (!mainTopic)
                                                return [2 /*return*/];
                                            img = (_b = mainTopic.match(/<var class="postImg .*?" title=".*?">.*?<\/var>/s)) === null || _b === void 0 ? void 0 : _b[0];
                                            if (!img)
                                                return [2 /*return*/];
                                            title = (_d = (_c = img.match(/title=".*?"/s)) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.slice(7, -1);
                                            if (!title)
                                                return [2 /*return*/];
                                            torrent.imageUri = title;
                                            return [2 /*return*/];
                                    }
                                });
                            }); }))];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, torrents];
                }
            });
        });
    };
    RutrackerApi.prototype.download = function (id) {
        return this.pageProvider.torrentFile(id);
    };
    RutrackerApi.prototype.getMagnetLink = function (id) {
        return __awaiter(this, void 0, void 0, function () {
            var html;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.pageProvider.thread(id)];
                    case 1:
                        html = _a.sent();
                        if (!html)
                            return [2 /*return*/, null];
                        return [2 /*return*/, this.parser.parseMagnetLink(html)];
                }
            });
        });
    };
    Object.defineProperty(RutrackerApi.prototype, "pageProviderInstance", {
        get: function () {
            return this.pageProvider;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RutrackerApi.prototype, "parserInstance", {
        get: function () {
            return this.parser;
        },
        enumerable: false,
        configurable: true
    });
    return RutrackerApi;
}());
exports.default = RutrackerApi;
