import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";
// import { settings } from "cluster";

export class LitUpService {
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

    static deleteSuggestion(suggestionId) {
        let url = ApiUrlConstant.getApiUrl("deleteSuggestion");
        url = Util.beautifyUrl(url, [suggestionId]);
        return Api.doDelete(url, {})
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static startStopTopicSuggestions(topicId, request) {
        let url = ApiUrlConstant.getApiUrl("startStopSuggestion");
        url = Util.beautifyUrl(url, [topicId]);
        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getLitUpTopicDetails(topicId) {
        let url = ApiUrlConstant.getApiUrl("litupTopic");
        url = Util.beautifyUrl(url, [topicId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createTopic(topic) {
        const url = ApiUrlConstant.getApiUrl('litupTopics');

        return Api.doPost(url, topic)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static searchUser(query, scope) {
        let scopeValue = (scope == "admins") ? "users" : "users";
        let url = ApiUrlConstant.getApiUrl("searchUsers");
        url = Util.beautifyUrl(url, [scopeValue, query]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateIdeaSuggestion(topicId, request) {
        let url = ApiUrlConstant.getApiUrl("litUpSuggestion");
        url = Util.beautifyUrl(url, [topicId]);
        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postIdeaSuggestion(topicId, request) {
        let url = ApiUrlConstant.getApiUrl("litUpSuggestion");
        url = Util.beautifyUrl(url, [topicId]);
        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getPanel() {
        const url = ApiUrlConstant.getApiUrl('litupPanel');

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static voteIdea(vote, topicId, ideaId) {
        let url = ApiUrlConstant.getApiUrl("litUpVote");
        url = Util.beautifyUrl(url, [vote, topicId, ideaId]);
        return Api.doPost(url, {})
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static updatePanel(settings) {
        const url = ApiUrlConstant.getApiUrl('litupPanel');

        return Api.doPut(url, settings)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static declareWinner(topicId) {
        let url = ApiUrlConstant.getApiUrl('litupDeclare');
        url = Util.beautifyUrl(url, [topicId]);
        return Api.doPut(url, {})
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static generateVerificationCode() {
        let url = ApiUrlConstant.getApiUrl('generateCode');
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createWorkshop(request) {
        let url = ApiUrlConstant.getApiUrl('createWorkshop');
        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static resumeWorkshop(workshopId, request) {
        let url = ApiUrlConstant.getApiUrl('resumeWorkshop');
        url = Util.beautifyUrl(url, [workshopId]);
        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static stopWorkshop(workshopId) {
        let url = ApiUrlConstant.getApiUrl('stopWorkshop');
        url = Util.beautifyUrl(url, [workshopId]);
        return Api.doPut(url, {})
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static sentInvitation(topicId) {
        let url = ApiUrlConstant.getApiUrl('sentInvitation');
        url = Util.beautifyUrl(url, [topicId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static generateExcel(topicId) {
        let url = ApiUrlConstant.getApiUrl('exportToExcel');
        url = Util.beautifyUrl(url, [topicId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static isVerifiedLitupUser(suggestionId) {
        let url = ApiUrlConstant.getApiUrl('litupVerify');
        url = Util.beautifyUrl(url, [suggestionId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static verifyLitupUser(suggestionId, request) {
        let url = ApiUrlConstant.getApiUrl('litupVerify');
        url = Util.beautifyUrl(url, [suggestionId]);
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

    static getMyVote(suggestionId) {
        let url = ApiUrlConstant.getApiUrl('litupMyVote');
        url = Util.beautifyUrl(url, [suggestionId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getAllVotes(suggestionId) {
        let url = ApiUrlConstant.getApiUrl('litupAllVotes');
        url = Util.beautifyUrl(url, [suggestionId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postMyVote(suggestionId, request) {
        let url = ApiUrlConstant.getApiUrl("litupMyVote");
        url = Util.beautifyUrl(url, [suggestionId]);
        return Api.doPost(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static changeMultipleLevel(request) {
        let url = ApiUrlConstant.getApiUrl("changeMultipleLevel");
        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    

    static addRemoveIdeaLitupClient(request) {
        let url = ApiUrlConstant.getApiUrl("addRemoveIdeaLitupClient");
        return Api.doPut(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static resetClientPassword(topicId){        
        let url = ApiUrlConstant.getApiUrl("resetClientpassword");
        url = Util.beautifyUrl(url, [topicId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

}