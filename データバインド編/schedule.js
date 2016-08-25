$(function() {


	/**
	 * スケジュールロジック
	 *
	 * @class
	 */
	function ScheduleLogic() {
		
		var scheduleData = Schedule.scheduleData;
		this.manager = scheduleData.ScheduleManager;
		this.scheduleModel = this.manager.models.ScheduleModel;
		this.dailySchedulesModel = this.manager.models.DailySchedulesModel;
		this.dates = h5.core.data.createObservableArray();

		var that = this;

		this.dailySchedulesModel.addEventListener('itemsChange', function(ev) {
			for ( var i = 0, l = ev.created.length; i < l; i++) {
				that.dates.push(ev.created[i].get('date'));
			}

			
			for ( var i = 0, l = ev.removed.length; i < l; i++) {
				
				that.dates.splice($.inArray(ev.removed[i].get('date'), that.dates), 1);
			}
		});

		this.loadPromise = Schedule.common.load();
	}

	ScheduleLogic.prototype = {
		load: function() {
			var dfd = h5.async.deferred();
			var that = this;
			// データのロードが終わるのを待つ(非同期)
			this.loadPromise.done(function() {
				// カレンダーに予定ありマークをつける日付だけをコントローラに渡す
				dfd.resolve(that.dates);
			});
			return dfd.promise();
		},

		getSchedulesByDate: function(date) {
			return this.dailySchedulesModel.get(date);
		}
	};

	/**
	 * ScheduleControllerの定義
	 *
	 * @name Schedule.controller.ScheduleController
	 * @namespace
	 */
	var scheduleController = {
		__name: 'ScheduleController',
		logic: new ScheduleLogic(),
		dataLoadPromise: null,
		scheduleDates: null,
		__templates: ['schedule.ejs'],

		$content: null,

		__construct: function(context) {
			this.dataLoadPromise = this.logic.load();
		},

		__ready: function(context) {
			this.$content = this.$find('.content');
			var date = new Date();

			// 現在の月をカレンダーに表示
			this.showCalender(date.getFullYear(), date.getMonth() + 1);

			var that = this;
			this.dataLoadPromise.done(function(dates) {
				// データのロードが終わったら、スケジュールを描画
				that.scheduleDates = dates;
				that.plotExistScheduleMark();

				// イベントリスナの登録
				// 予定のある日付リストに変更があった場合、プロットされるスケジュールありマークを更新する
				that.scheduleDates.addEventListener('observe', function(ev) {
					// スケジュールの存在する日付に変更があった時のイベントリスナ
					if (!ev.isDestructive) {
						// 変更されている可能性がない(変更のないメソッド呼び出し)なら終了
						return;
					}
					// スケジュールの描画
					that.plotExistScheduleMark();
				});
			}).fail(function(e) {
				that.log.error(e);
			});
		},

		'.nextMonth click': function(context) {
			context.event.preventDefault();
			this.moveCalender(1);
		},

		'.preMonth click': function(context) {
			this.moveCalender(-1);
		},

		'.date-column click': function(context) {
			this.$find('td').removeClass('clicked');
			$(context.event.currentTarget).addClass('clicked');
			// idの日付(ハイフン区切り)からスラッシュ区切りに変換
			var date = context.event.currentTarget.getAttribute('id').replace(/-/g, '/');
			$('#detail').trigger('update', {
				date: date
			});
		},

		showCalender: function(y, m) {
			this.view.update(this.$content, 'calender', {
				year: y,
				month: m
			});
		},

		plotExistScheduleMark: function() {
			// 現在表示されているカレンダーの先頭の日付。Date型にする。
			// IDはハイフン区切りなので、スラッシュ区切りに変換している
			var startDate = new Date($('table.calender td:first').attr('id').replace(/-/g, '/'));
			// 現在表示されているカレンダーの最後尾の日付
			var endDate = new Date($('table.calender td:last').attr('id').replace(/-/g, '/'));

			// 予定のある日のtd要素だけに、schedule-existクラスを追加する
			this.$find('table.calender td').removeClass('schedule-exist');
			for ( var i = 0, l = this.scheduleDates.length; i < l; i++) {
				var date = this.scheduleDates[i];
				if (startDate <= new Date(date) && new Date(date) <= endDate) {
					// dateはスラッシュ区切りなので、idで使用しているハイフン区切りに戻す
					// スケジュールあり・なしをクラスで設定する
					$('#' + date.replace(/\//g, '-')).addClass('schedule-exist');
				}
			}
		},

		moveCalender: function(d) {
			// 移動月の計算
			var curYear = parseInt(this.$find('#view_year')[0].value);
			var curMonth = parseInt(this.$find('#view_month')[0].value);
			var ym = curYear * 12 + curMonth - 1 + d;
			var y = parseInt(ym / 12);
			var m = ym % 12 + 1;

			//  カレンダーの表示
			this.showCalender(y, m);

			// スケジュールありなしのマーキング
			this.plotExistScheduleMark();
		}
	};

	h5.u.obj.expose('Schedule.controller', {
		scheduleController: scheduleController
	});
});