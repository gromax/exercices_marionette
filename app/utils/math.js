(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  define([], function() {
    var Collection, ComplexeNumber, DECIMAL_MAX_PRECISION, DECIMAL_SEPARATOR, Droite2D, ERROR_MIN, Ensemble, EnsembleObject, FloatNumber, FunctionNumber, InftyNumber, Intersection, MObject, Monome, MultiplyNumber, NumberObject, ParseInfo, ParseManager, PlusNumber, Polynome, PolynomeMaker, PowerNumber, Proba, RadicalNumber, RationalNumber, RealNumber, SOLVE_MAX_PRECISION, SimpleNumber, Suite, SymbolManager, TokenFunction, TokenNumber, TokenObject, TokenOperator, TokenParenthesis, TokenVariable, Trigo, Union, Vector, arrayIntersect, erreurManager, extractSquarePart, fixNumber, grecques, in_array, isArray, isInfty, isInteger, mM, mergeObj, numToStr, signatures_comparaison, union_arrays;
    grecques = ["alpha", "beta", "delta", "psi", "pi", "theta", "phi", "xi", "rho", "epsilon", "omega", "nu", "mu", "gamma", "Alpha", "Beta", "Delta", "Psi", "Pi", "Theta", "Phi", "Xi", "Rho", "Epsilon", "Omega", "Nu", "Mu", "Gamma"];
    DECIMAL_SEPARATOR = ',';
    DECIMAL_MAX_PRECISION = 10;
    SOLVE_MAX_PRECISION = 12;
    ERROR_MIN = 0.000000000001;
    isInteger = function(number) {
      if ((typeof number === "number") && (number === Math.round(number))) {
        return true;
      }
      return false;
    };
    isInfty = function(number) {
      if ((typeof number === "number") && ((number === Number.POSITIVE_INFINITY) || (number === Number.NEGATIVE_INFINITY))) {
        return true;
      }
      return false;
    };
    signatures_comparaison = function(a, b, order) {
      var a_s, b_s;
      if (order == null) {
        order = 1;
      }
      a_s = a.signature();
      b_s = b.signature();
      if (a_s === "1") {
        return -order;
      }
      if (b_s === "N/A") {
        return -order;
      }
      if (b_s === "1") {
        return order;
      }
      if (a_s === "N/A") {
        return order;
      }
      if (a_s >= b_s) {
        return order;
      }
      return -order;
    };
    in_array = function(_item, _array) {
      var aa, item, len;
      for (aa = 0, len = _array.length; aa < len; aa++) {
        item = _array[aa];
        if (item === _item) {
          return true;
        }
      }
      return false;
    };
    isArray = function(value) {
      return value && typeof value === 'object' && value instanceof Array && typeof value.length === 'number' && typeof value.splice === 'function' && !(value.propertyIsEnumerable('length'));
    };
    mergeObj = function(objectA, objectB) {
      var i, key, o, obj, out, val;
      if (isArray(objectA)) {
        out = {};
        while (obj = objectA.shift()) {
          if ((typeof obj === "object") && (obj !== null)) {
            for (key in obj) {
              val = obj[key];
              out[key] = val;
            }
          }
        }
        return out;
      } else {
        if ((typeof objectA !== "object") || (objectB === null)) {
          objectA = {};
        }
        if ((typeof objectB !== "object") || (objectB === null)) {
          return objectA;
        }
        for (key in objectB) {
          val = objectB[key];
          objectA[key] = val;
        }
        if (arguments.length > 2) {
          i = 2;
          while (i < arguments.length) {
            o = arguments[i];
            if ((typeof o === "object") && (o !== null)) {
              for (key in o) {
                val = o[key];
                objectA[key] = val;
              }
            }
            i++;
          }
        }
        return objectA;
      }
    };
    arrayIntersect = function(a, b) {
      var ai, bi, result;
      ai = 0;
      bi = 0;
      result = [];
      while ((ai < a.length) && (bi < b.length)) {
        if (a[ai] < b[bi]) {
          ai++;
        } else if (a[ai] > b[bi]) {
          bi++;
        } else {
          result.push(a[ai]);
          ai++;
          bi++;
        }
      }
      return result;
    };
    extractSquarePart = function(value) {
      var extract, i, j;
      if (value instanceof NumberObject) {
        value = value.floatify().float();
      }
      if (!isInteger(value)) {
        return 1;
      }
      if (value === 0) {
        return 0;
      }
      value = Math.abs(value);
      extract = 1;
      while (value % 4 === 0) {
        extract *= 2;
        value /= 4;
      }
      i = 3;
      j = 9;
      while (j <= value) {
        while (value % j === 0) {
          value /= j;
          extract *= i;
        }
        j += 4 * i + 4;
        i += 2;
      }
      return extract;
    };
    fixNumber = function(num, decimals) {
      return Number(num.toFixed(decimals));
    };
    union_arrays = function(x, y) {
      var aa, ab, it, key, len, len1, obj, results;
      obj = {};
      for (aa = 0, len = x.length; aa < len; aa++) {
        it = x[aa];
        obj[it] = it;
      }
      for (ab = 0, len1 = y.length; ab < len1; ab++) {
        it = y[ab];
        obj[it] = it;
      }
      results = [];
      for (key in obj) {
        results.push(obj[key]);
      }
      return results;
    };
    numToStr = function(num, decimals) {
      var out;
      if (decimals != null) {
        out = num.toFixed(decimals);
      } else {
        out = String(num);
      }
      return out.replace('.', ",");
    };
    SymbolManager = (function() {
      function SymbolManager() {}

      SymbolManager.symbolsValueList = {};

      SymbolManager.alias = false;

      SymbolManager.setAlias = function(alias) {
        if ((typeof alias !== "object") || (alias === null)) {
          return this.alias = false;
        } else {
          return this.alias = alias;
        }
      };

      SymbolManager.checkAlias = function(name) {
        var key, ref, value;
        if (this.alias === false) {
          return false;
        }
        ref = this.alias;
        for (key in ref) {
          value = ref[key];
          if (indexOf.call(value, name) >= 0) {
            return key;
          }
        }
        return false;
      };

      SymbolManager.makeSymbol = function(name) {
        var a, s;
        a = name;
        if ((s = SymbolManager.checkAlias(name)) !== false) {
          name = s;
        }
        switch (false) {
          case name !== "ℝ":
            return (new Ensemble()).inverse();
          case !((name === "π") || (name === "pi")):
            return this.pi();
          case name !== "∅":
            return new Ensemble();
          case !((name === "∞") || (name === "infini")):
            return new InftyNumber();
          case name !== "i":
            return new ComplexeNumber(0, 1);
          case name !== "":
            return new RealNumber();
          default:
            return new Monome(1, {
              name: name,
              power: 1
            });
        }
      };

      SymbolManager.pi = function() {
        return new Monome(1, {
          name: "pi",
          power: 1
        });
      };

      SymbolManager.setSymbolsValue = function(symbols) {
        var key, results, value;
        results = [];
        for (key in symbols) {
          value = symbols[key];
          switch (false) {
            case typeof value !== "number":
              results.push(this.symbolsValueList[key] = new RealNumber(value));
              break;
            case !((value instanceof NumberObject) && (value.isFunctionOf().length === 0)):
              results.push(this.symbolsValueList[key] = value);
              break;
            default:
              results.push(this.symbolsValueList[key] = new RealNumber());
          }
        }
        return results;
      };

      SymbolManager.getSymbolValue = function(symbolName, symbols) {
        var v1, v2;
        v1 = symbols != null ? symbols[symbolName] : void 0;
        v2 = this.symbolsValueList[symbolName];
        switch (false) {
          case symbolName !== "e":
            return new RealNumber(Math.E);
          case symbolName !== "pi":
            return new RealNumber(Math.PI);
          case typeof v1 !== "number":
            return new RealNumber(v1);
          case !((v1 instanceof NumberObject) && !(v1.isFunctionOf(symbolName))):
            return v1;
          case typeof v2 !== "number":
            return new RealNumber(v2);
          case !((v2 instanceof NumberObject) && !(v2.isFunctionOf(symbolName))):
            return v2;
          default:
            return new RealNumber();
        }
      };

      return SymbolManager;

    })();
    MObject = (function() {
      function MObject() {}

      MObject.prototype.simplify = function(infos) {
        if (infos == null) {
          infos = null;
        }
        return this;
      };

      MObject.prototype.toString = function() {
        return "?";
      };

      MObject.prototype.tex = function() {
        return "?";
      };

      MObject.prototype.toClone = function() {
        return new MObject();
      };

      MObject.prototype.getPolynomeFactors = function(variable) {
        return null;
      };

      MObject.prototype.developp = function(infos) {
        if (infos == null) {
          infos = null;
        }
        return this;
      };

      MObject.prototype.derivate = function(variable) {
        return new MObject();
      };

      return MObject;

    })();
    NumberObject = (function(superClass) {
      extend(NumberObject, superClass);

      function NumberObject() {
        return NumberObject.__super__.constructor.apply(this, arguments);
      }

      NumberObject.prototype._plus = true;

      NumberObject.prototype.setPlus = function(plus) {
        this._plus = plus;
        return this;
      };

      NumberObject.prototype.signe = function() {
        if (this._plus) {
          return 1;
        } else {
          return -1;
        }
      };

      NumberObject.prototype.toString = function() {
        var composite, out;
        composite = this.compositeString({
          tex: false
        });
        if (composite[1]) {
          out = composite[0];
        } else {
          out = "-" + composite[0];
        }
        return out;
      };

      NumberObject.prototype.tex = function(config) {
        var composite, options, out;
        options = mergeObj({
          tex: true
        }, config);
        composite = this.compositeString(options);
        if (composite[1]) {
          out = composite[0];
        } else {
          out = "-" + composite[0];
        }
        return out;
      };

      NumberObject.prototype.compositeString = function(options) {
        return ["?", this._plus, false, false];
      };

      NumberObject.prototype.simplify = function(infos, developp, memeDeno) {
        if (infos == null) {
          infos = null;
        }
        if (developp == null) {
          developp = false;
        }
        if (memeDeno == null) {
          memeDeno = false;
        }
        return new RealNumber();
      };

      NumberObject.prototype.add = function(operand, infos) {
        if (infos == null) {
          infos = null;
        }
        return this.am(operand, false, infos);
      };

      NumberObject.prototype.minus = function(operand, infos) {
        if (infos == null) {
          infos = null;
        }
        return this.am(operand, true, infos);
      };

      NumberObject.prototype.am = function(operand, minus, infos) {
        var op;
        if (infos == null) {
          infos = null;
        }
        if (operand.isNul()) {
          return this;
        }
        op = operand.toClone();
        if (minus) {
          op.opposite();
        }
        if (this.isNul()) {
          return op;
        }
        return new PlusNumber(this, op);
      };

      NumberObject.prototype.opposite = function() {
        this._plus = !this._plus;
        return this;
      };

      NumberObject.prototype.mult = function(operand, infos) {
        if (infos == null) {
          infos = null;
        }
        return this.md(operand, false, infos);
      };

      NumberObject.prototype.divide = function(operand, infos) {
        if (infos == null) {
          infos = null;
        }
        return this.md(operand, true, infos);
      };

      NumberObject.prototype.md = function(operand, divide, infos) {
        var inverse, op;
        if (infos == null) {
          infos = null;
        }
        if (this.isNul()) {
          return new RealNumber(0);
        }
        if (operand.isNul()) {
          if (divide) {
            return new RealNumber();
          } else {
            return new RealNumber(0);
          }
        }
        op = operand.toClone();
        if (divide) {
          if (typeof (inverse = op.inverse()) !== "undefined") {
            return new MultiplyNumber(this, inverse);
          } else {
            return (new MultiplyNumber(this)).pushDenominator(op);
          }
        }
        return new MultiplyNumber(this, op);
      };

      NumberObject.prototype.inverse = function() {
        return void 0;
      };

      NumberObject.prototype.puissance = function(exposant) {
        var aa, i, output, ref;
        if (exposant instanceof NumberObject) {
          exposant = exposant.floatify().float();
        }
        if (!isInteger(exposant)) {
          return new RealNumber();
        }
        if (exposant === 0) {
          return new RealNumber(1);
        }
        if (exposant > 10) {
          return new RealNumber();
        }
        output = new RealNumber(1);
        for (i = aa = 1, ref = Math.abs(exposant); 1 <= ref ? aa <= ref : aa >= ref; i = 1 <= ref ? ++aa : --aa) {
          output = output.md(this, false);
        }
        if (exposant < 0) {
          return (new RealNumber(1)).md(output, true);
        } else {
          return output;
        }
      };

      NumberObject.prototype.floatify = function(symbols) {
        return new RealNumber();
      };

      NumberObject.prototype.float = function() {
        return NaN;
      };

      NumberObject.prototype.isFunctionOf = function(symbol) {
        if (typeof symbol === "string") {
          return false;
        } else {
          return [];
        }
      };

      NumberObject.prototype.degre = function(variable) {
        return 0;
      };

      NumberObject.prototype.toClone = function() {
        var clone;
        clone = new NumberObject();
        return clone.setPlus(this._plus);
      };

      NumberObject.prototype.isNul = function(symbols) {
        return this.floatify(symbols).isNul();
      };

      NumberObject.prototype.isPositive = function(symbols) {
        return this.floatify(symbols).isPositive();
      };

      NumberObject.prototype.isNegative = function(symbols) {
        return this.floatify(symbols).isNegative();
      };

      NumberObject.prototype.isOne = function(facto) {
        if (facto == null) {
          facto = 1;
        }
        return this.float() === facto;
      };

      NumberObject.prototype.isNaN = function() {
        return true;
      };

      NumberObject.prototype.isInteger = function() {
        return void 0;
      };

      NumberObject.prototype.isFloat = function() {
        return void 0;
      };

      NumberObject.prototype.isReal = function(symbols) {
        return this.floatify(symbols).isReal();
      };

      NumberObject.prototype.isImag = function(symbols) {
        return this.floatify(symbols).isImag();
      };

      NumberObject.prototype.getReal = function() {
        return new RealNumber();
      };

      NumberObject.prototype.getImag = function() {
        return new RealNumber();
      };

      NumberObject.prototype.conjugue = function() {
        return this;
      };

      NumberObject.prototype.assignValueToSymbol = function(liste) {
        var key, value;
        for (key in liste) {
          value = liste[key];
          switch (false) {
            case typeof value !== "number":
              liste[key] = new RealNumber(value);
              break;
            case !((value instanceof NumberObject) && (value.isFunctionOf().length > 0)):
              liste[key] = new RealNumber();
          }
        }
        return this._childAssignValueToSymbol(liste);
      };

      NumberObject.prototype._childAssignValueToSymbol = function(liste) {
        return this;
      };

      NumberObject.prototype.signature = function() {
        return "N/A";
      };

      NumberObject.prototype.extractFactor = function() {
        if (this._plus) {
          return new RealNumber(1);
        }
        this._plus = true;
        return new RealNumber(-1);
      };

      NumberObject.prototype.order = function(normal) {
        if (normal == null) {
          normal = true;
        }
        return this;
      };

      NumberObject.prototype.derivate = function(variable) {
        if (this.isFunctionOf(variable)) {
          return new RealNumber();
        } else {
          return new RealNumber(0);
        }
      };

      NumberObject.prototype.applyFunction = function(functionName) {
        return FunctionNumber.make(functionName, this);
      };

      NumberObject.prototype.compare = function(b, symbols) {
        var ecart;
        ecart = this.toClone().am(b, true);
        switch (false) {
          case !ecart.isNul(symbols):
            return 0;
          case !ecart.isPositive(symbols):
            return 1;
          case !ecart.isNegative(symbols):
            return -1;
          default:
            return false;
        }
      };

      NumberObject.prototype.distance = function(b, symbols) {
        var d;
        if (!(b instanceof NumberObject)) {
          return NaN;
        }
        d = this.toClone().am(b, true).floatify(symbols).abs().float();
        if (d < ERROR_MIN) {
          d = 0;
        }
        return d;
      };

      NumberObject.prototype.equals = function(b, symbols) {
        return this.floatify(symbols).am(b.floatify(symbols), true).isNul();
      };

      NumberObject.prototype.facto = function(regex) {
        return null;
      };

      NumberObject.prototype.replace = function(replacement, needle) {
        return this.toClone();
      };

      NumberObject.prototype.getNumDen = function() {
        return [this, new RealNumber(1)];
      };

      return NumberObject;

    })(MObject);
    PlusNumber = (function(superClass) {
      extend(PlusNumber, superClass);

      function PlusNumber() {
        var aa, ab, len, len1, operand, ref, sous_operand;
        this.operands = [];
        for (aa = 0, len = arguments.length; aa < len; aa++) {
          operand = arguments[aa];
          if (operand instanceof PlusNumber && operand._plus) {
            ref = operand.operands;
            for (ab = 0, len1 = ref.length; ab < len1; ab++) {
              sous_operand = ref[ab];
              this.operands.push(sous_operand);
            }
          } else {
            if (operand instanceof NumberObject) {
              this.operands.push(operand);
            }
          }
        }
      }

      PlusNumber.makePlus = function(ops) {
        if (ops.length === 0) {
          return new RealNumber(0);
        }
        if (ops.length === 1) {
          return ops[0];
        }
        if ((ops.length === 2) && ops[1].isImag() && ops[0].isReal()) {
          return ops[0].am(ops[1], false);
        }
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(PlusNumber, ops, function(){});
      };

      PlusNumber.prototype.compositeString = function(options) {
        var aa, cs, cs_start, len, n, oper, ref, str;
        n = this.operands.length;
        if (n === 0) {
          return ['0', true, false, false];
        }
        cs_start = this.operands[0].compositeString(options);
        if (n === 1) {
          cs_start[1] = cs_start[1] === this._plus;
          return cs_start;
        }
        str = cs_start[0];
        ref = this.operands.slice(1, +n + 1 || 9e9);
        for (aa = 0, len = ref.length; aa < len; aa++) {
          oper = ref[aa];
          cs = oper.compositeString(options);
          if (cs[1]) {
            str += "+" + cs[0];
          } else {
            str += "-" + cs[0];
          }
        }
        if (this._plus) {
          return [str, cs_start[1], true, false];
        }
        if (!cs_start[1]) {
          str = '-' + str;
        }
        if (options.tex) {
          str = "\\left(" + str + "\\right)";
        } else {
          str = "(" + str + ")";
        }
        return [str, false, false, false];
      };

      PlusNumber.prototype.simplify = function(infos, developp, memeDeno) {
        var aa, ab, den, dens, i, j, len, num, op, operand, out, ref, ref1, ref2, sign_i, sign_j;
        if (infos == null) {
          infos = null;
        }
        if (developp == null) {
          developp = false;
        }
        if (memeDeno == null) {
          memeDeno = false;
        }
        ref = this.operands;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          operand = ref[i];
          if (!this._plus) {
            operand.opposite();
          }
          this.operands[i] = operand.simplify(infos, developp, memeDeno);
        }
        this._plus = true;
        this.absorb_sousAdd();
        i = 0;
        while (i < this.operands.length) {
          sign_i = this.operands[i].signature();
          if (sign_i !== "N/A") {
            j = i + 1;
            while (j < this.operands.length) {
              sign_j = this.operands[j].signature();
              if (sign_i === sign_j) {
                if (sign_i === "1") {
                  this.operands[i] = this.operands[i].amSimple(this.operands[j], false, infos);
                } else {
                  this.operands[i] = this.operands[i].md(this.operands[i].extractFactor().amSimple(this.operands[j].extractFactor(), false), false);
                  if (infos != null) {
                    infos.set("ADD_REGROUPEMENT");
                  }
                }
                this.operands.splice(j, 1);
              } else {
                j++;
              }
            }
          }
          if (this.operands[i].isNul()) {
            this.operands.splice(i, 1);
          } else {
            i++;
          }
        }
        if ((memeDeno === true) && (this.operands.length > 1)) {
          dens = new RealNumber(1);
          for (i = ab = 0, ref1 = this.operands.length - 1; 0 <= ref1 ? ab <= ref1 : ab >= ref1; i = 0 <= ref1 ? ++ab : --ab) {
            ref2 = this.operands.shift().getNumDen(), num = ref2[0], den = ref2[1];
            this.operands = (function() {
              var ac, len1, ref3, results;
              ref3 = this.operands;
              results = [];
              for (ac = 0, len1 = ref3.length; ac < len1; ac++) {
                op = ref3[ac];
                results.push(op.md(den, false).simplify());
              }
              return results;
            }).call(this);
            this.operands.push(num);
            dens = dens.md(den, false);
          }
          dens = dens.simplify();
          out = this.developp().simplify(null, false, false);
          if ((dens instanceof RealNumber) && (dens.isOne())) {
            return out;
          } else {
            return out.md(dens, true);
          }
        }
        if (this.operands.length === 0) {
          return new RealNumber(0);
        }
        if (this.operands.length === 1) {
          return this.operands[0];
        }
        return this;
      };

      PlusNumber.prototype.am = function(operand, minus, infos) {
        if (infos == null) {
          infos = null;
        }
        if (minus) {
          this.operands.push(operand.toClone().opposite());
        } else {
          this.operands.push(operand.toClone());
        }
        return this;
      };

      PlusNumber.prototype.opposite = function() {
        this._plus = !this._plus;
        return this;
      };

      PlusNumber.prototype.order = function(normal) {
        var aa, len, op, ref;
        if (normal == null) {
          normal = true;
        }
        ref = this.operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          op = ref[aa];
          op.order(normal);
        }
        if (normal) {
          this.operands.sort(function(a, b) {
            return signatures_comparaison(a, b, 1);
          });
        } else {
          this.operands.sort(function(a, b) {
            return signatures_comparaison(a, b, -1);
          });
        }
        return this;
      };

      PlusNumber.prototype.floatify = function(symbols) {
        var aa, len, operand, ref, total;
        total = new RealNumber(0);
        ref = this.operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          total = total.addSimple(operand.floatify(symbols));
        }
        if (!this._plus) {
          total.opposite();
        }
        return total;
      };

      PlusNumber.prototype.isFunctionOf = function(symbol) {
        var aa, ab, len, len1, operand, out, ref, ref1, sym;
        if (typeof symbol === "string") {
          ref = this.operands;
          for (aa = 0, len = ref.length; aa < len; aa++) {
            operand = ref[aa];
            if (operand.isFunctionOf(symbol)) {
              return true;
            }
          }
          return false;
        } else {
          out = [];
          ref1 = this.operands;
          for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
            operand = ref1[ab];
            sym = operand.isFunctionOf();
            out = union_arrays(out, sym);
          }
          return out;
        }
      };

      PlusNumber.prototype.degre = function(variable) {
        var operand;
        return Math.max.apply(Math, (function() {
          var aa, len, ref, results;
          ref = this.operands;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            operand = ref[aa];
            results.push(operand.degre(variable));
          }
          return results;
        }).call(this));
      };

      PlusNumber.prototype.toClone = function() {
        var aa, clone, len, operand, ref;
        clone = new PlusNumber();
        ref = this.operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          clone.push(operand.toClone());
        }
        return clone.setPlus(this._plus);
      };

      PlusNumber.prototype.conjugue = function() {
        var aa, len, operand, ref;
        ref = this.operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          operand.conjugue();
        }
        return this;
      };

      PlusNumber.prototype._childAssignValueToSymbol = function(liste) {
        var aa, i, len, operand, ref;
        ref = this.operands;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          operand = ref[i];
          this.operands[i] = operand._childAssignValueToSymbol(liste);
        }
        return this;
      };

      PlusNumber.prototype.developp = function(infos) {
        var aa, i, len, operand, ref;
        if (infos == null) {
          infos = null;
        }
        ref = this.operands;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          operand = ref[i];
          if (!this._plus) {
            operand.opposite();
          }
          this.operands[i] = operand.developp(infos);
        }
        this._plus = true;
        this.absorb_sousAdd();
        return this;
      };

      PlusNumber.prototype.getPolynomeFactors = function(variable) {
        var op, output;
        output = {
          add: (function() {
            var aa, len, ref, results;
            ref = this.operands;
            results = [];
            for (aa = 0, len = ref.length; aa < len; aa++) {
              op = ref[aa];
              results.push(op.getPolynomeFactors(variable));
            }
            return results;
          }).call(this)
        };
        if (this._plus) {
          return output;
        } else {
          return {
            mult: [-1, output]
          };
        }
      };

      PlusNumber.prototype.derivate = function(variable) {
        var aa, der, len, nb, ref;
        der = new PlusNumber();
        der.setPlus(this._plus);
        ref = this.operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          nb = ref[aa];
          der.push(nb.derivate(variable));
        }
        return der;
      };

      PlusNumber.prototype.push = function() {
        var aa, ab, len, len1, operand, ref, sub_operand;
        for (aa = 0, len = arguments.length; aa < len; aa++) {
          operand = arguments[aa];
          if (operand instanceof PlusNumber && operand._plus) {
            ref = operand.operands;
            for (ab = 0, len1 = ref.length; ab < len1; ab++) {
              sub_operand = ref[ab];
              this.operands.push(sub_operand);
            }
          } else if (operand instanceof NumberObject) {
            this.operands.push(operand);
          }
        }
        return this;
      };

      PlusNumber.prototype.developpingMult = function(operand) {
        var aa, ab, ac, ad, i, len, len1, len2, len3, new_operands, plus1_operand, plus2_operand, plus_operand, plus_produit, ref, ref1, ref2;
        if (operand instanceof PlusNumber) {
          new_operands = [];
          plus_produit = this._plus === operand._plus;
          ref = this.operands;
          for (aa = 0, len = ref.length; aa < len; aa++) {
            plus1_operand = ref[aa];
            ref1 = operand.operands;
            for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
              plus2_operand = ref1[ab];
              new_operands.push(plus1_operand.toClone().md(plus2_operand, false));
            }
          }
          if (!plus_produit) {
            for (ac = 0, len2 = new_operands.length; ac < len2; ac++) {
              plus_operand = new_operands[ac];
              operand.opposite();
            }
          }
          this.operands = new_operands;
        } else {
          ref2 = this.operands;
          for (i = ad = 0, len3 = ref2.length; ad < len3; i = ++ad) {
            plus_operand = ref2[i];
            this.operands[i] = plus_operand.md(operand, false);
            if (!this._plus) {
              this.operands[i].opposite();
            }
          }
        }
        this._plus = true;
        return this;
      };

      PlusNumber.prototype.absorb_sousAdd = function() {
        var aa, i, len, operand, ref, ref1;
        ref = this.operands;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          operand = ref[i];
          if ((operand instanceof PlusNumber) && operand._plus) {
            [].splice.apply(this.operands, [i, i - i + 1].concat(ref1 = operand.operands)), ref1;
          }
        }
        return this;
      };

      PlusNumber.prototype.facto = function(regex) {
        var aa, f, factor, len, op, out, ref;
        out = [];
        factor = null;
        ref = this.operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          op = ref[aa];
          f = op.facto(regex);
          if (f === null) {
            return null;
          }
          if (factor === null) {
            factor = f[1];
          }
          out.push(f[0]);
        }
        if (factor === null) {
          return null;
        }
        return [this.constructor.makePlus(out), factor];
      };

      PlusNumber.prototype.replace = function(replacement, needle) {
        var aa, clone, len, operand, ref;
        clone = new PlusNumber();
        ref = this.operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          clone.push(operand.replace(replacement, needle));
        }
        return clone.setPlus(this._plus);
      };

      PlusNumber.prototype.getOperands = function() {
        return this.operands;
      };

      return PlusNumber;

    })(NumberObject);
    MultiplyNumber = (function(superClass) {
      extend(MultiplyNumber, superClass);

      function MultiplyNumber() {
        var aa, len, operand;
        this._signature = null;
        this.numerator = [];
        this.denominator = [];
        for (aa = 0, len = arguments.length; aa < len; aa++) {
          operand = arguments[aa];
          if (operand instanceof NumberObject) {
            this.numerator.push(operand);
          }
        }
        this.absorbSousMults(true);
      }

      MultiplyNumber.makeMult = function(ops) {
        var base1, base2, base3, base4, base5, base6, ref;
        switch (false) {
          case ops.length !== 2:
            if (((ops[0] instanceof RealNumber) || (ops[0] instanceof RationalNumber) || (typeof (base1 = ops[0]).isPur === "function" ? base1.isPur() : void 0)) && (typeof (base2 = ops[1]).isSimpleSqrt === "function" ? base2.isSimpleSqrt() : void 0)) {
              return ops[1].mdSimple(ops[0], false);
            }
            if ((typeof (base3 = ops[1]).isI === "function" ? base3.isI() : void 0) && (typeof (base4 = ops[0]).isSimpleWidthI === "function" ? base4.isSimpleWidthI() : void 0)) {
              return ops[0].mdSimple(ops[1], false);
            }
            if ((typeof (base5 = ops[0]).isI === "function" ? base5.isI() : void 0) && (typeof (base6 = ops[1]).isSimpleWidthI === "function" ? base6.isSimpleWidthI() : void 0)) {
              return ops[1].mdSimple(ops[0], false);
            }
            break;
          case ops.length !== 1:
            return ops[0];
          case ops.length !== 0:
            return new RealNumber(1);
        }
        return (ref = new MultiplyNumber).pushNumerator.apply(ref, ops);
      };

      MultiplyNumber.makeDiv = function(op1, op2) {
        var fractionized;
        if ((fractionized = typeof op1.fractionize === "function" ? op1.fractionize(op2) : void 0) != null) {
          return fractionized;
        }
        return (new MultiplyNumber()).pushNumerator(op1).pushDenominator(op2);
      };

      MultiplyNumber.prototype.compositeString = function(options) {
        var den, num;
        num = this.compositeString_special(this.numerator, options);
        if (this.denominator.length === 0) {
          return num;
        }
        den = this.compositeString_special(this.denominator, options);
        if (options.tex) {
          if (num[2] && !num[1]) {
            num[0] = "-" + num[0];
            num[1] = true;
          }
          if (den[2] && !den[1]) {
            den[0] = "-" + den[0];
            den[1] = true;
          }
          return ["\\frac{" + num[0] + "}{" + den[0] + "}", num[1] === den[1], false, true];
        }
        if (num[2]) {
          if (num[1]) {
            num[0] = "(" + num[0] + ")";
          } else {
            num[0] = "(-" + num[0] + ")";
          }
          num[1] = true;
        }
        if (den[2]) {
          if (den[1]) {
            den[0] = "(" + den[0] + ")";
          } else {
            den[0] = "(-" + den[0] + ")";
          }
          den[1] = true;
        } else {
          if (den[3]) {
            den[0] = "(" + den[0] + ")";
          }
        }
        return [num[0] + "/" + den[0], num[1] === den[1], false, true];
      };

      MultiplyNumber.prototype.simplify = function(infos, developp, memeDeno) {
        var aa, ab, i, len, len1, operand, ref, ref1;
        if (infos == null) {
          infos = null;
        }
        if (developp == null) {
          developp = false;
        }
        if (memeDeno == null) {
          memeDeno = false;
        }
        this._signature = null;
        ref = this.numerator;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          operand = ref[i];
          if (developp) {
            operand = operand.developp(infos);
          }
          this.numerator[i] = operand.simplify(infos, developp, memeDeno);
        }
        ref1 = this.denominator;
        for (i = ab = 0, len1 = ref1.length; ab < len1; i = ++ab) {
          operand = ref1[i];
          if (developp) {
            operand = operand.developp(infos);
          }
          this.denominator[i] = operand.simplify(infos, developp, memeDeno);
        }
        this.absorbSousMults(true);
        this.absorbSousMults(false);
        this.contractNumbersAndSymbols(infos);
        if (developp) {
          this.developp_special(true, infos, true, memeDeno);
        }
        if (this.denominator.length === 0) {
          if (this.numerator.length === 0) {
            return new RealNumber(1);
          }
          if (this.numerator.length === 1) {
            return this.numerator.pop();
          }
        }
        return this;
      };

      MultiplyNumber.prototype.opposite = function() {
        if (this.numerator.length !== 0) {
          this.numerator[0].opposite();
        } else {
          this.numerator.push(new RealNumber(-1));
        }
        return this;
      };

      MultiplyNumber.prototype.order = function(normal) {
        var aa, ab, den, len, len1, num, ref, ref1;
        if (normal == null) {
          normal = true;
        }
        ref = this.numerator;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          num = ref[aa];
          num.order(normal);
        }
        ref1 = this.denominator;
        for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
          den = ref1[ab];
          den.order(normal);
        }
        if (normal) {
          this.numerator.sort(function(a, b) {
            return signatures_comparaison(a, b, 1);
          });
          this.denominator.sort(function(a, b) {
            return signatures_comparaison(a, b, 1);
          });
        } else {
          this.numerator.sort(function(a, b) {
            return signatures_comparaison(a, b, -1);
          });
          this.denominator.sort(function(a, b) {
            return signatures_comparaison(a, b, -1);
          });
        }
        return this;
      };

      MultiplyNumber.prototype.md = function(operand, div, infos) {
        if (infos == null) {
          infos = null;
        }
        this._signature = null;
        if (div) {
          this.denominator.push(operand.toClone());
        } else {
          this.numerator.push(operand.toClone());
        }
        if ((operand instanceof SimpleNumber) || (operand instanceof Monome)) {
          this.contractNumbersAndSymbols(infos);
        }
        return this;
      };

      MultiplyNumber.prototype.inverse = function() {
        var temp;
        this._signature = null;
        temp = this.numerator;
        this.numerator = this.denominator;
        this.denominator = temp;
        this.contractNumbersAndSymbols();
        if (this.numerator.length === 0) {
          this.numerator.push(new RealNumber(1));
        }
        return this;
      };

      MultiplyNumber.prototype.floatify = function(symbols) {
        var aa, ab, len, len1, operand, produit, ref, ref1;
        produit = new RealNumber(1);
        ref = this.numerator;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          produit = produit.mdSimple(operand.floatify(symbols), false);
        }
        ref1 = this.denominator;
        for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
          operand = ref1[ab];
          produit = produit.mdSimple(operand.floatify(symbols).inverse(), false);
        }
        return produit;
      };

      MultiplyNumber.prototype.isFunctionOf = function(symbol) {
        var aa, ab, ac, ad, len, len1, len2, len3, operand, out, ref, ref1, ref2, ref3, sym;
        if (typeof symbol === "string") {
          ref = this.numerator;
          for (aa = 0, len = ref.length; aa < len; aa++) {
            operand = ref[aa];
            if (operand.isFunctionOf(symbol)) {
              return true;
            }
          }
          ref1 = this.denominator;
          for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
            operand = ref1[ab];
            if (operand.isFunctionOf(symbol)) {
              return true;
            }
          }
          return false;
        } else {
          out = [];
          ref2 = this.numerator;
          for (ac = 0, len2 = ref2.length; ac < len2; ac++) {
            operand = ref2[ac];
            sym = operand.isFunctionOf();
            out = union_arrays(out, sym);
          }
          ref3 = this.denominator;
          for (ad = 0, len3 = ref3.length; ad < len3; ad++) {
            operand = ref3[ad];
            sym = operand.isFunctionOf();
            out = union_arrays(out, sym);
          }
          return out;
        }
      };

      MultiplyNumber.prototype.degre = function(variable) {
        var aa, ab, len, len1, operand, out, ref, ref1;
        out = 0;
        ref = this.numerator;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          out += operand.degre(variable);
        }
        ref1 = this.denominator;
        for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
          operand = ref1[ab];
          out -= operand.degre(variable);
        }
        return out;
      };

      MultiplyNumber.prototype.toClone = function() {
        var aa, ab, clone, len, len1, operand, ref, ref1;
        clone = new MultiplyNumber();
        ref = this.numerator;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          clone.pushNumerator(operand.toClone());
        }
        ref1 = this.denominator;
        for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
          operand = ref1[ab];
          clone.pushDenominator(operand.toClone());
        }
        return clone;
      };

      MultiplyNumber.prototype.conjugue = function() {
        var aa, ab, len, len1, operand, ref, ref1;
        ref = this.numerator;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          operand.conjugue();
        }
        ref1 = this.denominator;
        for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
          operand = ref1[ab];
          operand.conjugue();
        }
        return this;
      };

      MultiplyNumber.prototype._childAssignValueToSymbol = function(liste) {
        var aa, ab, i, len, len1, operand, ref, ref1;
        ref = this.numerator;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          operand = ref[i];
          this.numerator[i] = operand._childAssignValueToSymbol(liste);
        }
        ref1 = this.denominator;
        for (i = ab = 0, len1 = ref1.length; ab < len1; i = ++ab) {
          operand = ref1[i];
          this.denominator[i] = operand._childAssignValueToSymbol(liste);
        }
        return this;
      };

      MultiplyNumber.prototype.developp = function(infos) {
        if (infos == null) {
          infos = null;
        }
        this._signature = null;
        this.developp_special(true, infos, false, false);
        if (this.denominator.length !== 0) {
          this.developp_special(false, infos, false, false);
        }
        if ((this.numerator.length === 1) && (this.denominator.length === 0)) {
          return this.numerator[0];
        }
        return this;
      };

      MultiplyNumber.prototype.signature = function() {
        var aa, ab, den, len, len1, num, operand, output, ref, ref1, sign;
        if (this._signature !== null) {
          return this._signature;
        }
        num = [];
        ref = this.numerator;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          sign = operand.signature();
          if (sign === "N/A") {
            return "N/A";
          }
          if (sign !== "1") {
            num.push(sign);
          }
        }
        num.sort();
        den = [];
        ref1 = this.denominator;
        for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
          operand = ref1[ab];
          sign = operand.signature();
          if (sign === "N/A") {
            return "N/A";
          }
          if (sign !== "1") {
            num.push(sign);
          }
        }
        den.sort();
        if ((num.length === 0) && (den.length === 0)) {
          return "1";
        }
        if (num.length === 0) {
          output = "1";
        } else {
          output = num.join(".");
        }
        if (den.length === 1) {
          output = output + "/" + den[0];
        } else if (den.length > 1) {
          output = output + "/(" + den.join(".") + ")";
        }
        this._signature = output;
        return output;
      };

      MultiplyNumber.prototype.extractFactor = function() {
        var factor, i;
        factor = new RealNumber(1);
        i = 0;
        while (i < this.numerator.length) {
          if (this.numerator[i] instanceof SimpleNumber) {
            factor = factor.mdSimple(this.numerator[i], false);
            this.numerator.splice(i, 1);
          } else {
            factor = factor.mdSimple(this.numerator[i].extractFactor(), false);
            i++;
          }
        }
        while (i < this.denominator.length) {
          if (this.denominator[i] instanceof SimpleNumber) {
            factor = factor.mdSimple(this.denominator[i], true);
            this.denominator.splice(i, 1);
          } else {
            factor = factor.mdSimple(this.denominator[i].extractFactor(), true);
            i++;
          }
        }
        return factor;
      };

      MultiplyNumber.prototype.getPolynomeFactors = function(variable) {
        var aa, item, len, mult, oDiv, op, ref;
        if (((function() {
          var aa, len, ref, results;
          ref = this.denominator;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            item = ref[aa];
            if (item.isFunctionOf(variable)) {
              results.push(item);
            }
          }
          return results;
        }).call(this)).length > 0) {
          return null;
        } else {
          mult = (function() {
            var aa, len, ref, results;
            ref = this.numerator;
            results = [];
            for (aa = 0, len = ref.length; aa < len; aa++) {
              op = ref[aa];
              results.push(op.getPolynomeFactors(variable));
            }
            return results;
          }).call(this);
          if (!this._plus) {
            mult.unshift(-1);
          }
          if (this.denominator.length > 0) {
            oDiv = new RealNumber(1);
            ref = this.denominator;
            for (aa = 0, len = ref.length; aa < len; aa++) {
              op = ref[aa];
              oDiv = oDiv.md(op, true);
            }
            mult.push(oDiv);
          }
          return {
            mult: mult
          };
        }
      };

      MultiplyNumber.prototype.derivate = function(variable) {
        var aa, ab, ac, ad, deno, i, len, len1, len2, len3, newTerm, numFactors, op, opF, out, ref, ref1;
        if (!this.isFunctionOf(variable)) {
          return new RealNumber(0);
        }
        numFactors = [new RealNumber(1)];
        ref = this.numerator;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          op = ref[aa];
          if (op.isFunctionOf(variable)) {
            newTerm = numFactors[0].toClone();
          } else {
            newTerm = null;
          }
          for (i = ab = 0, len1 = numFactors.length; ab < len1; i = ++ab) {
            opF = numFactors[i];
            numFactors[i] = opF.md(op, false);
          }
          if (newTerm !== null) {
            numFactors.push(newTerm.md(op.derivate(variable), false));
          }
        }
        deno = new RealNumber(1);
        ref1 = this.denominator;
        for (ac = 0, len2 = ref1.length; ac < len2; ac++) {
          op = ref1[ac];
          deno = deno.md(op, false);
          if (op.isFunctionOf(variable)) {
            newTerm = numFactors[0].toClone();
            deno = deno.md(op, false);
          } else {
            newTerm = null;
          }
          for (i = ad = 0, len3 = numFactors.length; ad < len3; i = ++ad) {
            opF = numFactors[i];
            numFactors[i] = opF.md(op, false);
          }
          if (newTerm !== null) {
            numFactors.push(newTerm.md(op.derivate(variable), false).opposite());
          }
        }
        numFactors.shift();
        out = numFactors.shift();
        while (numFactors.length > 0) {
          out = out.am(numFactors.shift(), false);
        }
        out = out.md(deno, true);
        return out;
      };

      MultiplyNumber.prototype.pushNumerator = function() {
        var aa, len, operand;
        this._signature = null;
        for (aa = 0, len = arguments.length; aa < len; aa++) {
          operand = arguments[aa];
          if (operand instanceof NumberObject) {
            this.numerator.push(operand);
          }
        }
        return this;
      };

      MultiplyNumber.prototype.pushDenominator = function() {
        var aa, len, operand;
        this._signature = null;
        for (aa = 0, len = arguments.length; aa < len; aa++) {
          operand = arguments[aa];
          if (operand instanceof NumberObject) {
            this.denominator.push(operand);
          }
        }
        this.absorbSousMults(false);
        return this;
      };

      MultiplyNumber.prototype.absorbSousMults = function(up, widthInverse) {
        var aa, ab, i, len, len1, operand, ref, ref1, ref2, ref3, ref4, ref5;
        if (widthInverse == null) {
          widthInverse = true;
        }
        this._signature = null;
        if (up) {
          ref = this.numerator;
          for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
            operand = ref[i];
            if ((operand instanceof MultiplyNumber) && (widthInverse || (((ref1 = operand.denominator) != null ? ref1.length : void 0) === 0))) {
              [].splice.apply(this.numerator, [i, i - i + 1].concat(ref2 = operand.numerator)), ref2;
              this.denominator = this.denominator.concat(operand.denominator);
            }
          }
        } else {
          ref3 = this.denominator;
          for (i = ab = 0, len1 = ref3.length; ab < len1; i = ++ab) {
            operand = ref3[i];
            if ((operand instanceof MultiplyNumber) && (widthInverse || (((ref4 = operand.denominator) != null ? ref4.length : void 0) === 0))) {
              [].splice.apply(this.denominator, [i, i - i + 1].concat(ref5 = operand.numerator)), ref5;
              this.numerator = this.numerator.concat(operand.denominator);
            }
          }
        }
        return this;
      };

      MultiplyNumber.prototype.contractNumbersAndSymbols = function(infos) {
        var base, flagMultNotStarted, i, inv, new_denominator, operand;
        if (infos == null) {
          infos = null;
        }
        this._signature = null;
        this.denominator.reverse();
        new_denominator = [];
        i = 0;
        while (i < this.denominator.length) {
          inv = this.denominator[i].inverse();
          if (typeof inv !== "undefined") {
            this.numerator.push(inv);
            this.denominator.splice(i, 1);
          } else {
            i++;
          }
        }
        flagMultNotStarted = true;
        base = new RealNumber(1);
        i = 0;
        while (i < this.numerator.length) {
          operand = this.numerator[i];
          if ((operand instanceof SimpleNumber) || (operand instanceof Monome)) {
            if (operand.isNul()) {
              if (infos != null) {
                infos.set("MULT_SIMPLE");
              }
              this.numerator = [new RealNumber(0)];
              this.denominator = [];
              return this;
            } else {
              if (flagMultNotStarted) {
                base = base.md(operand, false);
                flagMultNotStarted = false;
              } else {
                base = base.md(operand, false, infos);
              }
              this.numerator.splice(i, 1);
            }
          } else {
            base = base.md(operand.extractFactor(), false);
            i++;
          }
        }
        if (!(base = base.simplify(infos)).isOne()) {
          this.numerator.unshift(base);
        }
        return this;
      };

      MultiplyNumber.prototype.developp_special = function(up, infos, simplify, memeDeno) {
        var aa, actionDone, i, len, operPlus, operand, operands;
        operPlus = null;
        if (up) {
          operands = this.numerator;
        } else {
          operands = this.denominator;
        }
        for (i = aa = 0, len = operands.length; aa < len; i = ++aa) {
          operand = operands[i];
          operands[i] = operand.developp(infos);
        }
        this.absorbSousMults(up);
        i = 0;
        while ((i < operands.length) && (operPlus === null)) {
          if (operands[i] instanceof PlusNumber) {
            operPlus = operands[i];
          } else {
            i++;
          }
        }
        if (operPlus !== null) {
          while (operand = operands.shift()) {
            if (operand !== operPlus) {
              operPlus.developpingMult(operand);
              if (infos != null) {
                infos.set("DISTRIBUTION");
              }
              actionDone = true;
            }
          }
          if (simplify) {
            operPlus = operPlus.simplify(infos, false, memeDeno);
          }
          operands.push(operPlus);
        }
        return this;
      };

      MultiplyNumber.prototype.compositeString_special = function(operands, options) {
        var aa, cs, cs0, len, n, operand, ref, str;
        n = operands.length;
        if (n === 0) {
          return ['1', true, false, false];
        }
        cs0 = operands[0].compositeString(options);
        if (n === 1) {
          return cs0;
        }
        str = cs0[0];
        if (cs0[2]) {
          if (cs0[1]) {
            if (options.tex) {
              str = "\\left(" + str + "\\right)";
            } else {
              str = "(" + str + ")";
            }
          } else {
            cs0[1] = true;
            if (options.tex) {
              str = "\\left(-" + str + "\\right)";
            } else {
              str = "(-" + str + ")";
            }
          }
        }
        ref = operands.slice(1, +n + 1 || 9e9);
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          cs = operand.compositeString(options);
          if (!cs[1]) {
            cs[0] = "-" + cs[0];
          }
          if (!cs[1] || cs[2]) {
            if (options.tex) {
              cs[0] = "\\left(" + cs[0] + "\\right)";
            } else {
              cs[0] = "(" + cs[0] + ")";
            }
          }
          if (options.tex) {
            str = str + "\\cdot " + cs[0];
          } else {
            str = str + "*" + cs[0];
          }
        }
        return [str, cs0[1], false, true];
      };

      MultiplyNumber.prototype.facto = function(regex) {
        var f, i, out;
        i = 0;
        while (i < this.numerator.length) {
          f = this.numerator[i].facto(regex);
          if (f !== null) {
            out = this.toClone();
            out.numerator[i] = f[0];
            return [out, f[1]];
          }
          i++;
        }
        return null;
      };

      MultiplyNumber.prototype.replace = function(replacement, needle) {
        var aa, ab, clone, len, len1, operand, ref, ref1;
        clone = new MultiplyNumber();
        ref = this.numerator;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          operand = ref[aa];
          clone.pushNumerator(operand.replace(replacement, needle));
        }
        ref1 = this.denominator;
        for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
          operand = ref1[ab];
          clone.pushDenominator(operand.replace(replacement, needle));
        }
        return clone;
      };

      MultiplyNumber.prototype.getNumDen = function() {
        return [
          (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(MultiplyNumber, this.numerator, function(){}), (function(func, args, ctor) {
            ctor.prototype = func.prototype;
            var child = new ctor, result = func.apply(child, args);
            return Object(result) === result ? result : child;
          })(MultiplyNumber, this.denominator, function(){})
        ];
      };

      return MultiplyNumber;

    })(NumberObject);
    PowerNumber = (function(superClass) {
      extend(PowerNumber, superClass);

      function PowerNumber(base, exposant) {
        this._base = base;
        this._exposant = exposant;
      }

      PowerNumber.make = function(base, exposant) {
        var exp;
        if ((base === "e") || (base instanceof Monome) && (base.isSymbol("e"))) {
          return FunctionNumber.make("exp", exposant);
        }
        if ((typeof base === "undefined") || !(base instanceof NumberObject)) {
          base = new RealNumber(base);
        }
        switch (false) {
          case !(exposant instanceof NumberObject):
            exp = exposant;
            break;
          case typeof exposant !== "number":
            exp = new RealNumber(exposant);
            break;
          default:
            exp = new RealNumber(1);
        }
        if ((base instanceof Monome) && exp.isReal() && exp.isInteger()) {
          return base.puissance(exp);
        }
        return new PowerNumber(base, exp);
      };

      PowerNumber.prototype.compositeString = function(options) {
        var b, cs, e;
        if ((this._base instanceof FunctionNumber) && (this._exposant instanceof RealNumber)) {
          cs = this._base.compositeString(options, this._exposant.float());
          cs[1] = this._plus;
          return cs;
        } else {
          b = this._base.compositeString(options);
          e = this._exposant.compositeString(options);
          if (!b[1]) {
            b[0] = "-" + b[0];
          }
          if (!e[1]) {
            e[0] = "-" + e[0];
          }
          if (options.tex) {
            if (b[2] || b[3] || !b[1] || (this._base instanceof FunctionNumber)) {
              b[0] = "\\left(" + b[0] + "\\right)";
            }
            e[0] = "{" + e[0] + "}";
          } else {
            if (b[2] || b[3] || !b[1] || (this._base instanceof FunctionNumber)) {
              b[0] = "(" + b[0] + ")";
            }
            if (e[2] || e[3]) {
              e[0] = "(" + e[0] + ")";
            }
          }
          return [b[0] + "^" + e[0], this._plus, false, true];
        }
      };

      PowerNumber.prototype.simplify = function(infos, developp, memeDeno) {
        var out, output;
        if (infos == null) {
          infos = null;
        }
        if (developp == null) {
          developp = false;
        }
        if (memeDeno == null) {
          memeDeno = false;
        }
        this._exposant = this._exposant.simplify(infos, developp, memeDeno);
        this._base = this._base.simplify(infos, developp, memeDeno);
        if ((this._base instanceof Monome) && (this._base.isSymbol("e"))) {
          out = new FunctionNumber("exp", this._exposant);
          return out.simplify(infos, developp, memeDeno);
        }
        if ((this._base instanceof FunctionNumber) && (this._base._function.alias === "exp")) {
          this._base._operand = this._base._operand.md(this._exposant, false);
          return this._base.simplify(infos, developp, memeDeno);
        }
        if (this._exposant instanceof SimpleNumber) {
          output = null;
          switch (false) {
            case !this._exposant.isOne():
              if (infos != null) {
                infos.set("EXPOSANT_UN");
              }
              output = this._base;
              break;
            case !this._exposant.isNul():
              if (infos != null) {
                infos.set("EXPOSANT_ZERO");
              }
              output = new RealNumber(this.signe());
              break;
            case !(this._exposant.isReal() && this._exposant.isInteger()):
              if (this._base instanceof Monome) {
                output = this._base.puissance(this._exposant);
              } else if ((this._base instanceof SimpleNumber) && this._base.isInteger()) {
                if (infos != null) {
                  infos.set("PUISSANCE");
                }
                output = this._base.puissance(this._exposant, infos);
              }
          }
          if (output !== null) {
            if (this._plus) {
              return output;
            }
            return output.opposite();
          }
        }
        return this;
      };

      PowerNumber.prototype.am = function(operand, minus, infos) {
        var op;
        if (infos == null) {
          infos = null;
        }
        op = operand.toClone();
        if (minus) {
          op.opposite();
        }
        return new PlusNumber(this, op);
      };

      PowerNumber.prototype.floatify = function(symbols) {
        var base, exposant;
        base = this._base.floatify(symbols);
        exposant = this._exposant.floatify(symbols);
        return base.puissance(exposant);
      };

      PowerNumber.prototype.isFunctionOf = function(symbol) {
        if (typeof symbol === "string") {
          return this._base.isFunctionOf(symbol) || this._exposant.isFunctionOf(symbol);
        } else {
          return union_arrays(this._base.isFunctionOf(), this._exposant.isFunctionOf());
        }
      };

      PowerNumber.prototype.degre = function(variable) {
        if (this.isFunctionOf(variable)) {
          return Infinity;
        } else {
          return 0;
        }
      };

      PowerNumber.prototype.toClone = function() {
        return PowerNumber.make(this._base, this._exposant).setPlus(this._plus);
      };

      PowerNumber.prototype._childAssignValueToSymbol = function(liste) {
        this._base = this._base._childAssignValueToSymbol(liste);
        this._exposant = this._exposant._childAssignValueToSymbol(liste);
        return this;
      };

      PowerNumber.prototype.developp = function(infos) {
        var output;
        if (infos == null) {
          infos = null;
        }
        this._base = this._base.developp(infos);
        this._exposant = this._exposant.developp(infos);
        if (this._exposant.isNul()) {
          if (infos != null) {
            infos.set("EXPOSANT_ZERO");
          }
          return new RealNumber(this.signe());
        }
        if ((this._exposant.isInteger()) && (this._exposant.isReal())) {
          if (infos != null) {
            infos.set("EXPOSANT_DEVELOPP");
          }
          output = this._base.puissance(this._exposant).developp(infos);
          if (this._plus) {
            return output;
          }
          return output.opposite();
        }
        return this;
      };

      PowerNumber.prototype.getPolynomeFactors = function(variable) {
        var exp, output;
        exp = this._exposant.simplify();
        switch (false) {
          case !!(exp instanceof RealNumber):
            return null;
          case !!(exp.isInteger() && exp.isPositive()):
            return null;
          case !this._base.isFunctionOf(variable):
            output = {
              base: this._base.getPolynomeFactors(variable),
              power: exp.float()
            };
            if (this._plus) {
              return output;
            } else {
              return this._plus({
                mult: [-1, output]
              });
            }
            break;
          default:
            return this;
        }
      };

      PowerNumber.prototype.replace = function(replacement, needle) {
        var base, exposant;
        base = this._base.replace(replacement, needle);
        exposant = this._exposant.replace(replacement, needle);
        return new PowerNumber(base, exposant);
      };

      return PowerNumber;

    })(NumberObject);
    Monome = (function(superClass) {
      extend(Monome, superClass);

      Monome.prototype.coeff = null;

      Monome.prototype.symbols = null;

      Monome.prototype._order = true;

      function Monome(coeff, symbols) {
        var aa, ab, len, len1, name, power, ref, symbolItem, symbolsList;
        if (coeff instanceof SimpleNumber) {
          this.coeff = coeff;
        } else {
          this.coeff = new RealNumber(coeff);
        }
        this.symbols = {};
        switch (false) {
          case typeof symbols !== "string":
            symbolsList = symbols.split("*");
            for (aa = 0, len = symbolsList.length; aa < len; aa++) {
              symbolItem = symbolsList[aa];
              ref = symbolItem.split("^"), name = ref[0], power = ref[1];
              power = Number(power);
              if (Number.isNaN(power)) {
                power = 1;
              }
              this.pushSymbol(name, power);
            }
            break;
          case !isArray(symbols):
            for (ab = 0, len1 = symbols.length; ab < len1; ab++) {
              symbolItem = symbols[ab];
              this.pushSymbol(symbolItem.name, symbolItem.power);
            }
            break;
          case !((typeof symbols === "object") && (symbols !== null)):
            this.pushSymbol(symbols.name, symbols.power);
        }
      }

      Monome.prototype.pushSymbol = function(name, power, cleanZero, infos) {
        if (cleanZero == null) {
          cleanZero = false;
        }
        if (infos == null) {
          infos = null;
        }
        if (this.symbols[name] != null) {
          if (infos !== null) {
            if (infos != null) {
              infos.set("MULT_SYMBOLE");
            }
          }
          this.symbols[name] += power;
        } else {
          this.symbols[name] = power;
        }
        if (cleanZero && (this.symbols[name] === 0)) {
          delete this.symbols[name];
        }
        return this;
      };

      Monome.prototype.hasSymbols = function() {
        return Object.keys(this.symbols).length > 0;
      };

      Monome.prototype.isSymbol = function(name) {
        return ((this.symbols[name] != null) === 1) && (Object.keys(this.symbols).length === 1) && (this.coeff.isOne());
      };

      Monome.prototype.setPlus = function(plus) {
        this.coeff.setPlus(plus);
        return this;
      };

      Monome.prototype.compositeString = function(options) {
        var aa, coeffDen, coeffDone, coeffNum, coeffPositif, csCoeff, denArray, denString, key, keys, len, multObj, name, numArray, numString, outString, power;
        coeffDone = false;
        numArray = [];
        if (options.negPowerDown) {
          denArray = [];
        }
        if (!this.hasSymbols()) {
          return this.coeff.compositeString(options);
        }
        multObj = false;
        keys = Object.keys(this.symbols).sort();
        if (!this._order) {
          keys.reverse();
        }
        for (aa = 0, len = keys.length; aa < len; aa++) {
          key = keys[aa];
          power = this.symbols[key];
          switch (false) {
            case !(options.tex && (indexOf.call(grecques, key) >= 0)):
              name = "\\" + key;
              break;
            case key !== "pi":
              name = "π";
              break;
            default:
              name = key;
          }
          multObj = true;
          switch (false) {
            case power !== 1:
              multObj = false;
              numArray.push(name);
              break;
            case !(options.tex && options.negPowerDown && power === -1):
              denArray.push("" + name);
              break;
            case !(options.tex && options.negPowerDown && power < 0):
              denArray.push(name + "^{" + (-power) + "}");
              break;
            case !options.tex:
              numArray.push(name + "^{" + power + "}");
              break;
            case !(power >= 0):
              numArray.push(name + "^" + power);
              break;
            case !(power === -1 && options.negPowerDown):
              denArray.push("" + name);
              break;
            case !options.negPowerDown:
              denArray.push(name + "^" + (-power));
              break;
            default:
              numArray.push(name + "^(" + power + ")");
          }
        }
        if (keys.length > 1) {
          multObj = true;
        }
        if ((this.coeff instanceof RationalNumber) && (options.floatNumber !== true) && (options.symbolsUp || options.negPowerDown)) {
          coeffDone = true;
          if (!this.coeff.isOne()) {
            multObj = true;
          }
          coeffNum = this.coeff.numerator.compositeString(options);
          coeffPositif = coeffNum[1];
          coeffDen = this.coeff.denominator.compositeString(options);
          if (coeffNum[0] !== "1") {
            numArray.unshift(coeffNum[0]);
          }
          if (coeffDen[0] !== "1") {
            if (denArray != null) {
              denArray.unshift(coeffDen[0]);
            } else {
              denArray = [coeffDen[0]];
            }
          }
        }
        if (options.tex) {
          numString = numArray.join(" ");
          if ((denArray != null) && denArray.length > 0) {
            denString = denArray.join(" ");
          } else {
            denString = null;
          }
        } else {
          numString = numArray.join("*");
          if ((denArray != null) && denArray.length > 0) {
            if (denArray.length === 1) {
              denString = denArray.pop();
            } else {
              denString = "(" + denArray.join("*") + ")";
            }
          } else {
            denString = null;
          }
        }
        if (numString === "") {
          numString = "1";
        }
        if (denString === null) {
          outString = numString;
        } else {
          if (options.tex) {
            outString = "\\frac{" + numString + "}{" + denString + "}";
          } else {
            outString = numString + "/" + denString;
          }
        }
        if (coeffDone === false) {
          csCoeff = this.coeff.compositeString(options);
          if (outString === "1") {
            return csCoeff;
          }
          coeffPositif = csCoeff[1];
          if (csCoeff[0] !== "1") {
            multObj = true;
            if (csCoeff[2]) {
              if (options.tex) {
                outString = "\\left(" + csCoeff[0] + "\\right)" + outString;
              } else {
                "(" + csCoeff[0] + ")*" + outString;
              }
            } else {
              if (options.tex) {
                outString = csCoeff[0] + outString;
              } else {
                outString = csCoeff[0] + "*" + outString;
              }
            }
          }
        }
        return [outString, coeffPositif, false, multObj];
      };

      Monome.prototype.simplify = function(infos) {
        var key, power, ref;
        if (infos == null) {
          infos = null;
        }
        ref = this.symbols;
        for (key in ref) {
          power = ref[key];
          if (power === 0) {
            delete this.symbols[key];
            if (infos != null) {
              infos.set("EXPOSANT_ZERO");
            }
          }
        }
        this.coeff = this.coeff.simplify(infos);
        if (this.coeff.isNul() || this.coeff.isNaN() || (Object.keys(this.symbols).length === 0)) {
          return this.coeff;
        }
        return this;
      };

      Monome.prototype.am = function(operand, minus, infos) {
        if (infos == null) {
          infos = null;
        }
        if ((operand instanceof Monome) && (operand.signature() === this.signature())) {
          if (infos != null) {
            infos.set("ADD_REGROUPEMENT");
          }
          this.coeff = this.coeff.am(operand.coeff, minus);
          return this;
        }
        return Monome.__super__.am.call(this, operand, minus, infos);
      };

      Monome.prototype.opposite = function() {
        this.coeff.opposite();
        return this;
      };

      Monome.prototype.md = function(operand, div, infos) {
        var key, power, ref, ref1;
        if (infos == null) {
          infos = null;
        }
        switch (false) {
          case !(operand instanceof Monome):
            this.coeff = this.coeff.md(operand.coeff, div, infos);
            if (div) {
              ref = operand.symbols;
              for (key in ref) {
                power = ref[key];
                this.pushSymbol(key, -power, true, infos);
              }
            } else {
              ref1 = operand.symbols;
              for (key in ref1) {
                power = ref1[key];
                this.pushSymbol(key, power, true, infos);
              }
            }
            if (Object.keys(this.symbols).length === 0) {
              return this.coeff;
            }
            return this;
          case !(operand instanceof SimpleNumber):
            this.coeff = this.coeff.md(operand, div, infos);
            return this;
        }
        return Monome.__super__.md.call(this, operand, div, infos);
      };

      Monome.prototype.inverse = function() {
        var key, power, ref;
        ref = this.symbols;
        for (key in ref) {
          power = ref[key];
          this.symbols[key] = -power;
        }
        this.coeff = this.coeff.inverse();
        return this;
      };

      Monome.prototype.puissance = function(exposant) {
        var key, power, ref;
        if (exposant instanceof NumberObject) {
          exposant = exposant.floatify().float();
        }
        if (!(isInteger(exposant))) {
          return new RealNumber();
        }
        if (exposant === 0) {
          return new RealNumber(1);
        }
        ref = this.symbols;
        for (key in ref) {
          power = ref[key];
          this.symbols[key] *= exposant;
        }
        this.coeff = this.coeff.puissance(exposant);
        return this;
      };

      Monome.prototype.floatify = function(symbols) {
        var key, out, power, ref;
        out = this.coeff.floatify(symbols);
        ref = this.symbols;
        for (key in ref) {
          power = ref[key];
          if (power !== 0) {
            out = out.md(SymbolManager.getSymbolValue(key, symbols).floatify().puissance(power), false);
          }
        }
        return out;
      };

      Monome.prototype.isFunctionOf = function(symbol) {
        var key, power, ref, results;
        if (typeof symbol === "string") {
          if ((symbol === "e") || (symbol === "pi") || (symbol === "i")) {
            return false;
          } else {
            return (typeof this.symbols[symbol] === "number") && (this.symbols[symbol] !== 0);
          }
        } else {
          ref = this.symbols;
          results = [];
          for (key in ref) {
            power = ref[key];
            if ((power !== 0) && (key !== "i") && (key !== "pi") && (key !== "e")) {
              results.push(key);
            }
          }
          return results;
        }
      };

      Monome.prototype.degre = function(variable) {
        var ref;
        return (ref = this.symbols[symbol]) != null ? ref : 0;
      };

      Monome.prototype.toClone = function() {
        var cl, key, power, ref;
        cl = new Monome(this.coeff.toClone());
        ref = this.symbols;
        for (key in ref) {
          power = ref[key];
          cl.pushSymbol(key, power);
        }
        return cl;
      };

      Monome.prototype.isNul = function() {
        return this.coeff.isNul();
      };

      Monome.prototype.isOne = function(factor) {
        return !(this.hasSymbols()) && this.coeff.isOne(factor);
      };

      Monome.prototype._childAssignValueToSymbol = function(liste) {
        var key, value;
        for (key in liste) {
          value = liste[key];
          if (this.symbols[key] != null) {
            if (this.symbols[key] !== 1) {
              value = PowerNumber.make(value.toClone(), this._exposant);
            }
            delete this.symbols[key];
            switch (false) {
              case !!this.hasSymbols():
                return value.md(this.coeff, false);
              case !(value instanceof SimpleNumber):
                this.coeff = this.coeff.md(value, false);
                return this;
              case !(value instanceof Monome):
                return this.md(value, false);
              default:
                return MultiplyNumber.makeMult(value, this);
            }
          }
        }
        return this;
      };

      Monome.prototype.signature = function() {
        var aa, key, keys, len, s;
        keys = Object.keys(this.symbols).sort();
        s = "";
        for (aa = 0, len = keys.length; aa < len; aa++) {
          key = keys[aa];
          if (this.symbols[key] !== 0) {
            s += key + this.symbols[key];
          }
        }
        if (s === "") {
          return "1";
        }
        return s;
      };

      Monome.prototype.extractFactor = function() {
        var coeff;
        coeff = this.coeff;
        this.coeff = new RealNumber(1);
        return coeff;
      };

      Monome.prototype.getPolynomeFactors = function(variable) {
        var cl, power;
        cl = this;
        power = 0;
        if (this.symbols[variable] != null) {
          cl = this.toClone();
          power = this.symbols[variable];
          delete cl.symbols[variable];
        }
        if (!cl.hasSymbols()) {
          cl = cl.coeff;
        }
        if (power === 0) {
          return cl;
        } else {
          return {
            monome: power,
            factor: cl
          };
        }
      };

      Monome.prototype.derivate = function(variable) {
        var out, power;
        if ((this.symbols[variable] != null) && (this.symbols[variable] !== 0)) {
          out = this.toClone();
          power = this.symbols[variable];
          out.coeff = out.coeff.md(new RealNumber(power), false);
          if (power === 1) {
            return out.coeff;
          }
          out.symbols[variable] = power - 1;
          return out;
        }
        return new RealNumber(0);
      };

      Monome.prototype.order = function(normal) {
        if (normal == null) {
          normal = true;
        }
        this._order = normal;
        return this;
      };

      Monome.prototype.replace = function(replacement, needle) {
        var x, y;
        if (this.symbols[needle] != null) {
          x = replacement.toClone();
          if (this.symbols[needle] !== 1) {
            x = new PowerNumber(x, new RealNumber(this.symbols[needle]));
          }
          y = this.toClone();
          delete y.symbols[needle];
          switch (false) {
            case !y.isOne():
              return x;
            case !y.isOne(-1):
              return x.opposite();
            default:
              return x.md(y, false);
          }
        } else {
          return this.toClone();
        }
      };

      Monome.prototype.getNumDen = function() {
        var denSymbs, key, numSymbs, ref, value;
        numSymbs = [];
        denSymbs = [];
        ref = this.symbols;
        for (key in ref) {
          value = ref[key];
          if (value >= 0) {
            numSymbs.push({
              name: key,
              power: value
            });
          } else {
            denSymbs.push({
              name: key,
              power: -value
            });
          }
        }
        return [new Monome(this.coeff, numSymbs), new Monome(1, denSymbs)];
      };

      return Monome;

    })(NumberObject);
    FunctionNumber = (function(superClass) {
      extend(FunctionNumber, superClass);

      FunctionNumber.functions = {
        inconnue: {
          tex: "\\text{fonction inconnue}",
          alias: "inconnue",
          needBraces: false,
          powerNearName: false,
          calc: function(x) {
            return NaN;
          }
        },
        sqrt: {
          tex: "\\sqrt",
          alias: "sqrt",
          needBraces: true,
          powerNearName: false,
          calc: function(x) {
            return Math.sqrt(x);
          }
        },
        racine: {
          alias: "sqrt"
        },
        cos: {
          tex: "\\cos",
          alias: "cos",
          needBraces: false,
          powerNearName: true,
          calc: function(x) {
            return Math.cos(x);
          }
        },
        sin: {
          tex: "\\sin",
          alias: "sin",
          needBraces: false,
          powerNearName: true,
          calc: function(x) {
            return Math.sin(x);
          }
        },
        ln: {
          tex: "\\ln",
          alias: "ln",
          needBraces: false,
          powerNearName: true,
          calc: function(x) {
            return Math.log(x);
          }
        },
        exp: {
          tex: "e^",
          alt: {
            needBraces: false,
            tex: "\\exp",
            powerNearName: true
          },
          alias: "exp",
          needBraces: true,
          powerNearName: false,
          calc: function(x) {
            return Math.exp(x);
          }
        }
      };

      function FunctionNumber(functionName, _operand) {
        this._operand = _operand;
        this._function = FunctionNumber.functions[functionName];
      }

      FunctionNumber.make = function(functionName, operand) {
        var alias;
        if (typeof operand === "number") {
          operand = new RealNumber(operand);
        }
        if (typeof FunctionNumber.functions[functionName] !== "undefined") {
          alias = FunctionNumber.functions[functionName].alias;
          if (alias === "sqrt" && (operand instanceof RealNumber) && operand.isInteger()) {
            return (new RadicalNumber()).insertFactor(operand._value, new RealNumber(1), false);
          }
        }
        return new FunctionNumber(functionName, operand);
      };

      FunctionNumber.exists = function(functionName) {
        return typeof FunctionNumber.functions[functionName] !== "undefined";
      };

      FunctionNumber.cos = function(operand) {
        return this.make("cos", operand);
      };

      FunctionNumber.sin = function(operand) {
        return this.make("sin", operand);
      };

      FunctionNumber.sqrt = function(operand) {
        return this.make("sqrt", operand);
      };

      FunctionNumber.prototype.compositeString = function(options, power) {
        var f_tex, fct_name, opCS, opTex, ref, tex;
        if (options.tex) {
          opCS = this._operand.compositeString(options);
          if (opCS[1]) {
            opTex = opCS[0];
          } else {
            opTex = "-" + opCS[0];
          }
          if (isArray(options.altFunctionTex) && (this._function.alt != null) && (ref = this._function.alias, indexOf.call(options.altFunctionTex, ref) >= 0)) {
            f_tex = this._function.alt;
          } else {
            f_tex = this._function;
          }
          switch (false) {
            case !((power != null) && this._plus && f_tex.powerNearName):
              fct_name = f_tex.tex + "^{" + power + "}";
              power = null;
              break;
            case !((power != null) && !this._plus):
              fct_name = "-" + f_tex.tex;
              break;
            default:
              fct_name = f_tex.tex;
          }
          if (f_tex.needBraces === true) {
            tex = fct_name + "{" + opTex + "}";
          } else {
            tex = fct_name + "\\left(" + opTex + "\\right)";
          }
          if (power != null) {
            tex = "\\left(" + tex + "\\right)^{" + power + "}";
          }
          return [tex, this._plus || (power != null), false, false];
        } else {
          if (power != null) {
            if (this._plus) {
              return ["(" + this._function.alias + "(" + this._operand + "))^" + power, true, false, false];
            } else {
              return ["(-" + this._function.alias + "(" + this._operand + "))^" + power, true, false, false];
            }
          } else {
            return [this._function.alias + "(" + this._operand + ")", this._plus, false, false];
          }
        }
      };

      FunctionNumber.prototype.simplify = function(infos, developp, memeDeno) {
        var sqrt;
        if (infos == null) {
          infos = null;
        }
        if (developp == null) {
          developp = false;
        }
        if (memeDeno == null) {
          memeDeno = false;
        }
        this._operand = this._operand.simplify(infos, developp, memeDeno);
        if (this._function.alias === "sqrt") {
          if ((this._operand instanceof RationalNumber) || (this._operand instanceof RealNumber)) {
            sqrt = this._operand.sqrt(infos);
            if (!this._plus) {
              sqrt.opposite();
            }
            return sqrt;
          }
        }
        if (this._function.alias === "exp") {
          if (this._operand.isNul()) {
            return new RealNumber(1);
          }
          if (this._operand.isOne()) {
            return SymbolManager.makeSymbol("e");
          }
        }
        if (this._function.alias === "ln") {
          if (this._operand.isOne()) {
            return new RealNumber(0);
          }
          if (this._operand.isNegative() || this._operand.isNul()) {
            return new RealNumber();
          }
        }
        return this;
      };

      FunctionNumber.prototype.md = function(operand, div, infos) {
        if (infos == null) {
          infos = null;
        }
        if ((this._function.alias === "sqrt") && (operand instanceof FunctionNumber) && (operand._functionName === "sqrt")) {
          this._operand = this._operand.md(operand._operand, div, infos);
          return this.simplify(infos);
        }
        return FunctionNumber.__super__.md.call(this, operand, div, infos);
      };

      FunctionNumber.prototype.floatify = function(symbols) {
        var base1, x, y;
        x = this._operand.floatify(symbols).float();
        y = typeof (base1 = this._function).calc === "function" ? base1.calc(x) : void 0;
        return new RealNumber(y);
      };

      FunctionNumber.prototype.isFunctionOf = function(symbol) {
        return this._operand.isFunctionOf(symbol);
      };

      FunctionNumber.prototype.degre = function(variable) {
        if (this.isFunctionOf(variable)) {
          return Infinity;
        } else {
          return 0;
        }
      };

      FunctionNumber.prototype.toClone = function() {
        return (new FunctionNumber(this._function.alias, this._operand.toClone())).setPlus(this._plus);
      };

      FunctionNumber.prototype._childAssignValueToSymbol = function(liste) {
        this._operand = this._operand._childAssignValueToSymbol(liste);
        return this;
      };

      FunctionNumber.prototype.getOperand = function() {
        return this._operand;
      };

      FunctionNumber.prototype.getFunction = function() {
        return this._function.alias;
      };

      FunctionNumber.prototype.signature = function() {
        return this.order().compositeString({
          tex: false,
          floatNumber: true
        })[0];
      };

      FunctionNumber.prototype.getPolynomeFactors = function(variable) {
        if (this._operand.isFunctionOf(variable)) {
          return null;
        } else {
          return this;
        }
      };

      FunctionNumber.prototype.derivate = function(variable) {
        var op;
        if (!this._operand.isFunctionOf(variable)) {
          return new RealNumber(0);
        }
        op = this._operand.derivate(variable);
        if (!this._plus) {
          op.opposite();
        }
        switch (this._function.alias) {
          case "cos":
            return op.opposite().md(FunctionNumber.sin(this._operand.toClone()), false).simplify();
          case "sin":
            return op.md(FunctionNumber.cos(this._operand.toClone()), false).simplify();
          case "sqrt":
            return op.md(new RealNumber(2).md(FunctionNumber.sqrt(this._operand.toClone())), true).simplify();
          case "ln":
            return op.md(this._operand.toClone(), true).simplify();
          case "exp":
            return op.md(this.toClone(), false).simplify();
        }
        return new RealNumber();
      };

      FunctionNumber.prototype.facto = function(regex) {
        if (this.toString().match(regex) !== null) {
          return [new RealNumber(1), this.toClone()];
        } else {
          return null;
        }
      };

      FunctionNumber.prototype.replace = function(replacement, needle) {
        return (new FunctionNumber(this._function.alias, this._operand.replace(replacement, needle))).setPlus(this._plus);
      };

      return FunctionNumber;

    })(NumberObject);
    SimpleNumber = (function(superClass) {
      extend(SimpleNumber, superClass);

      function SimpleNumber() {
        return SimpleNumber.__super__.constructor.apply(this, arguments);
      }

      SimpleNumber.prototype.am = function(operand, minus, infos) {
        if (infos == null) {
          infos = null;
        }
        if (operand instanceof SimpleNumber) {
          return this.amSimple(operand, minus, infos);
        }
        return SimpleNumber.__super__.am.call(this, operand, minus, infos);
      };

      SimpleNumber.prototype.md = function(operand, divide, infos) {
        if (infos == null) {
          infos = null;
        }
        if (operand instanceof SimpleNumber) {
          return this.mdSimple(operand, divide, infos);
        }
        if (operand instanceof Monome) {
          return this.toMonome().md(operand, divide, infos);
        }
        return SimpleNumber.__super__.md.call(this, operand, divide, infos);
      };

      SimpleNumber.prototype.isFloat = function() {
        return false;
      };

      SimpleNumber.prototype.isInteger = function() {
        return false;
      };

      SimpleNumber.prototype.isReal = function() {
        return true;
      };

      SimpleNumber.prototype.isImag = function() {
        return false;
      };

      SimpleNumber.prototype.getReal = function() {
        return this;
      };

      SimpleNumber.prototype.getImag = function() {
        return new RealNumber(0);
      };

      SimpleNumber.prototype.applyNumericFunction = function(name) {
        if (!FunctionNumber.exists(name)) {
          return new RealNumber();
        } else {
          return FunctionNumber.make(name, this);
        }
      };

      SimpleNumber.prototype.addSimple = function(operand, infos) {
        if (infos == null) {
          infos = null;
        }
        return this.amSimple(operand, false, infos);
      };

      SimpleNumber.prototype.minusSimple = function(operand, infos) {
        if (infos == null) {
          infos = null;
        }
        return this.amSimple(operand, true, infos);
      };

      SimpleNumber.prototype.amSimple = function(operand, minus, infos) {
        if (infos == null) {
          infos = null;
        }
        return new RealNumber();
      };

      SimpleNumber.prototype.multiplySimple = function(operand, infos) {
        if (infos == null) {
          infos = null;
        }
        return this.mdSimple(operand, false, infos);
      };

      SimpleNumber.prototype.divideSimple = function(operand, infos) {
        if (infos == null) {
          infos = null;
        }
        return this.mdSimple(operand, true, infos);
      };

      SimpleNumber.prototype.mdSimple = function(operand, divide, infos) {
        if (infos == null) {
          infos = null;
        }
        return new RealNumber();
      };

      SimpleNumber.prototype.isOne = function(fact) {
        if (fact == null) {
          fact = 1;
        }
        return false;
      };

      SimpleNumber.prototype.sqrt = function(infos) {
        if (infos == null) {
          infos = null;
        }
        return new RealNumber();
      };

      SimpleNumber.prototype.modulecarreToNumber = function() {
        return this.floatify().modulecarreToNumber();
      };

      SimpleNumber.prototype.signature = function() {
        return "1";
      };

      SimpleNumber.prototype.getPolynomeFactors = function(variable) {
        return this;
      };

      SimpleNumber.prototype.toMonome = function() {
        return new Monome(this);
      };

      SimpleNumber.prototype.derivate = function() {
        return new RealNumber(0);
      };

      SimpleNumber.prototype.intPower = function(exposant) {};

      return SimpleNumber;

    })(NumberObject);
    InftyNumber = (function(superClass) {
      extend(InftyNumber, superClass);

      function InftyNumber(plus) {
        if (arguments.length === 1) {
          this._plus = arguments[0] === true;
        }
      }

      InftyNumber.prototype.compositeString = function(options) {
        if (options.tex) {
          return ["\\infty", this._plus, false, false];
        }
        return ["∞", this._plus, false, false];
      };

      InftyNumber.prototype.simplify = function(infos) {
        if (infos == null) {
          infos = null;
        }
        return this;
      };

      InftyNumber.prototype.inverse = function() {
        return new RealNumber(0);
      };

      InftyNumber.prototype.floatify = function() {
        if (this._plus) {
          return new RealNumber(Number.Infinity);
        } else {
          return new RealNumber(Number.NEGATIVE_INFINITY);
        }
      };

      InftyNumber.prototype.toClone = function() {
        return new InftyNumber(this._plus);
      };

      InftyNumber.prototype.isNul = function() {
        return false;
      };

      InftyNumber.prototype.isPositive = function(orNul) {
        if (orNul == null) {
          orNul = true;
        }
        return this._plus;
      };

      InftyNumber.prototype.isNegative = function(orNul) {
        if (orNul == null) {
          orNul = true;
        }
        return !this._plus;
      };

      InftyNumber.prototype.isNaN = function() {
        return true;
      };

      InftyNumber.prototype.amSimple = function(operand, minus, infos) {
        if (infos == null) {
          infos = null;
        }
        switch (false) {
          case !(operand instanceof InftyNumber):
            if (minus !== (this._plus !== operand._plus)) {
              return new RealNumber();
            } else {
              return this;
            }
            break;
          case !((operand instanceof RadicalNumber) || (operand instanceof ComplexeNumber)):
            if (minus) {
              operand = operand.toClone().opposite();
            }
            return operand.amSimple(this, false, infos);
          case !operand.isNaN():
            return new RealNumber();
        }
        return this;
      };

      InftyNumber.prototype.mdSimple = function(operand, divide, infos) {
        if (infos == null) {
          infos = null;
        }
        if (operand.isNul()) {
          if (divide) {
            return new RealNumber();
          } else {
            if (infos != null) {
              infos.set("MULT_SIMPLE");
            }
            return new RealNumber(0);
          }
        }
        if (divide && (operand instanceof InftyNumber)) {
          return new RealNumber();
        }
        if ((operand instanceof RadicalNumber) || (operand instanceof ComplexeNumber)) {
          if (divide) {
            return operand.toClone().inverse().mdSimple(this, false, infos);
          } else {
            return operand.toClone().mdSimple(this, false, infos);
          }
        }
        if ((infos !== null) && !((operand instanceof RealNumber) || (operand.isOne()))) {
          if (infos != null) {
            infos.set("MULT_SIMPLE");
          }
        }
        this._plus = this._plus === operand.isPositive();
        return this;
      };

      InftyNumber.prototype.isOne = function(fact) {
        if (fact == null) {
          fact = 1;
        }
        return false;
      };

      InftyNumber.prototype.sqrt = function(infos) {
        if (infos == null) {
          infos = null;
        }
        if (this._plus) {
          return this;
        }
        return new RealNumber();
      };

      InftyNumber.prototype.isInteger = function() {
        return false;
      };

      InftyNumber.prototype.isFloat = function() {
        return false;
      };

      InftyNumber.prototype.isReal = function() {
        return true;
      };

      InftyNumber.prototype.getReal = function() {
        return this;
      };

      InftyNumber.prototype.getImag = function() {
        return new RealNumber(0);
      };

      InftyNumber.prototype.compare = function(b, symbols) {
        if (b instanceof InftyNumber && this._plus === b._plus) {
          return 0;
        }
        return InftyNumber.__super__.compare.call(this, b, symbols);
      };

      return InftyNumber;

    })(SimpleNumber);
    RationalNumber = (function(superClass) {
      extend(RationalNumber, superClass);

      function RationalNumber(numerator, denominator) {
        if (numerator instanceof RealNumber) {
          this.numerator = numerator;
        } else {
          this.numerator = new RealNumber(numerator);
        }
        if (typeof denominator === "undefined") {
          this.denominator = new RealNumber(1);
        } else {
          if (denominator instanceof RealNumber) {
            this.denominator = denominator;
          } else {
            this.denominator = new RealNumber(denominator);
          }
        }
        if (this.denominator.isNaN() || this.denominator.isNul()) {
          this.numerator = new RealNumber();
          this.denominator = new RealNumber(1);
        } else if (this.denominator.isNegative()) {
          this.denominator.opposite();
          this.numerator.opposite();
        }
      }

      RationalNumber.prototype.compositeString = function(options) {
        var _den, _num, den, num, out;
        if (options.floatNumber === true) {
          _num = this.numerator.float();
          _den = this.denominator.float();
          return [String(Math.abs(_num) / _den), _num >= 0, false, false];
        }
        num = this.numerator.compositeString(options);
        den = this.denominator.compositeString(options);
        if (den[0] === "1") {
          return num;
        }
        if (options.tex) {
          out = ["\\frac{" + num[0] + "}{" + den[0] + "}", num[1], false, true];
        } else {
          out = [num[0] + "/" + den[0], num[1], false, true];
        }
        return out;
      };

      RationalNumber.prototype.simplify = function(infos) {
        if (infos == null) {
          infos = null;
        }
        if (this.isNaN()) {
          return new RealNumber();
        }
        if (this.isNul()) {
          return new RealNumber(0);
        }
        if (this.isFloat()) {
          if (infos != null) {
            infos.set("APPROX");
          }
          return this.floatify();
        }
        this.reduction(infos);
        if (this.denominator.isOne()) {
          return this.numerator;
        }
        return this;
      };

      RationalNumber.prototype.opposite = function() {
        this.numerator.opposite();
        return this;
      };

      RationalNumber.prototype.inverse = function() {
        var temp;
        if (this.isNaN() || this.isNul()) {
          return new RealNumber();
        }
        temp = this.denominator;
        this.denominator = this.numerator;
        this.numerator = temp;
        if (this.denominator.isNegative()) {
          this.numerator;
          this.denominator;
        }
        return this;
      };

      RationalNumber.prototype.floatify = function() {
        return new RealNumber(this.numerator.float() / this.denominator.float());
      };

      RationalNumber.prototype.isNul = function() {
        return this.numerator.isNul();
      };

      RationalNumber.prototype.isPositive = function() {
        return this.numerator.isPositive();
      };

      RationalNumber.prototype.isNegative = function() {
        return this.numerator.isNegative();
      };

      RationalNumber.prototype.signe = function() {
        return this.numerator.signe();
      };

      RationalNumber.prototype.isNaN = function() {
        return this.numerator.isNaN();
      };

      RationalNumber.prototype.amSimple = function(operand, minus, infos) {
        var new_denominator, new_numerator, op;
        if (infos == null) {
          infos = null;
        }
        op = operand.toClone();
        if (minus) {
          op.opposite();
        }
        if (op instanceof RealNumber) {
          this.numerator = this.numerator.amSimple(op.mdSimple(this.denominator, false), false);
          if (infos != null) {
            infos.set("ADD_SIMPLE");
          }
          return this;
        }
        if (op instanceof RationalNumber) {
          new_denominator = this.denominator.toClone().mdSimple(operand.denominator, false);
          new_numerator = this.numerator.mdSimple(operand.denominator, false).amSimple(op.numerator.mdSimple(this.denominator, false), false);
          this.numerator = new_numerator;
          this.denominator = new_denominator;
          if (infos != null) {
            infos.set("ADD_SIMPLE");
          }
          return this;
        }
        return op.amSimple(this, false, infos);
      };

      RationalNumber.prototype.mdSimple = function(operand, divide, infos) {
        if (infos == null) {
          infos = null;
        }
        if (this.isNaN() || operand.isNaN()) {
          return new RealNumber();
        }
        if (divide && operand.isNul()) {
          return new RealNumber();
        }
        if (operand instanceof RealNumber) {
          if (divide) {
            this.denominator = this.denominator.mdSimple(operand, false, infos);
            if (this.denominator.isNegative()) {
              this.numerator.opposite();
              this.denominator.opposite();
            }
          } else {
            this.numerator = this.numerator.mdSimple(operand, false, infos);
          }
          return this;
        } else if (operand instanceof RationalNumber) {
          if (divide) {
            this.numerator = this.numerator.mdSimple(operand.denominator, false, infos);
            this.denominator = this.denominator.mdSimple(operand.numerator, false, infos);
            if (this.denominator.isNegative()) {
              this.numerator.opposite();
              this.denominator.opposite();
            }
          } else {
            this.numerator = this.numerator.mdSimple(operand.numerator, false, infos);
            this.denominator = this.denominator.mdSimple(operand.denominator, false, infos);
          }
          return this;
        }
        if (divide) {
          return operand.toClone().inverse().mdSimple(this, false, infos);
        }
        return operand.toClone().mdSimple(this, false, infos);
      };

      RationalNumber.prototype.isOne = function(fact) {
        if (fact == null) {
          fact = 1;
        }
        return this.numerator.float() === fact * this.denominator.float();
      };

      RationalNumber.prototype.sqrt = function(infos) {
        if (infos == null) {
          infos = null;
        }
        return this.numerator.sqrt(infos).mdSimple(this.denominator.sqrt(infos), true, infos).simplify(infos);
      };

      RationalNumber.prototype.isInteger = function(strict) {
        if (strict == null) {
          strict = false;
        }
        return (!strict) && this.numerator.isInteger() && this.denominator.isOne();
      };

      RationalNumber.prototype.isFloat = function() {
        return this.numerator.isFloat() || this.denominator.isFloat();
      };

      RationalNumber.prototype.toClone = function() {
        return new RationalNumber(this.numerator.toClone(), this.denominator.toClone());
      };

      RationalNumber.prototype.isSimpleWidthI = function() {
        return true;
      };

      RationalNumber.prototype.testReduction = function() {
        return this.numerator.pgcd(this.denominator) !== 1;
      };

      RationalNumber.prototype.reduction = function(infos) {
        var pgcd;
        if (infos == null) {
          infos = null;
        }
        pgcd = this.numerator.pgcd(this.denominator);
        if (pgcd > 1) {
          if (infos != null) {
            infos.set("RATIO_REDUCTION");
          }
          this.numerator.intDivision(pgcd);
          this.denominator.intDivision(pgcd);
        }
        return this;
      };

      return RationalNumber;

    })(SimpleNumber);
    RadicalNumber = (function(superClass) {
      extend(RadicalNumber, superClass);

      function RadicalNumber() {
        this.factors = [];
        this._basesSimplified = false;
      }

      RadicalNumber.prototype.compositeString = function(options) {
        var _x, aa, base, cs, factor, len, n, ref, strs;
        if (this.isNul()) {
          return ['0', true, false, false];
        }
        if (options.floatNumber === true) {
          _x = this.floatify().float();
          return [String(_x), _x >= 0, false, false];
        }
        this.order();
        strs = [];
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          base = factor.base;
          if (base < 0) {
            cs = factor.value.compositeString(options, "i");
            base = -base;
          } else {
            cs = factor.value.compositeString(options);
          }
          if (cs[0] === "1" && (factor.base !== 1)) {
            cs[0] = "";
          }
          if (base !== 1) {
            if (options.tex) {
              cs[0] = cs[0] + "\\sqrt{" + base + "}";
            } else {
              cs[0] = cs[0] + "sqrt(" + base + ")";
            }
          }
          if (cs[1]) {
            strs.push("+");
          } else {
            strs.push("-");
          }
          strs.push(cs[0]);
        }
        n = strs.length;
        return [strs.slice(1, +(n - 1) + 1 || 9e9).join(""), strs[0] === "+", strs.length > 2, false];
      };

      RadicalNumber.prototype.simplify = function(infos) {
        var aa, factor, i, len, ref;
        if (infos == null) {
          infos = null;
        }
        ref = this.factors;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          factor = ref[i];
          this.factors[i].value = factor.value.simplify(infos);
        }
        if (this.isNaN()) {
          return new RealNumber();
        }
        if (this.isFloat()) {
          if (infos != null) {
            infos.set("APPROX");
          }
          return this.floatify();
        }
        this.extractFactors(infos);
        if (this.isNul()) {
          return new RealNumber(0);
        }
        if ((this.factors.length === 1) && (this.factors[0].base === 1)) {
          return this.factors[0].value;
        }
        return this;
      };

      RadicalNumber.prototype.opposite = function() {
        var aa, factor, len, ref;
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          factor.value.opposite();
        }
        return this;
      };

      RadicalNumber.prototype.inverse = function(infos) {
        var conjugue, denominator, i, n_loops, numerator;
        if (infos == null) {
          infos = null;
        }
        if (this.isNul()) {
          return new RealNumber();
        }
        denominator = this.toClone();
        numerator = new RealNumber(1);
        n_loops = 0;
        while ((denominator.factors.length > 1) && (n_loops < 20)) {
          i = 0;
          while (denominator.factors[i].base === 1) {
            i++;
          }
          conjugue = denominator.toClone().conjugueFactor(i);
          numerator = numerator.mdSimple(conjugue, false, infos);
          denominator = denominator.mdSimple(conjugue, false, infos);
          n_loops++;
        }
        numerator = numerator.mdSimple(denominator, false, infos);
        denominator = denominator.mdSimple(denominator, false, infos).simplify(infos);
        return numerator.mdSimple(denominator, true, infos);
      };

      RadicalNumber.prototype.fractionize = function(op) {
        var aa, ab, base1, factor, i, len, len1, ref, ref1, test, tests;
        if ((op instanceof RealNumber) && !op.isNul()) {
          tests = [];
          ref = this.factors;
          for (aa = 0, len = ref.length; aa < len; aa++) {
            factor = ref[aa];
            test = typeof (base1 = factor.value).fractionize === "function" ? base1.fractionize(op) : void 0;
            if (test == null) {
              return null;
            }
            tests.push(test);
          }
          ref1 = this.factors;
          for (i = ab = 0, len1 = ref1.length; ab < len1; i = ++ab) {
            factor = ref1[i];
            factor.value = tests.shift();
          }
          return this;
        }
        return null;
      };

      RadicalNumber.prototype.floatify = function() {
        var aa, factor, len, ref, total;
        total = new RealNumber(0);
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.base < 0) {
            total = total.amSimple((new ComplexeNumber(0, Math.sqrt(-factor.base))).mdSimple(factor.value.floatify(), false), false);
          } else {
            total = total.amSimple((new RealNumber(Math.sqrt(factor.base))).mdSimple(factor.value.floatify(), false), false);
          }
        }
        return total;
      };

      RadicalNumber.prototype.toClone = function() {
        var aa, clone, factor, len, ref;
        clone = new RadicalNumber();
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          clone.addFactor(factor.base, factor.value.toClone());
        }
        return clone;
      };

      RadicalNumber.prototype.isNul = function() {
        return this.factors.length === 0;
      };

      RadicalNumber.prototype.isNaN = function() {
        var aa, factor, len, ref;
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.value.isNaN()) {
            return true;
          }
        }
        return false;
      };

      RadicalNumber.prototype.isFloat = function() {
        var aa, factor, len, ref;
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.value.isFloat()) {
            return true;
          }
        }
        return false;
      };

      RadicalNumber.prototype.isReal = function() {
        var aa, factor, len, ref;
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.base < 0) {
            return false;
          }
        }
        return true;
      };

      RadicalNumber.prototype.isImag = function() {
        var aa, factor, len, ref;
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.base > 0) {
            return false;
          }
        }
        return true;
      };

      RadicalNumber.prototype.getReal = function() {
        var aa, factor, len, realPart, ref;
        realPart = new RadicalNumber();
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.base > 0) {
            realPart.addFactor(factor.base, factor.value.toClone());
          }
        }
        return realPart.simplify();
      };

      RadicalNumber.prototype.getImag = function() {
        var aa, factor, imaginaryPart, len, ref;
        imaginaryPart = new RadicalNumber();
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.base < 0) {
            imaginaryPart.addFactor(factor.base, factor.value.toClone());
          }
        }
        return imaginaryPart.simplify();
      };

      RadicalNumber.prototype.conjugue = function() {
        var aa, factor, len, ref;
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.base < 0) {
            factor.value.opposite();
          }
        }
        return this;
      };

      RadicalNumber.prototype.amSimple = function(operand, minus, infos) {
        var aa, factor, len, ref;
        if (infos == null) {
          infos = null;
        }
        if (operand instanceof RadicalNumber) {
          ref = operand.factors;
          for (aa = 0, len = ref.length; aa < len; aa++) {
            factor = ref[aa];
            this.addFactor(factor.base, factor.value.toClone(), minus, infos);
          }
        } else {
          this.addFactor(1, operand.toClone(), minus, infos);
        }
        return this;
      };

      RadicalNumber.prototype.mdSimple = function(operand, divide, infos) {
        var aa, ab, ac, factor, len, len1, len2, newbase, o_factor, ref, ref1, ref2, t_factor, total;
        if (infos == null) {
          infos = null;
        }
        if (this.isNul() || operand.isNul()) {
          if (infos != null) {
            infos.set("MULT_SIMPLE");
          }
          return new RealNumber(0);
        }
        if (operand instanceof ComplexeNumber) {
          operand = (new RadicalNumber()).insertFactor(1, operand, false);
        }
        if (divide) {
          operand = operand.toClone().inverse();
        }
        if (operand instanceof RadicalNumber) {
          total = new RadicalNumber();
          ref = operand.factors;
          for (aa = 0, len = ref.length; aa < len; aa++) {
            o_factor = ref[aa];
            ref1 = this.factors;
            for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
              t_factor = ref1[ab];
              newbase = o_factor.base * t_factor.base;
              total.addFactor(newbase, o_factor.value.toClone().mdSimple(t_factor.value, false), (o_factor.base < 0) && (t_factor.base < 0), infos);
            }
          }
          return total;
        }
        ref2 = this.factors;
        for (ac = 0, len2 = ref2.length; ac < len2; ac++) {
          factor = ref2[ac];
          factor.value = factor.value.mdSimple(operand, false, infos);
        }
        return this;
      };

      RadicalNumber.prototype.isOne = function(fact) {
        if (fact == null) {
          fact = 1;
        }
        return (this.factors.length === 1) && (this.factors[0].base === 1) && (this.factors[0].value.isOne(fact));
      };

      RadicalNumber.prototype.sqrt = function(infos) {
        var factor;
        if (infos == null) {
          infos = null;
        }
        if (this.factors.length === 0) {
          return new RealNumber(0);
        }
        if ((this.factors.length === 1) && (this.factors[0].base === 1) && (this.factors[0].value.isInteger())) {
          factor = this.factors.pop();
          this.addFactor(factor.value(), 1);
          return this;
        }
        if (this.isNegative()) {
          return new RealNumber();
        }
        return FunctionNumber.make("sqrt", this);
      };

      RadicalNumber.prototype.order = function() {
        this.factors.sort(function(a, b) {
          if (a.base <= b.base) {
            return 1;
          } else {
            return -1;
          }
        });
        return this;
      };

      RadicalNumber.prototype.isIntegerFactors = function(strict) {
        var aa, factor, flag, len, ref;
        if (strict == null) {
          strict = false;
        }
        flag = true;
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (!factor.value.isInteger(strict)) {
            flag = false;
          }
        }
        return flag;
      };

      RadicalNumber.prototype.isSimpleSqrt = function() {
        if (this.factors.length !== 1) {
          return false;
        }
        if (this.factors[0].base === 1) {
          return false;
        }
        if (!(this.factors[0].value instanceof RealNumber)) {
          return false;
        }
        return this.factors[0].value.isOne();
      };

      RadicalNumber.prototype.isSimpleWidthI = function() {
        if (this.factors.length !== 1) {
          return false;
        }
        if ((this.factors[0].base < 0) || (this.factors[0].base === 1)) {
          return false;
        }
        return true;
      };

      RadicalNumber.prototype.hasBase = function(base) {
        var aa, factor, len, ref;
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          if (factor.base === base) {
            return true;
          }
        }
        return false;
      };

      RadicalNumber.prototype.baseList = function() {
        var aa, factor, len, output, ref;
        output = [];
        ref = this.factors;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          factor = ref[aa];
          output.push(factor.base);
        }
        output.sort();
        return output;
      };

      RadicalNumber.prototype.addFactor = function(base, factor, minus, infos) {
        if (minus) {
          factor.opposite();
        }
        return this.insertFactor(base, factor, true, infos);
      };

      RadicalNumber.prototype.extractFactors = function(infos) {
        var extract, factor, i, j;
        if (infos == null) {
          infos = null;
        }
        if (!this._basesSimplified) {
          i = 0;
          while (i < this.factors.length) {
            factor = this.factors[i];
            extract = extractSquarePart(factor.base);
            if (extract !== 1) {
              if (infos != null) {
                infos.set("RACINE");
              }
              factor.base /= extract * extract;
              factor.value = factor.value.mdSimple(new RealNumber(extract), false);
            }
            j = 0;
            while ((j < i) && (this.factors[j].base !== factor.base)) {
              j++;
            }
            if (j < i) {
              this.factors[j].value.amSimple(factor.value, false, infos);
              this.factors.splice(i, 1);
            } else {
              i++;
            }
          }
          this._basesSimplified = true;
        }
        return this;
      };

      RadicalNumber.prototype.insertFactor = function(base, factor, autoExtract, infos) {
        var aa, ab, ajout_imaginaire, ajout_reel, doExtract, extract, indice, len, len1, ref, ref1, sous_factor;
        if (autoExtract && !this._basesSimplified) {
          this.extractFactors();
        }
        if (!(factor instanceof SimpleNumber)) {
          factor = factor.floatify();
        }
        this._floatValue = null;
        if (base === 0) {
          return this;
        }
        if (autoExtract) {
          extract = extractSquarePart(base);
          if (extract !== 1) {
            base /= extract * extract;
            factor.mdSimple(new RealNumber(extract), false);
            if (infos != null) {
              infos.set("RACINE");
            }
          }
        }
        if (factor instanceof RadicalNumber) {
          if (!autoExtract && !factor._basesSimplified) {
            this._basesSimplified = false;
          }
          doExtract = autoExtract && !factor._basesSimplified;
          if (base === 1) {
            ref = factor.factors;
            for (aa = 0, len = ref.length; aa < len; aa++) {
              sous_factor = ref[aa];
              this.insertFactor(sous_factor.base, sous_factor.value, doExtract, infos);
            }
            return this;
          } else if (base === -1) {
            ref1 = factor.factors;
            for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
              sous_factor = ref1[ab];
              if (sous_factor.base < 0) {
                this.insertFactor(-sous_factor.base, sous_factor.value.opposite(), doExtract, infos);
              } else {
                this.insertFactor(-sous_factor.base, sous_factor.value, doExtract, infos);
              }
            }
            return this;
          } else {
            if (infos != null) {
              infos.set("APPROX");
            }
            factor = factor.floatify();
          }
        }
        if (!autoExtract) {
          this._basesSimplified = false;
        }
        ajout_reel = factor.getReal();
        if (!ajout_reel.isNul()) {
          if (autoExtract) {
            indice = this.indiceOfBase(base);
          } else {
            indice = void 0;
          }
          if (typeof indice === "undefined") {
            this.factors.push({
              base: base,
              value: ajout_reel
            });
          } else {
            if (infos != null) {
              infos.set("ADD_SIMPLE");
            }
            this.factors[indice].value = this.factors[indice].value.amSimple(ajout_reel, false);
            if (this.factors[indice].value.isNul()) {
              this.factors.splice(indice, 1);
            }
          }
        }
        if (!factor.isReal()) {
          ajout_imaginaire = factor.getImag();
          if (base < 0) {
            ajout_imaginaire.opposite();
          }
          if (autoExtract) {
            indice = this.indiceOfBase(-base);
          } else {
            indice = void 0;
          }
          if (typeof indice === "undefined") {
            this.factors.push({
              base: -base,
              value: ajout_imaginaire
            });
          } else {
            if (infos != null) {
              infos.set("ADD_SIMPLE");
            }
            this.factors[indice].value = this.factors[indice].value.amSimple(ajout_imaginaire, false);
            if (this.factors[indice].value.isNul()) {
              this.factors.splice(indice, 1);
            }
          }
        }
        return this;
      };

      RadicalNumber.prototype.conjugueFactor = function(indice) {
        if ((indice >= 0) && (indice < this.factors.length)) {
          this.factors[indice].value.opposite();
        }
        return this;
      };

      RadicalNumber.prototype.indiceOfBase = function(base) {
        var aa, factor, i, len, ref;
        ref = this.factors;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          factor = ref[i];
          if (base === factor.base) {
            return i;
          }
        }
        return void 0;
      };

      RadicalNumber.prototype.floatValue = function() {
        if (this._floatValue === null) {
          this._floatValue = this.floatify();
        }
        return this._floatValue;
      };

      return RadicalNumber;

    })(SimpleNumber);
    FloatNumber = (function(superClass) {
      extend(FloatNumber, superClass);

      function FloatNumber() {
        return FloatNumber.__super__.constructor.apply(this, arguments);
      }

      FloatNumber.prototype._float = false;

      FloatNumber.prototype.float = function(decimals) {
        return NaN;
      };

      FloatNumber.prototype.approx = function(decimals) {
        return new RealNumber();
      };

      return FloatNumber;

    })(SimpleNumber);
    RealNumber = (function(superClass) {
      extend(RealNumber, superClass);

      RealNumber.prototype._value = NaN;

      RealNumber.prototype._float = false;

      function RealNumber(value, fl) {
        var token;
        if (typeof value === "string") {
          token = new TokenNumber(value);
          this._value = token.value;
        } else if (typeof value === "number") {
          this._value = value;
        }
        this._float = !(isInteger(this._value)) || (fl === true);
      }

      RealNumber.prototype.setPlus = function(plus) {
        if (plus) {
          this._value = Math.abs(this._value);
        } else {
          this._value = -Math.abs(this._value);
        }
        return this;
      };

      RealNumber.prototype.signe = function() {
        if (this._value < 0) {
          return -1;
        } else {
          return 1;
        }
      };

      RealNumber.prototype.compositeString = function(options, complement) {
        var multGroup, str_value, v;
        if (complement == null) {
          complement = "";
        }
        if (this.isNaN()) {
          return ["(?)", true, false, false];
        }
        multGroup = complement !== "";
        if (isInfty(this._value)) {
          if (options.tex) {
            return ["\\infty" + complement, this._value > 0, false, multGroup];
          } else {
            return ["∞" + complement, this._value > 0, false, multGroup];
          }
        }
        v = Math.abs(this._value);
        if (this.percent) {
          if (options.tex) {
            str_value = (v * 100) + "\\%";
          } else {
            str_value = (v * 100) + "%";
          }
          if (multGroup) {
            str_value += " " + complement;
          }
        } else {
          if (multGroup) {
            if (v === 1) {
              str_value = complement;
            } else {
              str_value = v + " " + complement;
            }
          } else {
            str_value = String(v);
          }
        }
        return [str_value.replace('.', ","), this._value >= 0, false, multGroup];
      };

      RealNumber.prototype.simplify = function(infos) {
        if (infos == null) {
          infos = null;
        }
        if (isInfty(this._value)) {
          return new InftyNumber(this._value > 0);
        }
        return this;
      };

      RealNumber.prototype.opposite = function() {
        this._value *= -1;
        return this;
      };

      RealNumber.prototype.inverse = function() {
        switch (false) {
          case this._value !== 0:
            this._value = NaN;
            break;
          case !isNaN(this._value):
            break;
          case !this._float:
            this._value = 1 / this._value;
            return this;
          default:
            return new RationalNumber(1, this._value);
        }
        return this;
      };

      RealNumber.prototype.fractionize = function(op) {
        if ((op instanceof RealNumber) && !op.isNul()) {
          return new RationalNumber(this, op.toClone());
        }
        return null;
      };

      RealNumber.prototype.puissance = function(exposant) {
        var exp;
        switch (false) {
          case typeof exposant !== "number":
            exp = exposant;
            break;
          case !(exposant instanceof NumberObject):
            exp = exposant.floatify().float();
            break;
          default:
            exp = NaN;
        }
        if ((this._value === 0) && (exp < 0)) {
          this._value = NaN;
        } else {
          this._value = Math.pow(this._value, exp);
        }
        if (!isInteger(this._value)) {
          this._float = true;
        }
        return this;
      };

      RealNumber.prototype.floatify = function() {
        var out;
        return out = this.toClone().setFloat();
      };

      RealNumber.prototype.approx = function(decimals) {
        if (decimals == null) {
          return this.floatify();
        }
        return new RealNumber(Number(this._value.toFixed(decimals)), true);
      };

      RealNumber.prototype.float = function(decimals) {
        if (decimals == null) {
          return this._value;
        }
        return Number(this._value.toFixed(decimals));
      };

      RealNumber.prototype.toClone = function() {
        return new RealNumber(this._value, this._float);
      };

      RealNumber.prototype.isNul = function() {
        return this._value === 0;
      };

      RealNumber.prototype.isPositive = function() {
        return this._value > 0;
      };

      RealNumber.prototype.isNegative = function() {
        return this._value < 0;
      };

      RealNumber.prototype.isNaN = function() {
        return isNaN(this._value);
      };

      RealNumber.prototype.isInteger = function() {
        return isInteger(this._value);
      };

      RealNumber.prototype.isFloat = function() {
        return this._float;
      };

      RealNumber.prototype.amSimple = function(operand, minus, infos) {
        if (infos == null) {
          infos = null;
        }
        if (this.isNaN()) {
          return this;
        }
        if (operand instanceof RealNumber) {
          if (infos != null) {
            infos.set("ADD_SIMPLE");
          }
          if (minus) {
            this._value -= operand._value;
          } else {
            this._value += operand._value;
          }
          return this;
        }
        if (minus) {
          return operand.toClone().opposite().amSimple(this, false, infos);
        }
        return operand.toClone().amSimple(this, false, infos);
      };

      RealNumber.prototype.mdSimple = function(operand, divide, infos) {
        if (infos == null) {
          infos = null;
        }
        if (this.isNaN()) {
          return this;
        }
        if (!divide) {
          if (this.isOne()) {
            return operand.toClone();
          }
          if (this.isOne(-1)) {
            return operand.toClone().opposite();
          }
          if (this.isNul()) {
            return this;
          }
        }
        if (operand instanceof RealNumber) {
          if (divide) {
            if (operand.isNul()) {
              this._value = NaN;
              return this;
            }
            if (this.isFloat() || operand.isFloat()) {
              this._value /= operand._value;
              if (infos != null) {
                infos.set("APPROX");
              }
              this.setFloat();
              return this;
            }
            if (this._value % operand._value === 0) {
              this._value /= operand._value;
              if (infos != null) {
                infos.set("DIVISION_EXACTE");
              }
              return this;
            }
            return new RationalNumber(this, operand.toClone());
          } else {
            if ((infos !== null) && (this._value !== 1) && (operand._value !== 1)) {
              infos.set("MULT_SIMPLE");
            }
            this._value *= operand._value;
            return this;
          }
        }
        if (divide) {
          return operand.toClone().inverse().mdSimple(this, false, infos);
        }
        return operand.toClone().mdSimple(this, false, infos);
      };

      RealNumber.prototype.isOne = function(fact) {
        if (fact == null) {
          fact = 1;
        }
        return this._value === fact;
      };

      RealNumber.prototype.sqrt = function(infos) {
        var extract, rad;
        if (infos == null) {
          infos = null;
        }
        if (this.isNaN()) {
          return this;
        }
        if (this.isFloat()) {
          if (infos != null) {
            infos.set("APPROX");
          }
          if (this.isPositive()) {
            this._value = Math.sqrt(this._value);
          } else {
            this._value = NaN;
          }
          return this;
        }
        extract = extractSquarePart(this._value);
        if (extract !== 1) {
          if (infos != null) {
            infos.set("RACINE");
          }
        }
        rad = this._value / (extract * extract);
        if (rad !== 1) {
          return (new RadicalNumber()).addFactor(rad, new RealNumber(extract));
        }
        this._value = extract;
        return this;
      };

      RealNumber.prototype.abs = function() {
        if (this._value < 0) {
          this._value *= -1;
        }
        return this;
      };

      RealNumber.prototype.pgcd = function(operand) {
        var i, i1, i2, pgcd;
        if (!(operand instanceof RealNumber)) {
          return void 0;
        }
        if (this.isFloat() || operand.isFloat()) {
          return 1;
        }
        i1 = Math.abs(this._value);
        i2 = Math.abs(operand._value);
        pgcd = 1;
        while ((i1 % 2 === 0) && (i2 % 2 === 0)) {
          i1 /= 2;
          i2 /= 2;
          pgcd *= 2;
        }
        i = 3;
        while (i <= Math.min(i1, i2)) {
          while ((i1 % i === 0) && (i2 % i === 0)) {
            i1 /= i;
            i2 /= i;
            pgcd *= i;
          }
          i += 2;
        }
        return pgcd;
      };

      RealNumber.prototype.ppcm = function(operand) {
        return this._value * operand._value / this.pgcd(operand);
      };

      RealNumber.prototype.intDivision = function(diviseur) {
        var i, plus, signe;
        if (typeof diviseur !== "number") {
          return this;
        }
        plus = (this._value >= 0) === (diviseur >= 0);
        if (plus) {
          signe = 1;
        } else {
          signe = -1;
        }
        diviseur = Math.abs(diviseur);
        this._value = Math.abs(this._value);
        switch (false) {
          case diviseur !== 0:
            this._value = NaN;
            break;
          case !isInteger(diviseur):
            this._value = (this._value - this._value % diviseur) / diviseur * signe;
            break;
          default:
            i = 0;
            while (i * diviseur <= this._value) {
              i++;
            }
            this._value = i - 1;
        }
        return this;
      };

      RealNumber.prototype.isSimpleWidthI = function() {
        return true;
      };

      RealNumber.prototype.modulecarreToNumber = function() {
        return this._value * this._value;
      };

      RealNumber.prototype.setFloat = function() {
        this._float = true;
        return this;
      };

      RealNumber.prototype.setPercent = function(percent) {
        this.percent = percent === true;
        return this;
      };

      RealNumber.prototype.precision = function() {
        var m, p, r, regex, v;
        if (this._value === 0) {
          return 0;
        }
        p = 0;
        v = Math.abs(this._value);
        r = Math.floor(v);
        if ((v - r) !== 0) {
          regex = /^([0-9]+)[.,]?([0-9]*)$/i;
          m = (String(v)).match(regex);
          if (m) {
            p = -m[2].length;
          }
        }
        return p;
      };

      RealNumber.prototype.string_arrondi = function(puissance) {
        var resolution, val;
        if (puissance == null) {
          puissance = 0;
        }
        resolution = Math.pow(10, puissance);
        val = Math.round(this._value / resolution) * resolution;
        if (puissance >= 0) {
          return String(val);
        } else {
          return val.toFixed(-puissance).replace(".", ",");
        }
      };

      return RealNumber;

    })(FloatNumber);
    ComplexeNumber = (function(superClass) {
      extend(ComplexeNumber, superClass);

      function ComplexeNumber(reel, imaginaire) {
        this._reel = new RealNumber(0);
        this._imaginaire = new RealNumber(0);
        this.setValue(reel, true);
        this.setValue(imaginaire, false);
      }

      ComplexeNumber.prototype.signe = function() {
        if (isReal()) {
          return this._reel.signe();
        } else {
          return void 0;
        }
      };

      ComplexeNumber.prototype.compositeString = function(options) {
        var im, re;
        re = this._reel.compositeString(options);
        im = this._imaginaire.compositeString(options);
        if (im[0] === "0") {
          return re;
        }
        if (im[0] === "1") {
          im[0] = "i";
        } else {
          im[0] = im[0] + "i";
          im[3] = true;
        }
        if (re[0] === "0") {
          return im;
        }
        if (im[1]) {
          re[0] = re[0] + "+" + im[0];
        } else {
          re[0] = re[0] + "-" + im[0];
        }
        return [re[0], re[1], true, false];
      };

      ComplexeNumber.prototype.simplify = function(infos) {
        if (infos == null) {
          infos = null;
        }
        this._reel = this._reel.simplify(infos);
        this._imaginaire = this._imaginaire.simplify(infos);
        if (this._imaginaire.isNul()) {
          return this._reel;
        }
        return this;
      };

      ComplexeNumber.prototype.opposite = function() {
        this._reel.opposite();
        this._imaginaire.opposite();
        return this;
      };

      ComplexeNumber.prototype.inverse = function(infos) {
        var conjugue, module2;
        if (infos == null) {
          infos = null;
        }
        conjugue = this.toClone().conjugue();
        module2 = this.toClone().mdSimple(conjugue, false, infos).getReal();
        return conjugue.mdSimple(module2, true, infos);
      };

      ComplexeNumber.prototype.fractionize = function(op) {
        var base1, base2, testIm, testRe;
        if ((op instanceof RealNumber) && !op.isNul()) {
          if (this._reel.isNul()) {
            testRe = this._reel;
          } else if ((testRe = typeof (base1 = this._reel).fractionize === "function" ? base1.fractionize(op) : void 0) == null) {
            return null;
          }
          testIm = typeof (base2 = this._imaginaire).fractionize === "function" ? base2.fractionize(op) : void 0;
          if (testIm != null) {
            this._reel = testRe;
            this._imaginaire = testIm;
            return this;
          }
        }
        return null;
      };

      ComplexeNumber.prototype.floatify = function() {
        if (this.isReal()) {
          return this._reel.floatify();
        }
        return new ComplexeNumber(this._reel.floatify(), this._imaginaire.floatify());
      };

      ComplexeNumber.prototype.approx = function(decimals) {
        return new ComplexeNumber(this._reel.approx(decimals), this._imaginaire.floatify(decimals));
      };

      ComplexeNumber.prototype.float = function(decimals) {
        if (this.isReal()) {
          return this._reel.float(decimals);
        } else {
          return NaN;
        }
      };

      ComplexeNumber.prototype.toClone = function() {
        return new ComplexeNumber(this._reel, this._imaginaire);
      };

      ComplexeNumber.prototype.isNul = function() {
        return this._reel.isNul() && this._imaginaire.isNul();
      };

      ComplexeNumber.prototype.isPositive = function() {
        return this.isReal() && this._reel.isPositive();
      };

      ComplexeNumber.prototype.isNegative = function() {
        return this.isReal() && this._reel.isNegative();
      };

      ComplexeNumber.prototype.isNaN = function() {
        return this._reel.isNaN() || this._imaginaire.isNaN();
      };

      ComplexeNumber.prototype.isInteger = function(strict) {
        if (strict == null) {
          strict = false;
        }
        return this._reel.isInteger(strict) && this._imaginaire.isInteger(strict);
      };

      ComplexeNumber.prototype.isFloat = function() {
        return this._reel.isFloat() || this._imaginaire.isFloat();
      };

      ComplexeNumber.prototype.isReal = function() {
        return this._imaginaire.isNul();
      };

      ComplexeNumber.prototype.isImag = function() {
        return this._reel.isNul();
      };

      ComplexeNumber.prototype.getReal = function() {
        return this._reel;
      };

      ComplexeNumber.prototype.getImag = function() {
        return this._imaginaire;
      };

      ComplexeNumber.prototype.conjugue = function() {
        this._imaginaire.opposite();
        return this;
      };

      ComplexeNumber.prototype.amSimple = function(operand, minus, infos) {
        if (infos == null) {
          infos = null;
        }
        if (operand instanceof RadicalNumber) {
          if (this.isFloat()) {
            if (infos != null) {
              infos.set("APPROX");
            }
            return this.addSimple(operand.floatify(), minus);
          } else {
            return (new RadicalNumber()).insertFactor(1, this).amSimple(operand, minus, infos);
          }
        }
        this._reel = this._reel.amSimple(operand.getReal(), minus, infos);
        this._imaginaire = this._imaginaire.amSimple(operand.getImag(), minus, infos);
        return this;
      };

      ComplexeNumber.prototype.mdSimple = function(operand, divide, infos) {
        var im, op_i, op_r, re;
        if (infos == null) {
          infos = null;
        }
        if (divide) {
          operand = operand.toClone().inverse();
        }
        if (operand instanceof RadicalNumber) {
          return operand.mdSimple(this, false, infos);
        }
        op_r = operand.getReal();
        op_i = operand.getImag();
        re = this._reel.toClone();
        im = this._imaginaire.toClone();
        if (operand.isOne()) {
          return this;
        }
        if (infos != null) {
          infos.set("MULT_SIMPLE");
        }
        this._reel = this._reel.mdSimple(op_r, false).amSimple(this._imaginaire.mdSimple(op_i, false), true);
        this._imaginaire = re.mdSimple(op_i, false).amSimple(im.mdSimple(op_r, false), false);
        return this;
      };

      ComplexeNumber.prototype.isOne = function(fact) {
        if (fact == null) {
          fact = 1;
        }
        return this.isReal() && this._reel.isOne(fact);
      };

      ComplexeNumber.prototype.sqrt = function(infos) {
        if (infos == null) {
          infos = null;
        }
        if (this.isReal()) {
          return this._reel.sqrt(infos);
        }
        return new RealNumber();
      };

      ComplexeNumber.prototype.modulecarreToNumber = function() {
        return this._reel.modulecarreToNumber() + this._imaginaire.modulecarreToNumber();
      };

      ComplexeNumber.prototype.abs = function() {
        return new RealNumber(Math.sqrt(this.modulecarreToNumber()));
      };

      ComplexeNumber.prototype.arg = function(rad) {
        if (rad == null) {
          rad = true;
        }
        return Trigo.aCos(this._reel.floatify().float() / Math.sqrt(this.modulecarreToNumber()), !this._imaginaire.isNegative(), rad);
      };

      ComplexeNumber.prototype.isPur = function() {
        return this._reel.isNul() || this._imaginaire.isNul();
      };

      ComplexeNumber.prototype.setValue = function(value, real) {
        var notReal;
        if (value instanceof NumberObject) {
          if (!(value instanceof SimpleNumber)) {
            value = value.floatify();
          }
        } else {
          value = new RealNumber(value);
        }
        notReal = !value.isReal();
        if (real) {
          this._reel = this._reel.addSimple(value.getReal());
          if (notReal) {
            this._imaginaire = this._imaginaire.addSimple(value.getImag());
          }
        } else {
          this._imaginaire = this._imaginaire.addSimple(value.getReal());
          if (notReal) {
            this._reel = this._reel.addSimple(value.getImag().opposite());
          }
        }
        return this;
      };

      ComplexeNumber.prototype.isI = function() {
        return (this._reel instanceof RealNumber) && this._reel.isNul() && (this._imaginaire instanceof RealNumber) && this._imaginaire.isOne();
      };

      ComplexeNumber.prototype.onlyRealFacts = function() {
        var base1, base2;
        return (typeof (base1 = this._reel).onlyRealFacts === "function" ? base1.onlyRealFacts() : void 0) && (typeof (base2 = this._imaginaire).onlyRealFacts === "function" ? base2.onlyRealFacts() : void 0);
      };

      return ComplexeNumber;

    })(SimpleNumber);
    Collection = (function(superClass) {
      extend(Collection, superClass);

      function Collection(type1, ops) {
        var aa, item, len;
        this.type = type1;
        this._operands = [];
        if (isArray(ops)) {
          for (aa = 0, len = ops.length; aa < len; aa++) {
            item = ops[aa];
            this._operands.push(item);
          }
        }
      }

      Collection.prototype.push = function() {
        var aa, item, len, ref;
        for (aa = 0, len = arguments.length; aa < len; aa++) {
          item = arguments[aa];
          if ((item instanceof Collection) && (item.type === this.type)) {
            (ref = this._operands).push.apply(ref, item._operands);
          } else {
            this._operands.push(item);
          }
        }
        return this;
      };

      Collection.prototype.simplify = function(infos) {
        var aa, i, len, op, ref;
        if (infos == null) {
          infos = null;
        }
        ref = this._operands;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          op = ref[i];
          this._operands[i] = op.simplify(infos);
        }
        return this;
      };

      Collection.prototype.toClone = function() {
        var aa, len, op, out, ref;
        out = new Collection(this.type);
        ref = this._operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          op = ref[aa];
          out.push(op.toClone());
        }
        return out;
      };

      Collection.prototype.tex = function() {
        var op;
        return ((function() {
          var aa, len, ref, results;
          ref = this._operands;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            op = ref[aa];
            results.push(op.tex());
          }
          return results;
        }).call(this)).join(this.type);
      };

      Collection.prototype.toString = function() {
        var op;
        return ((function() {
          var aa, len, ref, results;
          ref = this._operands;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            op = ref[aa];
            results.push(String(op));
          }
          return results;
        }).call(this)).join(this.type);
      };

      Collection.prototype.getOperands = function() {
        return this._operands;
      };

      return Collection;

    })(MObject);
    EnsembleObject = (function(superClass) {
      extend(EnsembleObject, superClass);

      function EnsembleObject() {
        return EnsembleObject.__super__.constructor.apply(this, arguments);
      }

      EnsembleObject.make = function(openingDelimiter, operands, closingDelimiter) {
        var aa, len, op, out;
        out = new Ensemble();
        switch (false) {
          case !((openingDelimiter === "{") && (closingDelimiter === "}")):
            for (aa = 0, len = operands.length; aa < len; aa++) {
              op = operands[aa];
              out.push(op);
            }
            break;
          case !(((openingDelimiter === "[") || (openingDelimiter === "]")) && ((closingDelimiter === "[") || (closingDelimiter === "]")) && (operands.length === 2)):
            out.init(openingDelimiter === "[", operands[0], closingDelimiter === "]", operands[1]);
        }
        return out;
      };

      EnsembleObject.prototype.isEmpty = function() {
        return true;
      };

      EnsembleObject.prototype.contains = function(value) {
        return false;
      };

      EnsembleObject.prototype.tex = function() {
        return "\\varnothing";
      };

      EnsembleObject.prototype.toString = function() {
        return "∅";
      };

      EnsembleObject.prototype.toStringCustom = function(widthPar) {
        if (widthPar == null) {
          widthPar = false;
        }
        return String(this);
      };

      EnsembleObject.prototype.toClone = function() {
        return new EnsembleObject();
      };

      EnsembleObject.prototype.inverse = function() {
        return (new Ensemble()).inverse();
      };

      EnsembleObject.prototype.intersection = function(operand) {
        return this;
      };

      EnsembleObject.prototype.union = function(operand) {
        return operand.toClone();
      };

      EnsembleObject.prototype.simplify = function() {
        return new Ensemble();
      };

      return EnsembleObject;

    })(MObject);
    Union = (function(superClass) {
      extend(Union, superClass);

      function Union() {
        var aa, item, len, ref;
        this._operands = [];
        for (aa = 0, len = arguments.length; aa < len; aa++) {
          item = arguments[aa];
          if (item instanceof Union) {
            (ref = this._operands).push.apply(ref, item._operands);
          } else if (item instanceof EnsembleObject) {
            this._operands.push(item);
          }
        }
      }

      Union.prototype.isEmpty = function() {
        var aa, len, op, ref;
        if (this._operands.length === 0) {
          return true;
        }
        ref = this._operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          op = ref[aa];
          if (!op.isEmpty()) {
            return false;
          }
        }
        return true;
      };

      Union.prototype.contains = function(value) {
        var aa, len, op, ref;
        ref = this._operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          op = ref[aa];
          if (op.contains(value)) {
            return true;
          }
        }
        return false;
      };

      Union.prototype.tex = function(widthPar) {
        var op, out;
        if (widthPar == null) {
          widthPar = false;
        }
        if (this._operands.length === 0) {
          return "\\varnothing";
        } else {
          out = ((function() {
            var aa, len, ref, results;
            ref = this._operands;
            results = [];
            for (aa = 0, len = ref.length; aa < len; aa++) {
              op = ref[aa];
              results.push(op.tex());
            }
            return results;
          }).call(this)).join("\\cup");
          if ((this._operands.length > 1) && widthPar) {
            return "\\left(" + out + "\\right)";
          } else {
            return out;
          }
        }
      };

      Union.prototype.toString = function() {
        var op;
        if (this._operands.length === 0) {
          return "∅";
        } else {
          return ((function() {
            var aa, len, ref, results;
            ref = this._operands;
            results = [];
            for (aa = 0, len = ref.length; aa < len; aa++) {
              op = ref[aa];
              results.push(String(op));
            }
            return results;
          }).call(this)).join("∪");
        }
      };

      Union.prototype.toStringCustom = function(widthPar) {
        if (widthPar == null) {
          widthPar = false;
        }
        if (this._operands.length > 1 && widthPar) {
          return "(" + String(this) + ")";
        } else {
          return String(this);
        }
      };

      Union.prototype.toClone = function() {
        var op;
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Union, (function() {
          var aa, len, ref, results;
          ref = this._operands;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            op = ref[aa];
            results.push(op.toClone());
          }
          return results;
        }).call(this), function(){});
      };

      Union.prototype.inverse = function() {
        return this.simplify().inverse();
      };

      Union.prototype.intersection = function(operand) {
        return new Intersection(this, operand.toClone());
      };

      Union.prototype.union = function(operand) {
        var ref;
        if (operand instanceof Union) {
          (ref = this._operands).push.apply(ref, operand.toClone()._operands);
        } else if (operand instanceof EnsembleObject) {
          this._operands.push(operand.toClone());
        }
        return this;
      };

      Union.prototype.simplify = function(infos) {
        var op, out;
        if (infos == null) {
          infos = null;
        }
        if (this._operands.length === 0) {
          return new Ensemble();
        }
        out = this._operands.pop().simplify();
        while ((op = this._operands.pop())) {
          out = out.union(op.simplify());
        }
        return out;
      };

      return Union;

    })(EnsembleObject);
    Intersection = (function(superClass) {
      extend(Intersection, superClass);

      function Intersection() {
        var aa, item, len, ref;
        this._operands = [];
        for (aa = 0, len = arguments.length; aa < len; aa++) {
          item = arguments[aa];
          if (item instanceof Intersection) {
            (ref = this._operands).push.apply(ref, item._operands);
          } else {
            this._operands.push(item);
          }
        }
      }

      Intersection.prototype.isEmpty = function() {
        if (this._operands.length === 0) {
          return true;
        }
        return this.toClone().simplify().isEmpty();
      };

      Intersection.prototype.contains = function(value) {
        var aa, len, op, ref;
        ref = this._operands;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          op = ref[aa];
          if (!op.contains(value)) {
            return false;
          }
        }
        return true;
      };

      Intersection.prototype.tex = function() {
        var op;
        if (this._operands.length === 0) {
          return "\\varnothing";
        } else {
          return ((function() {
            var aa, len, ref, results;
            ref = this._operands;
            results = [];
            for (aa = 0, len = ref.length; aa < len; aa++) {
              op = ref[aa];
              results.push(op.tex(true));
            }
            return results;
          }).call(this)).join("\\cap");
        }
      };

      Intersection.prototype.toString = function() {
        var op;
        if (this._operands.length === 0) {
          return "∅";
        } else {
          return ((function() {
            var aa, len, ref, results;
            ref = this._operands;
            results = [];
            for (aa = 0, len = ref.length; aa < len; aa++) {
              op = ref[aa];
              results.push(op.toStringCustom(true));
            }
            return results;
          }).call(this)).join("∩");
        }
      };

      Intersection.prototype.toClone = function() {
        var op;
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Intersection, (function() {
          var aa, len, ref, results;
          ref = this._operands;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            op = ref[aa];
            results.push(op.toClone());
          }
          return results;
        }).call(this), function(){});
      };

      Intersection.prototype.inverse = function() {
        return this.simplify().inverse();
      };

      Intersection.prototype.intersection = function(operand) {
        var ref;
        if (operand instanceof Intersection) {
          (ref = this._operands).push.apply(ref, operand.toClone()._operands);
        } else if (operand instanceof EnsembleObject) {
          this._operands.push(operand.toClone());
        }
        return this;
      };

      Intersection.prototype.union = function(operand) {
        return new Union(this, operand.toClone());
      };

      Intersection.prototype.simplify = function(infos) {
        var op, out;
        if (infos == null) {
          infos = null;
        }
        if (this._operands.length === 0) {
          return new Ensemble();
        }
        out = this._operands.pop().simplify();
        while ((op = this._operands.pop())) {
          out.intersection(op.simplify());
        }
        return out;
      };

      return Intersection;

    })(EnsembleObject);
    Ensemble = (function(superClass) {
      extend(Ensemble, superClass);

      function Ensemble() {
        this._liste = [];
      }

      Ensemble.prototype.simplify = function(infos) {
        var aa, len, op, ref;
        if (infos == null) {
          infos = null;
        }
        ref = this._liste;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          op = ref[aa];
          op.value = op.value.simplify(infos);
        }
        return this;
      };

      Ensemble.prototype.setEmpty = function() {
        this._liste = [];
        return this;
      };

      Ensemble.prototype.isEmpty = function() {
        return this._liste.length === 0;
      };

      Ensemble.prototype.insertBorne = function(value, type) {
        var aa, borne, comparaison, i, len, open, ref;
        if (!(value instanceof NumberObject) || !value.isReal()) {
          return this;
        }
        type = (type === true) || (type === "[");
        open = false;
        if (value instanceof InftyNumber) {
          if (value.isPositive()) {
            return this;
          } else {
            type = false;
          }
        }
        ref = this._liste;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          borne = ref[i];
          comparaison = borne.value.compare(value);
          if (comparaison === 0) {
            if (type === borne.type) {
              this._liste.splice(i, 1);
              return this;
            } else if (type) {
              this._liste.splice(i, 0, {
                value: value,
                type: type
              });
              return this;
            }
          } else if (comparaison > 0) {
            this._liste.splice(i, 0, {
              value: value,
              type: type
            });
            return this;
          }
        }
        this._liste.push({
          value: value,
          type: type
        });
        return this;
      };

      Ensemble.prototype.contains = function(value) {
        var aa, borne, comparaison, len, open, ref;
        if (!(value instanceof NumberObject) || !value.isReal()) {
          return false;
        }
        open = false;
        ref = this._liste;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          borne = ref[aa];
          comparaison = borne.value.compare(value);
          if (comparaison === -1) {
            return open;
          }
          if (comparaison === 0) {
            return open !== borne.type;
          }
          open = !open;
        }
        return open;
      };

      Ensemble.prototype.inverse = function() {
        return this.insertBorne(new InftyNumber(false), false);
      };

      Ensemble.prototype.intersection = function(operand) {
        var aa, borne1, borne2, borne_atteinte, comparaison, indice2, len, open1, open2, output, ref;
        if (!(operand instanceof Ensemble)) {
          return this.setEmpty();
        }
        output = new Ensemble();
        if (this.isEmpty() || operand.isEmpty()) {
          return output;
        }
        open1 = open2 = false;
        indice2 = 0;
        ref = this._liste;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          borne1 = ref[aa];
          borne_atteinte = false;
          while ((indice2 < operand._liste.length) && !borne_atteinte) {
            borne2 = operand._liste[indice2];
            comparaison = borne2.value.compare(borne1.value);
            if (comparaison >= 0) {
              borne_atteinte = true;
            }
            if ((comparaison < 0) || ((comparaison === 0) && !borne1.type)) {
              if (open1) {
                output.insertBorne(borne2.value.toClone(), borne2.type);
              }
              open2 = !open2;
              indice2++;
            }
          }
          if (open2) {
            output.insertBorne(borne1.value.toClone(), borne1.type);
          }
          open1 = !open1;
        }
        if (open1) {
          while (indice2 < operand._liste.length) {
            borne2 = operand._liste[indice2];
            output.insertBorne(borne2.value.toClone(), borne2.type);
            indice2++;
          }
        }
        return output;
      };

      Ensemble.prototype.union = function(operand) {
        if (!(operand instanceof Ensemble)) {
          return this;
        }
        if (operand.isEmpty()) {
          return this;
        }
        if (this.isEmpty()) {
          return operand.toClone();
        }
        return this.inverse().intersection(operand.toClone().inverse()).inverse();
      };

      Ensemble.prototype.insertSingleton = function(value) {
        var aa, borne, comparaison, len, open, ref;
        if (typeof value === "number") {
          value = new RealNumber(value);
        }
        if (!(value instanceof NumberObject) || !value.isReal()) {
          return this;
        }
        open = false;
        ref = this._liste;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          borne = ref[aa];
          comparaison = borne.value.compare(value);
          if (comparaison === -1) {
            if (!open) {
              this.insertBorne(value.toClone(), true).insertBorne(value.toClone(), false);
            }
            return this;
          }
          if (comparaison === 0) {
            if (open === borne.type) {
              borne.type = !borne.type;
            }
            return this;
          }
          open = !open;
        }
        if (!open) {
          this.insertBorne(value.toClone(), true).insertBorne(value.toClone(), false);
        }
        return this;
      };

      Ensemble.prototype.init = function(included_ouvrant, valeurOuvrante, included_fermant, valeurFermante) {
        this.setEmpty();
        if (valeurOuvrante.compare(valeurFermante) <= 0) {
          this.insertBorne(valeurOuvrante, included_ouvrant === true);
          this.insertBorne(valeurFermante, included_fermant === false);
        } else {
          this.insertBorne(valeurFermante, included_fermant === true);
          this.insertBorne(valeurOuvrante, included_ouvrant === false);
        }
        return this;
      };

      Ensemble.prototype.toString = function() {
        var aa, borne, borneOpen, intervalles, len, ref, str;
        if (this.isEmpty()) {
          return '∅';
        }
        intervalles = [];
        borneOpen = null;
        ref = this._liste;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          borne = ref[aa];
          if (borneOpen === null) {
            borneOpen = borne;
            if (borne.type) {
              str = "[" + borne.value + ";";
            } else {
              str = "]" + borne.value + ";";
            }
          } else {
            if (borne.value.compare(borneOpen.value) === 0) {
              str = "{" + borne.value + "}";
            } else {
              if (borne.type) {
                str += borne.value + "[";
              } else {
                str += borne.value + "]";
              }
            }
            intervalles.push(str);
            borneOpen = null;
          }
        }
        if (borneOpen !== null) {
          str += "∞[";
          intervalles.push(str);
        }
        return intervalles.join("∪");
      };

      Ensemble.prototype.tex = function() {
        var aa, borne, borneOpen, intervalles, len, ref, str;
        if (this.isEmpty()) {
          return "\\varnothing";
        }
        intervalles = [];
        borneOpen = null;
        ref = this._liste;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          borne = ref[aa];
          if (borneOpen === null) {
            borneOpen = borne;
            if (borne.type) {
              str = "\\left[" + (borne.value.tex()) + ";";
            } else {
              str = "\\left]" + (borne.value.tex()) + ";";
            }
          } else {
            if (borne.type) {
              str += borne.value.tex() + "\\right[";
            } else {
              str += borne.value.tex() + "\\right]";
            }
            intervalles.push(str);
            borneOpen = null;
          }
        }
        if (borneOpen !== null) {
          str += "+\\infty\\right[";
          intervalles.push(str);
        }
        return intervalles.join("\\cup");
      };

      Ensemble.prototype.toClone = function() {
        var aa, borne, clone, len, ref;
        clone = new Ensemble();
        ref = this._liste;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          borne = ref[aa];
          clone.insertBorne(borne.value, borne.type);
        }
        return clone;
      };

      Ensemble.prototype.isEqual = function(oper, tolerance) {
        var aa, i, item, len, ref;
        if (typeof tolerance === "undefined") {
          tolerance = 0;
        }
        if (!(oper instanceof EnsembleObject)) {
          return false;
        }
        if (!(oper instanceof Ensemble)) {
          oper = oper.toClone().simplify();
        }
        if (this._liste.length !== oper._liste.length) {
          return false;
        }
        ref = this._liste;
        for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
          item = ref[i];
          if ((tolerance === 0) && (item.value.compare(oper._liste[i].value) !== 0) || (item.value.distance(oper._liste[i].value) > tolerance)) {
            return false;
          }
          if (item.type !== oper._liste[i].type) {
            return false;
          }
        }
        return true;
      };

      return Ensemble;

    })(EnsembleObject);
    TokenObject = (function() {
      function TokenObject() {}

      TokenObject.prototype.getPriority = function() {
        return 0;
      };

      TokenObject.prototype.acceptOperOnLeft = function() {
        return false;
      };

      TokenObject.prototype.operateOnLeft = function() {
        return false;
      };

      TokenObject.prototype.acceptOperOnRight = function() {
        return false;
      };

      TokenObject.prototype.operateOnRight = function() {
        return false;
      };

      TokenObject.prototype.execute = function(stack) {
        return new MObject();
      };

      return TokenObject;

    })();
    TokenNumber = (function(superClass) {
      extend(TokenNumber, superClass);

      function TokenNumber(str) {
        var i, val;
        switch (false) {
          case typeof str !== "string":
            str = str.replace(/\,/, ".");
            if ((i = str.indexOf("%")) > 0) {
              val = Number(str.substring(0, i));
              val = val / 100;
              this.percent = true;
              this.value = Number(val.toFixed(DECIMAL_MAX_PRECISION));
            } else {
              this.value = Number(Number(str).toFixed(DECIMAL_MAX_PRECISION));
            }
            break;
          case typeof str !== "number":
            this.value = str;
            break;
          default:
            this.value = NaN;
        }
      }

      TokenNumber.prototype.toString = function() {
        return this.value;
      };

      TokenNumber.getRegex = function() {
        return '\\d+[.,]?\\d*(E-?\\d+)?%?';
      };

      TokenNumber.prototype.acceptOperOnLeft = function() {
        return true;
      };

      TokenNumber.prototype.acceptOperOnRight = function() {
        return true;
      };

      TokenNumber.prototype.execute = function(stack) {
        var out;
        out = new RealNumber(this.value);
        if (this.percent) {
          out.setPercent(true);
        }
        return out;
      };

      return TokenNumber;

    })(TokenObject);
    TokenVariable = (function(superClass) {
      extend(TokenVariable, superClass);

      function TokenVariable(name1) {
        this.name = name1;
      }

      TokenVariable.prototype.toString = function() {
        return this.name;
      };

      TokenVariable.getRegex = function() {
        return "[#∞πa-zA-Z_\\x7f-\\xff][a-zA-Z0-9_\\x7f-\\xff]*";
      };

      TokenVariable.prototype.acceptOperOnLeft = function() {
        return true;
      };

      TokenVariable.prototype.acceptOperOnRight = function() {
        return true;
      };

      TokenVariable.prototype.execute = function(stack) {
        return SymbolManager.makeSymbol(this.name);
      };

      return TokenVariable;

    })(TokenObject);
    TokenOperator = (function(superClass) {
      extend(TokenOperator, superClass);

      TokenOperator.prototype.operand1 = null;

      TokenOperator.prototype.operand2 = null;

      function TokenOperator(opType) {
        this.opType = opType;
        if (this.opType === "cdot") {
          this.opType = "*";
        }
      }

      TokenOperator.prototype.toString = function() {
        return this.opType;
      };

      TokenOperator.getRegex = function() {
        return "[\\+\\-\\/\\^÷;]|cdot";
      };

      TokenOperator.prototype.setOpposite = function() {
        this.opType = "0-";
        return this;
      };

      TokenOperator.prototype.getPriority = function() {
        switch (false) {
          case this.opType !== "^":
            return 9;
          case this.opType !== "0-":
            return 8;
          case !((this.opType === "*") || (this.opType === "/") || (this.opType === "÷")):
            return 7;
          case !((this.opType === "+") || (this.opType === "-")):
            return 6;
          default:
            return 1;
        }
      };

      TokenOperator.prototype.acceptOperOnLeft = function() {
        return this.opType === "0-";
      };

      TokenOperator.prototype.operateOnLeft = function() {
        return this.opType !== "0-";
      };

      TokenOperator.prototype.operateOnRight = function() {
        return true;
      };

      TokenOperator.prototype.execute = function(stack) {
        var ref, ref1, ref2, ref3;
        if (this.opType === "0-") {
          return (ref = stack.pop()) != null ? typeof ref.opposite === "function" ? ref.opposite() : void 0 : void 0;
        } else {
          this.operand2 = (ref1 = stack.pop()) != null ? ref1 : new MObject();
          this.operand1 = (ref2 = stack.pop()) != null ? ref2 : new MObject();
          switch (false) {
            case this.opType !== "+":
              return PlusNumber.makePlus([this.operand1, this.operand2]);
            case this.opType !== "-":
              return PlusNumber.makePlus([this.operand1, (ref3 = this.operand2) != null ? typeof ref3.opposite === "function" ? ref3.opposite() : void 0 : void 0]);
            case this.opType !== "*":
              return MultiplyNumber.makeMult([this.operand1, this.operand2]);
            case this.opType !== "/":
              return MultiplyNumber.makeDiv(this.operand1, this.operand2);
            case this.opType !== "÷":
              return MultiplyNumber.makeDiv(this.operand1, this.operand2);
            case this.opType !== "^":
              return PowerNumber.make(this.operand1, this.operand2);
            case this.opType !== ";":
              return new Collection(";", [this.operand1, this.operand2]);
            default:
              return new RealNumber();
          }
        }
      };

      return TokenOperator;

    })(TokenObject);
    TokenFunction = (function(superClass) {
      extend(TokenFunction, superClass);

      TokenFunction.prototype.operand = null;

      function TokenFunction(name1) {
        this.name = name1;
      }

      TokenFunction.prototype.toString = function() {
        return this.name;
      };

      TokenFunction.getRegex = function() {
        return "sqrt|racine|cos|sin|ln|exp|frac";
      };

      TokenFunction.prototype.getPriority = function() {
        return 10;
      };

      TokenFunction.prototype.acceptOperOnLeft = function() {
        return true;
      };

      TokenFunction.prototype.operateOnRight = function() {
        return true;
      };

      TokenFunction.prototype.execute = function(stack) {
        var col, ops;
        if (this.name === "frac") {
          col = stack.pop();
          if (col instanceof Collection) {
            ops = col.getOperands();
            if (ops.length === 2) {
              return MultiplyNumber.makeDiv(ops[0], ops[1]);
            }
          }
          return new RealNumber();
        } else {
          return FunctionNumber.make(this.name, stack.pop());
        }
      };

      return TokenFunction;

    })(TokenObject);
    TokenParenthesis = (function(superClass) {
      extend(TokenParenthesis, superClass);

      function TokenParenthesis(token) {
        this.type = token;
        this.ouvrant = this.type === "(" || this.type === "{";
      }

      TokenParenthesis.prototype.toString = function() {
        return this.type;
      };

      TokenParenthesis.getRegex = function() {
        return "[\\(\\{\\}\\)]";
      };

      TokenParenthesis.prototype.acceptOperOnLeft = function() {
        return this.ouvrant;
      };

      TokenParenthesis.prototype.acceptOperOnRight = function() {
        return !this.ouvrant;
      };

      TokenParenthesis.prototype.isOpeningParenthesis = function() {
        return this.ouvrant;
      };

      TokenParenthesis.prototype.isClosingParenthesis = function() {
        return !this.ouvrant;
      };

      return TokenParenthesis;

    })(TokenObject);
    ParseManager = {
      initOk: false,
      initParse: function() {
        var oToken;
        this.initOk = true;
        this.Tokens = [TokenNumber, TokenParenthesis, TokenOperator, TokenFunction, TokenVariable];
        return this.globalRegex = new RegExp(((function() {
          var aa, len, ref, results;
          ref = this.Tokens;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            oToken = ref[aa];
            results.push("(" + (oToken.getRegex()) + ")");
          }
          return results;
        }).call(this)).join("|"), "gi");
      },
      parse: function(expression, info) {
        var buildArray, correctedTokensList, createToken, matchList, output, rpn, strToken, tokensList;
        if (this.initOk === false) {
          this.initParse();
        }
        if (typeof expression === "string") {
          expression = expression.replace(/\\\\/g, " ");
          expression = expression.replace(/left/g, " ");
          expression = expression.replace(/right/g, " ");
          expression = expression.replace(/\}\{/g, ";");
          expression = expression.replace(/²/g, "^2 ");
          expression = expression.replace(/−/g, "-");
        }
        matchList = expression.match(this.globalRegex);
        if (matchList != null) {
          createToken = function(Tokens, tokenString, info) {
            var aa, len, oToken, regex, tokenStringRegex;
            for (aa = 0, len = Tokens.length; aa < len; aa++) {
              oToken = Tokens[aa];
              if (!(typeof (tokenStringRegex = oToken.getRegex()) === "string")) {
                continue;
              }
              regex = new RegExp(tokenStringRegex, 'i');
              if (regex.test(tokenString)) {
                return new oToken(tokenString);
              }
            }
            info.messages.push("'" + tokenString + "' n'est pas valide.");
            return null;
          };
          tokensList = (function() {
            var aa, len, results;
            results = [];
            for (aa = 0, len = matchList.length; aa < len; aa++) {
              strToken = matchList[aa];
              results.push(createToken(this.Tokens, strToken, info));
            }
            return results;
          }).call(this);
          correctedTokensList = this.correction(tokensList, info);
          switch (false) {
            case correctedTokensList !== null:
              return false;
            case correctedTokensList.length !== 0:
              info.messages.push("Liste de tokens vide");
              return false;
            default:
              rpn = this.buildReversePolishNotation(correctedTokensList);
              buildArray = this.buildObject(rpn);
              output = buildArray.pop();
              switch (false) {
                case !(buildArray.length > 0):
                  info.messages.push("La pile n'est pas vide");
                  return false;
                case !(output instanceof NumberObject):
                  return output;
                default:
                  info.messages.push("Le résultat ne correspond pas à un nombre");
                  return false;
              }
          }
        } else {
          info.messages.push("Vide !");
          return false;
        }
      },
      correction: function(tokens, info) {
        var droite, gauche, oToken, stack;
        if (((function() {
          var aa, len, results;
          results = [];
          for (aa = 0, len = tokens.length; aa < len; aa++) {
            oToken = tokens[aa];
            if (!(oToken instanceof TokenObject)) {
              results.push(oToken);
            }
          }
          return results;
        })()).length > 0) {
          return null;
        }
        gauche = void 0;
        droite = tokens.shift();
        stack = [];
        while ((gauche != null) || (droite != null)) {
          switch (false) {
            case !((((droite != null ? droite.opType : void 0) === "-") || ((droite != null ? droite.opType : void 0) === "+")) && !(gauche != null ? gauche.acceptOperOnRight() : void 0)):
              if ((droite != null ? droite.opType : void 0) === "-") {
                stack.push(gauche = droite.setOpposite());
              }
              droite = tokens.shift();
              break;
            case !((gauche != null ? gauche.acceptOperOnRight() : void 0) && (droite != null ? droite.acceptOperOnLeft() : void 0)):
              stack.push(new TokenOperator("*"), gauche = droite);
              droite = tokens.shift();
              break;
            case !((gauche != null ? gauche.operateOnRight() : void 0) && !(droite != null ? droite.acceptOperOnLeft() : void 0)):
              if (typeof droite === "undefined") {
                info.messages.push(gauche + " en fin de chaîne");
              } else {
                info.messages.push(gauche + " à gauche de " + droite);
              }
              return null;
            case !(!(gauche != null ? gauche.acceptOperOnRight() : void 0) && (droite != null ? droite.operateOnLeft() : void 0)):
              if (typeof gauche === "undefined") {
                info.messages.push(droite + " en début de chaîne");
              }
              info.messages.push(droite + " à droite de " + gauche);
              return null;
            default:
              gauche = droite;
              if (droite != null) {
                stack.push(droite);
              }
              droite = tokens.shift();
          }
        }
        return stack;
      },
      buildReversePolishNotation: function(tokens) {
        var aa, depile, len, rpn, stack, token;
        rpn = [];
        stack = [];
        for (aa = 0, len = tokens.length; aa < len; aa++) {
          token = tokens[aa];
          switch (false) {
            case !(token instanceof TokenNumber):
              rpn.push(token);
              break;
            case !(token instanceof TokenVariable):
              rpn.push(token);
              break;
            case !(token instanceof TokenFunction):
              stack.push(token);
              break;
            case !(token instanceof TokenParenthesis):
              if (token.isOpeningParenthesis()) {
                stack.push(token);
              } else {
                while ((depile = stack.pop()) && !(depile instanceof TokenParenthesis)) {
                  rpn.push(depile);
                }
              }
              break;
            default:
              while ((depile = stack.pop()) && (depile.getPriority() >= token.getPriority())) {
                rpn.push(depile);
              }
              if (depile) {
                stack.push(depile);
              }
              stack.push(token);
          }
        }
        while (depile = stack.pop()) {
          if (!(depile instanceof TokenParenthesis)) {
            rpn.push(depile);
          }
        }
        return rpn;
      },
      buildObject: function(rpn) {
        var stack, token;
        stack = [];
        while (token = rpn.shift()) {
          stack.push(token.execute(stack));
        }
        return stack;
      }
    };
    ParseInfo = (function() {
      ParseInfo.prototype.object = null;

      ParseInfo.prototype.tex = "?";

      ParseInfo.prototype.valid = true;

      ParseInfo.prototype.expression = "";

      function ParseInfo(value, params) {
        var dvp, simp;
        this.simplificationList = [];
        this.messages = [];
        this.context = "";
        this.config = _.extend({
          developp: false,
          simplify: true,
          toLowerCase: false,
          alias: false
        }, params != null ? params : {});
        if (typeof value === "string") {
          this.expression = value;
          if (this.config.toLowerCase) {
            value = value.toLowerCase();
          }
          SymbolManager.setAlias(this.config.alias);
          value = ParseManager.parse(value, this);
          if (value === false) {
            this.setInvalid();
            value = new RealNumber();
          }
        }
        if (value instanceof MObject) {
          this.object = value;
          this.tex = value.tex(this.config);
          if (this.config.developp && (dvp = this.object.developp(this))) {
            this.object = dvp;
          }
          if (this.config.simplify && (simp = this.object.simplify(this))) {
            this.object = simp;
          }
        }
      }

      ParseInfo.prototype.set = function(flag) {
        return this.simplificationList.push(flag + this.context);
      };

      ParseInfo.prototype.setInvalid = function() {
        this.valid = false;
        return this;
      };

      ParseInfo.prototype.setContext = function(context) {
        this.context = "|" + context;
        return this;
      };

      ParseInfo.prototype.clearContext = function() {
        this.context = "";
        return this;
      };

      ParseInfo.prototype.forme = function(authorized) {
        var author;
        if (isArray(authorized)) {
          return (function() {
            var aa, len, results;
            results = [];
            for (aa = 0, len = authorized.length; aa < len; aa++) {
              author = authorized[aa];
              results.push(this.forme(author));
            }
            return results;
          }).call(this);
        }
        this.simplificationList.sort();
        if (arrayIntersect(this.simplificationList, ["ADD_SIMPLE", "DIVISION_EXACTE", "MULT_SIMPLE"]).length > 0) {
          return false;
        }
        if (!(authorized != null ? authorized.distribution : void 0) && (authorized !== "DISTRIBUTION") && arrayIntersect(this.simplificationList, ["DISTRIBUTION", "ADD_REGROUPEMENT", "EXPOSANT_DEVELOPP", "PUISSANCE"]).length > 0) {
          return false;
        }
        if (!(authorized != null ? authorized.racine : void 0) && (authorized !== "RACINE") && (indexOf.call(this.simplificationList, "RACINE") >= 0)) {
          return false;
        }
        if (!(authorized != null ? authorized.fraction : void 0) && (authorized !== "FRACTION") && (indexOf.call(this.simplificationList, "RATIO_REDUCTION") >= 0)) {
          return false;
        }
        return true;
      };

      return ParseInfo;

    })();
    PolynomeMaker = {
      invalid: function(variable) {
        return (new Polynome(variable)).setInvalid();
      },
      unite: function(variable) {
        return new Polynome(variable, [new RealNumber(1)]);
      },
      nul: function(variable) {
        return new Polynome(variable);
      },
      lagrangian: function(liste, variable) {
        var aa, ab, arrPoly_0, arrPoly_i, coeff, i, j, len, ref;
        switch (false) {
          case liste.length !== 0:
            return new Polynome(variable);
          case liste.length !== 1:
            return new Polynome(variable, [liste[0].y]);
          default:
            arrPoly_0 = this.lagrange_base(0, liste);
            for (i = aa = 1, ref = liste.length - 1; 1 <= ref ? aa <= ref : aa >= ref; i = 1 <= ref ? ++aa : --aa) {
              arrPoly_i = this.lagrange_base(i, liste);
              for (j = ab = 0, len = arrPoly_0.length; ab < len; j = ++ab) {
                coeff = arrPoly_0[j];
                arrPoly_0[j] = coeff.am(arrPoly_i[j], false);
              }
            }
            return new Polynome(variable, arrPoly_0);
        }
      },
      lagrange_base: function(index, liste) {
        var aa, ab, coeff, coeffs, dx, i, j, len, m, ref, x0, xi, y0;
        if (liste.length === 0) {
          return [new RealNumber(0)];
        }
        if (liste.length === 1) {
          return [liste[0].y];
        }
        dx = new RealNumber(1);
        coeffs = [new RealNumber(1)];
        x0 = liste[index].x;
        y0 = liste[index].y;
        for (i = aa = 0, ref = liste.length - 1; 0 <= ref ? aa <= ref : aa >= ref; i = 0 <= ref ? ++aa : --aa) {
          if (i !== index) {
            xi = liste[i].x;
            dx = dx.md(x0.toClone().am(xi, true), false);
            m = coeffs.length;
            coeffs[m] = coeffs[m - 1].toClone();
            j = m - 1;
            while (j > 0) {
              coeffs[j] = coeffs[j - 1].toClone().am(coeffs[j].md(xi, false), true);
              j--;
            }
            coeffs[0] = coeffs[0].opposite().md(xi, false);
          }
        }
        for (i = ab = 0, len = coeffs.length; ab < len; i = ++ab) {
          coeff = coeffs[i];
          coeffs[i] = coeff.md(y0, false).md(dx, true).simplify();
        }
        return coeffs;
      },
      width_roots: function(a, roots, variable) {
        var aa, coeffs, degre, indice, len, xi;
        coeffs = [a];
        for (aa = 0, len = roots.length; aa < len; aa++) {
          xi = roots[aa];
          degre = coeffs.length;
          coeffs[degre] = coeffs[degre - 1].toClone();
          indice = degre - 1;
          while (indice > 0) {
            if (typeof coeffs[indice - 1] === "undefined") {
              coeffs[indice] = coeffs[indice].md(xi, false).opposite();
            } else {
              coeffs[indice] = coeffs[indice - 1].toClone().am(coeffs[indice].md(xi, false), true);
            }
            indice--;
          }
          coeffs[0] = coeffs[0].md(xi, false).opposite();
        }
        return new Polynome(variable, coeffs);
      },
      widthCoeffs: function(monomes, variable) {
        return new Polynome(variable, monomes);
      },
      fromNumberObject: function(variable, oNumber) {
        if (oNumber instanceof NumberObject) {
          return new Polynome(variable, this.recursiveFromNumberObject(oNumber.getPolynomeFactors(variable)));
        } else {
          return this.invalid();
        }
      },
      recursiveFromNumberObject: function(oFactors) {
        var aa, ab, ac, ad, add, addArray, addFactor, ae, af, ag, base, i, i1, i2, it, it1, it2, item, j, len, len1, len2, len3, len4, len5, multArray, multFactor, output, ref, ref1;
        switch (false) {
          case oFactors !== null:
            return [new RealNumber()];
          case typeof oFactors !== "number":
            return [new RealNumber(oFactors)];
          case !(oFactors instanceof NumberObject):
            return [oFactors];
          case oFactors.add == null:
            output = [];
            ref = oFactors.add;
            for (aa = 0, len = ref.length; aa < len; aa++) {
              addFactor = ref[aa];
              addArray = this.recursiveFromNumberObject(addFactor);
              while (output.length < addArray.length) {
                output.push(new RealNumber(0));
              }
              for (i = ab = 0, len1 = addArray.length; ab < len1; i = ++ab) {
                item = addArray[i];
                output[i] = output[i].am(item, false);
              }
            }
            return output;
          case oFactors.mult == null:
            if (oFactors.mult.length === 0) {
              return [new RealNumber(1)];
            } else {
              output = this.recursiveFromNumberObject(oFactors.mult.shift());
              while ((multFactor = oFactors.mult.shift()) != null) {
                multArray = this.recursiveFromNumberObject(multFactor);
                add = (function() {
                  var ac, ref1, results;
                  results = [];
                  for (i = ac = 0, ref1 = output.length + multArray.length - 2; 0 <= ref1 ? ac <= ref1 : ac >= ref1; i = 0 <= ref1 ? ++ac : --ac) {
                    results.push(new RealNumber(0));
                  }
                  return results;
                })();
                for (i = ac = 0, len2 = output.length; ac < len2; i = ++ac) {
                  it1 = output[i];
                  for (j = ad = 0, len3 = multArray.length; ad < len3; j = ++ad) {
                    it2 = multArray[j];
                    add[i + j] = add[i + j].am(it1.toClone().md(it2, false), false);
                  }
                }
                output = add;
              }
              return output;
            }
            break;
          case oFactors.power == null:
            switch (false) {
              case oFactors.power !== 0:
                return [new RealNumber(1)];
              case oFactors.power !== 1:
                return this.recursiveFromNumberObject(oFactors.base);
              default:
                base = output = this.recursiveFromNumberObject(oFactors.base);
                output = (function() {
                  var ae, len4, results;
                  results = [];
                  for (ae = 0, len4 = base.length; ae < len4; ae++) {
                    it = base[ae];
                    results.push(it.toClone());
                  }
                  return results;
                })();
                for (i = ae = 2, ref1 = oFactors.power; 2 <= ref1 ? ae <= ref1 : ae >= ref1; i = 2 <= ref1 ? ++ae : --ae) {
                  add = (function() {
                    var af, ref2, results;
                    results = [];
                    for (i = af = 0, ref2 = output.length + base.length - 2; 0 <= ref2 ? af <= ref2 : af >= ref2; i = 0 <= ref2 ? ++af : --af) {
                      results.push(new RealNumber(0));
                    }
                    return results;
                  })();
                  for (i1 = af = 0, len4 = output.length; af < len4; i1 = ++af) {
                    it1 = output[i1];
                    for (i2 = ag = 0, len5 = base.length; ag < len5; i2 = ++ag) {
                      it2 = base[i2];
                      add[i1 + i2] = add[i1 + i2].am(it1.toClone().md(it2, false), false);
                    }
                  }
                  output = add;
                }
                return output;
            }
            break;
          case oFactors.monome == null:
            output = (function() {
              var ah, ref2, results;
              results = [];
              for (i = ah = 1, ref2 = oFactors.monome; 1 <= ref2 ? ah <= ref2 : ah >= ref2; i = 1 <= ref2 ? ++ah : --ah) {
                results.push(new RealNumber(0));
              }
              return results;
            })();
            output.push(oFactors.factor);
            return output;
          default:
            return [];
        }
      }
    };
    Polynome = (function() {
      Polynome.prototype._isValidPolynome = true;

      function Polynome(variable, monomes) {
        var aa, i, len, m;
        this._monomes = [];
        if (typeof variable === "string") {
          this._variable = variable;
        } else {
          this._variable = "x";
        }
        if (monomes != null) {
          for (i = aa = 0, len = monomes.length; aa < len; i = ++aa) {
            m = monomes[i];
            this.addMonome(i, m);
          }
        }
      }

      Polynome.prototype.getVariable = function() {
        return this._variable;
      };

      Polynome.prototype.toString = function() {
        var aa, arrOut, cs, i, len, monome, power, ref, sign, str, text;
        if (this.isNul()) {
          return "0";
        }
        arrOut = [];
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          cs = monome.coeff.compositeString({
            tex: false
          });
          power = (function() {
            var ab, ref1;
            switch (monome.power) {
              case 0:
                return "1";
              case 1:
                return this._variable;
              default:
                str = this._variable;
                for (i = ab = 2, ref1 = monome.power; 2 <= ref1 ? ab <= ref1 : ab >= ref1; i = 2 <= ref1 ? ++ab : --ab) {
                  str += "*" + this._variable;
                }
                return str;
            }
          }).call(this);
          sign = (function() {
            switch (false) {
              case cs[1] !== false:
                return "-";
              case !(cs[1] && (arrOut.length > 0)):
                return "+";
              default:
                return "";
            }
          })();
          text = (cs[0] === "1") && (power !== "1") ? "" : cs[0];
          if (power !== "1") {
            if (text !== "") {
              text += "*";
            }
            text += power;
          }
          arrOut.push(sign + text);
        }
        return arrOut.join("");
      };

      Polynome.prototype.toNumberObject = function() {
        var monome, output_arr;
        if (!this.isValid()) {
          return new RealNumber();
        }
        if (this.isNul()) {
          return new RealNumber(0);
        }
        output_arr = (function() {
          var aa, len, ref, results;
          ref = this._monomes;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            monome = ref[aa];
            results.push(new Monome(monome.coeff.toClone(), {
              name: this._variable,
              power: monome.power
            }));
          }
          return results;
        }).call(this);
        return PlusNumber.makePlus(output_arr);
      };

      Polynome.prototype.tex = function(config) {
        var a, aa, b, c, canonique, cs, cs0, len, monome, options, output, ref, variable, xS, yS;
        options = mergeObj({
          tex: true,
          canonique: false
        }, config);
        canonique = (options.canonique === true) && (this.degre() === 2);
        variable = options.variable || this._variable;
        switch (false) {
          case !canonique:
            a = this.getCoeff(2);
            b = this.getCoeff(1);
            c = this.getCoeff(0);
            xS = b.toClone().opposite().md((new RealNumber(2)).md(a, false), true).simplify();
            yS = this.calc(xS);
            if (!xS.isNul()) {
              cs = xS.compositeString(options);
              output = "\\left(" + variable;
              if (cs[1]) {
                output = output + "-";
              } else {
                output = output + "+";
              }
              output = output + cs[0] + "\\right)^2";
            } else {
              output = variable + "^2";
            }
            cs = a.compositeString(options);
            if (cs[0] !== "1") {
              output = cs[0] + output;
            }
            if (!cs[1]) {
              output = "-" + output;
            }
            if (!yS.isNul()) {
              cs = yS.compositeString(options);
              if (cs[1]) {
                output = output + "+" + cs[0];
              } else {
                output = output + "-" + cs[0];
              }
            }
            break;
          default:
            if (this.isNul()) {
              return "0";
            }
            this.unsort();
            cs0 = this.monomeToTex(this._monomes[0], options);
            output = cs0[0];
            if (this._monomes.length === 1) {
              return output;
            }
            ref = this._monomes.slice(1, +(this._monomes.length - 1) + 1 || 9e9);
            for (aa = 0, len = ref.length; aa < len; aa++) {
              monome = ref[aa];
              cs = this.monomeToTex(monome, options);
              if (cs[1]) {
                output = output + "+";
              }
              output = output + cs[0];
            }
        }
        return output;
      };

      Polynome.prototype.monomeToTex = function(monome, options) {
        var cs, output, variable;
        variable = options.variable || this._variable;
        cs = monome.coeff.compositeString(options);
        if (cs[1]) {
          output = "";
        } else {
          output = "-";
        }
        if (cs[0] !== "1") {
          output = output + cs[0];
          if (cs[2] && (monome.power > 0)) {
            output = "\\left(" + output + "\\right)";
          }
        }
        if ((monome.power === 0) && (cs[0] === "1")) {
          output = output + "1";
        }
        if (monome.power > 0) {
          output = output + variable;
        }
        if (monome.power > 1) {
          output = output + "^{" + monome.power + "}";
        }
        return [output, cs[1]];
      };

      Polynome.prototype.simplify = function() {
        var i;
        i = 0;
        while (i < this._monomes.length) {
          if (this._monomes[i].coeff.isNul()) {
            this._monomes.splice(i, 1);
          } else {
            this._monomes[i].coeff = this._monomes[i].coeff.simplify();
            i++;
          }
        }
        return this;
      };

      Polynome.prototype.cleanUpperZeros = function() {
        var i;
        i = 0;
        while (i < this._monomes.length) {
          if (this._monomes[i].coeff.isNul()) {
            this._monomes.splice(i, 1);
          } else {
            i++;
          }
        }
        return this;
      };

      Polynome.prototype.isNul = function() {
        return this._monomes.length === 0;
      };

      Polynome.prototype.isReal = function() {
        var aa, len, monome, ref;
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          if (!monome.coeff.isReal()) {
            return false;
          }
        }
        return true;
      };

      Polynome.prototype.minus = function(operand) {
        return this.add(operand, true);
      };

      Polynome.prototype.add = function(operand, minus) {
        var aa, len, monome, ref;
        if (minus == null) {
          minus = false;
        }
        if (!(operand instanceof Polynome) || !this._isValidPolynome || !operand._isValidPolynome) {
          return this.setInvalid();
        }
        ref = operand._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          this.addMonome(monome.power, monome.coeff, minus);
        }
        return this;
      };

      Polynome.prototype.assignValueToSymbol = function(liste) {
        var aa, key, len, monome, ref, value;
        for (key in liste) {
          value = liste[key];
          switch (false) {
            case typeof value !== "number":
              liste[key] = new RealNumber(value);
              break;
            case !((value instanceof NumberObject) && (value.isFunctionOf().length > 0)):
              liste[key] = new RealNumber();
          }
        }
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          monome.coeff = monome.coeff._childAssignValueToSymbol(liste);
        }
        return this;
      };

      Polynome.prototype.floatify = function(symbols) {
        var aa, len, monome, power, ref, total, x, x_value, xp;
        if (!this._isValidPolynome) {
          return new RealNumber();
        }
        x_value = symbols != null ? symbols[this._variable] : void 0;
        if (x_value instanceof NumberObject) {
          if (x_value.isFunctionOf(this._variable)) {
            return new RealNumber();
          }
          x = x_value.floatify(symbols);
        } else {
          x = new RealNumber(x_value);
        }
        total = new RealNumber(0);
        this.sort();
        xp = new RealNumber(1);
        power = 0;
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          while (power < monome.power) {
            xp = xp.md(x, false);
            power++;
          }
          total = total.am(monome.coeff.floatify(symbols).md(xp, false), false);
        }
        return total;
      };

      Polynome.prototype.calc = function(x) {
        var aa, len, monome, out, power, ref, xpow;
        if (!this._isValidPolynome) {
          return new RealNumber();
        }
        if (x.isFunctionOf(this._variable)) {
          return new RealNumber;
        }
        this.sort();
        xpow = new RealNumber(1);
        power = 0;
        out = new RealNumber(0);
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          while (power < monome.power) {
            xpow = xpow.md(x, false);
            power++;
          }
          out = out.am(monome.coeff.toClone().md(xpow, false), false);
        }
        return out.simplify();
      };

      Polynome.prototype.sort = function() {
        this._monomes.sort(function(a, b) {
          if (a.power >= b.power) {
            return 1;
          }
          return -1;
        });
        return this;
      };

      Polynome.prototype.unsort = function() {
        this._monomes.sort(function(a, b) {
          if (a.power >= b.power) {
            return -1;
          }
          return 1;
        });
        return this;
      };

      Polynome.prototype.module = function(symbols) {
        var aa, coeffDegreMax, coeffFloatified, degre, len, module, monome, ref;
        module = new RealNumber(0);
        coeffDegreMax = null;
        degre = -1;
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          coeffFloatified = monome.coeff.floatify(null, symbols).abs();
          module = module.am(coeffFloatified, false);
          if (monome.power > degre) {
            degre = monome.power;
            coeffDegreMax = coeffFloatified;
          }
        }
        if (degre !== -1) {
          module = module.md(coeffDegreMax, true);
        }
        return module;
      };

      Polynome.prototype.degre = function() {
        var aa, degre, len, monome, ref;
        degre = 0;
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          if (monome.power > degre) {
            degre = monome.power;
          }
        }
        return degre;
      };

      Polynome.prototype.min_exp = function() {
        var aa, len, monome, output, ref;
        if (this._monomes.length === 0) {
          return 0;
        }
        output = this._monomes[0].power;
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          if (!monome.power < output) {
            output = monome.power;
          }
        }
        return output;
      };

      Polynome.prototype.getCoeff = function(power) {
        var aa, len, monome, ref;
        if (isInteger(power) && (power >= 0)) {
          ref = this._monomes;
          for (aa = 0, len = ref.length; aa < len; aa++) {
            monome = ref[aa];
            if (monome.power === power) {
              return monome.coeff;
            }
          }
        }
        return new RealNumber(0);
      };

      Polynome.prototype.getRank = function(power) {
        var aa, len, monome, rank, ref;
        if (isInteger(power) && (power >= 0)) {
          ref = this._monomes;
          for (rank = aa = 0, len = ref.length; aa < len; rank = ++aa) {
            monome = ref[rank];
            if (monome.power === power) {
              return rank;
            }
          }
        }
        return void 0;
      };

      Polynome.prototype.isValid = function() {
        return this._isValidPolynome;
      };

      Polynome.prototype.toClone = function() {
        var aa, clone, len, monome, ref;
        clone = new Polynome(this._variable);
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          clone.addMonome(monome.power, monome.coeff);
        }
        if (!this._isValidPolynome) {
          clone.setInvalid();
        }
        return clone;
      };

      Polynome.prototype.addMonome = function(power, coeff, minus) {
        var rank;
        if (minus == null) {
          minus = false;
        }
        if (!this.isValid()) {
          return this;
        }
        if (!isInteger(power) || (power < 0)) {
          return this;
        }
        if (!coeff.isFunctionOf(this._variable)) {
          rank = this.getRank(power);
          if (typeof rank !== "undefined") {
            this._monomes[rank].coeff = this._monomes[rank].coeff.am(coeff, minus);
          } else {
            this._monomes.push({
              power: power,
              coeff: minus ? coeff.toClone().opposite() : coeff.toClone()
            });
          }
          return this.cleanUpperZeros();
        }
      };

      Polynome.prototype.setInvalid = function() {
        if (!this._isValidPolynome) {
          this._isValidPolynome = false;
          this._monomes = [];
        }
        return this;
      };

      Polynome.prototype.derivate = function() {
        var aa, len, monome, output, ref;
        output = new Polynome(this._variable);
        if (!this._isValidPolynome) {
          return output.setInvalid();
        }
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          if (monome.power > 0) {
            output.addMonome(monome.power - 1, (new RealNumber(monome.power)).md(monome.coeff, false));
          }
        }
        return output;
      };

      Polynome.prototype.solve_dichotomy = function(a, b, decimals, offset) {
        var A, B, M, m, output, precision;
        if (offset == null) {
          offset = 0;
        }
        if (!this._isValidPolynome || !this.isReal()) {
          return void 0;
        }
        A = this.floatify({
          x: a
        }).float() - offset;
        B = this.floatify({
          x: b
        }).float() - offset;
        if (A === 0) {
          return a;
        }
        if (B === 0) {
          return b;
        }
        if (A * B > 0) {
          return void 0;
        }
        if (!isInteger(decimals) || (decimals < 1)) {
          decimals = 1;
        }
        if (decimals > SOLVE_MAX_PRECISION) {
          decimals = SOLVE_MAX_PRECISION;
        }
        precision = Math.pow(10, -decimals);
        while (Math.abs(A - B) > precision) {
          m = (a + b) / 2;
          M = this.floatify({
            x: m
          }).float() - offset;
          if (M === 0) {
            return m;
          }
          if (A * M > 0) {
            a = m;
            A = M;
          } else {
            b = m;
            B = M;
          }
        }
        output = (a + b) / 2;
        return Number(output.toFixed(decimals));
      };

      Polynome.prototype.majorant_racines = function(offset) {
        var aa, coeff, coeffDominant, coeffs, len, monome, ref;
        coeffs = [-offset];
        ref = this._monomes;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          monome = ref[aa];
          coeff = monome.coeff.floatify().float();
          if (coeffs[monome.power] != null) {
            coeffs[monome.power] += coeff;
          } else {
            coeffs[monome.power] = coeff;
          }
        }
        coeffDominant = 0;
        while (coeffDominant === 0) {
          coeffDominant = coeffs.pop();
        }
        if (coeffs.length === 0) {
          return 0;
        }
        return Math.max.apply(Math, (function() {
          var ab, len1, results;
          results = [];
          for (ab = 0, len1 = coeffs.length; ab < len1; ab++) {
            coeff = coeffs[ab];
            results.push(1 + Math.abs(coeff / coeffDominant));
          }
          return results;
        })());
      };

      Polynome.prototype.solve_numeric = function(borne_inf, borne_sup, decimals, offset) {
        var a, aa, b, len, majorant, racines_derivee, solutions, x;
        if (offset == null) {
          offset = 0;
        }
        if (!this._isValidPolynome || !this.isReal()) {
          return null;
        }
        if (this.degre() === 0) {
          return [];
        }
        majorant = this.majorant_racines(offset);
        if (borne_inf != null) {
          borne_inf = Math.max(borne_inf, -majorant);
        } else {
          borne_inf = -majorant;
        }
        if (borne_sup != null) {
          borne_sup = Math.min(borne_sup, majorant);
        } else {
          borne_sup = majorant;
        }
        if (this.degre() === 1) {
          this.sort();
          x = -this._monomes[0].coeff.floatify().float() / this._monomes[1].coeff.floatify().float();
          if ((x >= borne_inf) && (x <= borne_sup)) {
            return [x];
          } else {
            return [];
          }
        }
        racines_derivee = this.derivate().solve_numeric(borne_inf, borne_sup, decimals);
        a = borne_inf;
        racines_derivee.push(borne_sup);
        solutions = [];
        for (aa = 0, len = racines_derivee.length; aa < len; aa++) {
          b = racines_derivee[aa];
          if ((b > a) && (b <= borne_sup)) {
            x = this.solve_dichotomy(a, b, decimals, offset);
            if (typeof x !== "undefined") {
              solutions.push(x);
            }
            a = b;
          }
        }
        return solutions;
      };

      Polynome.prototype.solveExact = function(value, imag) {
        var a, b, c, delta, neg, sq, x0;
        switch (false) {
          case this.degre() !== 1:
            a = this.getCoeff(1);
            b = this.getCoeff(0).toClone().am(value, true);
            return [b.opposite().md(a, true)];
          case this.degre() !== 2:
            a = this.getCoeff(2);
            b = this.getCoeff(1);
            c = this.getCoeff(0).toClone().am(value, true);
            delta = b.toClone().md(b, false).am((new RealNumber(4)).md(a, false).md(c, false), true).simplify();
            neg = false;
            if (delta.isNegative()) {
              if (imag) {
                neg = true;
                delta.opposite();
              } else {
                return [];
              }
            }
            x0 = b.toClone().opposite().md((new RealNumber(2)).md(a, false), true).simplify();
            if (delta.isNul()) {
              return [x0];
            }
            sq = delta.sqrt().md((new RealNumber(2)).md(a, false), true);
            if (neg) {
              sq = sq.md(new ComplexeNumber(0, 1), false);
            }
            return [x0.toClone().am(sq, true).simplify(), x0.toClone().am(sq, false).simplify()];
          default:
            return this.solve_numeric(null, null, 10, 0);
        }
      };

      Polynome.prototype.discriminant = function() {
        var a, b, c;
        if (this.degre() !== 2) {
          return new RealNumber();
        }
        a = this.getCoeff(2);
        b = this.getCoeff(1);
        c = this.getCoeff(0);
        return b.toClone().md(b, false).am((new RealNumber(4)).md(a, false).md(c, false), true).simplify();
      };

      return Polynome;

    })();
    Vector = (function() {
      function Vector(name1, coords) {
        this.name = name1;
        this.x = coords.x;
        this.y = coords.y;
        if (coords.z != null) {
          this.z = coords.z;
        } else {
          this.z = null;
        }
      }

      Vector.prototype.setName = function(name) {
        this.name = name;
        return this;
      };

      Vector.prototype.toClone = function(newName) {
        var ref;
        if (typeof newName !== "string") {
          newName = this.name;
        }
        return new Vector(newName, {
          x: this.x.toClone(),
          y: this.y.toClone(),
          z: (ref = this.z) != null ? ref.toClone() : void 0
        });
      };

      Vector.prototype.sameAs = function(oVec, axe) {
        if (typeof axe === "undefined") {
          return this.sameAs(oVec, "x") && this.sameAs(oVec, "y") && this.sameAs(oVec, "z");
        }
        if (axe === "z") {
          if ((this.z === null) && (oVec.z === null)) {
            return true;
          }
          if ((this.z !== null) && (oVec.z !== null)) {
            return this.z.toClone().am(oVec.z, true).simplify().isNul();
          }
          return false;
        }
        return this[axe].toClone().am(oVec[axe], true).simplify().isNul();
      };

      Vector.prototype.plus = function(oVec) {
        return this.am(oVec, false);
      };

      Vector.prototype.minus = function(oVec) {
        return this.am(oVec, true);
      };

      Vector.prototype.am = function(oVec, sub) {
        if (sub == null) {
          sub = false;
        }
        this.x = this.x.am(oVec.x, sub);
        this.y = this.y.am(oVec.y, sub);
        if ((this.z === null) || (oVec.z === null)) {
          this.z = null;
        } else {
          this.z = this.z.am(oVec.z, sub);
        }
        return this;
      };

      Vector.prototype.mdNumber = function(numObj, div) {
        if (div == null) {
          div = false;
        }
        this.x = this.x.md(numObj, div);
        this.y = this.y.md(numObj, div);
        if (this.z !== null) {
          this.z = this.z.md(numObj, div);
        }
        return this;
      };

      Vector.prototype.milieu = function(oVec, milName) {
        return this.toClone(milName).am(oVec, false).mdNumber(new RealNumber(2), true);
      };

      Vector.prototype.symetrique = function(centre, symName) {
        return centre.toClone(symName).mdNumber(new RealNumber(2), false).am(this, true);
      };

      Vector.prototype.texSum = function(name) {
        var coeff, coeffs, cx, cy, cz, fct_format, i, out;
        cx = this.x.compositeString({
          tex: true
        });
        cy = this.y.compositeString({
          tex: true
        });
        if (this.z) {
          cz = this.z.compositeString({
            tex: true
          });
        } else {
          cz = ["0", true, false, false];
        }
        coeffs = [cx, cy, cz];
        fct_format = function(coeff, indice) {
          var out, vectors;
          vectors = ["\\vec{i}", "\\vec{j}", "\\vec{k}"];
          if (coeff[0] === "1") {
            out = vectors[indice];
          } else {
            out = coeff[0] + "\\cdot" + vectors[indice];
          }
          if (coeff[1]) {
            return "+" + out;
          } else {
            return "-" + out;
          }
        };
        out = (function() {
          var aa, len, results;
          results = [];
          for (i = aa = 0, len = coeffs.length; aa < len; i = ++aa) {
            coeff = coeffs[i];
            if (coeff[0] !== "0") {
              results.push(fct_format(coeff, i));
            }
          }
          return results;
        })();
        if (out.length === 0) {
          out = "\\vec{0}";
        } else {
          out = out.join("").substr(1);
        }
        if (name === true) {
          return this.name + " = " + out;
        }
        if (name) {
          return name + " = " + out;
        }
        return out;
      };

      Vector.prototype.texColumn = function() {
        var output;
        output = this.name + ("\\begin{pmatrix} " + (this.x.tex()) + "\\\\ " + (this.y.tex()));
        if (this.z !== null) {
          output += "\\\\ " + (this.z.tex());
        }
        output += "\\end{pmatrix}";
        return output;
      };

      Vector.prototype.texLine = function() {
        var output;
        output = this.name + ("\\left(" + (this.x.tex()) + ";" + (this.y.tex()));
        if (this.z !== null) {
          output += ";" + (this.z.tex());
        }
        output += "\\right)";
        return output;
      };

      Vector.prototype.toString = function() {
        var output;
        output = this.name + ("(" + this.x + ";" + this.y);
        if (this.z !== null) {
          output += ";" + this.z;
        }
        output += ")";
        return output;
      };

      Vector.prototype.texFunc = function(fName) {
        return fName + ("\\left(" + (this.x.tex()) + "\\right) = " + (this.y.tex()));
      };

      Vector.prototype.simplify = function() {
        this.x = this.x.simplify();
        this.y = this.y.simplify();
        if (this.z !== null) {
          this.z = this.z.simplify();
        }
        return this;
      };

      Vector.prototype.aligned = function(B, C) {
        return this.toClone().am(B, true).colinear(this.toClone().am(C, true));
      };

      Vector.prototype.colinear = function(oVec) {
        if (!this.x.toClone().md(oVec.y, false).am(this.y.toClone().md(oVec.x, false), true).isNul()) {
          return false;
        }
        if ((this.z === null) && (oVec.z === null)) {
          return true;
        }
        if ((this.z !== null) && (oVec.z !== null) && this.x.toClone().md(oVec.z, false).am(this.z.toClone().md(oVec.x, false), false)) {
          return true;
        }
        return false;
      };

      Vector.prototype.norme = function() {
        var d2;
        d2 = this.x.toClone().md(this.x, false).am(this.y.toClone().md(this.y, false), false);
        if (this.z !== null) {
          d2 = d2.am(this.z.toClone().md(this.z, false), false);
        }
        return d2.sqrt();
      };

      Vector.prototype.affixe = function() {
        return this.y.toClone().md(new ComplexeNumber(0, 1), false).am(this.x, false);
      };

      Vector.prototype.scalaire = function(v) {
        var out;
        out = this.x.toClone().md(v.x, false).am(this.y.toClone().md(v.y, false), false);
        if (this.z && v.z) {
          out = out.am(this.z.toClone().md(v.z, false), false);
        }
        return out.simplify();
      };

      Vector.prototype.toJSXcoords = function(params) {
        return mM.float([this.x, this.y], params);
      };

      Vector.prototype.save = function(data) {
        data["x" + this.name] = String(this.x);
        data["y" + this.name] = String(this.y);
        if (this.z !== null) {
          data["z" + name] = String(this.z);
        }
        return this;
      };

      return Vector;

    })();
    Droite2D = (function() {
      function Droite2D(param) {
        var vx, vy;
        if (param != null) {
          if (isArray(param)) {
            this.a = param[0];
            this.b = param[1];
            this.c = param[2];
          } else {
            this.a = param.derivate("x");
            this.b = param.derivate("y");
            vx = new Monome(this.a.toClone(), {
              name: "x",
              power: 1
            });
            vy = new Monome(this.b.toClone(), {
              name: "y",
              power: 1
            });
            this.c = vx.am(vy, false).opposite().am(param, false);
          }
        } else {
          this.a = new RealNumber(0);
          this.b = new RealNumber(0);
          this.c = new RealNumber(0);
        }
      }

      Droite2D.prototype.verticale = function() {
        return this.b.isNul();
      };

      Droite2D.prototype.m = function() {
        return this.a.toClone().opposite().md(this.b, true);
      };

      Droite2D.prototype.p = function() {
        return this.c.toClone().opposite().md(this.b, true);
      };

      Droite2D.prototype.k = function() {
        return this.c.toClone().opposite().md(this.a, true);
      };

      Droite2D.prototype.toNumberObject = function() {
        return mM.exec([this.a, "x", "*", this.b, "*", this.c, "+", "+"], {
          simplify: true
        });
      };

      Droite2D.prototype.toString = function() {
        return this.toNumberObject().toString() + "=0";
      };

      Droite2D.prototype.cartesianTex = function() {
        return this.toNumberObject().tex() + "=0";
      };

      Droite2D.prototype.reduiteObject = function(variable) {
        if (this.verticale()) {
          return this.k();
        }
        if (variable == null) {
          variable = "x";
        }
        return mM.exec([this.m(), "symbol:" + variable, "*", this.p(), "+"], {
          simplify: true
        });
      };

      Droite2D.prototype.reduiteTex = function(name) {
        var tag;
        tag = name != null ? name + ":" : "";
        if (this.verticale()) {
          return tag + "x=" + (this.k().tex());
        } else {
          return tag + "y=" + (mM.exec([this.m(), "x", "*", this.p(), "+"], {
            simplify: true
          }).tex());
        }
      };

      Droite2D.prototype.affineTex = function(name, variable, mapsto) {
        var out;
        if (name == null) {
          name = "f";
        }
        if (variable == null) {
          variable = "x";
        }
        if (mapsto == null) {
          mapsto = false;
        }
        if ((name !== "") && mapsto) {
          name = name + ":";
        }
        if (this.verticale()) {
          if (mapsto) {
            return name + variable + "\\mapsto ?";
          } else {
            return name + "(" + variable + ")=?";
          }
        }
        out = this.reduiteObject(variable);
        if (mapsto) {
          return "" + name + variable + "\\mapsto " + (out.tex());
        } else {
          return name + "(" + variable + ")=" + (out.tex());
        }
      };

      Droite2D.prototype.float_distance = function(x, y, params) {
        var _a, _b, _c, ref;
        ref = mM.float([this.a, this.b, this.c], params), _a = ref[0], _b = ref[1], _c = ref[2];
        return Math.abs(_a * x + _b * y + _c) / Math.sqrt(_a * _a + _b * _b);
      };

      Droite2D.prototype.float_y = function(x, params) {
        var _a, _b, _c, ref;
        ref = mM.float([this.a, this.b, this.c], params), _a = ref[0], _b = ref[1], _c = ref[2];
        if (_b === 0) {
          return Number.NaN;
        }
        return (-x * _a - _c) / _b;
      };

      Droite2D.prototype.float_x = function(y, params) {
        var _a, _b, _c, ref;
        ref = mM.float([this.a, this.b, this.c], params), _a = ref[0], _b = ref[1], _c = ref[2];
        if (_a === 0) {
          return Number.NaN;
        }
        return (-y * _b - _c) / _a;
      };

      Droite2D.prototype.float_2_points = function(M, params) {
        var _a, _b, _c, ref;
        ref = mM.float([this.a, this.b, this.c], params), _a = ref[0], _b = ref[1], _c = ref[2];
        if (_b === 0) {
          return [[-_a / _c, -M], [-_a / _c, M]];
        } else {
          return [[-M, (M * _a - _c) / _b], [M, -(M * _a + _c) / _b]];
        }
      };

      Droite2D.prototype.isEqual = function(droite) {
        var d1, d2, d3;
        d1 = this.a.toClone().md(droite.b, false).am(this.b.toClone().md(droite.a, false), true);
        d2 = this.a.toClone().md(droite.c, false).am(this.c.toClone().md(droite.a, false), true);
        d3 = this.b.toClone().md(droite.c, false).am(this.c.toClone().md(droite.b, false), true);
        return d1.isNul() && d2.isNul() && d3.isNul();
      };

      return Droite2D;

    })();
    Proba = (function() {
      function Proba() {}

      Proba.alea = function(input) {
        var g, j, mn, mx, out, sign;
        if (input == null) {
          return 1;
        }
        switch (false) {
          case input !== null:
            return 1;
          case typeof input !== "number":
            return input;
          case (g = input.gaussian) == null:
            return this.gaussianAlea(g);
          case !(((mn = input.min) != null) && ((mx = input.max) != null)):
            sign = input.sign && (Math.random() < 0.5) ? -1 : 1;
            if (isArray(input.no) && (input.no.length > 0)) {
              out = input.no[0];
              j = 0;
              while ((indexOf.call(input.no, out) >= 0) && (j < 10)) {
                if (input.real !== true) {
                  out = sign * Math.floor((Math.random() * (mx + 1 - mn)) + mn);
                } else {
                  out = sign * ((Math.random() * (mx - mn)) + mn);
                }
                j++;
              }
            } else {
              switch (false) {
                case input.real !== true:
                  out = sign * ((Math.random() * (mx - mn)) + mn);
                  break;
                case typeof input.real !== "number":
                  out = fixNumber(sign * (Math.random() * (mx - mn) + mn), input.real);
                  break;
                default:
                  out = sign * Math.floor((Math.random() * (mx + 1 - mn)) + mn);
              }
            }
            if (input.coeff != null) {
              out *= this.alea(input.coeff);
            }
            return out;
          case !isArray(input):
            return input[Math.floor(Math.random() * input.length)];
          default:
            return 1;
        }
      };

      Proba.aleaEntreBornes = function(a, b, sign) {
        if (sign == null) {
          sign = false;
        }
        if (sign) {
          return Math.floor((Math.random() * (b + 1 - a)) + a) * (Math.floor(Math.random() * 2) - .5) * 2;
        } else {
          return Math.floor((Math.random() * (b + 1 - a)) + a);
        }
      };

      Proba.aleaIn = function(liste) {
        return liste[Math.floor(Math.random() * liste.length)];
      };

      Proba.aleaSign = function() {
        return (Math.floor(Math.random() * 2) - .5) * 2;
      };

      Proba.gaussianRepartition = function(z, up) {
        var EXP_MIN_ARG, FORMULA_BREAK, LOWER_TAIL_IS_ONE, UPPER_TAIL_IS_ZERO, output, w, y;
        if (up == null) {
          up = false;
        }
        LOWER_TAIL_IS_ONE = 8.5;
        UPPER_TAIL_IS_ZERO = 16.0;
        FORMULA_BREAK = 1.28;
        EXP_MIN_ARG = -708;
        if (z < 0) {
          up = !up;
          z = -z;
        }
        if ((z <= LOWER_TAIL_IS_ONE) || (up && z <= UPPER_TAIL_IS_ZERO)) {
          y = 0.5 * z * z;
          if (z > FORMULA_BREAK) {
            if (-y > EXP_MIN_ARG) {
              output = .398942280385 * Math.exp(-y) / (z - 3.8052e-8 + 1.00000615302 / (z + 3.98064794e-4 + 1.98615381364 / (z - 0.151679116635 + 5.29330324926 / (z + 4.8385912808 - 15.1508972451 / (z + 0.742380924027 + 30.789933034 / (z + 3.99019417011))))));
            } else {
              output = 0;
            }
          } else {
            output = 0.5 - z * (0.398942280444 - 0.399903438504 * y / (y + 5.75885480458 - 29.8213557808 / (y + 2.62433121679 + 48.6959930692 / (y + 5.92885724438))));
          }
        } else {
          if (up) {
            y = -0.5 * z * z;
            if (y > EXP_MIN_ARG) {
              w = -0.5 / y;
              output = 0.3989422804014327 * Math.exp(y) / (z * (1 + w * (1 + w * (-2 + w * (10 + w * (-74 + w * 706))))));
            } else {
              output = 0;
            }
          } else {
            output = 0.0;
          }
        }
        if (up) {
          return output;
        } else {
          return 1 - output;
        }
      };

      Proba.gaussianDistribution = function(x) {
        return 1 / Math.sqrt(2 * Math.PI) * Math.exp(-.5 * x ^ 2);
      };

      Proba.erfc = function(x) {
        var a, a1, a10, a2, a3, a4, a5, a6, a7, a8, a9, t, z;
        z = Math.abs(x);
        t = 1.0 / (0.5 * z + 1.0);
        a1 = t * 0.17087277 + -0.82215223;
        a2 = t * a1 + 1.48851587;
        a3 = t * a2 + -1.13520398;
        a4 = t * a3 + 0.27886807;
        a5 = t * a4 + -0.18628806;
        a6 = t * a5 + 0.09678418;
        a7 = t * a6 + 0.37409196;
        a8 = t * a7 + 1.00002368;
        a9 = t * a8;
        a10 = -z * z - 1.26551223 + a9;
        a = t * Math.exp(a10);
        if (x < 0.0) {
          a = 2.0 - a;
        }
        return a;
      };

      Proba.erf = function(x) {
        return 1.0 - Proba.erfc(x);
      };

      Proba.erfinv = function(y) {
        var LNof1minusXsqrd, PI_times_a, a, firstTerm, oneMinusXsquared, primaryComp, scaled_R, secondTerm, sign, thirdTerm;
        a = (8 * (Math.PI - 3)) / ((3 * Math.PI) * (4 - Math.PI));
        if (y === 1) {
          return Number.POSITIVE_INFINITY;
        }
        if (y === -1) {
          return Number.NEGATIVE_INFINITY;
        }
        if (Math.abs(y) > 1) {
          return NaN;
        }
        if (y < 0) {
          sign = -1.0;
        } else {
          sign = 1.0;
        }
        oneMinusXsquared = 1.0 - (y * y);
        LNof1minusXsqrd = Math.log(oneMinusXsquared);
        PI_times_a = Math.PI * a;
        firstTerm = Math.pow((2.0 / PI_times_a) + (LNof1minusXsqrd / 2.0), 2);
        secondTerm = LNof1minusXsqrd / a;
        thirdTerm = (2 / PI_times_a) + (LNof1minusXsqrd / 2.0);
        primaryComp = Math.sqrt(Math.sqrt(firstTerm - secondTerm) - thirdTerm);
        scaled_R = sign * primaryComp;
        return scaled_R;
      };

      Proba.phiinv = function(y) {
        return Proba.erfinv(2 * y - 1) * Math.sqrt(2);
      };

      Proba.gaussianAlea = function(params) {
        var config, out, rd;
        config = mergeObj({
          moy: 0,
          std: 1,
          min: Number.NEGATIVE_INFINITY,
          max: Number.POSITIVE_INFINITY,
          delta: 0
        }, params);
        rd = Math.random();
        if (rd === 0) {
          return config.min;
        }
        out = Proba.phiinv(rd) * config.std + config.moy;
        if (out < config.min) {
          return config.min;
        }
        if (out > config.max) {
          return config.max;
        }
        if (config.delta !== 0) {
          out = Math.round(out / config.delta) * config.delta;
        }
        return out;
      };

      Proba.binomial_density = function(n, p, k) {
        var aa, ab, denominator, i_fails, i_success, less, more, numerator, q, ref, result, results, results1;
        if ((p < 0) || (p > 1)) {
          return NaN;
        }
        if ((k > n) || (k < 0)) {
          return 0;
        }
        if (k !== Math.floor(k)) {
          return 0;
        }
        q = 1 - p;
        if (k === 0) {
          return Math.pow(q, n);
        }
        if (k === 1) {
          return n * Math.pow(q, n - 1) * p;
        }
        if (k === n - 1) {
          return n * Math.pow(p, n - 1) * q;
        }
        if (k === n) {
          return Math.pow(p, n);
        }
        i_success = k;
        i_fails = n - k;
        more = Math.max(i_success, i_fails);
        less = Math.min(i_success, i_fails);
        numerator = (function() {
          results = [];
          for (var aa = ref = more + 1; ref <= n ? aa <= n : aa >= n; ref <= n ? aa++ : aa--){ results.push(aa); }
          return results;
        }).apply(this);
        denominator = (function() {
          results1 = [];
          for (var ab = 2; 2 <= less ? ab <= less : ab >= less; 2 <= less ? ab++ : ab--){ results1.push(ab); }
          return results1;
        }).apply(this);
        result = 1;
        while (numerator.length > 0) {
          switch (false) {
            case !(result <= 1):
              result *= numerator.pop();
              break;
            case !(denominator.length > 0):
              result /= denominator.shift();
              break;
            case !(i_success > 0):
              i_success--;
              result *= p;
              break;
            case !(i_fails > 0):
              i_fails--;
              result *= q;
          }
        }
        while (i_success > 0) {
          i_success--;
          result *= p;
        }
        while (i_fails > 0) {
          i_fails--;
          result *= q;
        }
        while (denominator.length > 0) {
          result /= denominator.shift();
        }
        return result;
      };

      Proba.binomial_rep = function(n, p, k) {
        var q, r, u, v;
        if ((p < 0) || (p > 1)) {
          return NaN;
        }
        q = 1 - p;
        if (k >= n) {
          return 1;
        }
        if (k < 0) {
          return 0;
        }
        k = Math.floor(k);
        if (k === 0) {
          return Math.pow(q, n);
        }
        if (k === 1) {
          return Math.pow(q, n - 1) * (q + n * p);
        }
        if (k === n - 1) {
          return 1 - Math.pow(p, n);
        }
        u = 1;
        v = 1;
        r = n - k;
        while (k > 0) {
          v *= q;
          u = (n - k + 1) / k * p * u + v;
          k--;
          while ((u > 1) && (r > 0)) {
            r--;
            v *= q;
            u *= q;
          }
        }
        while (r > 0) {
          r--;
          u *= q;
        }
        return u;
      };

      Proba.binomial_IF = function(n, p, seuil) {
        var _M, _m, asc, esperance, high, low, pk, std;
        if (seuil >= 1) {
          return {
            Xlow: 0,
            Xhigh: n
          };
        }
        if (seuil < 0) {
          seuil = 0;
        }
        _m = (1 - seuil) / 2;
        _M = (1 + seuil) / 2;
        esperance = n * p;
        std = Math.sqrt(n * p * (1 - p));
        low = Math.max(Math.round(esperance - 2 * std), 0);
        high = Math.min(Math.round(esperance + 2 * std), n);
        pk = this.binomial_rep(n, p, low);
        asc = pk <= _m;
        while ((asc === (pk <= _m)) && ((low > 0) || asc)) {
          if (asc) {
            low++;
          } else {
            low--;
          }
          pk = this.binomial_rep(n, p, low);
        }
        if (pk <= _m) {
          low++;
        }
        pk = this.binomial_rep(n, p, high);
        asc = pk < _M;
        while ((asc === (pk < _M)) && ((high < n) || !asc)) {
          if (asc) {
            high++;
          } else {
            high--;
          }
          pk = this.binomial_rep(n, p, high);
        }
        if (pk < _M) {
          high++;
        }
        return {
          Xlow: low,
          Xhigh: high
        };
      };

      return Proba;

    })();
    this.SerieStat = (function() {
      SerieStat.prototype.brut = true;

      SerieStat.prototype.sorted = false;

      SerieStat.prototype.counted = false;

      SerieStat.prototype.ECC_counted = false;

      SerieStat.prototype._N = null;

      SerieStat.prototype._S = null;

      SerieStat.prototype._S2 = null;

      function SerieStat(liste) {
        var aa, ab, effectifs, i, item, len, len1, ne, value, values;
        this.serie = [];
        if (isArray(liste)) {
          for (aa = 0, len = liste.length; aa < len; aa++) {
            item = liste[aa];
            if (typeof item === "number") {
              this.serie.push({
                value: item,
                effectif: 1
              });
            } else {
              this.serie.push(item);
            }
          }
        } else if (typeof liste === "object") {
          values = liste.values;
          effectifs = liste.effectifs;
          if (isArray(values) && isArray(effectifs)) {
            ne = effectifs.length;
            for (i = ab = 0, len1 = values.length; ab < len1; i = ++ab) {
              value = values[i];
              if (i < ne) {
                this.serie.push({
                  value: value,
                  effectif: effectifs[i]
                });
              } else {
                this.serie.push({
                  value: value,
                  effectif: 1
                });
              }
            }
          }
        } else if (typeof liste === "string") {
          this.makeFromString(liste);
        }
      }

      SerieStat.prototype.transform = function(fct) {
        var item;
        return new SerieStat((function() {
          var aa, len, ref, results;
          ref = this.serie;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            item = ref[aa];
            results.push({
              value: fct(item.value),
              effectif: item.effectif
            });
          }
          return results;
        }).call(this));
      };

      SerieStat.prototype.makeFromString = function(liste) {
        var aa, effectif, item, item_arr, len, results, table, value;
        table = liste.split(";");
        this.serie = [];
        results = [];
        for (aa = 0, len = table.length; aa < len; aa++) {
          item = table[aa];
          item_arr = item.split("|");
          if (item_arr.length === 2) {
            effectif = Number(item_arr[1]);
            value = Number(item_arr[0]);
          } else {
            value = item_arr[0];
            effectif = 1;
          }
          this.serie.push({
            value: value,
            effectif: effectif
          });
          if (effectif > 1) {
            results.push(this.brut = false);
          } else {
            results.push(void 0);
          }
        }
        return results;
      };

      SerieStat.prototype.refresh = function() {
        this._N = null;
        this._S = null;
        this._S2 = null;
        this.sorted = false;
        this.counted = false;
        this.ECC_counted = false;
        return this;
      };

      SerieStat.prototype.sort = function() {
        if (!this.sorted) {
          this.serie.sort(function(a, b) {
            if (a.value >= b.value) {
              return 1;
            } else {
              return -1;
            }
          });
          this.sorted = true;
        }
        return this;
      };

      SerieStat.prototype.ECC = function() {
        var ECC, aa, item, len, ref;
        if (this.ECC_counted) {
          return this;
        }
        this.sort();
        ECC = 0;
        ref = this.serie;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          item = ref[aa];
          ECC += item.effectif;
          item.ECC = ECC;
        }
        this.ECC_counted = true;
        return this;
      };

      SerieStat.prototype.N = function() {
        var aa, item, len, ref;
        if (this._N != null) {
          return this._N;
        }
        this._N = 0;
        ref = this.serie;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          item = ref[aa];
          this._N += item.effectif;
        }
        return this._N;
      };

      SerieStat.prototype.sum = function() {
        var aa, item, len, ref;
        if (this._S != null) {
          return this._S;
        }
        this._S = 0;
        ref = this.serie;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          item = ref[aa];
          this._S += item.value * item.effectif;
        }
        return this._S;
      };

      SerieStat.prototype.sum_sq = function() {
        var aa, item, len, ref;
        if (this._S2 != null) {
          return this._S2;
        }
        this._S2 = 0;
        ref = this.serie;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          item = ref[aa];
          this._S2 += item.value * item.value * item.effectif;
        }
        return this._S2;
      };

      SerieStat.prototype.sum_xy = function(sy) {
        var ECx, ECy, aa, i, index_x, index_y, item_x, item_y, n, ref, s;
        if (!(sy instanceof SerieStat)) {
          return NaN;
        }
        n = Math.min(this.N(), sy.N());
        s = 0;
        index_x = index_y = -1;
        i = ECx = ECy = 0;
        for (i = aa = 0, ref = n - 1; 0 <= ref ? aa <= ref : aa >= ref; i = 0 <= ref ? ++aa : --aa) {
          if (i >= ECx) {
            index_x++;
            item_x = this.serie[index_x];
            ECx += item_x.effectif;
          }
          if (i >= ECy) {
            index_y++;
            item_y = sy.serie[index_y];
            ECy += item_y.effectif;
          }
          s += item_x.value * item_y.value;
        }
        return s;
      };

      SerieStat.prototype.moyenne = function() {
        if (this.N() === 0) {
          return NaN;
        }
        return this.sum() / this.N();
      };

      SerieStat.prototype.variance = function() {
        var moyenne;
        if (this.N() === 0) {
          return NaN;
        }
        moyenne = this.moyenne();
        return this.sum_sq() / this.N() - moyenne * moyenne;
      };

      SerieStat.prototype.covariance = function(sy) {
        var n;
        if (!(sy instanceof SerieStat)) {
          return NaN;
        }
        n = Math.min(this.N(), sy.N());
        if (n === 0) {
          return NaN;
        }
        return this.sum_xy(sy) / n - this.moyenne() * sy.moyenne();
      };

      SerieStat.prototype.std = function() {
        return Math.sqrt(this.variance());
      };

      SerieStat.prototype.ajustement = function(sy, decimals) {
        var a, b, cov, r, v;
        cov = this.covariance(sy);
        v = this.variance();
        a = cov / v;
        b = sy.moyenne() - a * this.moyenne();
        r = cov / (this.std() * sy.std());
        if (decimals != null) {
          return {
            a: fixNumber(a, decimals),
            b: fixNumber(b, decimals),
            r: r
          };
        } else {
          return {
            a: a,
            b: b,
            r: r
          };
        }
      };

      SerieStat.prototype.getRank = function(rank) {
        var N, aa, item, len, ref;
        N = this.N();
        if ((rank > N) || (rank <= 0)) {
          return NaN;
        }
        this.ECC();
        ref = this.serie;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          item = ref[aa];
          if (item.ECC >= rank) {
            return item.value;
          }
        }
        return NaN;
      };

      SerieStat.prototype.mediane = function() {
        var pair;
        if (this.N() === 0) {
          return NaN;
        }
        pair = this.N() % 2 === 0;
        if (pair) {
          return (this.getRank(this.N() / 2 - 1) + this.getRank(this.N() / 2)) / 2;
        } else {
          return this.getRank((this.N() - 1) / 2);
        }
      };

      SerieStat.prototype.fractile = function(tranche, nb_tranches) {
        if (this.N() === 0) {
          return NaN;
        }
        if ((tranche > nb_tranches) || (tranche < 0)) {
          return NaN;
        }
        return this.getRank(Math.ceil(tranche / nb_tranches * (this.N() - 1)));
      };

      SerieStat.prototype.max = function() {
        if (this.N() === 0) {
          return NaN;
        }
        this.sort();
        return this.serie[this.serie.length - 1].value;
      };

      SerieStat.prototype.min = function() {
        if (this.N() === 0) {
          return NaN;
        }
        this.sort();
        return this.serie[0].value;
      };

      SerieStat.prototype.countEffectifs = function() {
        var i;
        if (this.counted) {
          return this;
        }
        this.ECC();
        i = 1;
        while (i < this.serie.length) {
          if (this.serie[i - 1].value === this.serie[i].value) {
            this.serie[i - 1].ECC += this.serie[i].effectif;
            this.serie[i - 1].effectif += this.serie[i].effectif;
            this.serie.splice(i, 1);
          } else {
            i++;
          }
        }
        return this;
      };

      SerieStat.prototype.storeInString = function() {
        var aa, item, len, liste, ref;
        liste = [];
        ref = this.serie;
        for (aa = 0, len = ref.length; aa < len; aa++) {
          item = ref[aa];
          if (item.effectif === 1) {
            liste.push(String(item.value));
          } else {
            liste.push(item.value + "|" + item.effectif);
          }
        }
        return liste.join(";");
      };

      SerieStat.prototype.approx = function(delta) {
        var item;
        this.refresh();
        this.serie = (function() {
          var aa, len, ref, results;
          ref = this.serie;
          results = [];
          for (aa = 0, len = ref.length; aa < len; aa++) {
            item = ref[aa];
            results.push(Math.round(item.value / delta) * delta);
          }
          return results;
        }).call(this);
        this.countEffectifs();
        return this;
      };

      SerieStat.prototype.toStringArray = function(decimals) {
        var aa, item, len, ref, results;
        ref = this.serie;
        results = [];
        for (aa = 0, len = ref.length; aa < len; aa++) {
          item = ref[aa];
          results.push({
            value: decimals != null ? item.value.toFixed(decimals).replace(".", ",") : String(item.value),
            effectif: item.effectif,
            ECC: item.ECC
          });
        }
        return results;
      };

      SerieStat.prototype.getEffectifs = function(values) {
        var aa, ab, eff, effectifs, i, item, len, len1, ref, value;
        i = 0;
        effectifs = [];
        this.sort();
        if (values != null) {
          for (aa = 0, len = values.length; aa < len; aa++) {
            value = values[aa];
            eff = 0;
            while ((i < this.serie.length) && (this.serie[i].value < value)) {
              i++;
            }
            while ((i < this.serie.length) && (this.serie[i].value === value)) {
              eff += this.serie[i].effectif;
              i++;
            }
            effectifs.push(eff);
          }
        } else {
          ref = this.serie;
          for (ab = 0, len1 = ref.length; ab < len1; ab++) {
            item = ref[ab];
            effectifs.push(item.effectif);
          }
        }
        return effectifs;
      };

      SerieStat.prototype.getValues = function() {
        var aa, item, len, ref, results;
        ref = this.serie;
        results = [];
        for (aa = 0, len = ref.length; aa < len; aa++) {
          item = ref[aa];
          results.push(item.value);
        }
        return results;
      };

      return SerieStat;

    })();
    Suite = (function() {
      Suite.prototype.nMin = 0;

      Suite.prototype.u_nMin = null;

      Suite.prototype.recurence_def = null;

      Suite.prototype.exlplicite_def = null;

      Suite.prototype.nom = "u";

      function Suite(nom, nMin, u_nMin, expl, recur) {
        this.nom = nom;
        if (nMin != null) {
          this.nMin = nMin;
        }
        if (isArray(u_nMin)) {
          this.u_nMin = u_nMin;
        } else {
          this.u_nMin = [];
        }
        if (typeof expl === "function") {
          this.explicite_def = expl;
        }
        if (typeof recur === "function") {
          this.recurence_def = recur;
        }
      }

      Suite.prototype.set = function(name, value) {
        this[name] = value;
        return this;
      };

      Suite.prototype.calc = function(n, forceRecur) {
        var k, l;
        if (forceRecur == null) {
          forceRecur = false;
        }
        if (n < this.nMin) {
          return new RealNumber();
        }
        if (n < this.nMin + this.u_nMin.length) {
          return this.u_nMin[n - this.nMin].toClone();
        }
        if ((!(forceRecur && (this.recurence_def !== null))) && (this.explicite_def !== null)) {
          return this.explicite_def(new RealNumber(n)).simplify();
        }
        if (this.recurence_def !== null) {
          k = this.recurence_def.length;
          if (k > this.u_nMin.length) {
            return new RealNumber();
          }
          while ((l = this.u_nMin.length) <= n - this.nMin) {
            this.u_nMin.push(this.recurence_def.apply(this, this.u_nMin.slice(-k)).simplify());
          }
          return this.u_nMin[n - this.nMin];
        }
        return new RealNumber();
      };

      Suite.prototype.un = function(i) {
        if (i == null) {
          i = 0;
        }
        if (i === 0) {
          return SymbolManager.makeSymbol(this.nom + "_n");
        } else {
          return SymbolManager.makeSymbol(this.nom + "_{n+" + i + "}");
        }
      };

      Suite.prototype.recurence = function(args) {
        var i, k;
        if (this.recurence_def !== null) {
          k = this.recurence_def.length;
          if ((!isArray(args)) || (args.length < k)) {
            args = (function() {
              var aa, ref, results;
              results = [];
              for (i = aa = 0, ref = k - 1; 0 <= ref ? aa <= ref : aa >= ref; i = 0 <= ref ? ++aa : --aa) {
                results.push(this.un(i));
              }
              return results;
            }).call(this);
          }
          return this.recurence_def.apply(this, args).simplify();
        } else {
          return new NumberObject();
        }
      };

      Suite.prototype.explicite = function(x) {
        if (typeof x === "number") {
          x = new RealNumber(x);
        }
        if (!(x instanceof NumberObject)) {
          x = SymbolManager.makeSymbol("n");
        }
        if (this.explicite_def !== null) {
          return this.explicite_def(x).simplify();
        } else {
          return new NumberObject();
        }
      };

      return Suite;

    })();
    Trigo = {
      sin: function(angle) {
        return this.cos(angle, true);
      },
      cos: function(angle, forSin) {
        var output, pval, sign;
        if (forSin == null) {
          forSin = false;
        }
        if (forSin) {
          pval = Math.abs(90 - angle);
        } else {
          pval = Math.abs(angle);
        }
        while (pval > 180) {
          pval -= 360;
        }
        pval = Math.abs(pval);
        if (pval > 90) {
          sign = true;
          pval = 180 - pval;
        }
        switch (false) {
          case pval !== 0:
            output = new RealNumber(1);
            break;
          case pval !== 15:
            output = (new RadicalNumber()).addFactor(6, new RationalNumber(1, 4), false).addFactor(2, new RationalNumber(1, 4), false);
            break;
          case pval !== 30:
            output = (new RadicalNumber()).addFactor(3, new RationalNumber(1, 2), false);
            break;
          case pval !== 36:
            output = (new RadicalNumber()).addFactor(1, new RationalNumber(1, 4), false).addFactor(5, new RationalNumber(1, 4), false);
            break;
          case pval !== 45:
            output = (new RadicalNumber()).addFactor(2, new RationalNumber(1, 2), false);
            break;
          case pval !== 60:
            output = new RationalNumber(1, 2);
            break;
          case pval !== 72:
            output = (new RadicalNumber()).addFactor(5, new RationalNumber(1, 4), false).addFactor(1, new RationalNumber(1, 4), true);
            break;
          case pval !== 75:
            output = (new RadicalNumber()).addFactor(6, new RationalNumber(1, 4), false).addFactor(2, new RationalNumber(1, 4), true);
            break;
          case pval !== 90:
            output = new RealNumber(0);
            break;
          default:
            output = new RealNumber(Math.cos(angle / 180 * Math.PI));
        }
        if (sign) {
          output.opposite();
        }
        return output;
      },
      aCos: function(_cos, _sin_is_plus, rad) {
        var out, sup90;
        if (rad == null) {
          rad = true;
        }
        sup90 = _cos < 0;
        _cos = Math.abs(_cos);
        switch (_cos) {
          case 1:
            out = 0;
            break;
          case (Math.sqrt(6) + Math.sqrt(2)) / 4:
            out = 15;
            break;
          case Math.sqrt(3) / 2:
            out = 30;
            break;
          case (1 + Math.sqrt(5)) / 4:
            out = 36;
            break;
          case Math.sqrt(2) / 2:
            out = 45;
            break;
          case 1 / 2:
            out = 60;
            break;
          case (Math.sqrt(5) - 1) / 4:
            out = 72;
            break;
          case (Math.sqrt(6) - Math.sqrt(2)) / 4:
            out = 75;
            break;
          case 0:
            out = 90;
            break;
          default:
            out = Math.acos(_cos) * 180 / Math.PI;
        }
        if (sup90) {
          out = 180 - out;
        }
        if (_sin_is_plus === false) {
          out = -out;
        }
        out = new RealNumber(out);
        if (rad) {
          return out.md(new RealNumber(180), true).md(SymbolManager.pi(), false).simplify();
        } else {
          return out;
        }
      },
      anglesConnus: function() {
        return [0, 30, 45, 60, 90, 120, 135, 150, 180, -30, -45, -60, -90, -120, -135, -150];
      }
    };
    erreurManager = {
      main: function(goodObject, answer, symbols) {
        var a, ecart, g, marge, ordre, p_user;
        if ((goodObject instanceof InftyNumber) && (answer instanceof InftyNumber) && (goodObject.isPositive() === answer.isPositive())) {
          ecart = 0;
        } else {
          g = goodObject.toClone().simplify(null, true);
          a = answer.toClone().simplify(null, true);
          ecart = g.am(a, true).simplify(null, false, true).floatify(symbols).abs().float();
        }
        if (ecart < ERROR_MIN) {
          ecart = 0;
        }
        if (answer instanceof RealNumber) {
          if (ecart === 0) {
            return {
              exact: true,
              float: true,
              p_user: answer.precision(),
              ordre: null
            };
          } else {
            ordre = Math.ceil(Math.log(ecart) / Math.log(10));
            p_user = answer.precision();
            marge = Math.pow(10, p_user) - 2 * ecart;
            if (marge >= -ERROR_MIN) {
              return {
                exact: false,
                float: true,
                approx_ok: true,
                ecart: ecart,
                p_user: p_user,
                ordre: ordre
              };
            } else {
              return {
                exact: false,
                float: true,
                approx_ok: false,
                ecart: ecart,
                p_user: p_user,
                ordre: ordre
              };
            }
          }
        }
        return {
          exact: ecart === 0,
          float: false
        };
      },
      tri: function(usersObj, goodsObj) {
        var closestGood, closestUser, goodO, maxIter, output, paired_users, us;
        paired_users = [];
        maxIter = usersObj.length * (usersObj.length + 1) / 2;
        while ((usersObj.length > 0) && (goodsObj.length > 0) && (maxIter > 0)) {
          maxIter--;
          closestGood = this.searchClosest(usersObj[0], goodsObj);
          closestUser = this.searchClosest(closestGood, usersObj);
          if (closestUser.rank === usersObj[0].rank) {
            usersObj[0].closest = closestGood.value;
            usersObj[0].closest_distance = usersObj[0].d[closestGood.rank];
            paired_users.push(usersObj.shift());
            goodsObj.splice(closestGood.indice, 1);
          } else {
            usersObj.push(usersObj.shift());
          }
        }
        while (usersObj.length > 0) {
          paired_users.push(usersObj.pop());
        }
        paired_users.sort(function(a, b) {
          if (a.rank < b.rank) {
            return -1;
          } else {
            return 1;
          }
        });
        return output = {
          closests: (function() {
            var aa, len, results;
            results = [];
            for (aa = 0, len = paired_users.length; aa < len; aa++) {
              us = paired_users[aa];
              results.push({
                user: us.value,
                good: us.closest,
                info: us.info,
                d: us.closest_distance
              });
            }
            return results;
          })(),
          lefts: (function() {
            var aa, len, results;
            results = [];
            for (aa = 0, len = goodsObj.length; aa < len; aa++) {
              goodO = goodsObj[aa];
              results.push(goodO.value);
            }
            return results;
          })()
        };
      },
      searchClosest: function(oValue, tab) {
        var aa, base1, i, len, oTab, out, ref;
        if (tab.length === 0) {
          return null;
        }
        out = null;
        for (i = aa = 0, len = tab.length; aa < len; i = ++aa) {
          oTab = tab[i];
          oTab.indice = i;
          if (typeof oValue.d[oTab.rank] === "undefined") {
            oValue.d[oTab.rank] = (ref = typeof (base1 = oValue.value).distance === "function" ? base1.distance(oTab.value) : void 0) != null ? ref : Number.NaN;
          }
          if ((out === null) || (oValue.d[oTab.rank] < oValue.d[out.rank]) || isNaN(oValue.d[out.rank]) && !isNaN(oValue.d[oTab.rank])) {
            out = oTab;
          }
        }
        return out;
      }
    };
    mM = {
      misc: {
        numToStr: function(num, decimals) {
          var out;
          if (decimals != null) {
            out = num.toFixed(decimals);
          } else {
            out = String(num);
          }
          return out.replace('.', ",");
        },
        toPrecision: function(num, decimals) {
          if (decimals != null) {
            return Number(num.toFixed(decimals));
          } else {
            return num;
          }
        }
      },
      alea: {
        poly: function(params) {
          var aa, ab, coeff, coeffs, config, degre, degres, i, len, results;
          config = mergeObj({
            variable: "x",
            degre: 0,
            monome: false,
            coeffDom: null,
            values: 1,
            denominators: null
          }, params);
          degre = Proba.alea(config.degre);
          if (degre < 0) {
            degre = 0;
          }
          if (config.monome) {
            degres = [degre];
          } else {
            degres = (function() {
              results = [];
              for (var aa = 0; 0 <= degre ? aa <= degre : aa >= degre; 0 <= degre ? aa++ : aa--){ results.push(aa); }
              return results;
            }).apply(this);
          }
          coeffs = [];
          for (ab = 0, len = degres.length; ab < len; ab++) {
            i = degres[ab];
            coeff = i === degre && (config.coeffDom !== null) ? this.number(config.coeffDom) : this.number({
              values: config.values,
              denominator: config.denominators
            });
            if (i === degre) {
              while (coeff.isNul()) {
                coeff = this.number({
                  values: config.values,
                  denominator: config.denominators
                });
              }
            }
            if (!coeff.isNul()) {
              if (i !== 0) {
                coeff = new Monome(coeff, {
                  name: config.variable,
                  power: i
                });
              }
              coeffs.push(coeff);
            }
          }
          if (coeffs.length === 1) {
            return coeffs.pop();
          } else {
            return (function(func, args, ctor) {
              ctor.prototype = func.prototype;
              var child = new ctor, result = func.apply(child, args);
              return Object(result) === result ? result : child;
            })(PlusNumber, coeffs.reverse(), function(){});
          }
        },
        number: function(params) {
          var config, deno, num, out;
          if ((params != null ? params.values : void 0) == null) {
            return new RealNumber(Proba.alea(params));
          }
          config = mergeObj({
            sign: false,
            denominator: null
          }, params);
          num = Proba.alea(config.values);
          if (config.coeff != null) {
            num *= config.coeff;
          }
          if (config.denominator != null) {
            deno = Proba.alea(config.denominator);
            if (deno === 0) {
              deno = 1;
            }
            out = (new RationalNumber(num, deno)).simplify();
          } else {
            out = new RealNumber(num);
          }
          if ((config.sign === true) && (Math.random() < .5)) {
            out.opposite();
          }
          return out;
        },
        real: function(params) {
          var config, deno, num, out;
          if ((params != null ? params.values : void 0) == null) {
            return Proba.alea(params);
          }
          config = mergeObj({
            sign: false,
            denominator: null
          }, params);
          num = Proba.alea(config.values);
          if (config.denominator != null) {
            deno = Proba.alea(config.denominator);
            if (deno === 0) {
              deno = 1;
            }
            out = num / deno;
          } else {
            out = num;
          }
          if ((config.sign === true) && (Math.random() < .5)) {
            out *= -1;
          }
          return out;
        },
        dice: function(up, down) {
          return Math.random() * down < up;
        },
        "in": function(arr) {
          return Proba.aleaIn(arr);
        },
        shuffle: function(source) {
          var aa, index, randomIndex, ref, ref1;
          if (!(source.length >= 2)) {
            return source;
          }
          for (index = aa = ref = source.length - 1; ref <= 1 ? aa <= 1 : aa >= 1; index = ref <= 1 ? ++aa : --aa) {
            randomIndex = Math.floor(Math.random() * (index + 1));
            ref1 = [source[randomIndex], source[index]], source[index] = ref1[0], source[randomIndex] = ref1[1];
          }
          return source;
        },
        vector: function(params) {
          var aa, ab, axe, base1, config, coords, force, i, item, len, len1, ok, ref, ref1, tryLeft, values;
          config = mergeObj({
            axes: ["x", "y"],
            def: {},
            name: "?",
            values: [
              {
                min: -10,
                max: 10
              }
            ]
          }, params);
          coords = {
            x: null,
            y: null,
            z: null
          };
          tryLeft = 10;
          ok = false;
          force = false;
          while ((ok === false) && (tryLeft > 0)) {
            tryLeft -= 1;
            ref = config.axes;
            for (i = aa = 0, len = ref.length; aa < len; i = ++aa) {
              axe = ref[i];
              if (i < config.values.length) {
                values = config.values[i];
              } else {
                values = config.values[0];
              }
              if ((typeof config.def[axe + config.name] === "undefined") || force) {
                coords[axe] = mM.alea.number(values);
              } else {
                coords[axe] = mM.toNumber(config.def[axe + config.name]);
              }
            }
            ok = true;
            if (isArray(config.forbidden)) {
              ref1 = config.forbidden;
              for (ab = 0, len1 = ref1.length; ab < len1; ab++) {
                item = ref1[ab];
                switch (false) {
                  case !(item instanceof Vector):
                    ok = ok && !(item.sameAs(coords));
                    break;
                  case (item != null ? item.axe : void 0) == null:
                    ok = ok && !(item.coords.sameAs(coords, item.axe));
                    break;
                  case !(isArray(item != null ? item.aligned : void 0) && (item.aligned.length === 2)):
                    ok = ok && !(typeof (base1 = item.aligned[0]).aligned === "function" ? base1.aligned(item.aligned[1], coords) : void 0);
                }
              }
            }
            force = true;
          }
          return new Vector(config.name, coords);
        }
      },
      distribution: {
        gaussian: function(x, params) {
          var config;
          config = mergeObj({
            moy: 0,
            std: 1
          }, params);
          return Proba.gaussianDistribution((x - config.moy) / config.std);
        },
        binomial: function(n, p, k) {
          return Proba.binomial_density(n, p, k);
        }
      },
      repartition: {
        gaussian: function(x, params) {
          var config, out;
          config = mergeObj({
            moy: 0,
            std: 1
          }, params);
          if (typeof x === "object") {
            if (x.max != null) {
              out = Proba.gaussianRepartition((x.max - config.moy) / config.std);
            } else {
              out = 1;
            }
            if (x.min != null) {
              out = out - Proba.gaussianRepartition((x.min - config.moy) / config.std);
            }
            return out;
          } else {
            return Proba.gaussianRepartition((x - config.moy) / config.std);
          }
        },
        binomial: function(n, p, k) {
          var out;
          if (typeof k === "object") {
            if (k.max != null) {
              out = Proba.binomial_rep(n, p, k.max);
            } else {
              out = 1;
            }
            if (k.min != null) {
              out = out - Proba.binomial_rep(n, p, k.min);
            }
            return out;
          } else {
            return Proba.binomial_rep(n, p, k);
          }
        }
      },
      intervalle_fluctuation: {
        binomial: function(n, p, seuil) {
          if (seuil == null) {
            seuil = .95;
          }
          return Proba.binomial_IF(n, p, seuil);
        }
      },
      test: {
        isFloat: function(number) {
          var nO, out;
          nO = mM.toNumber(number);
          if (!(nO instanceof RealNumber)) {
            return false;
          }
          out = nO.float();
          if (Number.isNaN(out)) {
            return false;
          }
          return out;
        }
      },
      trigo: {
        degToRad: function(value) {
          switch (false) {
            case !isArray(value):
              return this.degToRad(mM.exec(value));
            case !(value instanceof NumberObject):
              return value.toClone().md(new RealNumber(180), true).md(SymbolManager.makeSymbol("pi"), false).simplify();
            case typeof value !== "number":
              return value * Math.PI() / 180;
            default:
              return NaN;
          }
        },
        radToDeg: function(value) {
          switch (false) {
            case !isArray(value):
              return this.radToDeg(mM.exec(value));
            case !(value instanceof NumberObject):
              return value.toClone().md(new RealNumber(180), false).md(SymbolManager.makeSymbol("pi"), true).simplify();
            case typeof value !== "number":
              return value / Math.PI() * 180;
            default:
              return NaN;
          }
        },
        angles: function() {
          return Trigo.anglesConnus();
        },
        principale: function(value, symbols) {
          var nPi, output, tours;
          value = mM.toNumber(value);
          nPi = value.floatify(symbols).float() / Math.PI;
          tours = Math.round(nPi / 2) * 2;
          output = value.toClone().am((new RealNumber(tours)).md(SymbolManager.pi(), false), true);
          if (nPi - tours === -1) {
            output.opposite();
          }
          return output.simplify();
        },
        complexe: function(module, argument) {
          module = mM.toNumber(module);
          return Trigo.cos(argument).md(module, false).am(Trigo.sin(argument).md(module, false).md(new ComplexeNumber(0, 1), false), false).simplify();
        }
      },
      exec: function(arr, params) {
        var arg, config, m, op1, op2, out, pile, ref, ref1, ref2, ref3;
        config = mergeObj({
          simplify: false,
          developp: false,
          clone: true
        }, params);
        arr.reverse();
        pile = [];
        if (!isArray(arr)) {
          return new RealNumber();
        }
        while (arr.length > 0) {
          arg = arr.pop();
          switch (false) {
            case !(arg instanceof NumberObject):
              if (config.clone) {
                pile.push(arg.toClone());
              } else {
                pile.push(arg);
              }
              break;
            case arg !== "+":
              op2 = pile.pop();
              pile.push(new PlusNumber(pile.pop(), op2));
              break;
            case arg !== "-":
              op2 = (ref = pile.pop()) != null ? typeof ref.opposite === "function" ? ref.opposite() : void 0 : void 0;
              pile.push(new PlusNumber(pile.pop(), op2));
              break;
            case arg !== "*":
              op2 = pile.pop();
              pile.push(new MultiplyNumber(pile.pop(), op2));
              break;
            case arg !== "/":
              op2 = pile.pop();
              pile.push(MultiplyNumber.makeDiv(pile.pop(), op2));
              break;
            case arg !== "^":
              op2 = pile.pop();
              pile.push(new PowerNumber(pile.pop(), op2));
              break;
            case arg !== "*-":
              pile.push((ref1 = pile.pop()) != null ? typeof ref1.opposite === "function" ? ref1.opposite() : void 0 : void 0);
              break;
            case arg !== "conjugue":
              pile.push((ref2 = pile.pop()) != null ? typeof ref2.conjugue === "function" ? ref2.conjugue() : void 0 : void 0);
              break;
            case arg !== "^-1":
              pile.push((ref3 = pile.pop()) != null ? typeof ref3.inverse === "function" ? ref3.inverse() : void 0 : void 0);
              break;
            case arg !== "union":
              op2 = pile.pop();
              op1 = pile.pop();
              pile.push(new Union(op1, op2));
              break;
            case arg !== "intersection":
              op2 = pile.pop();
              op1 = pile.pop();
              pile.push(new Intersection(op1, op2));
              break;
            case arg !== "x" && arg !== "y" && arg !== "t" && arg !== "i" && arg !== "pi" && arg !== "e" && arg !== "∞" && arg !== "infini":
              pile.push(SymbolManager.makeSymbol(arg));
              break;
            case !((typeof arg === "string") && (FunctionNumber.functions[arg] != null)):
              pile.push(new FunctionNumber(arg, pile.pop()));
              break;
            case typeof arg !== "number":
              pile.push(new RealNumber(arg));
              break;
            case !((typeof arg === "string") && (m = arg.match(/^symbol:([a-zA-Z_']+)$/i))):
              pile.push(SymbolManager.makeSymbol(m[1]));
              break;
            case !((typeof arg === "string") && (m = arg.match(/^ensemble:([\[\]]+)([\[\]]+)$/i))):
              op2 = pile.pop();
              op1 = pile.pop();
              pile.push((new Ensemble()).init(m[1] === "[", op1, m[2] === "]", op2));
          }
        }
        if (pile.length === 0) {
          return new RealNumber();
        }
        out = pile.pop();
        if (config.developp) {
          out.developp();
        }
        if (config.simplify) {
          out = out.simplify(null, config.developp);
        }
        return out;
      },
      parse: function(expression, params) {
        return (new ParseInfo(expression, params)).object;
      },
      equals: function(a, b) {
        var dif;
        if (!a instanceof NumberObject) {
          a = this.toNumber(a);
        }
        if (!b instanceof NumberObject) {
          b = this.toNumber(b);
        }
        dif = Math.abs(a.toClone().minus(b).floatify().float());
        return dif < ERROR_MIN;
      },
      toNumber: function(value) {
        var aa, item, len, liste, m, out, results;
        switch (false) {
          case !(value instanceof NumberObject):
            return value;
          case !$.isNumeric(value):
            return new RealNumber(Number(value));
          case !((value === null) || (typeof value === "undefined")):
            return new RealNumber();
          case !isArray(value):
            return this.exec(value);
          case typeof value !== "object":
            if (typeof value.numerator === "number") {
              out = new RationalNumber(value.numerator, value.denominator);
              if (value.simplify) {
                out = out.simplify();
              }
              return out;
            }
            if (typeof value.reel === "number") {
              return new ComplexeNumber(value.reel, value.imaginaire);
            }
            return new RealNumber();
          case value !== "NaN":
            return new RealNumber();
          case !(typeof value === "string" && (m = value.match(/^liste:([;\|:,\#@&!?]+)=/))):
            liste = value.substring(value.indexOf("=") + 1).split(m[1]);
            results = [];
            for (aa = 0, len = liste.length; aa < len; aa++) {
              item = liste[aa];
              results.push(this.toNumber(item));
            }
            return results;
          case typeof value !== "string":
            return this.parse(value, {
              type: "number"
            });
          default:
            return new RealNumber();
        }
      },
      float: function(value, params) {
        var aa, ab, decimals, item, len, len1, results, results1;
        decimals = params != null ? params.decimals : void 0;
        switch (false) {
          case !isArray(value):
            results = [];
            for (aa = 0, len = value.length; aa < len; aa++) {
              item = value[aa];
              results.push(this.float(item, params));
            }
            return results;
          case !isArray(params):
            results1 = [];
            for (ab = 0, len1 = params.length; ab < len1; ab++) {
              item = params[ab];
              results1.push(this.float(value, item));
            }
            return results1;
          case typeof value !== "number":
            return value;
          case !(value instanceof FloatNumber):
            return value.float(decimals);
          case !(value instanceof NumberObject):
            return value.floatify(params).float(decimals);
          case !(value instanceof Polynome):
            return value.floatify(params).float(decimals);
          default:
            return NaN;
        }
      },
      calc: function(op1, op2, op) {
        var Oop1, Oop2;
        Oop1 = this.toNumber(op1);
        Oop2 = this.toNumber(op2);
        switch (op) {
          case "+":
            return Oop1.am(Oop2, false);
          case "-":
            return Oop1.am(Oop2, true);
          case "*":
            return Oop1.md(Oop2, false);
          case "/":
            return Oop1.md(Oop2, true);
          default:
            return new RealNumber();
        }
      },
      vector: function(name, coords) {
        var key;
        for (key in coords) {
          coords[key] = mM.toNumber(coords[key]);
        }
        return new Vector(name, coords);
      },
      droite: {
        par2pts: function(A, B) {
          var a, b, c, pt, uDir;
          if (!((A instanceof Vector) && (B instanceof Vector))) {
            return new Droite2D();
          }
          uDir = B.toClone().am(A, true);
          a = uDir.y;
          b = uDir.x.opposite();
          pt = A.toClone();
          c = pt.x.md(a, false).opposite().am(pt.y.md(b, false), true);
          return new Droite2D([a, b, c]);
        },
        fromNumber: function(num) {
          return new Droite2D(num);
        }
      },
      polynome: {
        make: function(params) {
          var a, coeffs, config, indice, roots, x;
          switch (false) {
            case typeof params !== "string":
              params = {
                expression: params
              };
              break;
            case !(params instanceof NumberObject):
              params = {
                number: params
              };
          }
          config = mergeObj({
            variable: "x",
            type: "polynome"
          }, params);
          switch (false) {
            case !isArray(config.points):
              indice = 0;
              while (indice < config.points.length) {
                if ((typeof config.points[indice].x === "undefined") || (typeof config.points[indice].y === "undefined")) {
                  config.points.splice(i, 1);
                } else {
                  config.points[indice].x = mM.toNumber(config.points[indice].x);
                  config.points[indice].y = mM.toNumber(config.points[indice].y);
                  indice++;
                }
              }
              if (config.type === "number") {
                return PolynomeMaker.lagrangian(config.points, config.variable).toNumberObject().simplify();
              } else {
                return PolynomeMaker.lagrangian(config.points, config.variable);
              }
              break;
            case !isArray(config.roots):
              if (config.a != null) {
                a = mM.toNumber(a);
              } else {
                a = new RealNumber(1);
              }
              indice = 0;
              roots = (function() {
                var aa, len, ref, results;
                ref = config.roots;
                results = [];
                for (aa = 0, len = ref.length; aa < len; aa++) {
                  x = ref[aa];
                  results.push(mM.toNumber(x));
                }
                return results;
              })();
              if (config.type === "number") {
                return PolynomeMaker.width_roots(a, roots, config.variable).toNumberObject().simplify();
              } else {
                return PolynomeMaker.width_roots(a, roots, config.variable);
              }
              break;
            case !isArray(config.coeffs):
              coeffs = (function() {
                var aa, len, ref, results;
                ref = config.coeffs;
                results = [];
                for (aa = 0, len = ref.length; aa < len; aa++) {
                  x = ref[aa];
                  results.push(mM.toNumber(x));
                }
                return results;
              })();
              if (config.type === "number") {
                return PolynomeMaker.widthCoeffs(coeffs, config.variable).toNumberObject().simplify();
              } else {
                return PolynomeMaker.widthCoeffs(coeffs, config.variable);
              }
              break;
            case config.expression == null:
              return PolynomeMaker.fromNumberObject(config.variable, (new ParseInfo(config.expression, {
                type: "number"
              })).object);
            case config.number == null:
              return PolynomeMaker.fromNumberObject(config.variable, config.number);
            case config.type !== "number":
              return new RealNumber();
            default:
              return PolynomeMaker.invalid(config.variable);
          }
        },
        solve: {
          numeric: function(poly, params) {
            var config, ref, ref1;
            config = mergeObj({
              bornes: null,
              decimals: 1,
              y: 0
            }, params);
            return poly.solve_numeric((ref = config.bornes) != null ? ref.min : void 0, (ref1 = config.bornes) != null ? ref1.max : void 0, config.decimals, config.y);
          },
          exact: function(poly, params) {
            var config, y;
            config = mergeObj({
              y: 0,
              imaginaire: false
            }, params);
            y = mM.toNumber(config.y);
            return poly.solveExact(y, config.imaginaire);
          }
        }
      },
      suite: {
        geometrique: function(params) {
          var config;
          config = mergeObj({
            nom: "u",
            raison: 1,
            premierTerme: {
              valeur: 1,
              rang: 0
            }
          }, params);
          return (new Suite(config.nom, config.premierTerme.rang, [mM.toNumber(config.premierTerme.valeur)], function(x) {
            return this.u_nMin[0].toClone().md(PowerNumber.make(this.raison.toClone(), x.am(new RealNumber(this.nMin), true)), false);
          }, function(x) {
            return this.raison.toClone().md(x, false);
          })).set("raison", mM.toNumber(config.raison));
        },
        arithmetique: function(params) {
          var config;
          config = mergeObj({
            nom: "u",
            raison: 0,
            premierTerme: {
              valeur: 0,
              rang: 0
            }
          }, params);
          return (new Suite(config.nom, config.premierTerme.rang, [mM.toNumber(config.premierTerme.valeur)], function(x) {
            return this.u_nMin[0].toClone().am(MultiplyNumber.makeMult([x.am(new RealNumber(this.nMin), true), this.raison.toClone()]), false);
          }, function(x) {
            return x.toClone().am(this.raison, false);
          })).set("raison", mM.toNumber(config.raison));
        },
        arithmeticogeometrique: function(params) {
          var config, h, q, r;
          config = mergeObj({
            nom: "u",
            q: 1,
            r: 0,
            premierTerme: {
              valeur: 0,
              rang: 0
            }
          }, params);
          q = mM.toNumber(config.q);
          r = mM.toNumber(config.r);
          if (q.floatify().float() === 1) {
            return (new Suite(config.nom, config.premierTerme.rang, [mM.toNumber(config.premierTerme.valeur)], function(x) {
              return this.u_nMin[0].toClone().am(MultiplyNumber.makeMult([x.am(new RealNumber(this.nMin), true), this.raison.toClone()]), false);
            }, function(x) {
              return x.toClone().am(this.raison, false);
            })).set("raison", r);
          }
          h = r.toClone().md(q.toClone().am(new RealNumber(1), true), true);
          return (new Suite(config.nom, config.premierTerme.rang, [mM.toNumber(config.premierTerme.valeur)], function(x) {
            return this.u_nMin[0].toClone().am(this.h, false).md(PowerNumber.make(this.q.toClone(), x.am(new RealNumber(this.nMin), true)), false).am(this.h, true);
          }, function(x) {
            return this.q.toClone().md(x, false).am(this.r, false);
          })).set("q", q).set("h", h).set("r", r);
        }
      },
      ensemble: {
        vide: function() {
          return new Ensemble();
        },
        R: function() {
          return (new Ensemble()).inverse();
        },
        singleton: function(value) {
          var v;
          v = mM.toNumber(value);
          return (new Ensemble()).insertSingleton(v);
        },
        intervalle: function(ouvrant, val1, val2, fermant) {
          var v1, v2;
          v1 = mM.toNumber(val1);
          v2 = mM.toNumber(val2);
          return (new Ensemble()).init((ouvrant === "[") || (ouvrant === true), v1, (fermant === "]") || (fermant === true), v2);
        }
      },
      factorisation: function(obj, regex, params) {
        var config, f;
        if ((f = typeof obj.facto === "function" ? obj.facto(regex) : void 0) != null) {
          config = mergeObj({
            simplify: false,
            developp: false
          }, params);
          if (config.simplify) {
            f[0] = f[0].simplify(null, config.developp).simplify();
          }
          return MultiplyNumber.makeMult(f);
        } else {
          return obj.toClone();
        }
      },
      verification: {
        numberValidation: function(userString, inConfig) {
          var config, info;
          switch (false) {
            case typeof userString === "string":
              return {
                processed: false,
                user: userString,
                error: "Erreur inconnue !"
              };
            case userString !== "":
              return {
                processed: false,
                user: userString,
                error: "Ne doit pas être vide"
              };
            default:
              config = _.extend({
                developp: true,
                toLowerCase: false
              }, inConfig != null ? inConfig : {});
              info = new ParseInfo(userString, config);
              if (info.valid) {
                return {
                  processed: info,
                  user: userString,
                  error: false
                };
              } else {
                return {
                  processed: info,
                  user: userString,
                  error: info.messages
                };
              }
          }
        },
        isSame: function(processedAnswer, goodObject, parameters) {
          var approx, config, default_config, erreur, errors, filtered_parameters, goodMessage, keysFilter, note, ref;
          if (typeof goodObject === "number") {
            goodObject = new RealNumber(goodObject);
          }
          default_config = {
            formes: null,
            p_forme: 0.75,
            tolerance: 0,
            approx: 0.1,
            p_approx: 0.5,
            arrondi: null,
            p_arrondi: 0.5,
            symbols: null,
            custom: false
          };
          keysFilter = ["formes", "p_forme", "tolerance", "approx", "p_approx", "arrondi", "p_arrondi", "symbols", "custom", "goodTex"];
          filtered_parameters = _.pick.apply(_, [parameters].concat(slice.call(keysFilter)));
          config = _.extend(default_config, filtered_parameters);
          erreur = erreurManager.main(goodObject, processedAnswer.object, config.symbols);
          note = 0;
          errors = [];
          switch (false) {
            case typeof config.arrondi !== "number":
              approx = Math.pow(10, config.arrondi);
              if (erreur.exact || erreur.float && (erreur.ordre <= config.arrondi)) {
                if (!erreur.float) {
                  errors.push({
                    type: "warning",
                    text: "Approximation sous forme décimale attendue."
                  });
                }
                if (!(erreur.approx_ok || erreur.exact)) {
                  errors.push({
                    type: "warning",
                    text: "Il faut arrondir au " + approx + " le plus proche."
                  });
                }
                if (erreur.p_user < config.arrondi) {
                  errors.push({
                    type: "warning",
                    text: "Vous donnez trop de décimales."
                  });
                }
                if (errors.length > 0) {
                  goodMessage = {
                    type: "warning",
                    text: "$" + processedAnswer.tex + "$ &nbsp; est acceptée mais peut être amélioré."
                  };
                  note = config.p_arrondi;
                } else {
                  goodMessage = {
                    type: "success",
                    text: "$" + processedAnswer.tex + "$ &nbsp; est une bonne réponse."
                  };
                  note = 1;
                }
              } else {
                if (!erreur.float) {
                  errors.push({
                    type: "warning",
                    text: "Approximation sous forme décimale attendue."
                  });
                }
                goodMessage = {
                  type: "error",
                  text: "La bonne réponse était &nbsp; $" + (numToStr(mM.float(goodObject), -config.arrondi)) + "$"
                };
              }
              break;
            case !(erreur.exact || erreur.float && (erreur.ecart <= config.tolerance)):
              note = 1;
              if (!processedAnswer.forme(config.formes)) {
                note *= config.p_forme;
                errors.push({
                  type: "warning",
                  text: "Vous devez simplifier votre résultat."
                });
              }
              if (errors.length > 0) {
                goodMessage = {
                  type: "warning",
                  text: "$" + processedAnswer.tex + "$ &nbsp; est acceptée mais peut être amélioré."
                };
              } else {
                goodMessage = {
                  type: "success",
                  text: "$" + processedAnswer.tex + "$ &nbsp; est une bonne réponse."
                };
              }
              break;
            case !(erreur.float && erreur.approx_ok && (erreur.ecart <= config.approx)):
              errors.push({
                type: "warning",
                text: "Vous avez donné une approximation. Il faut donner une valeur exacte."
              });
              note = config.p_approx;
              goodMessage = {
                type: "warning",
                text: "$" + processedAnswer.tex + "$ &nbsp; est acceptée mais peut être amélioré."
              };
              break;
            default:
              goodMessage = {
                type: "error",
                text: "La bonne réponse était &nbsp; $" + ((ref = config.goodTex) != null ? ref : goodObject.tex()) + "$"
              };
          }
          return {
            note: note,
            errors: errors,
            goodMessage: goodMessage
          };
        },
        areAll: function(processedAnswerList, goodObjectList, parameters) {
          var N, aa, bads, closests, errors, goodMessage, goods, it, lefts, len, messages, note, ref, sol, stringAnswer, stringBads, stringGoods, stringLefts, verifResponse;
          note = 0;
          errors = [];
          goodMessage = false;
          if (processedAnswerList.length === 0) {
            if (goodObjectList.length === 0) {
              goodMessage = {
                type: "success",
                text: "$\\varnothing$ &nbsp; est une bonne réponse"
              };
              note = 1;
            } else {
              stringAnswer = ((function() {
                var aa, len, results;
                results = [];
                for (aa = 0, len = goodObjectList.length; aa < len; aa++) {
                  it = goodObjectList[aa];
                  results.push("$" + (it.tex()) + "$");
                }
                return results;
              })()).join("&nbsp; ; &nbsp;");
              goodMessage = {
                type: "error",
                text: "Vous auriez dû donner &nbsp; " + stringAnswer + "."
              };
            }
          } else {
            if (goodObjectList.length === 0) {
              goodMessage = {
                type: "error",
                text: "La bonne réponse était &nbsp; $\\varnothing$."
              };
            } else {
              ref = mM.verification.tri(processedAnswerList, goodObjectList), closests = ref.closests, lefts = ref.lefts;
              bads = [];
              goods = [];
              N = Math.max(goodObjectList.length, processedAnswerList.length);
              messages = [];
              for (aa = 0, len = closests.length; aa < len; aa++) {
                sol = closests[aa];
                if (sol.good != null) {
                  verifResponse = mM.verification.isSame(sol.info, sol.good, parameters);
                  note += verifResponse.note / N;
                  if (verifResponse.note === 0) {
                    bads.push(sol.info);
                    lefts.push(sol.good);
                  } else {
                    goods.push(sol.info);
                    errors = errors.concat(verifResponse.errors);
                  }
                } else {
                  bads.push(sol.info);
                }
              }
              if (goods.length > 0) {
                stringGoods = ((function() {
                  var ab, len1, results;
                  results = [];
                  for (ab = 0, len1 = goods.length; ab < len1; ab++) {
                    it = goods[ab];
                    results.push("$" + it.tex + "$");
                  }
                  return results;
                })()).join("&nbsp; ; &nbsp;");
                goodMessage = {
                  type: "success",
                  text: "Bonne(s) réponse(s) : &nbsp; " + stringGoods
                };
              }
              if (bads.length > 0) {
                stringBads = ((function() {
                  var ab, len1, results;
                  results = [];
                  for (ab = 0, len1 = bads.length; ab < len1; ab++) {
                    it = bads[ab];
                    results.push("$" + it.tex + "$");
                  }
                  return results;
                })()).join("&nbsp; ; &nbsp;");
                errors.push({
                  type: "error",
                  text: "Ces solutions que vous donnez sont fausses: &nbsp;" + stringBads + "."
                });
              }
              if (lefts.length > 0) {
                stringLefts = ((function() {
                  var ab, len1, ref1, results;
                  results = [];
                  for (ab = 0, len1 = lefts.length; ab < len1; ab++) {
                    it = lefts[ab];
                    results.push("$" + ((ref1 = typeof it.tex === "function" ? it.tex() : void 0) != null ? ref1 : it) + "$");
                  }
                  return results;
                })()).join("&nbsp; ; &nbsp;");
                errors.push({
                  type: "error",
                  text: "Vous n'avez pas donné ces solutions : &nbsp;" + stringLefts + "."
                });
              }
            }
          }
          return {
            note: note,
            errors: errors,
            goodMessage: goodMessage
          };
        },
        areSome: function(processedAnswerList, goodObjectList, parameters) {
          var N, aa, bads, closests, errors, goodMessage, goods, it, lefts, len, messages, note, ref, sol, stringAnswer, stringBads, stringGoods, stringLefts, verifResponse;
          note = 0;
          errors = [];
          goodMessage = false;
          if (!_.isArray(processedAnswerList)) {
            processedAnswerList = _.compact([processedAnswerList]);
          }
          if (processedAnswerList.length === 0) {
            if (goodObjectList.length === 0) {
              goodMessage = {
                type: "success",
                text: "$\\varnothing$ &nbsp; est une bonne réponse"
              };
              note = 1;
            } else {
              stringAnswer = ((function() {
                var aa, len, results;
                results = [];
                for (aa = 0, len = goodObjectList.length; aa < len; aa++) {
                  it = goodObjectList[aa];
                  results.push("$" + (it.tex()) + "$");
                }
                return results;
              })()).join(" ; ");
              goodMessage = {
                type: "error",
                text: "Vous auriez dû donner &nbsp; " + stringAnswer + "."
              };
            }
          } else {
            if (goodObjectList.length === 0) {
              goodMessage = {
                type: "error",
                text: "La bonne réponse était &nbsp; $\\varnothing$."
              };
            } else {
              ref = mM.verification.tri(processedAnswerList, goodObjectList), closests = ref.closests, lefts = ref.lefts;
              bads = [];
              N = processedAnswerList.length;
              messages = [];
              goods = [];
              for (aa = 0, len = closests.length; aa < len; aa++) {
                sol = closests[aa];
                if (sol.good != null) {
                  verifResponse = mM.verification.isSame(sol.info, sol.good, parameters);
                  note += verifResponse.note / N;
                  if (verifResponse.note === 0) {
                    bads.push(sol.info);
                    lefts.push(sol.good);
                  } else {
                    goods.push(sol.info);
                    errors = errors.concat(verifResponse.errors);
                  }
                } else {
                  bads.push(sol.info);
                }
              }
              if (goods.length > 0) {
                stringGoods = ((function() {
                  var ab, len1, results;
                  results = [];
                  for (ab = 0, len1 = goods.length; ab < len1; ab++) {
                    it = goods[ab];
                    results.push("$" + it.tex + "$");
                  }
                  return results;
                })()).join("&nbsp; ; &nbsp;");
                goodMessage = {
                  type: "success",
                  text: "Bonne(s) réponse(s) : &nbsp; " + stringGoods
                };
              }
              if (bads.length > 0) {
                stringBads = ((function() {
                  var ab, len1, results;
                  results = [];
                  for (ab = 0, len1 = bads.length; ab < len1; ab++) {
                    it = bads[ab];
                    results.push("$" + it.tex + "$");
                  }
                  return results;
                })()).join("&nbsp; ; &nbsp;");
                errors.push({
                  type: "error",
                  text: "Ces solutions que vous donnez sont fausses: &nbsp;" + stringBads + "."
                });
                if (!goodMessage) {
                  stringLefts = ((function() {
                    var ab, len1, ref1, results;
                    results = [];
                    for (ab = 0, len1 = lefts.length; ab < len1; ab++) {
                      it = lefts[ab];
                      results.push("$" + ((ref1 = typeof it.tex === "function" ? it.tex() : void 0) != null ? ref1 : it) + "$");
                    }
                    return results;
                  })()).join("&nbsp; ; &nbsp;");
                  goodMessage = {
                    type: "error",
                    text: "Réponse(s) possible(s) : &nbsp; " + stringLefts
                  };
                }
              }
            }
          }
          return {
            note: note,
            errors: errors,
            goodMessage: goodMessage
          };
        },
        tri: function(users, goods) {
          var goodsObj, i, item, userInfo, usersObj;
          goodsObj = (function() {
            var aa, len, results;
            results = [];
            for (i = aa = 0, len = goods.length; aa < len; i = ++aa) {
              item = goods[i];
              results.push({
                value: mM.toNumber(item),
                rank: i,
                d: []
              });
            }
            return results;
          })();
          usersObj = (function() {
            var aa, len, results;
            results = [];
            for (i = aa = 0, len = users.length; aa < len; i = ++aa) {
              userInfo = users[i];
              if (userInfo instanceof ParseInfo) {
                results.push({
                  value: userInfo.object,
                  info: userInfo,
                  rank: i,
                  d: []
                });
              }
            }
            return results;
          })();
          return erreurManager.tri(usersObj, goodsObj);
        }
      }
    };
    return mM;
  });

}).call(this);
