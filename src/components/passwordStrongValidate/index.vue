<template>
	<div class="password-strong-validate" v-if="password">
		<span :class="{select: strongValue === 0}">{{strongFont[0]}}</span><span :class="{select: strongValue === 2}">{{strongFont[1]}}</span><span :class="{select: strongValue === 3}">{{strongFont[2]}}</span><span :class="{select: strongValue === 4}">{{strongFont[3]}}</span>
	</div>
</template>

<script>
export default {
	name: 'passwordStrongValidate',
	props: {
		password: {
			type: String,
			default: undefined
		}
	},
	data() {
		return {
			strongFont: ['', '', '', '']
		}
	},
	computed: {
		strongValue() {
			var modes = 0;
			if (this.password.length === 0) {
				this.strongFont = ['','','',''];
				return -1;
			}
            if (this.password.length < 6 && this.password.length > 0) {
            	this.strongFont = ['弱','','',''];
            	return 0;
            }
            if (/\d/.test(this.password)) {
            	modes++;
            	this.strongFont = ['弱','','',''];
            }
            if (/[a-z]/.test(this.password)) {
            	modes++;
            	this.strongFont = ['','中','',''];
            }
            if (/[A-Z]/.test(this.password)) {
            	modes++;
            	this.strongFont = ['','','强',''];
            }
            if (/\W/.test(this.password)) {
            	modes++;
            	this.strongFont = ['','','','超强'];
            }
            if (this.password.length > 12) {
            	this.strongFont = ['','','','超强'];
            	return 4;
            }
            return modes;
		}
	}
}
</script>

<style lang="scss" scoped>
	.password-strong-validate{
		width: 208px;
		display: flex;
		span{
			width: 50px;
			height: 20px;
			line-height: 20px;
			color: #fff;
			font-size: 12px;
			background: green;
			margin-right: 2px;
			text-align: center;
			&.select{
				background: red;
			}
		}
	}
</style>