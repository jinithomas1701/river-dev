import { ApiUrlConstant } from "../../Util/apiUrl.constant";
import { Api } from "../../Util/api.service";
import { Util } from '../../Util/util';


export default class AnnouncementService {
    static getAnnouncementWhatsNewList(search = "", filter = "", page = "", count = "") {
        let url = ApiUrlConstant.getApiUrl("getAnnouncementWhatsNewList");
        url += `?search=${search}&filter=${filter}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static getAnnouncementWhatsHappeningList(clubs = "", statuses = "ALL", search = "", page = "", count = "") {
        let url = ApiUrlConstant.getApiUrl("getAnnouncementWhatsHappeningList");
        url += `?clubs=${clubs}&statuses=${statuses}&search=${search}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static getTaskDetail(id) {
        let url = ApiUrlConstant.getApiUrl("getTaskDetail");
        url += `${id}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static getAnnouncementProblemList(search = "", filter = "", statuses = "", groupBy = "", page = "", count = "") {
        let url = ApiUrlConstant.getApiUrl("getAnnouncementProblemList");
        url += `?search=${search}&filter=${filter}&statuses=${statuses}&groupBy=${groupBy}&page=${page}&count=${count}`;
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getCreateAnnouncementProblemList(search = "", statuses = "", clubs = "", page = 0, count = 100) {
        let url = ApiUrlConstant.getApiUrl("getAnnouncementProblemList");
        url += `?search=${search}&statuses=${statuses}&clubs=${clubs}&page=${page}&count=${count}`;
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getProblemDetails(id) {
        let url = ApiUrlConstant.getApiUrl("getProblemDetails");
        url += `${id}`;

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static postCreateAnnouncement(announcementObj) {
        let url = ApiUrlConstant.getApiUrl("postCreateAnnouncement");

        return Api.doPost(url, announcementObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static doTaskDelete(Id) {
        const deleteTaskUrl = ApiUrlConstant.getApiUrl("doTaskDelete");
        const url = Util.beautifyUrl(deleteTaskUrl, [Id])

        return Api.doDelete(url)
            .then((resp) => {
                if (resp && resp.status_code) {
                    return resp.payload;
                }
                return resp;
            })
    }

    static getClubList() {
        let url = ApiUrlConstant.getApiUrl("landerClubList");
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleUpdateStatusStartProgress(object, taskId) {
        let url = ApiUrlConstant.getApiUrl("handleUpdateStatusStartProgress");
        url = Util.beautifyUrl(url, [taskId]);

        return Api.doPut(url, object)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleUpdateStatusCompleted(object, taskId) {
        let url = ApiUrlConstant.getApiUrl("handleUpdateStatusCompleted");
        url = Util.beautifyUrl(url, [taskId]);

        return Api.doPut(url, object)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleUpdateStatusUpcoming(object, taskId) {
        let url = ApiUrlConstant.getApiUrl("handleUpdateStatusUpcoming");
        url = Util.beautifyUrl(url, [taskId]);

        return Api.doPut(url, object)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleTaskUpdate(object, taskId) {
        let url = ApiUrlConstant.getApiUrl("handleTaskUpdate");
        url = Util.beautifyUrl(url, [taskId]);

        return Api.doPut(url, object)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static handleTagSelect(search = "", page = "") {
        let url = ApiUrlConstant.getApiUrl("handleTagSelect");
        url += `?search=${search}&page=${page}`;
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static handlePostSolutionWithProblem(announcementObj) {
        let url = ApiUrlConstant.getApiUrl("handlePostSolutionWithProblem");

        return Api.doPost(url, announcementObj)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static handleAddSolutionForProblem(request, problemId) {
        let url = ApiUrlConstant.getApiUrl("handleAddSolutionForProblem");
        console.log(problemId);
        url = Util.beautifyUrl(url, [problemId]);
        return Api.doPost(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static userDetails() {
        let url = ApiUrlConstant.getApiUrl("userDetails");

        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleStateProblem(request) {
        let url = ApiUrlConstant.getApiUrl("handleStateProblem");
        return Api.doPost(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleOnUpdateProblem(request, problemId) {
        let url = ApiUrlConstant.getApiUrl("handleOnUpdateProblem");
        url = Util.beautifyUrl(url, [problemId]);

        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleProblemClose(comment, problemId) {
        let url = ApiUrlConstant.getApiUrl("handleProblemClose");
        url = Util.beautifyUrl(url, [problemId]);

        return Api.doPut(url, comment)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static handleSolutionApprove(comment, solutionId) {
        let url = ApiUrlConstant.getApiUrl("handleSolutionApprove");
        url = Util.beautifyUrl(url, [solutionId]);

        return Api.doPut(url, comment)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }


    static handleTaskInterested(request, taskId) {
        let url = ApiUrlConstant.getApiUrl("handleTaskInterested");
        url = Util.beautifyUrl(url, [taskId]);

        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getAnnouncementMyProblemList(search = "", statuses = "", groupBy = "", page = "", count = "") {
        let url = ApiUrlConstant.getApiUrl("getAnnouncementMyProblemList");
        url += `?search=${search}&statuses=${statuses}&groupBy=${groupBy}&page=${page}&count=${count}`;
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }


    static handleTaskApprove(request, taskId) {
        let url = ApiUrlConstant.getApiUrl("handleTaskApprove");
        url = Util.beautifyUrl(url, [taskId]);

        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }

    static getSolutionDetails(problemId) {
        let url = ApiUrlConstant.getApiUrl("getSolutionDetails");
        url = Util.beautifyUrl(url, [problemId]);
        return Api.doGet(url)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
    static putSolutionDetails(request, solutionId) {
        let url = ApiUrlConstant.getApiUrl("putSolutionDetails");
        url = Util.beautifyUrl(url, [solutionId]);
        return Api.doPut(url, request)
            .then((resp) => {
                if (resp && resp.status_code == "200") {
                    return resp.payload;
                }
                throw resp;
            });
    }
}