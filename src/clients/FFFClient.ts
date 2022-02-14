const AES = require('crypto-js/aes');
import axios, { Method } from 'axios'
import HttpResponse from '../models/HttpResponse'
import Client from './Client';

interface FFFAuthConfig { token_password: string, client_id: string, client_secret: string, username: string, password: string, tokenUrl: string };

export default class FFFClient implements Client {
    baseUrl: string;
    authConfig: FFFAuthConfig

    token: string;

    constructor(baseUrl: string, authConfig: FFFAuthConfig) {
        this.baseUrl = baseUrl
        this.authConfig = authConfig
    }

    _prepareTokenQuery(): object {
        var timestamp = Math.floor(Date.now() / 1000);
        const env = process.env

        var token_password = this.authConfig.token_password + timestamp;
        var text = {
            client_id: this.authConfig.client_id,
            client_secret: this.authConfig.client_secret,
            grant_type: 'password',
            scope: "api_public api_users",
            username: this.authConfig.username,
            password: this.authConfig.password
        };
        var stringifiedText = JSON.stringify(text)
        var token = AES.encrypt(stringifiedText, token_password).toString()
        return {
            token: token,
            timestamp: timestamp
        }
    }

    async _getToken(): Promise<string> {
        if (this.token == null) {

            var query = this._prepareTokenQuery()
            const { data } = await axios.post(
                this.authConfig.tokenUrl,
                query
            )
            this.token = data.access_token
        }
        return this.token;
    }
    async request(path: string, method: string = 'get', params: object = {}): Promise<HttpResponse> {
        let t = await this._getToken()

        var config = {
            method: method as Method,
            url: this.baseUrl + path,
            headers: {
                "Authorization": "Bearer " + t
            },
            params: params,
            validateStatus: function (status) {
                return true; // default
            }
        }
        //const response = await axios.request(config)
        const response = await axios.request(config)

        return {
            statusCode: response.status,
            body: response.data
        }
    }

    async get(path: string, params: object = {}): Promise<HttpResponse> {
        return await this.request(path, 'get', params)
    }
}