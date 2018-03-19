import { 
	operLogQueryApi,
	getBusinFlagListApi,
	getMenuListApi
} from '../../api/operLog';
import butVisibleMixin from '../../utils/buttonVisible';

export default {
  mixins: [butVisibleMixin],
  data() {
    return {
      pageId: '21002',
      form: {
        createUser: '',
        menuCode: '',
        businFlag: '',
        searchFirstTime: '',
        searchLastTime: '',
        operContent: '',
        ipAddress: '',
        menuCode: '',
        businFlag: ''
      },
      tableData: [],
      totalRows: 0 ,
      currentPage: 1,
      options: [],
      businFlagOptions: [],
      pageSize: 10,
      loading: true,
      noTableData: ' '
    }
  },
  created(){
  	this.getMenuList();
  	this.getBusinFlagList(null);
    this.queryOperLog();
  },
  methods: {
  	getMenuList(){
  		const params = null;
  		getMenuListApi({params}).then(res => {
			if (res.errcode === '0000') {
	      		this.options = res.result.filter((item) => {
	      			return item;
	      		});
	      	}
      	});
  	},
  	getBusinFlagList(val){
  		const params = { menuCode: val || null };
		  getBusinFlagListApi({params}).then(res => {
			if (res.errcode === '0000') {
	      		this.businFlagOptions = res.result.filter((item) => {
	      			return item;
	      		});
	      	}
      	});
   	},
   	menuChange(){
   	 	const menuCode = this.form.menuCode;
   		this.getBusinFlagList(menuCode);
   	},
    clearQueryParams() {
      for (let key in this.form) {
        this.form[key] = ''
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryOperLog(val);
    },
    queryOperLogList() {
        this.queryOperLog();
    },
    queryOperLog(pageNo) {
      const currentPage = pageNo || 1;
      const params = { pageNo: currentPage, pageSize: this.pageSize, createUser: this.form.createUser || null, menuCode: this.form.menuCode || null, businFlag: this.form.businFlag || null ,searchFirstTime: this.form.searchFirstTime || null ,searchLastTime: this.form.searchLastTime || null ,operContent: this.form.operContent || null ,ipAddress: this.form.ipAddress || null}
      operLogQueryApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.tableData = res.result.rows.filter((item) => {
            return item;
          });
          this.loading = false;
          this.totalRows = res.result.totalCount;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryOperLog(this.currentPage);
    }
  }
}