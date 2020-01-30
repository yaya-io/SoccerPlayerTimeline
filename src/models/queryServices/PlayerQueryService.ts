import { IPlayerQueryService } from "./IPlayerQueryService";
import mongoose,{Schema,Document} from "mongoose";


//Mongoose用のModel
export interface IPlayerMongooseModel extends IPlayer,Document{}

//Mongoose用のModel定義に使用
export interface IPlayer{
    name:string,
    url:string,
    // belong:[{teamName:string,belongStart:Date,belongEnd:Date}]   
    belong:{teamName:string,belongStart:Date,belongEnd:Date}[]
}


export class PlayerQueryService implements IPlayerQueryService
{   
    //mongoose用のスキーマ定義
    public static PlayerSchema = new Schema({
        name:String,
        url:String,
        belong:[{teamName:String,belongStart:Date,belongEnd:Date}]
    });    

    //mongoose.modelを複数回呼び出すと、既に定義済みのためエラーとなるため、staticで保持する方式としている
    //TODO:staticを使用しない書き方を調べて変更する
    public static PlayerModel = mongoose.model<IPlayerMongooseModel>('players',PlayerQueryService.PlayerSchema);

    //コンストラクタ
    constructor(){}    

    private async  getDataAsModel(paramTeamName:string,paramYear:string ):Promise<IPlayerMongooseModel[]>{            
        
        //環境変数から接続文字列を取得
        const url = process.env.MONGODB_URI;
        if(url ==null){throw new Error('接続文字列が取得できませんでした。')}
        
        mongoose.connect(url, { useNewUrlParser: true }).catch(error => {console.log("connect error:" + error);throw error;});
        mongoose.connection.on('error', (error)=>{console.log("error after connect:" + error);throw error;} );

        const predicateDate = paramYear +"/06/01"; 

        //Promiss<T>を返すexec()を使用        
        const result = await PlayerQueryService.PlayerModel.find()
                                            .elemMatch("belong",{teamName: {$regex: `.*${paramTeamName}.*`}
                                                                , belongStart:{$lte:new Date(predicateDate)}
                                                                ,belongEnd:{$gte:new Date(predicateDate)} } )                                                                
                                            .exec();
        
        if(result == null){            
            const ret:IPlayerMongooseModel[] = {} as any; 
            return ret; 
        }
        
        return result; 
               
    }
    public async getDataBy(paramTeamName:string,paramYear:string ):Promise<IPlayer[]>{       
        const defaultValue : IPlayer[] = {} as any;

        //パラメータチェック
        if(paramYear.match(/^[12]\d{3}$/) ==null){return defaultValue;} //西暦にマッチしない場合
        if(paramTeamName.length >=100){return defaultValue;} //100文字以上の場合
        

        //mongodbのスキーマの形式で対象データを取得
        const records : IPlayer[] = await this.getDataAsModel(paramTeamName,paramYear);
        return records;
    }
}