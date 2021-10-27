const margin = {top: 100, right: 30, bottom: 0, left: 100};
const width = 1400;
const height = 1000;
const missionHeight = 200;
const firstYear = 1960;
const lastYear = 2022;

console.log('missions', missions);

// Scales
const yearsScale = d3.scaleLinear()
  .domain([firstYear, lastYear])
  .range([margin.left, width - margin.right - margin.left]);
// const costScale = d3.scaleLinear()
//   .domain([0, 10000]) // To refine based on data
//   .range([missionHeight, 0]);

// Append SVG parent
const svg = d3.select('#viz')
  .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewbox', `0 0 ${width} ${height}`);

// Append years axis
const xAxis = svg
  .append('g')
    .attr('class', 'x-axis-container')
    .attr('transform', `translate(${margin.left}, ${margin.top})`)
  .call(d3.axisTop(yearsScale));


// Missions
// const missionGroups = svg
//   .append('g')
//     .attr('class', 'missions')
//   .selectAll('.mission-container')
//   .data(missions)
//   .join('g')
//     .attr('class', d => `mission-container mission-container-${d.missionId}`);

// // Create one group for each timeline of the mission
// const missionTimeline = missionGroups
//   .selectAll('.mission-timeline')
//   .data(d => d.costTimelines)
//   .join('g')
//     .attr('class', 'mission-timeline');

  // Append Mission name

  // Append bottom line
  // missionTimeline
  //   .append('line')
  //     .attr('class', 'mission-bottom-axis')
  //     .attr('x1', d => yearsScale(d3.min(d, d => d.fiscal_year)))
  //     .attr('y1', 300)
  //     .attr('x2', d => yearsScale(d3.max(d, d => d.fiscal_year)))
  //     .attr('y2', 300)
  //     .attr('stroke', 'black');

  // Append cost curve