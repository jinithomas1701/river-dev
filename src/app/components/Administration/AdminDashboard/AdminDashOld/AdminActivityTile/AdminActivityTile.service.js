import {ApiUrlConstant} from "../../../../../Util/apiUrl.constant";
import {Api} from "../../../../../Util/api.service";
import {Util} from "../../../../../Util/util";

export default class AdminActivityTileService {

    static actionsOnActivity(request, selectedActitivyId, assignedActivityId, operation) {
        let urlLabel;
        urlLabel = 'actionPresidentActivity';
        let url = ApiUrlConstant.getApiUrl(urlLabel);
        url = Util.beautifyUrl(url, [selectedActitivyId, assignedActivityId, operation]);
        url = url.replace('president/', 'admin/');

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
        url = url.replace('president/', 'admin/');

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
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityDetail(selectedActitivyId, assignedActivityId) {
        let urlLabel;
        urlLabel = 'getAssignedPresidentActivityDetail';
        let url = ApiUrlConstant.getApiUrl(urlLabel);
        url = Util.beautifyUrl(url, [selectedActitivyId, assignedActivityId]);
        url = url.replace('president/', 'admin/');

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
        url = url.replace('president/', 'admin/');

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
        url = url.replace('president/', 'admin/');

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