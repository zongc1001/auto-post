const inquirer = require("inquirer");
const login = require("./login");
const upload = require("./upload");
const update = require("./update");


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
                        'All of the above'
                    ],
                },
            ])

    }).then(res => {
        if (res.operation === 'Upload a package') {
            return upload();
        } else if(res.operation === 'Create a update'){
            return update();
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
            console.log("Bye.");
        }
    }).catch(err => {
        console.error(err);
    })
}

ask();


