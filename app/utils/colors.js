define([], function() {
  return {
    html: function(index) {
      switch (index) {
        case 0:
          return "#ff0000";
        case 1:
          return "#347c2c";
        case 2:
          return "#8d38c9";
        case 3:
          return "#ffa500";
        case 4:
          return "#0000ff";
        case 5:
          return "#808080";
        case 6:
          return "#d2b9d3";
        case 7:
          return "#c04000";
        case 8:
          return "#ffff00";
        case 9:
          return "#6495ed";
        default:
          return "#000000";
      }
    },
    tex: function(index) {
      switch (index) {
        case 0:
          return "red";
        case 1:
          return "JungleGreen";
        case 2:
          return "Violet";
        case 3:
          return "Orange";
        case 4:
          return "blue";
        case 5:
          return "gray";
        case 6:
          return "Thistle";
        case 7:
          return "Mahogany";
        case 8:
          return "yellow";
        case 9:
          return "CornflowerBlue";
        default:
          return "black";
      }
    }
  };
});
