import { IPlayer } from "./PlayerQueryService";

export interface IPlayerQueryService{
    getDataBy(paramTeamName:string,paramYear:string ):Promise<IPlayer[]>
}