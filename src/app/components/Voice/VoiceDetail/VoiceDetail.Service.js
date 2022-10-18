import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class VoiceDetailService {
    static getVoiceCouncils(){
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

    static refineVoice(request, voiceId, voiceHash) {
        let url = ApiUrlConstant.getApiUrl("refineVoice");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);
        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static searchVoiceUserTags(searchText){
        let url = ApiUrlConstant.getApiUrl("searchUsers");
        url = Util.beautifyUrl(url, ["users", query]);
        return Api.doGet(url)
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

    static makeVoice(voice){
        const url = ApiUrlConstant.getApiUrl("createVoice");

        return Api.doPost(url, voice, {})
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static getVoiceDetails(voiceId, username){
        let url = ApiUrlConstant.getApiUrl("voice");
        url = Util.beautifyUrl(url, [voiceId, username]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
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
}