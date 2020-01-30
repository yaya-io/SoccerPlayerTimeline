import { PlayerDto } from "./PlayerDto";
import Enumerable from "linq";
import { IPlayer } from "../queryServices/PlayerQueryService";
import { Team } from "../Team";

export class PlayerVisDto {
  //visTimelineにセットするitemsオブジェクト
  readonly items: Array<{ [key: string]: string }>;

  //visTimelineにセットするgroupsオブジェクト
  readonly groups: Array<{ [key: string]: string }>;

  //コンストラクタ
  constructor(sourceList: IPlayer[]) {

    //IPlayer[]からPlayerEntity[]に変換する>>
    const playerlist = new Array<PlayerDto>(); //平坦化した選手データリスト    

    //Date型をyyyy-mm-dd形式に変換する関数
    const dateFormatter = ((x: Date) => x.getFullYear() + "-" + (x.getMonth() + 1) + "-" + x.getDate());

    const endDateTimeValue = new Date("2099/01/01").getTime();//便宜上の最新日付値(DB格納時に値なしのもに設定)
    const nowDate = new Date();

    //belongの中身を平坦化
    Enumerable.from(sourceList).forEach((x) => {
             
      Enumerable.from(x.belong).forEach((n) => {
        const teamName = n.teamName;
        const belongStart = n.belongStart;
        let belongEnd = n.belongEnd;
        if (belongEnd.getTime() == endDateTimeValue) {
          //最終所属Dateは固定値としているため、今日の日付に変換
          belongEnd = nowDate;
        }
        const dto = new PlayerDto(x.name, teamName, dateFormatter(belongStart), dateFormatter(belongEnd), x.url);
        playerlist.push(dto);
      });
    });
    //IPlayer[]からPlayerEntity[]に変換する<<

    
    //playerListを変換してitemsにセット
    this.items = Enumerable.from(playerlist)    
      .distinct(x => x.name + '_' + x.teamName +'_' + x.belongStart +'_' + x.belongEnd)
      .select((x, idx) => {
        return {
          id: idx.toString(),
          group: x.name,          
          content: `<span class='circle-icon ${Team.getStyleNameBy(x.teamName)}'></span><span>${x.teamName}</span>`,
          start: x.belongStart.toString(),
          end: x.belongEnd.toString(),
          className: Team.getStyleNameBy(x.teamName)
        }
      })
      .toArray();

    // groupsをセット(名前,Wiki-URLを設定)        
    this.groups = Enumerable.from(sourceList)
      .select(x => {
        return {
          id: x.name,
          content: `<a href='${x.url}' target='_blank'> ${x.name} </a>`
        };
      })
      .distinct(x =>x.id)
      .toArray();
  }

}