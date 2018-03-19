import fetch from '@/utils/fetch';

export function getLastVersionApi({ params }) {
    return fetch({
        url: '/version/getLastVersionInfo',
        method: 'post',
        data: params
    });
}
