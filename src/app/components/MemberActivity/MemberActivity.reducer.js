const MemberActivityReducer = (state ={
    assignedActivities: [],
    selectedActivityDetails: undefined,
    memberList: [],
    defaultMemberList: [],
    kpiList: [],
    kpiDetails: null,
    discussionList: []
}, action) => {
    
    let newActivity;
    let userId, clubId, points, index;
    
    switch(action.type) {
        case "MEMBERACTIVITY_ASSIGNED_ACTIVITIES_CHANGE":
            state = {
                ...state,
                assignedActivities: action.payload
            };
            break;
        case "MEMBERACTIVITY_SELECTED_ACTIVITY_CHANGE":
            state = {
                ...state,
                selectedActivityDetails: action.payload
            };
            break;
        case "MEMBERACTIVITY_SELECTED_ACTIVITY_RESET":
            state = {
                ...state,
                selectedActivityDetails: undefined
            };
            break;
        case "MEMBERACTIVITY_POINTMATRIX_CHANGE":
            newActivity = {...state.selectedActivityDetails};
            newActivity.pointMatrix = {...action.payload};
            state = {
                ...state,
                selectedActivityDetails: newActivity
            };
            break;
        case "MEMBERACTIVITY_MEMBER_POINT_CHANGE":
            [userId, points] = action.payload;
            newActivity = {...state.selectedActivityDetails};
            index = newActivity.pointMatrix.assignees.findIndex(assignee => {
                return (userId === assignee.userId);
            });
            newActivity.pointMatrix.assignees[index].calculatedPoints = points;

            state = {
                ...state,
                selectedActivityDetails: newActivity
            };
            break;
        case "MEMBERACTIVITY_CLUB_POINT_CHANGE":
            [clubId, points] = action.payload;
            newActivity = {...state.selectedActivityDetails};
            index = newActivity.pointMatrix.clubs.findIndex(club => {
                return (clubId === club.id);
            });
            newActivity.pointMatrix.clubs[index].calculatedPoints = points;

            state = {
                ...state,
                selectedActivityDetails: newActivity
            };
            break;
        case "MEMBERACTIVITY_MEMBER_LIST_CHANGE":
            state = {
                ...state,
                memberList: [...action.payload]
            };
            break;
        case "MEMBERACTIVITY_DEFAULT_MEMBER_LIST_CHANGE":
            state = {
                ...state,
                defaultMemberList: [...action.payload]
            };
            break;
        case "MEMBERACTIVITY_KPI_LIST_CHANGE":
            state = {
                ...state,
                kpiList: [...action.payload]
            };
            break;
        case "MEMBERACTIVITY_KPI_DETAILS_CHANGE":
            state = {
                ...state,
                kpiDetails: action.payload
            };
            break;
        case "MEMBERACTIVITY_STORE_DISCUSSION":
            state = {
                ...state,
                discussionList: action.payload
            };
            break;
        default:
            break;
    }

    return state;
};

export default MemberActivityReducer;