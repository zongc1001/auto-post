const BaseModel = require("./BaseModel")

class Login extends BaseModel{
    login(data) {
        this.post({
            path: "/api/admin/user/login",
            data: data,
        }).then(res => {
            console.log(res);
        })
    }
}

module.exports = new Login();