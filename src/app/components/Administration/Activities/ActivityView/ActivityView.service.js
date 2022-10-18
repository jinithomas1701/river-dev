import {ApiUrlConstant} from "../../../../Util/apiUrl.constant";
import {Api} from "../../../../Util/api.service";
import {Util} from "../../../../Util/util";

export class ActivityViewServices {
    static getActivityMasters(){
        const url = ApiUrlConstant.getApiUrl("activityMasters");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivity( activityId ){
        let url = ApiUrlConstant.getApiUrl("assignedActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static assignActivity(activity){
        const url = ApiUrlConstant.getApiUrl("assignedActivities");

        return Api.doPost(url, activity, {})
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static approveAssignees(activityId, request) {
        let url = ApiUrlConstant.getApiUrl("approveAssignees");
        url = Util.beautifyUrl(url, [activityId]);
        return Api.doPost(url, request)
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static rejectActivity(activityId, comment) {
        let url = ApiUrlConstant.getApiUrl("rejectActivity");
        url = Util.beautifyUrl(url, [activityId]);
        return Api.doPost(url, comment)
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static approveCouncil(activityId, request) {
        let url = ApiUrlConstant.getApiUrl("approveRejectCouncil");
        url = Util.beautifyUrl(url, [activityId]);
        return Api.doPost(url, request)
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static removeAssignees(activityId, request) {
        let url = ApiUrlConstant.getApiUrl("removeAssignee");
        url = Util.beautifyUrl(url, [activityId]);
        return Api.doPost(url, request)
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static finishActivity(activityId){
        let url = ApiUrlConstant.getApiUrl("activityFinish");
        url = Util.beautifyUrl(url, [activityId]);
        return Api.doPost(url, {})
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static searchUser(query) {
        let url = ApiUrlConstant.getApiUrl("searchUsers");
        url = Util.beautifyUrl(url, ["users", query]);
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
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
}