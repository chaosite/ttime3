!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.ttime=t():e.ttime=t()}(window,function(){return function(e){var t={};function n(s){if(t[s])return t[s].exports;var a=t[s]={i:s,l:!1,exports:{}};return e[s].call(a.exports,a,a.exports,n),a.l=!0,a.exports}return n.m=e,n.c=t,n.d=function(e,t,s){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:s})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var s=Object.create(null);if(n.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var a in e)n.d(s,a,function(t){return e[t]}.bind(null,a));return s},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="dist/",n(n.s=2)}([function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(3);t.Faculty=class{};t.Group=class{};t.Course=class{};t.AcademicEvent=class{};t.Schedule=class{};t.FilterSettings=class{};function a(e){e.sort((e,t)=>e.day!==t.day?e.day-t.day:e.startMinute-t.startMinute)}function o(e){e.forEach(e=>{e.courses.forEach(t=>{t.faculty=e,t.groups&&t.groups.forEach(e=>{e.course=t,e.events&&e.events.forEach(t=>{t.group=e})})})})}t.DateObj=class{},t.sortEvents=a,t.eventsCollide=function(e){const t=e.slice();a(t);for(let e=0;e<t.length-1;e++)if(t[e].day===t[e+1].day&&t[e+1].startMinute<t[e].endMinute)return!0;return!1},t.loadCatalog=function(e){return new Promise((t,n)=>{const a=new XMLHttpRequest;a.open("GET",e),a.onload=(()=>{if(200===a.status){let e=null;try{o(e="["===a.response[0]?JSON.parse(a.response):s.parseCheeseFork(a.response)),t(e)}catch(e){n(e)}}else n(Error(a.statusText))}),a.onerror=(()=>{n(Error("Network Error"))}),a.send()})},t.fixRawCatalog=o,t.groupsByType=function(e){const t=new Map;return e.groups?(e.groups.forEach(e=>{t.has(e.type)||t.set(e.type,[]),t.get(e.type).push(e)}),Array.from(t.values())):[]}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.minutesToTime=function(e){return Math.floor(e/60).toString().padStart(2,"0")+":"+(e%60).toString().padStart(2,"0")},t.formatDate=function(e){return new Date(e.year,e.month,e.day).toDateString()},t.displayName=function(e){return e.description||e.course.name}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});let s=!1;new URL(window.location.href).searchParams.get("ttime_debug")&&(s=!0);const a=n(0),o=n(1),r=n(4),i=n(5);const l="https://storage.googleapis.com/repy-176217.appspot.com/latest.json";window.defaultCatalogUrl=l,window.setCatalogUrl=function(e){$("#catalog-url").val(e),_()};const c=new Set;let u=null,d=null;function p(e){e.text(e.data("forbidden")?"[unforbid]":"[forbid]")}function f(e){const t=$("<li>");let n=`Group ${e.id} (${e.type}) `;e.teachers.length>0&&(n+=`(${e.teachers.join(", ")}) `);const s=$("<b>",{text:n});t.append(s);const a=$("<a>",{class:"forbid-link",data:{forbidden:b(e),groupID:h(e)},href:"#/"});return p(a),a.on("click",()=>{a.data("forbidden")?function(e){m.delete(h(e)),_(),y()}(e):g(e)}),t.append(a),t}let m=new Set;function h(e){return`${e.course.id}.${e.id}`}function g(e){m.add(h(e)),_(),y()}function b(e){return m.has(h(e))}function y(){const e=$("#forbidden-groups");e.empty(),m.forEach(t=>{const n=$("<li>");n.text(t+" ");const s=$("<a>",{href:"#/",text:"[unforbid]",click(){m.delete(t),_(),y()}});n.append(s),e.append(n)}),$("a.forbid-link").each(()=>{const e=$(this).data("groupID"),t=m.has(e);$(this).data("forbidden",t),p($(this))})}function v(e){return String(e).padStart(6,"0")}i.setAddForbiddenGroupCallback(g);const w='<i class="fas fa-info-circle"></i>',x='<i class="fas fa-minus-circle"></i>';function E(e){return`<span dir="rtl">${e}</span>`}function M(e){const t=document.createElement("span"),n=document.createElement("a");return n.innerHTML=w,n.className="expando",n.href="#/",t.innerHTML=` ${v(e.id)} ${E(e.name)} `,n.onclick=(()=>{if($(t).data("ttime3_expanded"))n.innerHTML=w,$(t).data("ttime3_expanded",!1),t.removeChild($(t).data("infoDiv"));else{const a=document.createElement("div");$(t).data("infoDiv",a),a.appendChild(function(e){const t=$("<span>"),n=$("<ul>");n.append($("<li>",{html:`<b>Full name</b> ${v(e.id)} ${e.name}`})),n.append($("<li>",{html:`<b>Academic points:</b> ${e.academicPoints}`})),n.append($("<li>",{html:`<b>Lecturer in charge:</b> ${E(e.lecturerInCharge||"[unknown]")}`})),n.append($("<li>",{html:"<b>Test dates:</b>"}));const s=$("<ul>");e.testDates?e.testDates.forEach(e=>{s.append($("<li>",{text:o.formatDate(e)}))}):s.append($("<li>",{text:"[unknown]"})),n.append(s),n.append($("<li>",{html:"<b>Groups:</b>"}));const a=$("<ul>");return e.groups?e.groups.forEach(e=>{a.append(f(e)[0]);const t=$("<ul>");e.events?e.events.forEach(e=>{t.append($("<li>",{text:`${A[e.day]}, `+o.minutesToTime(e.startMinute)+"-"+o.minutesToTime(e.endMinute)+` at ${e.location||"[unknown]"}`}))}):t.append($("<li>",{text:"[unknown]"})),a.append(t)}):a.append($("<li>",{text:"[unknown]"})),n.append(a),t.append(n),t[0]}(e)),s&&console.info(e),t.appendChild(a),n.innerHTML=x,$(t).data("ttime3_expanded",!0)}}),t.appendChild(n),t}const S=new Map,C=new Map;function _(){var e;q.selectedCourses=Array.from(c).map(e=>e.id),q.customEvents=$("#custom-events-textarea").val(),q.catalogUrl=$("#catalog-url").val(),q.filterSettings={forbiddenGroups:Array.from(m),noCollisions:(e="filter.noCollisions",document.getElementById(e).checked),ratingMax:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null},ratingMin:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null}},z.forEach(e=>{q.filterSettings.ratingMin[e]=T($(`#rating-${e}-min`)[0],null),q.filterSettings.ratingMax[e]=T($(`#rating-${e}-max`)[0],null)}),window.localStorage.setItem("ttime3_settings",JSON.stringify(q)),window.gtag("event",q.catalogUrl,{event_category:"saveSettings",event_label:"catalog-url"}),window.gtag("event",q.filterSettings.noCollisions,{event_category:"saveSettings",event_label:"no-collisions"}),s&&console.info("Saved settings:",q)}function T(e,t){return""===e.value?t:Number(e.value)}function k(e){s&&console.info("Selected",e),window.gtag("event",`${e.id}`,{event_category:"SelectCourses",event_label:"addCourse"}),c.add(e),S.get(e.id).disabled=!0,C.get(e.id).classList.add("disabled-course-label"),_(),j()}function N(...e){e.forEach(e=>{const t=J(e);if(!t)throw new Error("No course with ID "+e);k(t)})}function j(){const e=Number((t=c,Array.from(t.values()).map(e=>a.groupsByType(e).map(e=>e.length).reduce((e,t)=>e*t,1)).reduce((e,t)=>e*t,1)));var t;$("#possible-schedules").text(`${e.toLocaleString()} (${e.toExponential(2)})`),$("#generate-schedules").prop("disabled",0===c.size);const n=$("#selected-courses");n.empty();const o=$("<ul>",{class:"list-group"});n.append(o),c.forEach(e=>{const t=$("<li>",{class:"list-group-item"}),n=M(e),a=$("<button>",{class:"btn btn-sm btn-danger float-right",html:'<i class="fas fa-trash-alt"></i>',click(){!function(e){s&&console.info("Unselected",e),window.gtag("event",`${e.id}`,{event_category:"SelectCourses",event_label:"delCourse"}),c.delete(e),S.get(e.id).disabled=!1,C.get(e.id).classList.remove("disabled-course-label"),_(),j()}(e)}});t.append(n),null!==e.groups&&0!==e.groups.length||t.append($("<i>",{class:"text-warning fas fa-exclamation-triangle",title:"Course has no groups"})),t.append(a),o.append(t)})}window.saveSettings=_,window.addSelectedCourseByID=N;const F=new(n(7));F.postMessage({debug:s}),F.onmessage=(e=>{s&&console.info("Received message from worker:",e),$("#generate-schedules").prop("disabled",!1),$("#spinner").hide(),null==e.data?$("#exception-occurred-scheduling").show():function(e){P=e,I=0;const t=$("#schedule-browser, #rendered-schedule-container");$("#num-schedules").text(e.length),0===e.length||1===e.length&&0===e[0].events.length?(t.hide(),$("#no-schedules").show()):(t.show(),H(0))}(e.data)}),window.checkCustomEvents=function(){const e=$("#custom-events-textarea");e.removeClass("is-invalid"),e.removeClass("is-valid");try{D(e.val()).length>0&&e.addClass("is-valid")}catch(t){e.addClass("is-invalid")}};const L=new RegExp([/(Sun|Mon|Tue|Wed|Thu|Fri|Sat) /,/([0-9]{2}):([0-9]{2})-([0-9]{2}):([0-9]{2}) /,/(.*)/].map(e=>e.source).join("")),O={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6};function D(e){const t=[];return""===e?t:(e.split("\n").forEach(e=>{const n=L.exec(e);if(null==n)throw Error("Invalid custom event line: "+e);const s=O[n[1]],a=Number(60*Number(n[2])+Number(n[3])),o=Number(60*Number(n[4])+Number(n[5])),r=n[6];t.push(function(e,t,n,s){const a={academicPoints:0,groups:[],id:0,lecturerInCharge:"",name:e,testDates:[]},o={course:a,description:"",events:[],id:0,teachers:[],type:"lecture"};a.groups.push(o);const r={day:t,endMinute:s,group:o,location:"",startMinute:n};return o.events.push(r),a}(r,s,a,o))}),t)}window.getSchedules=function(){$("#generate-schedules").prop("disabled",!0),$("#spinner").show(),$("#exception-occurred").hide(),$("#no-schedules").hide(),$("#initial-instructions").hide(),window.gtag("event","generateSchedules"),window.gtag("event","generateSchedules-num-courses",{value:c.size});const e=new Set(c);try{D(q.customEvents).forEach(t=>e.add(t))}catch(e){console.error("Failed to build custom events course:",e)}F.postMessage({courses:e,filterSettings:q.filterSettings})};let P=[],I=0;window.nextSchedule=function(){H(I+1)},window.prevSchedule=function(){H(I-1)};const A=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],G=[["#007bff","#fff"],["#e83e8c","#fff"],["#ffc107","#000"],["#6610f2","#fff"],["#dc3545","#fff"],["#28a745","#fff"],["#6f42c1","#fff"],["#fd7e14","#000"],["#20c997","#fff"],["#17a2b8","#fff"],["#6c757d","#fff"],["#343a40","#fff"]];function H(e){const t=P.length;I=e=(e+t)%t,$("#current-schedule-id").text(e+1);const n=P[e];!function(e,t){e.empty(),z.map(e=>B(e,t)).forEach(t=>{e.append(t).append(" ")});const n=$("<ul>",{class:"list-group"});e.append(n),function(e){const t=e.events.slice(),n=[[]];a.sortEvents(t);let s=t[0].day;return t.forEach(e=>{e.day!==s&&(n.push([]),s=e.day),n[n.length-1].push(e)}),n}(t).forEach(e=>{const t=$("<li>",{class:"list-group-item",css:{"padding-top":"2px","padding-bottom":"2px"},html:$("<small>",{class:"font-weight-bold",text:A[e[0].day]})});n.append(t),e.forEach(e=>{const t=$("<li>",{class:"list-group-item"}),s=o.minutesToTime(e.startMinute),a=e.location||"[unknown]",r=o.minutesToTime(e.endMinute),i=e.group.teachers.join(",")||"[unknown]";t.html(`\n        <div class="d-flex w-100 justify-content-between">\n           <small class="text-muted">\n             <i class="far fa-clock"></i>\n             ${s}-${r}\n           </small>\n           <small>\n             <i class="fas fa-map-marker"></i>\n             <span dir="rtl">${a}</span>\n           </small>\n        </div>\n        <div dir="rtl">${o.displayName(e.group)}</div>\n        <div class="d-flex w-100 justify-content-between">\n          <small>\n            <i class="fas fa-chalkboard-teacher"></i>\n            <span dir="rtl">${i}</span>\n          </small>\n          <small class="text-muted">\n            ${v(e.group.course.id)}, group ${e.group.id}\n          </small>\n        </div>\n        `),n.append(t)})})}($("#schedule-contents"),n),i.renderSchedule($("#rendered-schedule")[0],n,function(e){const t=Array.from(e.values()).map(e=>e.id).sort();t.push(0);const n=t.map((e,t)=>[e,G[t]]);return new Map(n)}(c))}let R="",U=!0;const W={earliestStart:{badgeTextFunc:e=>`Earliest start: ${e}`,explanation:"Hour at which the earliest class of the week start",name:"Earliest start"},freeDays:{badgeTextFunc:e=>`${e} free days`,explanation:"Number of days with no classes",name:"Free days"},latestFinish:{badgeTextFunc:e=>`Latest finish: ${e}`,explanation:"Hour at which the latest class of the week finishes",name:"Latest finish"},numRuns:{badgeTextFunc:e=>`${e} runs`,explanation:"Number of adjacent classes in different buildings",name:"Number of runs"}},z=Object.keys(W);function B(e,t){const n=$("<a>",{class:"badge badge-info",href:"#/",id:`rating-badge-${e}`,text:W[e].badgeTextFunc(t.rating[e]),title:W[e].explanation,click(){!function(e){R===e&&(U=!U),R=e,P.sort((t,n)=>(U?1:-1)*(t.rating[e]-n.rating[e])),H(0),z.forEach(e=>{$(`#rating-badge-${e}`).replaceWith(B(e,P[0]))})}(e)}});if(R===e){const e=U?"fa-sort-up":"fa-sort-down";n.append(` <i class="fas ${e}"></i>`)}return n}function J(e){return d.get(e)}!function(){const e=$("#rating-limits-form");z.forEach(t=>{const n=$("<div>",{class:"row"});e.append(n),n.append($("<div>",{class:"col col-form-label",text:W[t].name,title:W[t].explanation})),n.append($("<div>",{class:"col",html:$("<input>",{change:_,class:"form-control",id:`rating-${t}-min`,placeholder:"-∞",type:"number"})})),n.append($("<div>",{class:"col",html:$("<input>",{change:_,class:"form-control",id:`rating-${t}-max`,placeholder:"∞",type:"number"})}))})}();const q=function(e){let t={catalogUrl:l,customEvents:"",filterSettings:{forbiddenGroups:[],noCollisions:!0,ratingMax:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null},ratingMin:{earliestStart:null,freeDays:null,latestFinish:null,numRuns:null}},forbiddenGroups:[],selectedCourses:[]};""!==e&&(t=$.extend(!0,t,JSON.parse(e))),s&&console.info("Loaded settings:",t),$("#catalog-url").val(t.catalogUrl),$("#custom-events-textarea").val(t.customEvents);{const e=t.filterSettings;n="filter.noCollisions",a=e.noCollisions,document.getElementById(n).checked=a,z.forEach(t=>{$(`#rating-${t}-min`).val(e.ratingMin[t]),$(`#rating-${t}-max`).val(e.ratingMax[t])})}var n,a;return t}(window.localStorage.getItem("ttime3_settings"));m=new Set(q.filterSettings.forbiddenGroups),y(),a.loadCatalog(q.catalogUrl).then(e=>{s&&console.log("Loaded catalog:",e),u=e,d=new Map,u.forEach(e=>{e.courses.forEach(e=>{d.set(e.id,e)})}),function(){const e=$("#catalog");e.empty(),u.forEach(t=>{const n=$("<details>"),s=$("<summary>");s.html(`<strong>${t.name}</strong> `);const a=$("<span>",{class:"badge badge-secondary",text:t.semester});s.append(a),n.append(s),e.append(n);const o=$("<ul>",{class:"course-list"});n.append(o),t.courses.forEach(e=>{const t=$("<button>",{text:"+",click(){k(e)}});S.set(e.id,t);const n=M(e);C.set(e.id,n);const s=$("<li>");s.append(t).append(n),o.append(s)})})}(),q.selectedCourses.forEach(e=>{try{N(e)}catch(t){console.error(`Failed to add course ${e}:`,t)}}),function(){const e=$("#courses-selectize"),t=[],n=[];u.forEach(e=>{n.push({label:e.name,value:e.name}),e.courses.forEach(n=>{t.push({nicknames:r.default(n),optgroup:e.name,text:`${v(n.id)} - ${n.name}`,value:n.id})})}),e.selectize({optgroups:n,options:t,searchField:["text","nicknames"],onItemAdd(t){""!==t&&(k(J(Number(t))),e[0].selectize.clear())}})}()},e=>{$("#exception-occurred-catalog").show(),console.error("Failed to load catalog:",e)})},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=/([0-9]{1,2})\.([0-9]{1,2})\.([0-9]{4})/;function a(e){if(!e)return null;const t=s.exec(e);return null==t?(console.warn("Failed to match date regex with: ",e),null):{day:Number(t[1]),month:Number(t[2]),year:Number(t[3])}}t.parseCheeseFork=function(e){const t={academicPoints:"נקודות",building:"בניין",courseId:"מספר מקצוע",courseName:"שם מקצוע",day:"יום",dayLetters:"אבגדהוש",faculty:"פקולטה",group:"קבוצה",hour:"שעה",lecturer_tutor:"מרצה/מתרגל",moed_a:"מועד א",moed_b:"מועד ב",num:"מס.",room:"חדר",sport:"ספורט",thoseInCharge:"אחראים",type:"סוג"},n=new Map([["הרצאה","lecture"],["תרגול","tutorial"]]),s=new Map;if(!e.startsWith("var courses_from_rishum = "))throw new Error("Not valid cheesefork jsData - lacks expected prefix");return JSON.parse(e.substring("var courses_from_rishum = ".length)).forEach(e=>{const o=e.general[t.faculty];s.has(o)||s.set(o,{courses:[],name:o,semester:"cheesefork-unknown-semester"});const r=s.get(o),i={academicPoints:Number(e.general[t.academicPoints]),faculty:r,groups:[],id:Number(e.general[t.courseId]),lecturerInCharge:e.general[t.thoseInCharge],name:e.general[t.courseName],testDates:[e.general[t.moed_a],e.general[t.moed_b]].map(a).filter(e=>null!=e)},l=new Map,c=new Map;e.schedule.forEach(e=>{const s=e[t.group],a=e[t.num];if(l.has(a)||l.set(a,s),l.get(a)!==s)return;if(!c.has(a)){let s="",r="";o===t.sport?(s="sport",r=e[t.type]):s=n.get(e[t.type])||e[t.type],c.set(a,{course:i,description:r,events:[],id:a,teachers:[],type:s})}const r=c.get(a),u=function(e){return e.split(" - ").map(e=>{const t=e.split(":");let n=60*Number(t[0]);return t.length>1&&(n+=10*Number(t[1])),n})}(e[t.hour]),d={day:t.dayLetters.indexOf(e[t.day]),endMinute:u[1],group:r,location:e[t.building]+" "+e[t.room],startMinute:u[0]};{const n=e[t.lecturer_tutor];n&&!r.teachers.includes(n)&&r.teachers.push(n)}r.events.push(d)}),c.forEach((e,t)=>{i.groups.push(e)}),r.courses.push(i)}),Array.from(s.values())}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){const t=[];return e.name.includes("חשבון דיפרנציאלי ואינטגרלי")&&t.push("חדוא",'חדו"א'),e.name.includes("מדעי המחשב")&&t.push("מדמח",'מדמ"ח'),e.name.includes("פיסיקה")&&t.push("פיזיקה"),e.name.includes("אנליזה נומרית")&&t.push("נומריזה"),t.join(" ")}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});const s=n(0),a=n(1),o=n(6);function r(e){return Math.min(...e.events.map(e=>e.startMinute))}function i(e){return Math.max(...e.events.map(e=>e.endMinute))}t.renderSchedule=function(e,t,n){e.innerHTML="";const d=r(t),p=100/(i(t)-d);o.default(t.events,s.eventsCollide).forEach(t=>{const s=document.createElement("div"),o=t.obj;s.className="event";const r=n.get(o.group.course.id);s.style.backgroundColor=r[0],s.style.color=r[1],u(s,"%",100/6*(1+o.day+t.layer/t.numLayers),p*(o.startMinute-d),100/6/t.numLayers,p*(o.endMinute-o.startMinute)),function(e,t){e.innerHTML="";const n=document.createElement("span");n.className="course-name",n.innerText=a.displayName(t.group),e.appendChild(n);const s=document.createElement("span");s.className="event-type",s.innerText=t.group.type,e.appendChild(s);const o=document.createElement("div");if(o.className="location",o.innerText=t.location,e.appendChild(o),l){const n=document.createElement("div");n.className="forbid";const s=document.createElement("a");s.innerHTML='<i class="fas fa-ban"></i>',s.href="#/",s.title="Forbid this group",s.onclick=(()=>{$(s).fadeOut(100).fadeIn(100),l(t.group)}),n.appendChild(s),e.appendChild(n)}}(s,o),e.appendChild(s)}),function(e,t){const n=r(t),s=i(t),o=100/(s-n),l=Math.ceil(n/c)*c,d=Math.floor(s/c)*c;for(let t=l;t<=d;t+=c){const s=document.createElement("div");s.className="grid-line",s.innerText=a.minutesToTime(t),u(s,"%",0,o*(t-n),100,o*c),e.appendChild(s)}}(e,t)};let l=null;t.setAddForbiddenGroupCallback=function(e){l=e};const c=30;function u(e,t,n,s,a,o){e.style.left=`${n}${t}`,e.style.top=`${s}${t}`,e.style.width=`${a}${t}`,e.style.height=`${o}${t}`}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.default=function(e,t){const n=[];let s=e.slice();for(;s.length>0;){let e=new Set([s[0]]),a=!0;for(;a;){a=!1;const n=e;e=new Set,n.forEach(n=>{e.add(n),s.forEach(s=>{t([s,n])&&(e.add(s),a=!0)})}),s=s.filter(t=>!e.has(t))}const o=[];e.forEach(e=>{let n=!1;o.some((s,a)=>!t(s.concat([e]))&&(n=!0,s.push(e),!0)),n||o.push([e])}),o.forEach((e,t)=>{e.forEach(e=>{n.push({obj:e,layer:t,numLayers:o.length})})})}return n}},function(e,t,n){e.exports=function(){return new Worker(n.p+"scheduler_worker.js")}}])});