// const path = require("path");
const http = require("http");
const { parse } = require("path");

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
    let url = util.getUrl(config);
    if(!url) {
        url = `${this.baseUrl}${config.path}`;
    }
    return new Promise(function (resolve, reject) {
        let postData = [];
        Object.keys(config.data).forEach(x => {
            postData.push(Buffer.from(x, "utf-8"));
        });
        let req = http.request(config, (res) => {
            console.log("res: ", res);
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
                        const parsedData = JSON.parse(rawData);
                        console.log("parsedData", parsedData);
                        resolve(parsedData);
                    } catch (error) {
                        reject(error);
                    }
                })
                res.on("close", () => {
                    console.log("底层连接已经关闭");
                })
            }
        })
        req.on("error", (e) => {
            console.log(`请求遇到问题${e}`)
        });
        req.write(JSON.stringify(config.data));
        req.end();
    })
}

/**
 * 
 * @param {Function} handler 
 */
Zxios.prototype.requestUse = function(handler) {
    try {
        if(handler instanceof Function) {
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
        if(handler instanceof Function) {
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
