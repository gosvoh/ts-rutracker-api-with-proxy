"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var Torrent = /** @class */ (function () {
    function Torrent(options) {
        this.author = options.author;
        this.category = options.category;
        this.id = options.id;
        this.leeches = options.leeches;
        this.seeds = options.seeds;
        this.size = options.size;
        this.state = options.state;
        this.title = options.title;
        this.downloads = options.downloads;
        this.registered = options.registered;
        this.imageUri = options.imageUri;
        this.url = options.url;
    }
    Object.defineProperty(Torrent.prototype, "formattedSize", {
        get: function () {
            return (0, utils_1.formatSize)(this.size || 0);
        },
        enumerable: false,
        configurable: true
    });
    Torrent.APPROVED = "проверено";
    Torrent.NOT_APPROVED = "не проверено";
    Torrent.NEED_EDIT = "недооформлено";
    Torrent.DUBIOUSLY = "сомнительно";
    Torrent.CONSUMED = "поглощено";
    Torrent.TEMPORARY = "временная";
    return Torrent;
}());
exports.default = Torrent;
