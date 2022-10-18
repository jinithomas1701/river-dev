import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class RiverCouncilDashboardService {

    static getClubStandings(){
        const url = ApiUrlConstant.getApiUrl("riverCouncilClubStandings");
        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubDetails(clubId){
        let url = ApiUrlConstant.getApiUrl("riverCouncilClubDetails");
        url = Util.beautifyUrl(url, [clubId]);
        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

}