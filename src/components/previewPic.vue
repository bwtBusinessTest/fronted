<template>
    <div class="preview-pic">
        <el-dialog
          title="图片预览"
          width="65%"
          :visible.sync="visible"
          @close="$emit('update:show', false)"
          @open="openNewAddModal">
          <img :src="imgUrl" style="max-width:100%;display:block;margin:auto;">
          <span slot="footer" class="dialog-footer">
          </span>
        </el-dialog>
    </div>
</template>

<script>
import publicMethod from '@/utils/publicMethod';

export default {
    name: 'previewPic',
    props: {
        show: {
            type: Boolean,
            default: false
        },
        imgUrl: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            visible: this.show
        }
    },
    watch: {
        show() {
            this.visible = this.show;
        }
    },
    mixins: [publicMethod]
}
</script>

<style lang="scss" scoped>
    
</style>
