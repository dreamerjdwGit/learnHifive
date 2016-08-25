$(function() {
	// ダイアログをbodyに追加
	var dialogPromise = h5.core.view.load('dialog.ejs').done(function() {
		$('body').append(h5.core.view.get('dialog'));
	});

	var manager = Schedule.scheduleData.ScheduleManager;
	/**
	 * ダイアログロジック
	 *
	 * @class
	 * @name DialogLogic
	 */
	var dialogLogic = {

		/**
		 * データモデルマネージャ
		 *
		 * @memberOf DialogLogic
		 */
		manager: manager,

		/**
		 * スケジュールデータモデル
		 *
		 * @memberOf DialogLogic
		 */
		scheduleModel: manager.models.ScheduleModel,

		/**
		 * 日ごとのスケジュールを扱うデータモデル
		 *
		 * @memberOf DialogLogic
		 */
		dailySchedulesModel: manager.models.DailySchedulesModel,

		/**
		 * スケジュールを登録、変更する 引数はスケジュールID、スケジュール情報を持つオブジェクト。 既存のIDであれば変更、そうでなければ登録。
		 * 登録ならtrue、変更ならfalseを返す
		 *
		 * @memberOf DialogLogic
		 * @param {Object} schedule ScheduleModelのスキーマに沿ったオブジェクト
		 * @returns {Boolean} 新規登録かどうか
		 */
		create: function(schedule) {
			try {
				var isCreated = !this.scheduleModel.has(schedule.id);
				this.scheduleModel.create(schedule);
				return isCreated;
			} catch (e) {
				throw e;
			}
			return false;
		},

		/**
		 * スケジュールを削除する
		 *
		 * @memberOf DialogLogic
		 * @param id {String} スケジュールID
		 */
		del: function(id) {
			this.scheduleModel.remove(id);
		}
	};

	/**
	 * ダイアログコントローラ定義
	 *
	 * @name Schedule.controller.DialogController
	 * @namespace
	 */
	var dialogController = {
		__name: 'DialogController',

		/**
		 * このコントローラが操作する、画面全体にかかるインジケータ
		 *
		 * @memberOf Schedule.controller.DialogController
		 * @type {Indicator}
		 */
		block: null,

		/**
		 * ダイアログからデータ操作を行うためのロジック
		 *
		 * @memberOf Schedule.controller.DialogController
		 * @type {DialogLogic}
		 */
		logic: dialogLogic,

		/**
		 * キーダウンイベント escキーでダイアログを閉じる
		 *
		 * @memberOf Schedule.controller.DialogController
		 * @param context
		 */
		'{window} [keydown]': function(context) {
			if (this.rootElement.style.display === 'none') {
				return;
			}
			if (context.event.keyCode === 27) {
				this.unblock();
			}
		},

		/**
		 * 戻るボタンをクリック
		 *
		 * @memberOf Schedule.controller.DialogController
		 * @param context
		 */
		'.back click': function(context) {
			this.$find('.content>*').trigger('close');
			this.unblock();
		},

		/**
		 * 変更ボタン、追加ボタンクリック
		 *
		 * @memberOf Schedule.controller.DialogController
		 * @param context
		 */
		'.rewrite-schedule,.add-schedule click': function(context) {
			var item = {};
			var $parent = $(context.event.target).parent();

			// 件名
			item.subject = $parent.find('input[name="subject"]').val();
			if (!item.subject) {
				alert('件名は必須項目です');
				return;
			}

			// from,toは任意なので空文字ならnullにする
			item.from = $parent.find('input[name="from"]').val() || null;
			item.to = $parent.find('input[name="to"]').val() || null;

			// 日付
			item.date = $parent.parent().find('h2').text();

			// 詳細
			item.detail = $parent.find('textarea.detail').val();

			// id(変更時) 追加時なら現在時刻
			item.id = $parent.find('input[name="id"]').val() || '' + new Date().getTime();

			try {
				var isCreated = this.logic.create(item);
			} catch (e) {
				alert('登録できませんでした。入力情報を確認してください。\n開始・終了時刻はyy:mm形式で入力してください。');
				return;
			}
			// 新しくその日に予定ができた場合は、詳細タブをupdate
			// (今まで予定がない日は、nullをバインドしてあるため)
			if (isCreated) {
				setTimeout(function() {
					$('#detail').trigger('update', {
						date: item.date
					});
				}, 0);
			}

			this.unblock();
			return;
		},

		/**
		 * 削除ボタンクリック
		 *
		 * @memberOf Schedule.controller.DialogController
		 * @param context
		 */
		'.delete-schedule click': function(context) {
			if (!confirm('この予定を削除しますか？')) {
				return;
			}

			// id(変更時) 追加時なら現在時刻
			var id = $(context.event.target).parent().find('input[name="id"]').val();

			this.logic.del(id);
			this.unblock();
		},

		/**
		 * ダイアログを開く
		 *
		 * @memberOf Schedule.controller.DialogController
		 * @param context
		 */
		'{rootElement} openDialog': function(context) {
			var content = context.evArg.content;
			var data = context.evArg.data;
			data.schedule = data.schedule || {};

			var $dialog = $('#dialog');
			var $content = $dialog.find('.content').html(content);
			// contextがすでにバインドされている(getの時点)実装になるはずなので、対応されたらここは不要
			h5.core.view.bind($content, data);

			var width = $dialog.outerWidth();
			// 真ん中に調整して表示
			$dialog.css({
				display: 'block',
				left: parseInt(($(window).width() - width) / 2) + 'px'
			});
			this.block = h5.ui.indicator(window).show();
		},
		/**
		 * ダイアログを閉じる
		 *
		 * @memberOf Schedule.controller.DialogController
		 */
		unblock: function() {
			$(this.rootElement).toggle();
			this.block && this.block.hide();
		}
	};

	h5.u.obj.expose('Schedule.controller', {
		dialogController: dialogController
	});

	// dialogPromiseの完了を待ってからでないとdialogControllerをバインドできないので、dialogPromiseも外だしする。
	h5.u.obj.expose('Schedule.promise', {
		dialogPromise: dialogPromise
	});
});
