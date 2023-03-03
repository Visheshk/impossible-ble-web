
let h = window.innerHeight*0.7;
let w = window.innerWidth*0.7;
console.log(h, w);
let time = 0;
let num = 300;

// let noise = new SimplexNoise();
let seed = 50 + 100 * Math.random();
let data = [seed];
let averages_50 = [0];
let averages_25 = [0];
let deltas = [seed];

let latestData = [seed];
let latestAverages_50 = [0];
let latestAverages_25 = [0];
let latestDeltas = [seed];

let x = d3.scaleLinear().range([0, 100]);
let y = d3.scaleLinear().domain(-1000, 1000).range([0,100]);

let svg = d3.select('body').append('svg')
  .append('g')
  .attr("width", "100%").attr("height", "100%")
  .attr('transform', 'translate(30, 20)');


let xAxis = d3.axisBottom(x)
  // .orient('bottom')
  .tickSizeInner(-h + 40)
  .tickSizeOuter(0)
  .tickPadding(10);

let yAxis = d3.axisLeft(y)
  // .orient('left')
  .tickSizeInner(-w + 40)
  .tickSizeOuter(0)
  .tickPadding(10);

let line = d3.line()
  .x((d, i) => x(i))
  .y(d => y(d));

margin = ({top: 20, right: 20, bottom: 30, left: 40});
focusHeight = 100;
height = 440;

const brush = d3.brushX()
      .extent([[margin.left, 0.5], [w - margin.right, focusHeight - margin.bottom + 0.5]])
      .on("brush", brushed)
      .on("end", brushended);


let $xAxis = svg.append('g')
  .attr('class', 'x axis')
  .attr('transform', `translate(0, ${h - 40})`)
  .call(xAxis);

let $yAxis = svg.append('g')
  .attr('class', 'y axis')
  .call(yAxis);

let $data = svg.append('path')
  .attr('class', 'line data');

let $averages_50 = svg.append('path')
  .attr('class', 'line average-50');

let $averages_25 = svg.append('path')
  .attr('class', 'line average-25');

const defaultSelection = [50, 80];
console.log(defaultSelection);

const gb = svg.append("g")
    .call(brush)
    .call(brush.move, defaultSelection);

function brushed({selection}) {
  if (selection) {
    svg.property("value", selection.map(x.invert, x));
    svg.dispatch("input");
  }
}

function brushended({selection}) {
  if (!selection) {
    gb.call(brush.move, defaultSelection);
  }
}

// return svg.node();

// let $rects = svg.selectAll('rect')
//   .data(d3.range(num))
//   .enter()
//     .append('rect')
//     .attr('width', (w - 40) / num)
//     .attr('x', (d, i) => i * (w - 40) / num);

let legend = svg.append('g')
  .attr('transform', `translate(20, 20)`)
  .selectAll('g')
  .data([['Value', '#fff'], ['Trailing Average - 50', '#0ff'], ['Trailing Average - 25', '#ff0']])
  .enter()
    .append('g');

  legend
    .append('circle')
    .attr('fill', d => d[1])
    .attr('r', 5)
    .attr('cx', 0)
    .attr('cy', (d, i) => i * 15);

  legend
    .append('text')
    .text(d => d[0])
    .attr('transform', (d, i) => `translate(10, ${i * 15 + 4})`);

