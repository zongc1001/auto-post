const upload = require("./upload");
const update = require("./update");

module.exports = function () {
    let resList = [];
    let temp = upload().then(res => {
        console.log(res);
        return update();
    })
    
    return temp;
}