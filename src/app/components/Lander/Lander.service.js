import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";

export class LanderService {

    static getLanderClubList(){
        const url = ApiUrlConstant.getApiUrl("landerClubList");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
}