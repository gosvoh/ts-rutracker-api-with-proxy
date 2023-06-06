"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatSize = exports.decodeWindows1251 = void 0;
var windows1251 = require("windows-1251");
var decodeWindows1251 = function (string) {
    return string === undefined
        ? undefined
        : windows1251.decode(string.toString("binary"), { mode: "replacement" });
};
exports.decodeWindows1251 = decodeWindows1251;
var formatSize = function (sizeInBytes) {
    var sizeInMegabytes = sizeInBytes / (1000 * 1000 * 1000);
    return "".concat(sizeInMegabytes.toFixed(2), " GB");
};
exports.formatSize = formatSize;
