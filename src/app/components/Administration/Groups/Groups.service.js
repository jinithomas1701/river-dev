import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class GroupsService {
    
    static getGroupDetailTask(groupId, username) {
        const groupDetailUrl = ApiUrlConstant.getApiUrl("viewGroup");
        const url = Util.beautifyUrl(groupDetailUrl, [groupId, username]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getGroupsTask() {
        const url = ApiUrlConstant.getApiUrl("groupList");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteGroupTask(groupId, hash) {
        const groupDeleteUrl = ApiUrlConstant.getApiUrl("deleteGroup");
        const url = Util.beautifyUrl(groupDeleteUrl, [groupId, hash]);
        return Api.doDelete(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp;
            }
            throw resp;
        });
    }

    static createGroupTask(payload) {
        const url = ApiUrlConstant.getApiUrl("groupList");
        return Api.doPost(url, payload)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateGroupTask(groupId, username, payload) {
        let url = ApiUrlConstant.getApiUrl("viewGroup");
        url = Util.beautifyUrl(url, [groupId, username]);
        return Api.doPut(url, payload)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static searchMembers(query) {
        let url = ApiUrlConstant.getApiUrl("searchUsers");
        url = Util.beautifyUrl(url, ["councils-users", query]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}