import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

import base64 from 'base-64';

export class LoginService {

    //forgot_password

    static doPasswordReset(username) {
        let url = ApiUrlConstant.getApiUrl("forgot_password");
        url = Util.beautifyUrl(url, [username]);        

        return Api.doGet(url,false)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp;
            }
            throw resp;
        });
    }


    static doPasswordResetSubmit(username,captcha) {
        let url = ApiUrlConstant.getApiUrl("forgot_password_submit"); 
        let request={
            username,
            captcha
        }
        return Api.doPost(url,request,{},false)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp;
            }
            throw resp;
        });
    }

    // send username and password as json to server for requesting OTP
    static doLoginTask(credentials, isClientLogin = false) {
        let url;
        if (isClientLogin) {
            url = ApiUrlConstant.getApiUrl("loginClient");  // url for login took from apiservices
        } else {
            url = ApiUrlConstant.getApiUrl("login");  // url for login took from apiservices
        }

        return Api.doPost(url, credentials, {}, false)
            .then((resp) => {
            if (resp && resp.status_code) {
                return resp;
            }
            throw resp;
        });
    }
    static doGoogleLogin(credentials ) {
        const url = ApiUrlConstant.getApiUrl("loginGoogle");

        return Api.doFormData(url, credentials, {}, false)
            .then((resp) => {
            if (resp && resp.access_token) {
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