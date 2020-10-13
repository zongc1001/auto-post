var inquirer = require("inquirer");
const spark = require("spark-md5");
var fs = require("fs");
var software = require("../model/Software");

let table = {
    updateType: {
        '正式更新': 1,
        '灰度更新': 2,
        '回滚更新': 3
    }
}

let allDeviceList = [];
let allPackageList = [];
software
    .getUpdateList({})
    .then(res => {
        allPackageList = res.data.data.list;
        return software.getSchoolDeviceList({});
    })
    .then(res => {
        allDeviceList = res;
        return inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the update name:',
                name: "name",
            },
            {
                type: 'rawlist',
                message: "What's the package id?",
                name: 'packageId',
                choices: allPackageList.map(x => `${x.id}: ${x.total}`)
            },
            {
                type: 'rawlist',
                message: "What's the update type?",
                name: 'type',
                choices: Object.keys(table.updateType),
            },
            {
                type: 'input',
                message: 'Enter the update content:',
                name: 'content',
                validate: function(value) {
                    if(value.length < 1) {
                        return "The content cann\'t be empty."
                    }
                    return true;
                }
            },
            // {
            //     type: 'editor',
            //     name: 'bio',
            //     message: 'Please write a short bio of at least 3 lines.',
            //     validate: function (text) {
            //         return true;
            //     },
            // },
            {
                type: 'checkbox',
                message: 'Select the devices ',
                name: 'deviceList',
                choices: allDeviceList.map(x => `${x.id}: ${x.number} ${x.title}`),
                validate: function (answer) {
                    if (answer.length < 1) {
                        return "You must choose at least one device."
                    }
                    return true;
                }
            }
        ])

    }).then(answer => {
        let config = {
            data: {
                name: answer.name,
                aimType: 2,
                type: table.updateType[answer.type],
                content: answer.content,
                packageId: parseInt(answer.packageId, 10),
                deviceIdList: answer.deviceList.map(x => parseInt(x, 10))
            }
        }
        return software.creatUpdate(config);
    }).then(res => {
        // console.log(res);
        if(res.data.errno === 200) {
            console.log("Update create success.");
        } else {
            console.log("Update create fail.");
        }
    })

