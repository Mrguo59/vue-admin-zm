import request from '@/utils/request';

const api_name = '/admin/product';

export default {
	/*
    保存SKU数据
  */
	saveSkuInfo(sku) {
		return request({
			method: 'POST',
			url: `${api_name}/saveSkuInfo`,
			data: sku
		});
	}
};
