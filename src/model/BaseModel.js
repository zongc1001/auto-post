const Zxios = require("../zxios/zxios");
const protocol = "http:",
    hostname = "localhost",
    port = 8080;

const zxios = new Zxios({
    protocol,
    hostname,
    port
});

class BaseModel {

    get(config) {
        Object.assign(config, zxios.defaultConfig, { method: "GET" });
        return zxios.request(config);
    }
    /**
     * 
     * @param {ZxiosOption} config 
     * @return {Promise} 
     */
    post(config) {
        Object.assign(config, zxios.defaultConfig, { 'Content-Type' : 'multipart/form-data', "method": "POST" });
        let data = config.data;
        let formData = {};
        Object.keys(data).forEach(x => {
            formData[x];
        })
        return zxios.request(config);
    }
}

module.exports = BaseModel;