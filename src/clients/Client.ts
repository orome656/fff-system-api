import HttpResponse from "../models/HttpResponse";

export default interface Client {
    request(path: string, method: string, params: object): Promise<HttpResponse>
    get(path: string, params: object): Promise<HttpResponse>
}