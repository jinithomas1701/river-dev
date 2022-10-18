import React from "react";
import {
  BrowserRouter,
  HashRouter,
  Route,
  Redirect,
  Link,
  Switch,
  IndexRoute
} from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory'
import ReactGA from 'react-ga';
import { PrivateRoute } from "./privateRoute";

import { Landing } from "../components/Layout/Landing";
import AccessDenied from "../components/AccessDenied/AccessDenied";
import NotFound from "../components/NotFound/NotFound";
import { Home } from "../components/Home/Home";
import { Admin } from "../components/Administration/Admin";
import Users from "../components/Administration/Users/Users";
import UserDetails from "../components/Administration/Users/UserDetails/UserDetails";
import Activities from "../components/Administration/Activities/Activities";
import Meetings from "../components/Administration/Meetings/Meetings";
import ActivityDetail from "../components/Administration/Activities/ActivityDetail/ActivityDetail";
import ActivityView from "../components/Administration/Activities/ActivityView/ActivityView";
import UserMeetings from "../components/Meetings/Meetings";
import MeetingDetail from "../components/Administration/Meetings/MeetingDetail/MeetingDetail";
import ActivityMaster from "../components/Administration/ActivityMaster/ActivityMaster";
import Clubs from "../components/Administration/Clubs/Clubs";
import ClubDetail from "../components/Administration/Clubs/ClubDetail/ClubDetail";
import AdminPolls from "../components/Administration/Polls/Polls";
import PollDetail from "../components/Administration/Polls/PollDetail/PollDetail";
import Voice from "../components/Voice/Voice";
import MyProfile from "../components/MyProfile/MyProfile";
import MyClub from "../components/MyClub/MyClub";
import ClubDashboard from "../components/ClubDashboard/ClubDashboard";
import CEODashboard from "../components/CEODashboard/CEODashboard";
import CouncilDashboard from "../components/CouncilDashboard/CouncilDashboard";
import CommonDashboard from "../components/CommonDashboard/CommonDashboard";
import PresidentDashboard from "../components/PresidentDashboard/PresidentDashboard";
import PanelDashboard from "../components/PanelDashboard/PanelDashboard";
import VoiceDetail from "../components/Voice/VoiceDetail/VoiceDetail";
import Feeds from "../components/Feeds/Feeds";
import Feed from "../components/Feed/Feed";
import Groups from "../components/Administration/Groups/Groups";
import GroupDetail from "../components/Administration/Groups/GroupDetail/GroupDetail";
import VoiceAdmin from "../components/Administration/Voice/Voice";
import VoiceAdminDetail from "../components/Administration/Voice/VoiceDetail/VoiceDetail";
import ActivitiesUser from "../components/Activities/ActivitiesUser";
import ActivityUserDetail from "../components/Activities/ActivityUserDetail/ActivityUserDetail";
import UserPolls from "../components/Polls/Polls";
import Report from "../components/Administration/Report/Report";
import BulkUpload from "../components/Administration/BulkUpload/BulkUpload";
import Points from "../components/Administration/Points/Points";
import Roles from "../components/Administration/Roles/Roles";
import Survey from "../components/Survey/Survey";
import LitUp from "../components/LitUp/LitUp";
import GoForGrowth from "../components/GoForGrowth/GoForGrowth";
import GoForGrowthDetails from "../components/GoForGrowth/GoForGrowthDetails/GoForGrowthDetails";
import LitUpSuggestionDetail from "../components/LitUp/LitUpSuggestionDetail/LitUpSuggestionDetail";
import UserCUD from "../components/UserCUD/UserCUD";
import CouncilCUD from "../components/CouncilCUD/CouncilCUD";
import Litipedia from "../components/Litipedia/Litipedia";
import Booking from "../components/Booking/Booking";
import AddEditBooking from "../components/Booking/AddEditBooking/AddEditBooking";
import BookingMaster from "../components/Administration/BookingMaster/BookingMaster";
import Lander from "../components/Lander/Lander";
import LanderDetails from "../components/Lander/LanderDetails/LanderDetails";
import RiverCouncilDashboard from "../components/RiverCouncilDashboard/RiverCouncilDashboard";
import PointsUpload from "../components/PointsUpload/PointsUpload";
import MemberActivity from "../components/MemberActivity/MemberActivity";
import VoicePage from "../components/Voice/NewVoice/VoicePage";
import KpiPage from "../components/Kpi/KpiPage";
import AdminVoicePage from "../components/Administration/Voice/NewAdminVoice/AdminVoicePage/AdminVoicePage";
import AdminVoiceDetails from "../components/Administration/Voice/NewAdminVoice/AdminVoiceDetails/AdminVoiceDetails";
import AdminDashboard from "../components/Administration/AdminDashboard/AdminDashOld/AdminDashboard";
import AdminDashPage from "../components/Administration/AdminDashboard/AdminDashPage";
import ClubSettingsPage from "../components/ClubSettings/ClubSettingsPage";
import ActivityLinkPage from "../components/ActivityLink/ActivityLinkPage";
import DashboardClubTreasurer from "../components/Finance/DashboardClubTreasurer";
import FinanceTeamPage from "../components/Finance/FinanceTeamPage";
import DashboardCfo from "../components/Finance/DashboardCfo";
import FinanceAdminPage from "../components/Administration/FinanceAdmin/FinanceAdminPage/FinanceAdminPage";
import AnnouncementsAdmin from "../components/Announcements/AnnouncementsAdmin";
import AnnouncementsLeader from "../components/Announcements/AnnouncementsLeader";
import AnnouncementsPresident from "../components/Announcements/AnnouncementsPresident";
import AnnouncementsClubMember from "../components/Announcements/AnnouncementsClubMember";
import LeaderDashBoard from "../components/Announcements/LeaderDashBoard";
import ListMeetingsPage from "../components/GroupMeetings/ListMeetingsPage";
import CreateMeetingsPage from "../components/GroupMeetings/CreateMeetingsPage";
import ViewMeetingsPage from "../components/GroupMeetings/ViewMeetingsPage";

