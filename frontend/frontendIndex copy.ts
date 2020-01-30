import * as vis from "vis";
import { stringLiteral } from "babel-types";
import Swal, { SweetAlertOptions } from "sweetalert2";

$(function(x){
 
    //console.info("start"); 

    //検索ボタンclick event
    $('button[name="btnSearch"]').click(function () {
        const paramDate = $('input[name="txtYear"]').val()!.toString();
        const paramTeamName = $('input[name="txtTeamName"]').val()!.toString();
        if(paramDate == "" || paramTeamName =="")
        {
            searchWithPopup();
        }
        else
        {
            search(paramDate, paramTeamName);
        }    
    });      
    
    //初期表示時は選択ダイアログを表示
    searchWithPopup();
});


//Sweet Alertのポップウィンドウを表示
function searchWithPopup ():void {
    
    (async () => {
        const result = await Swal.mixin({

            confirmButtonText: 'Next',
            showCancelButton: true,
            progressSteps: ['1', '2']
        }
        ).queue([
            {
                input: 'text',
                title: 'チーム名を入力/選択',
                inputAttributes: {
                    autocomplete: 'on',
                    list: 'datalist-teamName'
                }
            },
            {
                input: 'range',
                title: '年代を選択',
                inputAttributes: {
                    min: '2000',
                    max: '2020',
                    step: '1'
                },
                inputValue: '2019'
            }
        ]);

        if (result.value) {
            const teamName: string = result.value[0];
            const year: string = result.value[1];
            $('input[name="txtYear"]').val(year);
            $('input[name="txtTeamName"]').val(teamName);

            search(year, teamName);
        }
    })();
}


//検索処理を行いTimelineにオブジェクトを設定する
function search(paramYear:string,paramTeamName:string):void{
    if(paramYear.trim() == "" || paramTeamName.trim() ==""){
        return;
    }    
    
    $.ajax({
        url:'./players',
        type:'POST',
        data:{"targetYear":paramYear,"targetTeamName":paramTeamName},
        dataType:'json',
        beforeSend:function (){            
            $('.loading').removeClass('hide');
        }
    })
    .done( (data) =>{
        // console.log(data.items);       
        $('button[name="btnSearch"]').blur(); 
        $('.loading').addClass('hide');
        const temp :[] = data.items;
        if(temp ==null || temp.length == 0)
        {
            Swal.fire({title:'検索結果がありません。',icon:"info"});
            return;
        }        
        setVisObjects(paramYear,data);        
    })
    .fail( (data)=>{        
        alert("エラーが発生しました。");
    })
    .always((data) =>{        
    });
}

//引数のデータを元にtimelineを描画する
function setVisObjects(paramYear:string,data:any):void
{
    const container:HTMLElement | null = document.getElementById("visualization");
    if(container == null){throw new Error('timeline表示用の要素が存在しません。');}
    
    //Timelineの描画-destory後newする
    if(timeline != null)
    {
        timeline.destroy();
    }

    visItems = new vis.DataSet(data.items);
    visGroups = new vis.DataSet(data.groups);
    let visOptions:vis.TimelineOptions={
        verticalScroll:true,
        orientation:{axis:"top"}, //時間軸の表示位置 top or bottom or both
        timeAxis:{scale:"year",step:1}, //時間軸のスケールを1年単位表示
        zoomable:false,        
    };
    //timeline生成
    timeline = new vis.Timeline(container,visItems,visGroups,visOptions);
    
    //検索年の軸を表示    
    timeline.setCurrentTime(new Date(paramYear + "/06/01"));
     
    //イベントハンドラ設定    
    timeline.on('click', function (properties) {
        if (properties.item == null) {
            return;
        }
        if (properties.time != null) {
            const selectedDate: Date = properties.time;

            const tempItem: string = properties.item;  //選択されたオブジェクトのID    
            const selectedItem: vis.DataItem = visItems.get(tempItem)!;            
            const year = selectedDate.getFullYear().toString();
            const contentHtml = selectedItem.content;
            const matchArray = contentHtml.match(/<span>(.*)<\/span>/);
            let teamName: string = "";
            if (matchArray !== null) { teamName = matchArray[1]; }

            (async () => {
                const ret = await Swal.fire({
                    title: `${year}年 ${teamName}`,
                    text: 'を表示しますか？',
                    showCancelButton: true
                });

                if (ret.value) {
                    $('input[name="txtYear"]').val(year);
                    $('input[name="txtTeamName"]').val(teamName);
                    search(year, teamName);
                }
            })();            
        }    
  });
    
}

//グローバル保持
let timeline :vis.Timeline;
let visItems:vis.DataSet<vis.DataItem>;
let visGroups:vis.DataSet<vis.DataGroup>;