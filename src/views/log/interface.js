import { apiLogQueryApi} from '../../api/interfaceLog';
import butVisibleMixin from '../../utils/buttonVisible';
import { getSelectList } from '../../api/userManage';
const INTERFACESTATUS = ['失败', '成功'];

export default {
  mixins: [butVisibleMixin],
  data() {
    return {
      pageId: '21003',
      form: {
        appId: '',
        sequence: '',
        remoteIp: '',
        name: '',
        status: ''
      },
      tableData: [],
      statusList: [],
      totalRows: 0 ,
      currentPage: 1,
      pageSize: 10,
      loading: true,
      noTableData: ' '
    }
  },
  created(){
    this.queryApiLog();
    this.getStatusList();
  },
  methods: {
    getStatusList(){
      getSelectList({ params: { code: '1003' } }).then(res => {
        if (res.errcode === '0000') {
          this.statusList = res.result;
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
      this.queryApiLog(val);
    },
    queryApiLogList() {
        this.queryApiLog();
    },
    queryApiLog(pageNo) {
      const currentPage = pageNo || 1;
      const params = { pageNo: currentPage, pageSize: this.pageSize, appId: this.form.appId || null, sequence: this.form.sequence || null, remoteIp: this.form.remoteIp || null ,name: this.form.name || null ,status: this.form.status || null}
      apiLogQueryApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.tableData = res.result.rows.filter((item) => {
            item.status = INTERFACESTATUS[item.status];
            return item;
          });
          this.loading = false;
          this.totalRows = res.result.totalCount;
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.queryApiLog(this.currentPage);
    },
    copyCellContent(row, column, cell, event) {
      const _this = this;
      this.$copyText(cell.querySelector('div').innerHTML).then(function (e) {
          _this.$notify({
            title: '成功',
            message: '复制成功',
            type: 'success',
            duration: 1000
          });
        }, function (e) {
          _this.$notify({
            title: '失败',
            message: '复制失败',
            type: 'success',
            duration: 1000
          });
        })
    }
  }
}







