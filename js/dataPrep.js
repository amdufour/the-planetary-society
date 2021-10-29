// Load data
let promises = [d3.csv('../data/missions.csv'), d3.csv('../data/missions_cost_timeline.csv'), d3.csv('../data/missions_running_cost_timeline.csv'), d3.csv('../data/missions_cost_development_vs_operations.csv')];
Promise.all(promises).then(data => {
  prepData(data[0], data[1], data[2], data[3]);
});

const prepData = (missionsList, costTimelines, runningCostTimelines, devOpCost) => {
  const missions = [
    { destination: 'the_moon', destinationLabel: 'The Moon', missions: [] },
    { destination: 'mars', destinationLabel: 'Mars', missions: [] },
    { destination: 'outer_planets', destinationLabel: 'Outer Planets', missions: [] },
    { destination: 'venus', destinationLabel: 'Venus', missions: [] },
    { destination: 'small_bodies', destinationLabel: 'Small Bodies', missions: [] },
    { destination: 'mercury', destinationLabel: 'Mercury', missions: [] },
    { destination: 'other', destinationLabel: 'Other', missions: [] }
  ];

  missionsList.forEach(mission => {
    mission['costTimelines'] = [];
    mission['runningCostTimeline'] = [];
    mission['devCost'] = devOpCost[0][mission.mission_id] ? devOpCost[0][mission.mission_id] : null,
    mission['opCost'] = devOpCost[1][mission.mission_id] ? devOpCost[1][mission.mission_id] : null,
    mission.fiscal_years_of_development = +mission.fiscal_years_of_development;
    mission.launch_vehicle_cost_2020 = +mission.launch_vehicle_cost_2020;
    mission.launch_year = +mission.launch_year;
    
    missions.find(m => m.destination === mission.destination).missions.push(mission);
  });
  console.log('missions', missions);

  const updateMissionTimeline = (missionId, timeline, arrayToUpdate) => {
    missions.forEach(destination => {
      const currentMission = destination.missions.find(m => m.mission_id === missionId);
      if (currentMission) {
        currentMission[arrayToUpdate].push(timeline);
      }
    })
  };

  costTimelines.columns.forEach(col => {
    const missionId = col;
    let timeline = [];
    if (missionId !== 'fiscal_year') {
      const missionTimeline = costTimelines.filter(ct => ct[missionId] !== '0');
      let currentYear = +missionTimeline[0].fiscal_year - 1;
      
      missionTimeline.forEach(y => {
        if (currentYear !== +y.fiscal_year - 1) {
          updateMissionTimeline(missionId, timeline, 'costTimelines');
          timeline = [];
        }

        const cost = { year: +y.fiscal_year, cost: +y[missionId] };
        timeline.push(cost);
        currentYear = +y.fiscal_year;
      });
      updateMissionTimeline(missionId, timeline, 'costTimelines');
    }
  });

  runningCostTimelines.columns.forEach(col => {
    const missionId = col;
    let timeline = [];
    if (missionId !== 'fiscal_year') {
      const missionTimeline = runningCostTimelines.filter(ct => ct[missionId] !== '0');
      let currentYear = +missionTimeline[0].fiscal_year - 1;
      
      missionTimeline.forEach(y => {
        if (currentYear !== +y.fiscal_year - 1) {
          updateMissionTimeline(missionId, timeline, 'runningCostTimeline');
          timeline = [];
        }

        const cost = { year: +y.fiscal_year, cost: +y[missionId] };
        timeline.push(cost);
        currentYear = +y.fiscal_year;
      });
      updateMissionTimeline(missionId, timeline, 'runningCostTimeline');
    }
  });

};