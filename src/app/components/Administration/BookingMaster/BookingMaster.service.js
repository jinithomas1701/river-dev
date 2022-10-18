import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class BookingMasterService {

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
    
    static getBookingLocations() {
        let url = ApiUrlConstant.getApiUrl("getBookingRoomLocations");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getBookingRoomList(locationCode) {
        const clubDetailUrl = ApiUrlConstant.getApiUrl("getBookingRoomList");
        const url = Util.beautifyUrl(clubDetailUrl, [locationCode]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    

    static getBookingStatus(dataStamp, roomcode, bookingStatus) {
        const tempUrl = ApiUrlConstant.getApiUrl("getBookingStatus");
        const url = Util.beautifyUrl(tempUrl, [dataStamp, roomcode, bookingStatus]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static createHall(request) {
        let url = ApiUrlConstant.getApiUrl("createHall");
        return Api.doPost(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static deleteHall(code) {
        const deleteUrl = ApiUrlConstant.getApiUrl("deleteMeetingHall");
        const url = Util.beautifyUrl(deleteUrl, [code])

        return Api.doDelete(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        })
    }

    static editHall(request, code) {
        
        const tempUrl = ApiUrlConstant.getApiUrl("editMeetingHall");
        const url = Util.beautifyUrl(tempUrl, [code]);
        
        return Api.doPut(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
    
    static cancelBookingStatus(hash) {
        const deleteUrl = ApiUrlConstant.getApiUrl("cancelBookingStatus");
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