import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootstrap/dist/css/bootstrap.css";
import "bootswatch/dist/cyborg/bootstrap.min.css";
import VueTypeaheadBootstrap from 'vue-typeahead-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrash, faPlus, faPencilAlt, faCheck, faUndoAlt, faEye, faSyncAlt, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { API_URL } from "@/const.js";

library.add(
	faTrash, faPlus, faPencilAlt, faCheck,
	faUndoAlt, faEye, faSyncAlt, faPause, faPlay
)

Vue.component('font-awesome-icon', FontAwesomeIcon)

import axios from "axios";
import VueAxios from "vue-axios";

import App from "./App.vue";
import router from "./router";
import store from "./store";

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(VueAxios, axios);
Vue.component('vue-typeahead-bootstrap', VueTypeaheadBootstrap)

axios.interceptors.request.use(req => {
	if (req.url.startsWith(API_URL)) {
		const token = store.getters.getToken
		req.headers.authorization = `Bearer ${token}`
	}
	return req
})

axios.interceptors.response.use(res => {
	if (res.headers['X-Refreshed-Token'] != undefined) {
		const refreshedToken = res.headers['X-Refreshed-Token']
		store.dispatch('storeToken', refreshedToken)
	}
	return res
}, err => {
	if (err.response.status == 401) {
		store.dispatch('storeToken', null)
		router.push('/login')
	}
	return Promise.reject(err)
});

new Vue({
	router,
	store,
	render: (h) => h(App),
}).$mount("#app");
