const http = require("http");


const postData = JSON.stringify({
    id: 1,
    time: 123,
    number: 10.2,
    obj: {
        name: "zc",
        func: function (a, b) {
            return a + b;
        },
        add: 2
    }
});
const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
    },
    data: postData
};

const req = http.request(options, (res) => {
    console.log(`http版本: ${res.httpVersion}`);
    console.log(`状态码: ${res.statusCode}`);
    console.log(`响应头: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`响应主体: ${chunk}`);
    });
    res.on('end', () => {
        console.log('响应中已无数据');
    });
    res.on("close", () => {
        console.log("底层连接已经关闭");
    })
});

console.log(http.METHODS);
req.on('error', (e) => {
    console.error(`请求遇到问题: ${e.stack}`);
});
// 将数据写入请求主体。
req.write(postData);
req.end();