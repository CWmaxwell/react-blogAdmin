import { stringify } from 'qs';
import request from '@/utils/request';

// 登陆
export async function adminLogin(params) {
  return request('/api/admin/login', {
    method: 'POST',
    body: params,
  });
}

// 文章
export async function addArticle(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/admin/article`, {
    method: 'POST',
    body: params,
    headers: { Authorization: token },
  });
}

export async function updateArticle(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/admin/updatearticle/${params.key}`, {
    method: 'POST',
    body: params,
    headers: { Authorization: token },
  });
}

export async function queryArticle(params) {
  const token = await localStorage.getItem('jwtToken');
  if (params) {
    return request(
      `/api/admin/article?searchKeyword=${params.searchKeyword}&&selectState=${params.selectState}`,
      {
        headers: { Authorization: token },
      }
    );
  }
  return request(`/api/admin/article`, {
    headers: { Authorization: token },
  });
}

export async function queryArticleDetail(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/admin/articleDetail/${params.articleId}`, {
    headers: { Authorization: token },
  });
}

export async function deleteArticle(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/admin/article?articleId=${params.articleId}`, {
    method: 'DELETE',
    headers: { Authorization: token },
  });
}

// 评论
export async function queryArticleComments(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/admin/comment/article/${params.articleId}`, {
    headers: { Authorization: token },
  });
}

export async function deleteComment(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/admin/comment?commentId=${params.commentId}`, {
    method: 'DELETE',
    headers: { Authorization: token },
  });
}

export async function toTopComment(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/admin/comment/top?commentId=${params.commentId}`, {
    method: 'POST',
    headers: { Authorization: token },
  });
}

export async function postComment(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/admin/comment/`, {
    method: 'POST',
    body: params,
    headers: { Authorization: token },
  });
}

// 标签
export async function queryTag() {
  return request(`/api/tag`);
}

export async function addTag(params) {
  const token = await localStorage.getItem('jwtToken');
  return request('/api/tag', {
    method: 'POST',
    body: params,
    headers: { Authorization: token },
  });
}

export async function delTag(params) {
  const token = await localStorage.getItem('jwtToken');
  return request(`/api/tag?tag_id=${params.clickTagId}`, {
    method: 'DELETE',
    headers: { Authorization: token },
  });
}

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
