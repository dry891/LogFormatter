//https://dry891.github.io/LogFormatter/

// 「発言者別設定」欄の初期状態をセット
const elem_configActor = document.getElementById('areaTemplate_configActor')
const temp_configActor = elem_configActor.content.cloneNode(true);
document.getElementById('configActors').appendChild(temp_configActor)
/*
fetch("./templates/editor.html").then(r => r.text()).then(r => {
    const text = r.replace('$test','GM')
    const fullhtml = new DOMParser().parseFromString(text, "text/html");
    const html = fullhtml.querySelector("#id_configActor")
    console.log(html)
    document.getElementById('configActors').appendChild(html)
})
*/
/*  ----------------------------------------------------------------------------
    １．ファイル選択時の処理
----------------------------------------------------------------------------　*/
const fileInput = document.querySelector("#fileUploader");
fileInput.addEventListener('change',  async (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    await readHTML(file);// HTMLファイルを読み込む
    readTitle(file);// タイトルをファイル名から取得
    const chatlog = readChatlog();// チャットログを配列化
    const actorList = getActorList(chatlog);// 発言者とその色を取得し、idを付ける
    settingEditor(actorList) // 設定欄を表示
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
            document.getElementById("configActors").removeAttribute("disabled");
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
    let logs = new Array;
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

// 発言者とその色を取得し、idを付ける
function getActorList(input){
    let actorList = Array.from(new Set(input.map(e => e['actor'])));// actor一覧（重複無し）を取得
    let output = new Array;
    actorList.reduce((acc,act) => {
        output.push({
            number : acc,
            actor : act,
            colorCode : mode(input.filter(e => e['actor'] === act).map(e => e['colorCode']))
        })
        return acc+1
    },0);
    return output
}

// 最頻値を求める関数
function mode(input){
    let index = new Map
    let countMax = 0
    let output
    input.map(value =>{
        let count = index.get(value)
        count ? count++ : count = 1;
        index.set(value,count)
        count >= countMax ? (output = value,countMax = count) : null ;// 後から来た方を残す
        return value
    });
    return output
}

function settingEditor(input){
    let areaElement = document.getElementById('configActors')
    areaElement.removeChild(areaElement.lastElementChild);
    console.log(input)
    input.reduce((acc,data) => {
        let clone = elem_configActor.content.cloneNode(true);
        clone.querySelector(".inputActorName").setAttribute("value",data['actor'])
        clone.querySelector(".inputActorName").setAttribute("placeholder",data['actor'])
        clone.querySelector(".inputActorColor").setAttribute("value",data['colorCode'])
        clone.querySelector(".inputActorColor").setAttribute("placeholder",data['colorCode'])
        clone.querySelector(".inputColorPicker").setAttribute("value",data['colorCode'])
        document.getElementById('configActors').appendChild(clone)
    },0)
}

/*  ----------------------------------------------------------------------------
    ２．色設定変更時
----------------------------------------------------------------------------　*/
function colorChange(element){
    let value = element.value;
    element.parentElement.children[0].value = value;
    element.parentElement.children[1].value = value;
}

/*  ----------------------------------------------------------------------------
    ３．出力
----------------------------------------------------------------------------　*/
function convert(){
}