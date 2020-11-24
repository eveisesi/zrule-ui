<template></template>

<script>
import { mapActions } from "vuex";

export default {
    Name: "Logout",
    methods: {
        ...mapActions(["storeToken", "storeUser"]),
    },
    created() {
        this.storeToken(null);
        this.storeUser(null);
        this.$router.push("/login");
        return;
    },
};
</script>

<style>
</style>