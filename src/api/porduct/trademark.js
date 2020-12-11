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
	addPagesList(banner) {
		return request({
			method: 'POST',
			url: `${api_name}/save`,
			data: {
				banner
			}
		});
	},

	//修改
	updataPagesList(banner) {
		return request({
			method: 'PUT',
			url: `${api_name}/update`,
			data: {
				banner
			}
		});
	},

	//删除
	delPagesList(id) {
		return request({
			method: 'GET',
			url: `${api_name}/remove/${id}`
		});
	}
};
