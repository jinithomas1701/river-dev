import {ApiUrlConstant} from "../../../../Util/apiUrl.constant";
import {Api} from "../../../../Util/api.service";
import {Util} from "../../../../Util/util";

export class ActivityMasterStatisticsDialogService {
    static getActivityMasterStats(activityMasterId) {
        let url = ApiUrlConstant.getApiUrl("activityMasterStats");
        url = Util.beautifyUrl(url, [activityMasterId]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }
}