const PRIVILEGE_VIEW_USERS = "VIEW_USER";
const PRIVILEGE_CREATE_USER = "CREATE_USER";
const PRIVILEGE_UPDATE_USER = "UPDATE_USER";
const PRIVILEGE_DELETE_USER = "DELETE_USER";
const PRIVILEGE_VIEW_USER = "VIEW_USER";
const PRIVILEGE_VIEW_ALL_USER = "VIEW_ALL_USER";
const PRIVILEGE_RESET_PASSWORD = "RESET_PASSWORD";
const PRIVILEGE_CREATE_CLUB = "CREATE_CLUB";
const PRIVILEGE_UPDATE_CLUB = "UPDATE_CLUB";
const PRIVILEGE_DELETE_CLUB = "DELETE_CLUB";
const PRIVILEGE_VIEW_CLUB = "VIEW_CLUB";
const PRIVILEGE_ADD_CLUB_MEMBER = "ADD_CLUB_MEMBER";
const PRIVILEGE_REMOVE_CLUB_MEMBER = "REMOVE_CLUB_MEMBER";
const PRIVILEGE_VIEW_ALL_CLUB = "VIEW_ALL_CLUB";
const PRIVILEGE_CREATE_COUNCIL = "CREATE_COUNCIL";
const PRIVILEGE_VIEW_COUNCIL = "VIEW_COUNCIL";
const PRIVILEGE_DELETE_COUNCIL = "DELETE_COUNCIL";
const PRIVILEGE_VIEW_ALL_COUNCIL = "VIEW_ALL_COUNCIL";
const PRIVILEGE_CREATE_ACTIVITY = "CREATE_ACTIVITY";
const PRIVILEGE_DELETE_ACTIVITY = "DELETE_ACTIVITY";
const PRIVILEGE_UPDATE_ACTIVITY = "UPDATE_ACTIVITY";
const PRIVILEGE_VIEW_ACTIVITY = "VIEW_ACTIVITY";
const PRIVILEGE_VIEW_ALL_ACTIVITY = "VIEW_ALL_ACTIVITY";
const PRIVILEGE_CREATE_POLL = "CREATE_POLL";
const PRIVILEGE_UPDATE_POLL = "UPDATE_POLL";
const PRIVILEGE_DELETE_POLL = "DELETE_POLL";
const PRIVILEGE_VIEW_POLL = "VIEW_POLL";
const PRIVILEGE_CREATE_SURVEY = "CREATE_SURVEY";
const PRIVILEGE_UPDATE_SURVEY = "UPDATE_SURVEY";
const PRIVILEGE_DELETE_SURVEY = "DELETE_SURVEY";
const PRIVILEGE_VIEW_SURVEY = "VIEW_SURVEY";
const PRIVILEGE_CREATE_VOICE = "CREATE_VOICE";
const PRIVILEGE_UPDATE_VOICE = "UPDATE_VOICE";
const PRIVILEGE_DELETE_VOICE = "DELETE_VOICE";
const PRIVILEGE_VIEW_VOICE = "VIEW_VOICE";
const PRIVILEGE_VIEW_ALL_VOICE = "VIEW_ALL_VOICE";
const PRIVILEGE_APPROVE_REJECT_REFINE_VOICE = "APPROVE_REJECT_REFINE_VOICE";
const PRIVILEGE_FORWARD_VOICE = "FORWARD_VOICE";
const PRIVILEGE_CREATE_STATUS = "CREATE_STATUS";
const PRIVILEGE_VIEW_FEED = "VIEW_FEED";
const PRIVILEGE_DELETE_FEED = "DELETE_FEED";
const PRIVILEGE_CREATE_MEETING = "CREATE_MEETING";
const PRIVILEGE_UPDATE_MEETING = "UPDATE_MEETING";
const PRIVILEGE_DELETE_MEETING = "DELETE_MEETING";
const PRIVILEGE_VIEW_MEETING = "VIEW_MEETING";
const PRIVILEGE_CANCEL_MEETING = "CANCEL_MEETING";
const PRIVILEGE_POSTPONE_MEETING = "POSTPONE_MEETING";
const PRIVILEGE_MARK_MEETING_ATTENDANCE = "MARK_MEETING_ATTENDANCE";
const PRIVILEGE_START_MEETING = "START_MEETING";
const PRIVILEGE_END_MEETING = "END_MEETING";
const PRIVILEGE_VIEW_ALL_MEETING = "VIEW_ALL_MEETING";
const PRIVILEGE_GENERATE_REPORT = "GENERATE_REPORT";
const PRIVILEGE_BULK_UPLOAD = "MANAGE_BULK_UPLOAD";
const PRIVILEGE_VIEW_ALL_MASTER_ACTIVITY = "VIEW_ALL_MASTER_ACTIVITY";
const PRIVILEGE_VIEW_POINTS = "MANAGE_POINTS";
const PRIVILEGE_VIEW_SURVEYS = "VIEW_SURVEYS";
const PRIVILEGE_VIEW_PROFILE = "VIEW_PROFILE";
const PRIVILEGE_VIEW_COUNCIL_CUDS = "GET_ALL_CUDS_FOR_COUNCIL";
const PRIVILEGE_VIEW_CEO_DASHBOARD = "VIEW_CEO_DASHBOARD";
const PRIVILEGE_VIEW_COUNCIL_DASHBOARD = "VIEW_COUNCIL_DASHBOARD";
const PRIVILEGE_VIEW_CLUB_PRESIDENT_DASHBOARD = "VIEW_CLUB_PRESIDENT_DASHBOARD";
const PRIVILEGE_ADMIN = "ADMIN_PRIVILEGE";
const PRIVILEGE_VIEW_RIVER_DASHBOARD = "VIEW_RIVER_DASHBOARD";
const PRIVILEGE_VIEW_ADMIN_DASHBOARD = "VIEW_ADMIN_DASHBOARD";
const PRIVILEGE_VIEW_AUDIT_DASHBOARD = "VIEW_AUDIT_DASHBOARD";
const PRIVILEGE_MANAGE_VOICE = "MANAGE_VOICE";
const PRIVILEGE_ADMIN_ANNOUNCEMENT = "VIEW_ADMIN_ANNOUNCEMENT";
const PRIVILEGE_PRESIDENT_ANNOUNCEMENT = "VIEW_CLUB_PRESIDENT_ANNOUNCEMENT";
const PRIVILEGE_LEADER_ANNOUNCEMENT = "VIEW_LEADER_ANNOUNCEMENT";
const PRIVILEGE_CLUB_MEMBER_ANNOUNCEMENT = "VIEW_CLUB_MEMBER_ANNOUNCEMENT";
const PRIVILEGE_TREASURER_DASHBOARD = "VIEW_TRANSACTION_DASHBOARD_TREASURER";
const PRIVILEGE_CFO_DASHBOARD = "VIEW_TRANSACTION_DASHBOARD_CFO";
const PRIVILEGE_FINANCE_TEAM_MENU = "VIEW_TRANSACTION_DASHBOARD_FINANCE_TEAM";
const PRIVILEGE_ADMIN_FINANCE_SETTINGS = "MANAGE_FINANCE";
const PRIVILEGE_LIST_MEETINGS = "MTN_GET_MEETING_LIST";
const PRIVILEGE_CREATE_MEETINGS = "MTN_CREATE";
const PRIVILEGE_VIEW_MEETINGS = "MTN_GET_MEETING";

