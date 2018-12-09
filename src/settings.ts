import {FilterSettings} from './common';
import {RatingType} from './ratings';

const defaultCatalogUrl =
    'https://storage.googleapis.com/repy-176217.appspot.com/latest.json';

/**
 * Settings to be saved. Note that this must be serializable directly as JSON,
 * so Settings and all of the types of its member variables can't have maps
 * nor sets.
 */
export class Settings {
  selectedCourses: number[];
  forbiddenGroups: string[];
  customEvents: string;
  catalogUrl: string;
  filterSettings: FilterSettings;
}

/**
 * Load settings from localStorage
 *
 * @param s - JSON form of settings
 *
 * TODO(lutzky): Exported for testing
 */
export function parseSettings(s: string): Settings {
  let result: Settings = {
    catalogUrl: defaultCatalogUrl,
    selectedCourses: [],
    forbiddenGroups: [],
    customEvents: '',
    filterSettings: {
      forbiddenGroups: [],
      noCollisions: true,
      ratingMin: new Map(),
      ratingMax: new Map(),
    },
  };

  if (s == '') {
    return result;
  }

  let parsed = JSON.parse(s);
  parsed.filterSettings.ratingMin =
      loadRatingsMap(parsed.filterSettings.ratingMin);
  parsed.filterSettings.ratingMax =
      loadRatingsMap(parsed.filterSettings.ratingMax);

  result = {...result, ...parsed};

  return result;
}

function loadRatingsMap(savedRatings: any): Map<RatingType, number> {
  let result = new Map<RatingType, number>();
  for (let k of Object.keys(savedRatings)) {
    let newKey = RatingType[k as keyof typeof RatingType];
    if (typeof newKey == 'undefined') {
      console.error(`Ignored unknown saved rating ${k}`);
      continue;
    }
    let value = savedRatings[k];
    if (value != null) {
      result.set(newKey, value);
    }
  }
  return result;
}

export function stringifySettings(s: Settings): string {
  let result: any = {...{}, ...s};

  result.filterSettings.ratingMax =
      objectifyFilterSettings(result.filterSettings.ratingMax);
  result.filterSettings.ratingMin =
      objectifyFilterSettings(result.filterSettings.ratingMin);

  return JSON.stringify(result);
}

function objectifyFilterSettings(fs: Map<RatingType, number>): any {
  let result: any = {};
  for (let k of fs.keys()) {
    result[RatingType[k]] = fs.get(k);
  }
  return result;
}
