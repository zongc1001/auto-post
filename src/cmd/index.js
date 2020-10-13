const inquirer = require("inquirer");
const login = require("./login");
const upload = require("./upload");
const update = require("./update");

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
                ],
            },
        ])
        
}).then(res => {
    if(res.operation = 'Upload a package') {
        return upload();
    } else {
        return update();
    }
}).then(res => {
    
})