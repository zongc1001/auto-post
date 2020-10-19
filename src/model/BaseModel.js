const Zxios = require("../zxios/zxios");
const fs = require("fs");
const protocol = "http:",
    hostname = "localhost",
    port = 8080;

const zxios = new Zxios({
    protocol,
    hostname,
    port
});

const USER_HOME = process.env.HOME || process.env.USERPROFILE;


/**
 * 
 * @param {ZxiosOption} config 
 * @return {ZxiosOption}
 */
let addAuth = function (config) {
    try {
        const data = fs.readFileSync(`${USER_HOME}/.zxiosconfig`, "utf-8");
        if(config.headers) {
            config.headers.Authorization = data;
        } else {
            config.headers = {
                Authorization: data
            }
        } 
    } catch (error) {
        console.log("没有已存在的登陆信息");
    }
    return config;
}


zxios.requestUse(addAuth);

class BaseModel {

    get(config) {
        Object.assign(config, { method: "GET" });
        return zxios.request(config);
    }
    /**
     * 
     * @param {ZxiosOption} config 
     * @return {Promise} 
     */
    post(config) {
        //添加post方法的默认配置
        Object.assign(config, { method: "POST" });
        return zxios.request(config);
    }
}

module.exports = BaseModel;