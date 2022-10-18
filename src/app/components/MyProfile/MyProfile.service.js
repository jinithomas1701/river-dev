import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class MyProfileService {

    static getMyProfile() {
        const url = ApiUrlConstant.getApiUrl("myProfile");

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
        url = Util.beautifyUrl(url, ["USER", pageNo]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static changePassword(passwordBody) {
        const url = ApiUrlConstant.getApiUrl("changePassword");

        return Api.doPost(url, passwordBody)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }

    static updateProfileImage(blob) {
        const url = ApiUrlConstant.getApiUrl("updateProfileAvatar");

        return Api.doPut(url, blob)
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