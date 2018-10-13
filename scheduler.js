'use strict';

// To enable debugging, go to your JavaScript console, switch the "JavaScript
// context" to scheduler_worker.js, and type the following into the console:
//
//   schedulerDebugLogging = true;
let schedulerDebugLogging = false;

/**
 * @typedef {{
 *   day: number,
 *   group: Group,
 *   startMinute: number,
 *   endMinute: number,
 *   location: string,
 * }}
 */
let AcademicEvent;
/* exported AcademicEvent */
// Called AcademicEvent because Event is a google-closure-compiler builtin

/**
 * @typedef {{
 *   events: Array<AcademicEvent>,
 *   rating: ScheduleRating,
 * }}
 */
let Schedule;
/* exported Schedule */

/**
 * earliestStart and latestFinish are in hours (e.g. 1:30PM is 13.5).
 *
 * numRuns is the amount of occurences where two adjacent events (endMinute
 * of the first one equals startMinute of the second, same day) are in the
 * same room.
 *
 * freeDays is the number of days in Sun-Thu with no events.
 *
 * @typedef {{
 *   earliestStart: number?,
 *   latestFinish: number?,
 *   numRuns: number?,
 *   freeDays: number?,
 * }}
 */
let ScheduleRating;
/* exported ScheduleRating */

/**
 * Return the building in which ev happens
 *
 * @param {AcademicEvent} ev - Event to consider
 *
 * @returns {string}
 */
function eventBuilding(ev) {
  if (ev.location) {
    return ev.location.split(' ')[0];
  } else {
    return ev.location;
  }
}

/**
 * Count instances in which events involve running between different buildings
 * in adjacent classes.
 *
 * @param {Array<AcademicEvent>} events - Events to check for running
 *
 * @returns {number}
 */
function countRuns(events) {
  let e = events.slice();
  let result = 0;
  sortEvents(e);
  for (let i = 0; i < e.length - 1; i++) {
    if (e[i].day == e[i + 1].day) {
      if (e[i + 1].startMinute == e[i].endMinute) {
        let b1 = eventBuilding(e[i]);
        let b2 = eventBuilding(e[i + 1]);
        if (b1 && b2 && b1 != b2) {
          result++;
        }
      }
    }
  }
  return result;
}

/**
 * Returns true iff schedule has no collisions
 *
 * @param {Schedule} schedule - Schedule to check for collisions
 * @returns {boolean}
 */
function filterNoCollisions(schedule) {
  return !eventsCollide(schedule.events);
}

/**
 * Return a cartesian product of arrays
 *
 * Note: If changing this method, reenable CARTESIAN_SLOW_TEST.
 *
 * @param {...Array<Object>} a - Arrays to multiply
 * @returns {Array.<Array.<Object>>}
 */
function cartesian(...a) {
  if (a.length == 0) {
    return [[]];
  }

  let subCart = cartesian(...a.slice(1));
  return a[0]
    .map(x => subCart.map(y => [x].concat(y)))
    .reduce((a, b) => a.concat(b));
}

/**
 * @typedef {{
 *   noCollisions: boolean,
 *   forbiddenGroups: Array<string>,
 *   ratingMin: ScheduleRating,
 *   ratingMax: ScheduleRating,
 * }}
 */
let FilterSettings;
/* exported FilterSettings */

/**
 * Return all possible schedules
 *
 * @param {!Set<Course>} courses - Courses to schedule from
 * @param {FilterSettings} settings - Settings for filters
 *
 * @returns {Array<Schedule>}
 */
function generateSchedules(courses, settings) {
  if (schedulerDebugLogging) {
    console.time('generateSchedules');
  }
  let groupBins = Array.from(courses)
    .map(c => removeForbiddenGroups(c, settings))
    .map(groupsByType)
    .reduce((a, b) => a.concat(b), []);

  let groupProduct = cartesian(...groupBins);
  let schedules = groupProduct.map(groupsToSchedule);

  if (schedulerDebugLogging) {
    console.info(`${schedules.length} total schedules`);
  }

  schedules = runAllFilters(schedules, settings);

  if (schedulerDebugLogging) {
    console.timeEnd('generateSchedules');
  }
  return schedules;
}

