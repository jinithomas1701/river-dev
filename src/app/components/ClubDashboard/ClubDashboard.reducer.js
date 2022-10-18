const ClubDashboardReducer = (state = {
    activitiesList: [],
    voicesList: [],
    memberSummaryList: [],
    cudTableList: [],
    clubPoints: [],
    clubWeeklyPoint: "",
    pointsDiff: "",
    targetAchieved: "",
    clubTarget: "",
    weeklyCommitmentsList: [],
    pillarStats: [],
    topUsersTableList: [],
    statusList: [],
    allCommitmentsTableList: [],
    targetsList: [],
    commitmentFields: {
        title: "",
        description: "",
        targetDate: "",
        currentStatus: ""
    }
}, action) => {
    switch (action.type) {
        case "CLUB_DASHBOARD_LOAD_ACTIVITIES":
            state = {
                ...state,
                discussion: action.payload
            };
            break;
        case "MY_CLUB_CLEAR_DISCUSSION":
            state = {
                ...state,
                discussion: []
            };
            break;
        case "CLUB_DASHBOARD_SET_CLUB_POINTS":
            state = {
                ...state,
                clubPoints: action.payload
            };
            break;
        case "CLUB_DASHBOARD_SET_CLUB_WEEKLY_POINTS":
            state = {
                ...state,
                clubWeeklyPoint: action.payload
            };
            break;
        case "CLUB_DASHBOARD_SET_CLUB_POINT_DIFF":
            state = {
                ...state,
                pointsDiff: action.payload
            };
            break;
        case "CLUB_DASHBOARD_SET_PILLAR_STATISTICS":
            state = {
                ...state,
                pillarStats: action.payload
            }
            break;
        case "CLUB_DASHBOARD_CLEAR_PILLAR_STATISTICS":
            state = {
                ...state,
                pillarStats : []
            }
            break;
        case "CLUB_DASHBOARD_LOAD_ACTIVITIES_LIST":
            state = {
                ...state,
                activitiesList : action.payload
            }
            break;
        case "CLUB_DASHBOARD_LOAD_VOICES_LIST":
            state = {
                ...state,
                voicesList : action.payload
            }
            break;
        case "CLUB_DASHBOARD_LOAD_COMMITMENTS_LIST":
            state = {
                ...state,
                allCommitmentsTableList : action.payload
            }
            break;
        case "CLUB_DASHBOARD_LOAD_CUDS_LIST":
            state = {
                ...state,
                cudTableList : action.payload
            }
            break;
        case "CLUB_DASHBOARD_LOAD_MEMBER_SUMMARY_LIST":
            state = {
                ...state,
                memberSummaryList : action.payload
            }
            break;
        case "CLUB_DASHBOARD_LOAD_WEEKLY_COMMITMENTS_LIST":
            state = {
                ...state,
                weeklyCommitmentsList : action.payload
            }
            break;
        case "CLUB_DASHBOARD_SET_TARGET_ACHIEVED":
            state = {
                ...state,
                targetAchieved : action.payload
            }
            break;
        case "CLUB_DASHBOARD_SET_CLUB_TARGET":
            state = {
                ...state,
                clubTarget : action.payload
            }
            break;
        case "CLUB_DASHBOARD_CHANGE_COMMITMENTS_STATUS":
            let commitmentsTable = state.allCommitmentsTableList;
            commitmentsTable[action.payload.index].currentStatus = action.payload.value
            state = {
                ...state,
                allCommitmentsTableList: commitmentsTable
            }
            break;
        case "CLUB_DASHBOARD_CHANGE_FIELD_VALUE":
            let commitmentFields = state.commitmentFields;
            commitmentFields[action.fieldName] = action.payload;
            state = {
                ...state,
                commitmentFields: commitmentFields
            }
            break;
        case "CLUB_DASHBOARD_LOAD_COMMITMENTS_STATUS_LIST":
            state = {
                ...state,
                statusList : action.payload
            }
            break;
        case "CLUB_DASHBOARD_LOAD_TOP_USERS_LIST":
            state = {
                ...state,
                topUsersTableList: action.payload
            }
            break;
        case "CLUB_DASHBOARD_LOAD_TARGETS_LIST":
            state = {
                ...state,
                targetsList: action.payload
            }
            break;
        case "CLUB_DASHBOARD_CLEAR_COMMITMENTS_FIELDS":
            state = {
                ...state,
                commitmentFields: {
                    title: "",
                    description: "",
                    targetDate: "",
                    currentStatus: ""
                }
            }
            break;
    }
    return state;
};

export default ClubDashboardReducer;