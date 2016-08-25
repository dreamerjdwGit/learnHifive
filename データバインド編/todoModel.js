(function() {

	function toYMDHMS(value) {
		var date = new Date(value);
		var mm = date.getMonth() + 1;
		var dd = date.getDate();
		var hh = date.getHours();
		var mi = date.getMinutes();
		var ss = date.getSeconds();

		if(mm < 10) {
			mm = '0' + mm;
		}
		if(dd < 10) {
			dd = '0' + dd;
		}
		if(hh < 10) {
			hh = '0' + hh;
		}
		if(mi < 10) {
			mi = '0' + mi;
		}
		if(ss < 10) {
			ss = '0' + ss;
		}

		return date.getFullYear() + '/' + mm + '/' + dd + ' ' + hh + ':' + mi + ':' + ss;
	};

	var manager = h5.core.data.createManager('ToDoManager');
	var todoSchema = {
		id: {id: true, 
			 type: 'integer'
		},
		content: {type: 'string'},
		contentStyle: {
			type: 'string',
			depend: {
				on: 'status',
				calc: function() {
					return this.get('status') ? 'line-through' : '';
				}
			}
		},
		status: {type: 'boolean'},
		checked: {
			type: 'string',
			depend: {
				on: 'status',
				calc: function(ev) {
					return this.get('status') ? 'checked' : null;
				}
			}
		},
		insertDate: {type: 'number'},
		ymdhms: {
			type: 'string',
			depend: {
				on: 'insertDate',
				calc: function(ev) {
					return toYMDHMS(this.get('insertDate'));
				}
			}
		}
	};


	var descprit = {
		name: 'TodoModel',
		schema: todoSchema
	};
	var todoModel = manager.createModel(descprit); 
	h5.u.obj.expose('sample.todo.model', {
		ToDoModel: todoModel
	});
})();

