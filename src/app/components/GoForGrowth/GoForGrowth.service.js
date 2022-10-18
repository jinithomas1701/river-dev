import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";
import { riverToast } from "../Common/Toast/Toast";

export class GoForGrowthService {
    static getGfgItems(urlParam = '') {
        let url = ApiUrlConstant.getApiUrl('goForGrowth');
        url = Util.beautifyUrl(url, [urlParam]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getGfgItem(gfgId) {
        let url = ApiUrlConstant.getApiUrl('singleGoForGrowth');
        url = Util.beautifyUrl(url, [gfgId]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getAccounts() {
        const url = ApiUrlConstant.getApiUrl('getAccounts');

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getPriorities() {
        const url = ApiUrlConstant.getApiUrl('gfgPriorityList');

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getStatusList() {
        const url = ApiUrlConstant.getApiUrl('goForGrowthStatusList');

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createGfg(body) {
        let url = ApiUrlConstant.getApiUrl('goForGrowth');
        url = Util.beautifyUrl(url, [''])

        return Api.doPost(url, body)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateGfg(gfgId, body) {
        let url = ApiUrlConstant.getApiUrl('singleGoForGrowth');
        url = Util.beautifyUrl(url, [gfgId]);

        return Api.doPut(url, body)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteGfg(gfgId) {
        let url = ApiUrlConstant.getApiUrl('singleGoForGrowth');
        url = Util.beautifyUrl(url, [gfgId]);

        return Api.doDelete(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static changeStatus(statusObj) {
        const url = ApiUrlConstant.getApiUrl('goForGrowthChangeStatus');

        return Api.doPut(url, statusObj)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static exportResult(urlParam) {
        let url = ApiUrlConstant.getApiUrl('gfgReportExport');
        url = Util.beautifyUrl(url, [urlParam]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static loadComments(gid) {
        let url = ApiUrlConstant.getApiUrl("g4gcomments");  
        url = Util.beautifyUrl(url, [gid]);      
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postComment(gid,value) {
        let req={
            value
        }
        let url = ApiUrlConstant.getApiUrl("g4gcomments"); 
        url = Util.beautifyUrl(url, [gid]);           
        return Api.doPost(url,req)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                riverToast.show("Comment Posted Successfully");
                return resp.payload;
            }
            throw resp;
        });
    }

    static loadPanel() {
        let url = ApiUrlConstant.getApiUrl("loadG4GPanel");  
        //url = Util.beautifyUrl(url, [gid]);      
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updatePanel(user,accounts) {
        const req={
            user,
            accounts
        }

        let url = ApiUrlConstant.getApiUrl("loadG4GPanel");  
        //url = Util.beautifyUrl(url, [gid]);      
        return Api.doPut(url,req)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deletePanelMember(user) {
        const req={
            user
        }

        let url = ApiUrlConstant.getApiUrl("loadG4GPanel");  
        //url = Util.beautifyUrl(url, [gid]);      
        return Api.doDelete(url,req)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }


    static switchAdminPanelMember(user,isAdmin) {
        const req={
            user,
            isAdmin
        }

        let url = ApiUrlConstant.getApiUrl("loadG4GPanelAdmin");  
        //url = Util.beautifyUrl(url, [gid]);      
        return Api.doPut(url,req)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }    


    static getPanelUsersSuggestion(sug) {
        let url = ApiUrlConstant.getApiUrl("searchUsers");  
        url = Util.beautifyUrl(url, ['users',sug]);      
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

}