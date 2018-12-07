import {expect} from 'chai';

import {RatingType} from '../src/ratings';
import {parseSettings, Settings} from '../src/settings';

describe('Settings parser', function() {
  it('should work correctly with no settings', function() {
    let got = parseSettings('');
    let want: Settings = {
      selectedCourses: [],
      forbiddenGroups: [],  // Wait, what? Why is this duplicated?
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
        '{"catalogUrl":"https://raw.githubusercontent.com/michael-maltsev/cheese-fork/gh-pages/courses/courses_201801.js","selectedCourses":[104016,104004,234112,114051],"forbiddenGroups":[],"customEvents":"","filterSettings":{"forbiddenGroups":[],"noCollisions":true,"ratingMax":{"earliestStart":null,"freeDays":null,"latestFinish":12,"numRuns":null},"ratingMin":{"earliestStart":6,"freeDays":null,"latestFinish":null,"numRuns":null}}}');

    let want: Settings = {
      selectedCourses: [104016, 104004, 234112, 114051],
      forbiddenGroups: [],  // Wait, what? Why is this duplicated?
      customEvents: '',
      catalogUrl:
          'https://storage.googleapis.com/repy-176217.appspot.com/latest.json',
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
