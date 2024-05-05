//https://github.com/dry891/LogFormatter
//https://dry891.github.io/LogFormatter/
const elem_configActor = document.getElementById('areaTemplate_configActor');

window.onload = function() {
    // 「発言者別設定」欄の初期状態をセット
    const temp_configActor = elem_configActor.content.cloneNode(true);
    document.getElementById('configActors').appendChild(temp_configActor)
};

/*  ----------------------------------------------------------------------------
    １．ファイル選択時の処理
----------------------------------------------------------------------------　*/
const fileInput = document.querySelector("#fileUploader");
let chatlog = [];// チャットログ格納場所
fileInput.addEventListener('change',  async (event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    await readHTML(file);// HTMLファイルを読み込む
    readTitle(file);// タイトルをファイル名から取得
    chatlog = readChatlog();// チャットログを配列化
    const actorList = getActorList(chatlog);// 発言者とその色を取得し、idを付ける
    chatlog = appendActorId(actorList,chatlog); // ログ配列にidを付ける
    settingEditor(actorList) // 設定欄を表示
});

// ファイル読み込み処理
function readHTML(input){
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            let content = e.target.result;
            // ログ本文(<body>～</body>)を抽出し、見えない作業用スペース（areaWorkspace）に配置
            content = content.substring(content.indexOf("<body>")+6, content.indexOf("</body>")-7);
            document.getElementById("areaWorkspace").innerHTML = content;
            // 「変換＆ダウンロード」ボタンを有効化
            document.getElementById("btnConvert").removeAttribute("disabled");
            document.getElementById('checkColorSet').checked && document.getElementById("configActors").removeAttribute("disabled");
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
    let logs = [];
    Array.from(p_elements).forEach(function(p_element){
        logs.push({
            colorCode : p_element.outerHTML.match(/#([\da-fA-F]{6}|[\da-fA-F]{3)/)[0],//RGBで抜き出す場合はgetComputedStyle(p_element).color.match(/\d+/g)
            tab : p_element.children[0].innerText.substring(2,p_element.children[0].innerText.length-1),
            actor : p_element.children[1].innerText,
            message : p_element.children[2].innerText.slice(9,-7)
        });
    });
    return logs;
};

// 発言者とその色を取得し、idを付ける
function getActorList(input){
    let actorList = Array.from(new Set(input.map(e => e['actor'])));// actor一覧（重複無し）を取得
    let output = [];
    actorList.reduce((acc,act) => {
        output.push({
            id : "actorId_" + acc,
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
    input.forEach(value =>{
        let count = -~index.get(value)
        count ? count++ : count = 1;
        index.set(value,count);
        count >= countMax && (output = value,countMax = count);// 後から来た方を残す
    });
    return output
}

// 発言者idを付けたchatlogを返す
function appendActorId(actorList,log){
    return log.map(mes => {
        mes.actorId = actorList.find(v => v.actor === mes.actor).id
        return mes
    });
}

function settingEditor(input){
    let areaElement = document.getElementById('configActors');
    areaElement.removeChild(areaElement.lastElementChild);
    input.forEach(data => {
        let clone = elem_configActor.content.cloneNode(true);
        clone.querySelector(".configActor").setAttribute("id","configActor_" + data['id']);
        clone.querySelector(".inputActorName").setAttribute("value",data['actor']);
        clone.querySelector(".inputActorName").setAttribute("placeholder",data['actor']);
        clone.querySelector(".inputActorColor").setAttribute("value",data['colorCode']);
        clone.querySelector(".inputActorColor").setAttribute("placeholder",data['colorCode']);
        clone.querySelector(".inputColorPicker").setAttribute("value",data['colorCode']);
        document.getElementById('configActors').appendChild(clone);
    },0)
}

/*  ----------------------------------------------------------------------------
    ２．エディタ操作時の処理
----------------------------------------------------------------------------　*/
/*document.querySelector('#checkColorSet').addEventListener('change', async (e) => {
    if(document.getElementById('checkColorSet').checked && !document.getElementById('btnConvert').disabled){
        document.getElementById("configActors").removeAttribute("disabled")
    }else{
        document.getElementById("configActors").setAttribute("disabled",true)
    }
});*/

// 色変更時
function colorChange(element){
    let value = element.value;
    element.parentElement.children[0].value = value;
    element.parentElement.children[1].value = value;
};

/*  ----------------------------------------------------------------------------
    ３．出力
----------------------------------------------------------------------------　*/
document.querySelector('#btnConvert').addEventListener('click', async (e) => {
    const title = document.getElementById("titleName").value;
    const settedActorList = readActorList();
    const templates = await loadTemplates();
    const chat = makeChat(chatlog,templates.posts);
    const style = templates.style + makeActorStyle(settedActorList,templates.actstyle);
    const content = makeHTML(templates.all,title,chat,style);
    //const html = new DOMParser().parseFromString(content, "text/html");
    download(title + "_整形後",content);
});

function download(filename, content){
    const blob = new Blob([content], {type: 'text/html'}); // 文字列をblobに変換
    const anchor = document.createElement('a'); // アンカー要素を生成
    anchor.download = filename + '.html'; // ファイル名指定
    anchor.href = URL.createObjectURL(blob); // 仮のURL生成してhrefに入れる
    anchor.click(); // アンカー要素のクリックイベントを発火
    URL.revokeObjectURL(anchor.href); // メモリを解放
};

function readActorList(){
    const elems = document.getElementsByClassName("configActor")
    let output = []
    Array.from(elems).map(elem => {
        output.push({
            id : elem.id.substring(elem.id.indexOf("_")+1),
            actor : elem.querySelector(".inputActorName").value,
            colorCode : elem.querySelector(".inputActorColor").value
        });
    });
    return output
};

// テンプレートを取得
async function loadTemplates(){
    return {
        all : await fetch("./templates/template.html").then(r => r.text()),
        posts : await fetch("./templates/post.html").then(r => r.text()),
        style : await fetch("./templates/template.css").then(r => r.text()),
        actstyle : await fetch("./templates/actorclass.css").then(r => r.text())
    };
};

/* ---------- 出力内容の編集 ---------- */
function makeHTML(temp,title,chat,style){
    return temp.replace("{{title}}",title)
        .replace("{{chat}}",chat)
        .replace("{{style}}",style);
};

// 発言内容
function makeChat(log,temp){
    let output = ""
    const mode = document.getElementById('checkColorSet').checked
    log.forEach(p => {
        let c =""
        !mode && (c = 'style="color:'+ p.colorCode +'"');
        let text = temp.replace('{{tabclass}}',p.tab)
        .replace('{{actorclass}}',p.actorId)
        .replace('{{tabName}}',p.tab)
        .replace('{{actorName}}',p.actor)
        .replace('{{message}}',p.message)
        .replace('{{colorset}}',c);
        output = output + text
    });
    return output
};

function makeActorStyle(actors,temp){
    if(document.getElementById('checkColorSet').checked){
        let output = "\n"
        actors.forEach(actor => {
            output = output + temp.replace("actorclass",actor.id).replace("#888888",actor.colorCode)
        })
        return output
    }else{
        return ""
    }
};