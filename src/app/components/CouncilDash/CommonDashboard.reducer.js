const CommonDashboardReducer = (state = {
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
    bodChipSearchResult: [],
    selectedBODChip: [],
    membersList: [],
    masterActivities: [],
    commonDashFields: {
        target: '',
        location: ''
    },
    commitmentFields: {
        title: "",
        description: "",
        targetDate: "",
        currentStatus: ""
    },
}, action) => {
    switch (action.type) {
        case "COMMON_DASHBOARD_SET_CLUB_POINTS":
            state = {
                ...state,
                clubPoints: action.payload
            };
            break;
        case "COMMON_DASHBOARD_SET_CLUB_WEEKLY_POINTS":
            state = {
                ...state,
                clubWeeklyPoint: action.payload
            };
            break;
        case "COMMON_DASHBOARD_SET_CLUB_POINT_DIFF":
            state = {
                ...state,
                pointsDiff: action.payload
            };
            break;
        case "COMMON_DASHBOARD_SET_PILLAR_STATISTICS":
            state = {
                ...state,
                pillarStats: action.payload
            }
            break;
        case "COMMON_DASHBOARD_CLEAR_PILLAR_STATISTICS":
            state = {
                ...state,
                pillarStats : []
            }
            break;
        case "COMMON_DASHBOARD_LOAD_ACTIVITIES_LIST":
            state = {
                ...state,
                activitiesList : action.payload
            }
            break;
        case "COMMON_DASHBOARD_PUSH_ACTIVITIES_LIST":
            let activitiesList = state.activitiesList;
            activitiesList.concat(action.payload);
            state = {
                ...state,
                activitiesList : activitiesList
            }
            break;
        case "COMMON_DASHBOARD_LOAD_VOICES_LIST":
            state = {
                ...state,
                voicesList : action.payload
            }
            break;
        case "COMMON_DASHBOARD_PUSH_VOICES_LIST":
            let voicesList = state.voicesList;
            voicesList.concat(action.payload);

            state = {
                ...state,
                voicesList : voicesList
            }
            break;
        case "COMMON_DASHBOARD_LOAD_COMMITMENTS_LIST":
            state = {
                ...state,
                allCommitmentsTableList : action.payload
            }
            break;
        case "COMMON_DASHBOARD_PUSH_COMMITMENTS_LIST":
            let commitmentsList = state.allCommitmentsTableList;
            commitmentsList.concat(action.payload);
            state = {
                ...state,
                allCommitmentsTableList : commitmentsList
            }
            break;
        case "COMMON_DASHBOARD_LOAD_CUDS_LIST":
            state = {
                ...state,
                cudTableList : action.payload
            }
            break;
        case "COMMON_DASHBOARD_LOAD_MEMBER_SUMMARY_LIST":
            state = {
                ...state,
                memberSummaryList : action.payload
            }
            break;
        case "COMMON_DASHBOARD_LOAD_WEEKLY_COMMITMENTS_LIST":
            state = {
                ...state,
                weeklyCommitmentsList : action.payload
            }
            break;
        case "COMMON_DASHBOARD_SET_TARGET_ACHIEVED":
            state = {
                ...state,
                targetAchieved : action.payload
            }
            break;
        case "COMMON_DASHBOARD_SET_CLUB_TARGET":
            state = {
                ...state,
                clubTarget : action.payload
            }
            break;
        case "COMMON_DASHBOARD_CHANGE_COMMITMENTS_STATUS":
            let commitmentsTable = state.allCommitmentsTableList;
            commitmentsTable[action.payload.index].currentStatus = action.payload.value
            state = {
                ...state,
                allCommitmentsTableList: commitmentsTable
            }
            break;
        case "COMMON_DASHBOARD_CHANGE_FIELD_VALUE":
            let commonDashFields = state.commonDashFields;
            commonDashFields[action.fieldName] = action.payload;
            state = {
                ...state,
                commonDashFields: commonDashFields
            }
            break;
        case "COMMON_DASHBOARD_LOAD_COMMITMENTS_STATUS_LIST":
            state = {
                ...state,
                statusList : action.payload
            }
            break;
        case "COMMON_DASHBOARD_LOAD_TOP_USERS_LIST":
            state = {
                ...state,
                topUsersTableList: action.payload
            }
            break;
        case "COMMON_DASHBOARD_LOAD_TARGETS_LIST":
            state = {
                ...state,
                targetsList: action.payload
            }
            break;
        case "COMMON_DASHBOARD_CLEAR_COMMITMENTS_FIELDS":
            state = {
                ...state,
                bodChipSearchResult: [],
                selectedBODChip: [] 
            }
            break;
        case "COMMON_DASHBOARD_SET_BOD_USER_SEARCH_RESULT":
            state = {
                ...state,
                bodChipSearchResult: action.payload                
            }
            break;
        case "COMMON_DASHBOARD_SET_SELECTED_BOD_CHIPS":
            state = {
                ...state,
                selectedBODChip: action.payload                
            }
            break;
        case "COMMON_DASHBOARD_LOAD_MEMBERS_LIST":
            state = {
                ...state,
                membersList: action.payload                
            }
            break;
        case "COMMON_DASHBOARD_LOAD_MASTER_ACTIVITIES_LIST":
            state = {
                ...state,
                masterActivities: action.payload                
            }
            break;
    }
    return state;
};

export default CommonDashboardReducer;