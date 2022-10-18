const AdminActivityReducer = (state ={
    assignedActivities: [],
    selectedActivityDetails: undefined,
    kpiList: [],
    kpiDetails: null,
    discussionList: []
}, action) => {

    let newActivity;
    let userId, clubId, points, index, assignees, clubs;

    switch(action.type) {
        case "ADMIN_ACTIVITY_ASSIGNED_ACTIVITIES_CHANGE":
            state = {
                ...state,
                assignedActivities: action.payload
            };
            break;
        case "ADMIN_ACTIVITY_SELECTED_ACTIVITY_CHANGE":
            newActivity = {...action.payload};
            assignees = newActivity.pointMatrix.assignees;
            clubs = newActivity.pointMatrix.clubs;
            assignees = assignees.map(assignee => ({...assignee, changedPoints: assignee.calculatedPoints}));
            clubs = clubs.map(club => ({...club, changedPoints: club.calculatedPoints}));
            newActivity.pointMatrix = {assignees, clubs};

            state = {
                ...state,
                selectedActivityDetails: newActivity
            };
            break;
        case "ADMIN_ACTIVITY_SELECTED_ACTIVITY_RESET":
            state = {
                ...state,
                selectedActivityDetails: undefined
            };
            break;
        case "ADMIN_ACTIVITY_POINTMATRIX_CHANGE":
            newActivity = {...state.selectedActivityDetails};
            newActivity.pointMatrix = {...action.payload};
            assignees = newActivity.pointMatrix.assignees;
            clubs = newActivity.pointMatrix.clubs;
            assignees = assignees.map(assignee => ({...assignee, changedPoints: assignee.calculatedPoints}));
            clubs = clubs.map(club => ({...club, changedPoints: club.calculatedPoints}));
            newActivity.pointMatrix = {assignees, clubs};
            state = {
                ...state,
                selectedActivityDetails: newActivity
            };
            break;
        case "ADMIN_ACTIVITY_MEMBER_POINT_CHANGE":
            [userId, points] = action.payload;
            newActivity = {...state.selectedActivityDetails};
            index = newActivity.pointMatrix.assignees.findIndex(assignee => {
                return (userId === assignee.userId);
            });
            newActivity.pointMatrix.assignees[index].changedPoints = points;

            state = {
                ...state,
                selectedActivityDetails: newActivity
            };
            break;
        case "ADMIN_ACTIVITY_CLUB_POINT_CHANGE":
            [clubId, points] = action.payload;
            newActivity = {...state.selectedActivityDetails};
            index = newActivity.pointMatrix.clubs.findIndex(club => {
                return (clubId === club.id);
            });
            newActivity.pointMatrix.clubs[index].changedPoints = points;

            state = {
                ...state,
                selectedActivityDetails: newActivity
            };
            break;
        case "ADMIN_ACTIVITY_POINT_RESET":
            newActivity = {...state.selectedActivityDetails};
            newActivity.pointMatrix.assignees = newActivity.pointMatrix.assignees.map(assignee => ({...assignee, changedPoints: assignee.calculatedPoints}));
            newActivity.pointMatrix.clubs = newActivity.pointMatrix.clubs.map(club => ({...club, changedPoints: club.calculatedPoints}));
            state = {
                ...state,
                selectedActivityDetails: newActivity
            };
            break;
        case "ADMIN_ACTIVITY_KPI_LIST_CHANGE":
            state = {
                ...state,
                kpiList: [...action.payload]
            };
            break;
        case "ADMIN_ACTIVITY_KPI_DETAILS_CHANGE":
            state = {
                ...state,
                kpiDetails: action.payload
            };
            break;
        case "ADMIN_ACTIVITY_STORE_DISCUSSION":
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

export default AdminActivityReducer;