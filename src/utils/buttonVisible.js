import { mapGetters } from 'vuex';

const mixin = {
	computed: {
		...mapGetters([
			'buttonAuth'
		]),
		buttonVisible() {
	      var res = {};
	      this.buttonAuth.forEach(ele => {
	        if (ele.menuParentCode === this.pageId) {
	          res[ele.menuCode] = true;
	        }
	      });
	      return res;
	    }
	},
	mounted() {
		$('.el-dialog').draggable();
	}
}

export default mixin;