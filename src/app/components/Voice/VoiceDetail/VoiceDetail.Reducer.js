const VoiceDetailInitialState = {
    voiceDetailFields : {
        type: "",
        title: "",
        description: "",
        voiceCouncil: {},
        voiceTags: [],
        images: [],
        includePresident: true
    },
    voiceUserTagSearchResult: [],
    selectedVoiceUserTagChips: [],
    imageAttachements: [],
    refinedAttachments: [],
    selectedCouncil: "",
    voiceDetails: {
        "voiceId":"",
        "voiceHash":"",
        "type":"",
        "title":"",
        "description":"",
        "actionStatus":{"status":"",
            "message":""
        },
        "discussion":[],
        "voiceTags":[],
        "voiceCouncils":{"type":"",
            "tagId":"",
            "hash":"",
            "avatar":null,
            "name":""
        },
        "forwardingHistories":[],
        "postedBy":{
            "username":"",
            "userId":"",
            "name":"",
            "avatar":null
        },
        "discussionCount":null,
        "discussionId":"",
        "createdOn":"",
        "lastUpdated":null,
        "images":[],
        "voiceLevel":"PRESIDENT",
        "why":null
    }
}
const VoiceDetailReducer = (
    state = {
        ...VoiceDetailInitialState,
        voiceTypesList: [],
        voiceCouncilsList: []
    },
    action) => {
    switch (action.type) {
        case "VOICE_DETAIL_FIELDS_CHANGE":
            const fields = state.voiceDetailFields;
            fields[action.fieldName] = action.payload;
            state = {
                ...state,
                voiceDetailFields: fields
            };
            break;
        case "VOICE_DETAIL_SET_SEARCH_VOICE_USER_TAG_RESULT":
            state = {
                ...state,
                voiceUserTagSearchResult: action.payload
            }
            break;
        case "VOICE_DETAIL_SET_SELECTED_VOICE_USER_TAGS_RESULT":
            state = {
                ...state,
                selectedVoiceUserTagChips: action.payload
            }
            break;
        case "VOICE_DETAIL_SET_REFINE_ATTACHMENT_LIST":
            state = {
                ...state
            }
            state.imageAttachements = state.imageAttachements || [];
            state.imageAttachements = state.imageAttachements.concat(action.payload);
            break;
        case "VOICE_DETAIL_SET_ATTACHMENT_LIST":
            state = {
                ...state
            }
            if (action.isRefine) {
                state.voiceDetailFields.images = state.voiceDetailFields.images || [];
                state.voiceDetailFields.images = state.voiceDetailFields.images.concat(action.payload);    
            }
            state.imageAttachements = state.imageAttachements || [];
            state.imageAttachements = state.imageAttachements.concat(action.payload);
            break;
        case "VOICE_DETAIL_REMOVE__REFINE_ATTACHMENT":
            state = {
                ...state
            };
            state.refinedAttachments = state.refinedAttachments || [];
            state.imageAttachements.splice(action.payload, 1);
            state.refinedAttachments.splice(action.payload, 1);

            break;
        case "VOICE_DETAIL_REMOVE_ATTACHMENT":
            state = {
                ...state
            };
            state.imageAttachements.splice(action.payload, 1);
            if (action.isRefine) {
                state.refinedAttachments = state.refinedAttachments || [];
                state.refinedAttachments.splice(action.payload, 1);
            } else {
                state.voiceDetailFields.images.splice(action.payload, 1);
            }
            
            break;
        case "VOICE_DETAIL_LOAD_VOICE_TYPES_LIST":
            state = {
                ...state,
                voiceTypesList: action.payload
            }
            break;
        case "VOICE_DETAIL_LOAD_VOICE_COUNCILS_LIST":
            state = {
                ...state,
                voiceCouncilsList: action.payload
            }
            break;
        case "VOICE_DETAIL_SELECTED_COUNCIL_VALUE_CHANGE":
            state = {
                ...state,
                selectedCouncil: action.payload
            }
            break;
        case "VOICE_DETAIL_ATTACHEMENT_PUSH":
            state = {
                ...state,
            }
            if (action.isRefine) {
                state.refinedAttachments = state.refinedAttachments || [];
                state.refinedAttachments.push(action.payload)
            } else {
                state.voiceDetailFields.images.push(action.payload)
            }
            
            break;
        case "VOICE_DETAIL_DETAILS_CHANGE":
            state = {
                ...state,
                voiceDetails: action.payload
            }
            break;
        case "VOICE_DETAIL_CLEAR_FORM_FIELDS":
            state = {
                voiceDetailFields : {
                    type: "",
                    title: "",
                    description: "",
                    voiceCouncil: {},
                    voiceTags: [],
                    images: [],
                    includePresident: true
                },
                voiceUserTagSearchResult: [],
                selectedVoiceUserTagChips: [],
                imageAttachements: [],
                selectedCouncil: "",
                voiceDetails: {
                    "voiceId":"",
                    "voiceHash":"",
                    "type":"",
                    "title":"",
                    "description":"",
                    "actionStatus":{"status":"",
                        "message":""
                    },
                    "discussion":[],
                    "voiceTags":[],
                    "voiceCouncils":{"type":"",
                        "tagId":"",
                        "hash":"",
                        "avatar":null,
                        "name":""
                    },
                    "forwardingHistories":[],
                    "postedBy":{
                        "username":"",
                        "userId":"",
                        "name":"",
                        "avatar":null
                    },
                    "discussionCount":null,
                    "discussionId":"",
                    "createdOn":"",
                    "lastUpdated":null,
                    "images":[],
                    "voiceLevel":"PRESIDENT",
                    "why":null
                },
                voiceTypesList: [],
                voiceCouncilsList: []
            }
            break;
    }
    return state;
}

export default VoiceDetailReducer;