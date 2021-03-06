const BaseModel = require("./BaseModel")
const SparkMD5 = require("spark-md5");
class Software extends BaseModel {
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
  /**
   * @param {ZxiosOption} config
   */
  update(config) {
    Object.assign(config, {
      path: "/api/admin/update/package/save",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    return this.post(config);
  }
  /**
   * 
   * @param {ZxiosOption} config 
   */
  
  getUpdateList(config) {
    Object.assign(config, {
      path: "/api/admin/package/reduce/list",
    })
    return this.get(config);
  }
  
  // TODO: 如果知道了后端的详细接口，可以一次性将数据全部返回或者是知道了可以返回数据的总大小的接口，可以使用promise.all去做改进
  
  // anotherGetSchoolDeviceList(config) {
  //   let self = this;
  //   Object.assign(config, {
  //     path: "/api/admin/device/reduce/list",
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   })

  //   Promise.all()
  // }

  getSchoolDeviceList(config) {
    let that = this;
    return new Promise(function (resolve, reject) {
      
      Object.assign(config, {
        path: "/api/admin/device/reduce/list",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      let sumRes = [];
      if (config.data == undefined) {
        config.data = {};
      }
      const pageSize = 10;
      config.data.name = "";
      config.data.pageNum = 1;
      config.data.pageSize = pageSize;
      
      function handle() {
        if(config.data.pageNum <= config.data.pageSize) {
          that.post(config).then(res => {
            // console.log("res", res);
            sumRes = sumRes.concat(res.data.data.records);
            config.data.pageNum++;
            handle();
          })
        } else {
          resolve(sumRes);
        }
      }
      handle();
    })
  }
  /**
   * 
   * @param {ZxiosOption} config 
   */
  creatUpdate(config) {
    Object.assign(config, {
      path: "/api/admin/update/package/save",
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return this.post(config);
  }
}

module.exports = new Software();