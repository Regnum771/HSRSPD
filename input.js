var row_spacing = 60;
var icon_radius = 12.5;
var top_offset = 25;
var left_offset = 25;
var scaling = 1.5;
var sim_duration = 6;
var canvas_height = 350;
var canvas_width = 850;

let colour = ["#6768e1", "#f26379", "#34ad83", "#c15fea"]

let svg = d3.select("#timeline");
svg.attr("width", canvas_width).attr("height", canvas_height);

init_timeline_elements();
let character_data = init_character_data(4);
console.log(character_data);
let data = init_timeline_data(character_data);

var selected;

init_turn_indicator();

var af = document.getElementById("af-amount");
af.oninput = function(){
    if(af.value >= 100){
        af.value = 99;
    }
    selected.__data__.af = af.value;
    update_timeline();
}   

var scaling_widget = document.getElementById("scaling-widget");
scaling_widget.addEventListener('change', event =>{
    scaling = parseFloat(scaling_widget.value);
    update_timeline_elements();
    update_timeline();
})

var sim_duration_widget = document.getElementById("sim-duration-widget");
sim_duration_widget.addEventListener('change', event =>{
    sim_duration = parseInt(sim_duration_widget.value);
    update_timeline_elements();
})

character_spd = document.querySelectorAll('.spd')
document.querySelectorAll('.spd').forEach((item, index) => {
    item.addEventListener('change', event => {
        if(item.value >= 90 & item.value < 300){
            character_data[index].spd = item.value;
            update_timeline();
        } else if (item.value < 90){
            item.value = 90;
            character_data[index].spd = item.value;
            update_timeline();
        } else{
            item.value = 299;
            character_data[index].spd = item.value;
            update_timeline();
        }
    })

    item.addEventListener('input', event => {
        if(item.value > 90 & item.value < 300){
            character_data[index].spd = item.value;
            update_timeline();
        }
    })
})

function init_timeline_elements(){
    //Set scaling timeline canvas
    canvas_width = left_offset + 100 * (sim_duration + 1.5) * scaling;
    svg.attr("width", canvas_width).attr("height", canvas_height);

    timeline_labels_x = calc_timeline_labels_x(sim_duration);
    timeline_ticks = calc_timeline_ticks(sim_duration);

    //Add cycle labels to timeline
    svg.append("g")
    .attr("class", "timeline-labels")
    .selectAll(".timeline-labels")
    .data(timeline_labels_x)
    .join(function(enter){
        enter.append("text")
        .attr("class", "cycle-label")
        .attr("x", d => d * scaling + left_offset - 6.25)
        .attr("y", 20)
        .text(d => d);
        
        enter.append("text")
        .attr("class", "cycle-av-label")
        .attr("x", d => d * scaling + left_offset - 6.25)
        .attr("y", canvas_height)
        .text(d => d);
    });
    
    //Add ticks to timeline
    svg.append("g")
    .attr("class", "timeline-ticks")
    .selectAll(".tick")
    .data(timeline_ticks)
    .join((enter) =>{
        let g = enter;

        g.append("line")
        .attr("class", "tick")
        .attr("x1", d => d * scaling+ left_offset)
        .attr("x2", d => d * scaling+ left_offset)
        .attr("y1", top_offset)
        .attr("y2", canvas_height - top_offset)
    });   
}

function init_character_data(cnum){
    cdata = []
    for (var i = 0; i < 4; i++){
        cdata.push({"id": i, "spd":100})
    }
    return cdata;
}

function init_timeline_data(cdata){
    var tldata = [];
    cdata.forEach((c) => {
        let tdata = []
        for(var i = 0; i < 30; i++){
            tdata.push({
                "id":c.id,
                "turn": i,
                "spd":c.spd,
                "af":0,
                "av": 10000/c.spd * (i + 1)
            })
        }
        tldata.push(tdata);
    })
    return tldata;
}

function init_turn_indicator(){
    svg.selectAll(".turn-marker") 
    .data(data)
    .join("g")
    .selectAll("g")
    .data(function(d){
        return d;
    }).join("line")
        .attr("class", "turn-marker")
        .attr("x1", d => d.av * scaling + left_offset)
        .attr("x2", d => d.av * scaling + left_offset)
        .attr("y1", top_offset)
        .attr("y2", canvas_height - top_offset)
        .attr("stroke", d => colour[d.id]);

    svg.selectAll(".turn-icon") 
    .data(data)
    .join("g")
    .selectAll("g")
    .data(function(d){
        return d;
    })
    .join("circle")
        .attr("class", "turn-icon")
        .attr("cx", d => d.av * scaling + left_offset)
        .attr("cy", d => row_spacing * (d.id + 1) + top_offset)
        .attr("r", d => icon_radius)
        .attr("fill", d=> colour[d.id]);


    svg.selectAll(".turn-display") 
    .data(data)
    .join("g")
    .selectAll("g")
    .data(function(d){
        return d;
    })
    .join("rect")
        .attr("class", "turn-display")
        .attr("id", d=>"turn-display-"+ d.id + "-" + d.turn)
        .style("display", "none")
        .attr("x", d => d.av * scaling + icon_radius * 2 + left_offset)
        .attr("y", d => (d.id + 1) * row_spacing - icon_radius + top_offset)
        .attr("fill",d => "white")
        .attr("fill-opacity", d=> 0.9)
        .attr("width", d=> icon_radius * 6)
        .attr("height", d=> icon_radius * 4);
    
    svg.selectAll(".turn-av") 
    .data(data)
    .join("g")
    .selectAll("g")
    .data(function(d){
        return d;
    })
    .join("text")
        .text(d => "av: " + d.av)
        .attr("class", "turn-av")
        .attr("id", d=>"turn-av-"+ d.id + "-" + d.turn)
        .style("display", "none")
        .attr("x", d => d.av * scaling + icon_radius * 2 + left_offset)
        .attr("y", d => (d.id + 1) * row_spacing + top_offset)
        .attr("stroke", d=> colour[d.id])
        .attr("fill", d => "white");
    
    svg.selectAll(".turn-icon")
        .on("mouseover", function(event, d){
            d3.select("#turn-display-"+ d.id + "-" + d.turn)
            .style("display","block");
            d3.select("#turn-av-"+ d.id + "-" + d.turn)
            .style("display","block");
        })
        .on("mouseout", function(event, d){
            d3.select("#turn-display-"+ d.id + "-" + d.turn)
            .style("display","none");
            d3.select("#turn-av-"+ d.id + "-" + d.turn)
            .style("display","none");
            })
        .on("click", function(event, d){
            d3.select(".highlight")
                .attr("cx", d.av * scaling+ left_offset)
                .attr("cy", row_spacing * (d.id + 1) + top_offset)
                .attr("display", "block");
            af.value = d.af;
            selected = this;
        });

    svg.append("circle")
        .attr("class", "highlight")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 12)
        .attr("fill", "none")
        .attr("stroke-dasharray", 5)
        .attr("stroke", "white")
        .attr("display", "none");
}

