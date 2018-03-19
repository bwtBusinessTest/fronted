<template>
	<div>
		<script :id=id type="text/plain" ></script>
		<code id="tescon" style="display:none;" ref="tes">
        	{{defaultMsg}}
    	</code>
	</div>
</template>

<script>
	export default {
		name: 'UE',
		data() {
			return {
				editor: null
			}
		},
		props: {
			defaultMsg: {
				type: String
			},
			config: {
				type: Object
			},
			id: {
				type: String
			}
		},
		mounted() {
			const _this = this;
			this.editor = UE.getEditor(this.id, this.config);
			this.editor.addListener("ready", function () {
        		_this.editor.setContent(_this.defaultMsg);
        		// _this.editor.execCommand('insertHtml', $('#tescon').html());
        		if (_this.id === 'ue2'||_this.id === 'ue4'||_this.id === 'ue5') {
        			_this.editor.setDisabled('fullscreen');
        		}
      		});
		},
		methods: {
			getUEContent() {
        		return this.editor.getContentTxt();
      		}
		},
		watch: {
			defaultMsg(newValue) {
				this.editor.setContent(newValue);
				// this.$nextTick(() => {
				// 	setTimeout(() => {
				// 		console.log(this.$refs.tes.innerHTML());
				// 		this.editor.execCommand('insertHtml', $('#tescon').html());
				// 	}, 500);
					
				// });
			}
		},
		destroyed() {
			this.editor.destroy();
		}
	}
</script>