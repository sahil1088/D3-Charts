import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-radar-chart',
  templateUrl: './radar-chart.component.html',
  styleUrls: ['./radar-chart.component.scss']
})
export class RadarChartComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    let data = [];
    let dataNums:any[] = [];
let features = ["Functional Testing","OSS","NFR","Unit Testing","UX Testing"];
//generate the data
for (var i = 0; i < 2; i++){
var point:any = {}
//each feature will be a random number from 1-9
features.forEach((f:any) => {
point[f] = Math.random()*10;
dataNums.push(point[f]);
});
data.push(point);
}
console.log(data);

console.log(dataNums);
console.log(Math.max(...dataNums));

//svg
let svg = d3.select("body").append("div").append("figure").append("svg")
.attr("width", 600)
.attr("height", 600).style("background","#f4f4f4")




//circles
let radialScale = d3.scaleLinear()
.domain([0,Math.max(...dataNums)])
.range([0,150]);
let ticks = [2,4,6,8,10];
let circle_color_scale=d3.scaleLinear(ticks, ["#FF3333","#33FF5A","#CD5C5C","#A0522D","#050000"])
ticks.forEach((t,i) =>
{svg.append("circle")
.attr("cx", 300)
.attr("cy", 300)
.attr("r", radialScale(t)/2)


.transition().duration(1000)  
.attr("cx", 300)
.attr("cy", 300)
.attr("fill", "none")
.attr("stroke", circle_color_scale(t))
.attr("r", radialScale(t))

.attr("opacity",0.6);

svg.append("text").
attr("class","numText").attr("text-anchor","end").attr("x", 300)
.attr("y", 300).style("opacity","0")
.transition().duration(2000) 
.attr("x", 295 + radialScale(t))
.attr("y", 300 ).style("opacity","1")
.text(t.toString())
.transition().duration(2000)
.style("opacity","0")
}

);

svg.on('focus',function(event){
d3.selectAll(".numText").style("opacity",1)
})
.on('blur',function(event){
d3.selectAll(".numText").style("opacity",0)
})




function angleToCoordinate(angle:any, radius:any)
{
let x = Math.cos(angle) * radialScale(radius);
let y = Math.sin(angle) * radialScale(radius);
return {"x": 300 + x, "y": 300 - y, "r":radius};
}


for (var i=0;i<features.length;i++) {
let ft_name = features[i];
let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
let line_coordinate = angleToCoordinate(angle, 10);
let label_coordinate = angleToCoordinate(angle+0.04, 10.7);

//draw axis line
svg.append("line")
.attr("x1", 300)
.attr("y1", 300)
.attr("x2", line_coordinate.x)
.attr("y2", line_coordinate.y)
.attr("stroke","black")
.attr("opacity",0.5)

//draw axis label
svg//.selectAll(".txt")
.append("text")
.attr("transform",
function(){
let a=-1*((90)-(57.2958)*angle);
if(a>90&&a<270)
return "rotate("+(-1*a+180)+","+
(label_coordinate.x)+","+(label_coordinate.y+5)+")";
else
return "rotate("+(-1*a)+","+
(label_coordinate.x)+","+(label_coordinate.y+5)+")";
})
.attr("text-anchor","middle")
.attr("x", label_coordinate.x)
.attr("y", label_coordinate.y+5)
.html(ft_name);

}

//plot the data
let line = d3.line()
.x((d:any) => d.x)
.y((d:any) => d.y);
let colors = ["darkorange", "navy"];
function getPathCoordinates(data_point:any){
let coordinates = [];
for (var i = 0; i < features.length; i++){
let ft_name = features[i];
let angle = (Math.PI / 2) + (2 * Math.PI * i / features.length);
coordinates.push(angleToCoordinate(angle, data_point[ft_name]));
}
return coordinates;
}

//tooltip
let tooltip=d3.select("body").append("div")
.style("width","50px").style("height","30px")
.style("display","none")
.attr("class","tooltip");
tooltip.append("span").attr("class","tooltiptext")



for (var i = 0; i < data.length; i ++){
let d = data[i];
let color = colors[i];
let coordinates = getPathCoordinates(d);
coordinates.push(coordinates[0])
console.log(coordinates);

// draw the path element
// svg.append("path")
// .datum(coordinates)
// .attr("d",line)
// .attr("stroke-width", 2)
// .attr("stroke", color)
// .attr("fill", "none")
// .attr("stroke-opacity", 1)
// //.attr("opacity", 0);
// .on("mouseover",function(d){
//     console.log(d3.event)
//     d3.select(this).attr("fill", color)
//     .attr("opacity",0.8)
// })
// .on("mouseout",function(event){
//     d3.select(this).attr("fill", "none")
//     .attr("opacity",1)
// });



//dots
svg.append("g").selectAll("dot")
.data(coordinates).enter()
.append("circle").attr("r","4")
.attr("cx",function(d){

return d.x;
})
.attr("cy",function(d){
return d.y;
})
.on('mouseover',function(){
d3.select(this).style('cursor','pointer')
})
.on('mouseout',function(){
d3.select(this).style('cursor','default');
tooltip.style("display","none")
})
.on('click',function(event,d){
console.log(event);
tooltip.style("display","inline-block").style("position","absolute")
.style('top', event.pageY-10  + 'px')
.style('left', event.pageX+15 + 'px').style('text-align','center')
.select("span").html(d.r.toFixed(2))
})
.on('blur',function(event){
tooltip.style("display","none")
})


svg.attr("class","polygon")
svg.selectAll(".polygon")
.data([coordinates]).enter().append("polygon")
.attr("points",function(d,i){
return d.map(function(d) {
    return [(d.x),(d.y)].join(",");
}).join(" ");
})
.attr("stroke", color).attr("fill", "none").attr("opacity",1)
//.attr("fill", color).attr("opacity",0.1).attr("fill", "none").attr("opacity",1)
.attr("stroke-opacity", 1)
.on("mouseover",function(d){
//console.log(d3.event)
d3.select(this).attr("fill", color).attr("opacity",0.8)
})
.on("mouseout",function(event){
d3.select(this).attr("fill", "none").attr("opacity",1)
});

}

  }

}
