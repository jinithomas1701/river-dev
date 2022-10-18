const StatusDialogReducer = (state = {
    statusImage: null,
    attachmentFiles: [],
    visibilityList: [],
    visibilityValue: "all",
    statusFields: {
        title: "",
        content: "",
        type: "GEN",
        images: [],
        visibility: "all",
        link: ""
    }
}, action) => {
    switch (action.type) {
        case "STATUS_SET_VISIBILITY_LIST":
            state = {
                ...state,
                visibilityList: action.payload
            };
            break;
        case "STATUS_SET_VISIBILITY_VALUE":
            state = {
                ...state,
                visibilityValue: action.payload
            };
            break;
        case "STATUS_FIELDS_CHANGE":
            const fields = state.statusFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                statusFields: fields
            };
            break;
        case "STATUS_ADD_ATTACHMENT":
            if (action.payload.length > 0) {
                state = {
                    ...state,
                    attachmentFiles: state.attachmentFiles.concat(action.payload)
                };
            } else {
                state = {
                    ...state,
                    attachmentFiles: []
                };
            }
            break;
        case "STATUS_ADD_IMAGE":
            state = {
                ...state,
                statusImage: action.payload
            };
            break;
        case "STATUS_EMBED_VIDEO_URL":
            state = {
                ...state,
                link: action.payload
            }
        case "STATUS_CLEAR_ALL":
            state = {
                statusImage: null,
                attachmentFiles: [],
                statusFields: {
                    title: "",
                    content: "",
                    type: "GEN",
                    images: [],
                    visibility: "all",
                    link: ""
                }
            };
            break;
        case "STATUS_REMOVE_ATTACHMENT":
            state = {
                ...state
            };
            state.attachmentFiles.splice(action.payload, 1);
            break;
    }
    return state;
};

export default StatusDialogReducer;