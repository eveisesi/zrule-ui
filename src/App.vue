<template>
    <div>
        <router-view />
    </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { API_URL } from "@/const";

export default {
    name: "App",
    methods: {
        ...mapGetters(["getPaths"]),
        ...mapActions(["storePaths"]),
    },
    async created() {
        await this.$http.get(API_URL + "/paths").then((response) => {
            this.storePaths(response.data);
        });
    },
};
</script>