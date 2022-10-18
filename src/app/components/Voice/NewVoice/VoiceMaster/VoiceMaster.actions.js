export function storeVoiceList(voiceList){
    return {
        type: "VOICE_MASTER_STORE_VOICE_LIST",
        payload: voiceList
    };
}

export function clearVoiceList(){
    return {
        type: "VOICE_MASTER_CLEAR_VOICE_LIST"
    };
}

export function storeVoiceDetails(selectedVoice){
    return {
        type: "VOICE_MASTER_STORE_VOICE_DETAILS",
        payload: selectedVoice
    };
}

export function clearVoiceDetails(){
    return {
        type: "VOICE_MASTER_CLEAR_VOICE_DETAILS"
    };
}

export function storeDepartments(departmentList){
    return {
        type: "VOICE_MASTER_STORE_DEPARTMENTS",
        payload: departmentList
    };
}

export function storeVoiceTypes(voiceTypeList){
    return {
        type: "VOICE_MASTER_STORE_VOICETYPES",
        payload: voiceTypeList
    };
}

export function storeDiscussion(discussion){
    return {
        type: "VOICE_MASTER_STORE_DISCUSSION",
        payload: discussion
    };
}

export function clearDiscussion(){
    return {
        type: "VOICE_MASTER_CLEAR_DISCUSSION"
    };
}