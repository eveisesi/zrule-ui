<template>
    <b-row>
        <b-col>
            <b-card bg-variant="light" header="Light">
                <template #header> <h5>Summary</h5> </template>
                <b-row v-if="renderRules.length == 0">
                    This policy has no conditions, once a condition has been
                    created, this section will convert you policy into plain
                    english
                </b-row>
                <b-row v-else>
                    <b-col>
                        <ul>
                            <li
                                v-for="(line, index) in renderRules"
                                :key="index"
                            >
                                {{ line }}
                            </li>
                        </ul>
                    </b-col>
                </b-row>
            </b-card>
        </b-col>
    </b-row>
</template>

<script>
import { mapGetters } from "vuex";
import numeral from "numeral";

export default {
    name: "Summary",
    props: {
        rules: {
            type: Array,
            required: true,
        },
    },
    computed: {
        renderRules() {
            return this.rules.map((e, index) => {
                return e
                    .map((j, index2) => {
                        const path = this.getPaths().find(
                            (k) => k.path === j.path
                        );
                        if (!path) {
                            return "unable to summarize condition";
                        }

                        if (path.format === "string") {
                            return (
                                path.display +
                                " " +
                                j.comparator.toUpperCase() +
                                " " +
                                j.entities.map((a) => a.name).join(", ")
                            );
                        } else if (path.format === "number") {
                            return (
                                path.display +
                                " " +
                                j.comparator.toUpperCase() +
                                " " +
                                j.values.map((e) => this.humanize(e)).join(", ")
                            );
                        } else {
                            return (
                                path.display +
                                " " +
                                j.comparator.toUpperCase() +
                                " " +
                                j.values.map((e) => e).join(", ")
                            );
                        }
                    })
                    .join(" AND ");
            });
        },
    },
    methods: {
        ...mapGetters(["getPaths"]),
        humanize(total) {
            return numeral(total).format("0,0.00");
        },
    },
};
</script>

<style>
</style>