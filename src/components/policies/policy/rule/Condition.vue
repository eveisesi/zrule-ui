<template>
    <div>
        <b-row v-if="isEditing">
            <b-col lg="4">
                <label for="DrpdwnRulePath">Rule Path:</label>
                <b-form-select
                    id="DrpdwnRulePath"
                    v-model="path"
                    :options="getPaths()"
                    text-field="display"
                    value-field="path"
                    @change="searchQuery = ''"
                />
            </b-col>
            <b-col lg="2">
                <label for="RuleComparator">Rule Comparator:</label>
                <strong v-if="!ruleComparators.length"
                    >Please Select A Path</strong
                >
                <div v-else>
                    <b-form-select
                        id="RuleComparator"
                        v-model="comparator"
                        :options="ruleComparators"
                    />
                </div>
            </b-col>
            <b-col lg="4">
                <label for="RuleValue">Rule Value:</label>
                <div v-if="pathFormat === 'string'">
                    <vue-typeahead-bootstrap
                        :data="searchResults"
                        v-model="searchQuery"
                        :serializer="(s) => s.name"
                        placeholder="Start typing to search for an entity"
                        @hit="handleSearchSelection"
                    />
                </div>
                <div v-else-if="pathFormat === 'boolean'">
                    <b-form-select
                        v-model="selectedBool"
                        :options="[true, false]"
                        @change="handleBooleanSelection"
                    />
                </div>
                <div v-else-if="pathFormat === 'number'">
                    <b-form-input
                        v-model="inputedNumber"
                        type="number"
                        @change="handleNumberSelection"
                    />
                </div>
                <div v-else>
                    <strong v-if="!path">Please Select A Path</strong>
                </div>
            </b-col>
            <b-col>
                <div class="mx-auto my-auto">
                    <b-button variant="success" @click="validateCondition">
                        <font-awesome-icon icon="check" />
                    </b-button>
                    <b-button
                        class="ml-2"
                        variant="secondary"
                        @click="
                            isNew
                                ? handleRemoveCondition()
                                : (isEditing = false)
                        "
                    >
                        <font-awesome-icon icon="undo-alt" />
                    </b-button>
                </div>
            </b-col>
        </b-row>
        <b-row v-else>
            <b-col lg="4">
                <div class="ml-4">{{ displayRule }}</div>
            </b-col>
            <b-col lg="2">
                {{ condition.comparator.toUpperCase() }}
            </b-col>
            <b-col lg="4">
                {{ displayValue }}
            </b-col>
            <b-col>
                <div class="mx-auto my-auto">
                    <b-button variant="primary" @click="editCondition">
                        <font-awesome-icon icon="pencil-alt" />
                    </b-button>
                    <b-button
                        class="ml-2"
                        variant="danger"
                        @click="handleRemoveCondition"
                    >
                        <font-awesome-icon icon="trash" />
                    </b-button>
                </div>
            </b-col>
        </b-row>
        <b-row v-if="showLine">
            <b-col>
                <hr style="background-color: white" class="m-2" />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { API_URL, ESI_URL } from "@/const";
import { CancelToken, isCancel } from "axios";
import numeral from "numeral";
import _ from "underscore";
import { mapActions } from "vuex";

