
declare interface ZxiosOption {
    hostname: string,
    port: number,
    path: string,
    method: string,
    protocol: string,
    auth?: string,
    headers?: Header,
    data?: Object,
}

declare interface Header {
    "Content-Type": String,
    Authorization: String,
}


