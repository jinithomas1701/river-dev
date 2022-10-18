import { ApiUrlConstant } from '../../../../Util/apiUrl.constant';
import { Api } from '../../../../Util/api.service';
import { Util } from '../../../../Util/util';


export default class VoiceService {

    static getVoiceList(role, search = "", groupBy = 'TY', filter = 'ALL', page = 0, count = 100) {
        let url = ApiUrlConstant.getApiUrl("getVoices");
        url += `?role=${role}&search=${encodeURIComponent(search)}&groupBy=${groupBy}&filter=${filter}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static getVoiceDetails(voiceId) {
        let url = ApiUrlConstant.getApiUrl("getVoiceDetails");
        url = Util.beautifyUrl(url, [voiceId]);

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static createVoice(voiceObj) {
        let url = ApiUrlConstant.getApiUrl("createVoiceWithType");

        return Api.doPost(url, voiceObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getDepartmentList() {
        let url = ApiUrlConstant.getApiUrl("getDepartments");

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getVoiceTypeList() {
        let url = ApiUrlConstant.getApiUrl("getVoiceTypes");

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static approveVoice(voiceId, approveObj) {
        let url = ApiUrlConstant.getApiUrl("approveVoice");
        url = Util.beautifyUrl(url, [voiceId]);

        return Api.doPut(url, approveObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static rejectVoice(voiceId, rejectObj) {
        let url = ApiUrlConstant.getApiUrl("rejectVoice");
        url = Util.beautifyUrl(url, [voiceId]);

        return Api.doPut(url, rejectObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static replyVoice(voiceId, replyObj) {
        let url = ApiUrlConstant.getApiUrl("replyVoice");
        url = Util.beautifyUrl(url, [voiceId]);

        return Api.doPut(url, replyObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static forwardVoice(voiceId, forwardObj) {
        let url = ApiUrlConstant.getApiUrl("forwardVoiceById");
        url = Util.beautifyUrl(url, [voiceId]);

        return Api.doPut(url, forwardObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static resolveVoice(voiceId, resolveObj) {
        let url = ApiUrlConstant.getApiUrl("resolveVoice");
        url = Util.beautifyUrl(url, [voiceId]);

        return Api.doPut(url, resolveObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static deescalateVoice(voiceId, deescalateObj) {
        let url = ApiUrlConstant.getApiUrl("deescalateVoice");
        url = Util.beautifyUrl(url, [voiceId]);

        return Api.doPut(url, deescalateObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static getDiscussion(discussionId) {
        let url = ApiUrlConstant.getApiUrl("loadCommentsFull");
        url = Util.beautifyUrl(url, [discussionId]);

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static editVoice(voiceId, editObj) {
        let url = ApiUrlConstant.getApiUrl("editVoice");
        url = Util.beautifyUrl(url, [voiceId]);

        return Api.doPut(url, editObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static submitDiscussion(discussionObj) {
        let url = ApiUrlConstant.getApiUrl("comment");

        return Api.doPost(url, discussionObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getVoiceFilterList(roleId) {
        let url = ApiUrlConstant.getApiUrl("getVoiceFilterList");
        url = Util.beautifyUrl(url, [roleId]);

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
}