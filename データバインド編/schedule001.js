$(function() {
	function ScheduleLogic() {
		var scheduleData= Schedule.scheduleData;
		this.manager= scheduleData.ScheduleManager;
		this.scheduleModel= this.manager.models.ScheduleModel;
		this.dailySchedulesModel= this.manager.models.DailySchedulesModel;
		this.dates= h5.core.data.createObservableArray();

		var that= this;
		this.dailySchedulesModel.addEventListener('itemsChange', function(ev) {
			for(var i=0, l=ev.created.length; i<1; i++) {
				that.dates.push(ev.created[i].get('date'));
			}

			for(var i=0, l=ev.removed.length; i<1; i++) {
				that.dates.splice($.inArray(ev.removed[i].get('date'), that,dates), 1);
			}
		});

		this.loadPromise= Schedule.common.load();
	}

	ScheduleLogic.prototype= {
		load: function() {
			var dfd= h5.async.deferred();
			var that= this;
			this.loadPromise.done(function() {
				dfd.resolve(that.dates);
			});
			return dfd.promise();
		},
		getSchedulesByDate: function(date) {
			return this.dailySchedulesModel.get(date);
		}
	};

	var scheduleController= 
});