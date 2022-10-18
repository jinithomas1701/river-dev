import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class ClubsService {
    
    static getClubDetailTask(clubId) {
        const clubDetailUrl = ApiUrlConstant.getApiUrl("club");
        const url = Util.beautifyUrl(clubDetailUrl, [clubId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubsTask() {
        const url = ApiUrlConstant.getApiUrl("clubList");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getUnassignedMembersTask() {
        const url = ApiUrlConstant.getApiUrl("nonClubMembers");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteClubTask(clubId) {
        const clubDeleteUrl = ApiUrlConstant.getApiUrl("club");
        const url = Util.beautifyUrl(clubDeleteUrl, [clubId]);
        return Api.doDelete(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp;
            }
            throw resp;
        });
    }

    static getLocationsTask() {
        const url = ApiUrlConstant.getApiUrl("location");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubRolesTask() {
        const url = ApiUrlConstant.getApiUrl("clubRoles");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createClubTask(payload) {
        const url = ApiUrlConstant.getApiUrl("clubList");
        return Api.doPost(url, payload)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateClubTask(clubId, payload) {
        let url = ApiUrlConstant.getApiUrl("club");
        url = Util.beautifyUrl(url, [clubId]);
        return Api.doPut(url, payload)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static assignMemberTask(clubId, payload) {
        let url = ApiUrlConstant.getApiUrl("clubAddMembers");
        url = Util.beautifyUrl(url, [clubId]);
        return Api.doPost(url, payload)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static removeClubMemberTask(clubId, payload) {
        let url = ApiUrlConstant.getApiUrl("clubRemoveMembers");
        url = Util.beautifyUrl(url, [clubId]);
        return Api.doPost(url, payload)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static switchUserClubRole(request) {
        let url = ApiUrlConstant.getApiUrl("clubRole");
        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static resetClubSetting(clubId) {
        let url = ApiUrlConstant.getApiUrl("resetClubSettings");
        url = Util.beautifyUrl(url, [clubId])

        return Api.doPut(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static activateClubTask(clubId) {
        let url = ApiUrlConstant.getApiUrl("activateClub");
        url = Util.beautifyUrl(url, [clubId])

        return Api.doPut(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}