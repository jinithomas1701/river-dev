import {ApiUrlConstant} from "../../Util/apiUrl.constant";
import {Api} from "../../Util/api.service";
import {Util} from "../../Util/util";

export class CommonDashboardService {

    static getComparePoints(){
        const url = ApiUrlConstant.getApiUrl("dashClubCompare");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getPillarStats() {
        const url = ApiUrlConstant.getApiUrl("dashClubPillar");

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
        url = Util.beautifyUrl(url, [Util.getCurrentFinancialYear()])

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
        if (role && role.value == 'ROLE_CLUB_PRESIDENT') {
            urlLabel = 'dashboardPresidentActivityDetail';
        } else if (role && role.value == 'ROLE_RIVER_COUNCIL') {
            urlLabel = 'dashboardPanelActivityDetail';
        } else if (role && role.value == 'ROLE_SUPER_ADMIN') {
            urlLabel = 'dashboardAdminActivityDetail';
        }
        urlLabel = ApiUrlConstant.getApiUrl(urlLabel);
        const searchParams = [id];

        context ? searchParams.push('?context='+context) : searchParams.push('');
        search ? searchParams.push('&search='+search) : searchParams.push('');
        status ? searchParams.push('&status='+status) : searchParams.push('');

        searchParams.push('&page='+pageNo);
        searchParams.push('&count='+pageSize);

        const url = Util.beautifyUrl(urlLabel, searchParams);
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
        if (context && context.value == 'ROLE_CLUB_PRESIDENT') {
            urlLabel = 'dashboardPresidentActivities';
        } else if (context && context.value == 'ROLE_RIVER_COUNCIL') {
            urlLabel = 'dashboardPanalActivities';
        } else if (context && context.value == 'ROLE_SUPER_ADMIN') {
            urlLabel = 'dashboardAdminActivities';
        }

        let url = ApiUrlConstant.getApiUrl(urlLabel);
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

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getActivityCategories() {
        const url = ApiUrlConstant.getApiUrl("activityCategories");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static createCommitment(commitment){
        const url = ApiUrlConstant.getApiUrl("commitment");

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

        return Api.doPut(url, commitment)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCommitmentsStatuses() {
        const url = ApiUrlConstant.getApiUrl("commitmentStatus");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getCommitmentsList() {
        const url = ApiUrlConstant.getApiUrl("commitment");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getTargetsList() {
        const url = ApiUrlConstant.getApiUrl("target");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getYearsList() {
        const url = ApiUrlConstant.getApiUrl("fyList");

        return Api.doGet(url)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubsList() {
        const url = ApiUrlConstant.getApiUrl("clubsListMinDetail");

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static createCommitment(commitment) {
        const url = ApiUrlConstant.getApiUrl("commitment");

        return Api.doPost(url, commitment)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static updateClubTarget(targetObj) {
        const url = ApiUrlConstant.getApiUrl("targetEdit");

        return Api.doPut(url, targetObj)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static createClubTarget(targetObj) {
        const url = ApiUrlConstant.getApiUrl("targetEdit");

        return Api.doPost(url, targetObj)
            .then((resp) => {
            if(resp && resp.status_code == "200"){
                return resp.payload;
            }
            throw resp;
        });
    }

    static getFocusAreasList() {
        const url = ApiUrlConstant.getApiUrl("focusAreas");

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

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getClubMembers() {
        const url = ApiUrlConstant.getApiUrl("clubMembers");

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

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getVoiceTypes() {
        const url = ApiUrlConstant.getApiUrl("voiceTypes");

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

        return Api.doPut(url, request)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static finishSettings() {
        const url = ApiUrlConstant.getApiUrl("finishSettings");

        return Api.doPost(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static checkSetupFinished() {
        const url = ApiUrlConstant.getApiUrl("finishSettings");

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

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static getRecentMeeting() {
        const url = ApiUrlConstant.getApiUrl("dashClubRecentMeeting");

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
        return Api.doPut(url, forwardRequest)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postDiscussionMessage(messageRequest) {
        const url = ApiUrlConstant.getApiUrl("comment");
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

        return Api.doPut(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static postComment(commentRequest) {
        const url = ApiUrlConstant.getApiUrl("comment");
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

    static getActivityDockDetail(selectedActitivyId, assignedActivityId) {
        const context = Util.getActiveRole();
        let urlLabel;
        if (context && context.value == 'ROLE_CLUB_PRESIDENT') {
            urlLabel = 'getAssignedPresidentActivityDetail';
        } else if (context && context.value == 'ROLE_RIVER_COUNCIL') {
            urlLabel = 'getAssignedPanelActivityDetail';
        }
        let url = ApiUrlConstant.getApiUrl(urlLabel);
        url = Util.beautifyUrl(url, [selectedActitivyId, assignedActivityId]);

        return Api.doGet(url)
            .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }

    static loadActivityComments(commentId) {
        let url = ApiUrlConstant.getApiUrl("loadCommentsFull");
        url = Util.beautifyUrl(url, [commentId]);
        return Api.doGet(url)
        .then((resp) => {
            if (resp && resp.status_code == "200") {
                return resp.payload;
            }
            throw resp;
        });
    }
}