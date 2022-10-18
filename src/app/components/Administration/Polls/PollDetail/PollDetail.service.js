import {ApiUrlConstant} from "../../../../Util/apiUrl.constant";
import {Api} from "../../../../Util/api.service";
import {Util} from "../../../../Util/util";

export class PollDetailService {
    static getPoll(pollId){
        let url = ApiUrlConstant.getApiUrl('poll');
        url = Util.beautifyUrl(url, [pollId]);
        
        return Api.doGet(url).
        then((resp) => {
            if (resp.status_code == '200') {
                return resp.payload;    //Todo change to payload
            }
            throw resp;
        })
    }

    static createPoll(poll){
        const url = ApiUrlConstant.getApiUrl("createPoll");

        return Api.doPost(url, poll).
        then((resp) => {
            if (resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }

    static updatePoll(poll, pollId){
        let url = ApiUrlConstant.getApiUrl("updatePoll");
        url = Util.beautifyUrl(url, [pollId]);
        
        return Api.doPut(url, poll).
        then((resp) => {
            if (resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getClubsList() {
        const url = ApiUrlConstant.getApiUrl("clubsNameList");

        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        })
    }
}