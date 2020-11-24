const state = {
    paths: [],
}

const getters = {
    getPaths() {
        return state.paths
    }
}

const actions = {
    storePaths({ commit }, paths) {
        commit("storePaths", paths)
    }
}

const mutations = {
    storePaths(state, value) {
        state.paths = value
    }
}

export default {
    state,
    getters,
    actions,
    mutations
};
