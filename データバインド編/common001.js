$(function() {

    var TIME_REGEX = /^$|^([0-9]|[0-1][0-9]|[2][0-3]):([0-9]|[0-5][0-9])$/;
	var manager= h5.core.data.createManager('ScheduleManager', 'Schedule.scheduleData');
	var scheduleModel= Schedule.scheduleData.scheduleModel= manager.createModel({
		name: 'ScheduleModel',
		schema: {
			id: {id: true};
			subject: {type: 'string', constraint: {notEmpty: true}},
			detail: {type: 'string'},
			date: {type: 'string'},
			from: {type: 'string', constraint: {pattern: TIME_REGEX}},
			to: {type: 'string', constraint: {pattern: TIME_REGEX}},
			fromTo: {
				depend: {
					on: ['from', 'to'],
					calc: function() {
						var to= this.get('to') || '';
						var from= this.get('from') || '';
						if(!to && !from) {
							return;
						}
						return from + ' ～ ' + to;
					}
				}
			}

		}
	});

	var dailySchedulesModel= Schedule.scheduleData.dailySchedulesModel= manager.createModel({
		name: 'DailySchedulesModel',
		schema: {
			date: {id: true},
			schedules: {type: '@ScheduleModel[]', constraint: {notNull: true}}
		}
	});

});