import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class ActivityMasterService {
    static getActivityMasters() {
        const url = ApiUrlConstant.getApiUrl("allMasterActivities");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteActivityMaster(id) {
        const deleteMasterUrl = ApiUrlConstant.getApiUrl("deleteActivityMasters");
        const url = Util.beautifyUrl(deleteMasterUrl, [id]);

        return Api.doDelete(url)
        .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload
            }
            throw resp;
        })
    }

    static changeMasterStatus(id, request) {
        let url = ApiUrlConstant.getApiUrl("activityMastersStatus");
        url = Util.beautifyUrl(url, [id]);

        return Api.doPut(url, request)
        .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload
            }
            throw resp;
        })
    }

}