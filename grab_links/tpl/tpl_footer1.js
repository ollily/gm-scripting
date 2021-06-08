/**
 * Adds site which should be known by this script.
 * Can be left empty.
 */
function lgm_addKnownSites() {
    gmAddSite("watch?", "(|.+?\.)youtube\..+?", ".*");
    gmAddSite("watch", "(|.+?\.)myvideo\..+?", ".*");
    gmAddSite("video", "(|.+?\.)dailymotion\..+?", ".*");
    gmAddSite("watch", "(|.+?\.)metacafe\..+?", ".*");
    gmAddSite("10", "devzone\\..+?\\.(net|eu)", "/test/gmonkey/.*");
};

/**
 * Adds CSS-Styles for this script.
 * Can be left empty.
 */

function lgm_addStyles() {
    GM_addStyle(CSS_STYLE);
    return true;
}

/*
function lgm_addStyles() {
    // the main container
    var style = new Array();
    style.push('#gl-container {position:fixed; top:0px; right:1px; margin:0px; padding:0px !important; text-align:left; vertical-align:top; width:225px; max-height:99% !important; overflow: hidden !important; z-index:2999999999 !important;}');
    style.push('#gl-container {color: #000000; background-color: #CED8F6; font-family:Courier New,Arial; font-size:11px;}');
    // General Styles
    style.push('#gl-container, #gl-container input, #gl-container button, #gl-resultplain, #gl-resultlink { -moz-border-radius: 5px; border-radius: 5px; }');
    style.push('#gl-container input {margin-right:ßpx; width:auto; border:2px solid #819FF7; color:#000000; background-color:#ffffff; font-family:Arial, Courier New; font-size:11px !important; font-weight: bold; height:20px !important;}');
    style.push('#gl-container input:hover, #gl-container input:focus {background-color:#FFFFCC; }');
    style.push('#gl-container button {border:2px solid #819FF7; color:#000000; background-color:#ffffff; margin:0px; padding:4px 3px; font-family:Arial, Courier New; font-size:11px; font-weight: bold; }');
    style.push('#gl-container button:hover {border:2px solid #ffffff; color:#ffffff; background-color:#819FF7; }');
    // Search Box
    style.push('#gl-container #gl-searchbox {position:relative; top:0px; left:0px; padding;0px; margin:0px; white-space:nowrap;}');
    style.push('#gl-container #gl-searchform {margin:0px; padding;0px; height:20px !important}');
    style.push('#gl-container #gl-searchform #gl-searchtext {min-width:50px; max-width:115px; height:20px !important}');
    style.push('#gl-container #gl-searchbox #gl-scount {min-width:5px; max-width:25px; margin-left:0px; height:20px !important; text-align:right; background-color:#EFF2FB; }');
    // Action box
    style.push('#gl-container #gl-actionbox {position:relative; top:5px; right:0px; padding: 0px; margin: 0px; white-space:nowrap;}');
    style.push('#gl-container #gl-actionbox div {color: #000000; background-color: #ffffff; white-space:nowrap;}');
    style.push('#gl-container #gl-actionbox button {padding:0px 2px; }');
    // Result Box
    style.push('#gl-container #gl-resultbox div {color: #000000; background-color: #ffffff; white-space:nowrap;}');
    style.push('#gl-container #gl-resultbox {position:relative; top:5px; right:0px; padding: 0px; margin: 0px; border: transparent none ßpx; min-width: 97%; min-height: 92%; max-width: 99%; max-height: 92%; height: 93%; width: 99%; overflow: auto;}');
    style.push('#gl-container #gl-resultbox tr, #gl-container #gl-resultbox table {padding:0pt; margin:0pt;}');
    style.push('#gl-container #gl-resultbox td, #gl-container #gl-resultbox a {font-family:Courier New, Arial; font-size:9pt !important; white-space:nowrap; padding: 0pt; margin 0pt; line-height:10pt !important}');
    style.push('#gl-container #gl-resultbox #gl-resultplain {position:absolute; top:0px; left:0px; padding: 0px; margin: 0px; border: transparent none 0pt; scrollbar-color: #819FF7 #e0e0e0; scrollbar-width: initial; min-width: 97%; min-height: 97%; max-width: 99%; max-height: 99%; height: 99%; width: 99%; overflow: auto; visibility:visible; z-index: 910;}');
    style.push('#gl-container #gl-resultbox #gl-resultlink  {position:absolute; top:0px; left:0px; padding: 0px; margin: 0px; border: transparent none 0pt; scrollbar-color: #819FF7 #e0e0e0; scrollbar-width: initial; min-width: 97%; min-height: 97%; max-width: 99%; max-height: 99%; height: 99%; width: 99%; overflow: auto; visibility:hidden; z-index: 909; color:red;}');
    style.push('#gl-container #gl-resultbox #gl-resultlink a { color:#000066; font-family:Arial,Courier New; line-height:120%;}');
    style.push('#gl-container #gl-resultbox #gl-resultlink a:hover { color: #990000;}');
    gmAddStyleGlobal(style);
    return true;
};
*/

/**
 * Adds HTML-Objects for this script.
 * Can be left empty.
 */
function lgm_addControls() {
    lgmAddControlsGrabLinks();
};

/**
 * The first action which should be excecuted in this script.
 * Can be left empty.
 */
function lgm_addInitAction() {
    return true;
};

gmInitEventHandler();
