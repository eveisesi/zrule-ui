<template>
    <b-card class="mt-2">
        <template #header>
            <h5>
                {{ policyName }} Actions
                <b-button
                    class="float-right"
                    variant="primary "
                    @click="visible = !visible"
                >
                    <font-awesome-icon icon="plus" />
                </b-button>
            </h5>
        </template>
        <b-collapse id="collapse-4" v-model="visible" class="mt-0 mx-2 mb-4">
            <b-card bg-variant="light" header="Light">
                <template #header> <h5>Create A New Action</h5> </template>
                <b-row>
                    <b-col lg="11">
                        <label for="DrpdwnAvailableActions"
                            >Available Actions</label
                        >
                        <b-form-select
                            id="DrpdwnAvailableActions"
                            v-model="selectedAction"
                            :options="availableActions"
                        />
                    </b-col>
                    <b-col class="text-center">
                        <b-button
                            variant="success"
                            class="mt-2"
                            @click="handleAssignAction"
                        >
                            <font-awesome-icon icon="check" />
                        </b-button>
                    </b-col>
                </b-row>
            </b-card>
        </b-collapse>
        <!-- <div v-if="actions.length > 0"> -->
        <div v-if="policyActions.length > 0">
            <b-row>
                <b-col lg="5" class="text-center"> Label </b-col>
                <b-col lg="5" class="text-center"> Platform </b-col>
            </b-row>
            <b-row>
                <hr style="background-color: white" />
            </b-row>
            <ActionItem
                v-for="(action, index) in policyActions"
                :key="index"
                :action="action"
                :index="index"
                :class="index > 0 ? 'mt-2' : ''"
                @removeAction="handleRemoveAction"
            />
        </div>
        <b-card-text v-else>
            No actions found. Please use the button in the top right of this
            card to add a new action
        </b-card-text>
    </b-card>
</template>

<script>
import ActionItem from "./ActionItem";

export default {
    name: "Action",
    components: {
        ActionItem,
    },
    data() {
        return {
            visible: false,
            selectedAction: "",
        };
    },
    computed: {
        availableActions() {
            const s = this.actions.map((action) => {
                return {
                    text: action.label + " - " + action.platform,
                    value: action._id,
                };
            });
            console.log("availableActions", s);
            return s;
        },
    },
    props: {
        policyName: {
            type: String,
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
        handleAssignAction() {
            this.$emit("assignAction", { actionID: this.selectedAction });
        },
        handleRemoveAction({ index }) {
            this.$emit("removeAction", { index });
        },
    },
    created() {
        console.log(this.actions, this.policyActions);
    },
};
</script>

<style>
</style>