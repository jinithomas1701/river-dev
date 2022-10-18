import {ApiUrlConstant} from '../../../Util/apiUrl.constant';
import {Api} from '../../../Util/api.service';
import {Util} from '../../../Util/util';

export default class KpiMasterService {

    static loadKpiList(searchTerm = "", page = 0, count = 10){
        let url = ApiUrlConstant.getApiUrl("getKpiList");
        url += `?search=${searchTerm}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static loadKpiDeatails(activityId){
        let url = ApiUrlConstant.getApiUrl("getKpiDetails");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
            .catch(() => {
            return {
                "id": 202,
                "title": "Business Appreciation",
                "categories": [
                    {
                        "label": "Received appreciation from Litmus7 Team leads/ Practice heads",
                        "code": "1",
                        "points": "1000"
                    }
                ],
                "hasRating": true,
                "activityRatingType": "C",
                "proposedClubPoints": 0,
                "loanable": false,
                "memberAssessmentPeriod": "Ongoing",
                "clubassessmentPeriod": "Ongoing",
                "referenceCode": "BUSAPP",
                "categoryLabel": "Appreciation Level",
                "starRatingLabel": "Appreciation Level",
                "pointDesc": "Member Point: 1000 to 5000 | Club Point: 1000 to 5000",
                "maximumNumberOfAssignees": -1,
                "slaDays": 0,
                "hasMultiplier": false
            };
        });
    }
}