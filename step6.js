$(function(){

	var calcLogic = {
		__name: 'CalcLogic',

		add: function(left,right) {
			return left + right;
		}
	};

	var showTimeLogic = {
		__name: 'ShowTime',
		dateFormat: '{0}年{1}月{2}日',
		getCurrent: function(time) {
			var year = time.getFullYear();
			var month = time.getMonth() + 1;
			var day = time.getDate();
			var x= this._format(year,month,day);
			return x;
		},
		_format: function(year,month,day) {
			return h5.u.str.format(this.dateFormat, year, month, day);
		}

	}

	var controller = {
		__name: 'CalcController',
		calcLogic: calcLogic,
		showTimeLogic: showTimeLogic,
		'#calc click': function() {
			var left = this.$find("#left").val();
			left  = parseInt(left);
			if(isNaN(left)) {
				return;
			}

			var right = this.$find("#right").val();
			right = parseInt(right);
			if(isNaN(right)) {
				return;
			}

			var ret = this.calcLogic.add(left, right);
			this.$find('#result').html(ret);

			var current = this.showTimeLogic.getCurrent(new Date());
			this.$find('#result2').html(current);
		}
	};

	h5.core.controller('#container', controller);
});