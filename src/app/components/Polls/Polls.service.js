import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class PollsServices{
    static getPollsList(type){
        let url = ApiUrlConstant.getApiUrl("userPolls");
        url = Util.beautifyUrl(url, [type]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static doNominate(pollId){
        let url = ApiUrlConstant.getApiUrl("nominate");
        url = Util.beautifyUrl(url, [pollId]);

        return Api.doPost(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static markVote(pollId, candidate){
        let url = ApiUrlConstant.getApiUrl("vote");
        url = Util.beautifyUrl(url, [pollId]);

        return Api.doPost(url, candidate, {})
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }
}