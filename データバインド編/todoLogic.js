(function() {
	var SAMPLE_DATA_FILEPATH = './sampleData.json';

	var todoLogic = {
		__name: 'sample.todo.logic.TodoLogic',
		model: sample.todo.model.ToDoModel,
		todos: h5.core.data.createObservableArray(),
		detail: h5.core.data.createObservableArray(),

		init: function() {
			var df = this.deferred();
			var that = this;

			$.ajax({
				url: SAMPLE_DATA_FILEPATH,
				dataType: 'json',
				cache: false,
				success: function(data) {
					var dataItems = that.model.create(data);
					that.todos.copyFrom(dataItems);
					df.resolve(that.todos);
				},
				error: function() {
					alert('failed');
				}
			});
			return df.promise();
		},

		getItem: function(id) {
			return this.model.model.get(id);
		},

		add: function(content) {
			var item = this.model.create({
				id: this._getNewId(),
				status: false,
				content: content,
				insertDate: +new Date()
			});
			this.todos.push(item);
		},

		remove: function(id) {
			for(var i=0,len= this.todos.length; i<len; i++) {
				var item= this.todos.get(i);
				var itemId= item.get('id');

				if(itemId===id) {
					this.model.remove(id);
					this.todos.splice(i,1);
					this.detail.pop();
					break;
				}
			}
		},

		update: function(id, data) {
			var item= this.model.get(id);
			// var checked = data.status ? 'checked' : '';
			// data[checked] = checked;
			item.set(data);
		},

		getDetail: function(id) {
			var item= this.model.get(id);
			this.detail.splice(0,1,item);
			return this.detail;
		},

		_getNewId: function() {
			for(var i=1;;i++) {
				if (!this.model.has(i)) {
					return i;
				}
			}
		}
	};
	h5.core.expose(todoLogic);
})();

