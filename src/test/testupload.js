const software = require("../model/Software");
const spark = require("spark-md5");
const fs = require("fs");

const name = "scu.rar";

let data = fs.readFileSync(`./${name}`, "utf-8");
let md5 = spark.hash(data);
let size = 23 || data.length;
console.log(fs.statSync(`./${name}`));
let chunk = 0;
let chunks = 1;
let config = {
    data: {
        chunks,
        md5,
        name,
        size, 
        file: data,
        chunk
    }
};
// console.log(config);
software.upload(config).then(res => console.log(res));