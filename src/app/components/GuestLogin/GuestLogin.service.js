import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";

import base64 from 'base-64';

export class GuestLoginService {
    // send username and password as json to server for requesting OTP
    static doLoginTask(credentials) {
        const url = ApiUrlConstant.getApiUrl("login");  // url for login took from apiservices
        return Api.doPost(url, credentials, {}, false)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp;
            }
            throw resp;
        });
    }

    static verifyOtp(credentials){
        const url = ApiUrlConstant.getApiUrl("verify");
        return Api.doPost(url, credentials, {}, false)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp;
            }
            throw resp;
        });
    }

    static getAuthToken(username, clientId, secret){
        const url = ApiUrlConstant.getApiUrl("authToken");
        const headers = {
            'Authorization': 'Basic ' + base64.encode(clientId + ":" + secret)
        }
        const formData = new FormData();
        formData.append("username", username);
        formData.append("grant_type", "password")
        const body = formData;
        return Api.getAuthToken(url, body, headers)
        .then((resp) => {
            if (resp) {
                return resp;
            }
            throw resp;
        });
    }
}