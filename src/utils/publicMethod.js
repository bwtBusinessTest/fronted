import { mapState, mapMutations } from 'vuex';
const publicMethod = {
    data(){
        return {
            //滚动条高度
            scrollHeight:0,
            queryContainerShrink: false,
        }
    },
    computed: {
        ...mapState({
          isCollapse: state => state.app.sidebar.opened
        })
    },
    methods:{
        //遮罩问题
        openNewAddModal() {
            var self = this;
            setTimeout(function(){
                if (!self.isCollapse) {
                    self.$nextTick(() => {
                        document.querySelector('.v-modal').style.left = '36px';
                    }); 
                    if(document.querySelector('.v-modal')){
                        document.querySelector('.v-modal').style.left = '36px';
                        $('.el-dialog__wrapper').css('left','36px');
                    } 
                }else{
                    if(document.querySelector('.v-modal')){
                        document.querySelector('.v-modal').style.left = '200px';
                        $('.el-dialog__wrapper').css('left','200px');
                    }
                }
                if (document.querySelector('.v-modal')) {
                    self.scrollHeight = $(document).scrollTop();
                    if(self.scrollHeight>=0&&self.scrollHeight<50){
                      document.querySelector('.v-modal').style.top = (50-self.scrollHeight)+'px';
                      $('.el-dialog__wrapper').css('top',(50-self.scrollHeight)+'px');
                    }else{
                      document.querySelector('.v-modal').style.top = '0px';
                      $('.el-dialog__wrapper').css('top','0px');
                    }
                }
            },100)
        },
        shrinkQueryArea(boxHeight) {
            if (this.queryContainerShrink) {
                this.$refs.queryContainer.style.height = boxHeight+'px';
                this.queryContainerShrink = false;
            } else {
                this.$refs.queryContainer.style.height = '60px';
                this.queryContainerShrink = true;
            }
        },
    },
    watch:{
        //遮罩问题
        isCollapse(newValue) {
          if (document.querySelector('.v-modal')) {
              if (newValue) {
                  document.querySelector('.v-modal').style.left = '200px';
                  $('.el-dialog__wrapper').css('left','200px');
              } else {
                  document.querySelector('.v-modal').style.left = '36px';
                  $('.el-dialog__wrapper').css('left','36px');
              }
          }
        },
    },
}
export default publicMethod;