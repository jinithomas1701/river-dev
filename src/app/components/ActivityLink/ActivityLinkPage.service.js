import { ApiUrlConstant } from "../../Util/apiUrl.constant";
import { Api } from "../../Util/api.service";
import { Util } from "../../Util/util";

export class ActivityLinkService {

    static getUserActivityRoles(assignedId) {
        let url = ApiUrlConstant.getApiUrl("getUserActivityRole");
        url = Util.beautifyUrl(url, [assignedId]);

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static switchRole(roleCode) {
        let url = ApiUrlConstant.getApiUrl("switchRole");
        const roleObj = {
            newRole: roleCode
        };

        return Api.doPost(url, roleObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
}