define(["entities/exam"], function(Exam){

	var ExamsCollection = Backbone.Collection.extend({
		url: "api/exams",
		model: Exam,
	});


	return ExamsCollection;
});
