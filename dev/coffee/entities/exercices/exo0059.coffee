define ["utils/math","utils/help", "utils/colors", "utils/tab"], (mM, help, colors, TabSignApi) ->

	return {
		init: (inputs) ->
			["test"]

		getBriques: (inputs, options) ->
			[message] = @init(inputs)

			[
				{
					bareme:100
					items:[
						{
							type:"text"
							ps:[
								"Mon text de test."
							]
						}
						{
							type: "add-input"
							text: "Ensemble solution."
							name: "pwet"
						}
						{
							type: "validation"
						}
					]
					validations:{
					}
					verifications:[
					]
				}
			]


	}
