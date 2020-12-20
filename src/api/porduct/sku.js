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
	},
	//获取sku列表
	findBySpuId(spuId) {
		return request({
			method: 'GET',
			url: `${api_name}/findBySpuId/${spuId}`
		});
	},

	//获取所有sku商品列表
	allSkuList({ page, limit }) {
		return request({
			method: 'GET',
			url: `${api_name}/list/${page}/${limit}`
		});
	},

	//获取抽屉sku商品列表
	drawerSkuList(skuId) {
		return request({
			method: 'GET',
			url: `${api_name}/getSkuById/${skuId}`
		});
	},

	//删除sku商品
	deleteSku(skuId) {
		return request({
			method: 'DELETE',
			url: `${api_name}/deleteSku/${skuId}`
		});
	},

	//上架sku商品
	onSaleSku(skuId) {
		return request({
			method: 'GET',
			url: `${api_name}/onSale/${skuId}`
		});
	},

	//下架sku商品
	cancelSaleSku(skuId) {
		return request({
			method: 'GET',
			url: `${api_name}/cancelSale/${skuId}`
		});
	}
};
