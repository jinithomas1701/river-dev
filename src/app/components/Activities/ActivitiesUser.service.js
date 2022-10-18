import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class ActivitiesUserService {

    static getActivities(){
        const url = ApiUrlConstant.getApiUrl("userActivities");

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivitiesTab(status, year = 2018, query){
        let url = ApiUrlConstant.getApiUrl("getUserActivities");

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static completeActivity(activityId, userId, request) {
        let url = ApiUrlConstant.getApiUrl("userActivityDone");
        url = Util.beautifyUrl(url, [activityId, userId]);
        return Api.doPost(url, request)
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

    static postComment(commentRequest) {
        const url = ApiUrlConstant.getApiUrl("comment");
        return Api.doPost(url, commentRequest)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static loadMoreComments(commentId, skipCount, size) {
        let url = ApiUrlConstant.getApiUrl("loadComments");
        url = Util.beautifyUrl(url, [commentId, skipCount, size]);
        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static selfAssignActivity(activityId) {
        let url = ApiUrlConstant.getApiUrl("selfAssignActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPut(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static selfAssignActivityDetails(activityId,context) {
        let url = ApiUrlConstant.getApiUrl("dashboardPresidentActivityDetail");
        url = Util.beautifyUrl(url, [activityId,context]);

        return Api.doPut(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getUserActivitiesSearch(context) {
        let url = ApiUrlConstant.getApiUrl("getUserActivitiesSearch");
        if(context){
            url = Util.beautifyUrl(url, [context]);
        }
        else{
            url = ApiUrlConstant.getApiUrl("getUserActivities");
        }

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }


} 