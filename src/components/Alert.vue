<template>
    <b-row>
        <b-col>
            <b-alert
                :show="alert.show"
                :fade="alert.fade"
                :variant="alert.variant"
                :dismissible="alert.dismissible"
                @dismissed="resetAlertProps"
            >
                <div v-if="alert.title">
                    {{ alert.title }}
                </div>
                <div v-if="alert.message">{{ alert.message }}</div>
            </b-alert></b-col
        >
    </b-row>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";
export default {
    name: "Alert",
    data() {
        return {
            alert: this.getAlertProps(),
        };
    },
    methods: {
        ...mapGetters(["getAlertProps"]),
        ...mapActions(["resetAlertProps"]),
    },
    watch: {
        getAlertProps() {
            this.alert = this.getAlertProps;
        },
    },
};
</script>

<style>
</style>