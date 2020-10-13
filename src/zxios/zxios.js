// const path = require("path");
const http = require("http");
const { parse } = require("path");
const fs = require("fs");

let util = require("./../util/util.js");
/**
 * 
 * @param {ZxiosOption} defaultConfig 
 */
function Zxios(defaultConfig) {
    this.requestUseQue = [];
    this.respondUseQue = [];
    this.defaultConfig = defaultConfig || {};
}
/**
 * @param {ZxiosOption} config 
 * @return {Promise} 
*/
Zxios.prototype.request = function (config) {
    this.requestUseQue.forEach(x => {
        x(config);
    });
    return new Promise((resolve, reject) => {
        config = Object.assign(JSON.parse(JSON.stringify(this.defaultConfig)), config);
        const boundaryKey = Math.random().toString(16).slice(2);
        if (config.headers !== undefined) {
            if (/^multipart\/form-data/.test(config.headers["Content-Type"])) {
                config.headers["Content-Type"] = config.headers["Content-Type"].concat(
                    `; boundary=${boundaryKey}`);
            }
        }
        // console.log("最终的请求头：", config.headers);
        let req = http.request(config, (res) => {
            const contentType = res.headers["content-type"];
            const { statusCode } = res;
            let error;
            if (statusCode !== 200) {
                error = new Error(
                    `request fail \n statuCode: ${statusCode}`
                );
            } else if (!/^application\/json/.test(contentType)) {
                error = new Error(
                    `expected application/json, but recevied ${contentType}`
                );
            }
            if (error) {
                res.resume();
                reject(error);
            } else {
                res.setEncoding("utf-8");
                let rawData = [];


                res.on("data", chunk => { rawData.push(chunk); });
                res.on("end", () => {
                    try {
                        // console.log(rawData);
                        const parsedData = JSON.parse(rawData);
                        // console.log("parsedData", parsedData);
                        resolve({
                            headers: res.headers,
                            data: parsedData
                        });
                    } catch (error) {
                        reject(error);
                    }
                })
                // res.on("close", () => {
                    // console.log("底层连接已经关闭");
                // })
            }
        })


        if (config.headers !== undefined &&
            /^multipart\/form-data/.test(config.headers["Content-Type"])) {
            let temp = "";
            Object.keys(config.data).forEach(x => {
                let t;
                if (x === "file") {
                    t = `--${boundaryKey}\r\n` +
                        `Content-Disposition: form-data; name="${x}"; filename="blob"\r\n` +
                        `Content-Type: application/octet-stream\r\n\r\n` +
                        `${config.data[x]}\r\n`;
                } else {
                    t = `--${boundaryKey}\r\n` +
                        `Content-Disposition: form-data; name="${x}";\r\n\r\n` +
                        `${config.data[x]}\r\n`;
                }

                temp += t;
            })
            req.write(temp);
            req.end('--' + boundaryKey + '--' + '\r\n');

        } else {
            if(config.data) {
                req.write(JSON.stringify(config.data));
            } else {
                req.write("");
            }
            req.end();

        }


        req.on("error", (e) => {
            console.log(`请求遇到问题${e}`)
        });



    })
}

/**
 * 
 * @param {Function} handler 
 */
Zxios.prototype.requestUse = function (handler) {
    try {
        if (handler instanceof Function) {
            this.requestUseQue.push(handler);
        } else {
            throw new Error(`handler is not a function`);
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * 
 * @param {Function} handler 
 */
Zxios.prototype.respondUse = function (handler) {
    try {
        if (handler instanceof Function) {
            this.respondUseQue.push(handler);
        } else {
            throw new Error(`handler is not a function`);
        }
    } catch (error) {
        console.error(error);
    }
}

/**
 * 柯里化功能引入的测试
 * 结果: 函数原型中加入了curry方法
 */
// let add = function (a, b) {
//     return a + b;
// }
// let add1 = add.curry(1);
// console.log(add1(6));   //7

module.exports = Zxios;
