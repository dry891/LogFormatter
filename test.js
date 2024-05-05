const x = [
  {actor:"GM",id:0},
  {actor:"NPC",id:1},
  {actor:"PC",id:2}
]

let y = [
  {actor:"GM",message:"あいう"},
  {actor:"GM",message:"えお"},
  {actor:"NPC",message:"かきく"},
  {actor:"PC",message:"けこ"},
  {actor:"NPC",message:"さしす"}
]

y = y.map(value => {
  value.id = x.find(v => v.actor === value.actor).id
  return value
})

console.log(y)

/*
fetch("./templates/editor.html").then(r => r.text()).then(r => {
    const text = r.replace('$test','GM')
    const fullhtml = new DOMParser().parseFromString(text, "text/html");
    const html = fullhtml.querySelector("#id_configActor")
    console.log(html)
    document.getElementById('configActors').appendChild(html)
})
*/