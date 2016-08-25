$(function() {
	var LOG = h5.log.createLogger('common');
	var TIME_REGEX = /^$|^([0-9]|[0-1][0-9]|[2][0-3]):([0-9]|[0-5][0-9])$/;

	// データモデルマネージャの作成
	var manager = h5.core.data.createManager('ScheduleManager', 'Schedule.scheduleData');

	// スケジュール単体のデータモデル
	// idキー, 件名、詳細、日付、開始時刻、終了時刻、開始～終了(計算項目)
	var scheduleModel = Schedule.scheduleData.scheduleModel = manager.createModel({
		name: 'ScheduleModel',
		schema: {

			// ID 新規作成時にはgetTimeoutの値を使用しています
			id: {
				id: true
			},

			// 予定のタイトル
			subject: {
				type: 'string',
				constraint: {
					notEmpty: true
				}
			},

			// 予定の詳細
			detail: {
				type: 'string'
			},

			// 日付 (yyyy/mm/dd形式)
			date: {
				type: 'string'
			},

			// 開始予定時刻
			from: {
				type: 'string',
				constraint: {
					// 時刻の正規表現
					pattern: TIME_REGEX
				}
			},

			// 終了予定時刻
			to: {
				type: 'string',
				constraint: {
					pattern: TIME_REGEX
				}
			},

			// 開始～終了
			fromTo: {
				depend: {
					on: ['to', 'from'],
					calc: function() {
						var to = this.get('to') || '';
						var from = this.get('from') || '';
						if (!to && !from) {
							return;
						}
						return from + ' ～ ' + to;
					}
				}
			}

		}
	});

	// 日付をキーに複数のスケジュールを持つモデル
	// id(日付。yyyy/m/d形式の文字列)、スケジュール
	var dailySchedulesModel = Schedule.scheduleData.dailySchedulesModel = manager.createModel({
		name: 'DailySchedulesModel',
		schema: {
			date: {
				id: true
			},
			schedules: {
				type: '@ScheduleModel[]',
				constraint: {
					notNull: true
				}
			}
		}
	});

	// scheduleModelにデータが追加、削除、変更されたらdailySchedulesModelに反映させる
	scheduleModel.addEventListener('itemsChange', function(ev) {
		// アップデートセッション開始
		var manager = this.getManager();
		manager.beginUpdate();

		// 登録されたアイテム
		for ( var i = 0, l = ev.created.length; i < l; i++) {
			// 登録されたスケジュールの日付をキーに、スケジュールをDailySchedulesModelに登録する。
			// 既存の日付であれば、追加する。
			var item = ev.created[i];
			if (dailySchedulesModel.has(item.get('date'))) {
				dailySchedulesModel.get(item.get('date')).get('schedules').push(item);
			} else {
				dailySchedulesModel.create({
					date: item.get('date'),
					schedules: [item]
				});
			}
		}

		// 削除されたアイテム
		for ( var i = 0, l = ev.removed.length; i < l; i++) {
			var item = ev.removed[i];
			var date = item.get('date');
			var dailyItems = dailySchedulesModel.get(date);
			var schedules = dailyItems.get('schedules');
			var index = $.inArray(item, schedules);
			if (index !== -1) {
				// 削除された予定を、登録された日から削除
				schedules.splice(index, 1);
				if (schedules.length === 0) {
					// 該当日の予定が一つもないなら、該当日のデータアイテムを削除
					dailySchedulesModel.remove(date);
				}
			}
		}
		manager.endUpdate();
	});

	/**
	 * データのロード
	 *
	 * @memberOf Schedule.common
	 * @returns {Promise}
	 */
	function load() {
		var dfd = h5.async.deferred();

		LOG.info('データをリセットしました。');
		userInfo = {
			readInfoIds: []
		};

		// サンプル用に、現在の月を中心に、当月、先月、次月の予定を作成してデータモデルに登録する
		var date = new Date();
		var curMonth = date.getFullYear() + '/' + (date.getMonth() + 1) + '/';
		var preDate = new Date(date.getFullYear() - (date.getMonth() ? 0 : 1),
				date.getMonth() ? date.getMonth() - 1 : 0);
		var preMonth = preDate.getFullYear() + '/' + (preDate.getMonth() + 1) + '/';
		var nextDate = new Date(new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime() + 24
				* 60 * 60 * 1000);
		var nextMonth = nextDate.getFullYear() + '/' + (nextDate.getMonth() + 1) + '/';

		scheduleModel.create([{
			id: 'dl005',
			date: curMonth + '11',
			subject: '研修資料申請〆切',
			detail: ''
		}, {
			id: 'dl001',
			date: preMonth + '1',
			subject: '交通費清算書提出〆切',
			detail: '書類で提出する場合は、月次会議時に回収します。'
		}, {
			id: 'dl002',
			date: preMonth + '15',
			subject: '研修確定〆切',
			detail: '必ず確定済みになっていることを確認して下さい'
		}, {
			id: 'dl003',
			date: preMonth + '22',
			subject: '技術英語資料〆切',
			detail: ''
		}, {
			id: 'dl004',
			date: curMonth + '1',
			subject: 'A会場予約〆切',
			detail: '電話で予約する'
		}, {
			id: 'dl005',
			date: curMonth + '11',
			subject: '研修資料申請〆切',
			detail: ''
		}, {
			id: 'dl006',
			date: preMonth + '21',
			subject: 'キャリアアップセミナー資料提出〆切',
			detail: ''
		}, {
			id: 'dl007',
			date: preMonth + '21',
			subject: 'ビジネスマナー研修成果報告提出〆切',
			detail: ''
		}, {
			id: 'dl008',
			date: curMonth + '11',
			subject: '８月分研修資料申請〆切',
			detail: ''
		}, {
			id: 'dl009',
			date: curMonth + '13',
			subject: '研修確定〆切',
			detail: '必ず確定済みになっていることを確認して下さい'
		}, {
			id: 'dl010',
			date: curMonth + '2',
			subject: '交通費清算書提出〆切',
			detail: '書類で提出する場合は、月次会議時に回収します。'
		}, {
			id: 'dl011',
			date: curMonth + '1',
			subject: '交通費清算書提出〆切',
			detail: '書類で提出する場合は、月次会議時に回収します。'
		}, {
			id: 'dl012',
			date: nextMonth + '5',
			subject: '交通費清算書提出〆切',
			detail: '書類で提出する場合は、月次会議時に回収します。'
		}, {
			id: 's0530001',
			date: preMonth + '18',
			subject: 'スキルアップ研修',
			detail: ''
		}, {
			id: 's0601002',
			date: preMonth + '1',
			subject: '月次会議',
			from: '16:30',
			to: '18:00',
			detail: '賞与についての説明も行います。必ず参加してください。'
		}, {
			id: 's0602001',
			date: preMonth + '22',
			subject: '研修資料ミーティング',
			from: '15:00',
			to: '17:00',
			detail: '資料を15枚用意'
		}, {
			id: 's0611002',
			date: preMonth + '11',
			subject: '会議',
			from: '13:00',
			to: '15:00',
			detail: ''
		}, {
			id: 's0611003',
			date: preMonth + '11',
			subject: '近代ビジネスモデル勉強会',
			from: '9:00',
			to: '12:00',
			detail: '興味ある方はどなたでもご参加下さい'
		}, {
			id: 's0612001',
			date: preMonth + '12',
			subject: 'BS研修報告会',
			from: '15:00',
			to: '17:30',
			detail: 'BS研修担当者、次期担当者は必ず参加すること'
		}, {
			id: 's0612002',
			date: preMonth + '12',
			subject: '避難訓練',
			from: '13:00',
			to: '14:00',
			detail: ''
		}, {
			id: 's0701001',
			date: curMonth + '2',
			subject: '月次会議',
			from: '9:00',
			to: '11:00',
			detail: ''
		}, {
			id: 's0704001',
			date: curMonth + '4',
			subject: 'ビジネスパーソン基本原則研修',
			from: '9:00',
			to: '11:00',
			detail: ''
		}, {
			id: 's0718002',
			date: curMonth + '19',
			subject: 'ロジカルコミュニケーション研修',
			from: '15:00',
			to: '17:00',
			detail: ''
		}, {
			id: 's0718003',
			date: curMonth + '26',
			subject: 'ロジカルコミュニケーション研修',
			from: '15:00',
			to: '17:00',
			detail: ''
		}, {
			id: 's0718004',
			date: nextMonth + '2',
			subject: 'ロジカルコミュニケーション研修',
			from: '15:00',
			to: '17:00',
			detail: ''
		}, {
			id: 's0711001',
			date: curMonth + '11',
			subject: 'ビジネスマナー研修',
			from: '9:00',
			to: '12:30',
			detail: ''
		}, {
			id: 's0711002',
			date: curMonth + '11',
			subject: 'A社打ち合わせ',
			from: '14:00',
			to: '15:30',
			detail: ''
		}, {
			id: 's0711003',
			date: curMonth + '11',
			subject: '企画ブレスト',
			from: '16:00',
			detail: '先月の議事録に目を通しておくこと'
		}, {
			id: 's0711004',
			date: preMonth + '25',
			subject: 'タレントマネジメントシステム研修',
			from: '13:00',
			to: '17:30',
			detail: ''
		}, {
			id: 's0711005',
			date: preMonth + '26',
			subject: '経営組織診断サーベイ研修',
			from: '10:00',
			to: '17:30',
			detail: ''
		}, {
			id: 's00631001',
			date: preMonth + '9',
			subject: 'コミュニケーションスキル研修',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's00613003',
			date: preMonth + '4',
			subject: 'CS会議',
			from: '13:30',
			to: '17:00',
			detail: ''
		}, {
			id: 's00613004',
			date: preMonth + '5',
			subject: 'CS研修資料作成',
			from: '13:30',
			to: '17:00',
			detail: ''
		}, {
			id: 's00613005',
			date: preMonth + '6',
			subject: 'CS研修資料作成',
			from: '13:30',
			to: '17:00',
			detail: ''
		}, {
			id: 's00611006',
			date: preMonth + '15',
			subject: '社内システム説明会',
			detail: ''
		}, {
			id: 's00611007',
			date: preMonth + '18',
			subject: 'スキルアップ研修',
			detail: ''
		}, {
			id: 's0801002',
			date: nextMonth + '2',
			subject: 'ビジネス研修担当者会議',
			from: '16:30',
			to: '18:00',
			detail: ''
		}, {
			id: 's0803001',
			date: nextMonth + '3',
			subject: 'シニア向け研修担当者会議',
			from: '16:30',
			to: '18:00',
			detail: ''
		}, {
			id: 's00624002',
			date: preMonth + '29',
			subject: '簿記勉強会',
			from: '16:30',
			to: '18:00',
			detail: ''
		}, {
			id: 's00625002',
			date: preMonth + '25',
			subject: 'コミュニケーションスキル研修',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's00631001',
			date: nextMonth + '1',
			subject: 'コミュニケーションスキル研修',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's00613001',
			date: preMonth + '13',
			subject: 'コミュニケーションスキル勉強会',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's00620001',
			date: preMonth + '20',
			subject: 'コミュニケーションスキル勉強会',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's00614001',
			date: preMonth + '8',
			subject: '経営組織診断サーベイ研修',
			from: '10:00',
			to: '12:30',
			detail: ''
		}, {
			id: 's00614003',
			date: preMonth + '28',
			subject: '経営組織診断サーベイ研修',
			from: '10:00',
			to: '12:30',
			detail: ''
		}, {
			id: 's0711006',
			date: curMonth + '16',
			subject: '社内システム説明会',
			detail: ''
		}, {
			id: 's0711007',
			date: curMonth + '17',
			subject: 'スキルアップ研修',
			detail: ''
		}, {
			id: 's0801002',
			date: nextMonth + '2',
			subject: 'ビジネス研修担当者会議',
			from: '16:30',
			to: '18:00',
			detail: ''
		}, {
			id: 's0803001',
			date: nextMonth + '3',
			subject: 'シニア向け研修担当者会議',
			from: '16:30',
			to: '18:00',
			detail: ''
		}, {
			id: 's0723001',
			date: curMonth + '23',
			subject: 'B社打ち合わせ',
			from: '16:30',
			to: '18:00',
			detail: ''
		}, {
			id: 's0724002',
			date: curMonth + '24',
			subject: '簿記勉強会',
			from: '16:30',
			to: '18:00',
			detail: ''
		}, {
			id: 's0725002',
			date: curMonth + '25',
			subject: 'コミュニケーションスキル研修',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's0731001',
			date: nextMonth + '1',
			subject: 'コミュニケーションスキル研修',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's0713001',
			date: curMonth + '13',
			subject: 'コミュニケーションスキル勉強会',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's0720001',
			date: curMonth + '20',
			subject: 'コミュニケーションスキル勉強会',
			from: '9:30',
			to: '12:00',
			detail: ''
		}, {
			id: 's0714002',
			date: curMonth + '21',
			subject: '経営組織診断サーベイ研修',
			from: '10:00',
			to: '12:30',
			detail: ''
		}, {
			id: 's0801001',
			date: nextMonth + '1',
			subject: '月次会議',
			from: '16:30',
			to: '18:00',
			detail: ''
		}]);

		// サンプルなのでここで登録しているが、本来はサーバから取得など、非同期を想定している
		// ここでは擬似的に非同期にするためにsetTimeoutを使っている
		setTimeout(function() {
			dfd.resolve();
		}, 0);
		return dfd.promise();
	}

	/**
	 * ダイアログ表示
	 *
	 * @memberOf Schedule.common
	 * @param {String} content ダイアログの中に表示するhtml文字列
	 * @param {Object} [data] contentにバインドされるデータ
	 */
	function openDialog(content, data) {
		$('#dialog').trigger('openDialog', {
			content: content,
			data: data
		});
	}

	/**
	 * @name Schedule.common
	 * @namespace
	 */
	h5.u.obj.expose('Schedule.common', {
		load: load,
		openDialog: openDialog
	});
});