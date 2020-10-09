const Zxios = require("./../zxios/zxios.js");

let zxios = new Zxios();

let postData = {
    "msg": "hello world",
    "age": 100
}

let jsonPostData = JSON.stringify(postData);

zxios.request(
    {
        port: 3000,
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength( jsonPostData)
        },
        data: postData,
    }
).then((res) => console.log(res))
    .catch((err) => console.error(err));
