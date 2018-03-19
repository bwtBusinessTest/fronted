import Vue from 'vue';
import store from '../../store';
import router from '../../router'

const LoginModalConstructor = Vue.extend({
	template: `
		<div id="loginModal" v-if="visible">
			<div style="width:500px;left:50%;;top:15%;margin:0px 0 0 -250px;position:fixed;background:#fff;z-index:10002;border-radius:5px;">
				<el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px"
			      class="card-box login-form" style="width:300px;margin:0 auto;">
			      <h3 class="title" style="text-align:center;margin:0px -100px 20px -100px;background:#F5F5DC;line-height:50px;border-radius:5px 5px 0 0;">八维通商业平台后台管理系统</h3>
			      <el-form-item prop="username">
			        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="username" style="padding-left:20px;">
						<template slot="prepend"><icon-svg icon-class="yonghuming" /></template>
			        </el-input>
			      </el-form-item>
			      <el-form-item prop="password">
			        <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
			          placeholder="password" style="padding-left:20px;">
						<template slot="prepend"><icon-svg icon-class="mima" /></template>
			          </el-input>
			      </el-form-item>
			      <el-form-item>
			        <el-button type="primary" style="width:280px;margin-left:20px;" :loading="loading" @click.native.prevent="handleLogin">
			          登录
			        </el-button>
			      </el-form-item>
			    </el-form>
			</div>
			<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:#000;opacity:0.4;z-index:10001;"></div>
		</div>`,
	data() {
		const validateUsername = (rule, value, callback) => {
	      if (value.length === 0) {
	      	callback('请输入用户名');
	      } else {
	      	callback();
	      }
	    }
	    const validatePass = (rule, value, callback) => {
	      if (value.length === 0) {
	        callback(new Error('请输入密码'))
	      } else {
	        callback()
	      }
	    }
		return {
			loginForm: {
		    	username: '',
		        password: ''
		    },
		    loginRules: {
		        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
		        password: [{ required: true, trigger: 'blur', validator: validatePass }]
		    },
			visible: false,
			loading: false
		}
	},
	methods: {
		handleLogin() {
			this.$refs.loginForm.validate(valid => {
				if (valid) {
					this.loading = true;
					store.dispatch('Login', this.loginForm).then(() => {
						this.loading = false;
						this.visible = false;
						location.reload();
					}).catch(() => {
						this.loading = false;
					});
				}
			})
		}
	},
	watch: {
		visible() {
			const host = process.env.NODE_ENV === 'development' ? 'http://localhost:9528/#/login' : '';
			if (window.location.href === host) {
				this.visible = false;
			}
		}
	}
});

let instance;

const LoginModal = function(options) {
	options = options || {};
	instance = new LoginModalConstructor();
	instance.vm = instance.$mount();
	document.body.appendChild(instance.vm.$el);
	instance.vm.visible = true;
	instance.dom = instance.vm.$el;
}

export default LoginModal;