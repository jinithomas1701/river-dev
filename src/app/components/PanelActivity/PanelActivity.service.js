import { ApiUrlConstant } from "../../Util/apiUrl.constant";
import { Api } from "../../Util/api.service";
import { Util } from "../../Util/util";

const ROLE_PANEL = 'PA';

export default class PanelActivityService {

    static getAssignedActivityList(role, search = "", groupBy = 'LI', filter = 'ALL', page = 0, count = 100) {
        let url = ApiUrlConstant.getApiUrl("getAssignedActivityList");
        url += `?search=${search}&role=${role}&groupBy=${groupBy}&filter=${filter}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static loadAssignedActivityDetail(activityId, role) {
        let url = ApiUrlConstant.getApiUrl("getAssignedActivityDetail");
        url = Util.beautifyUrl(url, [activityId]);
        url += `?role=${role}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static calculateStarPoint(activityId, ratingCode, multiplier) {

        let url = ApiUrlConstant.getApiUrl("calculatePointMatrix");
        url = Util.beautifyUrl(url, [activityId]);
        url += `?ratingCode=${ratingCode}&multiplier=${multiplier}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static calculateCategoryPoint(activityId, categoryCode, multiplier) {

        let url = ApiUrlConstant.getApiUrl("calculatePointMatrix");
        url = Util.beautifyUrl(url, [activityId]);
        url += `?categoryCode=${categoryCode}&multiplier=${multiplier}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static approveActivity(activityId, completeObj, operation = 'approve', role = ROLE_PANEL) {
        let url = ApiUrlConstant.getApiUrl("approveActivityById");
        url = Util.beautifyUrl(url, [activityId, operation]);
        url += `?role=${role}`;

        return Api.doPut(url, completeObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static rejectActivity(activityId, requestObj, role) {
        let url = ApiUrlConstant.getApiUrl("rejectActivityById");
        url = Util.beautifyUrl(url, [activityId]);
        url += `?role=${role}`;

        return Api.doPut(url, requestObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static draftActivity(activityId, draftActivity) {

        let url = ApiUrlConstant.getApiUrl("draftActivityById");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPut(url, draftActivity)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static resubmitActivity(activityId, role, reassignTo) {
        let url = ApiUrlConstant.getApiUrl("resubmitActivity");
        url = Util.beautifyUrl(url, [activityId]);
        url += `?role=${role}`;

        return Api.doPut(url, reassignTo)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static deleteActivity(activityId) {
        let url = ApiUrlConstant.getApiUrl("deleteActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doDelete(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static uploadAttachments(activityId, attachments) {
        let url = ApiUrlConstant.getApiUrl("uploadAssignedActivityAttachments");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPost(url, attachments)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static deleteAttachment(activityId) {
        let url = ApiUrlConstant.getApiUrl("deleteAssignedActivityAttachment");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doDelete(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static loadKpiList(searchTerm = "", page = 0, count = 100) {
        let url = ApiUrlConstant.getApiUrl("getKpiList");
        url += `?search=${searchTerm}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static loadKpiDeatails(activityId) {
        let url = ApiUrlConstant.getApiUrl("getKpiDetails");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getDiscussion(discussionId) {
        let url = ApiUrlConstant.getApiUrl("loadCommentsFull");
        url = Util.beautifyUrl(url, [discussionId]);

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static submitDiscussion(discussionObj) {
        let url = ApiUrlConstant.getApiUrl("comment");

        return Api.doPost(url, discussionObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

}