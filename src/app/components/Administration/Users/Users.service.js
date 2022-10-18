import {ApiUrlConstant} from "../../../Util/apiUrl.constant";
import {Api} from "../../../Util/api.service";
import {Util} from "../../../Util/util";

export class UsersService {
    // get Users list
    static fetchUsers(search= '', page= 0, size=20, status = "AL", club = "", entity = "", location = "") {
        let url = ApiUrlConstant.getApiUrl("usersList");
        url = Util.beautifyUrl(url, [search, page, size, status, club]);
        url += `&entity=${entity}&location=${location}`;
        
        return Api.doGet(url)
        .then((resp) => {
            if (resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static addUser(user){
        const url = ApiUrlConstant.getApiUrl("verify");
        const credentials = {
            "username" : username,
            "otp" : otp
        }

        return Api.doPost(url, credentials).then((resp) => {
            if(resp.ok) {
                return resp.json()
            }
            throw resp;
        })
    }

    static deleteUser(userId){
        const userDeleteUrl = ApiUrlConstant.getApiUrl("user");
        const url = Util.beautifyUrl(userDeleteUrl, [userId]);
        return Api.doDelete(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubList(){
        const url = ApiUrlConstant.getApiUrl("clubList");
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getEntityList(){
        const url = ApiUrlConstant.getApiUrl("entityList");
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getLocationList(entity = ""){
        let url = ApiUrlConstant.getApiUrl("location");
        url += `?entity=${entity}`;
        
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }
}