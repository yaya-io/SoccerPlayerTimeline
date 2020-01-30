"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//PlayerデータのDto
//visの表示用に1所属データ1レコードとなるデータ構造としている
var PlayerDto = /** @class */ (function () {
    function PlayerDto(name, teamName, belongStart, belongEnd, url) {
        this.name = name;
        this.teamName = teamName;
        this.belongStart = belongStart;
        this.belongEnd = belongEnd;
        this.url = url;
    }
    return PlayerDto;
}());
exports.PlayerDto = PlayerDto;
//# sourceMappingURL=PlayerDto.js.map