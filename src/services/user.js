import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  const token = await localStorage.getItem('jwtToken');
  return request('/api/login/adminUser', {
    headers: { Authorization: token },
  });
}
