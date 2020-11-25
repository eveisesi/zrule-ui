<template>
    <b-container>
        <!-- PolicyName hosts is own b-row -->
        <PolicyName :name="policy.name" @updateName="handleUpdateName" />
        <hr class="solid-white-line" />
        <Rules
            :rules="this.policy.rules"
            @updateCondition="handleUpdateCondition"
            @addCondition="handleAddCondition"
            @removeCondition="handleRemoveCondition"
            @removeRule="handleRemoveRule"
        />

        <div class="mt-2">
            <b-button variant="secondary" @click="handleSavePolicy"
                >Save Policy</b-button
            >
            <b-button class="ml-2" variant="primary" @click="handleAddRule"
                >Add Rule</b-button
            >
            <b-button class="ml-2" variant="danger" @click="handleDeletePolicy"
                >Delete Policy</b-button
            >
        </div>
    </b-container>
</template>

<script>
import PolicyName from "./policy/Name";
import Rules from "./policy/Rules.vue";

export default {
    name: "Overview",
    components: {
        PolicyName,
        Rules,
    },
    props: {
        policy: Object,
    },
    methods: {
        handleSavePolicy() {
            this.$emit("savePolicy");
        },
        handleDeletePolicy() {
            this.$emit("deletePolicy");
        },
        handleUpdateName(value) {
            this.policy.name = value;
        },
        handleAddRule() {
            this.$emit("addRule");
        },
        handleRemoveRule({ ruleIndex }) {
            this.$emit("removeRule", { ruleIndex });
        },
        handleAddCondition(evt) {
            this.$emit("addCondition", evt);
        },
        handleUpdateCondition({ ruleIndex, conditionIndex, condition }) {
            this.$emit("updateCondition", {
                ruleIndex,
                conditionIndex,
                condition,
            });
        },
        handleRemoveCondition({ ruleIndex, conditionIndex }) {
            this.$emit("removeCondition", {
                ruleIndex,
                conditionIndex,
            });
        },
    },
    created() {},
};
</script>

<style scoped>
.solid-white-line {
    background-color: white;
}
</style>