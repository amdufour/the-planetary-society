const margin = {top: 100, right: 30, bottom: 0, left: 100};
const width = 1400;
const height = 1000;
const missionHeight = 200;

// Load data
let promises = [d3.csv('../data/missions.csv'), d3.csv('../data/missions_cost_timeline.csv'), d3.csv('../data/missions_running_cost_timeline.csv'), d3.csv('../data/missions_cost_development_vs_operations.csv')];
Promise.all(promises).then(data => {
  prepData(data[0], data[1], data[2], data[3]);
});

const prepData = (missionsList, costTimelines, runningCostTimelines, devOpCost) => {
  console.log('missionsList', missionsList);
  const missions = [
    { destination: 'the_moon', missions: [] },
    { destination: 'mars', missions: [] },
    { destination: 'outer_planets', missions: [] },
    { destination: 'venus', missions: [] },
    { destination: 'small_bodies', missions: [] },
    { destination: 'mercury', missions: [] },
    { destination: 'other', missions: [] }
  ];

  missionsList.forEach(mission => {
    mission['costTimelines'] = [];
    mission['runningCostTimeline'] = [];
    mission['devCost'] = 0,
    mission['opCost'] = 0,
    mission.fiscal_years_of_development = +mission.fiscal_years_of_development;
    mission.launch_vehicle_cost_2020 = +mission.launch_vehicle_cost_2020;
    mission.launch_year = +mission.launch_year;
    
    missions.find(m => m.destination === mission.destination).missions.push(mission);
  });
  console.log('missions', missions);


  // const missions = [];
  // const filteredData = data.filter(d => d.mars_perseverance_cost_inflation_adj !== 0);
  // console.log('filteredData', filteredData);

  // const missionInfo = {
  //   missionId: 'mars_perseverance',
  //   missionLabel: 'Mars Perseverance',
  //   programLine: 'Flagship',
  //   launchVehicleType: 'Mars rover',
  //   budgetTimelines: []
  // };

  // let currentYear = d3.min(filteredData, d => d.fiscal_year) - 1;
  // let budgetTimeline = [];
  // filteredData.forEach(d => {
  //   if (currentYear + 1 !== d.fiscal_year) {
  //     missionInfo.budgetTimelines.push(budgetTimeline);
  //     budgetTimeline = [];
  //   }
  //   budgetTimeline.push(d);
  //   currentYear = d.fiscal_year;
  // });
  // missionInfo.budgetTimelines.push(budgetTimeline);
  // missions.push(missionInfo);
  // console.log('missions', missions);

  // createViz(data, missions);
};

const createViz = (data, missions) => {

  // Scales
  const yearsScale = d3.scaleLinear()
    .domain([d3.min(data, d => d.fiscal_year), d3.max(data, d => d.fiscal_year)])
    .range([margin.left, width - margin.right - margin.left]);
  const costScale = d3.scaleLinear()
    .domain([0, 10000]) // To refine based on data
    .range([missionHeight, 0]);

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
  const missionGroups = svg
    .append('g')
      .attr('class', 'missions')
    .selectAll('.mission-container')
    .data(missions)
    .join('g')
      .attr('class', d => `mission-container mission-container-${d.missionId}`);
  
  // Create one group for each timeline of the mission
  const missionTimeline = missionGroups
    .selectAll('.mission-timeline')
    .data(d => d.costTimelines)
    .join('g')
      .attr('class', 'mission-timeline');

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

};