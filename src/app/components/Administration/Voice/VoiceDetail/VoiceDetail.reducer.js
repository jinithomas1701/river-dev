const VoiceAdminDetailReducer = (state = {
    voiceDetail: {
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
    voiceTagList: [],
    councilList: [],
    selectedCouncil: null,
    userSearchResult: [],
    clickedStatus: "",
    voiceTypesList: []
}, action) => {
    switch (action.type) {
        case "VOICE_ADMIN_SET_DETAIL":
            state = {
                ...state,
                voiceDetail: action.payload
            };
            break;
        case "VOICE_ADMIN_SET_STATUS":
            state = {
                ...state,
                clickedStatus: action.payload
            };
            break;
        case "VOICE_ADMIN_SET_USER_SEARCH_RESULT_LIST":
            state = {
                ...state,
                userSearchResult: action.payload
            };
            break;
        case "VOICE_ADMIN_SET_VOICE_TAG_LIST":
            state = {
                ...state,
                voiceTagList: action.payload
            };
            break;
        case "VOICE_ADMIN_SET_VOICE_COUNCIL_LIST":
            state = {
                ...state,
                councilList: action.payload
            };
            break;
        case "VOICE_ADMIN_SET_VOICE_COUNCIL":
            state = {
                ...state,
                selectedCouncil: action.payload
            };
            break;
        case "VOICE_ADMIN_LOAD_VOICE_TYPES_LIST":
            state = {
                ...state,
                voiceTypesList: action.payload
            }
            break;
    }
    return state;
};

export default VoiceAdminDetailReducer;