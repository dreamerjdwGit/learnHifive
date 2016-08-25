$(function() {
	// Scheduleコントローラをバインド
	h5.core.controller('#schedule', Schedule.controller.scheduleController);

	// Detailコントローラをバインド
	h5.core.controller('#detail', Schedule.controller.detailController);

	// Dialogコントローラをバインド
	Schedule.promise.dialogPromise.done(function() {
		// バインド対象要素となるテンプレートのロードを待つ必要がある
		h5.core.controller('#dialog', Schedule.controller.dialogController);
	});
});