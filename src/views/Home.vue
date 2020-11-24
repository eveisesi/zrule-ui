<template>
    <div>
        <Navbar />
        <b-container>
            <b-col>
                <h3>Welcome {{ user.name }}</h3>
                <hr style="background-color: white" />
                <PolicySummary
                    v-if="policies.length > 0"
                    :policies="policies"
                />
                <div v-else>
                    <strong>You have no policies</strong>
                </div>
            </b-col>
        </b-container>
    </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import PolicySummary from "@/components/policies/Summary.vue";
import Navbar from "@/components/Navbar";

export default {
    name: "Home",
    components: {
        PolicySummary,
        Navbar,
    },
    data() {
        return {
            policies: [],
            user: null,
        };
    },
    methods: {
        ...mapGetters(["isAuthed"]),
    },
    async created() {
        this.user = this.$store.getters.getUser;
        await this.$http
            .get(process.env.VUE_APP_API_URL + "/policies")
            .then((response) => {
                this.policies = response.data;
            });
    },
};
</script>

src\components\Policies\Summay.vue