import { IPlayerQueryService } from "./IPlayerQueryService";
import {PlayerQueryService} from "./PlayerQueryService";
import { PlayerFakeMemory } from "./PlayerFakeMemory";

export class Factories
{
    //Repository生成 FakeかDBかここで分岐させる
    public static CreatePlayerQueryService():IPlayerQueryService{
        
        //mongodb接続情報の定義有無
        if(process.env.MONGODB_URI != null){
            return new PlayerQueryService();
        }else
        {
            return new PlayerFakeMemory();
        }
    }
}