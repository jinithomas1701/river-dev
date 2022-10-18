import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class SurveyService {
    static searchInvitees(query) {
        let url = ApiUrlConstant.getApiUrl("searchUsers");
        url = Util.beautifyUrl(url, ["survey", query]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createSurvey(survey) {
        const url = ApiUrlConstant.getApiUrl("createSurvey");
        
        return Api.doPost(url, survey)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }

    static updateSurvey(survey, surveyId) {
        let url = ApiUrlConstant.getApiUrl("survey");
        url = Util.beautifyUrl(url, [surveyId])

        return Api.doPut(url, survey)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getSurveys(scope, surveysType, pageNo = 0, size = 40) {
        let url = ApiUrlConstant.getApiUrl("getSurveys");
        url = Util.beautifyUrl(url, [scope, surveysType, pageNo, size]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
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

    static publishResult(surveyId) {
        let url = ApiUrlConstant.getApiUrl("publishResult");
        url = Util.beautifyUrl(url, [surveyId]);

        return Api.doPut(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getSurvey(surveyId) {
        let url = ApiUrlConstant.getApiUrl("survey");
        url = Util.beautifyUrl(url, [surveyId]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }
}