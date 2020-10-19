const inquirer = require("inquirer");
const login = require("./login");
const upload = require("./upload");
const update = require("./update");
const uploadAndUpdate = require("./upload-update")

function ask() {

    login().then(res => {
        return inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'operation',
                    message: 'What do you want to do?',
                    choices: [
                        'Upload a package',
                        'Create a update',
                        'All of the above',
                        'Exit',
                    ],
                },
            ])

    }).then(res => {
        if (res.operation === 'Upload a package') {
            return upload();
        } else if(res.operation === 'Create a update'){
            return update();
        } else if(res.operation === 'All of the above') {
            return uploadAndUpdate();
        } else if(res.operation === 'Exit') {
            throw 'Bye.';
        }
    }).then(res => {
        if (res.data.errno === 200) {
            console.log("operation success");
        } else {
            console.log("operation fail");
        }
        return inquirer.prompt([
            {
                type: 'confirm',
                name: 'continue',
                message: 'Continue? (just hit enter for YES)?',
                default: false
            }
        ])
    }).then(answer => {
        if(answer.continue) {
            ask();
        } else {
            throw 'Bye.'
        }
    }).catch(err => {
        console.error(err);
    })
}

ask();


