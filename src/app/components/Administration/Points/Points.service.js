import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class PointsService {
    static getClubs(){
        let url = ApiUrlConstant.getApiUrl("clubsListMinDetail");
        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getUsers(){
        let url = ApiUrlConstant.getApiUrl("memberListMinDetail");
        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static pointUpdate(request){
        let url = ApiUrlConstant.getApiUrl("pointUpdate");
        return Api.doPut(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getPointHistory(type, id, page, count){
        let url = ApiUrlConstant.getApiUrl("getPointHistoryWithPagination");
        url = Util.beautifyUrl(url, [type, id, page, count]);

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}