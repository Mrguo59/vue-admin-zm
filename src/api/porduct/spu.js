import request from '@/utils/request';

const api_name = '/admin/product';

export default {
	/*
  获取Spu分页列表
  */
	getSpuList(page, limit, category3Id) {
		return request({
			method: 'GET',
			url: `${api_name}/${page}/${limit}`,
			params: {
				category3Id
			}
		});
	},

	/*
  删除SPU
  */
	deleteSpu(spuId) {
		return request({
			method: 'DELETE',
			url: `${api_name}/deleteSpu/${spuId}`
		});
	},

	/*
  添加SPU
  */
	saveSpuInfo(spuInfo) {
		return request({
			method: 'POST',
			url: `${api_name}/saveSpuInfo`,
			data: spuInfo
		});
	},

	/*
  更新SPU
  */
	updateSpuInfo(spuInfo) {
		return request({
			method: 'POST',
			url: `${api_name}/updateSpuInfo`,
			data: spuInfo
		});
	},
	/*
  获取所有品牌数据
  */
	getTrademarkList() {
		return request({
			method: 'GET',
			url: `${api_name}/baseTrademark/getTrademarkList`
		});
	},

	/*
  获取SPU的图片列表
  */
	getSpuImageList(spuId) {
		return request({
			method: 'GET',
			url: `${api_name}/spuImageList/${spuId}`
		});
	},

	/*
  获取SPU的销售属性列表
  */
	getBaseSaleAttrList() {
		return request({
			method: 'GET',
			url: `${api_name}/baseSaleAttrList`
		});
	},

	/*
  获取销售属性
  */
	getSpuSaleAttrList(spuId) {
		return request({
			method: 'GET',
			url: `${api_name}/spuSaleAttrList/${spuId}`
		});
	}
};
