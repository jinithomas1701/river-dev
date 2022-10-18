import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class MeetingService {
    
    static getAllMeetings(pageNo, size = 10) {
        let url = ApiUrlConstant.getApiUrl("meetings");
        //url = Util.beautifyUrl(url, [pageNo, size]);

        return Api.doGet(url)
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

    static rateMeetingTask(meetingId, request) {
        let url = ApiUrlConstant.getApiUrl("meetiingRating");
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
}