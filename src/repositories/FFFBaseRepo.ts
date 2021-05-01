const AES = require('crypto-js/aes');
import axios from 'axios'

export default class FFFBaseRepo {
  protected token: string
  constructor() { }

  async getToken(): Promise<string> {
    if (this.token == null) {
      var timestamp = Math.floor(Date.now() / 1000);
      const env = process.env

      var token_password = env['fff_token_password'] + timestamp;
      var text = {
        client_id: env['fff_client_id'],
        client_secret: env['fff_client_secret'],
        grant_type: 'password',
        scope: "api_public api_users",
        username: env['fff_username'],
        password: env['fff_password']
      };
      var stringifiedText = JSON.stringify(text)
      var token = AES.encrypt(stringifiedText, token_password).toString()
      var query = {
        token: token,
        timestamp: timestamp
      }

      const { data } = await axios.post(
        'https://apidofa.fff.fr/oauth/v2/token',
        query
      )
      this.token = data.access_token
    }
    return this.token;
  }

  async callApi(method, path: string, params = {}): Promise<any> {
    let t = await this.getToken()
    var config = {
      method: method,
      url: "https://apidofa.fff.fr/api" + path,
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
    return response.data
  }
}