import * as API from '@/api';
import { Message } from 'element-ui';

export default {
	namespaced: true,
	state: {
		category: {
			category1Id: '',
			category2Id: '',
			category3Id: ''
		},
		category1List: [],
		category2List: [],
		category3List: []
	},
	getters: {},
	actions: {
		// 获取1级分类列表
		async getCategory1List({ commit }) {
			const result = await API.attrs.getCategory1();
			if (result.code === 200) {
				commit('GET_CATEGORY1_LIST', result.data);
			} else {
				Message.error(result.message);
			}
		},
		// 获取2级分类列表
		async getCategory2List({ commit }, category1Id) {
			//当点击一级分类的时候，去请求二级分类数据
			const result = await API.attrs.getCategory2(category1Id);
			if (result.code === 200) {
				commit('GET_CATEGORY2_LIST_SUCCESS', { category2List: result.data, category1Id });
			} else {
				commit('GET_CATEGORY2_LIST_ERROR', category1Id);
			}
		},
		// 获取3级分类列表
		async getCategory3List({ commit }, category2Id) {
			//当点击二级分类的时候，去请求三级分类数据
			const result = await API.attrs.getCategory3(category2Id);
			if (result.code === 200) {
				commit('GET_CATEGORY3_LIST_SUCCESS', { category3List: result.data, category2Id });
			} else {
				commit('GET_CATEGORY3_LIST_ERROR', category2Id);
			}
		}
	},
	mutations: {
		GET_CATEGORY1_LIST(state, category1List) {
			// 获取1级分类列表（此时还未选择1级分类）
			state.category1List = category1List;
		},
		GET_CATEGORY2_LIST_SUCCESS(state, { category2List, category1Id }) {
			// 获取2级分类列表（此时选择了1级分类， 清空2级和3级分类）
			state.category.category1Id = category1Id;
			state.category2List = category2List;
			//当点击一级分类的时候，要把二级，三级分类id和数据清空
			state.category.category2Id = '';
			state.category.category3Id = '';
			// state.category2List = [];
			state.category3List = [];
		},
		GET_CATEGORY2_LIST_ERROR(state, category1Id) {
			state.category.category1Id = category1Id;
			//当点击一级分类的时候，要把二级，三级分类id和数据清空
			state.category.category2Id = '';
			state.category.category3Id = '';
			state.category2List = [];
			state.category3List = [];
		},
		GET_CATEGORY3_LIST_SUCCESS(state, { category3List, category2Id }) {
			// 获取3级分类列表（此时选择了2级分类， 清空3级分类）
			state.category.category2Id = category2Id;
			state.category3List = category3List;
			//当点击二级分类的时候，要把三级分类id和数据清空
			state.category.category3Id = '';
		},
		GET_CATEGORY3_LIST_ERROR(state, category2Id) {
			state.category.category2Id = category2Id;
			//当点击二级分类的时候，要把三级分类id和数据清空
			state.category.category3Id = '';
			state.category3List = [];
		},
		SET_CATEGORY3_ID(state, category3Id) {
			state.category.category3Id = category3Id;
		},
		//组件卸载之前清除掉vuex的数据
		RESET_CATEGORY_ID(state) {
			state.category.category1Id = '';
			state.category.category2Id = '';
			state.category.category3Id = '';
			state.category1List = [];
			state.category2List = [];
			state.category3List = [];
		}
	}
};
