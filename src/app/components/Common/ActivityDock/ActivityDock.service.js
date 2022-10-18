import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class ActivityDockService {
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

    static getActivityMasters() {
        let url = ApiUrlConstant.getApiUrl("masterActivities");
        url = Util.beautifyUrl(url, [Util.getCurrentFinancialYear()]);

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

    static approveActivity(activityId, object) {
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

    static rejectActivity(activityId) {
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

    static postDiscussionMessage(messageRequest) {
        const url = ApiUrlConstant.getApiUrl("comment");
        return Api.doPost(url, messageRequest)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static startStopMeetingTask(meetingId, request) {
        let url = ApiUrlConstant.getApiUrl("meetingStart");
        url = Util.beautifyUrl(url, [meetingId]);

        return Api.doPost(url, request)
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