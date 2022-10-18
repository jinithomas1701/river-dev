import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class ActivitiesService {
    
    static getActivities(pageNo, query){
        let url = ApiUrlConstant.getApiUrl("adminActivities");
        url = Util.beautifyUrl(url, [Util.getCurrentFinancialYear(), pageNo, query]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getFocusAreasList() {
        const url = ApiUrlConstant.getApiUrl("focusAreas");
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static getClubsList() {
        const url = ApiUrlConstant.getApiUrl("clubsListMinDetail");
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteActivity(activityId) {
        const deleteActivityUrl = ApiUrlConstant.getApiUrl("deleteAssignedActivity");
        const url = Util.beautifyUrl(deleteActivityUrl, [activityId])

        return Api.doDelete(url)
        .then((resp) => {
            if(resp && resp.status_code){
                return resp.payload;
            }
            return resp;
        })
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

    static getActivitiesTab(status, pageNo, size){
        let url = ApiUrlConstant.getApiUrl("adminActivitiesTab");
        url = Util.beautifyUrl(url, [status, pageNo, size]);
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static unassignUser(activityId, object) {
        let url = ApiUrlConstant.getApiUrl("unassignUser");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPost(url, object)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static clubRejectActivity(activityId) {
        let url = ApiUrlConstant.getApiUrl("rejectActivityCP");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPut(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static clubApproveActivity(activityId, object) {
        let url = ApiUrlConstant.getApiUrl("approveActivityCP");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPut(url, object)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static councilApproveActivity(activityId, object) {
        let url = ApiUrlConstant.getApiUrl("councilAcceptActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPut(url, object)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static councilRejectActivity(activityId) {
        let url = ApiUrlConstant.getApiUrl("councilRejectActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPut(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
} 