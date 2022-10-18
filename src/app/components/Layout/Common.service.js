import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

import base64 from 'base-64';

export class CommonService {
    static getLoggedInUserDetails() {
        const url = ApiUrlConstant.getApiUrl("userDetails");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static switchRole(roleBody){
        const url = ApiUrlConstant.getApiUrl("switchRole");

        return Api.doPost(url, roleBody)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static getUserDetails(userId){
        let url = ApiUrlConstant.getApiUrl("getUser");
        url = Util.beautifyUrl(url, [userId]);
        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static downloadFromUrl(hash, path){
        path = path || ApiUrlConstant.API_URLS["downloadAssignedActivityAttachment"];
        let url = ApiUrlConstant.getBase() + path;
        url = Util.beautifyUrl(url, [hash]);
        
        return Api.doDownloadFromUrl(url)
        .then((resp) => {
            if(resp){
                return resp;
            }
            throw resp;
        })
    }

    static getNotifications(){
        let url = ApiUrlConstant.getApiUrl("notifications");
        url = Util.beautifyUrl(url, ["all"]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static notificationsMarkRead(){
        let url = ApiUrlConstant.getApiUrl("notifications");
        url = Util.beautifyUrl(url, ["recent"]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }
}