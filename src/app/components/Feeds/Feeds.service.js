import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class FeedsService {
    
    static getFeeds(page, size) {
        const feedsUrl = ApiUrlConstant.getApiUrl("feeds");
        const url = Util.beautifyUrl(feedsUrl, [page, size]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getNewFeeds(feedId) {
        const feedsUrl = ApiUrlConstant.getApiUrl("feeds");
        const url = Util.beautifyUrl(feedsUrl, ["refresh", feedId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubNames() {
        const url = ApiUrlConstant.getApiUrl("clubsNameList");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postStatusTask(statusRequest) {
        const url = ApiUrlConstant.getApiUrl("status");
        return Api.doPost(url, statusRequest)
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

    static updateAction(actionRequest) {
        const url = ApiUrlConstant.getApiUrl("updateAction");
        return Api.doPost(url, actionRequest)
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

    static getFeed(feedId) {
        let url = ApiUrlConstant.getApiUrl("feed");
        url = Util.beautifyUrl(url, [feedId]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static feedSearch(searchKey) {
        let url = ApiUrlConstant.getApiUrl("feedSearch");
        url = Util.beautifyUrl(url, [searchKey]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteFeed(feedId){
        let url = ApiUrlConstant.getApiUrl("feed");
        url = Util.beautifyUrl(url, [feedId]);

        return Api.doDelete(url)
        .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getRandomSurvey() {
        const url = ApiUrlConstant.getApiUrl("randomSurvey");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static castSurvey(surveyId, survey) {
        let url = ApiUrlConstant.getApiUrl("castSurvey");
        url = Util.beautifyUrl(url, [surveyId]);

        return Api.doPost(url, survey)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getUpcomingMeetings() {
        let url = ApiUrlConstant.getApiUrl("upcomingMeetings");
        url = Util.beautifyUrl(url, [7]);

        return Api.doGet(url)
        .then((resp) => {            
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getOngoingPolls() {
        const url = ApiUrlConstant.getApiUrl("openPolls");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}