"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Team = /** @class */ (function () {
    function Team() {
    }
    //チーム名-css class名の定義
    Team.getStyleDictionary = function () {
        var dict = {};
        dict["鹿島アントラーズ"] = "kashima";
        dict["ベガルタ仙台"] = "begaruta";
        dict["清水エスパルス"] = "shimizu";
        dict["横浜F・マリノス"] = "marinosu";
        dict["湘南ベルマーレ"] = "syonan";
        dict["ジュビロ磐田"] = "jubiro";
        dict["サガン鳥栖"] = "sagantosu";
        dict["ヴィッセル神戸"] = "kobe";
        dict["川崎フロンターレ"] = "kawasaki";
        dict["コンサドーレ札幌"] = "sapporo";
        dict["FC東京"] = "fctokyo";
        dict["サンフレッチェ広島"] = "hiroshima";
        dict["ガンバ大阪"] = "ganba";
        dict["浦和レッズ"] = "urawa";
        dict["松本山雅FC"] = "matsumoto";
        dict["名古屋グランパス"] = "nagoya";
        dict["大分トリニータ"] = "oita";
        dict["セレッソ大阪"] = "seresso";
        return dict;
    };
    //チーム名からcss class名を取得
    Team.getStyleNameBy = function (teamName) {
        var dict = Team.getStyleDictionary();
        var teamStyleName = dict[teamName];
        if (teamStyleName == null) {
            return "default";
        }
        return teamStyleName;
    };
    //チーム名のリストを取得
    Team.getNameList = function () {
        var teamNameList = Object.keys(Team.getStyleDictionary()).map(function (x) { return x; });
        return teamNameList;
    };
    return Team;
}());
exports.Team = Team;
//# sourceMappingURL=Team.js.map