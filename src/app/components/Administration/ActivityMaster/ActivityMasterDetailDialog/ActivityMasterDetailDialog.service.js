import {ApiUrlConstant} from "../../../../Util/apiUrl.constant";
import {Api} from "../../../../Util/api.service";
import {Util} from "../../../../Util/util";

export class ActivityMasterDetailDialogService {
    static getActivityCategoryList() {
        const url = ApiUrlConstant.getApiUrl("focusAreas");
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityCouncilList() {
        const url = ApiUrlConstant.getApiUrl("groupList");
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createActivityMaster(activityMaster) {
        const url = ApiUrlConstant.getApiUrl("allMasterActivities");
        
        return Api.doPost(url, activityMaster, {})
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateActivityMaster(activityMaster, id) {
        let url = ApiUrlConstant.getApiUrl("masterActivity");
        url = Util.beautifyUrl(url, [id]);
        
        return Api.doPut(url, activityMaster, {})
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}