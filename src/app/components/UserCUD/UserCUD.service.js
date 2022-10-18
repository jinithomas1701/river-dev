import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class UserCUDService {
    static loadAllCuds(pageNo) {
        let url = ApiUrlConstant.getApiUrl("userCud");
        url = Util.beautifyUrl(url, [pageNo])

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static createCud(cud) {
        const url = ApiUrlConstant.getApiUrl("createCud");

        return Api.doPost(url, cud)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getAllCouncils(){
        let url = ApiUrlConstant.getApiUrl("search");
        url = Util.beautifyUrl(url, ["council"]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static updateCud(cud, cudId) {
        let url = ApiUrlConstant.getApiUrl("updateCud");
        url = Util.beautifyUrl(url, [cudId]);

        return Api.doPut(url, cud)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

}