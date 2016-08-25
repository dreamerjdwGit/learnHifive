$(document).bind('h5preinit', function() {
	var aspect = {
		target: 'helloWorldController',
		interceptors: h5.core.interceptor.lapInterceptor,
		pointCut: '#btn click'
	};

	h5.settings.aspects = [aspect];
});