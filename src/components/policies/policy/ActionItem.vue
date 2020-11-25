<template>
    <b-row>
        <b-col lg="5" class="text-center">{{ action.label }}</b-col>
        <b-col lg="5" class="text-center">{{ platformUcfirst }}</b-col>
        <b-col class="text-center">
            <b-button variant="danger" class="ml-2" @click="handleRemoveAction"
                ><font-awesome-icon icon="trash"
            /></b-button>
        </b-col>
    </b-row>
</template>

<script>
export default {
    name: "ActionItem",
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
    },
    methods: {
        handleRemoveAction() {
            this.$emit("removeAction", { index: this.index });
        },
    },
};
</script>

<style>
</style>