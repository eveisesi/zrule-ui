<template>
    <div v-if="isEditing">
        <b-row>
            <b-col sm="10">
                <b-form-input
                    v-model="edittedName"
                    class="mt-2"
                    :value="name"
                />
            </b-col>
            <b-col>
                <b-button
                    class="float-right mt-2"
                    variant="primary"
                    @click="updateName"
                >
                    <font-awesome-icon icon="check" />
                </b-button>
            </b-col>
        </b-row>
    </div>
    <div v-else>
        <h3>
            {{ name }}
            <b-button
                class="float-right mt-2"
                variant="primary"
                @click="isEditing = true"
            >
                <font-awesome-icon icon="pencil-alt" />
            </b-button>
        </h3>
    </div>
</template>

<script>
export default {
    name: "PolicyName",
    props: {
        name: String,
    },
    data() {
        return {
            isEditing: false,
            edittedName: this.name,
        };
    },
    methods: {
        updateName() {
            this.$emit("updateName", this.edittedName);
            this.isEditing = false;
        },
    },
};
</script>

<style>
</style>