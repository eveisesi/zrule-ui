<template>
    <div>
        <Navbar />
        <Overview
            :policy="policy"
            :alert="alert"
            v-if="!loading"
            @resetAlert="resetAlert"
            @addRule="handleAddRule"
            @removeRule="handleRemoveRule"
            @addCondition="handleAddCondition"
            @updateCondition="handleUpdateCondition"
            @removeCondition="handleRemoveCondition"
            @savePolicy="savePolicy"
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

const defaultAlert = {
    variant: "",
    message: "",
    show: false,
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
            alert: defaultAlert,
        };
    },
    methods: {
        showAlert(message, variant = "success", show = 5) {
            this.alert = {
                message,
                variant,
                show,
            };
        },
        resetAlert() {
            this.alert = Object.assign({}, this.alert, defaultAlert);
        },
        handleAddCondition(e) {
            this.policy.rules[e].push({
                path: "",
                comparator: "",
                values: [],
                entities: [],
                editing: true,
                isNew: true,
            });
        },
        handleUpdateCondition({ ruleIndex, conditionIndex, condition }) {
            console.log(
                "Policy.vue handleUpdateCondition",
                ruleIndex,
                conditionIndex,
                condition
            );
            // You pulled your fuckin hair out trying to find this line of code.
            // https://vuejs.org/v2/guide/reactivity.html#For-Arrays
            this.$set(this.policy.rules[ruleIndex], conditionIndex, condition);
            this.showAlert(
                "Rule Updated successfully, make sure to commit it by clicking save",
                "success",
                5
            );
        },
        handleAddRule() {
            this.policy.rules.push([]);
        },
        handleRemoveRule({ ruleIndex }) {
            console.log("Policy.vue handleRemoveRule", ruleIndex);
            this.policy.rules.splice(ruleIndex, 1);
        },
        handleRemoveCondition({ ruleIndex, conditionIndex }) {
            this.policy.rules[ruleIndex].splice(conditionIndex, 1);
        },

        async savePolicy() {
            this.isNewPolicy
                ? await this.$http
                      .post(API_URL + "/policies", {
                          name: this.policy.name.valueOf(),
                          rules: this.policy.rules.valueOf(),
                          actions: [], // TODO: Replace this with actual actions
                      })
                      .then(async (res) => {
                          this.showAlert("Policy Created Successfully");
                          await this.fetchPolicy(res.data._id);
                      })
                      .catch((err) => {
                          this.showAlert(
                              "failed to create policy. Please try again",
                              "danger",
                              30
                          );
                      })
                : await this.$http
                      .patch(API_URL + "/policies/" + this.policy._id, {
                          name: this.policy.name.valueOf(),
                          rules: this.policy.rules.valueOf(),
                          actions: [], // TODO: Replace this with actual actions
                      })
                      .then(async (res) => {
                          this.showAlert("Policy Updated Successfully");
                          await this.fetchPolicy(this.policy._id);
                      })
                      .catch((err) => {
                          this.showAlert(
                              "failed to update policy. Please try again",
                              "danger",
                              30
                          );
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
                .catch((err) => {
                    this.showAlert("failed to fetch policies", "danger", 30);
                });
        },
    },

    async created() {
        let pathID;
        if (this.$router.history.current.params.id != undefined) {
            pathID = this.$router.history.current.params.id;
        }

        if (pathID === "new") {
            this.isNewPolicy = true;
            this.policy = {
                name: "My New Policy",
                rules: [],
                actions: [],
            };

            return;
        }
        await this.fetchPolicy(pathID);
        this.loading = false;
    },
};
</script>

<style>
</style>
