import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class ReportService {

    static getClubsTask() {
        const url = ApiUrlConstant.getApiUrl("clubList");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
            return resp.payload;
            }
            throw resp;
        });
    }

    static generateReport(url, request) {
        url = ApiUrlConstant.getFullUrl(url);
        return Api.doDownload(url, request)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp;
            }
            throw resp;
        });
    }
}