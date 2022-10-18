import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class AddEditBookingService {

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

    static getBookingFacilities() {
        let url = ApiUrlConstant.getApiUrl("getBookingFacilities");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getBookingMeetingTypes() {
        let url = ApiUrlConstant.getApiUrl("getBookingMeetingTypes");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static requestBooking(request) {
        let url = ApiUrlConstant.getApiUrl("requestBooking");
        return Api.doPost(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateBooking(request, hash) {
        
        const tempUrl = ApiUrlConstant.getApiUrl("updateBooking");
        const url = Util.beautifyUrl(tempUrl, [hash]);
        
        return Api.doPut(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getAllBookings(timeStamp) {
        const tempUrl = ApiUrlConstant.getApiUrl("getAllBookings");
        const url = Util.beautifyUrl(tempUrl, [timeStamp]);

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getSingleBookingDetail(hash) {
        const tempUrl = ApiUrlConstant.getApiUrl("getSingleBookingDetail");
        const url = Util.beautifyUrl(tempUrl, [hash]);

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }
}