"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Team_1 = require("../models/Team");
exports.router = express_1.Router();
exports.router.get("/", function (req, res, next) {
    res.render("search", { title: "Soccer Player Timeline β", teamList: Team_1.Team.getNameList() });
});
//# sourceMappingURL=search.js.map