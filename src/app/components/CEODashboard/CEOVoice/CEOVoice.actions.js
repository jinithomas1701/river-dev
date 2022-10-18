export function setCEOVoiceDetails(summary) {
    return {
        type: "CEO_VOICE_SET_DETAILS",
        payload: summary
    }
}

export function resetCEOVoiceDetails() {
    return {
        type: "CEO_VOICE_SET_DETAILS",
        payload: {
            escalated: 0,
            inProgress: 0,
            pending: 0,
            rejected: 0,
            resolved: 0,
            total: 0
        }
    }
}

export function setCEOVoiceChart(chart) {
    return {
        type: "CEO_VOICE_SET_CHART",
        payload: chart
    }
}

export function resetCEOVoiceChart() {
    return {
        type: "CEO_VOICE_SET_CHART",
        payload: [["Time", "Voices"],["", 0]]
    }
}