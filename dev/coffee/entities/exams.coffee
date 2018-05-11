define ["entities/exam"], (Exam)->

	ExamsCollection = Backbone.Collection.extend {
		url: "api/exams"
		model: Exam
	}

	return ExamsCollection
