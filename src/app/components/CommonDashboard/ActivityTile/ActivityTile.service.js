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

    static deleteAssignedActivity(selectedActivityId, assignedActivityId) {
        let url = ApiUrlConstant.getApiUrl("deleteAssignedActivityPresident");
        url = Util.beautifyUrl(url, [selectedActivityId, assignedActivityId]);
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

    static getActivityDetail(selectedActitivyId, assignedActivityId) {
        const context = Util.getActiveRole();
        let urlLabel;
        if (context && context.value == 'ROLE_CLUB_PRESIDENT') {
            urlLabel = 'getAssignedPresidentActivityDetail';
        } else if (context && context.value == 'ROLE_RIVER_COUNCIL') {
            urlLabel = 'getAssignedPanelActivityDetail';
        }
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

    static viewActivityPointHistory(selectedId, assignedId) {
        let url = ApiUrlConstant.getApiUrl("viewActivityPointHistory");
        url = Util.beautifyUrl(url, [selectedId, assignedId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}