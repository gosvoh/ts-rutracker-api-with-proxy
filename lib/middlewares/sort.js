"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var sortMapping = {
    registered: "1",
    title: "2",
    downloads: "4",
    size: "7",
    lastMessage: "8",
    seeds: "10",
    leeches: "11",
};
var sortMiddleware = function (params, body) {
    if (!params.sort) {
        return;
    }
    if (!Object.prototype.hasOwnProperty.call(sortMapping, params.sort)) {
        var validSortFields = Object.keys(sortMapping);
        throw new errors_1.ValidationError("Invalid sort property \"".concat(params.sort, "\". Valid properties are ").concat(validSortFields.join(", ")));
    }
    body.append("o", sortMapping[params.sort]);
};
exports.default = sortMiddleware;
