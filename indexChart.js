const width = 1200;
const height = 500;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const color = ['#C0504D', '#388D38']

let JSON_URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json';

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json(JSON_URL).then((data) => {
    console.log(data);

    data.forEach(d=> {
        let parsedTime = d.Time.split(':')
        d.Time = new Date(1970,0,1,0,parsedTime[0],parsedTime[1])
    })

    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year ))
        .range([margin.left, width - margin.right]);

    let yScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Time ))
        .range([height - margin.bottom, margin.top]);

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d"));
    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%M:%S"));

    let legendContainer = svg.append('g')
        .attr('id', 'legend')

    let legend = legendContainer.selectAll('#legend')
        .data(color)
        .enter()
        .append('g')
        .attr('transform', (d, i) => 'translate(0, ' + (height/2 - i * 20) + ')')

    legend.append('rect')
        .attr('x', width - margin.right - 20)
        .attr('width', 20)
        .attr('height', 20)
        .attr('fill', d => d)

    legend.append('text')
        .attr('x', width - margin.right - 40)
        .attr('y', 10)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text((c) => c !== '#388D38' ? 'Riders with doping allegations' : 'No doping allegations');


    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis);

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Year))
        .attr("cy", d => yScale(d.Time))
        .attr("r", 5)
        .attr("class", "dot")
        .attr("fill", (d) => d.Doping ? '#388D38' : '#C0504D');



})