const AdminDashboardReducer = (state = {
    activitiesList: [],
    voicesList: [],
    cudsList: [],
    clubPoints: [],
    pointsDiff: "",
    targetAchieved: "",
    clubTarget: "",
    weeklyCommitmentsList: [],
    pillarStats: [],
    topUsersTableList: [],
    allCommitmentsTableList: [],
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
    recentMeetings: ''
}, action) => {
    switch (action.type) {
        case "ADMIN_DASHBOARD_LOAD_RECENT_MEETINGS":
            state = {
                ...state,
                recentMeetings: action.payload
            };
            break;
        case "ADMIN_DASHBOARD_SET_CLUB_POINTS":
            state = {
                ...state,
                clubPoints: action.payload
            };
            break;
        case "ADMIN_DASHBOARD_SET_CLUB_POINT_DIFF":
            state = {
                ...state,
                pointsDiff: action.payload
            };
            break;
        case "ADMIN_DASHBOARD_SET_PILLAR_STATISTICS":
            state = {
                ...state,
                pillarStats: action.payload
            }
            break;
        case "ADMIN_DASHBOARD_CLEAR_PILLAR_STATISTICS":
            state = {
                ...state,
                pillarStats : []
            }
            break;
        case "ADMIN_DASHBOARD_LOAD_ACTIVITIES_LIST":
            state = {
                ...state,
                activitiesList : action.payload
            }
            break;
        case "ADMIN_DASHBOARD_PUSH_ACTIVITIES_LIST":
            let activitiesList = state.activitiesList;
            
            state = {
                ...state,
                activitiesList : activitiesList.concat(action.payload)
            }
            break;
        case "ADMIN_DASHBOARD_LOAD_VOICES_LIST":
            state = {
                ...state,
                voicesList : action.payload
            }
            break;
        case "ADMIN_DASHBOARD_PUSH_VOICES_LIST":
            let voicesList = state.voicesList;

            state = {
                ...state,
                voicesList : voicesList.concat(action.payload)
            }
            break;
        case "ADMIN_DASHBOARD_LOAD_CUDS_LIST":
            state = {
                ...state,
                cudsList : action.payload
            }
            break;
        case "ADMIN_DASHBOARD_PUSH_CUDS_LIST":
            let cudsList = state.cudsList;
            
            state = {
                ...state,
                cudsList : cudsList.concat(action.payload)
            }
            break;
        case "ADMIN_DASHBOARD_LOAD_WEEKLY_COMMITMENTS_LIST":
            state = {
                ...state,
                weeklyCommitmentsList : action.payload
            }
            break;
        case "ADMIN_DASHBOARD_SET_TARGET_ACHIEVED":
            state = {
                ...state,
                targetAchieved : action.payload
            }
            break;
        case "ADMIN_DASHBOARD_SET_CLUB_TARGET":
            state = {
                ...state,
                clubTarget : action.payload
            }
            break;
        case "ADMIN_DASHBOARD_CHANGE_COMMITMENTS_STATUS":
            let commitmentsTable = state.allCommitmentsTableList;
            commitmentsTable[action.payload.index].currentStatus = action.payload.value
            state = {
                ...state,
                allCommitmentsTableList: commitmentsTable
            }
            break;
        case "ADMIN_DASHBOARD_CHANGE_FIELD_VALUE":
            let commonDashFields = state.commonDashFields;
            commonDashFields[action.fieldName] = action.payload;
            state = {
                ...state,
                commonDashFields: commonDashFields
            }
            break;
        case "ADMIN_DASHBOARD_LOAD_TOP_USERS_LIST":
            state = {
                ...state,
                topUsersTableList: action.payload
            }
            break;
        case "ADMIN_DASHBOARD_CLEAR_COMMITMENTS_FIELDS":
            state = {
                ...state,
                bodChipSearchResult: [],
                selectedBODChip: [] 
            }
            break;
        case "ADMIN_DASHBOARD_SET_BOD_USER_SEARCH_RESULT":
            state = {
                ...state,
                bodChipSearchResult: action.payload                
            }
            break;
        case "ADMIN_DASHBOARD_SET_SELECTED_BOD_CHIPS":
            state = {
                ...state,
                selectedBODChip: action.payload                
            }
            break;
        case "ADMIN_DASHBOARD_LOAD_MEMBERS_LIST":
            state = {
                ...state,
                membersList: action.payload                
            }
            break;
        case "ADMIN_DASHBOARD_LOAD_MASTER_ACTIVITIES_LIST":
            state = {
                ...state,
                masterActivities: action.payload                
            }
            break;
    }
    return state;
};

export default AdminDashboardReducer;