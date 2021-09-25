import request from '@root/publicMethods/request';

export function getInfo() {
  return request({
    url: '/manage/getUserSession',
    method: 'get',
  });
}
