"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var PlayerDto_1 = require("./dto/PlayerDto");
var linq_1 = __importDefault(require("linq"));
var Team_1 = require("./Team");
var PlayerVisDto = /** @class */ (function () {
    //コンストラクタ
    function PlayerVisDto(sourceList) {
        //IPlayer[]からPlayerEntity[]に変換する>>
        var playerlist = new Array(); //平坦化した選手データリスト    
        //Date型をyyyy-mm-dd形式に変換する関数
        var dateFormatter = (function (x) { return x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate(); });
        var endDateTimeValue = new Date("2099/01/01").getTime(); //便宜上の最新日付値(DB格納時に値なしのもに設定)
        var nowDate = new Date();
        //belongの中身を平坦化
        linq_1.default.from(sourceList).forEach(function (x) {
            linq_1.default.from(x.belong).forEach(function (n) {
                var teamName = n.teamName;
                var belongStart = n.belongStart;
                var belongEnd = n.belongEnd;
                if (belongEnd.getTime() == endDateTimeValue) {
                    //最終所属Dateは固定値としているため、今日の日付に変換
                    belongEnd = nowDate;
                }
                var dto = new PlayerDto_1.PlayerDto(x.name, teamName, dateFormatter(belongStart), dateFormatter(belongEnd), x.url);
                playerlist.push(dto);
            });
        });
        //IPlayer[]からPlayerEntity[]に変換する<<
        //playerListを変換してitemsにセット
        this.items = linq_1.default.from(playerlist)
            .distinct(function (x) { return x.name + '_' + x.teamName + '_' + x.belongStart + '_' + x.belongEnd; })
            .select(function (x, idx) {
            return {
                id: idx.toString(),
                group: x.name,
                content: "<span class='circle-icon " + Team_1.Team.getStyleNameBy(x.teamName) + "'></span><span>" + x.teamName + "</span>",
                start: x.belongStart.toString(),
                end: x.belongEnd.toString(),
                className: Team_1.Team.getStyleNameBy(x.teamName)
            };
        })
            .toArray();
        // groupsをセット(名前,Wiki-URLを設定)        
        this.groups = linq_1.default.from(sourceList)
            .select(function (x) {
            return {
                id: x.name,
                content: "<a href='" + x.url + "' target='_blank'> " + x.name + " </a>"
            };
        })
            .distinct(function (x) { return x.id; })
            .toArray();
    }
    return PlayerVisDto;
}());
exports.PlayerVisDto = PlayerVisDto;
//# sourceMappingURL=PlayerVisDto.js.map