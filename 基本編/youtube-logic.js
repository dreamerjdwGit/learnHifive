(function($) {
	var URL = 'http://gdata.youtube.com/feeds/api/videos';

	var youtbeLogic = {
		__name: 'youtubeLogic',

	};

	search: function(keyword, startIndex, maxResults) {
		var promise = h5.ajax(URL,{
			dataType: 'jsonp',
			data: {
				'vq': keyword,
				'max-results': maxResults,
				'alt': 'json-in-script',
				'start-index': startIndex
			},
			cache: true
		});
		return promise;
	}

	h5.core.expose(youtubeLogic);
})(jQuery); 

