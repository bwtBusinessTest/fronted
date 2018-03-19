import Vue from 'vue';
import Router from 'vue-router';
const _import = require('./_import_' + process.env.NODE_ENV);
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout';

Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [
    { path: '/login', component: _import('login/index'), hidden: true },
    { path: '/404', component: _import('404'), hidden: true },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        hidden: true,
        children: [{ path: 'dashboard', component: _import('dashboard/index') }]
    },
    {
        path: '/modifyPassword',
        hidden: true,
        component: _import('modifyPassword/index')
    },
    {
        path: '/introduction',
        component: Layout,
        redirect: '/introduction/index',
        icon: 'people',
        noDropdown: true,
        children: [{ path: 'index', component: _import('dashboard/index'), name: '首页' }]
    }
  /* {
      path: '/ueditor',
      component: Layout,
      redirect: '/ueditor/index',
      noDropdown: true,
      children: [
          { path: 'index', name: 'Ueditor', component: _import('editor/editor') }
      ]
  } */
];
export const asyncRouterMap = [{
    path: '/cardVoucher',
    component: Layout,
    redirect: 'noredirect',
    icon: 'zujian',
    name: '卡券业务管理',
    children: [
        { path: 'cardManage', name: '卡券管理', icon: 'zonghe', component: _import('cardManage/index') },
        {
            path: '/cardVoucher/cardGBManage',
            name: '卡券团购管理',
            icon: 'zonghe',
            component: _import('cardGroupManage/index'),
            redirect: 'noredirect',
            children: [{
                path: 'GroupOrder',
                name: '团购订单',
                icon: 'zonghe',
                component: _import('cardGroupManage/groupOrder')
            },
            {
                path: 'orderDetail',
                name: '订单明细',
                icon: 'zonghe',
                hidden: true,
                component: _import('cardGroupManage/orderDetail')
            }
            ]
        },
        {
            path: '/cardVoucher/retailOrderManage',
            name: '卡券分销管理',
            icon: 'zonghe',
            component: _import('retailOrderManage/index'),
            redirect: 'noredirect',
            children: [{
                path: 'retailManage',
                name: '分销商管理',
                icon: 'zonghe',
                component: _import('retailManage/index')
            },
            {
                path: 'retailCardManage',
                name: '分销商卡券管理',
                icon: 'zonghe',
                component: _import('retailCardManage/index')
            },
            {
                path: 'retailOrder',
                name: '分销订单',
                icon: 'zonghe',
                component: _import('retailOrderManage/retailOrder')
            },
            {
                path: 'refundOrder',
                name: '退款订单',
                icon: 'zonghe',
                component: _import('retailOrderManage/refundOrder')
            }
            ]
        }
    ]
},
{
    path: '/discountActive',
    component: Layout,
    redirect: 'noredirect',
    icon: 'active2',
    name: '活动管理',
    children: [
        { path: 'index', icon: 'zonghe', name: '优惠活动管理', component: _import('discountActive/index') },
        { path: 'activeCreate', icon: 'zonghe', name: '活动创建', component: _import('discountActive/activeCreate'), hidden: true },
        { path: 'activeDetailAndModify', icon: 'zonghe', name: '活动详情及修改', component: _import('discountActive/activeDetailAndModify'), hidden: true },
        { path: 'cardBinDetailAndModify', icon: 'zonghe', name: '卡bin详情及修改', component: _import('discountActive/cardBinDetailAndModify'), hidden: true },
        {
            path: '/discountActive/unicomPhoneActive',
            name: '手机靓号活动管理',
            icon: 'zonghe',
            component: _import('unicomPhoneActive/index'),
            redirect: 'noredirect',
            children: [{
                path: 'phoneManage',
                name: '手机靓号管理',
                icon: 'zonghe',
                component: _import('unicomPhoneActive/phoneManage')
            },
            {
                path: 'phoneReservationOrderManage',
                name: '预订订单管理',
                icon: 'zonghe',
                component: _import('unicomPhoneActive/phoneReservationOrderManage')
            }
            ]
        }
    ]
},
{
    path: '/advertise',
    component: Layout,
    redirect: 'noredirect',
    icon: 'adManage',
    name: '广告管理',
    children: [{
        path: '/advertise/systemManage',
        name: '广告系统管理',
        icon: 'zonghe',
        component: _import('adSystemManage/index'),
        children: [{
            path: 'adPosition',
            name: '广告位管理',
            icon: 'zonghe',
            component: _import('adSystemManage/adPosition')
        },
        {
            path: 'cityAdPosition',
            name: '城市广告位管理',
            icon: 'zonghe',
            component: _import('adSystemManage/cityAdPosition')
        }
        ]
    },
    {
        path: '/advertise/businessManage',
        redirect: 'noredirect',
        name: '广告业务管理',
        icon: 'zonghe',
        component: _import('adBusinessManage/index'),
        children: [{
            path: 'adMaterial',
            name: '广告物料管理',
            icon: 'zonghe',
            component: _import('adBusinessManage/adMaterial')
        },
        {
            path: 'adPublish',
            name: '广告发布管理',
            icon: 'zonghe',
            component: _import('adBusinessManage/adPublish')
        },
        {
            path: 'adPositionAd',
            name: '广告位广告管理',
            icon: 'zonghe',
            component: _import('adBusinessManage/adPositionAd')
        },
        {
            path: 'addAdvertise',
            name: '添加广告',
            icon: 'zonghe',
            hidden: true,
            component: _import('adBusinessManage/addAdvertise')
        },
        {
            path: 'modifyAdvertise',
            name: '修改广告',
            icon: 'zonghe',
            hidden: true,
            component: _import('adBusinessManage/modifyAdvertise')
        },
        {
            path: 'applyReview',
            name: '申请审核',
            icon: 'zonghe',
            hidden: true,
            component: _import('adBusinessManage/applyReview')
        },
        {
            path: 'adThrowSet',
            name: '广告投放设置',
            icon: 'zonghe',
            hidden: true,
            component: _import('adBusinessManage/adThrowSet')
        }
        ]
    }
    ]
},
{
    path: '/system',
    component: Layout,
    redirect: 'noredirect',
    name: '系统管理',
    icon: 'manage',
    children: [
        { path: 'index', name: '用户管理', icon: 'zonghe', component: _import('userManage/index') },
        { path: 'userRole', name: '角色管理', icon: 'zonghe', component: _import('userRoleManage/index') },
        { path: 'template', name: '模板管理', icon: 'zonghe', component: _import('templateManage/index') },
        { path: 'rulesParams', name: '规则参数管理', icon: 'zonghe', component: _import('ruleParamsManage/index') },
        { path: 'rules', name: '规则管理', icon: 'zonghe', component: _import('ruleManage/index') },
        { path: 'dataDic', name: '数据字典管理', icon: 'zonghe', component: _import('dataDicManage/index') },
        { path: 'treeDataDic', name: '树形数据字典管理', icon: 'zonghe', component: _import('treeDataDicManage/index') },
        { path: 'menu', name: '菜单管理', icon: 'zonghe', component: _import('menuManage/index') },
        { path: 'fileConfig', name: '文件配置管理', icon: 'zonghe', component: _import('fileConfig/index') },
        {
            path: '/system/log',
            name: '日志管理',
            icon: 'zonghe',
            component: _import('log/index'),
            redirect: 'noredirect',
            children: [{
                path: 'userLogin',
                name: '用户登录日志信息',
                icon: 'zonghe',
                component: _import('log/userLogin')
            },
            {
                path: 'systemOperate',
                name: '系统操作日志信息',
                icon: 'zonghe',
                component: _import('log/systemOperate')
            },
            {
                path: 'interface',
                name: '接口日志信息',
                icon: 'zonghe',
                component: _import('log/interface')
            }
            ]
        },
        { path: 'ftpManage', name: 'FTP配置管理', icon: 'zonghe', component: _import('ftpManage/index') },
        {
            path: '/system/taskDispatch',
            name: '任务调度',
            icon: 'zonghe',
            component: _import('taskDispatch/index'),
            redirect: 'noredirect',
            children: [
                {
                    path: 'taskConfig',
                    name: '定时服务配置',
                    icon: 'zonghe',
                    component: _import('taskDispatch/taskConfig')
                },
                {
                    path: 'jobConfig',
                    name: '作业配置',
                    icon: 'zonghe',
                    component: _import('taskDispatch/jobConfig')
                },
                {
                    path: 'jobMonitor',
                    name: '作业监控',
                    icon: 'zonghe',
                    component: _import('taskDispatch/jobMonitor')
                },
                {
                    path: 'taskLog',
                    name: '任务日志',
                    icon: 'zonghe',
                    component: _import('taskDispatch/taskLog')
                }
            ]
        },
        {
            path: '/system/userSet',
            name: '用户设置',
            icon: 'zonghe',
            component: _import('userSet/index'),
            redirect: 'noredirect',
            children: [{
                path: 'userInfo',
                name: '用户信息设置',
                icon: 'zonghe',
                component: _import('userSet/userInfo')
            },
            {
                path: 'userPassword',
                name: '用户密码设置',
                icon: 'zonghe',
                component: _import('userSet/userPassword')
            }
            ]
        },
        { path: 'version', name: '版本查看', icon: 'zonghe', component: _import('versionCheck/index') }
    ]
},
    { path: '*', redirect: '/404', hidden: true }
];

export default new Router({
  // mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
});
