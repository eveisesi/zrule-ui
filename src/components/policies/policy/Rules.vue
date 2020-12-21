<template>
    <div class="mt-2">
        <b-card
            v-for="(rule, index) in rules"
            :key="index"
            :class="index > 0 ? 'mt-3' : ''"
        >
            <template #header>
                <h5>
                    {{ getNumberWithOrdinal(index + 1) }} Rule
                    <b-button
                        class="float-right"
                        variant="danger"
                        @click="handleRemoveRule(index)"
                        v-if="rules.length > 1"
                    >
                        <font-awesome-icon icon="trash" />
                    </b-button>

                    <b-button
                        class="float-right mr-1"
                        variant="primary "
                        @click="handleAddCondition(index)"
                    >
                        <font-awesome-icon icon="plus" />
                    </b-button>
                </h5>
            </template>
            <b-container>
                <Condition
                    v-for="(condition, conditionIndex) in rule"
                    :condition="condition"
                    :ruleIndex="index"
                    :index="conditionIndex"
                    :key="conditionIndex"
                    @updateCondition="handleUpdateCondition"
                    @removeCondition="handleRemoveCondition"
                    :class="conditionIndex > 0 ? 'mt-2' : ''"
                    :showLine="conditionIndex < rule.length - 1"
                />
            </b-container>
        </b-card>
    </div>
</template>

<script>
import Condition from "./rule/Condition.vue";
export default {
    components: { Condition },
    name: "Rules",
    props: {
        rules: {
            type: Array,
            required: true,
        },
    },

    methods: {
        getNumberWithOrdinal(n) {
            var s = ["th", "st", "nd", "rd"],
                v = n % 100;
            return n + (s[(v - 20) % 10] || s[v] || s[0]);
        },
        handleRemoveRule(ruleIndex) {
            this.$emit("removeRule", { ruleIndex });
        },
        handleAddCondition(ruleIndex) {
            this.$emit("addCondition", ruleIndex);
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
};
</script>

<style>
</style>