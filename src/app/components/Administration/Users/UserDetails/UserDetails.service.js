import {ApiUrlConstant} from "../../../../Util/apiUrl.constant";
import {Api} from "../../../../Util/api.service";
import {Util} from "../../../../Util/util";

export class UserDetailsServices{
    // add new user
    static addUser(user) {
        const url = ApiUrlConstant.getApiUrl("addUser");
        return Api.doPost(url, user, {})
        .then((resp) => {
            if(resp.status_code == '200') {
                return true
            }
            throw resp;            
        })
    }

    static updateUser(user, userId) {
        const updateUserUrl = ApiUrlConstant.getApiUrl("updateUser");
        const url = Util.beautifyUrl(updateUserUrl, [userId]);
        return Api.doPut(url, user, {})
        .then((resp) => {
            if(resp.status_code == '200') {
                return true
            }
            throw resp;            
        })
    }

    static getUserDetails(userId){
        const userDetailUrl = ApiUrlConstant.getApiUrl("user");
        const url = Util.beautifyUrl(userDetailUrl, [userId]);
        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getDepartments(){
        const url = ApiUrlConstant.getApiUrl("departments");
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getLocations(){
        const url = ApiUrlConstant.getApiUrl("locations");
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getProjects(){
        const url = ApiUrlConstant.getApiUrl("projects");
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getDesignations(){
        const url = ApiUrlConstant.getApiUrl("designations");
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getRoles(){
        const url = ApiUrlConstant.getApiUrl("userRoles");
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static resetPassword(userId) {
        let url = ApiUrlConstant.getApiUrl("resetPassword");
        url = Util.beautifyUrl(url, [userId]);
        return Api.doPost(url, {})
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }

    static getEmployeeType(){
        const url = ApiUrlConstant.getApiUrl("employeeType");
        return Api.doGet(url)
        .then((resp) => {
            if(resp.status_code == '200') {
                return resp.payload;
            }
            throw resp;
        })
    }
}