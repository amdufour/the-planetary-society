const margin = {top: 100, right: 30, bottom: 0, left: 160};
const width = 1600;
const missionHeight = 40;
const height = 56 * missionHeight + margin.top + margin.bottom;
const firstYear = 1960;
const lastYear = 2022;

console.log('missions', missions);
let currentVerticalPosition = margin.top + 50;
missions.forEach(destination => {
  destination['verticalPosition'] = currentVerticalPosition;
  destination.missions.forEach((mission, i) => {
    mission['verticalPosition'] = currentVerticalPosition + (i + 1) * missionHeight;
    // mission.costTimelines.forEach(tl => {
    //   tl.unshift({ year: tl[0].year, cost: 0 });
    //   tl.push({ year: tl[tl.length - 1].year, cost: 0 });
    // });
  });
  currentVerticalPosition += (destination.missions.length + 1) * missionHeight;
});

// Scales
const yearsScale = d3.scaleLinear()
  .domain([firstYear, lastYear])
  .range([margin.left, width - margin.right - margin.left]);
const costScale = d3.scaleLinear()
  // .domain([0, 5200]) // Max yearly cost from data
  .domain([0, 28000]) // Max yearly cost from data
  .range([missionHeight * 6, 0]);

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
    .attr('transform', `translate(0, ${margin.top})`)
  .call(d3.axisTop(yearsScale));

// Destinations
const destinationGroups = svg
  .append('g')
    .attr('class', 'all-missions')
  .selectAll('.destination')
  .data(missions)
  .join('g')
    .attr('class', d => `destination destination-${d.destination}`);

// Append destination labels
destinationGroups
  .append('text')
    .attr('class', 'destination-label')
    .attr('x', 0)
    .attr('y', d => d.verticalPosition)
    .text(d => d.destinationLabel)
    .style('font-size', '20px')
    .style('font-weight', 600);

// Missions
const missionGroups = destinationGroups
  .append('g')
    .attr('class', 'missions')
  .selectAll('.mission')
  .data(d => d.missions)
  .join('g')
    .attr('class', d => `mission mission-${d.mission_id}`);

// Append mission labels
missionGroups
  .append('text')
    .attr('class', 'mission-label')
    .attr('x', 30)
    .attr('y', d => d.verticalPosition)
    .text(d => d.mission_label);

// Append mission timelines
// Use a forEach loop to keep access to higher level data
missions.forEach(destination => {
  destination.missions.forEach(mission => {
    const missionGroup = d3.select(`.mission-${mission.mission_id}`);

    const curveGenerator = d3.line()
      .x(d => yearsScale(d.year))
      .y(d => mission.verticalPosition - (missionHeight * 6) + costScale(d.cost))
      .curve(d3.curveCatmullRom);

    mission.costTimelines.forEach(tl => {
      missionGroup
        .append('line')
          .attr('class', 'mission-horizontal-axis')
          .attr('x1', yearsScale(tl[0].year))
          .attr('y1', mission.verticalPosition)
          .attr('x2', yearsScale(tl[tl.length - 1].year))
          .attr('y2', mission.verticalPosition)
          .attr('stroke', 'black');

      missionGroup
        .append('path')
          .attr('class', 'mission-cost-timeline')
          .attr('d', curveGenerator(tl))
          .attr('stroke', 'black')
          .attr('fill', 'none');
    });

    mission.runningCostTimeline.forEach(tl => {
      missionGroup
        .append('path')
          .attr('class', 'mission-runing-cost-timeline')
          .attr('d', curveGenerator(tl))
          .attr('stroke', 'black')
          .attr('fill', 'none');
    });
  });
});