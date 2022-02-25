const moment = require("moment");

const unavailable = [
  {
    id: 1,
    startTime: moment("08:00", "HH:mm"),
    endTime: moment("08:30", "HH:mm")
  },
  {
    id: 2,
    startTime: moment("09:30", "HH:mm"),
    endTime: moment("10:00", "HH:mm")
  },
  {
    id: 3,
    startTime: moment("10:00", "HH:mm"),
    endTime: moment("11:00", "HH:mm")
  },
  {
    id: 4,
    startTime: moment("12:15", "HH:mm"),
    endTime: moment("12:30", "HH:mm")
  },
  {
    id: 5,
    startTime: moment("14:20", "HH:mm"),
    endTime: moment("14:40", "HH:mm")
  }
];

export const makeFreeTime = () => {
  let startTime = moment("08:00", "HH:mm");
  let endTime = moment("22:00", "HH:mm");
  const { times2 } = getTimes(startTime, endTime, 1);
  let freeTimes = [...times2];
  const unavailableSorted = unavailable.sort((a, b) =>
    a.startTime.diff(b.endTime)
  );

  const selecteds = [];

  unavailableSorted.forEach((u) => {
    const init = freeTimes.find((t) => t.time.isSame(u.startTime, "minutes"));
    console.log(`init:`, init);
    const end = freeTimes.find((t) => t.time.isSame(u.endTime, "minutes"));
    console.log(`end:`, end);

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
  });

  console.log(
    "freeTimes:",
    freeTimes
      .filter(
        (ft) =>
          !selecteds.some(
            (s) =>
              s.init.incrementalId === ft.incrementalId ||
              s.end.incrementalId === ft.incrementalId
          )
      )
      .map((ft) => ({
        incrementalId: ft.incrementalId,
        time: ft.time.format()
      }))
  );
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
  console.log(`completedGroup:`, completedGroup.map(c => ({
    incrementalId: c.incrementalId,
    startDate: c.startDate.format(),
    endDate: c.endDate.format()
  })))
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
  const times2 = [];
  let id = 0;
  const compareDiff = endTime.diff(startTime, 'minutes', true);
  console.log(`getTimes:`, {
    startTime: startTime.format(),
    endTime: endTime.format(),
    compareDiff
  })
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
      times2.push({ incrementalId: id, time: clEndTime });
      startTimeTemp.add(intervalInMinutes, "minutes");
    } else {
      times.push({
        incrementalId: id,
        startDate: startTimeTemp.clone(),
        endDate: added.isAfter(endTime) ? endTime.clone() : added
      });
      times2.push({ incrementalId: id, time: startTimeTemp.clone() });
      startTimeTemp.add(intervalInMinutes, "minutes");
    }
    id++;
  }
  console.log(
    `timesFormat:`,
    times.map((t) => ({
      incrementalId: t.incrementalId,
      startDate: t.startDate.format(),
      endDate: t.endDate.format()
    }))
  );

  console.log(
    `times2Format:`,
    times2.map((t) => ({
      incrementalId: t.incrementalId,
      time: t.time.format()
    }))
  );

  return { times, times2 };
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

      // console.log(
      //   ft.time.format(),
      //   current.format(),
      //   start.format(),
      //   ft.time.diff(start, "minutes"),
      //   ft.time.diff(current, "minutes")
      // );
      // if (i === 3) {
      //   break;
      // }
    }
  }

  console.log(
    "groups:",
    groups.map((g) => ({
      start: g.start.format(),
      end: g.end.format()
    }))
  );

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
  console.log(`base:`, base.length)
  return base;
}