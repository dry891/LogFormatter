/* 入力として受け取ったHTMLファイルの中身を取得 */
const getHTML = (file) => {
    return new Promise((resolve) => {
      let fr = new FileReader();
      fr.onload = (e) => {
        resolve(e.currentTarget.result);
      };
      fr.readAsText(file);
    });
  };

  document.getElementById("areaWorkspace").innerHTML = getHTML
  console.log(getHTML)