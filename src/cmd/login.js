var inquirer = require("inquirer");
var Login = require("../model/Login");
var md5 = require("md5");
var fs = require("fs");

const USER_HOME = process.env.HOME || process.env.USERPROFILE;


function handle(resolve, reject) {
    let pair = {};
    let temp;
    try {
        const data = fs.readFileSync(`${USER_HOME}/.autopostconfig.js`, "utf-8")
        Object.assign(pair, JSON.parse(data));
        temp = Promise.resolve(pair);
    } catch (error) {
        console.error(error);
        temp = inquirer
            .prompt([
                {
                    type: "input",
                    message: "Enter your username:",
                    name: 'username',
                },
                {
                    type: 'password',
                    message: "Enter your password:",
                    name: 'password',
                    mask: '*',

                },
            ]);
    }

    

    temp.then(
        (answer) => {
            // console.log("answer", answer);

            Login.login({
                data: {
                    phone: answer.username,
                    password: md5(answer.password),
                }
            }).then(res => {
                // console.log("res", res);
                if (res.data.errno !== 200) {
                    console.error(res.data.error);
                    resolve(new Promise(handle));
                } else {
                    fs.writeFile(
                        `${USER_HOME}/.zxiosconfig`,
                        res.headers.authorization,
                        {
                            flag: 'w+',
                            encoding: 'utf-8'
                        },
                        err => {
                            if (err) {
                                console.info("saving auth fail:" + err);
                                resolve(false);
                            } else {
                                console.info("saving auth success");
                                resolve(true);
                            }
                        }
                    );

                }


            });
        }
    )

}

module.exports = function () {
    return new Promise(handle);
}
