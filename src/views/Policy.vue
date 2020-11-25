<template>
    <div>
        <Navbar />
        <Overview
            :policy="policy"
            v-if="!loading"
            @addRule="handleAddRule"
            @removeRule="handleRemoveRule"
            @addCondition="handleAddCondition"
            @updateCondition="handleUpdateCondition"
            @removeCondition="handleRemoveCondition"
            @savePolicy="handleSavePolicy"
            @deletePolicy="handleDeletePolicy"
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
        };
    },
    methods: {
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
        async handleDeletePolicy() {
            if (this.isNewPolicy) {
                this.$router.push("/");
            }

            this.$http
                .delete(API_URL + "/policies/" + this.policy._id)
                .then((res) => {
                    setTimeout(function () {}, 2000);
                    this.$router.push("/");
                });
        },
        async handleSavePolicy() {
            this.isNewPolicy
                ? await this.$http
                      .post(API_URL + "/policies", {
                          name: this.policy.name.valueOf(),
                          rules: this.policy.rules.valueOf(),
                          actions: [], // TODO: Replace this with actual actions
                      })
                      .then(async (res) => {
                          await this.fetchPolicy(res.data._id);
                          this.$router.push("/policies/" + res.data._id);
                          return;
                      })
                      .catch((err) => {})
                : await this.$http
                      .patch(API_URL + "/policies/" + this.policy._id, {
                          name: this.policy.name.valueOf(),
                          rules: this.policy.rules.valueOf(),
                          actions: [], // TODO: Replace this with actual actions
                      })
                      .then(async (res) => {
                          await this.fetchPolicy(this.policy._id);
                      })
                      .catch((err) => {});
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
            this.loading = false;

            return;
        }
        await this.fetchPolicy(pathID);
        this.loading = false;
    },
};
</script>

<style>
</style>
