<template>
	<div class="modify-password">
		<h3 class="user-name">{{`用户${name} 请设置新密码`}} </h3>
		<el-form :model="password" :rules="modifyRules" ref="modifyPassword">
			<el-form-item label="旧密码" prop="oldPassword">
				<el-input type="password" v-model="password.oldPassword"></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input type="password" v-model="password.newPassword"></el-input>
				<div class="strong-container">
					<password-strong-validate :password="password.newPassword"></password-strong-validate>
				</div>
			</el-form-item>
			<el-form-item label="确认密码" prop="confirmNewPassword">
				<el-input type="password" v-model="password.confirmNewPassword"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click.native.prevent="submit('modifyPassword')">确定</el-button>
			</el-form-item>
		</el-form>
		<p v-if="timeShow">{{this.time}}秒后<span @click="enterSystem">进入系统</span></p>
	</div>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
import { modifyPassword } from '../../api/login';
import passwordStrongValidate from '../../components/passwordStrongValidate/index';
import getmd5 from '../../utils/encrypt';

export default {
	data() {
		const validatePass = (rule, value, callback) => {
	        if (value === '') {
	        	callback(new Error('请输入密码'));
	        } else {
	        	callback();
	        }
	    };
	    const validatePass2 = (rule, value, callback) => {
	        if (value === '') {
	            callback(new Error('请再次输入密码'));
	        } else if (value !== this.password.newPassword) {
	            callback(new Error('两次输入密码不一致!'));
	        } else {
	            callback();
	        }
	    };
		return {
			password: {
				oldPassword: '',
				newPassword: '',
				confirmNewPassword: ''
			},
			modifyRules: {
				oldPassword: [{ required: true, validator: validatePass, trigger: 'blur' }],
				newPassword: [{ required: true, trigger: 'blur' }],
				confirmNewPassword: [{ required: true, validator: validatePass2, trigger: 'blur' }]
			},
			time: 10,
			timeShow: false
		}
	},
	computed: {
		...mapState({
			uid: state => state.user.userInfo.id
		}),
		...mapGetters([
			'name'
		])
	},
	methods: {
		submit(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					const params = { id: this.uid, oldPwd: getmd5(this.password.oldPassword), newPwd: getmd5(this.password.newPassword) };
					modifyPassword({ params }).then(res => {
						if (res.errcode === '0000') {
							this.timer = setInterval(() => {
								this.time -= 1;
							}, 1000);
							this.timeShow = true;
							this.$notify({
								title: '成功',
								message: '修改密码成功',
								type: 'success',
								duration: 3000
							})
						}
					});
				} else {
					console.log('error');
					return false;
				}
			});
		},
		enterSystem() {
			clearTimeout(this.timer);
			this.$router.push({ path: '/' });
		}
	},
	watch: {
		time(newValue, oldValue) {
			if (newValue <= 0) {
				clearTimeout(this.timer);
				this.$router.push({ path: '/' });
			}
		}
	},
	components: {
		passwordStrongValidate
	}
}
</script>

<style lang="scss" scoped>
	.modify-password{
		margin-top: 60px;
		.user-name{
			text-align: center;
		}
		.el-form{
			width: 300px;
			margin: auto;
			.el-button{
				width: 100%;
			}
		}
		p{
			text-align: center;
			span{
				color: #178ce6;
				cursor: pointer;
			}
		}
		.strong-container{
			margin-top: 6px;
			text-align: center;
		}
	}
</style>