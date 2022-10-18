import {ApiUrlConstant} from "../../../../Util/apiUrl.constant";
import {Api} from "../../../../Util/api.service";
import {Util} from "../../../../Util/util";

export default class AdminVoicePageService {

    static getVoiceDepartments() {
        let url = ApiUrlConstant.getApiUrl("getManageVoiceDepartment");

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getDepartmentDetails(departmentId){
        let url = ApiUrlConstant.getApiUrl("getManageVoiceDepartmentDetails");
        url = Util.beautifyUrl(url, [departmentId]);

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateDepartmentDetails(departmentId, level, deptObj){
        let url = ApiUrlConstant.getApiUrl("updateManageVoiceDepartmentDetails");
        url = Util.beautifyUrl(url, [departmentId, level]);

        return Api.doPut(url, deptObj)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getMemberList() {
        let url = ApiUrlConstant.getApiUrl("memberListMinDetail");

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}