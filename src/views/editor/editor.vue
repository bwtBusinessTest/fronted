<template>
	<div class="ueditor">
		<el-button @click="getUEContent">test</el-button>
		<UE :defaultMsg=defaultMsg :config=config :id=ue1 ref="ue"></UE>
        <el-button @click="dialogNewAddVisible = true">test</el-button>
        <el-dialog title="新增团购订单" :visible.sync="dialogNewAddVisible" :close-on-click-modal="false">
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogNewAddVisible = false">确 定</el-button>
                <el-button @click="dialogNewAddVisible = false">取 消</el-button>
            </div>
        </el-dialog>
	</div>
</template>

<script>
	import UE from '../../components/ue/ue'
	export default {
		data() {
			return {
				defaultMsg: '这里是UE测试',
				config: {
					initialFrameWidth: null,
					initialFrameHeight: 350
				},
				ue1: "ue1",
                dialogNewAddVisible: false
			}
		},
		methods: {
			getUEContent() {
        		let content = this.$refs.ue.getUEContent(); // 调用子组件方法
        		this.$notify({
          			title: '获取成功，可在控制台查看！',
          			message: content,
          			type: 'success'
        		});
        		console.log(content)
      		}
		},
		components: {UE}
	}
</script>

<style>
	
</style>