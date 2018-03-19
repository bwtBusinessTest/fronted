import fetch from '@/utils/fetch';

export function getTreeDataApi({ params }) {
    return fetch({
        url: '/treeDict/getTreeDictTree',
        method: 'post',
        data: params
    });
}

export function getTreeRootNodesApi({ params }) {
    return fetch({
        url: '/treeDict/getTreeDictRootNode',
        method: 'post',
        data: params
    });
}

export function getTreeChildNodesApi({ params }) {
    return fetch({
        url: '/treeDict/getTreeDictChildNode',
        method: 'post',
        data: params
    });
}

export function insertTreeDictApi({ params }) {
    return fetch({
        url: '/treeDict/insert',
        method: 'post',
        data: params
    });
}

export function updateTreeDictApi({ params }) {
    return fetch({
        url: '/treeDict/update',
        method: 'post',
        data: params
    });
}

export function deleteBatchTreeDictApi({ params }) {
    return fetch({
        url: '/treeDict/deleteBatch',
        method: 'post',
        data: params
    });
}

export function showBatchTreeDictApi({ params }) {
    return fetch({
        url: '/treeDict/showBatch',
        method: 'post',
        data: params
    });
}

export function hideBatchTreeDictApi({ params }) {
    return fetch({
        url: '/treeDict/hideBatch',
        method: 'post',
        data: params
    });
}

export function getBeanTreeDictApi({ params }) {
    return fetch({
        url: '/treeDict/getBean',
        method: 'post',
        data: params
    });
}
