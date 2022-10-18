import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class CEODashboardService {

    static getTopMembers(count) {
        let url = ApiUrlConstant.getApiUrl("ceoTopMembers");
        url = Util.beautifyUrl(url, [count, Util.getCurrentFinancialYear()]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getFocusAreaPoints() {
        let url = ApiUrlConstant.getApiUrl("ceoFocusAreaPoints");
        url = Util.beautifyUrl(url, [Util.getCurrentFinancialYear()]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubPoints(code) {
        let url = ApiUrlConstant.getApiUrl("ceoClubPoints");
        url = Util.beautifyUrl(url, [code, Util.getCurrentFinancialYear()]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubActivities(clubId, faCode) {
        let url = ApiUrlConstant.getApiUrl("ceoClubActivity");
        url = Util.beautifyUrl(url, [clubId, faCode, Util.getCurrentFinancialYear()]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubActivityDetails(activityId) {
        let url = ApiUrlConstant.getApiUrl("getSingleActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getTopMembers(count) {
        let url = ApiUrlConstant.getApiUrl("ceoTopMembers");
        url = Util.beautifyUrl(url, [count, Util.getCurrentFinancialYear()]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getTopClubs(count) {
        let url = ApiUrlConstant.getApiUrl("ceoTopClubs");
        url = Util.beautifyUrl(url, [count, Util.getCurrentFinancialYear()]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
}