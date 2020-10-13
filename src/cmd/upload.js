var inquirer = require("inquirer");
const spark = require("spark-md5");
var fs = require("fs");
var software = require("../model/Software");
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
            choices: [
                '系统软件',
                '直播软件'
            ]
        },
        {
            type: 'input',
            name: "appPath",
            message: "Enter the main program path",
            default: function (answer) {
                return answer.appType === '系统软件' ? 'C:\\Program Files\\YunYing\\YunYing.exe'
                    : 'C:\\Program Files\\yunying-desktop\\yunying-desktop.exe';
            }
        },
    ]).then(answer => {
        answer.appType = answer.appType === '系统软件' ? 1 : 0;
        console.log(answer);
        let data = fs.readFileSync(answer.filePath, "utf-8");
        let md5 = spark.hash(data);
        let stat = fs.statSync(answer.filePath);
        let size = stat.size;
        let name = answer.filePath.split('//').pop();
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
                resolve(res.data.data.id);
                let id = res.data.data.id;
                console.log(res);
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
                    console.log(res);
                })
            })
        }
        upload();

    })
}


module.exports = function () {
    return new Promise(handle);
}