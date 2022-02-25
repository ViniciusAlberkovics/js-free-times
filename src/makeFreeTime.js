const moment = require("moment");

/**
 * @param {{startTime:moment.Moment,endTime: moment.Moment, incrementalId}[]} unavailable 
 */
export const makeFreeTime = (unavailable) => {
  let startTime = moment("08:00", "HH:mm");
  let endTime = moment("22:00", "HH:mm");
  const { timesBasic: times2 } = getTimes(startTime, endTime, 1);
  let freeTimes = [...times2];
  const unavailableSorted = unavailable.sort((a, b) =>
    a.startTime.diff(b.endTime)
  );

  const selecteds = [];

  unavailableSorted.forEach((u) => {
    const init = freeTimes.find((t) => t.time.isSame(u.startTime, "minutes"));

    // 22h dando pau, 
    const end = freeTimes.find((t) => t.time.isSame(u.endTime, "minutes"));


    if (init && end) {
      selecteds.push({ init, end });
      freeTimes = freeTimes.filter(
        (f) =>
          init &&
          end &&
          !(
            f.incrementalId >= init.incrementalId + 1 &&
            f.incrementalId <= end.incrementalId - 1
          )
      );
    } else if (init && !end && u.endTime.isSameOrAfter(endTime)) {
      console.log(`nao existe:`, u)
      freeTimes = freeTimes.filter(f => f.time.isBefore(u.startTime));
    }
  });

  const groupped = groupTimes(
    freeTimes.filter(
      (ft) =>
        !selecteds.some(
          (s) =>
            s.init.incrementalId === ft.incrementalId ||
            s.end.incrementalId === ft.incrementalId
        )
    )
  );

  const completedGroup = completeGroupTimes(groupped, 30);

  return {
    unavailableSorted,
    groupped,
    completedGroup,
  };
};


export const getTimes = (startTime, endTime, intervalInMinutes) => {
  /** @type {moment.Moment} */
  const startTimeTemp = startTime.clone();
  const times = [];
  const timesBasic = [];
  let id = 0;
  const compareDiff = endTime.diff(startTime, 'minutes', true);

  const isPerfectInterval = Number.isInteger(compareDiff);

  while (startTimeTemp.isBefore(endTime)) {
    const added = startTimeTemp.clone().add(intervalInMinutes, "minutes");
    if (!added.isBefore(endTime) && !isPerfectInterval) {
      const clEndTime = endTime.clone();
      times.push({
        incrementalId: id,
        startDate: startTimeTemp.clone(),
        endDate: clEndTime
      });
      timesBasic.push({ incrementalId: id, time: clEndTime });
      startTimeTemp.add(intervalInMinutes, "minutes");
    } else {
      times.push({
        incrementalId: id,
        startDate: startTimeTemp.clone(),
        endDate: added.isAfter(endTime) ? endTime.clone() : added
      });
      timesBasic.push({ incrementalId: id, time: startTimeTemp.clone() });
      startTimeTemp.add(intervalInMinutes, "minutes");
    }
    id++;
  }

  return { times, timesBasic: timesBasic };
};

/**
 * @param {{incrementalId: number, time: moment.Moment}[]} freeTimes
 */
export const groupTimes = (freeTimes) => {
  const groups = [];

  if (freeTimes.length > 0) {
    let start = freeTimes.shift()?.time;
    /** @type {{incrementalId: number, time: moment.Moment}} */
    let current = start.clone();

    for (const [i, ft] of freeTimes.entries()) {
      if (ft.time.isSame(current, "minutes")) continue;

      if (ft.time.diff(current, "minutes") === 1) {
        current = ft.time.clone();
      } else {
        groups.push({
          start: start.clone().add(-1, 'minutes'),
          end: current.clone().add(1, 'minute')
        });

        current = ft.time.clone();
        start = ft.time.clone();
      }

      if (i === freeTimes.length - 1) {
        groups.push({
          start: start.clone().add(-1, 'minutes'),
          end: current.clone().add(1, 'minute')
        });
      }
    }
  }

  return groups;
};

/**
 * @param {{start: moment.Moment;  end: moment.Moment;}[]} groups 
 * @param {number} intervalInMinutes 
 * @returns {{ incrementalId: number;startDate: moment.Moment;endDate: moment.Moment;}[]}  
 */
export const completeGroupTimes = (groups, intervalInMinutes) => {
  const base = [];

  groups.forEach(g => base.push(...getTimes(g.start, g.end, intervalInMinutes).times));

  return base;
}