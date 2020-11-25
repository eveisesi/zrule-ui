<template>
    <b-row>
        <b-col lg="4" class="text-center">{{ action.label }}</b-col>
        <b-col lg="3" class="text-center">{{ platformUcfirst }}</b-col>
        <b-col lg="3" class="text-center">{{ actionStatus }}</b-col>
        <b-col class="text-center">
            <b-button variant="primary" @click="handleTestAction">
                <font-awesome-icon icon="sync-alt" />
            </b-button>
            <b-button variant="danger" class="ml-2" @click="handleDeleteAction"
                ><font-awesome-icon icon="trash"
            /></b-button>
        </b-col>
    </b-row>
</template>

<script>
export default {
    name: "Action",
    props: {
        action: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
    },
    computed: {
        platformUcfirst() {
            return (
                this.action.platform.charAt(0).toUpperCase() +
                this.action.platform.slice(1)
            );
        },
        actionStatus() {
            return this.action.tested ? "Verified" : "Pending Verification";
        },
    },
    methods: {
        handleTestAction() {
            this.$emit("testAction", { indexID: this.index });
        },
        handleDeleteAction() {
            this.$emit("deleteAction", { indexID: this.index });
        },
    },
};
</script>

<style>
</style>