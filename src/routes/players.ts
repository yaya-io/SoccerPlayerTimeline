
import { Router } from "express";
import { Factories } from "../models/queryServices/Factories";
import { promises } from "fs";
import { PlayerAppService } from "../applicationServices/PlayerAppService";

export const router = Router();

//http GET 定義
router.get("/", (req, res, next) =>   
    res.status(400).json('Bad Request')
);

//http POST定義
router.post("/", (req, res, next) => {
    (async () => {
        const paramYear: string = req.body.targetYear;
        const paramTeamName: string = req.body.targetTeamName;

        if (paramYear == "" || paramTeamName == "") {
            return res.json({ items: "", groups: "" }); //いずれか一方でも値無しの場合、空のオブジェクトを返す
        }

        //非同期メソッド(Promiseを返す)があり、awaitしているのでトップレベルのここでasync無名関数として実行

        const playerQueryService = Factories.CreatePlayerQueryService();       

        const playerAppService = new PlayerAppService(playerQueryService);

        const playerVisObject = await playerAppService.getVisObjectBy(paramTeamName,paramYear);
        
        return res.json({ items: playerVisObject.items, groups: playerVisObject.groups });
        
    })().catch(next);
    
}

);

