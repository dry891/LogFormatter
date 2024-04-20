let arr = ["melon","apple","apple","pine","apple","melon","orange"]

const c = (x, i, v) => (x[i] ? x[i].add(v) : x[i] = new Set([v]), i);
/*
const result = arr.sort().reduce(
  function (x, v, i) { 
    //console.log("index "+i)
    //console.log(x)
    //console.log(v)
    return (this.set(v, c(x, (this.get(v) + 1 || 1), v)), x); 
  }.bind(new Map), []).pop();


console.log(result);

const res = arr.sort().reduce(
  function(x,v){
      return ((this.set(v, c(x, (this.get(v) + 1 || 1), v)),console.log(this)), x)
  }.bind(new Map),[])
console.log(res)
*/

console.log('------------test03--------------')
const test03 = arr.sort().reduce(function(x,v,i){
  console.log(x,v)
  console.log(this.get(v))
  console.log(x[this.get(v) + 1])
  this.set(v, c(x, (this.get(v) + 1 || 1), v))
  //console.log(this)
  return x
}.bind(new Map),[])
console.log(test03)

/*
https://camellia.hatenablog.jp/entry/2023/11/21/JavaScript_%E8%87%AA%E7%94%B1%E7%A0%94%E7%A9%B6_-_%E6%9C%80%E9%A0%BB%E5%80%A4%E3%82%92%E6%B1%82%E3%82%81%E3%82%8B%E3%82%B3%E3%83%BC%E3%83%89
cの意味
・(条件)? (trueの場合):(falseの場合)
⇒
if(x[i]){
  x[i].add[v]
}else{
  x[i] = new Set(v)
}
の操作を行った後、iを戻り値とする。

this.setのthis ⇒　bind(new Map)で初期化されたMap
this.get(v)のthis ⇒　↑
this.get(v) + 1 || 1
⇒　||　論理和（OR)　条件分岐の省略として、左側がTrueなら左、違うなら右を返す
falseとなるのは下記７つ
・0
・-0
・null
・false
・NaN
・undefined
・空文字列 ("")

pop() メソッドは、配列から最後の要素を取り除き、その要素を返します。このメソッドは配列の長さを変化させます。
配列.pop() ⇒　配列の最後の要素
配列.pop()した後の配列　⇒　1個短くなった配列

const result = arr.reduce(function (x, v) { return (this.set(v, c(x, (this.get(v) + 1 || 1), v)), x); }.bind(new Map), []).pop();
*/