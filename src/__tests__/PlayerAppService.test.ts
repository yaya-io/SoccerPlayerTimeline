import { PlayerFakeMemory } from "../models/queryServices/PlayerFakeMemory";
import { IPlayer, PlayerQueryService } from "../models/queryServices/PlayerQueryService";
import { PlayerAppService } from "../applicationServices/PlayerAppService";

//PlayerAppServiceのテスト

test('PlayerAppServiceのテストシナリオ_検索マッチ',async () =>{
    
    let dataList :Array<IPlayer> =[
        { name: "選手A", url: "https://ja.wikipedia.org/", belong: [{ teamName: "鹿島アントラーズ", belongStart: new Date("2000/02/01"), belongEnd: new Date("2010/05/01")},
                                            { teamName: "クラブABC", belongStart: new Date("2011/01/01"), belongEnd: new Date("2018/01/01")}
    ]}        
    ];
    let fakeQueryService = new PlayerFakeMemory(dataList);
    let queryService = new PlayerAppService(fakeQueryService);
    let retVisObj = await queryService.getVisObjectBy("鹿島アントラーズ","2001");
    
    //件数チェック
    expect(retVisObj.items.length).toBe(2);
    expect(retVisObj.groups.length).toBe(1);

    //itemチェック
    expect(retVisObj.items[0].id).toBe("0");
    expect(retVisObj.items[0].group).toBe("選手A");
    expect(retVisObj.items[0].start).toBe("2000-2-1");
    expect(retVisObj.items[0].end).toBe("2010-5-1");
    expect(retVisObj.items[0].className).toBe("kashima");

    expect(retVisObj.items[1].className).toBe("default");

    //groupチェック
    expect(retVisObj.groups[0].id).toBe("選手A");
    expect(retVisObj.groups[0].content).toBe("<a href='https://ja.wikipedia.org/' target='_blank'> 選手A </a>");
    
});
