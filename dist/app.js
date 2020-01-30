"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var http_errors_1 = __importDefault(require("http-errors"));
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var morgan_1 = __importDefault(require("morgan"));
var serve_favicon_1 = __importDefault(require("serve-favicon"));
var index_1 = require("./routes/index");
var players_1 = require("./routes/players");
var search_1 = require("./routes/search");
var app = express_1.default();
//favicon設定
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(serve_favicon_1.default(path_1.default.join('public', 'favicon.ico')));
//  app.set("views", path.join(__dirname, "views"));
app.set("views", "views");
app.set("view engine", "pug");
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
//  app.use(express.static(path.join(__dirname, "public")));
app.use(express_1.default.static("public"));
app.use("/", index_1.router);
app.use("/players", players_1.router);
//追加
app.use("/search", search_1.router);
app.use(function (req, res, next) {
    return next(http_errors_1.default(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.render("error");
});
module.exports = app;
//# sourceMappingURL=app.js.map