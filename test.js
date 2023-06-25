let svgs = d3.select("#timeline");

let test_data = [0, 150, 250, 350, 450]

svgs.append("g")
    .attr("class", "test")
    .selectAll(".test")
    .data(test_data)
    .join(function(enter){
        enter.append("text")
        .attr("class", "xd")
        .attr("x", d => d * scaling + left_offset + 15)
        .attr("y", 20)
        .text(d => d);
        
        enter.append("text")
        .attr("class", "xd")
        .attr("x", d => d * scaling + left_offset + 15)
        .attr("y", canvas_height)
        .text(d => d);
    }, function(update){
        return update;
    });

test_data = [0, 150, 250, 350, 450, 550]

svgs.selectAll('.test')
.selectAll("xd")
.data(test_data)
.join(function(enter){
    enter.append("text")
    .attr("class", "xd")
    .attr("x", d => d * scaling + left_offset + 15)
    .attr("y", 20)
    .text(d => d);
    
    enter.append("text")
    .attr("class", "xd")
    .attr("x", d => d * scaling + left_offset + 15)
    .attr("y", canvas_height)
    .text(d => d);
}, function(update){
    return update;
});