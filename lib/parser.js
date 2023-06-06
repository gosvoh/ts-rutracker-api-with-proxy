"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = require("cheerio");
var torrent_1 = require("./torrent");
var Parser = /** @class */ (function () {
    function Parser(host) {
        if (host === void 0) { host = "https://rutracker.org"; }
        this.host = host;
    }
    Parser.prototype.parseSearch = function (rawHtml) {
        var $ = (0, cheerio_1.load)(rawHtml, { decodeEntities: false });
        var results = [];
        var tracks = $("#tor-tbl tbody").find("tr");
        var length = tracks.length;
        for (var i = 0; i < length; i += 1) {
            // Ah-m... Couldn't find any better method
            var document_1 = tracks.find("td");
            var state = document_1.next();
            var category = state.next();
            var title = category.next();
            var author = title.next();
            var size = author.next();
            var seeds = size.next();
            var leeches = seeds.next();
            var downloads = leeches.next();
            var registered = downloads.next();
            var id = title.find("div a").attr("data-topic_id");
            // Handle case where search has no results
            if (id) {
                var torrent = new torrent_1.default({
                    state: state.attr("title"),
                    id: id,
                    category: category.find(".f-name a").html() || undefined,
                    title: title.find("div a ").html() || undefined,
                    author: author.find("div a ").html() || undefined,
                    size: Number(size.attr("data-ts_text")),
                    seeds: Number(seeds.find("b").html()),
                    leeches: Number(leeches.html()),
                    downloads: Number(downloads.html()),
                    registered: new Date(Number(registered.attr("data-ts_text")) * 1000),
                    url: "".concat(this.host, "/forum/viewtopic.php?t=").concat(id),
                });
                results.push(torrent);
            }
            tracks = tracks.next();
        }
        return results;
    };
    Parser.prototype.parseMagnetLink = function (rawHtml) {
        var $ = (0, cheerio_1.load)(rawHtml, { decodeEntities: false });
        return $(".magnet-link").attr("href");
    };
    return Parser;
}());
exports.default = Parser;
