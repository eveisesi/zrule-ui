<template>
    <div>
        <Navbar />
        <b-container>
            <b-col>
                <h3>Welcome {{ user.name }}</h3>
                <hr style="background-color: white" />
                <Alert />
                <Policies
                    :policies="policies"
                    :preventNewPolicies="actions.length == 0"
                    @removePolicy="handleRemovePolicy"
                />
                <Actions
                    :actions="actions"
                    @testAction="handleTestAction"
                    @deleteAction="handleDeleteAction"
                    @createAction="handleCreateAction"
                />
            </b-col>
        </b-container>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { API_URL } from "@/const";
import Policies from "@/components/policies/List.vue";
import Actions from "@/components/actions/List.vue";
import Navbar from "@/components/Navbar";
import Alert from "../components/Alert.vue";

export default {
    name: "Home",
    components: {
        Policies,
        Actions,
        Navbar,
        Alert,
    },
    data() {
        return {
            policies: [],
            actions: [],
            user: null,
        };
    },
    methods: {
        ...mapGetters(["isAuthed"]),
        ...mapActions(["storeAlertProps"]),
        async handleRemovePolicy({ index }) {
            const policy = this.policies[index];
            if (policy == undefined) {
                return;
            }
            await this.$http
                .delete(API_URL + "/policies/" + policy._id)
                .then((res) => {
                    this.policies.splice(index, 1);
                    this.storeAlertProps({
                        message: "Policy has been deleted successfully",
                        show: 5,
                        variant: "danger",
                    });
                })
                .catch((err) => {
                    this.storeAlertProps({
                        message: err.response.data.message,
                        show: 5,
                        variant: "danger",
                    });
                });
        },
        async handleCreateAction({ label, tested, endpoint }) {
            await this.$http
                .post(API_URL + "/actions", {
                    label,
                    endpoint,
                })
                .then(async (res) => {
                    await this.handleFetchActions();
                    this.storeAlertProps({
                        message: "Action created successfully",
                        show: 5,
                        variant: "success",
                    });
                });
        },
        async handleTestAction({ indexID }) {
            const action = this.actions[indexID];
            if (action == undefined) {
                return;
            }

            await this.$http
                .post(API_URL + "/actions/" + action._id + "/test")
                .then(async (res) => {
                    this.storeAlertProps({
                        show: 10,
                        message: "Action Verified Successfully",
                        variant: "success",
                    });
                    if (!action.tested) {
                        await this.handleFetchActions();
                    }
                })
                .catch((err) => {
                    this.storeAlertProps({
                        message:
                            "Verification Failed: " + err.response.data.message,
                        show: 10,
                        variant: "danger",
                    });
                });
        },
        async handleDeleteAction({ indexID }) {
            const action = this.actions[indexID];
            if (action == undefined) {
                return;
            }
            await this.$http
                .delete(API_URL + "/actions/" + action._id)
                .then((response) => {
                    this.actions.splice(indexID, 1);
                    this.storeAlertProps({
                        message: "Action has been deleted successfully",
                    });
                })
                .catch((err) => {
                    this.storeAlertProps({
                        message: err.response.data.message,
                        show: 5,
                        variant: "danger",
                    });
                });
        },
        async handleFetchActions() {
            await this.$http
                .get(API_URL + "/actions")
                .then((res) => (this.actions = res.data))
                .catch((err) => {
                    this.storeAlertProps({
                        message: err.response.data.message,
                        show: 5,
                        variant: "danger",
                    });
                });
        },
        async handleFetchPolicies() {
            await this.$http
                .get(API_URL + "/policies")
                .then((response) => {
                    this.policies = response.data;
                })
                .catch((err) => {
                    this.storeAlertProps({
                        message: err.response.data.message,
                        show: 5,
                        variant: "danger",
                    });
                });
        },
    },
    async created() {
        this.user = this.$store.getters.getUser;
        await this.handleFetchActions();
        await this.handleFetchPolicies();
    },
};
</script>

src\components\Policies\Summay.vue