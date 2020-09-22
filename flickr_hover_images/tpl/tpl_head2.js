// @include            http://gmonkey.*.*/test/*
// @include            http://devzone.*.*/test/gm/*
// @include            /http(|s)\://(|.+?\.)flickr\.com/.*/
// ==/UserScript==

/*
Changes:
2013-11-09
- JQuery removed, introducing GMBase-Framework
- Code rewritten
- Recognize Homepage-Photodownload

2010-10-15
- Add download link

2010-10-10
- Some Fixes
- Beautify the code

2010-10-08
- Switched to JQuery
- Some Fixes

2010-10-01
- Initial Version
 */

/*
Known Bugs:
- Does not work, if images are loaded via Ajax
- Could not download orginal upload, if username is given
 */
