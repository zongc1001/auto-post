const software = require("../model/Software");

let config = {
    data: {
        "fileId": 143,
        "appVersion": "1.1.1233",
        "appName": "fala",
        "appType": 1,
        "appPath": "C:\\Program Files\\YunYing\\YunYing.exe"
    }
}



software.save(config).then(res => console.log(res));