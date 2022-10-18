import { createStore, combineReducers} from "redux";

import LoginReducer from "../components/Login/Login.reducer";
import GuestLoginReducer from "../components/GuestLogin/GuestLogin.reducer";
import FeedElementReducer from "../components/Feeds/FeedElement/FeedElement.reducer";
import FeedsReducer from "../components/Feeds/Feeds.reducer";
import StatusDialogReducer from "../components/Feeds/StatusDialog/StatusDialog.reducer";
import UsersReducer from '../components/Administration/Users/Users.reducer.js';
import UserDetailsReducer from '../components/Administration/Users/UserDetails/UserDetails.reducer.js';
import ClubsReducer from '../components/Administration/Clubs/Clubs.reducer.js';
import ClubDetailReducer from '../components/Administration/Clubs/ClubDetail/ClubDetail.reducer';
import MeetingDetailReducer from '../components/Administration/Meetings/MeetingDetail/MeetingDetail.reducer';
import MeetingsReducer from '../components/Administration/Meetings/Meetings.reducer';
import PublicMeetingsReducer from '../components/Meetings/PublicMeetings.reducer';
import ActivityMasterReducer from "../components/Administration/ActivityMaster/ActivityMaster.reducer";
import ActivityMasterDetailDialogReducer from "../components/Administration/ActivityMaster/ActivityMasterDetailDialog/ActivityMasterDetailDialog.reducer";
import PollsReducer from "../components/Administration/Polls/polls.reducer";
import PointsReducer from "../components/Administration/Points/Points.reducer";
import PollDetailReducer from "../components/Administration/Polls/PollDetail/PollDetail.reducer";
import ActivitiesReducer from "../components/Administration/Activities/Activities.reducer";
import ActivityUserDetailReducer from "../components/Activities/ActivityUserDetail/ActivityUserDetail.reducer"
import ActivityDetailReducer from "../components/Administration/Activities/ActivityDetail/ActivityDetail.reducer"
import ActivityViewReducer from "../components/Administration/Activities/ActivityView/ActivityView.reducer"
import GroupsReducer from '../components/Administration/Groups/Groups.reducer.js';
import GroupDetailReducer from '../components/Administration/Groups/GroupDetail/GroupDetail.reducer';
import VoiceAdminReducer from "../components/Administration/Voice/Voice.reducer";
import VoiceAdminDetailReducer from "../components/Administration/Voice/VoiceDetail/VoiceDetail.reducer";
import VoiceReducer from "../components/Voice/Voice.reducer";
import VoiceDetailReducer from "../components/Voice/VoiceDetail/VoiceDetail.Reducer";
import UserPollsReducer from "../components/Polls/Polls.reducer";
import SurveyReducer from "../components/Survey/Survey.reducer";
import MyClubReducer from "../components/MyClub/MyClub.reducer";
import ClubDashboardReducer from "../components/ClubDashboard/ClubDashboard.reducer";
import CommonDashboardReducer from "../components/CommonDashboard/CommonDashboard.reducer";
import CEODashboardReducer from "../components/CEODashboard/CEODashboard.reducer";
import CEOVoiceReducer from "../components/CEODashboard/CEOVoice/CEOVoice.reducer";
import CouncilDashboardReducer from "../components/CouncilDashboard/CouncilDashboard.reducer";
import CreateSurveyDialogReducer from "../components/Survey/CreateSurveyDialog/CreateSurveyDialog.reducer";
import ActivitiesUserReducer from "../components/Activities/ActivitiesUser.reducer";
import ReportReducer from '../components/Administration/Report/Report.reducer';
import NotificationsReducer from '../components/Common/Notifications/Notifications.reducer'
import LitUpReducer from "../components/LitUp/LitUp.reducer";
import GoForGrowthReducer from "../components/GoForGrowth/GoForGrowth.reducer";
import UserCUDReducer from "../components/UserCUD/UserCUD.reducer";
import CouncilCUDReducer from "../components/CouncilCUD/CouncilCUD.reducer";
import LitipediaReducer from "../components/Litipedia/Litipedia.reducer";
import AdminDashboardReducer from "../components/Administration/AdminDashboard/AdminDashOld/AdminDashboard.reducer";
import VoiceMasterReducer from "../components/Voice/NewVoice/VoiceMaster/VoiceMaster.reducer";
import AdminVoiceDetailsReducer from "../components/Administration/Voice/NewAdminVoice/AdminVoiceDetails/AdminVoiceDetails.reducer";
import MemberActivityReducer from "../components/MemberActivity/MemberActivity.reducer";
import KpiMasterReducer from "../components/Kpi/KpiMaster/KpiMaster.reducer";
import PresidentActivityReducer from "../components/PresidentActivity/PresidentActivity.reducer";
import PanelActivityReducer from "../components/PanelActivity/PanelActivity.reducer";
import AdminActivityReducer from "../components/Administration/AdminDashboard/AdminActivity/AdminActivity.reducer";
import ClubSettingsReducer from "../components/ClubSettings/ClubSettings.reducer";
import ClubTreasurerDashboardReducer from "../components/Finance/ClubTreasurerMaster/ClubTreasurerDashboard/ClubTreasurerDashboard.reducer";
import ClubTreasurerTransactionReducer from "../components/Finance/ClubTreasurerMaster/ClubTreasurerTransaction/ClubTreasurerTransaction.reducer";
import ClubTreasurerHistoryReducer from "../components/Finance/ClubTreasurerMaster/ClubTreasurerHistory/ClubTreasurerHistory.reducer";
import FinanceTeamDashboardReducer from "../components/Finance/FinanceTeamMaster/FinanceTeamDashboard/FinanceTeamDashboard.reducer";
import FinanceTeamTransactionReducer from "../components/Finance/FinanceTeamMaster/FinanceTeamTransaction/FinanceTeamTransaction.reducer";
import FinanceTeamHistoryReducer from "../components/Finance/FinanceTeamMaster/FinanceTeamHistory/FinanceTeamHistory.reducer";
import CfoDashboardReducer from "../components/Finance/CfoMaster/CfoDashboard/CfoDashboard.reducer";
import CfoTransactionReducer from "../components/Finance/CfoMaster/CfoTransaction/CfoTransaction.reducer";
import CfoHistoryReducer from "../components/Finance/CfoMaster/CfoHistory/CfoHistory.reducer";
import FinanceAdminReducer from "../components/Administration/FinanceAdmin/FinanceAdmin.reducer";

