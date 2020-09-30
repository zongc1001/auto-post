const Zxios = require("./../zxios/zxios.js");

let zxios = new Zxios();

let postData = JSON.stringify({
    "msg": "hello world",
    "age": 100
})

zxios.request(
    {
        port: 3000,
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(postData)
        },
        data: postData,
    }
).then((res) => console.log(res))
    .catch((err) => console.error(err));