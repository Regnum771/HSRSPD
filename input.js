var row_height = 25;
var canvas_height = 150;

function init_timeline_data(cdata){};

let svg = d3.select("#timeline");

draw_timeline_elements();
let colour = ["#6b40a0", "#a04045", "#40a09c", "#a09c40"]
let character_data = init_character_data(4);
console.log(character_data);
let data = init_timeline_data(character_data);

var af = document.getElementById("af-amount");
var selected;



init_turn_indicator();

af.oninput = function(){
    selected.__data__.af = af.value;
    update_timeline();
}   

character_spd = document.querySelectorAll('.spd')
document.querySelectorAll('.spd').forEach((item, index) => {
    item.addEventListener('change', event => {
        if(item.value > 90 & item.value < 200){
            character_data[index].spd = item.value;
            update_timeline();
        } else{
            item.value = 90;
            character_data[index].spd = item.value;
            update_timeline();
        }
    })

    item.addEventListener('input', event => {
        if(item.value > 90 & item.value < 200){
            character_data[index].spd = item.value;
            update_timeline();
        }
    })
})

function draw_timeline_elements(){
    let cycle_marker = [150, 250, 350, 450, 550, 650, 750]
    let sub_cycle_marker = [50, 100, 200, 300, 400, 500, 600, 700]

    svg.selectAll(".a")
        .data(cycle_marker)
        .join("g")
        .attr("class", "a");

    svg.selectAll(".a")
        .append("line")
        .attr("class", "cycle-marker")
        .attr("x1", d => d)
        .attr("x2", d => d)
        .attr("y1", 0)
        .attr("y2", canvas_height)
        .attr("stroke", "black");

    svg.selectAll(".a")
        .append("text")
        .attr("class", "cycle-marker")
        .attr("x", d => d)
        .attr("y", canvas_height)
        .text(d => d)
        .attr("stroke", "black");

    svg.selectAll(".sub-cycle-marker")
        .data(sub_cycle_marker)
        .join("line")
        .attr("class", "sub-cycle-marker")
        .attr("x1", d => d)
        .attr("x2", d => d)
        .attr("y1", 0)
        .attr("y2", canvas_height)
        .attr("stroke", "grey");
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
        for(var i = 0; i < 20; i++){
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
    svg.selectAll(".indicator")  
    .data(data)
    .join("g")
    .selectAll("g")
    .data(function(d){
        return d;
    })
    .join("g")
        .attr("class", "indicator")
        .append("circle")
        .join("circle")
        .attr("class", "bubble")
        .attr("cx", d => d.av)
        .attr("cy", d => row_height * (d.id + 1))
        .attr("r", d => 10)
        .attr("fill", d=> colour[d.id]);

    svg.selectAll(".indicator")  
        .append("line")
        .attr("class", "turn-marker")
        .attr("x1", d => d.av)
        .attr("x2", d => d.av)
        .attr("y1", 0)
        .attr("y2", canvas_height)
        .attr("stroke", d => colour[d.id]);

    
    svg.selectAll(".indicator")  
        .append("rect")
            .attr("class", "bubble-tip")
            .attr("id", d=>"bubble-tip-"+ d.id + "-" + d.turn)
            .style("display", "none")
            .attr("x", d => d.av + 25)
            .attr("y", d => (d.id + 0.5) * row_height)
            .attr("fill",d => "lightblue")
            .attr("fill-opacity", d=> 0.9)
            .attr("width", d=> 50)
            .attr("height", d=> 25);
    
    svg.selectAll(".indicator")  
        .append("text")
            .text(d => "av: " + d.av)
            .attr("class", "bubble-tip")
            .attr("id", d=>"bubble-text-"+ d.id + "-" + d.turn)
            .style("font-family", "sans-serif")
            .style("display", "none")
            .style("font-size", 14)
            .style("text-align", "left")
            .attr("x", d => d.av + 25)
            .attr("y", d => (d.id + 1) * row_height)
            .attr("stroke", d=> colour[d.id])
            .attr("fill", d => "white");
    
    svg.selectAll(".bubble")
        .on("mouseover", function(event, d){
            d3.select("#bubble-tip-"+ d.id + "-" + d.turn)
            .style("display","block");
            d3.select("#bubble-text-"+ d.id + "-" + d.turn)
            .style("display","block");
        })
        .on("mouseout", function(event, d){
            d3.select("#bubble-tip-"+ d.id + "-" + d.turn)
            .style("display","none");
            d3.select("#bubble-text-"+ d.id + "-" + d.turn)
            .style("display","none");
            })
        .on("click", function(event, d){
            d3.select(".highlight")
                .attr("cx", d.av)
                .attr("cy", row_height * (d.id + 1))
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
        .attr("stroke", "black")
        .attr("display", "none");

    svg.append("rect")
        .attr("x", 750)
        .attr("y", 0)
        .attr("fill","#1F1B24")
        .attr("width", 600)
        .attr("height", canvas_height);
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
    .attr("x1", d=>{return d.av})
    .attr("x2", d=>{return d.av});

    svg.selectAll(".bubble")
    .transition()
    .duration(200)
    .attr("cx", d=>{return d.av});
    
    if(selected){
        svg.selectAll(".highlight")
        .transition()
        .duration(200)
        .attr("cx", selected.__data__.av);
    }

    svg.selectAll(".bubble-tip")
    .transition()
    .duration(200)
    .attr("x", d=>d.av + 25);
}

