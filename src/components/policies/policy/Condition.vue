<template>
    <div>
        <b-row v-if="alert.show">
            <b-col lg="10">
                <b-alert
                    :show="alert.show"
                    :variant="alert.variant"
                    @dismissed="resetAlert"
                    >{{ alert.message }}</b-alert
                >
            </b-col>
        </b-row>

        <b-row>
            <b-col lg="4">
                <div v-if="isEditing">
                    <label for="DrpdwnRulePath">Rule Path:</label>
                    <b-form-select
                        id="DrpdwnRulePath"
                        v-model="path"
                        :options="getPaths()"
                        text-field="display"
                        value-field="path"
                        @change="searchQuery = ''"
                    />
                </div>
                <div v-else>
                    {{ displayRule }}
                </div>
            </b-col>
            <b-col lg="2">
                <div v-if="isEditing">
                    <label for="DrpdwnRuleComparator">Rule Comparator:</label>
                    <b-form-select
                        id="DropdwnRuleComparator"
                        v-model="comparator"
                        :options="ruleComparators"
                    />
                </div>
                <div v-else>
                    {{ condition.comparator.toUpperCase() }}
                </div>
            </b-col>
            <b-col lg="4">
                <div v-if="isEditing">
                    <label for="DrpdwnRuleComparator">Rule Value:</label>
                    <vue-typeahead-bootstrap
                        :data="searchResults"
                        v-model="searchQuery"
                        :serializer="(s) => s.name"
                        placeholder="Start typing to search for an entity"
                        @hit="handleSelection"
                    />
                    <b-form-checkbox v-model="searchStrict"
                        >Use Strict Mode For Search</b-form-checkbox
                    >
                </div>
                <div v-else>
                    {{ displayValue }}
                </div>
            </b-col>
            <b-col>
                <div class="mx-auto my-auto" v-if="isEditing">
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
                <div class="mx-auto my-auto" v-else>
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
        <b-row>
            <b-col>
                <hr style="background-color: white" class="m-2" />
            </b-col>
        </b-row>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { API_URL } from "@/const";
import _ from "underscore";

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
    },
    data() {
        return {
            alert: {
                message: "",
                variant: "",
                show: false,
            },
            isEditing: this.condition.editing,
            path: "",
            comparator: "",
            values: [],
            entities: [],
            isNew:
                this.condition.isNew != undefined
                    ? this.condition.isNew
                    : false,
            searchResults: [],
            searchQuery: "",
            searchStrict: false,
        };
    },
    computed: {
        displayValue() {
            console.log("Condition displayValue", this.condition.entities);
            return (
                this.condition.entities[0].name +
                " (" +
                this.condition.entities[0].id +
                ")"
            );
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
    },
    methods: {
        ...mapGetters(["getPaths"]),
        showAlert(message = "", variant = "success", show = 5) {
            this.alert = Object.assign({}, this.alert, {
                message,
                variant,
                show,
            });
        },
        resetAlert() {
            this.alert = Object.assign({}, this.alert, {
                message: "",
                variant: "",
                show: false,
            });
        },
        handleSelection(e) {
            this.$set(this.values, 0, e.id.valueOf());
            this.$set(this.entities, 0, e);
            console.log("handleSelection", this.values, this.entities);
        },
        editCondition() {
            this.path = this.condition.path.valueOf();
            this.comparator = this.condition.comparator.valueOf();
            this.values = this.condition.values.valueOf();
            this.entities = this.condition.entities.valueOf();
            this.searchQuery = this.condition.entities[0].name;
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
        validateCondition() {
            const paths = this.getPaths();
            const pathSpec = paths.find((e) => e.path === this.path);
            if (!pathSpec) {
                this.showAlert(
                    "failed to validate condition. Please try again",
                    "warning",
                    5
                );
                // alert that we are unable to validate the rule
                return;
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

            console.log("updateCondition", condition);

            this.$emit("updateCondition", condition);
            this.isEditing = false;
            this.searchQuery = "";
            this.searchStrict = false;
        },
        async searchEntity(query) {
            if (query.length == 0) {
                return;
            }
            await this.$http
                .get(API_URL + "/search", {
                    params: {
                        category: this.pathCategory(),
                        term: query,
                        strict: this.searchStrict,
                    },
                })
                .then((res) => {
                    this.searchResults = res.data;
                })
                .catch((err) => {
                    console.error(err);
                });
        },
    },
    watch: {
        searchQuery: _.debounce(function (newVal) {
            this.searchEntity(newVal);
        }, 2000),
    },
};
</script>

<style>
</style>
