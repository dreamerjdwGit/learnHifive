var itemSearchLogic = {
	__name: 'itemSearchLogic',
	getItemList: function(categoryId) {
		var dfd = this.deferred();
		var result = null;

		this._getItemData(categoryId).done(function(data) {
			result= $.map(data, function(obj) {
				obj.price= Math.floor(obj.price*1.05);
				return obj;
			});
			dfd.resolve(result);
		}).fail(function(error){
			dfd.reject(error.message);
		});

		return dfd.promise();
	},
	_getItemData: function(categoryId) {
		var promise = h5.ajax('./itemList',{
			type: 'GET',
			dataType: 'json',
			data: {
				categoryId: categoryId
			}
		});
		return promise;
	}

}