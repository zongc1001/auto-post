const BaseModel = require("./BaseModel")
const SparkMD5 = require("spark-md5");
class Software extends BaseModel {
  /**
   * 
   * @param {ZxiosOption} config 
   */
  install(config) {
    Object.assign(config, {
      path: "/api/admin/user/login",  //改成install的
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return this.post(config);
  }
  /**
   * 
   * @param {ZxiosOption} config 
   */
  getList(config) {
    Object.assign(config, {
      path: "/api/admin/package/list",
      headers: {
        "Content-Type": "application/json"
      }
    })
    return this.post(config);
  }
  /**
   * 
   * @param {ZxiosOption} config 
   */
  upload(config) {
    Object.assign(config, {
      path: "/api/admin/package/large-upload",
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    return this.post(config);
  }
  /**
   * 
   * @param {ZxiosOption} config 
   */
  save(config) {
    Object.assign(config, {
      path: "/api/admin/package/save",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return this.post(config);
  }
}
function uploadFile(requestUrl, file) {
  // 得到md5码
  return new Promise((resolve, reject) => {
    getFileMD5(file, md5 => {
      file.md5 = md5; // 存储整个文件的md5码
      uploadChunk(requestUrl, file, 0).then(data => {
        resolve(data);
      }).catch(error => {
        reject(error);
      });
    });
  });

}

// currentChunk为上传文件块的索引
function uploadChunk(requestUrl, file, currentChunk) {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader(),
      chunkSize = 10485760, // 上传文件块的大小，可自定义，现在为10M
      chunks = Math.ceil(file.size / chunkSize),// 计算改文件的可分为多少块
      { md5, name, size } = file;
    // 文件切割后的回调，this.result为切割的文件块
    fileReader.onload = function (e) {
      const params = {
        chunks,
        md5,
        name,
        size,
        chunk: currentChunk,
        file: new Blob([e.target.result])
      };
      let loading = Loading.service({
        lock: true,
        text: "正在上传...",
        spinner: "el-icon-loading"
      });
      request.post(requestUrl, params, false).then(res => {
        if (res.errno != 200) {
          reject(res.error);
          loading.close();
          return false;
        }
        currentChunk++;
        if (currentChunk < chunks) {
          loadNext(); // 继续切割下一块文件
        } else {
          loading.close();
          resolve(res);
        }
      });
    };

    //处理单片文件的上传
    function loadNext() {
      var start = currentChunk * chunkSize, // 计算切割文件的开始索引
        end = Math.min(start + chunkSize, file.size); // 计算切割文件的结束索引
      fileReader.readAsArrayBuffer(file.slice(start, end)); // 切割文件并触发fileReader.onload
    }
    // 触发文件第一块上传
    loadNext();
  });

}

// 分片读取文件，获得文件md5
function getFileMD5(file, callback) {
  //声明必要的变量
  var fileReader = new FileReader(),
    chunkSize = 1048576, //文件每块分割1M，计算分割详情
    chunks = Math.ceil(file.size / chunkSize), // 总块数
    currentChunk = 0, // 当前第几块
    spark = new SparkMD5(); //创建md5对象（基于SparkMD5）

  fileReader.onload = function (e) { //每块文件读取完毕之后的处理
    spark.appendBinary(e.target.result); //每块交由sparkMD5进行计算
    currentChunk++;
    if (currentChunk < chunks) { //如果文件处理完成计算MD5，如果还有分片继续处理
      loadNext();
    } else {
      callback(spark.end());
    }
  };

  //处理单片文件的上传
  function loadNext() {
    var start = currentChunk * chunkSize,
      end = start + chunkSize >= file.size ? file.size : start + chunkSize;

    fileReader.readAsBinaryString(file.slice(start, end)); // 分段读取文件数据
  }

  loadNext();

}

module.exports = new Software();