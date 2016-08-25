$(function() {
	var manager = h5.core.data.createManager('listManager');
	//例子
	var productSchema = {
		// 商品id 主键
		id: {id: true},

		// 商品名称 string
		name: {type: 'string'},

		// 商品单价 int
		unitPrice: {type: 'integer'},

		// 商品数量 int
		amount: {type: 'integer'},

		totalPrice: {
			type: 'integer',
			depend: {
				on: ['unitPrice', 'amount'],
				calc: function(ev) {
					return this.get('unitPrice') * this.get('amount');
				}
			}
		},

		message: {
			type: 'string',
			depend: {
				on: ['name', 'totalPrice'],
				calc: function(ev) {
					return this.get('name') + '的总价为' + this.get('totalPrice');
				}
			}
		}
	};

	var model = manager.createModel({
		name: 'productModel',
		schema: productSchema
	});
	var item = model.create({
		id: '001',
		name: 'pen',
		unitPrice: 100
	});

	var listener = function(ev) {
		alert('change!');
	};

	model.addEventListener('itemsChange', listener);
	model.remove('001');

});