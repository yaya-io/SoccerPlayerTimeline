export class Team {

  //チーム名-css class名の定義
  private static getStyleDictionary():{ [key: string]: string } 
  {
    let dict: { [key: string]: string } = {};
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
  }
  

  //チーム名からcss class名を取得
  public static getStyleNameBy(teamName: string): string {    
    const dict = Team.getStyleDictionary();
    const teamStyleName = dict[teamName];
    if (teamStyleName == null) {
      return "default";
    }
    return teamStyleName;
  }

  
  //チーム名のリストを取得
  public static getNameList():string[] {
    const teamNameList :string[] = Object.keys(Team.getStyleDictionary()).map( x => x);
    return teamNameList;
  }
}