import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export default class SelfAssignActivityTileService {
    static searchAssignees(masterActivityId, query) {
        //let url = ApiUrlConstant.getApiUrl("searchAssignees");
        let url = ApiUrlConstant.getApiUrl("searchCommonAssignees");
        url = Util.beautifyUrl(url, [masterActivityId, query]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }   
            throw resp;
        });
    }

    static createAssignedActivityFromMaster(request, activityId) {
        let url = ApiUrlConstant.getApiUrl("selfAssignActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}