import { ApiUrlConstant } from "../../../Util/apiUrl.constant";
import { Api } from "../../../Util/api.service";
import { Util } from "../../../Util/util";

export class FinanceAdminService {

    static getLocationsList(year = new Date().getMonth()<=2 ? new Date().getFullYear()-1 : new Date().getFullYear()) {
        let url = ApiUrlConstant.getApiUrl("adminFinanceLocationList");
        url += `?year=${year}`;
        
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static getFinanceConfigYears() {
        let url = ApiUrlConstant.getApiUrl("adminFinanceConfigYears");

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static getLocationClubList(locationId, year) {
        let url = ApiUrlConstant.getApiUrl("adminFinanceLocationClubList");
        url += `?loc=${locationId}&year=${year}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static createLocationAllowanceDetails(locationId, year, requestJson) {
        let url = ApiUrlConstant.getApiUrl("adminFinanceLocationClubList");
        url += `/new?loc=${locationId}&year=${year}`;

        return Api.doPost(url, requestJson)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static updateLocationAllowanceDetails(locationId, year, requestJson) {
        let url = ApiUrlConstant.getApiUrl("adminFinanceLocationClubList");
        url += `/update?loc=${locationId}&year=${year}`;

        return Api.doPut(url, requestJson)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }

    static updateClubAllowanceDetails(clubId, year, requestJson) {
        let url = ApiUrlConstant.getApiUrl("adminFinanceUpdateClubAllowance");
        url += `${clubId}/update?year=${year}`;

        return Api.doPut(url, requestJson)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            })
    }
}