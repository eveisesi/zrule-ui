<template>
    <div>
        <Navbar />
        <Overview
            :policy="policy"
            :policyActions="policyActions"
            :actions="actions"
            v-if="!loading"
            @addRule="handleAddRule"
            @removeRule="handleRemoveRule"
            @addCondition="handleAddCondition"
            @updateCondition="handleUpdateCondition"
            @removeCondition="handleRemoveCondition"
            @savePolicy="handleSavePolicy"
            @deletePolicy="handleDeletePolicy"
            @assignAction="handleAssignAction"
            @removeAction="handleRemoveAction"
        />
        <div class="mt-5 text-center" v-else>
            <b-spinner variant="dark"></b-spinner>
        </div>
    </div>
</template>

<script>
import Navbar from "../components/Navbar.vue";
import { API_URL } from "@/const";
import Overview from "../components/policies/Overview.vue";
import { mapActions } from "vuex";

const blankCondition = {
    path: "",
    comparator: "",
    values: [],
    entities: [],
    editing: true,
    isNew: true,
};

export default {
    name: "Policy",
    components: {
        Navbar,
        Overview,
    },
    data() {
        return {
            loading: true,
            policy: null,
            policyActions: [],
            actions: [],
            isNewPolicy: false,
        };
    },
    methods: {
        ...mapActions(["storeAlertProps"]),
        handleAddCondition(e) {
            this.policy.rules[e].push(blankCondition);
        },
        handleUpdateCondition({ ruleIndex, conditionIndex, condition }) {
            // You pulled your fuckin hair out trying to find this line of code.
            // https://vuejs.org/v2/guide/reactivity.html#For-Arrays
            this.$set(this.policy.rules[ruleIndex], conditionIndex, condition);
        },
        handleAddRule() {
            this.policy.rules.push([]);
        },
        handleRemoveRule({ ruleIndex }) {
            this.policy.rules.splice(ruleIndex, 1);
        },
        handleRemoveCondition({ ruleIndex, conditionIndex }) {
            this.policy.rules[ruleIndex].splice(conditionIndex, 1);
        },
        async handleDeletePolicy() {
            if (this.isNewPolicy) {
                this.$router.push("/");
                return;
            }

            await this.$http
                .delete(API_URL + "/policies/" + this.policy._id)
                .then((res) => {
                    this.storeAlertProps({
                        message: "Policy deleted successfully",
                        show: 10,
                    });
                    this.$router.push("/");
                });
        },
        async handleAssignAction({ actionID }) {
            const action = this.actions.find((e) => e._id === actionID);
            if (!action) {
                console.log(action);
                // Use alert system to notify user of invalid action
                return;
            }
            this.policy.actions.push(actionID);
            this.policyActions.push(action);
        },
        handleRemoveAction({ index }) {
            const action = this.policy.actions[index];
            this.policyActions = this.policyActions.filter(
                (e) => e._id != action
            );
            this.policy.actions.splice(index, 1);
        },
        async handleSavePolicy() {
            this.isNewPolicy
                ? await this.$http
                      .post(API_URL + "/policies", {
                          name: this.policy.name.valueOf(),
                          rules: this.policy.rules.valueOf(),
                          actions: this.policy.actions.valueOf(),
                      })
                      .then(async (res) => {
                          await this.fetchPolicy(res.data._id);
                          await this.fetchPolicyActions(res.data._id);
                          this.isNewPolicy = false;
                          this.$router.push("/policies/" + res.data._id);
                          this.storeAlertProps({
                              show: 10,
                              message: "Policy Created Successfully",
                          });
                          return;
                      })
                      .catch((err) => {
                          this.storeAlertProps({
                              show: 10,
                              message: err.response.data.message,
                              variant: "danger",
                          });
                      })
                : await this.$http
                      .patch(API_URL + "/policies/" + this.policy._id, {
                          name: this.policy.name.valueOf(),
                          rules: this.policy.rules.valueOf(),
                          actions: this.policy.actions.valueOf(),
                      })
                      .then(async (res) => {
                          await this.fetchPolicy(this.policy._id);
                          await this.fetchPolicyActions(this.policy._id);
                          this.storeAlertProps({
                              show: 10,
                              message: "Policy Updated Successfully",
                          });
                      })
                      .catch((err) => {
                          this.storeAlertProps({
                              show: 10,
                              message: err.response.data.message,
                              variant: "danger",
                          });
                      });
        },
        async fetchPolicy(policyID) {
            if (policyID == "") {
                return;
            }

            await this.$http
                .get(API_URL + "/policies/" + policyID)
                .then((res) => {
                    this.policy = res.data;
                })
                .catch((err) => {});
        },
        async fetchPolicyActions(policyID) {
            if (policyID == "") {
                return;
            }

            await this.$http
                .get(API_URL + "/policies/" + policyID + "/actions")
                .then((res) => (this.policyActions = res.data));
        },
        async fetchActions() {
            await this.$http
                .get(API_URL + "/actions")
                .then((res) => (this.actions = res.data));
        },
    },

    async created() {
        let policyID;
        if (this.$router.history.current.params.id != undefined) {
            policyID = this.$router.history.current.params.id;
        }
        await this.fetchActions();
        if (policyID === "new") {
            this.isNewPolicy = true;
            this.policy = {
                name: "My New Policy",
                rules: [[blankCondition]],
                actions: [],
            };
            this.loading = false;

            return;
        }
        await this.fetchPolicy(policyID);
        await this.fetchPolicyActions(policyID);

        this.loading = false;
    },
};
</script>

<style>
</style>