import AdminWhatsHappeningReducer from "../components/Announcements/AdminMaster/AdminWhatsHappening/AdminWhatsHappening.reducer";
import AdminWhatsNewReducer from "../components/Announcements/AdminMaster/AdminWhatsNew/AdminWhatsNew.reducer";
import AdminProblemReducer from '../components/Announcements/AdminMaster/AdminProblem/AdminProblem.reducer';
import PresidentWhatsHappeningReducer from '../components/Announcements/PresidentMaster/PresidentWhatsHappening/PresidentWhatsHappening.reducer';
import PresidentWhatsNewReducer from '../components/Announcements/PresidentMaster/PresidentWhatsNew/PresidentWhatsNew.reducer';
import PresidentProblemReducer from '../components/Announcements/PresidentMaster/PresidentProblem/PresidentProblem.reducer';
import LeaderWhatsHappeningReducer from '../components/Announcements/LeaderMaster/LeaderWhatsHappening/LeaderWhatsHappening.reducer';
import LeaderWhatsNewReducer from '../components/Announcements/LeaderMaster/LeaderWhatsNew/LeaderWhatsNew.reducer';
import LeaderProblemReducer from '../components/Announcements/LeaderMaster/LeaderProblem/LeaderProblem.reducer';
import LeaderMyProblemReducer from '../components/Announcements/LeaderMaster/LeaderMyProblem/LeaderMyProblem.reducer';
export default createStore(
    combineReducers({
        LoginReducer, 
        FeedsReducer, 
        FeedElementReducer,
        StatusDialogReducer, 
        ActivityMasterReducer,
        ActivityMasterDetailDialogReducer,
        UsersReducer,
        ClubsReducer,
        ClubDetailReducer,
        UserDetailsReducer,
        PollsReducer,
        PollDetailReducer,
        ActivityDetailReducer,
        ActivityViewReducer,
        MeetingDetailReducer,
        ActivitiesReducer,
        MeetingsReducer,
        PublicMeetingsReducer,
        GroupsReducer,
        GroupDetailReducer,
        VoiceReducer,
        VoiceDetailReducer,
        VoiceAdminReducer,
        VoiceAdminDetailReducer,
        UserPollsReducer,
        ActivitiesUserReducer,
        ActivityUserDetailReducer,
        ReportReducer,
        NotificationsReducer,
        CreateSurveyDialogReducer,
        SurveyReducer,
        LitUpReducer,
        MyClubReducer,
        ClubDashboardReducer,
        CEODashboardReducer,
        CEOVoiceReducer,
        UserCUDReducer,
        CouncilCUDReducer,
        CouncilDashboardReducer,
        GoForGrowthReducer,
        CommonDashboardReducer,
        LitipediaReducer,
        AdminDashboardReducer,
        VoiceMasterReducer,
        AdminVoiceDetailsReducer,
        MemberActivityReducer,
        KpiMasterReducer,
        PresidentActivityReducer,
        PanelActivityReducer,
        AdminActivityReducer,
        ClubSettingsReducer,
        ClubTreasurerDashboardReducer,
        ClubTreasurerTransactionReducer,
        ClubTreasurerHistoryReducer,
        FinanceTeamDashboardReducer,
        FinanceTeamTransactionReducer,
        FinanceTeamHistoryReducer,
        CfoDashboardReducer,
        CfoTransactionReducer,
        CfoHistoryReducer,
        FinanceAdminReducer,
        AdminWhatsHappeningReducer,
        AdminWhatsNewReducer,
        AdminProblemReducer,
        PresidentWhatsHappeningReducer,
        PresidentWhatsNewReducer,
        PresidentProblemReducer,
        LeaderWhatsHappeningReducer,
        LeaderWhatsNewReducer,
        LeaderProblemReducer,
        LeaderMyProblemReducer
    }),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
