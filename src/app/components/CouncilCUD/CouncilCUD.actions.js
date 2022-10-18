export function loadCouncilCuds(list, status) {
    return  {
        type: "COUNCIL_CUD_LOAD_CUDS",
        payload: list,
        status: status
    }
}

export function pushCouncilCuds(list, status) {
    return  {
        type: "COUNCIL_CUD_PUSH_CUDS",
        payload: list,
        status: status
    }
}

export function loadBucketTypes(list) {
    return {
        type: "COUNCIL_CUD_LOAD_BUCKET_LISTS",
        payload: list
    }
}