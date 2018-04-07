define([], function() {
  var svgObject;
  svgObject = (function() {
    function svgObject(div, width, height) {
      var defs, marker, path;
      this.node = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.node.style.width = width + "px";
      this.node.style.height = height + "px";
      this.node.setAttribute('version', '1.1');
      this.node.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      div.appendChild(this.node);
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      marker.setAttribute('id', 'Triangle');
      marker.setAttribute('viewBox', '0 0 10 10');
      marker.setAttribute('refX', '0');
      marker.setAttribute('refY', '5');
      marker.setAttribute('markerUnits', 'strokeWidth');
      marker.setAttribute('markerWidth', '4');
      marker.setAttribute('markerHeight', '3');
      marker.setAttribute('orient', 'auto');
      path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      marker.appendChild(path);
      path.setAttribute('d', 'M 0 0 L 10 5 L 0 10 z');
      this.node.appendChild(defs);
      defs.appendChild(marker);
    }

    svgObject.prototype.rect = function(x, y, width, height, color) {
      var obj;
      if (color == null) {
        color = "#000000";
      }
      obj = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      obj.setAttribute('x', x);
      obj.setAttribute('y', y);
      obj.setAttribute('width', width);
      obj.setAttribute('height', height);
      obj.setAttribute('stroke', color);
      obj.setAttribute('stroke-width', 3);
      obj.setAttribute('fill', 'white');
      return this.node.appendChild(obj);
    };

    svgObject.prototype.text = function(text, x, y, width, height, align, valign, css) {
      var newNode, obj;
      newNode = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
      switch (false) {
        case align !== "right":
          x = x - width;
          break;
        case align !== "center":
          x = x - width / 2;
      }
      switch (false) {
        case valign !== "center":
          $(newNode).css("line-height", height + "px");
          y = y - height / 2;
          break;
        case valign !== "bottom":
          $(newNode).css({
            "line-height": height + "px",
            "vertical-align": "text-bottom"
          });
          y = y - height;
          break;
        default:
          $(newNode).css("line-height", height + "px");
      }
      newNode.setAttribute("x", x);
      newNode.setAttribute("y", y);
      newNode.setAttribute("width", String(width));
      newNode.setAttribute("height", String(height));
      obj = $(newNode);
      obj.append(text);
      obj.css("text-align", align);
      if (typeof css !== "undefined") {
        obj.css(css);
      }
      return this.node.appendChild(newNode);
    };

    svgObject.prototype.line = function(x1, y1, x2, y2, params) {
      var defaultParams, key, obj;
      defaultParams = {
        color: '#000000',
        width: 2
      };
      if (typeof params === "object") {
        for (key in params) {
          defaultParams[key] = params[key];
        }
      }
      obj = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      obj.setAttribute('x1', x1);
      obj.setAttribute('y1', y1);
      obj.setAttribute('x2', x2);
      obj.setAttribute('y2', y2);
      obj.setAttribute('stroke', defaultParams.color);
      obj.setAttribute('stroke-width', defaultParams.width);
      if (typeof defaultParams.dash !== "undefined") {
        obj.setAttribute('stroke-dasharray', defaultParams.dash);
      }
      if (typeof defaultParams.opacity !== "undefined") {
        obj.setAttribute('opactity', defaultParams.opacity);
      }
      return this.node.appendChild(obj);
    };

    svgObject.prototype.arrow = function(x1, y1, x2, y2, params) {
      var defaultParams, key, obj;
      defaultParams = {
        color: '#000000',
        width: 2
      };
      if (typeof params === "object") {
        for (key in params) {
          defaultParams[key] = params[key];
        }
      }
      obj = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      obj.setAttribute('x1', x1);
      obj.setAttribute('y1', y1);
      obj.setAttribute('x2', x2);
      obj.setAttribute('y2', y2);
      obj.setAttribute('stroke', defaultParams.color);
      obj.setAttribute('stroke-width', defaultParams.width);
      obj.setAttribute('marker-end', 'url(#Triangle)');
      return this.node.appendChild(obj);
    };

    return svgObject;

  })();
  return {
    make: function(div, width, height) {
      return new svgObject(div, width, height);
    }
  };
});
