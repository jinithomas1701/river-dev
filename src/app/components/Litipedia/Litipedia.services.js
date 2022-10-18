import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class LitipediaServices {
    static getAllTermsList(query) {
        let url = ApiUrlConstant.getApiUrl('litipedia');
        url = Util.beautifyUrl(url, [query]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getTerm(termId) {
        let url = ApiUrlConstant.getApiUrl('getLitipedia');
        url = Util.beautifyUrl(url, [termId]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static addTerm(term) {
        const url = ApiUrlConstant.getApiUrl('postLitipedia');

        return Api.doPost(url, term)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateTerm(term) {
        const url = ApiUrlConstant.getApiUrl('postLitipedia');

        return Api.doPut(url, term)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteTerm(termId) {
        let url = ApiUrlConstant.getApiUrl('updateLitipedia');
        url = Util.beautifyUrl(url, [termId]);

        return Api.doDelete(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getWordOfTheDay() {
        const url = ApiUrlConstant.getApiUrl('lpWOD');

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getMostViewed() {
        const url = ApiUrlConstant.getApiUrl('mostViewedLitipedias');

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getRecent() {
        const url = ApiUrlConstant.getApiUrl('recentLitipedias');

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}