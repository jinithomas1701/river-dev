import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class MyClubService {

    static getMyClub() {
        const url = ApiUrlConstant.getApiUrl("myClub");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }

            throw resp;
        })
    }

    static getPointsHistory(pageNo) {
        let url = ApiUrlConstant.getApiUrl("pointsHistory");
        url = Util.beautifyUrl(url, ["CLUB", pageNo]);

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postDiscussionMessage(messageRequest) {
        const url = ApiUrlConstant.getApiUrl("myclubDiscussionPost");
        return Api.doPost(url, messageRequest)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getDiscussions(pageNo, size) {
        let url = ApiUrlConstant.getApiUrl("myclubDiscussion");
        url = Util.beautifyUrl(url, [pageNo, size]);
        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateClubLogo(logo) {
        const url = ApiUrlConstant.getApiUrl("myclubUpdateLogo");

        return Api.doPut(url, logo)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }


    static updateClubSlogan(slogan) {
        const url = ApiUrlConstant.getApiUrl("myclubUpdateSlogan");

        return Api.doPut(url, slogan)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }

    static loadisActivityPointHistoryData(referenceCode) {
        let url = ApiUrlConstant.getApiUrl("getActivityPointHistory");
        url = Util.beautifyUrl(url, [referenceCode]);

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }
}