<template>
    <b-container>
        <!-- PolicyName hosts is own b-row -->
        <PolicyName :name="policy.name" @updateName="handleUpdateName" />
        <hr class="solid-white-line" />
        <Alert />
        <Rules
            :rules="this.policy.rules"
            @updateCondition="handleUpdateCondition"
            @addCondition="handleAddCondition"
            @removeCondition="handleRemoveCondition"
            @removeRule="handleRemoveRule"
        />
        <div class="mt-2">
            <b-button variant="primary" @click="handleAddRule"
                >Add Rule</b-button
            >
        </div>
        <Actions
            :policyName="policy.name"
            :policyActions="policyActions"
            :actions="actions"
            @assignAction="handleAssignAction"
            @removeAction="handleRemoveAction"
        />
        <div class="mt-2">
            <b-button variant="secondary" @click="handleSavePolicy"
                >Save Policy</b-button
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
import Actions from "./policy/Actions.vue";
import Alert from "../Alert";

export default {
    name: "Overview",
    components: {
        PolicyName,
        Rules,
        Actions,
        Alert,
    },

    props: {
        policy: {
            type: Object,
            required: true,
        },
        policyActions: {
            type: Array,
            required: true,
        },
        actions: {
            type: Array,
            required: true,
        },
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
        handleAssignAction({ actionID }) {
            this.$emit("assignAction", {
                actionID,
            });
        },
        handleRemoveAction({ index }) {
            this.$emit("removeAction", { index });
        },
    },
};
</script>

<style scoped>
.solid-white-line {
    background-color: white;
}
</style>