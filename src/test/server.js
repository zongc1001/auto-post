const http = require("http");

let resData = JSON.stringify({
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
http.createServer((req, res) => {
    let data = [];
    req.on("data", chunk => {
        data.push(chunk);
        console.log(chunk);
    });
    req.on("end", () => {
        let t = JSON.parse(data);
        console.log("parse data", t);
    })
    // console.log(`response http version: ${res}`)
    res.setHeader("Content-Length", Buffer.byteLength(resData));
    res.setHeader("Content-Type", "application/json");

    res.write(resData);
    res.end();

}).listen(3000);