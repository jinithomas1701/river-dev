export function loadGfgList(list) {
    return {
        type: "GOFORGROWTH_LOAD_GFG_LIST",
        payload: list
    }
}

export function pushGfgList(list) {
    return {
        type: "GOFORGROWTH_PUSH_GFG_LIST",
        payload: list
    }
}

export function addGfgItemToList(gfg) {
    return {
        type: "GOFORGROWTH_UNSHIFT_GFG_LIST",
        payload: gfg
    }
}

export function changeGfgOnIndex(gfg, index) {
    return {
        type: "GOFORGROWTH_CHANGE_GFG_ON_INDEX",
        payload: gfg,
        index: index
    }
}

export function deleteGfgAt(index) {
    return {
        type: "GOFORGROWTH_DELETE_GFG_AT_INDEX",
        payload: index
    }
}