/**
 * Remove forbidden groups from course. Modifies course and returns modified
 * course as well.
 *
 * @param {Course} course - Course to remove forbidden groups from
 * @param {FilterSettings} settings - Filter settings
 *
 * @returns {Course}
 */
function removeForbiddenGroups(course, settings) {
  if (course.groups == null) {
    console.warn('Scheduling with groupless course', course);
    return course;
  }
  course.groups = course.groups.filter(
    g => !settings.forbiddenGroups.includes(`${course.id}.${g.id}`)
  );
  return course;
}

/**
 * Filter src using filter (named filterName), logging how many schedules
 * it removed.
 *
 * @param {Array<Schedule>} src - Source schedules to filter
 * @param {function(Schedule): boolean} filter - Filter to use
 * @param {string} filterName - Display name of filter
 *
 * @returns {Array<Schedule>}
 */
function filterWithDelta(src, filter, filterName) {
  let result = src.filter(filter);
  if (schedulerDebugLogging) {
    console.info(
      `Filter ${filterName} removed ${src.length - result.length} schedules`
    );
  }
  return result;
}

/**
 * Filter using all filters, according to settings
 *
 * @param {Array<Schedule>} schedules - Schedules to filter
 * @param {FilterSettings} settings - Filter settings
 *
 * @returns {Array<Schedule>}
 */
function runAllFilters(schedules, settings) {
  let result = schedules.slice();

  if (settings.noCollisions) {
    result = filterWithDelta(result, filterNoCollisions, 'noCollisions');
  }

  result = filterByRatings(result, settings);

  return result;
}

/**
 * Filter schedules by ratingMin and ratingMax
 *
 * @param {Array<Schedule>} schedules - Schedules to filter
 * @param {FilterSettings} settings - Filter settings
 *
 * @returns {Array<Schedule>}
 */
function filterByRatings(schedules, settings) {
  Object.keys(settings.ratingMin).forEach(function(r) {
    if (settings.ratingMin[r] == null && settings.ratingMax[r] == null) {
      return;
    }

    schedules = filterWithDelta(
      schedules,
      function(schedule) {
        if (
          settings.ratingMin[r] != null &&
          schedule.rating[r] < settings.ratingMin[r]
        ) {
          return false;
        }
        if (
          settings.ratingMax[r] != null &&
          schedule.rating[r] > settings.ratingMax[r]
        ) {
          return false;
        }

        return true;
      },
      `Rating '${r}'`
    );
  });

  return schedules;
}

/**
 * Returns the number of free days given an event set
 *
 * @param {Array<AcademicEvent>} events - Events to examine
 *
 * @returns {number}
 */
function countFreeDays(events) {
  let hasClasses = [false, false, false, false, false];

  events.forEach(function(event) {
    hasClasses[event.day] = true;
  });

  return hasClasses.filter(x => x == false).length;
}

/**
 * Rate the given events as a schedule
 *
 * @param {Array<AcademicEvent>} events - Events to rate
 *
 * @returns {ScheduleRating}
 */
function rate(events) {
  return {
    earliestStart: Math.min(...events.map(e => e.startMinute / 60.0)),
    latestFinish: Math.max(...events.map(e => e.endMinute / 60.0)),
    numRuns: countRuns(events),
    freeDays: countFreeDays(events),
  };
}

/**
 * Convert groups to a schedule
 *
 * @param {Array<Group>} groups - Groups to convert
 * @returns {Schedule}
 */
function groupsToSchedule(groups) {
  let e = groups.reduce((a, b) => a.concat(b.events), []);
  return {
    events: e,
    rating: rate(e),
  };
}

if (typeof module != 'undefined') {
  module.exports = {
    generateSchedules: generateSchedules,
    cartesian: cartesian,
    countRuns: countRuns,
    rate: rate,
  };
}
