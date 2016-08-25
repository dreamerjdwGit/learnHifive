$(function() {

	/**
	 * 詳細表示コントローラ定義
	 *
	 * @name Schedule.controller.detailController
	 */
	var detailController = {
		/**
		 * コントローラ名
		 *
		 * @memberOf Schedule.controller.detailController
		 */
		__name: 'DetailController',

		/**
		 * テンプレート
		 *
		 * @memberOf Schedule.controller.detailController
		 */
		__templates: 'detail.ejs',

		/**
		 * 詳細表示タブにバインドするアイテム {date: 日付, schedules: ScheduleModelのDataItemの配列}
		 *
		 * @memberOf Schedule.controller.detailController
		 * @type {ObservableItem}
		 */
		viewItem: null,

		/**
		 * クリックされた日付の詳細を表示する。カレンダーの日付クリックから呼ばれる。
		 *
		 * @memberOf Schedule.controller.detailController
		 * @param context
		 */
		'{rootElement} update': function(context) {
			if (!this.viewItem) {
				// 初めて呼び出されたときに、初期処理を行う
				this.initView();
			}

			var date = context.evArg.date;

			// バインドしているオブジェクトに日付とスケジュールをset
			var item = Schedule.scheduleData.dailySchedulesModel.get(date);
			var schedules = item && item.get('schedules');
			this.viewItem.set({
				date: date,
				schedules: schedules
			});
		},

		/**
		 * 編集ボタンクリック
		 *
		 * @memberOf Schedule.controller.detailController
		 * @param context
		 */
		'.edit-schedule click': function(context) {
			var scheduleId = $(context.event.target).prev().val();
			var item = Schedule.scheduleData.scheduleModel.get(scheduleId);
			var date = this.$find('h2').text();

			// ダイアログの表示
			this.showEditDialog({
				schedule: item,
				date: date
			}, true);
		},

		/**
		 * 予定の追加クリック
		 *
		 * @memberOf Schedule.controller.detailController
		 * @param context
		 */
		'.add-schedule click': function(context) {
			var date = this.$find('h2').text();

			// ダイアログの表示
			this.showEditDialog({
				date: date
			}, false);
		},

		/**
		 * 詳細タブにテンプレート表示 最初に一度だけ表示(view.update)する。this.viewItemのバインド先になる。
		 *
		 * @memberOf Schedule.controller.detailController
		 */
		initView: function() {
			this.view.update(this.$find('.content'), 'detail');
			this.viewItem = h5.core.data.createObservableItem({
				date: null,
				schedules: {
					type: 'any',
					defaultValue: []
				}
			});
			this.view.bind(this.$find('.content'), this.viewItem);
		},

		/**
		 * 予定編集(追加)用のダイアログを開く
		 *
		 * @memberOf Schedule.controller.detailController
		 * @param bindObj
		 * @param isEdit 編集ならtrue、追加ならfalse
		 */
		showEditDialog: function(bindObj, isEdit) {
			Schedule.common.openDialog(this.view.get('edit-dialog', {
				isEdit: isEdit
			}), bindObj);
		}
	};

	h5.u.obj.expose('Schedule.controller', {
		detailController: detailController
	});
});