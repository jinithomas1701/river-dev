import {ApiUrlConstant} from "../../../../Util/apiUrl.constant";
import {Api} from "../../../../Util/api.service";
import {Util} from "../../../../Util/util";

export class AdminActivitySummaryService {

    static getAdminActivitySummary(searchParams, interval = 10) {
        let url = ApiUrlConstant.getApiUrl("getActivitySummary");

        url = Util.beautifyUrl(url, [searchParams]);
        if(searchParams === "nil"){
            url = url.replace("/nil", "");
        }
        url += `?interval=${interval}`;

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getAdminActivitySummaryDetails(date, status, count, page) {
        let url = ApiUrlConstant.getApiUrl("getActivitySummaryDetails");
        url += `?day=${date}&status=${status}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubList(searchParams) {
        let url = ApiUrlConstant.getApiUrl("clubsListMinDetail");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
}