import { IPlayerQueryService } from "./IPlayerQueryService";
import { IPlayer } from "./PlayerQueryService";

//Fake用のクラス
export class PlayerFakeMemory implements IPlayerQueryService//implements IPlayerRepository
{
    private _list: Array<IPlayer>;

    constructor(source?: Array<IPlayer>) {
        if (source == null) {
            this._list = new Array<IPlayer>();
            this._list.push({ name: "曽ヶ端準", url: "", belong: [{ teamName: "鹿島アントラーズ", belongStart: new Date("2000/01/01"), belongEnd: new Date("2018/01/01") }] });
            this._list.push({ name: "内田篤人", url: "", belong: [{ teamName: "鹿島アントラーズ", belongStart: new Date("2016/01/01"), belongEnd: new Date("2017/04/01") }] });
        }else
        {
            this._list =source;
        }
    }

    public async getDataBy(): Promise<IPlayer[]> {
        return this._list;
    }

}