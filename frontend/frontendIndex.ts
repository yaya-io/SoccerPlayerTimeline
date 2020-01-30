import Swal from "sweetalert2";
import * as vis from "vis";


//例外処理のハンドリング
window.onerror = function (errorMsg) {
    alert("エラーが発生しました。" + errorMsg);
    return false;
}
//Promiseのエラーはunhandledrejectionで補足
window.addEventListener('unhandledrejection', function (event) { alert("エラーが発生しました。" + event.reason); }
);


//loadイベント
window.addEventListener('load', function () {

    const btnSearch: HTMLInputElement | null = document.querySelector<HTMLInputElement>('button[name="btnSearch"]');
    if (btnSearch == null) { throw new Error("Elementが存在しません。"); }

    btnSearch.addEventListener('click', function (e) {
        const paramYear: string = document.querySelector<HTMLInputElement>('input[name="txtYear"]')?.value ?? "";
        const paramTeamName: string = document.querySelector<HTMLInputElement>('input[name="txtTeamName"]')?.value ?? "";

        if (paramYear == "" || paramTeamName == "") {
            searchWithPopup();
        } else {
            search(paramYear, paramTeamName);
        }
        this.blur(); //ボタンのフォーカスを外す
    });

    //初期表示時は選択ダイアログを表示
    searchWithPopup();
});



//Sweet Alertのポップウィンドウを表示
function searchWithPopup(): void {

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

        if (result?.value) {
            const resultList: string[] = result.value;
            const txtTeamName: HTMLInputElement | null = document.querySelector<HTMLInputElement>('input[name="txtTeamName"]');
            const txtYear: HTMLInputElement | null = document.querySelector<HTMLInputElement>('input[name="txtYear"]');
            if (txtYear == null || txtTeamName == null) { throw new Error("Elementが存在しません。"); }

            txtTeamName.value = resultList[0];
            txtYear.value = resultList[1];
            search(txtYear.value, txtTeamName.value);
        }
    })();
}

//fetchのhelper
async function fetcher(request: RequestInfo, init: RequestInit): Promise<any> {
    const response = await fetch(request, init);

    if (!response.ok) { throw new Error(response.statusText); }

    const body = await response.json();
    return body;
}


//検索処理を行いTimelineにオブジェクトを設定する
function search(paramYear: string, paramTeamName: string): void {
    if (paramYear.trim() == "" || paramTeamName.trim() == "") {
        return;
    }

    (async () => {

        document.querySelector('.loading')?.classList.remove('hide');

        try {
            const response = await fetcher('./players',
                {
                    method: 'POST',
                    body: JSON.stringify({ "targetYear": paramYear, "targetTeamName": paramTeamName }),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                });

            const dataCount: number = response?.items?.length ?? 0;
            if (dataCount == 0) {
                Swal.fire({ title: '検索結果がありません。', icon: "info" });
                return;
            }
            setVisObjects(paramYear, response);
        } finally {
            document.querySelector('.loading')?.classList.add('hide');
        }
    })();

}

//引数のデータを元にtimelineを描画する
function setVisObjects(paramYear: string, data: any): void {
    const container: HTMLElement | null = document.getElementById("visualization");
    if (container == null) { throw new Error("Elementが存在しません。"); }

    //Timelineの描画-destory後newする
    if (timeline != null) {
        timeline.destroy();
    }

    visItems = new vis.DataSet(data.items);
    visGroups = new vis.DataSet(data.groups);
    let visOptions: vis.TimelineOptions = {
        verticalScroll: true,
        orientation: { axis: "top" }, //時間軸の表示位置 top or bottom or both
        timeAxis: { scale: "year", step: 1 }, //時間軸のスケールを1年単位表示
        zoomable: false,
    };
    //timeline生成
    timeline = new vis.Timeline(container, visItems, visGroups, visOptions);

    //検索年の軸を表示    
    timeline.setCurrentTime(new Date(paramYear + "/06/01"));

    //イベントハンドラ設定    
    timeline.on('click', function (properties) {
        if (properties.item == null) {
            return;
        }

        const selectedDate: Date = properties.time;
        const tempItem: string = properties.item;  //選択されたオブジェクトのID    
        const selectedItem: vis.DataItem = visItems.get(tempItem)!;
        const year = selectedDate.getFullYear().toString();
        const contentHtml = selectedItem.content;
        const matchArray = contentHtml.match(/<span>(.*)<\/span>/);
        let teamName: string = "";
        if (matchArray != null) { teamName = matchArray[1]; }

        (async () => {
            const ret = await Swal.fire({
                title: `${year}年 ${teamName}`,
                text: 'を表示しますか？',
                showCancelButton: true
            });

            if (ret.value != null) {
                const txtYear: HTMLInputElement | null = document.querySelector<HTMLInputElement>('input[name="txtYear"]');
                const txtTeamName: HTMLInputElement | null = document.querySelector<HTMLInputElement>('input[name="txtTeamName"]');
                if (txtYear == null || txtTeamName == null) { throw new Error("Elementが存在しません。"); }

                txtYear.value = year;
                txtTeamName.value = teamName;
                search(year, teamName);
            }
        })();        
    });
}

//グローバル保持
let timeline: vis.Timeline;
let visItems: vis.DataSet<vis.DataItem>;
let visGroups: vis.DataSet<vis.DataGroup>;