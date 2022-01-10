const width = 1200;
const height = 500;
const margin = { top: 100, right: 100, bottom: 100, left: 100 };
const color = [ '#91C7B1', '#E63462']

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

    // user story 7,8 creates ranges baed on the data
    let xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Year ))
        .range([margin.left, width - margin.right]) // user story 11

    let yScale = d3.scaleTime()
        .domain(d3.extent(data, d => d.Time ))
        .range([height - margin.bottom, margin.top]); // user story 12

    let xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format("d")); // user story 10
    let yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat("%M:%S")); // user story 9

    let legendContainer = svg.append('g')
        .attr('id', 'legend')

    let legend = legendContainer.selectAll('#legend')
        .data(color)
        .enter()
        .append('g')
        .attr('transform', (d, i) => 'translate(0, ' + (height/2 - i * 20) + ')')
        .attr('id', 'legend') // user story 13

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
        .text((c) => c !== color[0] ? 'Riders with doping allegations' : 'No doping allegations');


    svg.append("g")
        .attr("transform", `translate(0, ${height - margin.bottom})`)
        .call(xAxis)
        .attr("id", "x-axis"); // user story 2

    svg.append("g")
        .attr("transform", `translate(${margin.left}, 0)`)
        .call(yAxis)
        .attr("id", "y-axis"); // user story 3

    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.Year)) // user story 11
        .attr("cy", d => yScale(d.Time)) // user story 12
        .attr("r", 5)
        .attr("class", "dot") // user story 4
        .attr("fill", (d) => d.Doping ? color[0] : color[1])
        .attr("data-xvalue", d => d.Year) // user story 5 part 1
        .attr("data-yvalue", d => d.Time) // user story 5 part 2
        .append("title")
        .text( (d) => `Name: ${d.Name}\nNationality: ${d.Nationality}\nDoping Charge: ${d.Doping ? d.Doping: 'None'} `)
        .attr('id', 'tooltip') // user story 14
        .attr('data-year', (d) => d.Year) // user story 15



})