export default {
    name: "Condition",
    props: {
        condition: {
            type: Object,
            required: true,
        },
        index: {
            type: Number,
            required: true,
        },
        ruleIndex: {
            type: Number,
            required: true,
        },
        showLine: {
            type: Boolean,
            required: true,
        },
    },
    data() {
        return {
            isEditing: this.condition.editing,
            path: "",
            format: "",
            comparator: "",
            values: [],
            entities: [],
            isNew:
                this.condition.isNew != undefined
                    ? this.condition.isNew
                    : false,
            searchResults: [],
            searchQuery: "",
            selectedBool: null,
            searchCancelToken: null,
            inputtedNumber: null,
        };
    },
    computed: {
        displayValue() {
            const paths = this.getPaths();
            const path = paths.find((e) => e.path === this.condition.path);
            if (!path) {
                return "unknown path";
            }
            console.log("Condition displayValue", this.condition);

            switch (path.format) {
                case "string":
                    return (
                        this.condition.entities[0].name +
                        " (" +
                        this.condition.entities[0].id +
                        ")"
                    );
                case "boolean":
                    return (
                        this.condition.values[0]
                            .toString()
                            .charAt(0)
                            .toUpperCase() +
                        this.condition.values[0].toString().slice(1)
                    );
                case "number":
                    return this.humanize(this.condition.values[0]) + " ISK";
            }
        },
        displayRule() {
            const paths = this.getPaths();
            const path = paths.find((e) => e.path === this.condition.path);
            if (!path) {
                return "unknown path";
            }

            return path.display;
        },
        ruleComparators() {
            const paths = this.getPaths();
            const path = paths.find((e) => e.path === this.path);
            if (!path) {
                return [];
            }

            return path.comparators;
        },
        pathFormat() {
            const paths = this.getPaths();
            const path = paths.find((e) => e.path === this.path);
            if (!path) {
                return "unknown";
            }
            return path.format;
        },
    },
    methods: {
        humanize(total) {
            return numeral(total).format("0,0");
        },
        ...mapGetters(["getPaths"]),
        ...mapActions(["storeAlertProps"]),
        handleSearchSelection(e) {
            this.$set(this.values, 0, e.id.valueOf());
            this.$set(this.entities, 0, e);
        },
        handleBooleanSelection(e) {
            this.$set(this.values, 0, e);
            this.$set(this.entities, 0, {});
        },
        handleNumberSelection(e) {
            this.$set(this.values, 0, parseInt(e));
            this.$set(this.entities, 0, {});
        },
        editCondition() {
            this.path = this.condition.path.valueOf();
            const path = this.getPaths().find((e) => e.path === this.path);
            this.comparator = this.condition.comparator.valueOf();
            this.values = this.condition.values.valueOf();
            switch (path.format) {
                case "string":
                    this.entities = this.condition.entities.valueOf();
                    this.searchQuery = this.condition.entities[0].name;
                case "number":
                    this.inputedNumber = this.values[0];
                case "boolean":
                    this.selectedBool = this.values[0];
            }
            if (this.condition.entities) {
            }
            this.isEditing = true;
        },
        handleRemoveCondition() {
            this.$emit("removeCondition", {
                ruleIndex: this.ruleIndex,
                conditionIndex: this.index,
            });
        },
        pathCategory() {
            const paths = this.getPaths();
            const path = paths.find((e) => e.path === this.path);
            if (!path) {
                return "unknown";
            }

            return path.category;
        },

        async validateCondition() {
            if (this.searchCancelToken) {
                this.searchCancelToken.cancel();
            }
            const paths = this.getPaths();
            const pathSpec = paths.find((e) => e.path === this.path);
            if (!pathSpec) {
                // alert that we are unable to validate the rule
                return;
            }

            if (
                ["alliance", "corporation", "character"].includes(
                    pathSpec.category
                )
            ) {
                if (this.values.length < 1) {
                    return;
                }

                const value = this.values[0];

                await this.$http
                    .post(
                        API_URL + "/search/" + pathSpec.category + "/" + value
                    )
                    .then((res) => {
                        console.log(res);
                    })
                    .catch((e) => {
                        if (e.response.code > 500) {
                            this.storeAlertProps({
                                message:
                                    "Issue talking to backend API. please try again",
                                show: 5,
                            });
                        } else {
                            this.storeAlertProps({
                                message: e.response.data.message,
                                show: 5,
                            });
                        }
                    });
            }

            const condition = {
                ruleIndex: this.ruleIndex,
                conditionIndex: this.index,
                condition: {
                    path: this.path.valueOf(),
                    comparator: this.comparator.valueOf(),
                    values: this.values.valueOf(),
                    entities: this.entities.valueOf(),
                },
            };

            this.$emit("updateCondition", condition);
            this.isEditing = false;
            this.searchQuery = "";
        },
        async searchESI(category, query) {
            if (this.searchCancelToken) {
                this.searchCancelToken.cancel(
                    "canceling request since a new request needs to be executed"
                );
                this.cancelToken = null;
            }

            const source = CancelToken.source();
            this.searchCancelToken = source;

            let ids = [];

            await this.$http
                .get(ESI_URL + "/v2/search", {
                    params: {
                        categories: category,
                        search: query,
                    },
                })
                .then((res) => {
                    ids = res.data[category];
                });

            await this.$http
                .post(ESI_URL + "/v3/universe/names", ids)
                .then((res) => {
                    this.searchResults = res.data;
                })
                .catch((e) => {
                    if (isCancel(e)) {
                        console.log("Request Cancalled", e.message);
                    } else {
                        console.error(e);
                    }
                });
        },
        async searchAPI(key, query) {
            if (this.searchCancelToken) {
                this.searchCancelToken.cancel(
                    "canceling request since a new request needs to be executed"
                );
                this.cancelToken = null;
            }

            const source = CancelToken.source();
            this.searchCancelToken = source;

            this.$http
                .get(API_URL + "/search", {
                    params: {
                        key,
                        term: query,
                    },
                    cancelToken: source.Token,
                })
                .then((res) => {
                    this.searchResults = res.data;
                })
                .catch((e) => {
                    if (isCancel(e)) {
                        console.log("Request Cancalled", e.message);
                    } else {
                        console.error(e);
                    }
                });
        },
        async searchEntity(query) {
            console.log("Query", query, query.length);
            if (query.length == 0) {
                return;
            }

            const selectedPath = this.getPaths().find(
                (e) => e.path === this.path
            );
            switch (selectedPath.searchEndpoint) {
                case "api":
                    await this.searchAPI(selectedPath.category, query);
                    break;
                case "esi":
                    await this.searchESI(selectedPath.category, query);
                    // console.log(selectedPath.searchEndpoint, selectedPath);

                    break;
                default:
                    console.log("unknown", selectedPath);
            }
            return;
            // await this.$http
            //     .get(ESI_URL + "/v2/search/", {
            //         params: {
            //             categories:
            //                 "alliance,character,constellation,corporation,faction,inventory_type,region,solar_system",
            //             search: query.valueOf(),
            //         },
            //     })
            //     .then((res) => {
            //         console.log(res);
            //     });

            // await this.$http
            //     .get(API_URL + "/search", {
            //         params: {
            //             category: this.pathCategory(),
            //             term: query,
            //             strict: this.searchStrict,
            //         },
            //     })
            //     .then((res) => {
            //         this.searchResults = res.data;
            //     })
            //     .catch((err) => {
            //         console.error(err);
            //     });
        },
    },
    watch: {
        searchQuery: _.debounce(function (newVal) {
            this.searchEntity(newVal);
        }, 750),
    },
    created() {
        console.log(this.getPaths());
    },
};
</script>

<style>
</style>
