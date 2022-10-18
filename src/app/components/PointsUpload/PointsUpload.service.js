import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class PointsUploadService {

    static getPointsUpload(clubId) {
        let url = ApiUrlConstant.getApiUrl("getBulkPointsByClubId");
        url = Util.beautifyUrl(url, [clubId]);

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200") {
                return resp.payload;
            }

            throw resp;
        })
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
    
    static uploadData(data) {
        const url = ApiUrlConstant.getApiUrl("uploadBulkPoints");
        return Api.doUploadMultipart(url, data)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}