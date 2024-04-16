/*  ----------------------------------------------------------------------------
    １．ファイル選択時の処理
----------------------------------------------------------------------------　*/
const fileInput = document.querySelector("#fileUploader");
fileInput.addEventListener('change',  async (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    await readHTML(file);// HTMLファイルを読み込む
    readTitle(file);// タイトルをファイル名から取得
    chatlog = readChatlog();// チャットログを配列化
    getActorColor(chatlog);
});

// ファイル読み込み処理
function readHTML(input){
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            // ログ本文(<body>～</body>)を抽出し、見えない作業用スペース（areaWorkspace）に配置
            content = content.substring(content.indexOf("<body>")+6, content.indexOf("</body>")-7);
            document.getElementById("areaWorkspace").innerHTML = content;
            // 「変換＆ダウンロード」ボタンを有効化
            document.getElementById("btnConvert").removeAttribute("disabled");
            // 返すresultを用意
            resolve(e.currentTarget.result);
        };
        reader.readAsText(input);// ファイル読込を実行
    });
}

// タイトルをファイル名から取得（[all]以下は削除する）
function readTitle(input){
    let title = input.name.substring(0, input.name.indexOf(".html"));
    if (title.indexOf("[all]") >= 0) {
        title = title.substring(0, title.lastIndexOf("[all]"));
    };
    document.getElementById("titleName").value = title;
    return title
}

// チャットログを配列化
function readChatlog(){
    const p_elements = document.querySelectorAll('#areaWorkspace p');
    let logs = new Array();
    Array.from(p_elements).forEach(function(p_element){
        logs.push({
            colorCode : p_element.outerHTML.match(/#([\da-fA-F]{6}|[\da-fA-F]{3)/)[0],//RGBで抜き出す場合はgetComputedStyle(p_element).color.match(/\d+/g)
            tab : p_element.children[0].innerText.substring(1,p_element.children[0].innerText.length-1),
            actor : p_element.children[1].innerText,
            message : p_element.children[2].innerText
        });
    });
    return logs;
};

// 発言者毎の色を取得する
function getActorColor(input){
    let actorList = input.map(e => e['actor']);// actor一覧を取得
    actorList = Array.from(new Set(actorList));// 重複削除
    actorList.forEach((act) => {
        let colorList = input.filter(e => e['actor'] === act).map(e => e['colorCode']);
        console.log('-----')
        console.log(colorList)
    })
}

// 最頻値を求める関数
function mode(input){

    return output = input.sort().reduce((accumulator, currentValue, i, arr) => {
        console.log(accumulator, currentValue, i, arr)
        return currentValue
    });
}
