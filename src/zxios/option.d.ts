declare interface Headers {

}

declare interface ZxiosOption {
    hostname: string,
    port: number,
    path: string,
    method: string,
    protocol: string,
    path: string,
    auth?: string,
    headers?: Headers,
    data?: Object,
}
