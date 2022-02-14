import internal = require("stream");

export default interface HttpResponse {
    statusCode: number
    body: any
}