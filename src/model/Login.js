const BaseModel = require("./BaseModel")
class Login extends BaseModel{
    login(config) {
        Object.assign(config, {
            path: "/api/admin/user/login",
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        return this.post(config);
    }
}

module.exports = new Login();