import { addArticle } from '@/services/api';

export default {
  namespace: 'article',

  state: {
    articleList: [],
    total: 0,
    articleDetail: {
      _id: '',
      author: '陈文',
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
  },
};
