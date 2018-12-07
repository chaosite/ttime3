import {FilterSettings} from './common';

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

  if (s != '') {
    result = {...result, ...JSON.parse(s)};
  }

  return result;
}
