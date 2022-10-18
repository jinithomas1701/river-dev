import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";
// import { settings } from "cluster";

export class LitUpSuggestionDetailService {
    static getLitUpTopics() {
        let url = ApiUrlConstant.getApiUrl("litupTopics");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getLitUpSuggestionDetail(suggestionId) {
        let url = ApiUrlConstant.getApiUrl("getSuggestionDetail");
        url = Util.beautifyUrl(url, [suggestionId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getLitUpSuggestionLevels() {
        let url = ApiUrlConstant.getApiUrl("getSuggestionLevels");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static changeLitUpSuggestionLevel(request) {
        let url = ApiUrlConstant.getApiUrl("changeSuggestionLevel");
        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static downloadAttachment(suggestionId) {
        let url = ApiUrlConstant.getApiUrl('downloadAttachment');
        url = Util.beautifyUrl(url, [suggestionId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static submitOpinion(suggestionId, request) {
        let url = ApiUrlConstant.getApiUrl("submitOpinion");
        url = Util.beautifyUrl(url, [suggestionId]);
        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getBucketTypes() {
        let url = ApiUrlConstant.getApiUrl("getBucketTypes");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}