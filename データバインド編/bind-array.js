$(function() {
/*	var manager = h5.core.data.createManager('SampleManager');
	var descprit = {
		name: 'testModel',
		schema: {
			id: {id: true},
			name: {type: 'string'}
		}
	};
	var testModel = manager.createModel(descprit);
	var item = testModel.create({
		id: '007',
		name: 'James Bond'
	});

	h5.core.view.bind('#bindtest', {
		title: 'test',
		item: item
	});

	item.set('name', 'sabrow');*/
	var ary = [{
		id: '001',
		name: 'taro'
	}, {
		id: '002',
		name: 'jiro'
	}];
	h5.core.view.bind('#bindtest', {
		items: ary
	});

	ary[0].name = 'sdfkj';
	alert(ary[0].name);

});