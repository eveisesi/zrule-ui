<template>
    <b-navbar toggleable="lg" type="dark" variant="dark">
        <b-container>
            <b-navbar-brand href="/">ZRule</b-navbar-brand>
            <b-navbar-nav class="ml-auto">
                <template v-slot:button-content>
                    <img src="https://images.evetech.net/Character/1_32.jpg" />
                </template>
                <div v-if="this.isAuthed()">
                    <b-dropdown-item @click="logout">Logout</b-dropdown-item>
                </div>
                <div></div>
            </b-navbar-nav>
        </b-container>
    </b-navbar>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
    name: "Navbar",
    methods: {
        ...mapGetters(["isAuthed"]),
        logout() {
            this.$router.push("/logout");
        },
    },
};
</script>