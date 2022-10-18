import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class MeetingService {
    
    static getAllMeetings(currentPage, size = 10) {
        let url = ApiUrlConstant.getApiUrl("meetings");
        url = Util.beautifyUrl(url, [currentPage, size]);
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteMeeting(meetingId) {
        let url = ApiUrlConstant.getApiUrl("meeting");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doDelete(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getMeetingTask(meetingId) {
        let url = ApiUrlConstant.getApiUrl("meeting");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static addMeetingNoteTask(meetingId, request) {
        let url = ApiUrlConstant.getApiUrl("meetingNotes");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static markMeetingAttendanceTask(meetingId, request) {
        let url = ApiUrlConstant.getApiUrl("meetingAttendance");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static searchInvitees(type, query) {
        let url = ApiUrlConstant.getApiUrl("searchUsers");
        url = Util.beautifyUrl(url, [type , query]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getMeetingTypes() {
        const url = ApiUrlConstant.getApiUrl("meetingTypes");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createMeetingTask(request) {
        const url = ApiUrlConstant.getApiUrl("createMeeting");
        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }   
            throw resp;
        });
    }

    static updateMeetingTask(meetingId, request) {
        let url = ApiUrlConstant.getApiUrl("meeting");
        url = Util.beautifyUrl(url, [meetingId]);
        return Api.doPut(url, request)
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

    static getClubLocation(clubId) {
        let url = ApiUrlConstant.getApiUrl("clubLocation");
        url = Util.beautifyUrl(url, [clubId]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}