$(function(){
	var helloWorldController = {
		__name: 'helloWorldController',

		'#btn click': function() {
			alert('Hello, World!');
		}
	};

	h5.core.controller('#container', helloWorldController);
});