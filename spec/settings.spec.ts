import {expect} from 'chai';

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
});
