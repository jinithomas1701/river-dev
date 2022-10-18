import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

const ROLE_PRESIDENT = 'PR';

export default class PresidentDashboardService {

    static getComparePoints(){
        const url = ApiUrlConstant.getApiUrl("dashClubCompare");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getFinishStatus(){
        const url = ApiUrlConstant.getApiUrl("finishSettings");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
}