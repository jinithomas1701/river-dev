import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class CommonDashboardService {

    static getComparePoints(){
        const url = ApiUrlConstant.getApiUrl("dashClubCompare");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getPillarStats() {
        const url = ApiUrlConstant.getApiUrl("dashClubPillar");

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

    static getActivities(pageNo, year = '2018') {
        let url = ApiUrlConstant.getApiUrl("dashClubActivity");
        url = Util.beautifyUrl(url, [year, pageNo]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
    static getVoices(pageNo) {
        let url = ApiUrlConstant.getApiUrl("dashClubVoices");
        url = Util.beautifyUrl(url, [pageNo]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
    static getCommitments(pageNo) {
        let url = ApiUrlConstant.getApiUrl("dashClubCommitment");
        url = Util.beautifyUrl(url, [pageNo]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityCategories() {
        const url = ApiUrlConstant.getApiUrl("activityCategories");

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

    static getActivityCategoryList() {
        const url = ApiUrlConstant.getApiUrl("activityCategories");
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static searchUser(query) {
        let url = ApiUrlConstant.getApiUrl("search");
        url = Util.beautifyUrl(url, [query]);
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubMembers() {
        const url = ApiUrlConstant.getApiUrl("clubMembers");
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityMasters(year = '2018') {
        let url = ApiUrlConstant.getApiUrl("masterActivities");
        url = Util.beautifyUrl(url, [year]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static saveWizard(step, request, year = '2018') {
        let url = ApiUrlConstant.getApiUrl("saveClubSettings");
        url = Util.beautifyUrl(url, [step, year]);

        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static finishSettings() {
        const url = ApiUrlConstant.getApiUrl("finishSettings");

        return Api.doPost(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static checkSetupFinished() {
        const url = ApiUrlConstant.getApiUrl("finishSettings");

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static isClubSettingsFinish(year = '2018') {
        let url = ApiUrlConstant.getApiUrl("isClubSetupFinished");
        url = Util.beautifyUrl(url, [year])

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static assignActivity(activityId, object) {
        let url = ApiUrlConstant.getApiUrl("assignActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPost(url, object)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubSettings(year = '2018') {
        let url = ApiUrlConstant.getApiUrl("clubSettings");
        url = Util.beautifyUrl(url, [year])

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}