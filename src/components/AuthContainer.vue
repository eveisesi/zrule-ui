<template>
    <b-container>
        <b-row>
            <b-col lg="8" offset="2">
                <b-card
                    bg-variant="secondary"
                    text-variant="white"
                    title="Welcome To ZRule, Please Login To Continue"
                    class="mt-4"
                >
                    This application does not require any scopes, we just use
                    CCP's SSO to authenticate users. If you see any request for
                    scopes, please close your browser and come back to this
                    site. Clicking the button below will launch the SSO Auth
                    flow in a new tab.
                    <b-row>
                        <b-col>
                            <a @click="login">
                                <img
                                    class="mt-2 rounded mx-auto d-block"
                                    src="https://web.ccpgamescdn.com/eveonlineassets/developers/eve-sso-login-black-large.png"
                                />
                            </a>
                        </b-col>
                    </b-row>
                </b-card>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
import buildUrl from "build-url";
import { mapActions, mapGetters } from "vuex";

let loginMonitor;

export default {
    name: "AuthContainer",
    data() {
        return {
            loginMonitor: null,
        };
    },
    methods: {
        async authURL() {
            let state, status;
            await this.$http
                .post(process.env.VUE_APP_API_URL + "/auth/login")
                .then((response) => {
                    if (response.data.status == "created") {
                        this.storeAuthState(response.data.state);
                        state = response.data.state;
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
            return buildUrl("https://login.eveonline.com", {
                path: "/v2/oauth/authorize",
                queryParams: {
                    response_type: "code",
                    redirect_uri:
                        process.env.VUE_APP_API_URL + "/auth/callback",
                    client_id: process.env.VUE_APP_SSO_CLIENT_ID,
                    state: state,
                },
            });
        },
        ...mapActions(["storeAuthState", "storeToken", "storeUser"]),
        ...mapGetters(["fetchAuthState"]),
        async checkLoginStatus() {
            let state = this.fetchAuthState();
            let success = false;
            await this.$http
                .get(process.env.VUE_APP_API_URL + "/auth/login/" + state)
                .then((response) => {
                    let status = response.data.status;
                    if (status == "invalid") {
                        clearTimeout(this.loginMonitor);
                        this.storeAuthState(null);
                        console.error(
                            "Invalid state received from backend, clearing Timeout, reseting authAttempt"
                        );
                        // TODO: Maybe set error message to notify user of invalid login attemp
                        return success;
                    } else if (status == "completed") {
                        let token = response.data.token;
                        clearTimeout(this.loginMonitor);
                        this.storeAuthState(null);
                        this.storeToken(token);
                        success = true;
                        return success;
                    } else {
                        // Should be pending
                        this.loginMonitor = setTimeout(
                            this.checkLoginStatus,
                            2000
                        );
                        return success;
                    }
                });
            if (success) {
                await this.$http
                    .get(process.env.VUE_APP_API_URL + "/user")
                    .then(async (response) => {
                        await this.storeUser(response.data);
                        await this.$router.push("/");
                    });
            }
        },
        async login() {
            const url = await this.authURL();
            window.open(url, "_blank");
            this.loginMonitor = setTimeout(this.checkLoginStatus, 2000);
        },
    },
};
</script>

<style>
</style>