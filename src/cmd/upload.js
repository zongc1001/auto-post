var inquirer = require("inquirer");
const spark = require("spark-md5");
var fs = require("fs");
var software = require("../model/Software");

let table = {
    appType: {
        '系统软件':1,
        '直播软件':2,
        '课中软件':3,
    },
    appPath: {
        '系统软件': 'C:\\Program Files\\YunYing\\YunYing.exe',
        '直播软件': 'C:\\Program Files\\yunying-desktop\\yunying-desktop.exe',
        '课中软件': 'C:\\Program Files\\tengyue\\tengyue.exe',
    }
}

function fileExist(value) {
    let stat = fs.statSync(value);
    if (stat) return true;

}

/**
 * 
 * @param {string} value 
 */
function isVersionNum(value) {
    if (/^\d+\.\d+\.\d+$/.test(value)) {
        return true;
    } else {
        return "格式应类似于： 12.23.456"
    }
}

function handle(resolve, reject) {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the path of file to be upload:",
            name: 'filePath',
            validate: fileExist
        },
        {
            type: 'input',
            message: "Enter the package version:",
            name: 'appVersion',
            validate: isVersionNum
        },
        {
            type: 'input',
            message: "Enter the package name:",
            name: "appName",
        },
        {
            type: 'list',
            name: "appType",
            message: "What's the package type?",
            choices: Object.keys(table.appType)
        },
        {
            type: 'input',
            name: "appPath",
            message: "Enter the main program path",
            default: function (answer) {
                return table.appPath[answer.appType];
            }
        },
    ]).then(answer => {
        answer.appType = table.appType[answer.appType];
        // console.log(answer);
        let data = fs.readFileSync(answer.filePath, "utf-8");
        let md5 = spark.hash(data);
        let stat = fs.statSync(answer.filePath);
        let size = stat.size;
        let name = answer.filePath.split('/').pop();
        function upload() {
            let config = {
                data: {
                    // chunk,
                    // chunks,
                    chunk: 0,
                    chunks: 1,
                    size,
                    md5,
                    name,
                    // file: data.slice(chunk * chunkSize, Math.min(size, chunk * chunkSize + chunkSize))
                    file: data
                }
            };
            software.upload(
                config
            ).then(res => {
                // console.log("config", config);
                // console.log("res",res);
                let id = res.data.data.id;
                // console.log(res);
                let param = {
                    data: {
                        fileId: id,
                        appName: answer.appName,
                        appType: answer.appType,
                        appVersion: answer.appVersion,
                        appPath: answer.appPath,
                    }
                }
                software.save(
                    param
                ).then(res => {
                    resolve(res);
                })
            })
        }
        upload();

    })
}


module.exports = function () {
    return new Promise(handle);
}