import request from '@/utils/request';

const api_name = '/admin/product/baseTrademark';

export default {
	//获取分页列表
	getPagesList(page, limit) {
		return request({
			method: 'GET',
			url: `${api_name}/${page}/${limit}`
		});
	},

	//添加
	addPagesList(data) {
		return request({
			method: 'POST',
			url: `${api_name}/save`,
			data
		});
	},

	//修改
	updataPagesList(data) {
		return request({
			method: 'PUT',
			url: `${api_name}/update`,
			data
		});
	},

	//删除
	delPagesList(id) {
		return request({
			method: 'DELETE',
			url: `${api_name}/remove/${id}`
		});
	}
};
