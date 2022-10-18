import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class BulkUploadService {

    static uploadExcel(data,urlKey) {
        const url = ApiUrlConstant.getApiUrl(urlKey);//excelValidate
        return Api.doUploadMultipart(url, data)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static confirmUpload(confirmation, hash,urlKey) {
        let url = ApiUrlConstant.getApiUrl(urlKey);//"excelUpload"
        url = Util.beautifyUrl(url, [confirmation, hash]);
        return Api.doPost(url, {})
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                
                return resp.payload;
            }
            throw resp;
        });
    }

    static downloadTemplate(scope) {
        let url = ApiUrlConstant.getApiUrl("templates");
        url = Util.beautifyUrl(url, [scope]);

        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }
}