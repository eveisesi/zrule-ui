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
                })
                .catch((err) => {
                    console.error("Failed to delete policy");
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
                        message: "action created successfully",
                        show: 5,
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
                .then((res) => {
                    this.storeAlertProps({
                        show: 10,
                        message: "Ok, we've sent that test message",
                    });
                })
                .catch((err) => {
                    console.error(err);
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
                .catch((err) => {});
        },
        async handleFetchActions() {
            await this.$http
                .get(API_URL + "/actions")
                .then((res) => (this.actions = res.data))
                .catch((err) => {
                    console.error(err);
                });
        },
        async handleFetchPolicies() {
            await this.$http
                .get(API_URL + "/policies")
                .then((response) => {
                    this.policies = response.data;
                })
                .catch((err) => {
                    console.error(err);
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