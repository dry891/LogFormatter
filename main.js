/*  ----------------------------------------------------------------------------
    0．ページを開いたときの処理
----------------------------------------------------------------------------　*/
//https://dry891.github.io/LogFormatter/
test()
function test(){
    fetch('https://dry891.github.io/LogFormatter/templates/editor.html')
        .then(response => response.text())
        .then(data => {
            const parser = new DOMParser();
            const html = parser.parseFromString(data, "text/html");
            const boxs = html.querySelectorAll('#id_configActor');
            const file_area = document.getElementById('area_counfigActor');
            console.log(html)
            for(var box of boxs) {file_area.appendChild(box);}
        })
}


/*  ----------------------------------------------------------------------------
    １．ファイル選択時の処理
----------------------------------------------------------------------------　*/
const fileInput = document.querySelector("#fileUploader");
fileInput.addEventListener('change',  async (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    await readHTML(file);// HTMLファイルを読み込む
    readTitle(file);// タイトルをファイル名から取得
    const  chatlog = readChatlog();// チャットログを配列化
    const actorList = getActorList(chatlog);// 発言者とその色を取得し、idを付ける
    console.log(actorList)
    createConfigActor(actorList)
});

// ファイル読み込み処理
function readHTML(input){
    console.log('readHTML')
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            // ログ本文(<body>～</body>)を抽出し、見えない作業用スペース（areaWorkspace）に配置
            content = content.substring(content.indexOf("<body>")+6, content.indexOf("</body>")-7);
            document.getElementById("areaWorkspace").innerHTML = content;
            // 「変換＆ダウンロード」ボタンを有効化
            document.getElementById("btnConvert").removeAttribute("disabled");
            document.getElementById("configFieldActors").removeAttribute("disabled");
            // 返すresultを用意
            resolve(e.currentTarget.result);
        };
        reader.readAsText(input);// ファイル読込を実行
    });
}

// タイトルをファイル名から取得（[all]以下は削除する）
function readTitle(input){
    console.log('readTitle')
    let title = input.name.substring(0, input.name.indexOf(".html"));
    if (title.indexOf("[all]") >= 0) {
        title = title.substring(0, title.lastIndexOf("[all]"));
    };
    document.getElementById("titleName").value = title;
    return title
}

// チャットログを配列化
function readChatlog(){
    console.log('readChatlog')
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
    console.log('getActorColor')
    let actorList = Array.from(new Set(input.map(e => e['actor'])));// actor一覧（重複無し）を取得
    let output = {}
    actorList.reduce((acc,act) => {
        console.log(acc)
        output['actorId-'+acc] = {
            actor : act,
            colorCode : mode(input.filter(e => e['actor'] === act).map(e => e['colorCode']))
        }
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

function createConfigActor(input){
    const cloneConfingActor = templateCongigActor.content.cloneNode(true);
    console.log(cloneConfingActor)
    let a = cloneConfingActor.children[0].children[0]
    console.log(a)
    document.getElementById('area_counfigActor').appendChild(cloneConfingActor)
}