function calc_timeline_labels_x(duration){
    let timeline_labels_x = [0, 150]
    for(var i = 1; i <= duration; i++){
        timeline_labels_x.push(timeline_labels_x[i] + 100);
    }
    return timeline_labels_x;
}

function calc_timeline_ticks(duration){
    let timeline_ticks = [0, 50, 100, 150]
    for(var i = 3; i <= duration * 2 + 2; i++){
        timeline_ticks.push(timeline_ticks[i] + 50);
    }
    return timeline_ticks;
}   

function update_timeline_elements(){
    canvas_width = left_offset + 100 * (sim_duration + 1.5) * scaling;
    svg.attr("width", canvas_width).attr("height", canvas_height);

    let timeline_ticks = calc_timeline_ticks(sim_duration);
    let timeline_labels_x = calc_timeline_labels_x(sim_duration);

    update_timeline_labels(timeline_labels_x)
    update_timeline_ticks(timeline_ticks)
}
 
function update_timeline(){
    for(var id = 0; id < data.length; id++){
        for(var turn = 0; turn < data[id].length; turn++){
            data[id][turn].spd = character_data[id].spd;
            if(turn == 0){
                data[id][turn].av = 
                10000/data[id][turn].spd * (1 - data[id][turn].af/100);
            } else{
                data[id][turn].av = 
                    data[id][turn - 1].av 
                    + 10000/data[id][turn].spd
                    * (1 - data[id][turn].af/100);
            }
        }
    } 
    
    svg.selectAll(".turn-marker")
    .transition()
    .duration(200)
    .attr("x1", d=>{return d.av * scaling + left_offset})
    .attr("x2", d=>{return d.av * scaling + left_offset});

    svg.selectAll(".turn-icon")
    .transition()
    .duration(200)
    .attr("cx", d=>{return d.av * scaling + left_offset});
    
    if(selected){
        svg.selectAll(".highlight")
        .transition()
        .duration(200)
        .attr("cx", selected.__data__.av * scaling + left_offset);
    }

    svg.selectAll(".turn-display")
    .transition()
    .duration(200)
    .attr("x", d => d.av * scaling + icon_radius * 2 + left_offset);

    svg.selectAll(".turn-av")
    .transition()
    .duration(200)
    .attr("x", d => d.av * scaling + icon_radius * 2 + left_offset)
    .text(d => "av: " + parseInt(d.av));
}

function update_timeline_labels(timeline_labels_x){
    svg.select(".timeline-labels")
    .selectAll(".cycle-label")
    .data(timeline_labels_x)
    .join(function(enter){
        enter.append("text")
        .attr("class", "cycle-label")
        .attr("x", d => d * scaling + left_offset - 6.25)
        .attr("y", 20)
        .text(d => d);
    });

    svg.selectAll(".cycle-label")
    .transition(150)
    .attr("x", d => d * scaling + left_offset - 6.25);

    svg.select(".timeline-labels")
    .selectAll(".cycle-av-label")
    .data(timeline_labels_x)
    .join(function(enter){
        enter.append("text")
        .attr("class", "cycle-av-label")
        .attr("x", d => d * scaling + left_offset - 6.25)
        .attr("y", canvas_height)
        .text(d => d);
    });

    svg.selectAll(".cycle-av-label")
    .transition(150)
    .attr("x", d => d * scaling + left_offset - 6.25);
}

function update_timeline_ticks(timeline_ticks){
    svg.select(".timeline-ticks")
    .selectAll(".tick")
    .data(timeline_ticks)
    .join(function(enter){
        enter.append("line")
        .attr("class", "tick")
        .attr("x1", d => d * scaling+ left_offset)
        .attr("x2", d => d * scaling+ left_offset)
        .attr("y1", top_offset)
        .attr("y2", canvas_height - top_offset)
    });

    svg.selectAll(".tick")
    .transition(150)
    .attr("x1", d => d * scaling + left_offset)
    .attr("x2", d => d * scaling + left_offset);
}