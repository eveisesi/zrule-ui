<template>
    <b-table-simple hover responsive>
        <th>Policy Name</th>
        <th># Rules</th>
        <th># Actions</th>
        <tr v-for="policy in policies" :key="policy._id">
            <td>
                <router-link :to="'policies/' + policy._id">{{
                    policy.name
                }}</router-link>
            </td>
            <td>{{ policy.rules.length }}</td>
            <td>{{ policy.actions.length }}</td>
        </tr>
    </b-table-simple>
</template>

<script>
export default {
    name: "Summary",
    props: {
        policies: Array,
    },
    data() {
        return {
            user: {},
        };
    },
};
</script>

<style>
</style>