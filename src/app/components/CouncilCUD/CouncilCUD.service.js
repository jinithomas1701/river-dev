import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class CouncilCUDService {
    static loadAllCuds(query) {
        let url = ApiUrlConstant.getApiUrl("councilCud");
        url = Util.beautifyUrl(url, [query])

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static approveCud(cudId, bucket) {
        let url = ApiUrlConstant.getApiUrl("approveCud");
        url = Util.beautifyUrl(url, [cudId])

        return Api.doPost(url, bucket)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static rejectCud(cudId) {
        let url = ApiUrlConstant.getApiUrl("rejectCud");
        url = Util.beautifyUrl(url, [cudId])

        return Api.doPost(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getBucketTypes() {
        const url = ApiUrlConstant.getApiUrl("cudBucketTypeLists");

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
}