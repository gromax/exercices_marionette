var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

define(["utils/svg"], function(SVGapi) {
  var TabVar;
  TabVar = (function() {
    function TabVar(x_list, params) {
      var key;
      this.config = {
        espace_gauche: 100,
        marge: 20,
        margeArrow: 15,
        espace_entre_valeurs: 100,
        hauteur_ligne: 40,
        x_tag: "$x$",
        color: "#000000",
        texColor: "black"
      };
      if ((typeof params === "object") && params !== null) {
        for (key in params) {
          this.config[key] = params[key];
        }
      }
      this.x_list = x_list;
      this.x_tag = this.config.x_tag;
      this.lines = [];
      this.paper = null;
    }

    TabVar.prototype.linesNumber = function() {
      var k, len, ligne, n, ref;
      n = 1;
      ref = this.lines;
      for (k = 0, len = ref.length; k < len; k++) {
        ligne = ref[k];
        n += ligne.hauteur;
      }
      return n;
    };

    TabVar.prototype.addVarLine = function(line, params) {
      var config, item, k, key, len, out, tab;
      config = {
        h: 3,
        tag: "$f$"
      };
      if ((typeof params === "object") && params !== null) {
        for (key in params) {
          config[key] = params[key];
        }
      }
      if (typeof line === "string") {
        line = line.split(',');
      }
      if (!(_.isArray(line))) {
        return;
      }
      while (line.length < this.x_list.length) {
        line.push('?');
      }
      while (line.length > this.x_list.length) {
        line.pop();
      }
      out = [];
      for (k = 0, len = line.length; k < len; k++) {
        item = line[k];
        tab = item.split("/");
        while (tab.length < 2) {
          tab.push("?");
        }
        switch (false) {
          case tab[0] !== "-":
            out.push({
              pos: "bottom",
              tag: tab[1]
            });
            break;
          case tab[0] !== "+":
            out.push({
              pos: "top",
              tag: tab[1]
            });
            break;
          case tab[0] !== "R":
            out.push({
              type: "none"
            });
            break;
          case tab[0] !== "-D":
            out.push({
              type: "forbidden",
              leftPos: "bottom",
              leftTag: tab[1]
            });
            break;
          case tab[0] !== "+D":
            out.push({
              type: "forbidden",
              leftPos: "top",
              leftTag: tab[1]
            });
            break;
          case tab[0] !== "D-":
            out.push({
              type: "forbidden",
              rightPos: "bottom",
              rightTag: tab[1]
            });
            break;
          case tab[0] !== "D+":
            out.push({
              type: "forbidden",
              rightPos: "top",
              rightTag: tab[1]
            });
            break;
          case tab[0] !== "-D-":
            out.push({
              type: "forbidden",
              leftPos: "bottom",
              leftTag: tab[1],
              rightPos: "bottom",
              rightTag: tab[2]
            });
            break;
          case tab[0] !== "-D+":
            out.push({
              type: "forbidden",
              leftPos: "bottom",
              leftTag: tab[1],
              rightPos: "top",
              rightTag: tab[2]
            });
            break;
          case tab[0] !== "+D-":
            out.push({
              type: "forbidden",
              leftPos: "top",
              leftTag: tab[1],
              rightPos: "bottom",
              rightTag: tab[2]
            });
            break;
          case tab[0] !== "+D+":
            out.push({
              type: "forbidden",
              leftPos: "top",
              leftTag: tab[1],
              rightPos: "top",
              rightTag: tab[2]
            });
        }
      }
      this.lines.push({
        type: "var",
        tag: config.tag,
        str: line.join(),
        values: out,
        hauteur: Math.max(config.h, 3)
      });
      return this;
    };

    TabVar.prototype.addSignLine = function(line, params) {
      var config, key;
      config = {
        h: 1,
        tag: "$f(x)$"
      };
      if ((typeof params === "object") && params !== null) {
        for (key in params) {
          config[key] = params[key];
        }
      }
      if (typeof line === "string") {
        line = line.split(',');
      }
      if (!(_.isArray(line))) {
        return;
      }
      while (line.length < 2 * this.x_list.length - 1) {
        line.push('?');
      }
      while (line.length > 2 * this.x_list.length - 1) {
        line.pop();
      }
      this.lines.push({
        type: "sign",
        sign: true,
        tag: config.tag,
        values: line,
        hauteur: Math.max(config.h, 1)
      });
      return this;
    };

    TabVar.prototype.tex = function(params) {
      var config, entetes, key, line;
      entetes = (function() {
        var k, len, ref, results;
        ref = this.lines;
        results = [];
        for (k = 0, len = ref.length; k < len; k++) {
          line = ref[k];
          results.push(line.tag + "/" + (line.hauteur / 2));
        }
        return results;
      }).call(this);
      entetes.unshift(this.x_tag + "/1");
      config = {
        lgt: 1,
        espcl: 1.5,
        lw: "1pt",
        entetes: entetes.join(),
        lines: this.lines,
        x_list: this.x_list.join(),
        color: this.config.texColor
      };
      if ((typeof params === "object") && params !== null) {
        for (key in params) {
          config[key] = params[key];
        }
      }
      return Handlebars.templates["tex_tab"](config);
    };

    TabVar.prototype.render = function(div) {
      var hauteur, i, k, l, len, len1, line, lineY, longueur, ref, ref1, x, x0;
      longueur = this.config.espace_gauche + (this.x_list.length - 1) * this.config.espace_entre_valeurs + 2 * this.config.marge;
      hauteur = this.linesNumber() * this.config.hauteur_ligne;
      if (typeof div !== "undefined") {
        if ((div instanceof jQuery) || (indexOf.call(Object(div), 'jquery') >= 0)) {
          div = div.get(0);
        }
        this.paper = SVGapi.make(div, longueur, hauteur);
      } else if (this.paper === null) {
        return;
      }
      this.paper.rect(0, 0, longueur, this.config.hauteur_ligne, this.config.color);
      this.paper.rect(0, 0, this.config.espace_gauche, this.config.hauteur_ligne, this.config.color);
      this.paper.text(this.config.x_tag, this.config.espace_gauche / 2, this.config.hauteur_ligne / 2, this.config.espace_gauche, this.config.hauteur_ligne, "center", "center");
      x0 = this.config.espace_gauche + this.config.marge;
      ref = this.x_list;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        x = ref[i];
        this.paper.text(x, x0 + this.config.espace_entre_valeurs * i, this.config.hauteur_ligne / 2, this.config.espace_entre_valeurs, this.config.hauteur_ligne, "center", "center");
      }
      lineY = 1;
      ref1 = this.lines;
      for (l = 0, len1 = ref1.length; l < len1; l++) {
        line = ref1[l];
        if (line.type === "var") {
          this.renderVarLine(line, lineY);
        } else if (line.type === "sign") {
          this.renderSignLine(line, lineY);
        }
        lineY += line.hauteur;
      }
      return this;
    };

    TabVar.prototype.renderSignLine = function(line, lineY) {
      var d, h, h0, i, item, j, k, len, ref, results, x0, y0;
      d = this.config.espace_entre_valeurs;
      h0 = this.config.hauteur_ligne;
      h = line.hauteur * h0;
      this.paper.rect(0, lineY * h0, this.config.espace_gauche + (this.x_list.length - 1) * d + 2 * this.config.marge, line.hauteur * h0, this.config.color);
      x0 = this.config.espace_gauche + this.config.marge;
      y0 = (lineY + line.hauteur / 2) * this.config.hauteur_ligne;
      this.paper.rect(0, lineY * h0, this.config.espace_gauche, line.hauteur * h0, this.config.color);
      this.paper.text(line.tag, this.config.espace_gauche / 2, y0, x0, line.hauteur * h0, "center", "center");
      ref = line.values;
      results = [];
      for (j = k = 0, len = ref.length; k < len; j = ++k) {
        item = ref[j];
        i = j / 2;
        if (j % 2 === 0) {
          switch (false) {
            case item !== "z":
              this.paper.line(x0 + i * d, lineY * h0, x0 + i * d, (lineY + line.hauteur) * h0, {
                dash: '5,5',
                width: .5
              });
              results.push(this.paper.text("$0$", x0 + d * i, y0, d, h0, "center", "center"));
              break;
            case item !== "d":
              this.paper.line(x0 + i * d - 2, lineY * h0, x0 + i * d - 2, (lineY + line.hauteur) * h0);
              results.push(this.paper.line(x0 + i * d + 2, lineY * h0, x0 + i * d + 2, (lineY + line.hauteur) * h0));
              break;
            case item !== "t":
              results.push(this.paper.line(x0 + i * d, lineY * h0, x0 + i * d, (lineY + line.hauteur) * h0, {
                dash: '5,5',
                width: .5
              }));
              break;
            default:
              results.push(void 0);
          }
        } else {
          switch (false) {
            case !((item === "+") || (item === "-")):
              results.push(this.paper.text("$" + item + "$", x0 + d * i, y0, d, h0, "center", "center"));
              break;
            default:
              results.push(void 0);
          }
        }
      }
      return results;
    };

    TabVar.prototype.renderVarLine = function(line, lineY) {
      var arrowPath, d, h, i, item, k, l, len, ref, ref1, results, x0;
      h = line.hauteur * this.config.hauteur_ligne;
      this.paper.rect(0, lineY * this.config.hauteur_ligne, this.config.espace_gauche + (this.x_list.length - 1) * this.config.espace_entre_valeurs + 2 * this.config.marge, h, this.config.color);
      x0 = this.config.espace_gauche + this.config.marge;
      d = this.config.espace_entre_valeurs;
      this.paper.rect(0, lineY * this.config.hauteur_ligne, this.config.espace_gauche, h, this.config.color);
      this.paper.text(line.tag, this.config.espace_gauche / 2, (lineY + line.hauteur / 2) * this.config.hauteur_ligne, x0, h, "center", "center");
      arrowPath = [];
      ref = line.values;
      for (i = k = 0, len = ref.length; k < len; i = ++k) {
        item = ref[i];
        switch (false) {
          case typeof item.type !== "undefined":
            arrowPath.push(this.renderTabVarValueTag(item.tag, "center", item.pos, i, lineY, line.hauteur));
            if (!(((item != null ? item.no_vertical_line : void 0) === true) || (i === 0) || (i === line.values.length - 1))) {
              this.paper.line(x0 + i * d, lineY * this.config.hauteur_ligne, x0 + i * d, lineY * this.config.hauteur_ligne + h, {
                dash: '5,5',
                width: .5
              });
            }
            break;
          case item.type !== "forbidden":
            if (typeof item.leftTag !== "undefined") {
              arrowPath.push(this.renderTabVarValueTag(item.leftTag, "right", item.leftPos, i, lineY, line.hauteur));
            }
            arrowPath.push({
              break_path: true
            });
            if (typeof item.rightTag !== "undefined") {
              arrowPath.push(this.renderTabVarValueTag(item.rightTag, "left", item.rightPos, i, lineY, line.hauteur));
            }
            this.paper.line(x0 + i * d - 2, lineY * this.config.hauteur_ligne, x0 + i * d - 2, lineY * this.config.hauteur_ligne + h, {
              color: this.config.color
            });
            this.paper.line(x0 + i * d + 2, lineY * this.config.hauteur_ligne, x0 + i * d + 2, lineY * this.config.hauteur_ligne + h, {
              color: this.config.color
            });
        }
      }
      if (arrowPath.length > 1) {
        results = [];
        for (i = l = 0, ref1 = arrowPath.length - 2; 0 <= ref1 ? l <= ref1 : l >= ref1; i = 0 <= ref1 ? ++l : --l) {
          results.push(this.renderArrow(arrowPath[i], arrowPath[i + 1]));
        }
        return results;
      }
    };

    TabVar.prototype.renderTabVarValueTag = function(tag, align, valign, rang, line, h) {
      var css, y;
      switch (false) {
        case align !== "left":
          css = {
            "padding-left": "5px"
          };
          break;
        case align !== "right":
          css = {
            "padding-right": "5px"
          };
          break;
        default:
          css = void 0;
      }
      switch (false) {
        case valign !== "bottom":
          y = h;
          break;
        case valign !== "top":
          y = 0;
          break;
        case valign !== "center":
          y = h / 2;
          break;
        default:
          y = valign * h;
          valign = "center";
      }
      this.paper.text(tag, this.config.espace_gauche + this.config.marge + this.config.espace_entre_valeurs * rang, (line + y) * this.config.hauteur_ligne, this.config.espace_entre_valeurs, this.config.hauteur_ligne, align, valign, css);
      return {
        x: this.config.espace_gauche + this.config.marge + this.config.espace_entre_valeurs * rang,
        y: (y * (h - 1) / h + 1 / 2 + line) * this.config.hauteur_ligne,
        rang: rang,
        break_path: false
      };
    };

    TabVar.prototype.renderArrow = function(it1, it2) {
      var coeff;
      if (!(it1.break_path || it2.break_path)) {
        coeff = (it2.y - it1.y) / (it2.x - it1.x);
        return this.paper.arrow(it1.x + this.config.margeArrow, it1.y + coeff * this.config.margeArrow, it2.x - this.config.margeArrow, it2.y - coeff * this.config.margeArrow, {
          color: this.config.color
        });
      }
    };

    return TabVar;

  })();
  return {
    make: function(x_list, params) {
      return new TabVar(x_list, params);
    }
  };
});
