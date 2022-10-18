import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class VoiceAdminService {
    
    static getVoices(urlTail) {
        let url = ApiUrlConstant.getApiUrl("listVoices");
        url = Util.beautifyUrl(url, ["admin", urlTail]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCouncils() {
        let url = ApiUrlConstant.getApiUrl("search");
        url = Util.beautifyUrl(url, ["council"]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getVoiceDetails(voiceId, voiceHash) {
        let url = ApiUrlConstant.getApiUrl("voice");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postDiscussionMessage(messageRequest) {
        const url = ApiUrlConstant.getApiUrl("comment");
        return Api.doPost(url, messageRequest)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static searchUsers(query) {
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

    static tagUser(tagRequest, voiceId, voiceHash) {
        let url = ApiUrlConstant.getApiUrl("addVoiceTag");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);
        return Api.doPut(url, tagRequest)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static removeTaggedUser(tagRequest, voiceId, voiceHash) {
        let url = ApiUrlConstant.getApiUrl("removeVoiceTag");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);
        return Api.doPut(url, tagRequest)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static forwardToCouncil(forwardRequest, voiceId, voiceHash) {
        let url = ApiUrlConstant.getApiUrl("forwardVoice");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);
        return Api.doPut(url, forwardRequest)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static changeVoiceStatus(request, voiceId, voiceHash) {
        let url = ApiUrlConstant.getApiUrl("voiceStatus");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);
        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static getVoiceTypes(){
        const url = ApiUrlConstant.getApiUrl("voiceTypes");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }
}