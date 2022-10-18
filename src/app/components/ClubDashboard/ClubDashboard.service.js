import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class ClubDashboardService {

    static getComparePoints(){
        const url = ApiUrlConstant.getApiUrl("clubPointsDiff");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getPillarStats() {
        const url = ApiUrlConstant.getApiUrl("pillarStats");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getLastWeekResults(pageNo) {
        let url = ApiUrlConstant.getApiUrl("dashboardLastWeek");
        url = Util.beautifyUrl(url, [pageNo]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static createCommitment(commitment){
        const url = ApiUrlConstant.getApiUrl("commitment");

        return Api.doPost(url, commitment)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateCommitmentStatus(commitment){
        const url = ApiUrlConstant.getApiUrl("commitment");

        return Api.doPut(url, commitment)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCommitmentsStatuses() {
        const url = ApiUrlConstant.getApiUrl("commitmentStatus");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCommitmentsList() {
        const url = ApiUrlConstant.getApiUrl("commitment");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getTargetsList() {
        const url = ApiUrlConstant.getApiUrl("target");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getYearsList() {
        const url = ApiUrlConstant.getApiUrl("fyList");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static createCommitment(commitment) {
        const url = ApiUrlConstant.getApiUrl("commitment");

        return Api.doPost(url, commitment)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateClubTarget(targetObj) {
        const url = ApiUrlConstant.getApiUrl("targetEdit");

        return Api.doPut(url, targetObj)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static createClubTarget(targetObj) {
        const url = ApiUrlConstant.getApiUrl("targetEdit");

        return Api.doPost(url, targetObj)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
}