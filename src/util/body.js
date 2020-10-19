/*
 * @Author: zongchen 
 * @Date: 2020-10-19 10:16:46 
 * @Last Modified by: zongchen
 * @Last Modified time: 2020-10-19 10:51:11
 */

let strategies = {
    /**
     * const，处理application/json，将data转换为json字符串后返回
     * @param {ZxiosOption} config 
     * @return {string}
     */
    "application/json": function (config) {
        return JSON.stringify(config.data);
    },
    /**
     * 
     * @param {ZxiosOption} config 
     */
    "multipart/form-data": function (config) {
        const boundaryKey = Math.random().toString(16).slice(2);
        config.headers["Content-Type"] = config.headers["Content-Type"] + `; boundary=${boundaryKey}`;
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
        temp += '--' + boundaryKey + '--' + '\r\n';
        return temp;
    },
};
/**
 * 
 * @param {ZxiosOption} config 
 */
module.exports =  function (config) {
    if(config.headers == undefined || config.headers["Content-Type"] == undefined) {
        return "";
    } else if(config.headers["Content-Type"] === "application/json"){
        return strategies["application/json"](config);
    } else {
        return strategies[config.headers["Content-Type"]](config);
    }
}

