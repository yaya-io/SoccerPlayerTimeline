//PlayerデータのDto
//visの表示用に1所属データ1レコードとなるデータ構造としている
export class PlayerDto{
    name:string;
    teamName:string;
    belongStart:string;
    belongEnd:string;
    url:string;

    constructor(name:string,teamName:string,belongStart:string,belongEnd:string,url:string){
        this.name = name;
        this.teamName =teamName;
        this.belongStart = belongStart;
        this.belongEnd = belongEnd;
        this.url = url;
    }
}