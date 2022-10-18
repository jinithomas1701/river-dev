const PresidentWhatsNewReducer = (state={
    filterType: "ALL",
    filterGroupBy: "ST",
    filterList: []
},action)=>{
    switch(action.type) {
        case "ON-FILTERTYPE-CHANGE":
            state = {
                ...state,
               filterType: action.payload
            };
            break;
        case "ON-FILTERGROUPBY-CHANGE":
            state={
                ...state,
                filterGroupBy: action.payload
            };
            break;
        case "ON-FILTERLIST-CHANGE":
            state={
                ...state,
                filterList : action.payload
            };
            break;
    }
    return state;
}
export default PresidentWhatsNewReducer


