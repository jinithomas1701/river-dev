import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class BookingService {

    static getAllUserBookings() {
        let url = ApiUrlConstant.getApiUrl("getAllUserBookings");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static deleteBooking(hash) {
        const deleteUrl = ApiUrlConstant.getApiUrl("deleteBooking");
        const url = Util.beautifyUrl(deleteUrl, [hash])

        return Api.doDelete(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }
}