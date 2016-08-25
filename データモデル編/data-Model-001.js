// manager创建
var manager = h5.core.data.createManager('SamplerManager','sample');
// 由manager创建model
var model = manager.createModel({
	name: 'SampleModel',
	schema: {
		id: {id: true},
		name: {type: 'string'},
		point: {
			type: 'integer',
			defaultValue: 0
		}
	}
});
// 由model生成item
var item = model.create({
	id: '001',
	name: '田中太郎',
	point: 50
});

// item值获取
item.get('id') === '001'
item.get('name') === '田中太郎',
item.get('point') === 50

// 由model取得item
model.get('001');

// 由model删除item
model.remove('001');

// 删除model
manager.dropModel('SampleModel');

//例子
var productSchema = {
	// 商品id 主键
	id: {id: true},

	// 商品名称 string
	name: {type: 'string'},

	// 商品单价 int
	unitPrice: {type: 'integer'},

	// 商品数量 int
	amount: {type: 'integer'}
};

var model = manager.createModel({
	name: 'productModel',
	schema: productSchema
});
var item = model.create({
	id: '001',
	name: 'pen',
	unitPrice: 100,
	amount: 5000
});