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
	var obsAry = h5.core.data.createObservableArray();
	obsAry.set(0, {id: '001', name: 'taro'});
	obsAry.set(1, {id: '002', name: 'jiro'});

	h5.core.view.bind('#bindtest', {title: 'ObservableArray', items: obsAry});
	obsAry.push({id: '007', name: 'James Bond'});
	
});