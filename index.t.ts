
declare interface ZxiosOption {
    hostname: string,
    port: number,
    path: string,
    method: string,
    protocol: string,
    auth?: string,
    headers?: Object,
    data?: Object,
}
