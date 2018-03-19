import { getLastVersionApi} from '../../api/version';
import butVisibleMixin from '../../utils/buttonVisible';

export default {
  mixins: [butVisibleMixin],
  data() {
    return {
      pageId: '211',
      form: {
        curVersionNo: '',
        curPublishDate: '',
        preVersionNo: '',
        prePublishDate: '',
        curVersionContent: ''
      }
    }
  },
  created(){
    this.getLastVersion();
  },
  methods: {
    getLastVersion() {
      const params = null;
      getLastVersionApi({ params }).then(res => {
        if (res.errcode === '0000') {
          this.form = res.result;
        }
      });
    }
  }
}