import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class ActivityUserDetailServices {
    static getActivityMasters(){
        const url = ApiUrlConstant.getApiUrl("userActivityMasters");
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivity( activityId ){
        let url = ApiUrlConstant.getApiUrl("assignedActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static assignActivity(activity){
        const url = ApiUrlConstant.getApiUrl("assignUserActivity");

        return Api.doPost(url, activity, {})
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static updateActivity(activity, activityId){
        let url = ApiUrlConstant.getApiUrl("assignedActivity");
        url = Util.beautifyUrl(url, [activityId]);

        return Api.doPut(url, activity, {})
        .then((resp) => {
            if(resp && resp.status_code =="200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static searchUser(query) {
        let url = ApiUrlConstant.getApiUrl("search");
        url = Util.beautifyUrl(url, [query]);
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}