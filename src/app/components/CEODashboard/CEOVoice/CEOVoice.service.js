import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class CEOVoiceService {

    static getVoiceStats(grouping, startDate, endDate){
        let url = ApiUrlConstant.getApiUrl("ceoVoiceDashStats");
        url += `?grouping=${grouping}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
}