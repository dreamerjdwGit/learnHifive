$(function(){
	var youtubeController = {
		__name: 'youtubeController',
		_keyword: '',
		'#search submit': function(context, $el) {
			context.event.preventDefault();
			var keywordInput= this.$find('#keyword');
			this._keyword = keywordInput.val();
			if (!this._keyword || $.trim(this._keyword).length===0) {
				return;
			}
			alert(this._keyword);
		}
	};
	h5.core.controller('.container', youtubeController);
});
