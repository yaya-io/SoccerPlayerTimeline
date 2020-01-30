
import { IPlayerQueryService } from "../models/queryServices/IPlayerQueryService";
import { PlayerVisDto } from "../models/dto/PlayerVisDto";

export class PlayerAppService
{
    private queryService:IPlayerQueryService;

    constructor(queryService:IPlayerQueryService)
    {
      this.queryService = queryService;        
    }
    
    //Vis.Timeline表示用のデータを取得
    public async getVisObjectBy(paramTeamName:string,paramYear:string) :Promise<PlayerVisDto>{
            
      const playerList = await this.queryService.getDataBy(paramTeamName, paramYear);        
      const visObject = new PlayerVisDto(playerList);

      return visObject;

    }

    
}