/**
 * Created by Edel on 16/3/17.
 */

var drawDayEmotion = function (data, selector) {
    d3.select(selector).selectAll("*").remove();

    var margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = 800 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var formatDate = d3.time.format("%H:%M");

    var parseD = function (d) {
        var temp = new Date(d).toUTCString();
        return formatDate.parse(formatDate(new Date(temp)));
    };

    data.forEach(function(value, key){
        value.realTime = parseD(value.time);
    });

    var x = d3.time.scale()
        .range([0, width]);

    x.domain(d3.extent(data, function (d) {
            return d.realTime;
        }));

    //线性比例尺
    var y = d3.scale.linear()
        .domain([-10, 10])
        .range([height, 0]);

    //X轴
    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    //Y轴
    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    //Path函数
    var line = d3.svg.line()
        .x(function (d) {
            return x(d.realTime);
        })
        .y(function (d) {
            return y(d.score);
        })
        .interpolate("");

    var svg = d3.select(selector).append("svg")
        //.attr("width", "100%")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        //.attr("transform", "translate(0," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Score");

    var path = svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);

    var g = svg.selectAll('circle')
        .data(data)
        .enter()
        .append('g')
        .append('circle')
        .attr('class', 'linecircle')
        .attr('cx', line.x())
        .attr('cy', line.y())
        .attr('r', 3)
        .on('mouseover', function () {
            d3.select(this).transition().duration(500).attr('r', 5);
        })
        .on('mouseout', function () {
            d3.select(this).transition().duration(500).attr('r', 3);
        });

    var totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease("linear")
        .attr("stroke-dashoffset", 0);
};