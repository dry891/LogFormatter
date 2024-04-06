
/*  ----------------------------------------------------------------------------
    １．ファイル選択時の一連の処理
----------------------------------------------------------------------------　*/
function readHTML(input) {

    const file = input.files[0];
    const reader = new FileReader();
    ACTOR_COLORS = {};

    //ファイル読込完了後の処理
    reader.onload = function (e) {
        // ファイル内容(HTMLタグすべて)を変数「content」に設定
        var content = e.target.result;

        // ログ本文(<body>～</body>)を抽出し、見えない作業用スペース（areaWorkspace）に配置
        content = content.substr(content.indexOf("<body>") + 6, content.indexOf("</body>") - 7);
        document.getElementById("areaWorkspace").innerHTML = content;

        // タイトルをファイル名から取得（[all]以下は削除する）
        var title = file.name.substr(0, file.name.indexOf(".html"));
        if (title.indexOf("[all]") >= 0) {
            document.getElementById("titleName").value = title.substr(0, title.lastIndexOf("[all]"));
        } else {
            document.getElementById("titleName").value = title;
        }

        //タグを整形
        formatTags();

        // 「ログ変換＆ダウンロード」ボタンを有効化
        document.getElementById("btnConvert").removeAttribute("disabled");
    };

    //  ファイル読込を実行
    //   このタイミングで(reader.onloadに定義したfunction(e)～を実行する)
    reader.readAsText(file);
}

//タグを整形
function formatTags(){
    // pタグを全て収集
    const p_elements = document.querySelectorAll('#areaWorkspace p');

    // 各pタグの中身に対する処理
    Array.from(p_elements).forEach(function(p_element){
        //カラーコードを抽出　RGBで抜き出す場合はgetComputedStyle(p_element).color
        var colorCode = p_element.outerHTML.match(/#([\da-fA-F]{6}|[\da-fA-F]{3)/)[0];
        
        
    });

}