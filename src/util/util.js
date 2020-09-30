
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
    let protocol = config.protocol || "http";
    let hostname = config.hostname || "localhost";
    let path = config.path || "/";
    let port = config.port || 80;
    return `${protocol}://${hostname}:${port}${path}`;
}

module.exports = {
    getUrl
}

