import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export default class ClubSettingsService {

    static getClubMembers() {

        let url = ApiUrlConstant.getApiUrl("clubMembers");

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubSettings () {

        let url = ApiUrlConstant.getApiUrl("clubSettings");

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static saveClubSettings(stage, settingsObj) {

        let url = ApiUrlConstant.getApiUrl("saveClubSettings");
        url = Util.beautifyUrl(url, [stage]);

        return Api.doPut(url, settingsObj)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }


    static getMasterActivities () {

        let url = ApiUrlConstant.getApiUrl("masterActivities");

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}