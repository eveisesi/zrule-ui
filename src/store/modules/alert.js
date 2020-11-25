const state = {
    show: false,
    variant: "success",
    title: "",
    message: "",
    dismissible: true,
    fade: true,
}

const getters = {
    getAlertProps() {
        return state
    }
}

const actions = {
    storeAlertProps({ commit }, props) {
        if (props.show) {
            commit("setShow", props.show)
        } else {
            commit("setShow", 5)
        }
        if (props.variant) {
            commit("setVariant", props.variant)
        }
        if (props.title) {
            commit("setTitle", props.title)
        }
        if (props.message) {
            commit("setMessage", props.message)
        }
        if (props.dismissible) {
            commit("setDismissible", props.dismissible)
        }
        if (props.fade) {
            commit("setFade", props.fade)
        }
    },
    resetAlertProps({ commit }) {
        commit("setShow", false)
        commit("setVariant", "success")
        commit("setTitle", "")
        commit("setMessage", "")
        commit("setDismissible", true)
        commit("setFade", true)
    }
}

const mutations = {
    setShow(state, show) {
        state.show = show
    },
    setVariant(state, variant) {
        state.variant = variant
    },
    setTitle(state, title) {
        state.title = title
    },
    setMessage(state, message) {
        state.message = message
    },
    setDismissible(state, dismissible) {
        state.dismissible = dismissible
    },
    setFade(state, fade) {
        state.fade = fade
    }

}

export default { state, getters, actions, mutations }