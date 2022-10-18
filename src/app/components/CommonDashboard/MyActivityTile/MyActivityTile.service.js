import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export default class ActivityTileService {

    static actionsOnActivity(request, selectedActitivyId, assignedActivityId, operation) {
        const context = Util.getActiveRole();
        let urlLabel;
        if (context && context.value == 'ROLE_CLUB_PRESIDENT') {
            urlLabel = 'actionPresidentActivity';
        } else if (context && context.value == 'ROLE_RIVER_COUNCIL') {
            urlLabel = 'actionPaneltActivity';
        }
        let url = ApiUrlConstant.getApiUrl(urlLabel);
        url = Util.beautifyUrl(url, [selectedActitivyId, assignedActivityId, operation]);

        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static assignedActivitieFullDetails(selectedId) {
        let url = ApiUrlConstant.getApiUrl("assignedActivitieFullDetails");
        url = Util.beautifyUrl(url,[selectedId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static assignedActivitieFullDetailsSearch(selectedId,search) {
        let url = ApiUrlConstant.getApiUrl("assignedActivitieFullDetailsSearch");
        url = Util.beautifyUrl(url,[selectedId,search]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityDetail(selectedActitivyId, assignedActivityId, role = "common") {
        const context = Util.getActiveRole();
        let urlLabel;
        if (context && context.value == 'ROLE_CLUB_PRESIDENT') {
            urlLabel = 'getAssignedPresidentActivityDetail';
        } else if (context && context.value == 'ROLE_RIVER_COUNCIL') {
            urlLabel = 'getAssignedPanelActivityDetail';
        }else if (context && context.value == 'ROLE_SUPER_ADMIN') {
            urlLabel = 'getAssignedSuperAdminActivityDetail';
        }if (context && context.value == 'ROLE_CLUB_MEMBER') {
            urlLabel = 'getAssignedMemberActivityDetail';
        }
        
        //@TODO: this is a hotfix. api for my activity for all is me/. remove above condition & role=common once fixed
        urlLabel = (role === "common")? 'getAssignedMemberActivityDetail' : urlLabel;
        
        let url = ApiUrlConstant.getApiUrl(urlLabel);
        url = Util.beautifyUrl(url, [selectedActitivyId, assignedActivityId]);

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static assignActivityMarkComplete(selectedActitivyId,assignedActivityId, operation, request) {
        let url = ApiUrlConstant.getApiUrl('assignActivityMarkComplete');
        url = Util.beautifyUrl(url, [selectedActitivyId,assignedActivityId, operation]);

        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static assignedActivitySelfDelete(selectedActitivyId,assignedActivityId) {
        let url = ApiUrlConstant.getApiUrl('assignedActivitySelfDelete');
        url = Util.beautifyUrl(url, [selectedActitivyId,assignedActivityId]);

        return Api.doDelete(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static loadActivityComments(commentId) {
        let url = ApiUrlConstant.getApiUrl("loadCommentsFull");
        url = Util.beautifyUrl(url, [commentId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static calculatePoints(selectedId, assignedId, params) {
        let url = ApiUrlConstant.getApiUrl("calculatePoints");
        url = Util.beautifyUrl(url, [selectedId, assignedId, params]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static draftActivity(selectedId, assignedId, request) {
        let url = ApiUrlConstant.getApiUrl('draftActivity');
        url = Util.beautifyUrl(url, [selectedId, assignedId]);

        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}