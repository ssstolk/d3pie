// --------- validate.js -----------
var tt = {
	addTooltips: function(pie) {

		// group the label groups (label, percentage, value) into a single element for simpler positioning
		var tooltips = pie.svg.insert("g")
			.attr("class", pie.cssPrefix + "tooltips");

    if (pie.options.tooltips.type === 'caption') {

			tooltips.selectAll("." + pie.cssPrefix + "tooltip")
				.data(pie.options.data.content)
				.enter()
				.append("g")
          .attr("class", pie.cssPrefix + "tooltip")
          .attr("id", function(d, i) { return pie.cssPrefix + "tooltip" + i; })
          //.style("opacity", 0)
        .append("rect")
        .attr({
          rx: pie.options.tooltips.styles.borderRadius,
          ry: pie.options.tooltips.styles.borderRadius
        })


      tooltips.selectAll("." + pie.cssPrefix + "tooltip")
        .data(pie.options.data.content)
        .append("text")
          .attr("fill", function(d) { return pie.options.tooltips.styles.color; })
          .style("font-size", function(d) { return pie.options.tooltips.styles.fontSize; })
          .style("font-family", function(d) { return pie.options.tooltips.styles.font; })
          .text(function(d) {
            return d.caption;
          });
		}
	},

  positionTooltips: function(pie) {
    d3.selectAll("." + pie.cssPrefix + "tooltip")
      .attr("transform", function(d, i) {

        // TODO move to helper. This is now (largely) shared by the labels code too
        var pieCenterCopy = extend(true, {}, pie.pieCenter);

        // now recompute the "center" based on the current _innerRadius
        if (pie.innerRadius > 0) {
          var angle = segments.getSegmentAngle(i, pie.options.data.content, pie.totalSize, { midpoint: true });
          var newCoords = math.translate(pie.pieCenter.x, pie.pieCenter.y, pie.innerRadius, angle);
          pieCenterCopy.x = newCoords.x;
          pieCenterCopy.y = newCoords.y;
        }

        var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + i);
        var xOffset = dims.w / 2;
        var yOffset = dims.h / 4;

        var x = pieCenterCopy.x + (pie.lineCoordGroups[i][0].x - pieCenterCopy.x) / 1.8;
        var y = pieCenterCopy.y + (pie.lineCoordGroups[i][0].y - pieCenterCopy.y) / 1.8;

        x = x - xOffset;
        y = y + yOffset;

        return "translate(" + x + "," + y + ")";
      });

    d3.selectAll("." + pie.cssPrefix + "tooltip rect")
      .attr({
        width: function(d, i) {
          var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + i);
          return dims.w;
        },
        height: function(d, i) {
          var dims = helpers.getDimensions(pie.cssPrefix + "tooltip" + i);
          return dims.h;
        }
      });
  },

  showTooltip: function(pie, index) {
    d3.select("#" + pie.cssPrefix + "tooltip" + index)
      .transition()
      .duration(200)
      .style("opacity", function() { return 1; });
  },

  hideTooltip: function(pie, index) {
    d3.select("#" + pie.cssPrefix + "tooltip" + index)
      .transition()
      .duration(200)
      .style("opacity", function() { return 0; });
  }
};
