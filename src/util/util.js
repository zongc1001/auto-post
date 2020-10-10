Function.prototype.curry = function(...rest){
    let args = rest, that = this;
    return function(...rest) {
        return that.apply(null, args.concat(rest));
    }
};

/**
 * @param {ZxiosOption} config
 * @return {string}
 */
function getUrl(config) {
    if(config.protocol && config.hostname && config.path && config.port) {
        let protocol = config.protocol || "http";
        let hostname = config.hostname || "localhost";
        let path = config.path || "/";
        let port = config.port || 80;
        return `${protocol}://${hostname}:${port}${path}`;
    } else {
        return "";
    }
}

module.exports = {
    getUrl
}

