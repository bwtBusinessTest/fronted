import { asyncRouterMap, constantRouterMap } from '@/router';

var firstLayDiff = 0;
var diff = 0;
function remove(arr, item) {
	const index = arr.findIndex((element) => {
		return element.name === item.name;
	});
	if (index > -1) {
		arr.splice(index, 1);
	}
};

function objDeepCopy(source) {
    var sourceCopy = source instanceof Array ? [] : {};
    for (var item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}

function secondLayHiddenRouter(name) {
	return ['活动创建', '活动详情及修改', '卡bin详情及修改'].some(el => {
		return el === name;
	});
}

function thirdLayHiddenRouter(name) {
	return ['订单明细','添加广告', '修改广告', '申请审核', '广告投放设置', '广告详情'].some(el => {
		return el === name;
	});
}

function filterAsyncRouter(asyncRouterMap, menuAuth) {
	let resultArr = objDeepCopy(asyncRouterMap);
	firstLayDiff = 0;
	asyncRouterMap.forEach((firstLayRoute, index) => {
		diff = 0;
		const firstLayFindIndex = menuAuth[0].children.findIndex((element) => {
			return firstLayRoute.name === element.label;
		});
		if (firstLayFindIndex < 0) {
			remove(resultArr, firstLayRoute);
			firstLayDiff++;
		} else {
			if (firstLayRoute.children.length > 0) {
				firstLayRoute.children.forEach((secondLayRoute, j) => {
					const secondLayFindIndex = menuAuth[0].children[firstLayFindIndex].children.findIndex((element) => {
						return secondLayRoute.name === element.label;
					});
					if (secondLayFindIndex < 0 && !secondLayHiddenRouter(secondLayRoute.name)) {
						remove(resultArr[index - firstLayDiff].children, secondLayRoute);
						diff++;
					} else {
						if ( secondLayRoute.children && secondLayRoute.children.length > 0) {
							secondLayRoute.children.forEach((thirdLayRoute, k) => {
								const thirdLayIndex = menuAuth[0].children[firstLayFindIndex].children[secondLayFindIndex].children.findIndex((element) => {
									return thirdLayRoute.name === element.label;
								})
								if (thirdLayIndex < 0 && !thirdLayHiddenRouter(thirdLayRoute.name)) {
									remove(resultArr[index - firstLayDiff].children[j - diff].children,thirdLayRoute)
								}
							});
							
						}
					}
				});
			}
		}
	});
	resultArr.push(asyncRouterMap[asyncRouterMap.length - 1]);
	return resultArr;
}

const permission = {
	state: {
		routers: constantRouterMap,
		addRouters: []
	},
	mutations: {
		SET_ROUTERS: (state, routers) => {
			state.addRouters = routers;
			state.routers = constantRouterMap.concat(routers);
		}
	},
	actions: {
		GenerateRouters({ commit, getters }) {
			return new Promise(resolve => {
				let accessedRouters;
				const menuAuth = getters.menuAuth;
				accessedRouters = filterAsyncRouter(asyncRouterMap, menuAuth);
				commit('SET_ROUTERS', accessedRouters);
				resolve();
			})
		}
	}
}

export default permission