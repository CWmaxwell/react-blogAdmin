import { queryTag, addTag, delTag } from '@/services/api';

export default {
  namespace: 'tag',

  state: {
    tagList: [],
    total: 0,
  },

  effects: {
    *queryTag({ payload }, { call, put }) {
      const { resolve, params } = payload;
      const response = yield call(queryTag, params);
      if (resolve) {
        resolve(response); // 返回数据
      }
      if (response.code === 200) {
        yield put({
          type: 'saveTagList',
          payload: response.data.list,
        });
        yield put({
          type: 'saveTagListTotal',
          payload: response.data.count,
        });
      } else {
        // console.log(response);
      }
    },
    *addTag({ payload }, { call }) {
      const { resolve, params } = payload;
      const response = yield call(addTag, params);
      if (resolve) {
        resolve(response);
      }
    },
    *delTag({ payload }, { call }) {
      const { resolve, clickTagId } = payload;
      const response = yield call(delTag, clickTagId);
      if (resolve) {
        resolve(response);
      }
      // if (response.code === 200) {
      //     yield put({
      //         type: 'saveTagList',
      //         payload: response.data.list,
      //     });
      //     yield put({
      //         type: 'saveTagListTotal',
      //         payload: response.data.count,
      //     });
      // } else {
      //     console.log(response);
      // }
    },
  },

  reducers: {
    saveTagList(state, { payload }) {
      return {
        ...state,
        tagList: payload,
      };
    },
    saveTagListTotal(state, { payload }) {
      return {
        ...state,
        total: payload,
      };
    },
  },
};
