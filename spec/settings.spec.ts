import {expect} from 'chai';

import {RatingType} from '../src/ratings';
import {parseSettings, Settings, stringifySettings} from '../src/settings';

describe('Settings parser', function() {
  it('should work correctly with no settings', function() {
    let got = parseSettings('');
    let want: Settings = {
      selectedCourses: [],
      forbiddenGroups: [],  // TODO(lutzky): Wait, what? Why is this duplicated?
      customEvents: '',
      catalogUrl:
          'https://storage.googleapis.com/repy-176217.appspot.com/latest.json',
      filterSettings: {
        noCollisions: true,
        forbiddenGroups: [],
        ratingMin: new Map(),
        ratingMax: new Map(),
      },
    };

    expect(want).to.deep.equal(got);
  });

  it('should operate correctly on settings from 2018-12-07', function() {
    let got = parseSettings(
        '{"catalogUrl":"https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201801.js","selectedCourses":[104016,104004,234112,114051],"forbiddenGroups":[],"customEvents":"","filterSettings":{"forbiddenGroups":[],"noCollisions":true,"ratingMax":{"earliestStart":null,"freeDays":null,"latestFinish":12,"numRuns":null},"ratingMin":{"earliestStart":6,"freeDays":null,"latestFinish":null,"numRuns":null,"invalidSetting":5}}}');

    let want: Settings = {
      selectedCourses: [104016, 104004, 234112, 114051],
      forbiddenGroups: [],  // TODO(lutzky): Wait, what? Why is this duplicated?
      customEvents: '',
      catalogUrl:
          'https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201801.js',

      filterSettings: {
        noCollisions: true,
        forbiddenGroups: [],
        ratingMin: new Map([[RatingType.earliestStart, 6]]),
        ratingMax: new Map([[RatingType.latestFinish, 12]]),
      },
    };

    expect(want).to.deep.equal(got);
  });
});

describe('Settings stringifier', function() {
  it('should work correctly with default settings', function() {
    let s: Settings = {
      selectedCourses: [],
      forbiddenGroups: [],  // TODO(lutzky): Wait, what? Why is this duplicated?
      customEvents: '',
      catalogUrl:
          'https://storage.googleapis.com/repy-176217.appspot.com/latest.json',
      filterSettings: {
        noCollisions: true,
        forbiddenGroups: [],
        ratingMin: new Map(),
        ratingMax: new Map(),
      },
    };
    let want: any = {
      catalogUrl:
          'https://storage.googleapis.com/repy-176217.appspot.com/latest.json',
      customEvents: '',
      filterSettings: {
        forbiddenGroups: [],
        noCollisions: true,
        ratingMax: {},
        ratingMin: {},
      },
      forbiddenGroups: [],
      selectedCourses: [],
    };
    let got = stringifySettings(s);

    let parsedGot = JSON.parse(got);
    expect(want).to.deep.equal(parsedGot);
  });
  it('should work correctly with modified settings', function() {
    let s: Settings = {
      selectedCourses: [123, 456],
      forbiddenGroups: [],  // TODO(lutzky): Wait, what? Why is this duplicated?
      customEvents: '',
      catalogUrl:
          'https://storage.googleapis.com/repy-176217.appspot.com/latest.json',
      filterSettings: {
        noCollisions: true,
        forbiddenGroups: [],
        ratingMin:
            new Map([[RatingType.freeDays, 1], [RatingType.earliestStart, 11]]),
        ratingMax: new Map([[RatingType.numRuns, 5]]),
      },
    };
    let want: any = {
      catalogUrl:
          'https://storage.googleapis.com/repy-176217.appspot.com/latest.json',
      customEvents: '',
      filterSettings: {
        forbiddenGroups: [],
        noCollisions: true,
        ratingMax: {numRuns: 5},
        ratingMin: {freeDays: 1, earliestStart: 11},
      },
      forbiddenGroups: [],
      selectedCourses: [123, 456],
    };
    let got = stringifySettings(s);

    let parsedGot = JSON.parse(got);
    expect(want).to.deep.equal(parsedGot);
  });
})
