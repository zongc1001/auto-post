let a  = {
    a: 1, b: 2, c :3 , d: {
        a:1, b:2
    }
}

Object.assign(a, {
    d: {
        b: 0
    }
})
let b = Object.assign(a);
b.a = 2;
console.log(a);