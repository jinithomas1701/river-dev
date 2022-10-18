import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";

export default class FinanceService {

    //api for club treasurer

    static getClubTreasurerDashboardList(type="ALL",status="CR",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("clubTreasurerDashboardListTransactionList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getClubTreasurerDashboardChartData(year= new Date().getMonth() <= 2 ? new Date().getFullYear()-1:new Date().getFullYear()){
        let url = ApiUrlConstant.getApiUrl("clubTreasurerDashboardChartData");
        url += `?year=${year}`;
        
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getClubTreasurerTransactionList(type="ALL",status="ALL",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("clubTreasurerDashboardListTransactionList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getClubTreasurerHistoryList(type="ALL",status="ALL",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("clubTreasurerHistoryList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static createTransaction(payload) {
        let url = ApiUrlConstant.getApiUrl("clubTreasurerCreateDeleteArchiveTransaction");
        
        return Api.doPost(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getClubTreasurerDockTransactionDetails(id) {
        let url = ApiUrlConstant.getApiUrl("clubTreasurerDockItemSubmitBills");
        url += `${id}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getClubTreasurerDockDiscussionDetails(id) {
        let url = ApiUrlConstant.getApiUrl("getOrPostDiscussionComment");
        url += `${id}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static postClubTreasurerDockDiscussionDetails(payload) {
        let url = ApiUrlConstant.getApiUrl("getOrPostDiscussionComment");
        
        return Api.doPost(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static archiveClubTreasurerTransaction(id){
        let url = ApiUrlConstant.getApiUrl("clubTreasurerCreateDeleteArchiveTransaction");
        url += `${id}/archive`;

        return Api.doPut(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static submitBills(id, payload) {
        let url = ApiUrlConstant.getApiUrl("clubTreasurerDockItemSubmitBills");
        url += `${id}/submit/`

        return Api.doPut(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static deleteClubTreasurerTransaction(id){
        let url = ApiUrlConstant.getApiUrl("clubTreasurerCreateDeleteArchiveTransaction");
        url += `${id}/delete`;

        return Api.doPut(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }


    //api for finance team

    static getFinanceTeamDashboardList(type="MA",status="RE",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("financeTeamDashboardListTransactionList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getFinanceTeamDashboardClubList(){
        let url = ApiUrlConstant.getApiUrl("landerClubList");

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getFinanceTeamDashboardChartData(clubId="21",year= new Date().getMonth() <= 2 ? new Date().getFullYear()-1:new Date().getFullYear()){
        let url = ApiUrlConstant.getApiUrl("financeTeamDashboardChartData");
        url += `?club_id=${clubId}&year=${year}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getFinanceTeamTransactionList(type="ALL",status="ALL",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("financeTeamDashboardListTransactionList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getFinanceTeamHistoryList(type="ALL",status="ALL",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("financeTeamHistoryList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getFinanceTeamDockTransactionDetails(id) {
        let url = ApiUrlConstant.getApiUrl("financeTeamDockItem");
        url += `${id}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getFinanceTeamDockDiscussionDetails(id) {
        let url = ApiUrlConstant.getApiUrl("getOrPostDiscussionComment");
        url += `${id}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static postFinanceTeamDockDiscussionDetails(payload) {
        let url = ApiUrlConstant.getApiUrl("getOrPostDiscussionComment");
        
        return Api.doPost(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static approveFinanceTeamTransaction(id, payload) {
        let url = ApiUrlConstant.getApiUrl("financeTeamApproveRejectCreditCloseDeescalateTransaction");
        url += `${id}/approve/`

        return Api.doPut(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static rejectFinanceTeamTransaction(id, payload) {
        let url = ApiUrlConstant.getApiUrl("financeTeamApproveRejectCreditCloseDeescalateTransaction");
        url += `${id}/reject/`

        return Api.doPut(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static creditTransaction(id, payload) {
        let url = ApiUrlConstant.getApiUrl("financeTeamApproveRejectCreditCloseDeescalateTransaction");
        url += `${id}/credit/`

        return Api.doPut(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static closeTransaction(id, payload) {
        let url = ApiUrlConstant.getApiUrl("financeTeamApproveRejectCreditCloseDeescalateTransaction");
        url += `${id}/close/`

        return Api.doPut(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static deescalateTransaction(id, payload) {
        let url = ApiUrlConstant.getApiUrl("financeTeamApproveRejectCreditCloseDeescalateTransaction");
        url += `${id}/de-escalate/`

        return Api.doPut(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    //api for cfo

    static getCfoDashboardList(type="MA",status="RE",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("cfoDashboardListTransactionList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getCfoDashboardClubList(){
        let url = ApiUrlConstant.getApiUrl("landerClubList");

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getCfoDashboardChartData(clubId="21",year=new Date().getMonth() <= 2 ? new Date().getFullYear()-1:new Date().getFullYear()){
        let url = ApiUrlConstant.getApiUrl("cfoDashboardChartData");
        url += `?club_id=${clubId}&year=${year}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getCfoTransactionList(type="ALL",status="ALL",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("cfoDashboardListTransactionList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getCfoHistoryList(type="ALL",status="ALL",groupBy="DT",search="",page="0",count="10") {
        let url = ApiUrlConstant.getApiUrl("cfoHistoryList");
        url += `?type=${type}&status=${status}&groupBy=${groupBy}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getCfoDockTransactionDetails(id) {
        let url = ApiUrlConstant.getApiUrl("cfoDockItem");
        url += `${id}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static getCfoDockDiscussionDetails(id) {
        let url = ApiUrlConstant.getApiUrl("getOrPostDiscussionComment");
        url += `${id}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static postCfoDockDiscussionDetails(payload) {
        let url = ApiUrlConstant.getApiUrl("getOrPostDiscussionComment");
        
        return Api.doPost(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static approveCfoTransaction(id, payload) {
        let url = ApiUrlConstant.getApiUrl("cfoApproveRejectTransaction");
        url += `${id}/approve/`

        return Api.doPut(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

    static rejectCfoTransaction(id, payload) {
        let url = ApiUrlConstant.getApiUrl("cfoApproveRejectTransaction");
        url += `${id}/reject/`

        return Api.doPut(url, payload)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
        });
    }

}