"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var queryMiddleware = function (params, body, url) { return url.searchParams.append("nm", params.query); };
exports.default = queryMiddleware;
