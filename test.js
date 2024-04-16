let arr = ["apple","apple","pine","pine","apple","melon","orange"]

const c = (x, i, v) => (x[i] ? x[i].add(v) : x[i] = new Set(v), i);
const result = arr.reduce(
  function (x, v, i) { 
    console.log("index "+i)
    console.log(x)
    console.log(v)
    return (this.set(v, c(x, (this.get(v) + 1 || 1), v)), x); 
  }.bind(new Map), []).pop();


console.log(result);