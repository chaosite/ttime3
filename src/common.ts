class Group {
  course: Course;
  description: string;
  events: AcademicEvent[];
  id: number;
  type: string;
  teachers: Array<string>;
}

class Course {
  name: string;
  academicPoints: number;
  id: number;
  groups: Array<Group>;
  lecturerInCharge: string;
  testDates: DateObj[];
  faculty: Faculty;
}

/**
 * Sorts events by start time
 */
function sortEvents(events: AcademicEvent[]) {
  events.sort(function(a, b) {
    if (a.day != b.day) {
      return a.day - b.day;
    }
    return a.startMinute - b.startMinute;
  });
}

/**
 * Returns false iff two entries in events overlap
 */
function eventsCollide(events: AcademicEvent[]): boolean {
  let e = events.slice();
  sortEvents(e);

  for (let i = 0; i < e.length - 1; i++) {
    if (e[i].day == e[i + 1].day) {
      if (e[i + 1].startMinute < e[i].endMinute) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Load the catalog object from url.
 */
function loadCatalog(url: string, isLocal: boolean): Promise<Catalog> {
  return new Promise(function(resolve, reject) {
    // TODO(lutzky): Bring this back for tests
    // if (isLocal) {
    //   require('fs').readFile(url, function(err, data) {
    //     if (err) {
    //       reject(err);
    //     } else {
    //       let result = JSON.parse(data);
    //       fixRawCatalog(/** @type {Catalog} */ (result));
    //       resolve(result);
    //     }
    //   });
    //   return;
    // }

    let req = new XMLHttpRequest();
    req.open('GET', url);
    req.onload = function() {
      if (req.status == 200) {
        let result = null;
        try {
          if (req.response[0] == '[') {
            result = JSON.parse(/** @type {string } */ (req.response));
          } else {
            result = parseCheeseFork(/** @type {string} */ (req.response));
          }
          fixRawCatalog(/** @type {Catalog} */ (result));
          resolve(result);
        } catch (err) {
          reject(err);
        }
      } else {
        reject(Error(req.statusText));
      }
    };

    req.onerror = function() {
      reject(Error('Network Error'));
    };

    req.send();
  });
}

/**
 * Add back-links to catalog objects (course -> faculty, group -> course, etc.)
 */
function fixRawCatalog(catalog: Catalog) {
  catalog.forEach(function(faculty) {
    faculty.courses.forEach(function(course) {
      course.faculty = faculty;
      if (course.groups) {
        course.groups.forEach(function(group) {
          group.course = course;
          if (group.events) {
            group.events.forEach(function(event) {
              event.group = group;
            });
          }
        });
      }
    });
  });
}

// TODO(lutzky): Bring this back for tests
// /**
//  * Load the test catalog from local data
//  *
//  * @returns {Promise<Catalog>}
//  */
// function loadTestCatalog() {
//   if (typeof require != 'undefined') {
//     return loadCatalog('testdata.json', true);
//   } else {
//     return loadCatalog('../testdata.json', false);
//   }
// }

/**
 * Return course's groups as an array of arrays, split by type
 *
 * @param {Course} course - Course to get groups from
 *
 * @returns {Array<Array<Group>>}
 */
function groupsByType(course) {
  let m = new Map();
  if (!course.groups) {
    return [];
  }

  course.groups.forEach(function(group) {
    if (!m.has(group.type)) {
      m.set(group.type, []);
    }
    m.get(group.type).push(group);
  });

  return Array.from(m.values());
}

/**
 * Return the appropriate display name for the group
 *
 * @param {Group} group - Group to get display name for
 *
 * @returns {string}
 */
function displayName(group) {
  return group.description || group.course.name;
}
