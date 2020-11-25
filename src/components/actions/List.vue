<template>
    <b-card class="mt-2">
        <template #header>
            <h5>
                My Actions
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
                    <b-col lg="5">
                        <label for="IptActionLabel">Action Label</label>
                        <b-form-input v-model="newLabel" />
                    </b-col>
                    <b-col lg="5">
                        <label for="IptActionEndpoint">Action Endpoint</label>
                        <b-form-input v-model="newEndpoint" />
                    </b-col>
                    <b-col class="text-center">
                        <b-button
                            variant="success"
                            class="mt-2"
                            @click="handleCreateAction"
                        >
                            <font-awesome-icon icon="check" />
                        </b-button>
                    </b-col>
                </b-row>
            </b-card>
        </b-collapse>
        <div v-if="actions.length > 0">
            <b-row>
                <b-col lg="4" class="text-center"> Label </b-col>
                <b-col lg="3" class="text-center"> Platform </b-col>
                <b-col lg="3" class="text-center"> Status </b-col>
            </b-row>
            <b-row>
                <hr style="background-color: white" />
            </b-row>
            <Action
                v-for="(action, index) in actions"
                :key="index"
                :action="action"
                :index="index"
                :class="index > 0 ? 'mt-2' : ''"
                @testAction="handleTestAction"
                @deleteAction="handleDeleteAction"
            />
        </div>
        <b-card-text v-else>
            No actions found. Please use the button in the top right of this
            card to add a new action
        </b-card-text>
    </b-card>
</template>

<script>
import Action from "./Action";
export default {
    name: "List",
    components: {
        Action,
    },
    data() {
        return {
            visible: false,
            newLabel: "",
            newEndpoint: "",
        };
    },
    props: {
        actions: {
            type: Array,
            required: true,
        },
    },
    methods: {
        handleTestAction({ indexID }) {
            this.$emit("testAction", { indexID });
        },
        handleDeleteAction({ indexID }) {
            this.$emit("deleteAction", { indexID });
        },
        handleCreateAction() {
            this.$emit("createAction", {
                label: this.newLabel,
                tested: false,
                endpoint: this.newEndpoint,
            });
        },
    },
    watch: {
        actions: function (newValue, oldValue) {
            this.visible = false;
            this.newLabel = "";
            this.newEndpoint = "";
        },
    },
    mounted() {
        console.log("List.vue mounted", this.actions);
    },
    created() {
        console.log("List.vue created", this.actions);
    },
};
</script>

<style>
</style>