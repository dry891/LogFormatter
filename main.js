/*  ----------------------------------------------------------------------------
    １．ファイル選択時の処理
----------------------------------------------------------------------------　*/
const fileInput = document.querySelector("#fileUploader");

// ファイル読み込み処理
const readHTML = (f) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function (e) {
            var content = e.target.result;
            // ログ本文(<body>～</body>)を抽出し、見えない作業用スペース（areaWorkspace）に配置
            content = content.substring(content.indexOf("<body>")+6, content.indexOf("</body>")-7);
            document.getElementById("areaWorkspace").innerHTML = content;
            // 「ログ変換＆ダウンロード」ボタンを有効化
            document.getElementById("btnConvert").removeAttribute("disabled");
        };
        reader.readAsText(f);// ファイル読込を実行
    });
}

// タイトルをファイル名から取得（[all]以下は削除する）
const readTitle = (file) => {
    let title = file.name.substring(0, file.name.indexOf(".html"));
    if (title.indexOf("[all]") >= 0) {
        document.getElementById("titleName").value = title.substring(0, title.lastIndexOf("[all]"));
    } else {
        document.getElementById("titleName").value = title;
    }
    return title
}

// ログを配列にする
const readChatlog = () => {
    const p_elements = document.querySelectorAll('#areaWorkspace p');
    let logs = new Array();
    Array.from(p_elements).forEach(function(p_element){
        logs.push({
            tab : p_element.children[0].innerText.substring(1,p_element.children[0].innerText.length-1),
            actor : p_element.children[1].innerText,
            message : p_element.children[2].innerText,
            colorCode : p_element.outerHTML.match(/#([\da-fA-F]{6}|[\da-fA-F]{3)/)[0]//RGBで抜き出す場合はgetComputedStyle(p_element).color.match(/\d+/g)
        });
    });
    return logs;
};

fileInput.addEventListener('change',  async(event) => {
    const file = event.currentTarget.files[0];
    if (!file) return;
    
    //const x = await inputHTML(file);
    console.log(readHTML(file))
});

