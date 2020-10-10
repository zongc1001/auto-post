const login = require("../model/Login");
login.login({
    data: {
        // phone: "admin",
        phone: "admin",
        password: "4297f44b13955235245b2497399d7a93",
    }
}).then(res=>console.log(res));