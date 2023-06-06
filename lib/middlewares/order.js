"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errors_1 = require("../errors");
var orderMapping = {
    asc: "1",
    desc: "2",
};
var orderMiddleware = function (params, body) {
    if (!params.order)
        return;
    if (!params.sort)
        throw new errors_1.ValidationError("Sort should also be defined when order is set");
    if (!Object.prototype.hasOwnProperty.call(orderMapping, params.order)) {
        var validOrderFields = Object.keys(orderMapping);
        throw new errors_1.ValidationError("Invalid order property \"".concat(params.order, "\". Valid properties are ").concat(validOrderFields.join(", ")));
    }
    body.append("s", orderMapping[params.order]);
};
exports.default = orderMiddleware;
