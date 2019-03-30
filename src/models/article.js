import {
  addArticle,
  queryArticle,
  deleteArticle,
  queryArticleDetail,
  updateArticle,
  queryArticleComments,
  deleteComment,
  toTopComment,
  postComment,
} from '@/services/api';

export default {
  namespace: 'article',

  state: {
    isArticleUpdate: false,
    articleList: [],
    articleComments: [],
    total: 0,
    articleDetail: {
      _id: '',
      author: 'chenw247',
      category: 1,
      desc: '',
      keyword: [],
      tag: [],
      title: '',
      content: '',
    },
  },

  effects: {
    *addArticle({ payload }, { call }) {
      const { resolve, params } = payload;
      const response = yield call(addArticle, params);
      if (resolve) {
        resolve(response);
      }
    },
    *queryArticle({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(queryArticle, params);
      if (resolve) {
        resolve(response); // 返回数据
      }
      if (response.code === 200) {
        yield put({
          type: 'saveArticleList',
          payload: response.data.list,
        });
        yield put({
          type: 'saveArticleListTotal',
          payload: response.data.count,
        });
      } else {
        // console.log(response);
      }
    },
    *updateArticle({ payload }, { call }) {
      const { resolve, params } = payload;
      const response = yield call(updateArticle, params);
      if (resolve) {
        resolve(response);
      }
    },
    *updateArticleDetail({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(queryArticleDetail, params);
      if (resolve) {
        resolve(response);
      }
      if (response.code === 200) {
        yield put({
          type: 'saveArticleDetail',
          payload: response.data,
        });
        yield put({
          type: 'setArticleUpdate',
          payload: true,
        });
      }
    },
    *queryArticleDetail({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(queryArticleDetail, params);
      if (resolve) {
        resolve(response);
      }
      if (response.code === 200) {
        yield put({
          type: 'saveArticleDetail',
          payload: response.data,
        });
      }
    },
    *queryArticleComments({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(queryArticleComments, params);
      if (resolve) {
        resolve(response); // 返回数据
      }
      if (response.code === 200) {
        yield put({
          type: 'saveArticleComments',
          payload: response.data.list,
        });
      }
    },
    *deleteArticle({ payload }, { call }) {
      const { resolve, params } = payload;
      const response = yield call(deleteArticle, params);
      if (resolve) {
        resolve(response);
      }
    },
    *deleteComment({ payload }, { call }) {
      const { resolve, params } = payload;
      const response = yield call(deleteComment, params);
      if (resolve) {
        resolve(response);
      }
    },
    *toTopComment({ payload }, { call }) {
      const { resolve, params } = payload;
      const response = yield call(toTopComment, params);
      if (resolve) {
        resolve(response);
      }
    },
    *postComment({ payload }, { call }) {
      const { resolve, params } = payload;
      const response = yield call(postComment, params);
      if (resolve) {
        resolve(response);
      }
    },
  },

  reducers: {
    saveArticleList(state, { payload }) {
      return {
        ...state,
        articleList: payload,
      };
    },
    saveArticleListTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
    saveArticleDetail(state, { payload }) {
      return {
        ...state,
        articleDetail: payload,
      };
    },
    saveArticleComments(state, { payload }) {
      return {
        ...state,
        articleComments: payload,
      };
    },
    setArticleUpdate(state, { payload }) {
      return {
        ...state,
        isArticleUpdate: payload,
      };
    },
  },
};
