<template>
    <div>
        <Navbar />
        <AuthContainer />
    </div>
</template>

<script>
import AuthContainer from "@/components/AuthContainer";
import Navbar from "@/components/Navbar";

export default {
    name: "Login",
    components: {
        AuthContainer,
        Navbar,
    },
};
</script>