"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerQueryService_1 = require("./PlayerQueryService");
var PlayerFakeMemory_1 = require("./PlayerFakeMemory");
var Factories = /** @class */ (function () {
    function Factories() {
    }
    //Repository生成 FakeかDBかここで分岐させる
    Factories.CreatePlayerQueryService = function () {
        //mongodb接続情報の定義有無
        if (process.env.MONGODB_URI != null) {
            return new PlayerQueryService_1.PlayerQueryService();
        }
        else {
            return new PlayerFakeMemory_1.PlayerFakeMemory();
        }
    };
    return Factories;
}());
exports.Factories = Factories;
//# sourceMappingURL=Factories.js.map