import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class CouncilDashboardService {

    static getLastWeek(pageNo) {
        let url = ApiUrlConstant.getApiUrl("councilDashLastWeek");
        url = Util.beautifyUrl(url, [pageNo]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
}