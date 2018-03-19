<template>
    <input type="number" :style="{width:width}" v-model.number="num" @input="updateValue" @blur="handleBlur"></input>
</template>

<script>
export default {
    props: {
        value: {
            type: Number,
            default: undefined
        },
        min: {
            type: Number,
            default: 1
        },
        max: {
            type: Number,
            default: 10
        },
        width: {
            type: String
        }
    },
    data() {
        return {
            num: undefined
        }
    },
    created() {
        this.num = this.min >= this.value <= this.max ? this.value : this.value < this.min ? this.min : this.max;
    },
    methods: {
        updateValue() {
            if (this.num !== '') {
                if (this.num > this.max) {
                    this.$emit('input', this.max);
                } else if (this.num < this.min) {
                    this.$emit('input', this.min);
                } else {
                    this.$emit('input', this.num);
                }
            } else {
                this.$emit('input', undefined);
            }
        },
        handleBlur() {
            this.$emit('handleBlur');
        }
    },
    watch: {
        value(newValue) {
            if (newValue) {
                if (newValue > this.max) {
                    this.num = this.max;
                } else if (newValue < this.min) {
                    this.num = this.min;
                } else {
                    this.num = newValue;
                }
            } else {
                this.num = undefined;
            }
        },
        num(newValue) {
            if (newValue > this.max) {
                this.num = this.max;
            }
            if (newValue < this.min) {
                this.num = this.min;
            }
        }
    }
}
</script>