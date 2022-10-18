import { ApiUrlConstant } from "../../Util/apiUrl.constant";
import { Api } from "../../Util/api.service";
import { Util } from "../../Util/util";

export default class GroupMeetingsService {

    static getGroupMeetingsList(search = "", type = "CM", status = "ALL", groupBy = "ST", page = 0, count = 10) {
        let url = ApiUrlConstant.getApiUrl("getGroupMeetingsList");
        url += `?search=${search}&type=${type}&status=${status}&groupBy=${groupBy}&page=${page}&count=${count}`;
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getInviteesList(search = "", page = "") {
        let url = ApiUrlConstant.getApiUrl("getGroupMeetingsInviteesList");
        url += `?search=${search}&page=${page}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getGroupMeetingsDetails(meetingId) {
        let url = ApiUrlConstant.getApiUrl("groupMeetings");
        url += `${meetingId}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getMeetingLocation(request) {
        let url = ApiUrlConstant.getApiUrl("getGroupMeetingsLocation");

        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static startGroupMeetings(meetingId, currentTime) {
        let url = ApiUrlConstant.getApiUrl("groupMeetings");
        url += `${meetingId}/start`;

        return Api.doPut(url, currentTime)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static endGroupMeetings(meetingId, currentTime) {
        let url = ApiUrlConstant.getApiUrl("groupMeetings");
        url += `${meetingId}/end`;

        return Api.doPut(url, currentTime)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static putAttendenceDetail(request, meetingId) {
        let url = ApiUrlConstant.getApiUrl("putAttendenceDetail");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleMeetingCreate(request) {
        let url = ApiUrlConstant.getApiUrl("createGroupMeetings");

        return Api.doPost(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static postMinutesOfMeeting(request, meetingId) {
        let url = ApiUrlConstant.getApiUrl("postMinutesOfMeeting");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doPost(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getClubMemeberAttendeesList(meetingId) {
        let url = ApiUrlConstant.getApiUrl("getClubMemeberAttendeesList");
        url += `?meetingsId=${meetingId}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static doMeetingDelete(Id, type, request) {
        let url = ApiUrlConstant.getApiUrl("deleteMeeting");
        url += `?type=${type}`;
        url = Util.beautifyUrl(url, [Id])

        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code) {
                    return resp.payload;
                }
                return resp;
            })
    }

    static putUpdateMeeting(request, meetingId) {
        let url = ApiUrlConstant.getApiUrl("updateMeeting");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static putMeetingLocationPreview(request) {
        let url = ApiUrlConstant.getApiUrl("putMeetingLocationPreview");
        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getSuperParentDetail(meetingId){
        let url = ApiUrlConstant.getApiUrl("getSuperParentDetail");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static putUpdatedMeeting(meetingId, request){
        let url = ApiUrlConstant.getApiUrl("putUpdatedMeeting");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getRecurringMeetingHistory(meetingId) {
        let url = ApiUrlConstant.getApiUrl("getRecurringMeetingHistory");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
}