<template>
    <div>
        <b-card>
            <template #header>
                <h5>
                    My Policies
                    <b-button
                        class="float-right"
                        variant="primary "
                        href="/policies/new"
                        :disabled="preventNewPolicies"
                    >
                        <font-awesome-icon icon="plus" />
                    </b-button>
                </h5>
            </template>

            <div v-if="policies.length > 0">
                <b-row>
                    <b-col lg="4" class="text-center">Policy Name</b-col>
                    <b-col lg="3" class="text-center"># Rules</b-col>
                    <b-col lg="3" class="text-center"># Actions</b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <hr style="background-color: white" />
                    </b-col>
                </b-row>
                <b-row
                    v-for="(policy, index) in policies"
                    :key="policy._id"
                    :class="index > 0 ? 'mt-2' : ''"
                >
                    <b-col lg="3" class="text-center">
                        <span v-if="policy.paused">[PAUSED]</span>
                        {{ policy.name }}
                    </b-col>
                    <b-col lg="3" class="text-center">{{
                        policy.rules.length
                    }}</b-col>
                    <b-col lg="3" class="text-center">{{
                        policy.actions.length
                    }}</b-col>
                    <b-col lg="3" class="text-center">
                        <b-button
                            variant="success"
                            :to="'policies/' + policy._id"
                        >
                            <font-awesome-icon icon="eye" />
                        </b-button>
                        <b-button
                            class="ml-1"
                            variant="primary"
                            @click="handlePauseAction(index)"
                        >
                            <font-awesome-icon
                                icon="pause"
                                v-if="!policy.paused"
                            />
                            <font-awesome-icon icon="play" v-else />
                        </b-button>
                        <b-button
                            class="ml-1"
                            variant="danger"
                            @click="handleRemovePolicy(index)"
                        >
                            <font-awesome-icon icon="trash" />
                        </b-button>
                    </b-col>
                </b-row>
            </div>
            <b-card-text v-else>
                No policies found. Please use the button in the top right of
                this card to add a new policy
            </b-card-text>
        </b-card>
    </div>
</template>

<script>
export default {
    name: "List",
    props: {
        policies: Array,
        preventNewPolicies: Boolean,
    },
    data() {
        return {
            user: {},
        };
    },
    methods: {
        handlePauseAction(index) {
            this.$emit("pausePolicy", { index });
        },
        handleRemovePolicy(index) {
            this.$emit("removePolicy", { index });
        },
    },
};
</script>

<style>
</style>