import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class VoiceService {
    static getVoices(urlTail){
        let url = ApiUrlConstant.getApiUrl("listVoices");
        url = Util.beautifyUrl(url, ["user", urlTail]);

        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static deleteVoice(voiceId, voiceHash){
        let url = ApiUrlConstant.getApiUrl("voice");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);

        return Api.doDelete(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }
}