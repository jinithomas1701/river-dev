const GroupDetailReducer = (state = {
    confirmBoxVisibility: false,
    confirmBoxTitle: "Are you sure ?",
    confirmBoxContent: "Do you want to do this.",
    groupFields: {
        id: "",
        username: "",
        groupName: "",
        groupDescription: "",
        groupMembers: []
    },
    groupMembers: [],
    membersChipSearchResult: []
}, action) => {
    switch (action.type) {
        case "GROUPS_DETAIL_FIELDS_CHANGE":
            const fields = state.groupFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                groupFields: fields
            };
            break;
        case "GROUPS_DETAIL_SET_CLUB_MEMBERS":
            state = {
                ...state,
                groupMembers: action.payload
            };
            break;
        case "GROUPS_DETAIL_RESET_FORM":
            state = {
                ...state,
                groupFields: {
                    id: "",
                    groupName: "",
                    groupDescription: "",
                    groupMembers: []
                },
                groupMembers: [],
                membersChipSearchResult: []
            }
            break;
        case "GROUPS_DETAIL_TOGGLE_CONFIRM_BOX":
            state = {
                ...state,
                confirmBoxVisibility: action.payload
            }

            if (action.options && action.options.title) {
                state = {
                    ...state,
                    confirmBoxTitle: action.options.title
                }   
            }

            if (action.options && action.options.content) {
                state = {
                    ...state,
                    confirmBoxContent: action.options.content
                }   
            }
            break;
        case "GROUP_DETAIL_SET_SEARCH_MEMBERS_RESULT":
            state = {
                ...state,
                membersChipSearchResult: action.payload
            }
            break;
        case "GROUP_DETAIL_SET_MEMBERS_SELECTED":
            state = {
                ...state,
                groupMembers: action.payload
            }
            break;
    }
    return state;
};

export default GroupDetailReducer;