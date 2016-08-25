(function() {
	var SAMPLE_DATA_FILEPATH = 'json/sampleData.json';

	var todoController = {
		__name: 'TodoController',
		todoLogic: sample.todo.logic.TodoLogic,

		__ready: function() {
			var that = this;
			this.todoLogic.init().done(function(data) {
				that.view.bind('h5view#tmplTodos', {
					todos: data
				});
			});
		},

		'#btnRegist click': function(context) {
			this._insertToDo(context);
		},

		'#todoRegForm submit': function(context) {
			this._insertToDo(context);
		},

		'#list tbody input[type="checkbox"] click': function(context) {
			var target= context.event.currentTarget;
			var id= this._getSelectedItemId($(target).closest('tr'));
			var status= target.checked;

			this.todoLogic.update(id, {
				status:status
			});
			context.event.stopPropagation();
		},

		/**
     * 選択された行のTODO情報の詳細を表示します。
     *
     * @param {Object} context イベントコンテキスト
     */
   '#list tbody tr click': function(context) {
       var that = this;
       var id = this._getSelectedItemId(context.event.currentTarget);
       var detail = this.todoLogic.getDetail(id);

       if ($('#detailForm').children().length === 0) {
           this.view.bind('h5view#tmplDetail', {
                detail: detail
            });
        }
        this._showDetail();
    },
   
   '#detailForm submit': function(context) {
       context.event.preventDefault();
    },
  
   '#btnDel click': function(context) {
       var params = this._getFormData();

       this.todoLogic.remove(parseInt(params.id));

       context.event.stopPropagation();
       this._hideDetail();
    },

    '#btnBack click': function(context) {
    	this._hideDetail();
    },
  
   '#btnUpdate click': function(context) {
       var params = this._getFormData();

       this.todoLogic.update(params.id, {
            content: params.content,
            status: !!params.status
        });

       context.event.stopPropagation();
       this._hideDetail();
    },
   
    _insertToDo: function(ctx) {
       var $txtTodo = this.$find('#txtTodo');

       if ($txtTodo.val() === '') {
            alert('TODOを入力して下さい。');
        } else {
           this.todoLogic.add($txtTodo.val());
            $txtTodo.val('');
        }

       // formのsubmitが動作しないよう伝播を止める
       ctx.event.preventDefault();
    },
   /**
     * 一覧で選択された行のアイテムIDを取得します。
     *
     * @param targetElem {DOMElement} イベント発生要素
     * @returns アイテムID
     */
    _getSelectedItemId: function(targetElem) {
       return $(targetElem).find('input[data-h5-bind="id"]').val();
    },
   /**
     * 詳細画面の入力値を取得します。
     *
     * @returns {Object} 入力値が格納されたオブジェクト
     */
    _getFormData: function() {
       var param = {};

        $.each(this.$find('#detailForm').serializeArray(), function(i, obj) {
            param[obj.name] = obj.value;
        });

       return param;
    },

    _showDetail: function() {
    	this.$find('.header,.top').css('display','none');
    	this.$find('.bottom').css('display','block');
    },
     _hideDetail: function() {
    	this.$find('.header,.top').css('display','block');
    	this.$find('.bottom').css('display','none');
    }

	};


	h5.core.expose(todoController);
})();

