# Browser Skill & Reaction Game

### A mouse/touch based browser game (ES6+), themed around holding onto the diamond stolen in a heist. Users are required to survive for as long as possible, avoiding the patrolling guards and arrest points, while grabbing further loot that randomly appears. All amount to a higher score, and the aim is to achieve as high a score as possible before your resistance to arrest wears down. As usual, designed with maximum compatibility in mind between modern browsers, and mobile devices. On desktop/laptops or any device with a mouse input, this game functions with the diamond following the user's mouse when it is stationary, so to guide it with precaution but present a challenge. Similarly, yet slightly different, on a touch/mobile device, a user must press the point on the screen to where they want the diamond to travel, in the gaming area/space.

<br>

***

##### <i>This is a stand-alone repo, that you simply need to download, extract and then open from the root html file ("index.html"), in any browser. Not pre-ES6 compatible, although easy to adapt down: You will find the random object mover constructor-function/prototyping JS script in the 'bitesize-code' repo, which is a big chunk of the ES6 code used in this project (class constructor block)- from then you can adapt down by removing any remaining ES6 syntax. ES6 is the ECMAScript 2015 'big' release.

***

<br><i>

|Version| Changes|
|:---|:---|
|Version 0.0.1 [2020-02-13]|<ul><li>Initial Commit.</li><li>Add main html file.</li><li>Add README.md</li><li>Upload "resources" folder and contents.</li><li>Make new dir "Screenshots".</li></ul>|
|Version 0.0.2 [2020-02-15]|<ul><li>Remove low quality feature: randomize enemy/player formation.</li><li>Split main/master html into constituent .html, .css & .js files (+ make new dir for css and js)- easier management.</li><li>Update README.md.</li><li>Amend feature Class Object Constructor (from ES5 constructor function)to "main.js".</li><li>Tidy up code in "main.js" by reformatting and restructuring.</li><li>Add new screenshot files to dir "Screenshots".</li><li>Add deafult player/enemy positions in html file.</li><li>Add new function to "main.js" file, to begin work on formation setter.</li></ul>|
|Version 0.1.0 [2020-02-16]|<ul><li>Add feature: 2 patrolling objects (up from from 1), selectable from a dropdown.</li><li>Add feature: Formation setter dropdown, setting a new layout, or formation, of the alarms/enemies positions.</li><li>Change game's theme from football to heist, with rebrand and free-to-use images (with footer artist mentions).</li><li>Add area of effect indicator around alarm/enemy icons.</li><li>Add new screenshot file to dir "Screenshots".</li><li>Update and replace files in "resources" folder, and replace "favicon".</li><li>Update README.md.</li></ul>|
|Version 0.1.1 [2020-02-17]|<ul><li>Add feature: PowerUp, which periodically spawns and awards 2xlives if you can get to it with the diamond in time.</li><li>Update the way total score is calculated at the end, to reflect all stats recorded from gameplay.</li><li>Update some icons/resources dir.</li><li>Need to fix random background color changer.</li><li>Minor css & html changes.</li><li>Update README.md.</li></ul>|
|Version 0.1.2 [2020-02-18]|<ul><li>Replace not matching patrolling guard image, with matching.</li><li>Update the way total score and lives are calculated by generally increasing all values (including increasing the amount you lose).</li><li>Rebrand lives to 'Resistance', as in resisting arrest.</li><li>Minor css and html files changes.</li><li>General Bug fixes.</li><li>Update README.md.</li></ul>|
|Version 1.0.0 [2020-02-19]|<ul><li>1.0.0 Release!!!</li><li>General bug fixes and tidy up.</li><li>New map/screen arrest point layouts.</li><li>Formatting, restructuring and comment overhaul.</li><li>CSS and HTML changes.</li><li>Tested to work on iphone/ipad, ios 11 and android galaxy S9.</li><li>Update README.md.</li></ul>|
|Version 1.0.1 [2020-03-09]|<ul><li>Rename css and script files.</li><li>Update README.md.</li></ul>|
|Version 1.0.2 [2020-05-22]|<ul><li>Renaming repo and description update.</li><li>Update README.md.</li></ul>|