define(["backbone.radio", "entities/exercices/exercices_catalog", "utils/math"], function(Radio, Catalog, mM) {
  var API, BListe, BPlain, BriquesCollection, Exo, channel, formatListeItem;
  Exo = Backbone.Model.extend({
    defaults: {
      title: "Titre de l'exercice",
      description: "Description de l'exercice",
      keywords: ""
    },
    go: function() {
      var b, briques, i, len;
      briques = this.get("briquesCollection").models;
      for (i = 0, len = briques.length; i < len; i++) {
        b = briques[i];
        if (!b.go()) {
          b.set("focused", true);
          return false;
        }
      }
      return true;
    }
  });
  formatListeItem = function(item) {
    var output, ref, ref1, ref2, ref3;
    output = {
      name: item.name,
      description: (ref = item.description) != null ? ref : "",
      tag: (ref1 = item.tag) != null ? ref1 : false,
      text: (ref2 = item.text) != null ? ref2 : false,
      answerPreprocess: (ref3 = item.answerPreprocess) != null ? ref3 : false,
      answer: false
    };

    /*
    
    		output.verifParams = {
    			arrondi : item.arrondi ? false
    			formes : item.formes ? null
    			custom: if typeof item.customVerif is "function" then item.customVerif else null
    			tolerance : item.tolerance ? false
    		}
    
    		output.templateParams = {
    			name:item.name					# nécessaire pour les inputs
    			arrondi:item.arrondi ? false	# Si on demande un arrondi, on précise ici une puissance (-2 pour 0.01 par ex.)
    			cor_prefix:item.cor_prefix ? ""	# Permet d'ajouter un préfixe à la valeur correction. Différent de goodTex car permet de préfixer également le userTex
    
    			custom: if typeof item.customTemplate is "function" then item.customTemplate else () -> false
    		}
    
    
    		output.parseParams = {
    			type:item.type ? ""
    			developp:item.developp is true
    			toLowerCase:item.toLowerCase is true
    			alias : item.alias ? false
    		}
    
    		if typeof item.moduloKey is "string" then output.moduloKey = item.moduloKey
    		else output.moduloKey = false
    		fct_go = (answers) ->
    			user = answers[@name]
    			switch
    				when (typeof user isnt "string")
    					 * Dans ce cas, le champ n'est pas invalide car il n'a rien reçu
    					@templateParams.invalid = false
    					false
    				when user is "∅"
    					@templateParams.user = "∅"
    					@info = []
    					@templateParams.invalid = false
    					true
    				else
    					@templateParams.user = user
    					if @moduloKey then user = user.replace(new RegExp(@moduloKey,"g"), "#")
    					users = ( mM.p.userAnswer(str, @parseParams) for str in user.split ";" when str.trim() isnt "")
    					@info = (usItem for usItem in users when usItem.valid is true)
    					@templateParams.invalid = (users.length>@info.length) or (users.length is 0)
    					if (@templateParams.invalid) then @templateParams.parseMessages = "Vérifiez : #{ (infoItem.expression for infoItem in users when infoItem.valid is false).join(' ; ') }"
    					not(@templateParams.invalid)
    
    		fct_verif = ->
    			 * fonction servant pour les équations et les solutions
    			 * Si l'utilisateur a répondu ensemble vide...
    			if @info.length is 0
    				@templateParams[key] = value for key, value of {
    					users:false
    					goods:null
    					bads:null
    					lefts: (l.tex() for l in @solutions).join(" ; ")
    					goodIsEmpty:@solutions.length is 0
    				}
    				if @solutions.length is 0 then 1 else 0
    			else
    				 * On considère que l'on a une série de valeurs
    				N = Math.max @solutions.length, @info.length
    				sorted = mM.tri @info, @solutions
    				list=[]
    				goods = []
    				bads = []
    				for sol,i in sorted.closests
    					list.push sol.user.tex()
    					if sol.good?
    						verif = mM.verif[@parseParams.type](sol.info, sol.good, @verifParams)
    						if verif.ok
    							verif.userTex = sol.info.tex
    							verif.goodTex = sol.good.tex()
    							goods.push verif
    						else
    							bads.push sol.info.tex
    							sorted.lefts.push sol.good
    					else bads.push sol.info.tex
    				@templateParams[key] = value for key, value of {
    					users:list.join(" ; ")
    					goods:goods
    					bads:bads.join(" ; ")
    					lefts:(l.tex() for l in sorted.lefts).join(" ; ")
    					goodIsEmpty:@solutions.length is 0
    				}
    				goods.length/N
    
    		switch
    			when item.solutions?
    				output.templateParams.corTemplateName = "cor_solutions"
    				unless output.templateParams.text? then output.templateParams.text = "Donnez les solutions séparées par ; ou $\\varnothing$ s'il n'y en a pas"
    				output.solutions = ( mM.toNumber(it) for it in item.solutions )
    				output.parseParams.type = "number"
    				output.go = fct_go
    				output.verif = ->fct_verif
    			when item.equations?
    				output.templateParams.corTemplateName = "cor_solutions"
    				unless output.templateParams.text? then output.templateParams.text = "Donnez les solutions séparées par ; ou $\\varnothing$ s'il n'y en a pas"
    				output.solutions = item.equations
    				output.parseParams.type = "equation"
    				@go = fct_go
    				@verif = fct_verif
    			else # par défaut, ce sera un item avec good
    				goodArray = null
    				goodValue = null
    				switch
    					when Array.isArray(item.good)
    						switch item.good.length
    							when 0 then goodValue = 0
    							when 1 then goodValue = item.good[0]
    							else
    								goodArray = item.good
    								goodValue  = item.good[0]
    					when typeof item.good is "undefined" then goodValue = 0
    					else goodValue = item.good
    				output.parseParams = mM.p.type goodValue, output.parseParams
    				if goodArray isnt null
    					if (output.parseParams.type is "number") then output.good = ( mM.toNumber(it) for it in goodArray )
    					else output.good = goodArray
    				else
    					if (output.parseParams.type is "number") then output.good = mM.toNumber(goodValue)
    					else output.good = goodValue
    				output.templateParams.corTemplateName = "cor_number"
    				if typeof item.goodTex is "string" then output.templateParams.goodTex = item.goodTex
    				else output.templateParams.goodTex = output.good.tex()
    				output.go = (answers) ->
    					user = answers[@name]
    					if (typeof user isnt "string")
    						 * Dans ce cas, le champ n'est pas invalide car il n'a rien reçu
    						@templateParams.invalid = false
    						false
    					else
    						@templateParams.user = user
    						@info = mM.p.userAnswer user, @parseParams
    						@templateParams.userTex = @info.tex
    						@templateParams.invalid = not(@info.valid)
    						@templateParams.parseMessages = @info.messages.join(" ; ")
    						@info.valid
    				output.verif = () ->
    					if isArray(@good)
    						verif_result = ( mM.verif[@parseParams.type](@info, it,@verifParams) for it in @good)
    						verif_result.sort (a,b) ->
    							if b.ponderation>a.ponderation then -1
    							else 1
    						verif_result = verif_result.pop()
    					else verif_result = mM.verif[@parseParams.type](@info, @good,@verifParams)
    					@templateParams.customItems = @templateParams.custom(verif_result)
    					@templateParams[key] = value for key,value of verif_result
    					verif_result.ponderation
     */
    return output;
  };
  BPlain = Backbone.Model.extend({
    parse: function(data) {
      if (typeof data.title !== "string") {
        data.title = false;
      }
      data.focused = false;
      data.done = true;
      return data;
    },
    go: function() {
      return true;
    },
    validation: function() {
      return false;
    }
  });
  BListe = Backbone.Model.extend({
    parse: function(data) {
      var it, items;
      if (!(Array.isArray(data.aide))) {
        data.aide = false;
      }
      if (typeof data.title !== "string") {
        data.title = false;
      }
      if (data.liste != null) {
        items = (function() {
          var i, len, ref, results;
          ref = data.liste;
          results = [];
          for (i = 0, len = ref.length; i < len; i++) {
            it = ref[i];
            results.push(formatListeItem(it));
          }
          return results;
        })();
        data.liste = items;
      }
      data.focused = false;
      data.done = false;
      return data;
    },
    validation: function(data) {
      var error, error_found, errors, i, info, it, j, len, len1, liste, name, processed, ref, ref1, userValue, validated_data, waited;
      liste = this.get("liste");
      if (_.isEmpty(liste)) {
        return false;
      }
      errors = {};
      data = data != null ? data : {};
      validated_data = {};
      for (i = 0, len = liste.length; i < len; i++) {
        it = liste[i];
        name = it.name;
        waited = it.waited;
        if (data[name] != null) {
          userValue = data[name];
          if (userValue === "") {
            errors[name] = "Ne doit pas être vide";
          } else {
            error_found = false;
            if (it.answerPreprocess !== false) {
              ref = it.answerPreprocess(userValue), processed = ref.processed, error = ref.error;
              if (error === false) {
                userValue = processed;
              } else {
                error_found = true;
                errors[name] = error;
              }
            }
            if (error_found === false) {
              ref1 = mM.p.validate(userValue, waited), info = ref1.info, error = ref1.error;
              if (error === false) {
                validated_data[name] = info;
              } else {
                errors[name] = error;
              }
            }
          }
        } else {
          errors[name] = "Indéfini";
        }
      }
      if (_.isEmpty(errors)) {
        for (j = 0, len1 = liste.length; j < len1; j++) {
          it = liste[j];
          it.answer = validated_data[it.name];
        }
        return false;
      }
      return errors;
    },
    go: function() {
      var it, liste, ok;
      if (!this.get("done")) {
        liste = this.get("liste");
        ok = true;
        if (((function() {
          var i, len, results;
          results = [];
          for (i = 0, len = liste.length; i < len; i++) {
            it = liste[i];
            if (it.answer === false) {
              results.push(it);
            }
          }
          return results;
        })()).length === 0) {
          this.set("done", true);
          this.set("focused", false);
        }
      }
      return this.get("done");
    }
  });
  BriquesCollection = Backbone.Collection.extend({
    model: function(data) {
      switch (data.type) {
        case "liste":
          return new BListe(data, {
            parse: true
          });
        default:
          return new BPlain(data, {
            parse: true
          });
      }
    }
  });
  API = {
    getEntity: function(id, data) {
      var defer, exo, failedCB, filename, inputs, itemData, options, promise, ref, ref1, successCB;
      inputs = (ref = data != null ? data.inputs : void 0) != null ? ref : {};
      options = (ref1 = data != null ? data.options : void 0) != null ? ref1 : {};
      itemData = Catalog.get(id);
      defer = $.Deferred();
      if (itemData != null) {
        filename = itemData.filename;
        exo = new Exo(itemData);
        successCB = function(exoController) {
          var collection, exoData;
          exoData = exoController.init(inputs, options);
          collection = new BriquesCollection(exoData.briques);
          collection.parent = exo;
          exo.set("briquesCollection", collection);
          exo.set("inputs", inputs);
          exo.set("options", options);
          exo.go();
          return defer.resolve(exo);
        };
        failedCB = function() {
          return defer.reject();
        };
        require(["entities/exercices/" + filename], successCB, failedCB);
      } else {
        defer.reject();
      }
      promise = defer.promise();
      return promise;
    }
  };
  channel = Radio.channel('exercices');
  channel.reply('exercice:entity', API.getEntity);
  return null;
});
