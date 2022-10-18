const StatusDialogReducer = (state = {
    statusImage: null,
    attachmentFiles: [],
    statusFields: {
        title: "",
        content: "",
        type: "GEN",
        images: [],
        visibility: "all"
    }
}, action) => {
    switch (action.type) {
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
        case "STATUS_CLEAR_ALL":
            state = {
                statusImage: null,
                attachmentFiles: [],
                statusFields: {
                    title: "",
                    content: "",
                    type: "GEN",
                    images: [],
                    visibility: "all"
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