import { loginLogQueryApi} from '../../api/userLoginLog';
import butVisibleMixin from '../../utils/buttonVisible';
import { getSelectList } from '../../api/userManage';
const LOGINTYPE = ['', '登录', '退出'];

export default {
  mixins: [butVisibleMixin],
  data() {
    return {
      pageId: '21001',
      form: {
        createUser: '',
        loginType: '',
        ipAddress: '',
        searchFirstTime: '',
        searchLastTime: ''
      },
      tableData: [],
      loginTypeList: [],
      totalRows: 0 ,
      currentPage: 1,
      pageSize: 10,
      loading: true,
      noTableData: ' '
    }
  },
  created(){
    this.queryLoginLog();
    this.getLoginTypeList();
  },
  methods: {
    getLoginTypeList(){
      getSelectList({ params: { code: '1022' } }).then(res => {
        if (res.errcode === '0000') {
          this.loginTypeList = res.result;
        }
      });
    },
    clearQueryParams() {
      for (let key in this.form) {
        this.form[key] = ''
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.queryLoginLog(val);
    },
    queryLoginLogList() {
        this.queryLoginLog();
    },
    queryLoginLog(pageNo) {
      const currentPage = pageNo || 1;
      const params = { pageNo: currentPage, pageSize: this.pageSize, createUser: this.form.createUser || null, loginType: this.form.loginType || null, ipAddress: this.form.ipAddress || null ,searchFirstTime: this.form.searchFirstTime || null ,searchLastTime: this.form.searchLastTime || null}
      loginLogQueryApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.tableData = res.result.rows.filter((item) => {
            item.loginType = LOGINTYPE[item.loginType];
            return item;
          });
          this.loading = false;
          this.totalRows = res.result.totalCount;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryLoginLog(this.currentPage);
    }
  }
}







