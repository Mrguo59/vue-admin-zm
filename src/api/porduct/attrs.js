import request from '@/utils/request';

const api_name = '/admin/product';

export default {
	//获取一级分类列表
	getCategory1() {
		return request({
			method: 'GET',
			url: `${api_name}/getCategory1`
		});
	},

	//获取二级分类列表
	getCategory2(category1Id) {
		return request({
			method: 'GET',
			url: `${api_name}/getCategory2/${category1Id}`
		});
	},

	//获取三级分类列表
	getCategory3(category2Id) {
		return request({
			method: 'GET',
			url: `${api_name}/getCategory3/${category2Id}`
		});
	},

	//获取全部分类列表
	attrInfoList({ category1Id, category2Id, category3Id }) {
		return request({
			method: 'GET',
			url: `${api_name}/attrInfoList/${category1Id}/${category2Id}/${category3Id}`
		});
	},

	//获取商品属性列表
	getAttrValueList(attrId) {
		return request({
			method: 'GET',
			url: `${api_name}/getAttrValueList/${attrId}`
		});
	},

	//删除商品属性
	deleteAttr(attrId) {
		return request({
			method: 'DELETE',
			url: `${api_name}/deleteAttr/${attrId}`
		});
	},

	//保存商品信息
	saveAttrInfo(attrInfo) {
		return request({
			method: 'POST',
			url: `${api_name}/saveAttrInfo`,
			data: attrInfo
		});
	}
};
