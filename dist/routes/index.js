"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
exports.router = express_1.Router();
// console.error('called index Router 1');
exports.router.get("/", function (req, res, next) {
    res.render("index", { title: "Soccer Player Timeline β" });
});
//# sourceMappingURL=index.js.map