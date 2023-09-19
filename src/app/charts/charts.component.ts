import { Component, OnInit } from '@angular/core';
import * as d3 from 'd3';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent implements OnInit {

  chartName:string = "Bar";
  constructor() { }

  ngOnInit(): void {
    
    //Data
    var data=[10,200,30,150,44,73,100,320,30];

    //Canvas
    var w=800,h=650;
    var svg=d3.select("#graph").select('figure').select('#chart1').append("svg")
                 .attr('width',w).attr('height',h)//.style('background',"#f4f4f4")
                 .attr("transform","translate(50)")

    var canvas=svg.selectAll('rect').data(data);


    let domainMax:number=  d3.max(data) as number;
    //Y-Scale & X-Scale
    const yscale:any=d3.scaleLinear()
               .domain([0,domainMax])
               .range([w-400,0]);
    let xdomainValue:any[] = d3.range(0,data.length);
    const xscale:any=d3.scaleBand()
               .domain(xdomainValue)
               .range([0,w-400]);


    //Tool Tip
    var tool_tip = d3.select("body").append("div").attr("class","d3-tip")
                  .style("border","0").style("border-radius","8px").style("position","absolute")
                  .style("background","black").style('color','white')
                  .style("visibility","hidden");


    //Rectangular Graphs
    var rectangles=canvas.enter()
                  .append("rect")
                  .attr('width',xscale.bandwidth())
                  .attr('height',0)
                  .attr('y',function(d){return 480;})
                  .attr('x',function(d,i){return xscale(i)+25;}).attr("transform","translate(60,20)")
                  .attr("class",(d:any,i:any):any=>{if(d<=10) return "green";
                  if(d>10&&d<50) return "yellow";
                  if(d>50&&d<200) return "orange";
                  if(d>=200) return "red";})
                  .on("mouseover",function(event,d:any)
                  {
                    tool_tip.html(d).style("left", (event.pageX) + "px").style("top", (event.pageY-20) + "px")
                    .style("visibility","visible");
                    d3.select(this).style("opacity",0.5);
                    //console.log(event);
                  })
                  .on("mouseout",function(){
                    tool_tip.html('').style("visibility","hidden");
                    d3.select(this).style("opacity",1)
                  })
                  //transition
    var trans =  rectangles.transition()
                      .attr('height',function(d){return w-400-yscale(d)})
                      .attr('y',function(d){return 480-(w-400)+yscale(d)})
                      .attr('x',function(d,i){return xscale(i)+25;})
                      .style('fill',function(d,i):any{
                        if(d<=10) return "green";
                        if(d>10&&d<50) return "yellow";
                        if(d>50&&d<200) return "orange";
                        if(d>=200) return "red";
                      }).style("opacity",1).duration(500)

    //legends

    var colors=[{color:"green",data:"Safe"}
    ,{color:"yellow",data:"Acceptable"},{color:"orange",data:"Risky"}
    ,{color:"red",data:"Dangerous"}];
    var legend=d3.select("figure").select("#legend1").append("svg").attr("class","legend").selectAll('.legenditem').data(colors)

    legend.enter().append("circle")
                 .attr("class","legenditem").attr('r',5).attr('cx',10).attr('cy',15).attr("transform",function(d,i){
                   return "translate("+0+","+(i*20)+")";
                 }).style('fill', d => d.color)

    var f=function(d:any,c:any):any{
                   if(c=="green"){
                     if(d<=10) return 1;
                     if(d>10&&d<50) return 0.2;
                     if(d>50&&d<200) return 0.2;
                     if(d>=200) return 0.2;
                   }
                   if(c=="yellow"){
                     if(d<=10) return 0.2;
                     if(d>10&&d<50) return 1;
                     if(d>50&&d<200) return 0.2;
                     if(d>=200) return 0.2;
                   }
                   if(c=="orange"){
                     if(d<=10) return 0.2;
                     if(d>10&&d<50) return 0.2;
                     if(d>50&&d<200) return 1;
                     if(d>=200) return 0.2;
                   }
                   if(c=="red"){
                     if(d<=10) return 0.2;
                     if(d>10&&d<50) return 0.2;
                     if(d>50&&d<200) return 0.2;
                     if(d>=200) return 1;
                   }
     }
    var legen=legend.enter().append("text").attr('x',18).attr('y',function(d,i){return i*20;}).text(d => d.data)
              .attr("id",function(d){return d.data;}).attr("value","false")
              .attr("transform","translate(0,20)");

    var func1=legen.on("mouseover",function(){
                d3.select(this).style("text-decoration","underline")
              })
              .on("mouseout",function(){
                d3.select(this).style("text-decoration","none");
              });
    var func2=func1.on("click",function(event,d){
                var c = d.color;
                var el:any=document.getElementById(d.data);
                //console.log(el)
                var flag=el.hasAttribute("value");
                console.log(flag);
                if(flag==true){
                  d3.selectAll("text").style("fill","black");
                  d3.select(this).style("fill","red");
                  func1.attr("value","false");
                  el.removeAttribute("value");
                  rectangles.style("opacity",function(d){return f(d,c);}).on("mouseout",function(event,d){
                      tool_tip.html('').style("visibility","hidden");
                      d3.select(this).style("opacity",f(d,c));
                  })
                }
                else{
                  d3.selectAll("text").style("fill","black");
                  el.setAttribute("value","false");
                  rectangles.style("opacity",function(d):any{

                      if(d<=10) return 1;
                      if(d>10&&d<50) return 1;
                      if(d>50&&d<200) return 1;
                      if(d>=200) return 1;

                  }).on("mouseout",function(event,d){
                      tool_tip.html('').style("visibility","hidden");
                      d3.select(this).style("opacity",1);
                  })

                }
              })

    //Axes-Initialization
    
    var xaxis=d3.axisBottom(xscale)
    .tickFormat(function(d,i){
      var a=["A","B","C","D",'E','F','G','H','I'];
      return a[i];
    });
  
    var yaxis=d3.axisLeft(yscale).ticks(20);

    //Axes-Calling
    d3.select("svg").append('g').attr("transform","translate("+(25+60)+","+(20+480)+")").call(xaxis);
    d3.select("svg").append('g').attr("transform","translate("+(25+60)+","+(20+80)+")").call(yaxis);

    //Title of the chart
    svg.append("text").attr("transform","translate(250,40)").text("Bar Chart").style('font-family','fantasy').style('font-size',"30px");


  }

   range(start: number, end: number, step: number = 1): number[] {
    const length = Math.floor(Math.abs((end - start) / step)) + 1;
    return Array.from({ length }, (_, index) => start + index * step);
}

}