const browserHistory = createBrowserHistory()

function initializeReactGA() {
  ReactGA.initialize(__GA, { debug: process.env.NODE_ENV !== 'prod' });
  browserHistory.listen(location => ReactGA.pageview(location.hash.replace("#", "")));
  ReactGA.pageview(location.hash.replace("#", ""));
}

export const RiverRoutes = () => {
  initializeReactGA();
  return (
    <HashRouter history={browserHistory}>
      <Switch>
        <Route exact path="/" render={() => (
          <Redirect to="/login" />
        )} />
        <Route exact path="/login/:message?" component={Landing} />
        <Route exact path="/accessDenied" component={AccessDenied} />
        <PrivateRoute exact path="/dashboard" component={Feeds} />
        <PrivateRoute exact path="/welcome" component={Lander} />
        <PrivateRoute exact path="/welcome/:clubId" component={LanderDetails} />
        <PrivateRoute exact path="/feed/:feedId" component={Feed} />
        <PrivateRoute exact path="/admin" component={Admin} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_PROFILE} path="/myProfile/:tabValue?" component={MyProfile} />
        <PrivateRoute exact path="/myClub/:tabValue?" component={MyClub} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_CLUB_PRESIDENT_DASHBOARD} path="/admin/clubDash-old/:refId?" component={CommonDashboard} />
        <PrivateRoute exact path="/admin/dash" component={CommonDashboard} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_CEO_DASHBOARD} path="/admin/ceoDash" component={CEODashboard} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_COUNCIL_DASHBOARD} path="/admin/councilDash-old/:refId?" component={CommonDashboard} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_COUNCIL_DASHBOARD} path="/admin/councilDash/:activityId?" component={PanelDashboard} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_RIVER_DASHBOARD} path="/admin/riverDash" component={RiverCouncilDashboard} />

        <PrivateRoute exact privilege={PRIVILEGE_VIEW_CLUB_PRESIDENT_DASHBOARD} path="/admin/clubDash/:activityId?" component={PresidentDashboard} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_CLUB_PRESIDENT_DASHBOARD} path="/admin/club/settings" component={ClubSettingsPage} />
        <PrivateRoute exact path="/points-upload" component={PointsUpload} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ADMIN_DASHBOARD} path="/admin/adminDash" component={AdminDashPage} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_AUDIT_DASHBOARD} path="/audit/auditDash" component={AdminDashboard} />

        <PrivateRoute exact path="/userCUD" component={UserCUD} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_COUNCIL_CUDS} path="/admin/councilCUD" component={CouncilCUD} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_USERS} path="/admin/users" component={Users} />
        <PrivateRoute exact privilege={PRIVILEGE_CREATE_USER} path="/admin/users/add" component={UserDetails} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_USERS} path="/admin/users/detail/:userId?" component={UserDetails} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/admin/activities/detail/:activityId?" component={ActivityDetail} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/admin/activities/:tabId?" component={Activities} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/admin/activities/view/:activityId?" component={ActivityView} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ALL_MASTER_ACTIVITY} path="/admin/activity/master" component={ActivityMaster} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_MEETING} path="/meetings" component={UserMeetings} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_MEETING} path="/admin/meetings" component={Meetings} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_MEETING} path="/admin/meetings/detail/:meetingId?" component={MeetingDetail} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_CLUB} path="/admin/clubs" component={Clubs} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_CLUB} path="/admin/clubs/detail/:clubId?" component={ClubDetail} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_COUNCIL} path="/admin/councils" component={Groups} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_COUNCIL} path="/admin/councils/detail/:groupId?/:username?" component={GroupDetail} />
        <PrivateRoute exact privilege={PRIVILEGE_GENERATE_REPORT} path="/admin/report" component={Report} />
        <PrivateRoute exact privilege={PRIVILEGE_BULK_UPLOAD} path="/admin/bulkupload" component={BulkUpload} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_POLL} path="/admin/polls" component={AdminPolls} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_POLL} path="/polls/:tabId?" component={UserPolls} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_POLL} path="/admin/polls/detail/:pollId?" component={PollDetail} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_VOICE} path="/admin/voices" component={VoiceAdmin} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_VOICE} path="/admin/voices/detail/:voiceId?/:voiceHash?" component={VoiceAdminDetail} />
        <PrivateRoute exact privilege={PRIVILEGE_MANAGE_VOICE} path="/admin/voice" component={AdminVoicePage} />
        <PrivateRoute exact privilege={PRIVILEGE_MANAGE_VOICE} path="/admin/voice/details/:departmentId?" component={AdminVoiceDetails} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_VOICE} path="/voices" component={Voice} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_VOICE} path="/voices/detail/:voiceId?/:username?" component={VoiceDetail} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_VOICE} path="/voice" component={VoicePage} />

        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/view-activity/:activityId?" component={ActivityLinkPage} />

        <PrivateRoute exact path="/booking" component={Booking} />
        <PrivateRoute exact path="/booking/config" component={AddEditBooking} />
        <PrivateRoute exact privilege={PRIVILEGE_ADMIN} path="/admin/booking" component={BookingMaster} />

        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/activities/detail" component={ActivityUserDetail} />
        {/*<PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/activities/:tabId?" component={ActivitiesUser}/>*/}
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/activities/:refId?" component={ActivitiesUser} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/member_activity/:activityId?" component={MemberActivity} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_ACTIVITY} path="/line-item" component={KpiPage} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_POINTS} path="/admin/points" component={Points} />
        <PrivateRoute exact path="/survey/:tabId?/:surveyId?" component={Survey} />
        <PrivateRoute exact path="/litup/:topicId?" component={LitUp} />
        <PrivateRoute exact path="/goforgrowth" component={GoForGrowth} />
        <PrivateRoute exact path="/litipedia" component={Litipedia} />
        <PrivateRoute exact path="/goforgrowth/add/:gfgId?" component={GoForGrowthDetails} />
        <PrivateRoute exact path="/litup/suggestion/:suggestionId" component={LitUpSuggestionDetail} />
        <PrivateRoute exact privilege={""} path="/admin/roles" component={Roles} />
        <PrivateRoute exact path="/home" render={() => (
          <Redirect to="/dashboard" />
        )} />
        <PrivateRoute exact privilege={PRIVILEGE_TREASURER_DASHBOARD} path="/club-treasurer/treasurerDash" component={DashboardClubTreasurer} />
        <PrivateRoute exact privilege={PRIVILEGE_FINANCE_TEAM_MENU} path="/finance/finance-team" component={FinanceTeamPage} />
        <PrivateRoute exact privilege={PRIVILEGE_CFO_DASHBOARD} path="/cfo/cfoDash" component={DashboardCfo} />
        <PrivateRoute exact privilege={PRIVILEGE_ADMIN_FINANCE_SETTINGS} path="/admin/finance-settings" component={FinanceAdminPage} />
        <PrivateRoute exact privilege={PRIVILEGE_ADMIN_ANNOUNCEMENT} path="/announcements/admin" component={AnnouncementsAdmin} />
        <PrivateRoute exact privilege={PRIVILEGE_LEADER_ANNOUNCEMENT} path="/dashboard/leader" component={LeaderDashBoard} />
        {/* <PrivateRoute exact privilege={PRIVILEGE_PRESIDENT_ANNOUNCEMENT} path="/announcements" component= {AnnouncementsPresident}/> */}
        <PrivateRoute exact privilege={PRIVILEGE_CLUB_MEMBER_ANNOUNCEMENT} path="/clubinitiatives" component={AnnouncementsPresident} />
        <PrivateRoute exact privilege={PRIVILEGE_LIST_MEETINGS} path="/group-meetings/list" component={ListMeetingsPage} />
        <PrivateRoute exact privilege={PRIVILEGE_CREATE_MEETINGS} path="/group-meetings/create" component={CreateMeetingsPage} />
        <PrivateRoute exact privilege={PRIVILEGE_VIEW_MEETINGS} path="/group-meetings/view/:meetingId?" component={ViewMeetingsPage} />
        <PrivateRoute exact path="*" component={NotFound} />
      </Switch>
    </HashRouter>
  );
};

function requireAuth() {
}
