import {ApiUrlConstant} from "../../../../Util/apiUrl.constant";
import {Api} from "../../../../Util/api.service";
import {Util} from "../../../../Util/util";

export class AdminDashboardService {

    static getComparePoints(){
        let url = ApiUrlConstant.getApiUrl("dashClubCompare");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getPillarStats() {
        let url = ApiUrlConstant.getApiUrl("dashClubPillar");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCouncilStats() {
        let url = ApiUrlConstant.getApiUrl("councilStats");
        url = Util.beautifyUrl(url, [Util.getCurrentFinancialYear()]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getLastWeekResults(pageNo) {
        let url = ApiUrlConstant.getApiUrl("dashboardLastWeek");
        url = Util.beautifyUrl(url, [pageNo]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityDetail(id, context = 'partial', search, status='all', pageNo=0, pageSize) {
        let urlLabel = '';
        const role = Util.getActiveRole();
        urlLabel = 'dashboardAdminActivityDetail';
        urlLabel = ApiUrlConstant.getApiUrl(urlLabel);
        const searchParams = [id];

        context ? searchParams.push('?context='+context) : searchParams.push('');
        search ? searchParams.push('&search='+search) : searchParams.push('');
        status ? searchParams.push('&status='+status) : searchParams.push('');

        searchParams.push('&page='+pageNo);
        searchParams.push('&count='+pageSize);

        let url = Util.beautifyUrl(urlLabel, searchParams);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivities(pageNo = 0, query = '', searchTerm = '') {
        const PAGE_SIZE = 10;
        const context = Util.getActiveRole();
        let urlLabel = 'dashClubActivity';

        urlLabel = 'dashboardAdminActivities';
        let url = ApiUrlConstant.getApiUrl(urlLabel);
        url = url.replace('president/', 'admin/');

        if (urlLabel == 'dashClubActivity') {
            url = Util.beautifyUrl(url, [Util.getCurrentFinancialYear(), pageNo, query]);
        } else {
            let queryParam = '?page='+pageNo+'&count='+PAGE_SIZE;
            queryParam = (searchTerm ? queryParam+'&search='+searchTerm : queryParam);
            url = Util.beautifyUrl(url, [queryParam]);
        }


        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCouncilActivities(pageNo, query) {
        let url = ApiUrlConstant.getApiUrl("councilActivities");
        url = Util.beautifyUrl(url, [Util.getCurrentFinancialYear(), pageNo, query]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static changeVoiceStatus(request, voiceId, voiceHash) {
        let url = ApiUrlConstant.getApiUrl("voiceStatus");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);
        url = url.replace('president/', 'admin/');

        return Api.doPut(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getVoices(pageNo, query) {
        let url = ApiUrlConstant.getApiUrl("dashClubVoices");
        url = Util.beautifyUrl(url, [pageNo, query]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCouncilVoices(pageNo, query) {
        let url = ApiUrlConstant.getApiUrl("councilVoices");
        url = Util.beautifyUrl(url, [pageNo, query]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCommitments(pageNo) {
        let url = ApiUrlConstant.getApiUrl("dashClubCommitment");
        url = Util.beautifyUrl(url, [pageNo]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCouncilCuds(pageNo) {
        let url = ApiUrlConstant.getApiUrl("councilCuds");
        url = Util.beautifyUrl(url, [Util.getCurrentFinancialYear(), pageNo]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityCategories() {
        let url = ApiUrlConstant.getApiUrl("activityCategories");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static createCommitment(commitment){
        let url = ApiUrlConstant.getApiUrl("commitment");
        url = url.replace('president/', 'admin/');

        return Api.doPost(url, commitment)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static deleteCommitment(commitmentId){
        let url = ApiUrlConstant.getApiUrl("deleteCommitment");
        url = Util.beautifyUrl(url, [commitmentId]);
        url = url.replace('president/', 'admin/');

        return Api.doDelete(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateCommitmentStatus(commitment){
        let url = ApiUrlConstant.getApiUrl("commitment");
        url = url.replace('president/', 'admin/');

        return Api.doPut(url, commitment)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCommitmentsStatuses() {
        let url = ApiUrlConstant.getApiUrl("commitmentStatus");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCommitmentsList() {
        let url = ApiUrlConstant.getApiUrl("commitment");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getTargetsList() {
        let url = ApiUrlConstant.getApiUrl("target");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getYearsList() {
        let url = ApiUrlConstant.getApiUrl("fyList");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubsList() {
        let url = ApiUrlConstant.getApiUrl("clubsListMinDetail");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createCommitment(commitment) {
        let url = ApiUrlConstant.getApiUrl("commitment");
        url = url.replace('president/', 'admin/');

        return Api.doPost(url, commitment)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateClubTarget(targetObj) {
        let url = ApiUrlConstant.getApiUrl("targetEdit");
        url = url.replace('president/', 'admin/');

        return Api.doPut(url, targetObj)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static createClubTarget(targetObj) {
        let url = ApiUrlConstant.getApiUrl("targetEdit");
        url = url.replace('president/', 'admin/');

        return Api.doPost(url, targetObj)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getFocusAreasList() {
        let url = ApiUrlConstant.getApiUrl("focusAreas");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static searchUser(query) {
        let url = ApiUrlConstant.getApiUrl("search");
        url = Util.beautifyUrl(url, [query]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubMembers() {
        let url = ApiUrlConstant.getApiUrl("clubMembers");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityMasters() {
        let url = ApiUrlConstant.getApiUrl("masterActivities");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getWizardActivityMasters(id) {
        let url = ApiUrlConstant.getApiUrl("wizardmasetrActivities");
        url = Util.beautifyUrl(url, [id]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getVoiceTypes() {
        let url = ApiUrlConstant.getApiUrl("voiceTypes");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static saveWizard(step, request) {
        let url = ApiUrlConstant.getApiUrl("saveClubSettings");
        url = Util.beautifyUrl(url, [step]);
        url = url.replace('president/', 'admin/');

        return Api.doPut(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static finishSettings() {
        let url = ApiUrlConstant.getApiUrl("finishSettings");
        url = url.replace('president/', 'admin/');

        return Api.doPost(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static checkSetupFinished() {
        let url = ApiUrlConstant.getApiUrl("finishSettings");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static isClubSettingsFinish() {
        let url = ApiUrlConstant.getApiUrl("isClubSetupFinished");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static assignActivity(activityId, object) {
        let url = ApiUrlConstant.getApiUrl("assignActivity");
        url = Util.beautifyUrl(url, [activityId]);
        url = url.replace('president/', 'admin/');

        return Api.doPost(url, object)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static approveActivity(activityId, object) {
        let url = ApiUrlConstant.getApiUrl("approveActivityCP");
        url = Util.beautifyUrl(url, [activityId]);
        url = url.replace('president/', 'admin/');

        return Api.doPut(url, object)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static rejectActivity(activityId) {
        let url = ApiUrlConstant.getApiUrl("rejectActivityCP");
        url = Util.beautifyUrl(url, [activityId]);
        url = url.replace('president/', 'admin/');

        return Api.doPut(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static unassignUser(activityId, object) {
        let url = ApiUrlConstant.getApiUrl("unassignUser");
        url = Util.beautifyUrl(url, [activityId]);
        url = url.replace('president/', 'admin/');

        return Api.doPost(url, object)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubSettings() {
        let url = ApiUrlConstant.getApiUrl("clubSettings");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getRecentMeeting() {
        let url = ApiUrlConstant.getApiUrl("dashClubRecentMeeting");
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCouncils() {
        let url = ApiUrlConstant.getApiUrl("search");
        url = Util.beautifyUrl(url, ["council"]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static forwardToCouncil(forwardRequest, voiceId, voiceHash) {
        let url = ApiUrlConstant.getApiUrl("forwardVoice");
        url = Util.beautifyUrl(url, [voiceId, voiceHash]);
        url = url.replace('president/', 'admin/');

        return Api.doPut(url, forwardRequest)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postDiscussionMessage(messageRequest) {
        let url = ApiUrlConstant.getApiUrl("comment");
        url = url.replace('president/', 'admin/');

        return Api.doPost(url, messageRequest)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static startStopMeetingTask(meetingId, request) {
        let url = ApiUrlConstant.getApiUrl("meetingStart");
        url = Util.beautifyUrl(url, [meetingId]);
        url = url.replace('president/', 'admin/');

        return Api.doPost(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }   
            throw resp;
        });
    }

    static councilApproveActivity(activityId, object) {
        let url = ApiUrlConstant.getApiUrl("councilAcceptActivity");
        url = Util.beautifyUrl(url, [activityId]);
        url = url.replace('president/', 'admin/');

        return Api.doPut(url, object)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static councilRejectActivity(activityId) {
        let url = ApiUrlConstant.getApiUrl("councilRejectActivity");
        url = Util.beautifyUrl(url, [activityId]);
        url = url.replace('president/', 'admin/');

        return Api.doPut(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postComment(commentRequest) {
        let url = ApiUrlConstant.getApiUrl("comment");
        url = url.replace('president/', 'admin/');

        return Api.doPost(url, commentRequest)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static loadMoreComments(commentId, skipCount, size) {
        let url = ApiUrlConstant.getApiUrl("loadComments");
        url = Util.beautifyUrl(url, [commentId, skipCount, size]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static mainActivitiesFullDetails(type,selectedId,context) {
        let url = ApiUrlConstant.getApiUrl("mainActivitiesFullDetails");
        url = Util.beautifyUrl(url,[type,selectedId,context]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    /*static assignedActivitieFullDetails(selectedId) {
        let url = ApiUrlConstant.getApiUrl("assignedActivitieFullDetails");
        url = Util.beautifyUrl(url,[selectedId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }*/

    static assignedActivitieFullDetailsSearch(selectedId,search) {
        let url = ApiUrlConstant.getApiUrl("assignedActivitieFullDetailsSearch");
        url = Util.beautifyUrl(url,[selectedId,search]);
        url = url.replace('president/', 'admin/');

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    /*static assignedActivitieFullDetails(pageNo = 0, query = '', searchTerm = '') {
        const PAGE_SIZE = 10;
        const context = Util.getActiveRole();
        let urlLabel = 'assignedActivitieFullDetails';

        let url = ApiUrlConstant.getApiUrl(urlLabel);
        if (urlLabel == 'assignedActivitieFullDetails') {
            url = Util.beautifyUrl(url, [pageNo, query]);
        } else {
            let queryParam = '?page='+pageNo+'&count='+PAGE_SIZE;
            queryParam = (searchTerm ? queryParam+'&search='+searchTerm : queryParam);
            url = Util.beautifyUrl(url, [queryParam]);
        }


        return Api.doGet(url)
        .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }*/

    static assignedActivitieFullDetails(selectedId, searchString, pageNo=0, pageSize) {
        let url = ApiUrlConstant.getApiUrl("assignedActivitieFullDetails");
        url = url.replace('president/', 'admin/');

        const searchParams = [selectedId];
        searchParams.push('?&page='+pageNo);
        searchParams.push('&count='+pageSize);
        searchParams.push('&search='+searchString);

        url = Util.beautifyUrl(url, searchParams);
        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubList(searchParams) {
        let url = ApiUrlConstant.getApiUrl("clubsListMinDetail");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivitySummary(searchParams, interval = 10) {
        let url = ApiUrlConstant.getApiUrl("getActivitySummary");

        url = Util.beautifyUrl(url, [searchParams]);
        if(searchParams === "nil"){
            url = url.replace("/nil", "");
        }
        url += `?interval=${interval}`;

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivitySummaryDetails(date, status, count, page) {
        let url = ApiUrlConstant.getApiUrl("getActivitySummaryDetails");
        url += `?day=${date}&status=${status}&page=${page}&count=${count}`;

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
                /*return [
                    {
                        "title": "Custom assigned activity title",
                        "clubName": "Bhoolokam",
                        "clubAvatar": "5b8635e1e319370001071050/469793993384046672999330",
                        "status": "A",
                        "createdOn": 1550042177804,
                        "assignedActivityId": 18,
                        "masterActivityId": 21
                    },
                    {
                        "title": "Ability to drive tasks independently",
                        "clubName": "Bhoolokam",
                        "clubAvatar": "5b8635e1e319370001071050/469793993384046672999330",
                        "status": "A",
                        "createdOn": 1550040283669,
                        "assignedActivityId": 17,
                        "masterActivityId": 21
                    }
                ];*/
            }
            throw resp;
        });
    }
}