function tick() {
  
  // data[time] = data[time - 1] + noise.noise2D(seed, time / 2);
  // data[time] = Math.max(data[time], 0);

  // if (time <= 50) {
  //   let a = 0;
  //   for (let j = 0; j < time; j++) {
  //     a += data[time - j];
  //   }
  //   a /= 50;
  //   averages_50[time] = a;
  // }
  // else {
  //   let a = averages_50[time - 1] * 50 - data[time - 50];
  //   a += data[time];
  //   a /= 50;
  //   averages_50[time] = a;
  // }

  // if (time <= 25) {
  //   let a = 0;
  //   for (let j = 0; j < time; j++) {
  //     a += data[time - j];
  //   }
  //   a /= 25;
  //   averages_25[time] = a;
  // }
  // else {
  //   let a = averages_25[time - 1] * 25 - data[time - 25];
  //   a += data[time];
  //   a /= 25;
  //   averages_25[time] = a;
  // }

  // deltas[time] = data[time] - data[time - 1];

  if (time <= num) {
    // latestData = data.slice(-num);
    // latestAverages_50 = averages_50.slice(-num);
    // latestAverages_25 = averages_25.slice(-num);
    // latestDeltas = deltas.slice(-num);
    latestData = data;
    latestAverages_50 = averages_50;
    latestAverages_25 = averages_25;
    latestDeltas = deltas;
  }
  else {
    // latestData.shift();
    // latestAverages_50.shift();
    // latestAverages_25.shift();
    // latestDeltas.shift();
    // latestData.push(data[time]);
    // latestAverages_50.push(averages_50[time]);
    // latestAverages_25.push(averages_25[time]);
    // latestDeltas.push(deltas[time]);

  }
  if (recording == true) {
    time++;
    console.log("rec true?");
    latestData.push(ax+1000);
    latestAverages_25.push(ay+1100);
    latestAverages_50.push(az+1100);
  }
}

function update() {
  x.domain([0, Math.max(time,300)]);
  let yDom = d3.extent(latestData);
  yDom[0] = Math.max(yDom[0] - 1, 0);
  yDom[1] += 1;
  y.domain(yDom);

  $xAxis
    .call(xAxis);

  $yAxis
    .call(yAxis);

  $data
    .datum(latestData)
    .attr('d', line);

  $averages_50
    .datum(latestAverages_50)
    .attr('d', line);

  $averages_25
    .datum(latestAverages_25)
    .attr('d', line);

  // $rects
  //   .attr('height', (_, i) => Math.abs(latestDeltas[i] * h / 10))
  //   .attr('fill', (_, i) => latestDeltas[i] < 0 ? 'red' : 'green')
  //   .attr('y', (_, i) => h - Math.abs(latestDeltas[i] * h / 10) - 42);
}

for (let i = 0; i < num + 50; i++) {
  tick();
}

update();

setInterval(() => {
  tick();
  update();
}, 60);

/*

(function() {

var n = 243,
    duration = 750,
    now = new Date(Date.now() - duration),
    count = 0,
    data = d3.range(n).map(function() { return 0; });
    d2 = d3.range(n).map(function() { return 0; });

var margin = {top: 6, right: 0, bottom: 20, left: 40},
    width = 960 - margin.right,
    height = 120 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([now - (n - 2) * duration, now - duration])
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var line = d3.svg.line()
    .interpolate("basis")
    .x(function(d, i) { return x(now - (n - 1 - i) * duration); })
    .y(function(d, i) { return y(d); });

var svg = d3.select("body").append("p").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .style("margin-left", -margin.left + "px")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var axis = svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(x.axis = d3.svg.axis().scale(x).orient("bottom"));

var path = svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path")
    .datum(data)
    .attr("class", "line");

var path2 = svg.append("g")
    .attr("clip-path", "url(#clip)")
  .append("path2")
    .datum(d2)
    .attr("class", "line");

var transition = d3.select({}).transition()
    .duration(750)
    .ease("linear");

(function tick() {
  transition = transition.each(function() {

    // update the domains
    now = new Date();
    x.domain([now - (n - 2) * duration, now - duration]);
    y.domain([0, d3.max(data)]);

    data=rls["xs"];
    d2.push(Math.min(30, ay))

    // redraw the line
    svg.select(".line")
        .attr("d", line)
        .attr("transform", null);

    // slide the x-axis left
    axis.call(x.axis);

    // slide the line left
    path.transition()
        .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");
    path2.transition()
        .attr("transform", "translate(" + x(now - (n - 1) * duration) + ")");

    // pop the old data point off the front
    data.shift();

  }).transition().each("start", tick);
})();

})()
*/