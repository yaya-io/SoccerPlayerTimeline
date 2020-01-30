"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var vis = __importStar(require("vis"));
$(function (x) {
    //alert("start");
    console.info("start");
    //初期値設定
    $('input[name="txtDate"]').val('2015');
    $('input[name="txtTeamName"]').val('鹿島アントラーズ');
    //検索ボタンclick event
    $('button[name="btnSearch"]').click(function () {
        var paramDate = $('input[name="txtDate"]').val().toString();
        var paramTeamName = $('input[name="txtTeamName"]').val().toString();
        search(paramDate, paramTeamName);
    });
    //仮 オートコンプリート設定
    var nameList = document.createElement("datalist");
    nameList.id = "datalist-teamName";
    //TODO:取得処理作成
    var names = ["鹿島アントラーズ", "横浜F・マリノス"];
    names.forEach(function (x) {
        var op = document.createElement("option");
        op.value = x;
        nameList.appendChild(op);
    });
    document.body.appendChild(nameList);
    // $('input[name="txtTeamName"]').attr("list","datalist-Name");
    //初期検索
    // search();
    $('button[name="btnSearch"]').click();
});
function search(paramYear, paramTeamName) {
    if (paramYear.trim() == "" || paramTeamName.trim() == "") {
        return;
    }
    $(".messagediv").text("Loading... " + paramYear + ":" + paramTeamName);
    $.ajax({
        url: './users',
        type: 'POST',
        data: { "targetDate": paramYear, "targetTeamName": paramTeamName },
        dataType: 'json',
        beforeSend: function () {
            $('.loading').removeClass('hide');
        }
    })
        .done(function (data) {
        // console.log(data.items);
        $('.loading').addClass('hide');
        setVisObjects(paramYear, data);
    })
        .fail(function (data) {
        // console.log(data);
        alert("error!");
    })
        .always(function (data) {
    });
}
function setVisObjects(paramYear, data) {
    var container = document.getElementById("visualization");
    //Timelineの描画-UPDATE方式>>
    // if(visItems == null){
    //     visItems = new vis.DataSet(data.items);
    //     visGroups = new vis.DataSet(data.groups);
    //     let visOptions:vis.TimelineOptions={
    //         verticalScroll:true,
    //         orientation:{axis:"both"}
    //     };
    //     timeline = new vis.Timeline(container,visItems,visGroups,visOptions);
    // }else
    // {
    //     visItems.clear();
    //     visGroups.clear();
    //     visItems.add(data.items);
    //     visGroups.add(data.groups);
    //     timeline.redraw();
    // } 
    //Timelineの描画-UPDATE方式<<
    //Timelineの描画-destory方式（破棄してnew)>>
    if (timeline != null) {
        timeline.destroy();
    }
    visItems = new vis.DataSet(data.items);
    visGroups = new vis.DataSet(data.groups);
    var visOptions = {
        verticalScroll: true,
        orientation: { axis: "top" },
        timeAxis: { scale: "year", step: 1 },
        zoomable: false,
        // preferZoom:true, //documentに記載あるが、実際にない。
        maxHeight: $(window).height() - 110,
        onInitialDrawComplete: function () {
            // setTimeout(()=>{
            //     $(".vis-left.vis-panel.vis-vertical-scroll").scrollTop(0);
            // },500);
            $(".vis-left.vis-panel.vis-vertical-scroll").scrollTop(0); //見直し要
        }
    };
    //timeline生成
    timeline = new vis.Timeline(container, visItems, visGroups, visOptions);
    //Timelineの描画-destory方式（破棄してnew)<<
    // $(".vis-left.vis-panel.vis-vertical-scroll").scrollTop(200); //
    //検索年の軸を表示
    // timeline.setCustomTime(new Date("2010/05/01"));
    // timeline.addCustomTime(new Date( paramYear + "/06/01"));  //←青戦（ドラッグ移動可）
    timeline.setCurrentTime(new Date(paramYear + "/06/01"));
    //イベントハンドラ設定
    timeline.on('click', function (properties) {
        if (properties.item == null) {
            return;
        }
        if (properties.time != null) {
            var selectedDate = properties.time;
            // alert(items.get(properties.item)[0].content);
            // alert(date1.getFullYear());
            //   console.log(properties.item);
            //   console.log(items.get(properties.item,{returnType:"Object"}));
            //   console.log(items.get(properties.item,{fields:["content"]}));
            //   let clubName =items.get(properties.item,{fields:["content"]})[0];
            var tempItem = properties.item; //選択されたオブジェクトのID    
            var selectedItem = visItems.get(tempItem);
            //   alert(selectedItem.content + "　" + selectedDate.getFullYear().toString() + "年を表示！！");
            //再検索
            $('input[name="txtDate"]').val(selectedDate.getFullYear().toString());
            $('input[name="txtTeamName"]').val(selectedItem.content);
            $('button[name="btnSearch"]').click();
        }
        // console.log(properties);
    });
}
//グローバル保持
var timeline;
var visItems;
var visGroups;
//# sourceMappingURL=frontendIndex.js.map