import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class PollsService {
    static getPolls(){
        let url = ApiUrlConstant.getApiUrl("polls");
        url = Util.beautifyUrl(url, ["admin"])

        return Api.doGet(url).
        then((resp) => {
            if (resp.status_code == '200') {
                return resp.payload;
            }
            throw new Error('Network response was not ok.');
        })
        .catch (function (error) {
            throw new Error(error);
        });
    }

    static deletePoll(pollId){
        const deletePollUrl = ApiUrlConstant.getApiUrl("updatePoll");
        const url = Util.beautifyUrl(deletePollUrl, [pollId]);

        return Api.doDelete(url).
        then((resp) => {
            if (resp.status_code == "200") {
                return resp.payload;
            }
            throw new Error("Network response was not ok.");
        }).
        catch ((error) => {
            throw new Error(error);
        });
    }
}