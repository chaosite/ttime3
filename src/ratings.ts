/**
 * earliestStart and latestFinish are in hours (e.g. 1:30PM is 13.5).
 *
 * numRuns is the amount of occurences where two adjacent events (endMinute
 * of the first one equals startMinute of the second, same day) are in the
 * same room.
 *
 * freeDays is the number of days in Sun-Thu with no events.
 */
export enum RatingType {
  earliestStart,
  latestFinish,
  numRuns,
  freeDays
}

export type ScheduleRating = Map<RatingType, number>;

class RatingDescriptor {
  name: string;
  explanation: string;
  badgeTextFunc: (s: number) => string;
}

export const AllRatings = new Map<RatingType, RatingDescriptor>([
  [
    RatingType.earliestStart, {
      name: 'Earliest start',
      explanation: 'Hour at which the earliest class of the week start',
      badgeTextFunc: (s: number) => `Earliest start: ${s}`,
    }
  ],
  [
    RatingType.latestFinish, {
      name: 'Latest finish',
      explanation: 'Hour at which the latest class of the week finishes',
      badgeTextFunc: (s: number) => `Latest finish: ${s}`,
    }
  ],
  [
    RatingType.numRuns, {
      name: 'Number of runs',
      explanation: 'Number of adjacent classes in different buildings',
      badgeTextFunc: (s: number) => `${s} runs`,
    }
  ],
  [
    RatingType.freeDays, {
      name: 'Free days',
      explanation: 'Number of days with no classes',
      badgeTextFunc: (s: number) => `${s} free days`,
    }
  ],
]);
