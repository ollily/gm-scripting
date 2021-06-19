// ==UserScript==
// @name            Grab Links
// @fullname        Grab Links
// @description     Lists all links from one webpage, so you can copy them easily.
// @name:en         Grab Links
// @fullname:en     Grab Links
// @description:en  Lists all links from one webpage, so you can copy them easily.
// @name:de         Link Schnapper
// @fullname:de     Link Schnapper
// @description:de  Alle Links einer Webseite werden aufgelistet und du kannst sie einfach kopieren.
// @author          ollily2907
// @license         Apache License, Version 2.0
// @license         https://www.apache.org/licenses/LICENSE-2.0.txt
// @homepageURL     https://github.com/ollily/gm-scripting
// @supportURL      https://github.com/ollily/gm-scripting
// @downloadURL     https://raw.githubusercontent.com/ollily/gm-scripting/grab_links/grab_links.user.js
// @installURL      https://raw.githubusercontent.com/ollily/gm-scripting/grab_links/grab_links.user.js
// @updateURL       https://raw.githubusercontent.com/ollily/gm-scripting/grab_links/grab_links.user.js
// @source          https://raw.githubusercontent.com/ollily/gm-scripting/grab_links/grab_links.user.js
// @icon            https://raw.githubusercontent.com/ollily/gm-scripting/master/grab_links/resource/gl_logo.png
// @compatible      chrome
// @compatible      firefox
// @namespace       http://userscripts.org/users/ollily
// @run-at          document-end
// @version         2.02.000
// @grant           unsafeWindow
// @grant           GM_addStyle
// @grant           GM.addStyle
// @grant           GM_getResourceText
// @grant           GM.getResourceText
// @include         http://gmonkey.*.*/test/*
// @include         http://devzone.*.*/test/gm/*
// @include         /http(|s)\://(|.+?\.)youtube\..+?/.*/
// @include         /http(|s)\://(|.+?\.)myvideo\..+?/.*/
// @include         /http(|s)\://(|.+?\.)dailymotion\..+?/.*/
// @include         /http(|s)\://(|.+?\.)metacafe\..+?/.*/
// ==/UserScript==

/*
 Changes:
 2021-06-03
 - switch to different IDE
 - clean code

 2014-05-28
 - some layout fixes
 - overlays the yt header

 2013-03-29
 - the first 2.x release
 - removing JQuery from script
 - new color layout
 - now search through link and link description / caption
 - optional disable new search and search only by url

 2013-02-20
 - Detecting clipboard support (disabling on new browsers)

 2011-12-27
 - Version Number changed
 - Added Copy to Clipboard Support (if enabled)

 2011-12-20
 - Added a 'SELECT ALL' Button
 - Search result can be displayed as plain text or linked text

 2011-02-06
 - Added JSDoc / Code cleaning
 - Code Testing function
 - Layout update

 2011-01-22
 - Layout update

 2010-09-08
 - Don't start search, if it's a known site
 - Layout update

 2010-08-19
 - Layout update
 - Set automatic filter on favorite sites
 - Many Bugfixes

 2010-07-24
 - Initial Release
 */

//
// Global Code - START
//

// ---------------
// base-core.js - START
// ---------------

/**
 * List of all URLs which are known by this script.
 */
var knownSite = [];
var currHost = document.location.host;
var currPort = document.location.port;

/**
 * The URL we are currently running on.
 */
var currSite = currHost;
if (document.location.port) {
    currPort = ":" + document.location.port;
    if (currSite.search(currPort) == -1) {
        currSite += ":" + document.location.port;
    }
}
var currPath = document.location.href.substring(document.location.href
        .indexOf(currSite)
        + currSite.length);

var bTestMode = false;

var INIT_ONLOAD = true;


// - General DHTML-Lib - Start
// - modified & extended dhtml.js from selfhtml.de

var DHTML = false, DOM = false, MSIE4 = false, NS4 = false, OP = false;

var shortId = "id";

var ATTR_SEP = ";";

if (document.getElementById) {
    DHTML = true;
    DOM = true;
} else {
    if (document.all) {
        DHTML = true;
        MSIE4 = true;
    } else {
        if (document.layers) {
            DHTML = true;
            NS4 = true;
        }
    }
}
if (window.opera) {
    OP = true;
}

/**
 * Shorthand, tries to find one element represented by the identifier in the
 * page.
 *
 * @param identifier -
 *            the key (id) of the element
 * @returns {Object} the found object or null
 */
function gmGetElI(identifier) {
    return gmGetEl(shortId, identifier, null);
}

/**
 * Tries to find one element represented by the identifier in the page.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber -
 *            the index (only used for Mode=name, tagname)
 * @returns {Object} the found object or null
 */
function gmGetEl(mode, identifier, elementNumber) {
    var element, elementList;
    if (gmIsObject(identifier)) {
        return identifier;
    }
    if (!elementNumber) {
        elementNumber = 0;
    }
    if (!gmIsInstanceOf(mode, String)) {
        if (mode != null) {
            alert(mode.id + " " + identifier.constructor);
        } else {
            alert(null);
        }
    }
    if (DOM) {
        if (mode.toLowerCase() == "id") {
            element = document.getElementById(identifier);
            return element;
        }
        if (mode.toLowerCase() == "name") {
            elementList = document.getElementsByName(identifier);
            element = elementList[elementNumber];
            if (!element || element == "undefined") {
                element = null;
            }
            return element;
        }
        if (mode.toLowerCase() == "tagname") {
            elementList = document.getElementsByTagName(identifier);
            element = elementList[elementNumber];
            return element;
        }
        return null;
    }
    if (MSIE4) {
        if (mode.toLowerCase() == "id" || mode.toLowerCase() == "name") {
            element = document.all(identifier);
            return element;
        }
        if (mode.toLowerCase() == "tagname") {
            elementList = document.all.tags(identifier);
            element = elementList[elementNumber];
            return element;
        }
        return null;
    }
    if (NS4) {
        if (mode.toLowerCase() == "id" || mode.toLowerCase() == "name") {
            element = document[identifier];
            if (!element) {
                element = document.anchors[identifier];
            }
            return element;
        }
        if (mode.toLowerCase() == "layerindex") {
            element = document.layers[identifier];
            return element;
        }
        return null;
    }
    return null;
}

/**
 * Tries to find all elements represented by the identifier in the page.
 *
 * @param mode
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier
 *            the key (id, name, tagname) of the element
 * @returns {Object} returns the found content as array or null
 */
function gmGetElList(mode, identifier) {
    if (gmIsObject(identifier)) {
        return identifier;
    }
    if (identifier == null) {
        return null;
    }
    if (DOM) {
        if (mode.toLowerCase() == "name") {
            return document.getElementsByName(identifier);
        }
        if (mode.toLowerCase() == "tagname") {
            return document.getElementsByTagName(identifier);
        }
        return null;
    }
    if (MSIE4) {
        if (mode.toLowerCase() == "id" || mode.toLowerCase() == "name") {
            element = document.all(identifier);
            return element;
        }
        if (mode.toLowerCase() == "tagname") {
            return document.all.tags(identifier);
        }
        return null;
    }
    if (NS4) {
        return gmGetEl(mode, identifier);
    }
    return null;
}

/**
 * Shorthand, tries to find an attribute of an element in the page.
 *
 * @param identifier -
 *            the key (id) of the element
 * @param attributeName -
 *            the name of the attribute
 * @returns {Object} returns the found attribute or false
 */
function gmGetAtI(identifier, attributeName) {
    return gmGetAt(shortId, identifier, null, attributeName);
}

/**
 * Tries to find an attribute of an element in the page.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber -
 *            the index (only used for Mode=name, tagname)
 * @param attributeName -
 *            the name of the attribute
 * @returns {Object} returns the found attribute or null
 */
function gmGetAt(mode, identifier, elementNumber, attributeName) {
    var attribute = null;
    var element = gmGetEl(mode, identifier, elementNumber);
    if (element) {
        if (DOM || MSIE4) {
            try {
                attribute = element[attributeName];
            } catch (e) {
                try {
                    attribute = element.getAttribute(attributeName);
                } catch (e2) {
                    // ignored
                }
            }
        }
        if (NS4) {
            attribute = element[attributeName];
            if (!attribute) {
                attribute = null;
            }
        }
    }
    return attribute;
}

/**
 * Shorthand, tries to find the content of an element in the page.
 *
 * @param identifier -
 *            the key (id) of the element
 * @returns {Object} returns the found content or null
 */
function gmGetCoI(identifier) {
    return gmGetCo(shortId, identifier, null);
}

/**
 * Tries to find the content of an element in the page.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber -
 *            the index (only used for Mode=name, tagname)
 * @returns {Object} returns the found content or null
 */
function gmGetCo(mode, identifier, elementNumber) {
    var content = null;
    var element = gmGetEl(mode, identifier, elementNumber);
    if (element) {
        if (DOM && element.firstChild) {
            if (element.firstChild.nodeType == 3) {
                content = element.firstChild.nodeValue;
            } else {
                content = "";
            }
            return content;
        }
        if (MSIE4) {
            content = element.innerText;
            return content;
        }
    }
    return content;
}

/**
 * Shorthand, tries to set the new content to an element in the page.
 *
 * @param identifier -
 *            the key (id) of the element
 * @param text -
 *            the new text to set to the element
 * @returns {Boolean} TRUE=if set was successfull, else FALSE
 */
function gmSetCoI(identifier, text) {
    return gmSetCo(shortId, identifier, null, text);
}

/**
 * Tries to set the new content to an element in the page.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber -
 *            the index (only used for Mode=name, tagname)
 * @param text -
 *            the new text to set to the element
 * @returns {Boolean} TRUE=if set was successfull, else FALSE
 */
function gmSetCo(mode, identifier, elementNumber, text) {
    var element = gmGetEl(mode, identifier, elementNumber);
    if (element) {
        if (DOM) {
            if (!element.firstChild) {
                element.appendChild(document.createTextNode(""));
            }
            element.firstChild.nodeValue = text;
            return true;
        }
        if (MSIE4) {
            element.innerText = text;
            return true;
        }
        if (NS4) {
            element.document.open();
            element.document.write(text);
            element.document.close();
            return true;
        }
    }
    return false;
}
// - General DHTML-Lib - End

/**
 * Shorthand: Sets a new value for an attribute to an element, any existing
 * attribute value is replaced.
 *
 * @param identifier -
 *            the key (id) of the element
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmSetAtI(identifier, attributeName, attributeValue) {
    return gmSetAt(shortId, identifier, null, attributeName, attributeValue);
}

/**
 * Sets a new value for an attribute to an element, any existing attribute value
 * is replaced.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmSetAt(mode, identifier, elementNumber, attributeName, attributeValue) {
    //var attribute;
    var element = gmGetEl(mode, identifier, elementNumber);
    if (element) {
        if (DOM || MSIE4) {
            try {
                element[attributeName] = attributeValue;
            } catch (e) {
                try {
                    element.setAttribute(attributeName, attributeValue);
                } catch (e2) {
                    // ignored
                }
            }
            return true;
            // return gmGetAt(mode, identifier, elementNumber, attributeName);
        }
        if (NS4) {
            element[attributeName] = attributeValue;
            return true;
            // return gmGetAt(mode, identifier, elementNumber, attributeName);
        }
    }
    return false;
}

/**
 * Adds an additional value for an attribute to an element, the new value is
 * appended at the end.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmAppAt(mode, identifier, attributeName, attributeValue) {
    var oldValue = gmGetAt(mode, identifier, attributeName);
    var newValue = oldValue + ATTR_SEP + attributeValue;
    return gmSetAt(mode, identifier, attributeName, newValue);
}

/**
 * Shorthand: Adds an additional value for an attribute to an element, the new
 * value is appended at the end.
 *
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmAppAtI(identifier, attributeName, attributeValue) {
    return gmAppAt(shortId, identifier, attributeName, attributeValue);
}

/**
 * Verifies if an instance is an array.
 *
 * @param obj -
 *            the instance to test
 * @returns {Boolean} TRUE=if instance is an array, else FALSE
 */
function gmIsArray(obj) {
    return gmIsInstanceOf(obj, Array);
}

function gmIsFunction(obj) {
    return gmIsInstanceOf(obj, Function);
}

function gmIsUndefined(obj) {
    return (obj == null ? true : (typeof obj == "undefined"));
}
/**
 * Verifies if an instance is an object.
 *
 * @param obj -
 *            the instance to test
 * @returns {Boolean} TRUE=if instance is an object, else FALSE
 */
function gmIsObject(obj) {
    return (obj == null ? false : (typeof obj == "object"));
}

/**
 * Tests, if an instanced object is from the requested type.
 *
 * @param obj -
 *            an instance of an object (must not be null)
 * @param objType -
 *            a name of a type, if null it will be replaced by "Object"
 * @returns {Boolean} TRUE = if the object is from the tested type, else FALSE
 */
function gmIsInstanceOf(obj, objType) {
    var isType = false;
    if (obj != null) {
        if (objType == null) {
            objType = "Object";
        }
        try {
            tObjType = eval(objType);
            isType = (obj.constructor == tObjType);
        } catch (e) {
            // ignore
        }
        // isType = (typeof obj) == objType;
    }
    return isType;
}

/**
 * Removes all spaces from the left.
 *
 * @param a -
 *            the string to trim
 * @returns {String} the trimmed string
 */
function ltrim(a) {
    var ret = null;
    if (a != null) {
        ret = new String(a);
        var pos = 0;
        while (a.charAt(pos) == " ") {
            pos++;
        }
        ret = a.substring(pos);
    }
    return ret;
}

/**
 * Removes all spaces from the right.
 *
 * @param a -
 *            the string to trim
 * @returns {String} the trimmed string
 */
function rtrim(a) {
    var ret = null;
    if (a != null) {
        ret = new String(a);
        var pos = a.length - 1;
        while (a.charAt(pos) == " ") {
            pos--;
        }
        ret = a.substring(0, pos + 1);
    }
    return ret;
}

/**
 * Removes all space from the left and right.
 *
 * @param a -
 *            the string to trim
 * @returns {String} the trimmed string
 */
function trim(a) {
    return ltrim(rtrim(a));
}

function gmCleanText(dirtyText) {
    var cleanText = "";
    if (gmIsInstanceOf(dirtyText, String)) {
        cleanText = dirtyText.replace(/\s\s/g, "").replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "").replace(/#/g, "");
    }
    return cleanText;
}

/**
 * Extracts a numeric value from a text. Supports only "full" numbers;
 *
 * @param a
 *            the text to parse
 * @returns {Number} the found numeric value or 0;
 */
function gmToNo(a) {
    var numFound = "";
    if (isNaN(a)) {
        if (a && a.length > 0) {
            for ( var int = 0; int < a.length; int++) {
                var a_ele = a[int];
                if (!isNaN(a_ele)) {
                    numFound += a_ele;
                } else {
                }
            }
        }
    } else {
        numFound = a;
    }
    newNum = new Number(numFound).valueOf();
    if (typeof(newNum) != "number") {
        newNum = 0;
    }
    return newNum;
}

const SORT_NO  = 0;
const SORT_DEF = 1;
const SORT_REV = 2;
const SORT_NUM = 3;
/**
 * Sorts an array by a specific sort order (alphanumeric).
 *
 * @param unsortedArray - the aray which should be sorted
 * @param sortMode      - the sort order or leave null to ignore sorting
 * @returns {Array} the sorted array
 */
function gmSortArray(unsortedArray, sortMode) {
    var sortedArray = unsortedArray;
    if (sortMode == null) {
        sortMode = false;
    }
    if (sortMode == SORT_NUM) {
        sortedArray.sort(function(aE, bE){
            return aE - bE;
        });
    } else if (sortMode == SORT_REV) {
        sortedArray.reverse();
    } else if (sortMode || sortMode == SORT_DEF) {
        sortedArray.sort();
    }
    return sortedArray;
}

function gmSortObject(unsortedObjects, sortField) {
    try {
        if (gmIsArray(unsortedObjects)) {
            unsortedObjects.sort(function(aElem, bElem) {
              var x = aElem[sortField].toLowerCase();
              var y = bElem[sortField].toLowerCase();
              if (x < y) {return -1;}
              if (x > y) {return 1;}
              return 0;
            }
        )};
    } catch (ex) {
        alert(ex);
    }
    return unsortedObjects;
}

function gmOnlyUnique(arrArray) {
    var arrUnique = [];
    if (gmIsArray(arrArray)) {
        arrUnique = arrArray.filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
    }
    return arrUnique;
}

/**
 * The start point for all gmonkey scripts.
 *
 * @param e -
 *            the occuring event
 * @returns {Boolean} TRUE = if all handler are succesfull done, else FALSE
 */
function gmAddHandler(e) {
    var isDone = false;
    lgm_addKnownSites();
    lgm_addStyles();
    lgm_addControls();
    lgm_addInitAction();
    isDone = true;
    return isDone;
}


/**
* Now add the event handler.
*/
function gmInitEventHandler() {
    if (INIT_ONLOAD) {
        window.addEventListener("load",  function(e) {
            gmAddHandler(e);
        });
    }
}

// ---------------
// base-core.js - END
// ---------------
// ---------------
// base-object.js - START
// ---------------

/**
 * Creates an DOM-Object.
 *
 * @param par -
 *            the parent object to create the new object as child
 * @param objtyp -
 *            the type of the new object (HTML-Tagname)
 * @param id -
 *            the id and name of the new object
 * @returns {Object} the created object or null
 */
function gmCreateObj(par, objtyp, id) {
    // var obj = $("<" + objtyp + ">");
    var obj = null;
    if (objtyp != null && objtyp != "") {
        obj = document.createElement(objtyp);
        if (obj) {
            if (id != null) {
                // obj.attr("id", id);
                // obj.attr("name", id);
                gmSetAtI(obj, "id", id);
                gmSetAtI(obj, "name", id);
            }
            if (gmIsObject(par)) {
                // $(par).append(obj);
                par.appendChild(obj);
            }
        }
    }
    return obj;
}

/**
 * Create common attributes for an DOM-Object. Leave null if not used.
 *
 * @param obj -
 *            the object to create the attributes in it
 * @param caption -
 *            a text which will be displayed for this object
 * @param tit -
 *            a W3C-conform title for that DOM
 * @param ro -
 *            if set != null, the DOM will be readonly
 * @param ev_click -
 *            a javascript-call for the click-event
 * @param ev_focus -
 *            a javascript-call for the focus-event
 * @param ev_mOver -
 *			  a javascript-call for the mouseover-event
 * @param ev_mOut -
 *			  a javascript-call for the mouseout-event
 * @param ev_dblClick -
 *			  a javascript-call for the doubleclick-event
 * @returns {Object} the object with added attributes FIXME: Check
 */
function gmCreateObjCommon(obj, caption, tit, ro, ev_click, ev_focus, ev_mOver, ev_mOut, ev_dblClick) {
    if (obj) {
        // obj.attr("title", tit);
        gmSetAtI(obj, "title", tit);
        if (ro) {
            // obj.attr("readonly", "readonly");
            gmSetAtI(obj, "readonly", "readonly");
        }
        if (caption) {
            // obj.append(caption);
            gmSetCoI(obj, caption);
        }
        if (ev_click) {
            // obj.click(ev_click);
            obj.onclick = ev_click;
        };
        if (ev_dblClick) {
            // obj.click(ev_dblClick);
            obj.ondblclick = ev_dblClick;
        };
        if (ev_focus) {
            // obj.focus(ev_focus);
            obj.onfocus = ev_focus;
        };
        if (ev_mOver) {
            // obj.hover(ev_mOver);
            obj.onmouseover = ev_mOver;
        };
        if (ev_mOut) {
            // obj.hover(ev_mOut);
            obj.onmouseout = ev_mOut;
        };
    }
    return obj;
}

/**
 * Creates a DOM-Button.
 *
 * @param par -
 *            the parent object to create the new object as child
 * @param typ -
 *            the type of the new object (HTML-Tagname)
 * @param id -
 *            the id and name of the new object
 * @param caption -
 *            a text which will be displayed for this object
 * @param tit -
 *            a W3C-conform title for that DOM
 * @param initval -
 *            an initial value is set in this input
 * @param ev_click -
 *            a javascript-call for the click-event
 * @returns {Object} the created DOM-Button
 */
function gmCreateButton(par, typ, id, caption, tit, initval, ev_click) {
    var obj = gmCreateObj(par, "button", id);
    obj = gmCreateObjCommon(obj, caption, tit, null, ev_click);
    if (!typ) {
        typ = "button";
    }
    gmSetAtI(obj, "type", typ);
    if (initval) {
        gmSetAtI(obj, "value", initval);
    }
    return obj;
}

/**
 * Creates a DOM-Link.
 *
 * @param par -
 *            the parent object to create the new object as child
 * @param id -
 *            the id and name of the new object
 * @param caption -
 *            a text which will be displayed for this object
 * @param tit -
 *            a W3C-conform title for that DOM
 * @param ev_click -
 *            a javascript-call for the click-event
 * @param ev_dblClick -
 *			  a javascript-call for the doubleclick-event
 * @returns {Object} the created DOM-Link
 */
function gmCreateLink(par, id, href, caption, tit, target, ev_click, ev_dblClick) {
    var obj = gmCreateObj(par, "a", id);
    obj = gmCreateObjCommon(obj, caption, tit, null, ev_click, null, null, null, ev_dblClick);
    if (href) {
        gmSetAtI(obj, "href", href);
        gmSetAtI(obj, "data-href", href);
    }
    if (target) {
        gmSetAtI(obj, "target", target);
    }

    return obj;
}

/**
 * Creates a DOM-Input-Element.
 *
 * @param par -
 *            the parent object to create the new object as child
 * @param typ -
 *            the type of the new input (Type-Attribute)
 * @param id -
 *            the id and name of the new object
 * @param initval -
 *            an initial value is set in this input
 * @param tit -
 *            a W3C-conform title for that DOM
 * @param ro -
 *            if set != null, the DOM will be readonly
 * @param ev_click -
 *            a javascript-call for the click-event
 * @param ev_focus -
 *            a javascript-call for the focus-event
 * @returns {Object} the new DOM-Input
 */
function gmCreateInput(par, typ, id, initval, tit, ro, ev_click, ev_focus) {
    var obj = gmCreateObj(par, "input", id);
    if (obj) {
        obj = gmCreateObjCommon(obj, null, tit, ro, ev_click, ev_focus);
        if (!typ) {
            typ = "text";
        }
        gmSetAtI(obj, "type", typ);
        if (initval) {
            // obj.val(initval);
            gmSetAtI(obj, "value", initval);
        } else {
            // obj.val("");
            gmSetAtI(obj, "value", "");
        }
    }
    return obj;
}

/**
 * Adds an object as a child node to a parent object or the document body.
 *
 * @param obj -
 *            the object to append at the end of the child list
 * @param parent -
 *            the parent object to append to, leave null to put it to the
 *            document-body
 * @returns {Boolean} TRUE = the object could be added, else FALSE
 */
function gmAddObj(obj, parent) {
    var isSet = false;
    if (gmIsObject(obj)) {
        if (!parent) {
            parent = gmGetEl("tagname", "body");
        }
        parent.appendChild(obj);
        isSet = true;
    }
    return isSet;
}

/**
 * Sets a new value into an object.
 *
 * @param id -
 *            the id of the object
 * @param initval -
 *            the new value for that element or empty
 * @returns {Boolean} TRUE = if the value could be set, else FALSE
 */
function gmSetInput(id, initval) {
    var isSet = false;
    // var obj = document.getElementById(id);
    var obj = gmGetElI(id);
    if (obj) {
        if (initval) {
            // obj.setAttribute("value", initval);
            gmSetAtI(obj, "value", initval);
            isSet = true;
        } else {
            // obj.setAttribute("value", "");
            gmSetAtI(obj, "value", "");
            isSet = true;
        }
    }
    return isSet;
}

/**
 * Selects the text in a input element.
 *
 * @param inputElem -
 *            the element containing the text
 * @returns {Boolean} TRUE = if the input element could be selected, else FALSE
 */
function gmSelectInput(inputElem) {
    var isSet = false;
    if (gmIsObject(inputElem)) {
        try {
            inputElem.select();
            isSet = true;
        } catch (e) {
        }
    }
    return isSet;
}

/**
 * Constants for Selection of Text using IE.
 */
var SELECT_IE = 0;
/**
 * Constants for Selection of Text using Gecko Engine.
 */
var SELECT_G = 1;

/**
 * @returns {Number} which Selection of Text Modus is used
 */
function gmGetTextSelectMode() {
    if (document.selection && document.selection.createRange) {
        return SELECT_IE;
    } else if (document.createRange && window.getSelection) {
        return SELECT_G;
    }
    return SELECT_IE;
}
/**
 * Constants Mode which is currently used for Selection of Text.
 *
 * @see {@link #gmGetTextSelectMode()}
 */
var SELECT_CURR = gmGetTextSelectMode();

/**
 * Returns the selected Text or an empty String.
 *
 * @returns {String} the text which is currently selected.
 */
function gmGetSelectedText() {
    var selectedText = "";
    if (SELECT_IE == SELECT_CURR) {
        selectedText = document.selection.createRange().text;
    } else if (SELECT_G == SELECT_CURR) {
        selectedText = window.getSelection();
    }
    if (typeof selectedText == "object") {
        selectedText = selectedText.toString();
    }
    return selectedText;
}

/**
 * Creates a new Range-Object for an element.
 *
 * @param elem -
 *            an element for the Range-Object or null;
 * @returns {Range} a new Range-Object or null
 */
function gmGetNewRange(elem) {
    var textRange = null;
    if (SELECT_IE == SELECT_CURR) {
        textRange = document.selection.createRange();
    } else if (SELECT_G == SELECT_CURR) {
        if (gmIsObject(elem)) {
            textRange = document.createRange();
            try {
                textRange.selectNode(elem);
            } catch (e) {
                // alert(e);
            }
        }
    }
    return textRange;
}

/**
 * Selects or Unselects the content inside an element (not only for input
 * elements.
 *
 * @param elem -
 *            the element to select the text in it
 * @param bForceSelect -
 *            TRUE=always select, FALSE=switch between select and unselect
 * @returns {String} the selected text or an empty string
 */
function gmSelectText(elem, bForceSelect) {
    var currSel = gmGetSelectedText();
    if (bForceSelect == null) {
        bForceSelect = false;
    }
    if (!bForceSelect && (currSel && currSel != "")) {
        if (SELECT_IE == SELECT_CURR) {
            document.selection.empty;
        } else if (SELECT_G == SELECT_CURR) {
            var selection = window.getSelection();
            selection.removeAllRanges();
        }
    } else {
        if (gmIsObject(elem)) {
            var tRange = gmGetNewRange(elem);
            if (SELECT_IE == SELECT_CURR) {
                tRange.select();
            } else if (SELECT_G == SELECT_CURR) {
                var selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(tRange);
            }
            currSel = gmGetSelectedText();
        }
    }
    return currSel;
}

/**
 * Removes an object from the DOM.
 *
 * @param obj the object to delete
 * @returns {Boolean} TRUE=the obj was deleted
 */
function gmDelObj(obj) {
    var isDel = false;
    oObj = gmGetElI(obj);
    if (gmIsObject(oObj)) {
        var parent = oObj.parentNode;
        if (gmIsObject(parent)) {
            try {
                parent.removeChild(oObj);
                isDel = true;
            } catch (e) {
                alert("ERR: " + e);
            }
        }
    }
    return isDel;
}

/**
 * Removes (clears) the object from it's children.
 *
 * @param obj - the object to clear
 * @returns {Boolean} TRUE = always, if obj is an object, FALSE = obj is null or not an object
 */
function gmEmptyObj(obj) {
    var isEmpty = false;
    oObj = gmGetElI(obj);
    if (gmIsObject(oObj)) {
        while (oObj.firstChild) {
            oObj.removeChild(oObj.firstChild);
        };
        isEmpty = true;
    }
    return isEmpty;
}

// ---------------
// base-object.js - END
// ---------------
// ---------------
// base-web.js - START
// ---------------

/**
 * Minimum width of the preview.
 */
var minWidth = 240;
/**
 * Maximum width of the preview.
 */
var maxWidth = 640;

/**
 * Adds an url which should be known for the search.
 *
 * @param filter -
 *            a predefined searchtext for that url
 * @param site -
 *            the hostname as regular expression
 * @param path -
 *            a path as regular expression (optional)
 */
function gmAddSite(filter, site, path) {
    if (knownSite) {
        if (site && (site != "")) {
            var len = knownSite.length;
            knownSite[len] = new Object();
            knownSite[len].site = site;
            knownSite[len].filter = (filter != null ? filter : ".+");
            knownSite[len].path = (path != null ? path : "");
        }
    }
}

/**
 * Adds a config for a known site.
 *
 * @param site -
 *            a site pattern
 * @param urlElem -
 *            a pattern for the html-element to search in the page
 * @param urlSearch -
 *            a pattern to search inside the url of the html-element
 * @param urlReplace -
 *            a literal which will used for replacing the urlSearch
 * @param urlReplaceLarge -
 *            a literal which will used for replacing the urlSearch with a url
 *            for large images
 * @param withDownload -
 *            1=will add a download-link beneath the picture, else 0
 */
function gmAddSite2(site, urlElem, urlSearch, urlReplace, urlReplaceLarge, withDownload) {
    if (knownSite) {
        if (site && site.length > 0) {
            var len = knownSite.length;
            knownSite[len] = new Object();
            knownSite[len].site = site;
            knownSite[len].url = (urlElem != null ? urlElem : ".+");
            knownSite[len].search = (urlSearch != null ? urlSearch : "");
            knownSite[len].replace = (urlReplace != null ? urlReplace : "");
            knownSite[len].replace_large = (urlReplaceLarge != null ? urlReplaceLarge : "");
            knownSite[len].withDownload = (withDownload != null ? withDownload : 0);
        }
    }
}

/**
 * Searchs in the list of known sites, if this site is found and returns the
 * predefined searchtext. If multiple sites will match, the LAST matching
 * filter will be returned.
 *
 * @param site -
 *            the hostname of the site to search for
 * @param path -
 *            the path of the site to search for (optional)
 * @returns {String} the predefined searchtext
 */
function gmFoundFilter(site, path) {
    var retFilter = "";
    var init = 0;
    if (knownSite && site) {
        if (!path) {
            path = "";
        }
        // alert("site: " + site + "| path: " + path);
        for ( var i = 0; i < knownSite.length; i++) {
            // alert("u:" + knownSite[i].site+" p:" + knownSite[i].path);
            if (site.search(knownSite[i].site) >= 0) {
                if (init == 0 && knownSite[i].path == "") {
                    retFilter = knownSite[i].filter;
                    init = 1;
                }
                var fIdx = path.search(knownSite[i].path);
                //alert(fIdx + " u:>" + knownSite[i].site + "< p:>" + path + "< k:>"+knownSite[i].path + "<");
                if (path != "" && (fIdx >= 0)) {
                    retFilter = knownSite[i].filter;
                    break;
                } else if (path == "" && knownSite[i].path == "") {
                    retFilter = knownSite[i].filter;
                    break;
                }
            }
        }
    }
    return retFilter;
}

/**
 * Searchs in the list of known sites, if this site is found and returns the
 * predefined searchtext. If multiple sites will match, the LAST matching site
 * will be returned.
 *
 * @param site -
 *            the hostname of the site to search for
 * @return a pattern for the html-element to search in the page
 */
function gmFoundFilter2(site) {
    var retFilter = null;
    if (knownSite != null && site != null) {
        for (var i=0; i < knownSite.length; i++) {
            if (site.search(knownSite[i].site) >= 0 ) {
                retFilter = knownSite[i];
            }
        }
    }
    return retFilter;
}

var FL_TAG = "result-list";
var FL_ID = "_FL";

function gmPrepareLinkData(curlink, withDesc) {
    var linkData = [];
    linkData.push(gmGetAtI(curlink, "href"));
    if (withDesc != 0) {
        linkData.push(gmGetAtI(curlink, "title"));
        linkData.push(gmGetAtI(curlink, "aria-label"));
        linkData.push(gmGetAtI(curlink, "alt"));
        linkData.push(gmGetAtI(curlink, "onmouseover"));
        linkData.push(gmGetAtI(curlink, "onclick"));
        linkData.push(curlink.innerHTML.replace("\\n", "").replace("#", ""));
    }
    return linkData;
}

function gmPrepareLinkTextData(curlink, withDesc) {
    var linkTextData = [];
    try {
        var tmpTextData = [];
        tmpTextData.push(curlink.text);
        if (withDesc != 0) {
            tmpTextData.push(gmGetAtI(curlink, "title"));
            tmpTextData.push(gmGetAtI(curlink, "alt"));
            tmpTextData.push(gmGetAtI(curlink, "aria-label"));
            tmpTextData.push(gmGetAtI(curlink, "onmouseover"));
            tmpTextData.push(gmGetAtI(curlink, "onclick"));
            tmpTextData.push(curlink.innerHTML);
            linkTextData = tmpTextData.map(function (value) {
              	if (gmIsUndefined(value)) {
                  return "";
                } else if (gmIsObject(value)) {
                    return value.toString();
                } else if (gmIsInstanceOf(value, String)) {
                	return gmCleanText(value);
                } else {
                    return value;
                }
            });
        }
    } catch (ex) {
        alert(ex);
    }
    return linkTextData;
}

function gmPrepareSearchRegExp(searchPattern) {
    if (!searchPattern || searchPattern.length <= 0) {
        searchPattern = ".*";
    } else if (searchPattern.charAt(0) == "/" && searchPattern.charAt(searchPattern.length - 1) == "/") {
        searchPattern = searchPattern.substring(1, searchPattern.length);
        searchPattern = searchPattern.substring(0, searchPattern.length -1);
    } else {
        searchPattern = searchPattern.replace(/\?/g, ".").replace(/\./g, "\.").replace(/\*/g, ".*");
    }
    //alert(searchPattern);
    searchPattern = new RegExp(searchPattern, "i");
    return searchPattern;
}


/**
 * Search for all matching links in the page.
 *
 * @param searchPattern - the search pattern or leave "" to get all
 * @param withDesc      - 0 = search only in links,
 *                        1 = search also in link description
 * @returns {Array} an array with all found links
 */
function gmFindLinksInPage(searchPattern, withDesc) {
    var pagelinks = [];
    if (withDesc == null) {
        withDesc = 0;
    }
    if (bTestMode) {
        pagelinks = gmGenTestEntries(40);
    } else {
        searchPattern = gmPrepareSearchRegExp(searchPattern);
        for (var i=0; i < document.links.length; i++) {
            var curlink = document.links[i];
            var ne = -1;
            var searchParamLink = gmPrepareLinkData(curlink, withDesc);
            var found = gmLinkMatchesPattern(searchParamLink, searchPattern);
            if (found) {
                if (gmGetAtI(curlink.id, FL_TAG) != FL_ID) {
                    var htmllink = gmGetAtI(curlink, "href");
                    var searchParamText = gmPrepareLinkTextData(curlink, withDesc);
                    var htmltext = gmLinkGenerateLinkText(searchParamText);
                    for (var j=0; j < pagelinks.length; j++) {
                        if (htmllink == pagelinks[j][0]) {
                            ne = j;
                            break;
                        }
                    }
                    if (ne > -1) {
                        pagelinks[ne][1].push(htmltext);
                        pagelinks[ne][1] = gmOnlyUnique(pagelinks[ne][1]);
                        //alert(pagelinks[ne][1]);
                    } else {
                        var curlink = [htmllink, [htmltext]];
                        pagelinks.push(curlink);
                    }
                }
            }
        }
    }
    return pagelinks;
}

/**
 * <b>DON'T USE DIRECTLY</b>
 *
 * @param arrText - an array texts to search in
 * @param searchPattern - a search text (might be a regular expression)
 * @returns {Boolean} TRUE= the search text is found in the array, or FALSE
 */
function gmLinkMatchesPattern(arrText, searchPattern) {
    var found = false;
    if (gmIsArray(arrText)) {
        for (var i=0; i < arrText.length; i++) {
            var searchText = arrText[i];
            try {
                found = searchText.search(searchPattern) != -1;
            } catch (e) {
                // ignored
            }
            if (found) {
                break;
            }
        }
    }
    return found;
}

/**
 * <b>DON'T USE DIRECTLY</b>
 *
 * @param arrText - an array with the possible link descriptions
 * @returns {String} the final link description
 */
function gmLinkGenerateLinkText(arrText) {
    var searchTextClean = [];
    var htmlText = "";
    if (gmIsArray(arrText)) {
        for (var idxST = 0; idxST < arrText.length; idxST++) {
            arrText[idxST] = trim(gmCleanText(arrText[idxST]));
        }
        htmlText = gmOnlyUnique(arrText).join("");
        alert(htmlText);
    }
    return htmlText;
}

/**
 * Adds a javascript block into the page.
 *
 * @param scc - a string, a function or an array with the javascript code or a function-list
 * @returns {Boolean} TRUE = if the script block could be set, else FALSE
 */
function gmAddScriptGlobal(scc) {
    var isSet = false;
    if (gmIsObject(scc) || gmIsFunction(scc) || (scc && scc.length > 0)) {
        var head = gmGetHead();
        if (head) {
            var script = gmCreateObj(head, "script");
            script.type = 'text/javascript';

            var allscc = "";
            if (gmIsArray(scc)) {
                for ( var i = 0; i < scc.length; i++) {
                    allscc += scc[i] + " \n";
                }
            } else {
                allscc = scc;
            }
            gmSetCoI(script, "\n" + allscc + "\n");
            isSet = true;
        }
    }
    return isSet;
}

/**
 * Adds a link to a javascript file into the page.
 *
 * @param scLink - a string or an array with the url of the javascript-file
 * FIXME: Check
 */
function gmAddScriptLinkGlobal(scLink) {
    var isSet = false;
    var head = gmGetHead();
    if (head && scLink && scLink.length > 0) {
        var allScLink = [];
        if (gmIsArray(scLink)) {
            allScLink = scLink;
        } else {
            allScLink = [scLink];
        }

        for ( var i = 0; i < allScLink.length; i++) {
            var newScript = gmCreateObj(head, "script");
            newScript.type = 'text/javascript';
            newScript.src = allScLink[i];
        }
        isSet = true;
    }
    return isSet;
}

/**
 * Adds a style block into the page.
 *
 * @param scc - a string or an array with the css code
 * @returns {Boolean} TRUE = if the style block could be set, else FALSE
 */
function gmAddStyleGlobal(scc) {
    var isSet = false;
    if (gmIsObject(scc) || (scc && scc.length > 0)) {
        var head = gmGetHead();
        if (head) {
            var style = gmCreateObj(head, "style");
            style.type = 'text/css';

            var allscc = "";
            if (gmIsArray(scc)) {
                for ( var i = 0; i < scc.length; i++) {
                    allscc += scc[i] + " \n";
                }
            } else {
                allscc = scc;
            }
            gmSetCoI(style, "\n" + allscc + "\n");
            isSet = true;
        }
    }
    return isSet;
}

/**
 * Generates some sample entries for testing.
 *
 * @param maxEntries - number of entries to generate
 * @returns {Array} array of entries
 */
function gmGenTestEntries(maxEntries) {
    if (isNaN(maxEntries) || maxEntries == "") {
        maxEntries = 1;
    }
    if (maxEntries < 0) {
        maxEntries = 0;
    } else if (maxEntries > 100) {
        maxEntries = 100;
    }
    testArray = [];
    for ( var i = 1; i <= maxEntries; i++) {
        var curlink = "http://" + currSite + currPath + "/link-" + i;
        var htmllink = curlink;
        var htmltext = "linktext-" + i;
        var curlink = [htmllink, htmltext];
        testArray.push(curlink);
    }
    return testArray;
}

/**
 * Calculate the offset of an element relating to the elemnt at the most top.
 *
 * @param element - the element to check the offeset
 * @returns {Array[leftOffset, topOffset]} an array with the leftOffset,
 *          topOffset FIXME:TEST
 */
function gmCumulativeOffset(element) {
    var valueT = 0;
    var valueL = 0;
    if (element) {
        valueL = element.width || 0;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);
    }
    return [ valueL, valueT ];
}

/**
 * Calculates the horizontal offset to the right in relation to it's parent
 * element.
 *
 * @param parentElem -
 *            the element to calculate the offset from
 * @param iPoint - a screen point, to add an additional offset
 * @param iZoom  - the zoom factor 1= Originalsize
 * @returns {Number} the horizontal offset or 0 FIXME:Test
 */
function gmCalcOffsetH(parentElem, iPoint, iZoom) {
    if (isNaN(iZoom)) {
        iZoom = 1;
    }
    var offsetH = 0;
    if (parentElem) {
        offsetH = gmCumulativeOffset(parentElem)[1];
        if (!isNaN(offsetH) && gmIsArray(iPoint)) {
            if (!isNaN(iPoint[1])) {
                offsetH = offsetH - (iPoint[1] * iZoom) + (parentElem.height || 0);
            }
        }
    }
    return offsetH;
}

/**
 * Searches the url for a pattern and replace the text.
 *
 * @param searchForPattern - the pattern to search for
 * @param replaceWithText  - the text what will be inserted instead
 * @param oldUrl           - the URL to search in
 * @returns {String} the url with replaced text
 */
function gmGetReplaceUrl(searchForPattern, replaceWithText, oldUrl) {
    var newUrl = oldUrl;
    if (oldUrl != null) {
        if (searchForPattern != "") {
            // there is something to replace
            if (replaceWithText == null) {
                replaceWithText = "";
            }
            var patternReplace = new RegExp(searchForPattern);
            newUrl = oldUrl.replace(patternReplace, replaceWithText);
        }
    }
    return newUrl;
}

/**
 * Returns the actual server of the running page.
 *
 * @returns a server name
 */
function gmGetCurrentSite() {
    currSite = document.location.host;
    if (document.location.port) {
        currSite += ":" + document.location.port;
    }
    return currSite;
}

/**
 * Determine the metrics of that image.
 *
 * @param newImage -
 *            the image to inspect
 * @returns {Array[width, height]} the image metrics [width, height] in px
 */
function gmGetImageSize(newImage) {
    var imageObjectWidth = 0;
    var imageObjectHeight = 0;

    if (newImage && newImage.width && newImage.width > 0) {
        imageObjectWidth = newImage.width;
        imageObjectHeight = newImage.height;
    }
    if (imageObjectWidth <= 0) {
        imageObjectWidth = minWidth;
    } else if (imageObjectWidth > maxWidth) {
        imageObjectWidth = maxWidth;
        imageObjectHeight = 0;
    }
    if (imageObjectHeight <= 0) {
        imageObjectHeight = "auto";
    }
    return [ imageObjectWidth, imageObjectHeight ];
}

/**
 * Add a default style to a div-element.
 *
 * @param hDiv -
 *            the div-element
 * @param iPoint -
 *            metrics of the image [width, height] in px
 * @param offsetW -
 *            an offset (number) for the width (optional), default is 5px
 * @param offsetH -
 *            an offset (number) for the height (optional), default is 5px
 * @param ratio -
 *            the aspect ratio of the image, only is used, if we have no image height
 * @returns {Boolean} TRUE = the layout could be added, else FALSE
 */
function gmSetDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom) {
    var w = "auto";
    var h = "auto";
    var oH = "5px";
    var oW = "5px";

    var isSet = false;
    if (gmIsObject(hDiv)) {
        if (isNaN(iZoom)) {
            iZoom = 1;
        }
        if (gmIsArray(iPoint)) {
            if (!isNaN(iPoint[0])) {
                w = iPoint[0] + 2;
            }
            if (isNaN(iPoint[1])) {
                h = (gmToNo(hDiv.style.width) / ratio) + 2;// + picTextHeight;
            } else {
                h = (iPoint[1] + 2); // + picTextHeight;
            }
        }
        if (!isNaN(offsetH)) {
            oH = offsetH + "px";
        }
        if (!isNaN(offsetW)) {
            oW = offsetW + "px";
        }
        if (!isNaN(w)) {
            w *= iZoom;
            w = w + "px";
        }
        if (!isNaN(h)) {
            h *= iZoom;
            h = h + "px";
        }
        var css = gmGetAtI(hDiv, "style");
        if (css == false) {
            css = "";
        }
        css += ";width:" + w + ";height:" + h + ";top:" + oH + ";left:" + oW ;
        gmSetAtI(hDiv, "style", css);
        isSet = true;
    }

    return isSet;
}

/**
 * Add a default style to an img-element.
 *
 * @param hDiv -
 *            the div-element
 * @param hImg -
 *            the img-element
 * @param iPoint -
 *            metrics of the image [width, height] in px
 * @param iZoom -
 *            the zoom factor (1 = Originalsize)
 * @returns {Boolean} TRUE = the layout could be added, else FALSE
 */
function gmSetImgLayout(hDiv, hImg, iPoint, iZoom) {
    var h = "auto";
    var w = "auto";

    var isSet = false;
    if (gmIsObject(hDiv)) {
        if (isNaN(iZoom)) {
            iZoom = 1;
        }
        if (gmIsArray(iPoint)) {
            if (!isNaN(iPoint[0])) {
                w = iPoint[0];
            }
            if (isNaN(iPoint[1])) {
                if (gmIsObject(hImg)) {
                    ratio = gmToNo(hImg.style.width) / gmToNo(hImg.style.height);
                    h = (gmToNo(hDiv.style.width) / ratio);// + picTextHeight;
                }
            } else {
                h = iPoint[1]; // + picTextHeight;
            }
        }
        if (!isNaN(w)) {
            w *= iZoom;
            w = w + "px";
        }
        if (!isNaN(h)) {
            h *= iZoom;
            h = h + "px";
        }
        var css = gmGetAtI(hDiv, "style");
        if (css == false) {
            css = "";
        }
        css += ";width:" + w + ";height:" + h;
        gmSetAtI(hDiv, "style", css);
        isSet = true;
    }

    return isSet;
}

/**
 *
 * @returns {Object} the object for the head in the page, or null
 */
function gmGetHead() {
    return gmGetEl("tagname", "head");
}

/**
 *
 * @returns {Object} the object for the body in the page, or null
 */
function gmGetBody() {
    return gmGetEl("tagname", "body");
}

/**
 * @param obj - the object from which to get the css-style
 * @returns {Object} the css-style-object from that object
 */
function gmGetStyle(obj) {
    var res = null;
    var oObj = gmGetElI(obj);
    if (oObj) {
        try {
            res = oObj.style;
        } catch (e) {
            // ignored
        }
    }
    return res;
}

/**
 * @returns {Integer} height of the document body
 */
function gmGetBodyHeight() {
    var D = gmGetBody();
    var Dh = 0;
    var Eh = 0;
    if (D) {
        Dh = Math.max(isNaN(D.style.height) ? 0 : D.style.height, D.scrollHeight, D.offsetHeight, D.clientHeight);
    }
    if (D.documentElement) {
        D = D.documentElement;
        Eh = Math.max(isNaN(D.style.height) ? 0 : D.style.height, D.scrollHeight, D.offsetHeight, D.clientHeight);
    }
    return Math.max(Dh, Eh);
}

function gmOpenInTab(url) {
    if (url) {
        window.open(url,"_blank");
    }
    return true;
}
// ---------------
// base-web.js - END
// ---------------
// ---------------
// base-clipboard.js - START
// ---------------

/**
 * @returns {Object} the reference to the base window, might be the greasemonkey
 *          unsafeWindow
 */
function gmClipRef() {
    var refWindow = window;
    if (!refWindow && unsafeWindow != null) {
        refWindow = unsafeWindow;
    }
    return refWindow;
}

/**
 * @returns {Object} the reference to the the Security Manager or null
 * @depricated since FF 16
 */
function gmPrivsManager() {
    var privsMan = null;
    var wdw = gmClipRef();
    if (gmIsObject(wdw)) {
        try {
            if (gmIsObject(wdw.netscape.security.PrivilegeManager)) {
                privsMan = wdw.netscape.security.PrivilegeManager;
            }
        } catch (e) {
            // ignored
        }
    }
    return privsMan;
}

/**
 * Copies a text to clipboard.
 *
 * @param text -
 *            the text to copy to the clipboard
 * @param bQuite -
 *            don't schow any alerts
 * @param refWindow -
 *            a reference on the page (optional)
 * @returns {Boolean} text = if set to clipboard, else null
 */
function gmCopy2clipboard(text, bQuite, refWindow) {

    var resultText = text;
    wdw = gmClipRef();
    if (wdw.clipboardData) {
        wdw.clipboardData.setData('text', text);
        return resultText;
    } else {
        try {
            wdw.netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
        } catch (ex) {
            if (!bQuite) {
                alert("Internet Security settings do not allow copying to clipboard!");
            }
            return null;
        }

        try {
            e = wdw.Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(wdw.Components.interfaces.nsIClipboard);
            if (!e)
                return null;
        } catch (ex) {
            if (!bQuite) {
                alert("1:" + ex);
            }
            return null;
        }

        try {
            b = wdw.Components.classes['@mozilla.org/widget/transferable;1']
                    .createInstance(wdw.Components.interfaces.nsITransferable);
            if (!b)
                return null;
        } catch (ex) {
            if (!bQuite) {
                alert("2:" + ex);
            }
            return null;
        }

        b.addDataFlavor("text/unicode");
        try {
            o = wdw.Components.classes['@mozilla.org/supports-string;1']
                    .createInstance(wdw.Components.interfaces.nsISupportsString);
            if (!o)
                return null;
            o.data = text;
        } catch (ex) {
            if (!bQuite) {
                alert("3:" + ex);
            }
            return null;
        }

        b.setTransferData("text/unicode", o, (text == null ? 0 : text.length * 2));

        try {
            t = wdw.Components.interfaces.nsIClipboard;
        } catch (ex) {
            if (!bQuite) {
                alert("4:" + ex);
            }
            return null;
        }
        e.setData(b, null, t.kGlobalClipboard);
        return text;
    }
    if (!bQuite) {
        alert('Copy doesn\'t work!');
    }
    return null;
}

/**
 * <p) Same as {@link #gmCopy2clipboard(text, bQuite, refWindow)}, but
 * customized only for use in a webpage.
 * </p>
 * <p>
 * Not usable for a greasemonkey script
 * </p>
 *
 * @param text -
 *            the text to copy to the clipboard
 */
function copyPostToClipboard(text) {
    var clipboard = null, transferable = null, clipboardID = null;
    try {
        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
    } catch (e) {
        alert(e);
    }
    try {
        clipboard = Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(Components.interfaces.nsIClipboard);
    } catch (e) {
        alert(e);
    }
    try {
        transferable = Components.classes["@mozilla.org/widget/transferable;1"]
                .createInstance(Components.interfaces.nsITransferable);
    } catch (e) {
        alert(e);
    }
    if (transferable) {
        transferable.addDataFlavor("text/unicode");
        var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        str.data = text;
        transferable.setTransferData("text/unicode", str, str.data.length * 2);
        try {
            clipboardID = Components.interfaces.nsIClipboard;
        } catch (e) {
            alert(e);
        }
        clipboard.setData(transferable, null, clipboardID.kGlobalClipboard);
    }
}

/**
 * Adds the functions for using a "copy to clipboard" in a web-page.
 */
function gmAddClipboardSupport() {
    gmAddScriptGlobal([gmClipRef, gmCopy2clipboard, gmIsClipboardSupported]);
}

/**
 * @returns {Boolean} TRUE=using clipboard is supported, else FALSE
 */
function gmIsClipboardSupported() {
    var isOK = false;
    try {
        privsMan = gmPrivsManager();
        if (gmIsObject(privsMan)) {
            privsMan.enablePrivilege("UniversalXPConnect");
            isOK = true;
        }
    } catch (ex) {
        alert("ERR: " + ex);
    }
    return isOK;
}

// ---------------
// base-clipboard.js - END
// ---------------
/**
 * Adds site which should be known by this script.
 * Can be left empty.
 */
function lgm_addKnownSites() {

};

/**
 * Adds CSS-Styles for this script.
 * Can be left empty.
 */
function lgm_addStyles() {

};

/**
 * Adds HTML-Objects for this script.
 * Can be left empty.
 */
function lgm_addControls() {
    gm_addClipboardSupport();
    contlinks = gm_createObj(null, "div", "gl-container");
    odiv = gm_createObj(contlinks, "div", "gl-searchbox");
    oact = gm_createObj(contlinks, "div", "gl-actionbox");
    ores = gm_createObj(contlinks, "div", "gl-resultbox");
    oform = gm_createObj(odiv, "form", "gl-searchform");

    initFilter = gm_foundFilter(currSite, currPath);

    gm_createInput(oform, "text", "gl-searchtext", initFilter, "enter your search (you may use regular expression)", null, null,
            function() {
                return gm_selectInput(this);
            });
    gm_createButton(oform, "submit", "gl-sstart", "S", "start search", function() {
        return lgm_filterURL('#gl-searchtext');
    });
    gm_createButton(oform, "button", "gl-sreset", "R", "clear search", function() {
        return lgm_remall('#gl-searchtext');
    });
    gm_createButton(oform, "button", "gl-sshow", "\\/", "show/hide result", function() {
        return lgm_showhide();
    });
    gm_createInput(oform, "text", "gl-scount", null, "number of hits", 1, null, null, null);

    var selCap = "SA";
    var selTit = "De-/Select All";
    if (gm_isClipboardSupported()) {
        selCap = "CA";
        selTit = "Select & Copy All";
    }
    gm_createButton(oact, "button", "gl-aselect", selCap, selTit, function() {
        return lgm_selectall('gl-resultplain', 'gl-resultlink');
    });
    gm_createButton(oact, "button", "gl-ashowplain", "PR", "Show Plain Results", function() {
        lgm_show('gl-resultplain', 'gl-resultlink');
    });
    gm_createButton(oact, "button", "gl-ashowlink", "RL", "Show Results as Link", function() {
        lgm_show('gl-resultlink', 'gl-resultplain');
    });

    gm_createObj(ores, "div", "gl-resultplain");
    gm_createObj(ores, "div", "gl-resultlink");

    // document.body.appendChild(contlinks);
    $("body").append(contlinks);
    lgm_showhide(h_off);

};

/**
 * The first action which should be excecuted in this script.
 * Can be left empty.
 */
function lgm_addInitAction() {

};
/*
This helper script bridges compatibility between the Greasemonkey 4 APIs and
existing/legacy APIs.  Say for example your user script includes

    // @grant GM_getValue

And you'd like to be compatible with both Greasemonkey 3 and Greasemonkey 4
(and for that matter all versions of Violentmonkey, Tampermonkey, and any other
user script engine).  Add:

    // @grant GM.getValue
    // @require https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js

And switch to the new (GM-dot) APIs, which return promises.  If your script
is running in an engine that does not provide the new asynchronous APIs, this
helper will add them, based on the old APIs.

If you use `await` at the top level, you'll need to wrap your script in an
`async` function to be compatible with any user script engine besides
Greasemonkey 4.

    (async () => {
    let x = await GM.getValue('x');
    })();
*/

if (typeof GM == 'undefined') {
  this.GM = {};
}


if (typeof GM_addStyle == 'undefined') {
  this.GM_addStyle = (aCss) => {
    'use strict';
    let head = document.getElementsByTagName('head')[0];
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}


if (typeof GM_registerMenuCommand == 'undefined') {
  this.GM_registerMenuCommand = (caption, commandFunc, accessKey) => {
    if (!document.body) {
      if (document.readyState === 'loading'
        && document.documentElement && document.documentElement.localName === 'html') {
        new MutationObserver((mutations, observer) => {
          if (document.body) {
            observer.disconnect();
            GM_registerMenuCommand(caption, commandFunc, accessKey);
          }
        }).observe(document.documentElement, {childList: true});
      } else {
        console.error('GM_registerMenuCommand got no body.');
      }
      return;
    }
    let contextMenu = document.body.getAttribute('contextmenu');
    let menu = (contextMenu ? document.querySelector('menu#' + contextMenu) : null);
    if (!menu) {
      menu = document.createElement('menu');
      menu.setAttribute('id', 'gm-registered-menu');
      menu.setAttribute('type', 'context');
      document.body.appendChild(menu);
      document.body.setAttribute('contextmenu', 'gm-registered-menu');
    }
    let menuItem = document.createElement('menuitem');
    menuItem.textContent = caption;
    menuItem.addEventListener('click', commandFunc, true);
    menu.appendChild(menuItem);
  };
}


if (typeof GM_getResourceText == 'undefined') {
  this.GM_getResourceText = (aRes) => {
    'use strict';
    return GM.getResourceUrl(aRes)
      .then(url => fetch(url))
      .then(resp => resp.text())
      .catch(function(error) {
        GM.log('Request failed', error);
        return null;
      });
  };
}


Object.entries({
  'log': console.log.bind(console),  // Pale Moon compatibility.  See #13.
  'info': GM_info,
}).forEach(([newKey, old]) => {
  if (old && (typeof GM[newKey] == 'undefined')) {
    GM[newKey] = old;
  }
});


Object.entries({
  'GM_addStyle': 'addStyle',
  'GM_deleteValue': 'deleteValue',
  'GM_getResourceURL': 'getResourceUrl',
  'GM_getValue': 'getValue',
  'GM_listValues': 'listValues',
  'GM_notification': 'notification',
  'GM_openInTab': 'openInTab',
  'GM_registerMenuCommand': 'registerMenuCommand',
  'GM_setClipboard': 'setClipboard',
  'GM_setValue': 'setValue',
  'GM_xmlhttpRequest': 'xmlHttpRequest',
  'GM_getResourceText': 'getResourceText',
}).forEach(([oldKey, newKey]) => {
  let old = this[oldKey];
  if (old && (typeof GM[newKey] == 'undefined')) {
    GM[newKey] = function(...args) {
      return new Promise((resolve, reject) => {
        try {
          resolve(old.apply(this, args));
        } catch (e) {
          reject(e);
        }
      });
    };
  }
});

//
// Global Code - END
//


//
//GM-Script specific code - START
//

/**
 * Define the global variables used for this script.
 */
const scriptID = "GM-GL";

var glContainer;
var glSearchDiv;
var glResultDiv;
var glActionDiv;
var glFormTag;
var initFilter;

const glBtnShowResultText = 'SR';
const glBtnShowResultTextDesc = 'show result';
const glBtnHideResultText = 'HR';
const glBtnHideResultTextDesc = 'hide result';

const glContainerHeightMin = '20px';
const glContainerHeightMax = '99%';
const glContainerHeightMaxAuto = 'auto';
const glContainerLineHeight = 14;
const RESULT_SHOW = -1;
const RESULT_HIDE = -2;

const glBtnSearchModeAText = "D";
const glBtnSearchModeADesc = "search in link & description";
const glBtnSearchModeAValue = "1";
const glBtnSearchModeLText = "L";
const glBtnSearchModeLDesc = "search in link ONLY";
const glBtnSearchModeLValue = "0";

const contWidthWide = "50%";
const contWidthSmall = "225px";
const resWidthWide = "100%"
const resWidthSmall = "225px";
const divWidthWide = '99%';
const divWidthSmall = "225px";
const descWidthWide = "Wide";
const descWidthSmall = "Small";

const searchText_Desc = "enter your search\nSimple Wildcards = (?, *)\nRegular Expression = /searchtext/";

/**
 * Add the DOM-Objects used in this script.
 */
function lgmAddControlsGrabLinks() {
    gmAddClipboardSupport();
    // base layout
    glContainer = gmCreateObj(null, "div", "gl-container");
    glSearchDiv = gmCreateObj(glContainer, "div", "gl-searchbox");
    glActionDiv = gmCreateObj(glContainer, "div", "gl-actionbox");
    glResultDiv = gmCreateObj(glContainer, "div", "gl-resultbox");
    glFormTag = gmCreateObj(glSearchDiv, "form", "gl-searchform");
    gmSetAtI(glFormTag, "accept-charset", "utf-8");
    // search fields
    initFilter = gmFoundFilter(currSite, currPath);
    gmCreateInput(glFormTag, "text", "gl-searchtext", initFilter, searchText_Desc, null, null, function() {
        return gmSelectInput(this);
    });
    gmCreateButton(glFormTag, "submit", "gl-sstart", "S", "start search", null, function() {
        return lgmSearchLinks('gl-searchtext',"gl-sdesc");
    });
    gmCreateButton(glFormTag, "button", "gl-sreset", "R", "clear search", null, function() {
        return lgmResetSearch('gl-searchtext');
    });
    gmCreateButton(glFormTag, "button", "gl-sshow", glBtnShowResultText, glBtnShowResultTextDesc, null, function() {
        return lgmShowHideResult();
    });
    gmCreateButton(glFormTag, "button", "gl-sdesc", glBtnSearchModeAText, glBtnSearchModeADesc, glBtnSearchModeAValue, function() {
        return lgmToggleSearchDesc('gl-sdesc');
    });
    gmCreateInput(glFormTag, "text", "gl-scount", "", "number of hits", 1, null, null, null);
    // copy fields
    var selCap = "SA";
    var selTit = "De-/Select All";
    if (gmIsClipboardSupported()) {
        selCap = "CA";
        selTit = "Select & Copy All";
    }
    gmCreateButton(glActionDiv, "button", "gl-aselect", selCap, selTit, null, function() {
        return lgmSelectall('gl-resultplain', 'gl-resultlink');
    });
    gmCreateButton(glActionDiv, "button", "gl-ashowplain", "PR", "Show Plain Results", null, function() {
        lgmSwitchResultDisplay('gl-resultplain', 'gl-resultlink');
    });
    gmCreateButton(glActionDiv, "button", "gl-ashowlink", "RL", "Show Results as Link", null, function() {
        lgmSwitchResultDisplay('gl-resultlink', 'gl-resultplain');
    });
    gmCreateButton(glActionDiv, "button", "gl-awide", "W", descWidthWide, null, function() {
        lgmToggleContainer('gl-container', 'gl-resultbox', 'gl-resultplain', 'gl-resultlink', 'gl-awide');
    });
    // result fields
    gmCreateObj(glResultDiv, "div", "gl-resultplain");
    gmCreateObj(glResultDiv, "div", "gl-resultlink");
    // init
    gmAddObj(glContainer, gmGetBody());
    lgmShowHideResult(RESULT_HIDE);
    //alert(glFormTag.outerHTML);
}

/**
 * Shows the layer in param frontLayer and hides the layer in param behindLayer.
 * @param frontLayer  - the layer to put in front
 * @param behindLayer - the layer to put in the bakc
 */
function lgmSwitchResultDisplay(frontLayer, behindLayer) {
    var oFrontLayer = gmGetStyle(frontLayer);
    var oBehindLayer = gmGetStyle(behindLayer);
    if (oFrontLayer && oBehindLayer) {
        var idxFront = gmGetAtI(oFrontLayer, "index");
        var idxBehind = gmGetAtI(oBehindLayer, "index");

        if (!idxFront || isNaN(idxFront) || idxFront == '') {
            idxFront = 910;
        }
        if (!idxBehind || isNaN(idxBehind) || idxBehind == '') {
            idxBehind = idxFront - 1;
        }
        if (idxFront < idxBehind) {
            var i = idxFront;
            idxFront = idxBehind;
            idxBehind = i;
        }
        gmSetAtI(oFrontLayer, "index", idxFront);
        gmSetAtI(oFrontLayer, "visibility", "visible");
        gmSetAtI(oFrontLayer, "left", 0);
        gmSetAtI(oBehindLayer, "index", idxBehind);
        gmSetAtI(oBehindLayer, "visibility", "hidden");
        gmSetAtI(oBehindLayer, "left", 2000);
    }
}

/**
 * Switch the search mode.
 * @param btnSearch - the button to read the current state from
 */
function lgmToggleSearchDesc(btnSearch) {
    var oBtnSearch = gmGetElI(btnSearch);
    if (oBtnSearch){
        var curValue = gmGetAtI(oBtnSearch, "value");
        if (curValue == glBtnSearchModeLValue) {
            gmSetCoI(oBtnSearch, glBtnSearchModeAText);
            gmSetAtI(oBtnSearch, "value", glBtnSearchModeAValue);
            gmSetAtI(oBtnSearch, "title", glBtnSearchModeADesc);
        } else {
            gmSetCoI(oBtnSearch, glBtnSearchModeLText);
            gmSetAtI(oBtnSearch, "value", glBtnSearchModeLValue);
            gmSetAtI(oBtnSearch, "title", glBtnSearchModeLDesc);
        }
    }
}

function lgmToggleContainer(contDiv, resultDiv, resultPlainDiv, resultLinkDiv, btnAction) {
    var oContDiv = gmGetElI(contDiv);
    var oResultDiv = gmGetElI(resultDiv);
    var oBtnAction = gmGetElI(btnAction);
    if (oContDiv && oResultDiv) {
        var oContDivStyle = gmGetStyle(oContDiv);
        var oResultDivStyle = gmGetStyle(oResultDiv);
        var oResultPlainDivStyle = gmGetStyle(resultPlainDiv);
        var oResultLinkDivStyle = gmGetStyle(resultLinkDiv);
        var newContWidth = contWidthWide;
        var newResultWidth = resWidthWide;
        var newResultDivWidth = divWidthWide;
        var newDescWidth = descWidthSmall;
        var newBtnActionText = "S";
        var curValue = gmGetAtI(oContDivStyle, "width");
        if (curValue == contWidthWide) {
            newContWidth = contWidthSmall;
            newResultWidth = resWidthSmall;
            newResultDivWidth = divWidthSmall;
            newDescWidth = descWidthWide;
            newBtnActionText = "W";
        }
        gmSetAtI(oContDivStyle, "width", newContWidth);
        gmSetAtI(oContDivStyle, "max-width", newContWidth);
        gmSetAtI(oResultDivStyle, "width", newResultWidth);
        gmSetAtI(oResultDivStyle, "max-width", newResultWidth);
        gmSetAtI(oResultPlainDivStyle, "width", newResultDivWidth);
        gmSetAtI(oResultPlainDivStyle, "max-width", newResultDivWidth);
        gmSetAtI(oResultLinkDivStyle, "width", newResultDivWidth);
        gmSetAtI(oResultLinkDivStyle, "max-width", newResultDivWidth);
        if (oBtnAction) {
            gmSetCoI(oBtnAction, newBtnActionText);
            gmSetAtI(oBtnAction, "title", newDescWidth);
        }
    }
}

/**
 * Shows the complete layer with a default size or special size.
 * @param bOnOff - a numeric height, on, off or null
 * @returns {Boolean} always false
 * @see #RESULT_SHOW
 * @see #RESULT_HIDE
 * @see #glContainerHeightMin
 * @see #glContainerHeightMax
 * @see #glContainerHeightMaxAuto
 */
function lgmShowHideResult(bOnOff) {
    var oCont = gmGetElI('gl-container');
    var oContStyle = gmGetStyle(oCont);
    var oCont1 = gmGetElI('gl-resultbox');
    var oContStyle1 = gmGetStyle(oCont1);
    var oBtnShow = gmGetElI('gl-sshow');
    var oSearchCount = gmGetElI("gl-scount");
    var currHeight;
    if (bOnOff) {
        currHeight = bOnOff;
    } else {
        currHeight = parseFloat(gmGetAtI(oContStyle, "height"));
    }
    if (currHeight == RESULT_SHOW || currHeight == parseFloat(glContainerHeightMin)) {
        // if container should be shown or currently is at min size
        currHeight = glContainerHeightMax;
        var searchCnt = gmGetAtI(oSearchCount, "value");
        //alert(searchCnt);
        if (isNaN(searchCnt)) {
            currHeight = glContainerHeightMaxAuto;
        //} else {
        //    currHeight = glContainerHeightMin;
        }
    } else {
        currHeight = glContainerHeightMin;
    }
    var buttonText = glBtnShowResultText;
    var buttonTextDesc = glBtnShowResultTextDesc;
    if (currHeight == glContainerHeightMin) {
        buttonText = glBtnShowResultText;
        buttonTextDesc = glBtnShowResultTextDesc;
    } else {
        buttonText = glBtnHideResultText;
        buttonTextDesc = glBtnHideResultTextDesc;
    }
    gmSetAtI(oContStyle, "height", currHeight);
    gmSetAtI(oContStyle1, "height", currHeight);
    gmSetCoI(oBtnShow, buttonText);
    gmSetAtI(oBtnShow, "title", buttonTextDesc);
    return false;
}

/**
 * Clears any filter text and searchs again.
 * @param searchField - the search input containing the text-filter
 * @returns {Boolean} always false
 */
function lgmResetSearch(searchField) {
    var oSearchField = gmGetElI(searchField);
    if (oSearchField) {
        gmSetAtI(oSearchField, "value", "");
        lgmSearchLinks(oSearchField);
        oSearchField.focus();
    }
    return false;
}

/**
 * Selects the content of element A or B.
 * @param selElementA
 * @param selElementB
 * @returns {Boolean} always false
 */
function lgmSelectall(selElementA, selElementB) {
    var selectedElem = null;
    var oSelElemA = gmGetElI(selElementA);
    var oSelElemAStyle = gmGetStyle(oSelElemA);
    if (oSelElemA != null && gmGetAtI(oSelElemAStyle, "visibility") == "visible") {
        selectedElem = oSelElemA;
    } else {
        var oSelElemB = gmGetElI(selElementB);
        var oSelElemBStyle = gmGetStyle(oSelElemB);
        if (oSelElemB != null && gmGetAtI(oSelElemBStyle, "visibility") == "visible") {
            selectedElem = oSelElemB;
        }
    }
    if (selectedElem != null) {
        var bForce = false;
        if (gmIsClipboardSupported()) {
            bForce = true;
        }
        var selText = gmSelectText(selectedElem, bForce);
        if (selText) {
            try {
                if (unsafeWindow) {
                    unsafeWindow.copyPostToClipboard(selText);
                }
            } catch (ignored) {
                // ignored
            }
        }
    }
    return false;
}

/**
 * Search for all matching URLs and shows them the result.
 * @param searchField - the search input containing the text-filter
 * @returns {Boolean} always false
 */
function lgmSearchLinks(searchField, searchMode) {
    try {
        var searchText = gmGetAtI(searchField, "value");
        var searchMode = gmGetAtI(searchMode, "value");
        var arrFoundInPage = gmFindLinksInPage(searchText, searchMode);
        lgmLinksInResult(arrFoundInPage);
        lgmSwitchResultDisplay('gl-resultplain', 'gl-resultlink');
        lgmShowHideResult(RESULT_SHOW);
    } catch (ex) {
        alert(ex);
    }
    return false;
}

/**
 * Searchs for all URL in the page and optional filters by a regular expression.
 * @param arrLinks - array with found links
 * @returns {Boolean} always false
 */
function lgmLinksInResult(arrLinks) {
    var arrLinksPlain = [];
    var arrLinksLink = [];
    try {
        var oResultPlainDiv = gmGetElI("gl-resultplain");
        var oResultLinkDiv = gmGetElI("gl-resultlink");
        var oResultCount = gmGetElI("gl-scount");
        var arrFoundInPage = gmSortArray(arrLinks);
        for ( var i = 0; i < arrFoundInPage.length; i++) {
            var currLink = arrFoundInPage[i][0];
            var currCaption = lgmCleanArrayCaption(arrFoundInPage[i][1]);
            //alert(currCaption);
            lgmPrepareLinkAsPlain(arrLinksPlain, currLink, currCaption,i);
            lgmPrepareLinkAsLink(arrLinksLink, currLink, currCaption, i);
        }
        if (oResultCount) {
            gmSetAtI(oResultCount, "value", arrFoundInPage.length);
        }
        if (oResultPlainDiv) {
            lgmPrepareLinksInContainer(oResultPlainDiv, arrLinksPlain);
            gmCreateObj(oResultPlainDiv, "br", null);
        }
        if (oResultLinkDiv) {
            arrLinksLink = gmSortObject(arrLinksLink, "data-title");
            lgmPrepareLinksInContainer(oResultLinkDiv, arrLinksLink);
            gmCreateObj(oResultLinkDiv, "br", null);
        }
    } catch (ex) {
        alert(ex);
    }
    return false;
}

function lgmCleanCaption(dirtyCaption) {
    dirtyCaption = trim(dirtyCaption);
    if (dirtyCaption != null) {
        dirtyCaption = dirtyCaption.replace(/[\n\r]/g, '');
        if (dirtyCaption.indexOf("<") >= 0) {
            dirtyCaption = dirtyCaption.replace(/<(?:.|\n)*?>/gm, '').replace(/\s{2,}/gm, ' ');
        }
    }
    return dirtyCaption;
}

function lgmCleanArrayCaption(arrCaption) {
    var cleanCaption = "";
    if (gmIsArray(arrCaption)){
        var arrCleanCaption = [];
        for (let currElem of arrCaption) {
            arrCleanCaption.push(lgmCleanCaption(currElem));
        }
        arrCleanCaption = gmOnlyUnique(arrCleanCaption);
        arrCleanCaption = gmSortArray(arrCleanCaption, SORT_NUM);
        cleanCaption = "[" + arrCleanCaption.join("][") + "]";
    } else {
        cleanCaption = lgmCleanCaption(arrCaption);
    }
    return cleanCaption;
}

function lgmPrepareLinkAsPlain(arrLinksPlain, currLink, currCaption, curId) {
    // row for plain text
    var curPId = scriptID + "P" + curId;
    var plainLink = gmCreateObj(null, "span", curPId);
	gmSetAtI(plainLink, "data-href", currLink);
	plainLink = gmCreateObjCommon(plainLink, currLink, currCaption, null,
		function() { lgmSelectEntry(this); return false;},
		null, null, null,
		function() { gmOpenInTab(this["data-href"]); return true; }
	);
    arrLinksPlain.push(plainLink);
}

function lgmPrepareLinkAsLink(arrLinksLink, currLink, currCaption, curId) {
    // row for htmllink
    var curLId = scriptID + "L" + curId;
 	var plainCaption = "[" + currLink  + "]";
    var alink = gmCreateLink(null, curLId, currLink, currCaption, plainCaption, "_blank",
        function() { lgmSelectEntry(this); return false; },
        function() { gmOpenInTab(this["href"]); return true; }
    );
	gmSetAtI(alink, "data-title", currCaption);
    gmSetAtI(alink, FL_TAG, FL_ID);
    arrLinksLink.push(alink);
}

function lgmPrepareLinksInContainer(oResultLinkDiv, arrLinksLink) {
    gmEmptyObj(oResultLinkDiv);
    for ( var idxLinks = 0; idxLinks < arrLinksLink.length; idxLinks++) {
        gmAddObj(arrLinksLink[idxLinks], oResultLinkDiv);
        gmCreateObj(oResultLinkDiv, "br", null);
    }
}

function lgmSelectEntry(oEntry) {
  try {
    gmSelectText(oEntry, false);
  } catch (ex) {
    alert(ex);
  }
}
const MAIN_FONT_TYPE = "Consolas"; //"Arial, Courier New";
const MAIN_FONT_SIZE = "10pt !important";
const MAIN_CLR_TEXT = "#000000";
const MAIN_CLR_BG = "#e0e0e0"; //"#CED8F6";
const MAIN_FORMS_CLR_BORDER = "#808080"; //"#819FF7";
const MAIN_FORMS_CLR_TEXT = MAIN_CLR_TEXT;
const MAIN_FORMS_CLR_BG = "#ffffff";
const MAIN_FORMS_HEIGHT = "20px !important";
const HOVER1_CLR_TEXT = "#e0e0e0";
const HOVER1_CLR_BG = "#A80000";
const HOVER2_CLR_TEXT = "#ffffff";
const HOVER2_CLR_BG = "#A80000";
const FOCUS_CLR_BG = "#FFFFCC";
const SCROLLBAR_CLR_RULER = "#A00000"; //"#e0e0e0";
const SCROLLBAR_CLR_BG = MAIN_FORMS_CLR_BORDER;

const CSS_STYLE = `
#gl-container
{
    -moz-text-size-adjust: none;
    background-attachment: scroll;
    background-clip: border-box;
    background-color: ` + MAIN_CLR_BG + `;
    background-image: none;
    background-origin: padding-box;
    background-position: 0%;
    background-repeat: repeat;
    background-size: auto;
    color: ` + MAIN_CLR_TEXT + `;
    display: block;
    font-family: ` + MAIN_FONT_TYPE + `;
    font-size: ` + MAIN_FONT_SIZE + `;
    line-height: 15px;
    max-height: 99%;
    max-width: 50%;
    margin: 0;
    min-height: 1%;
    min-width: 225px;
    padding: 0 2px;
    overflow: hidden;
    position: fixed !important;
    right: 1px !important;
    scrollbar-color: ` + SCROLLBAR_CLR_RULER + ` ` + SCROLLBAR_CLR_BG + `;
    scrollbar-width: initial;
    text-align: left;
    top: 0 !important;
    vertical-align: top;
    width: 225px;
    white-space: nowrap;
    z-index: 2147483647;
}
/* General Styles */
#gl-container, #gl-container input, #gl-container button, #gl-container div, #gl-container a:hover
{
    -moz-border-radius: 5px;
    border: 0 none ` + MAIN_FORMS_CLR_BORDER + `;
    border-image-outset: 0;
    border-image-repeat: stretch;
    border-image-slice: 100%;
    border-image-source: none;
    border-image-width: 0;
    border-radius: 5px;
}
#gl-container input, #gl-container button
{
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    border: 2px solid ` + MAIN_FORMS_CLR_BORDER + `;
    font-family: ` + MAIN_FONT_TYPE + `;
    font-size: ` + MAIN_FONT_SIZE + `;
    font-weight: bold;
    height: ` + MAIN_FORMS_HEIGHT + `;
    margin: 0;
    margin-right: 1px;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
    padding: 0;
    text-align: left;
    vertical-align: top;
    white-space: nowrap;
}
#gl-container button
{
    padding: 0 3px;
}
#gl-container input:hover, #gl-container input:focus
{
    background-color: ` + FOCUS_CLR_BG + `;
}
#gl-container button:hover, #gl-container button:focus
{
    border-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + HOVER1_CLR_TEXT + `;
    background-color: ` + HOVER1_CLR_BG + `;
}
#gl-container a
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    font-family: ` + MAIN_FONT_TYPE + `;
    text-decoration: underline dotted ` + MAIN_FORMS_CLR_TEXT + `;
    white-space: nowrap;
}
#gl-container a:hover
{
    color: ` + HOVER1_CLR_TEXT + `;
    background-color: ` + HOVER1_CLR_BG + `;
    text-decoration: none transparent;
}
#gl-container #gl-searchbox, #gl-container #gl-actionbox, #gl-container #gl-resultbox
{
    border: transparent none 0;
    display: block;
    left: 0 !important;
    margin: 0;
    padding: 0;
    position: relative !important;
    top: 0 !important;
    white-space: nowrap;
}
#gl-container #gl-searchbox, #gl-container #gl-actionbox
{
    height: ` + MAIN_FORMS_HEIGHT + `;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
}
/* Search Box */
#gl-container #gl-searchform input
{
    height: ` + MAIN_FORMS_HEIGHT + `;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
    padding: 0 3px;
    text-align: left;
}
#gl-container #gl-searchform #gl-searchtext
{
    max-width: 115px;
    min-width: 50px;
}
#gl-container #gl-searchbox #gl-scount
{
    background-color: ` + MAIN_CLR_BG + `;
    font-size: smaller !important;
    max-width: 28px;
    min-width: 5px;
    text-align: center;
}
/* Action Box */
#gl-container #gl-actionbox #gl-awide
{
    margin-left: 6px;
}
/* Result Box */
#gl-container #gl-resultbox
{
    max-height: 99%;
    max-width: 225px;
    min-height: 1%;
    min-width: 225px;
    overflow: auto;
    width: 225px;
}
#gl-container #gl-resultbox #gl-resultplain, #gl-container #gl-resultbox #gl-resultlink
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    border: transparent none 0;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    display: block;
    left: 0 !important;
    max-height: 99%;
    max-width: 225px;
    min-height: 1%;
    min-width: 225px;
    height: 96%;
    overflow-y: auto;
    overflow-x: auto;
    padding: 2px;
    position: absolute !important;
    scrollbar-color: ` + SCROLLBAR_CLR_RULER + ` ` + SCROLLBAR_CLR_BG + `;
    scrollbar-width: initial;
    top: 1px !important;
    width: 225px;
    white-space: nowrap;
}
#gl-container #gl-resultbox #gl-resultplain
{
    visibility: visible;
    z-index: 910;
}
#gl-container #gl-resultbox #gl-resultlink
{
    visibility:hidden;
    z-index: 909;
}
#gl-container #gl-resultbox table, #gl-container #gl-resultbox tr, #gl-container #gl-resultbox td, #gl-container #gl-resultbox span
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    font-family: ` + MAIN_FONT_TYPE + `;
    margin: 0;
    padding: 0;
    white-space: nowrap;
}
#gl-container #gl-resultbox #gl-resultplain td, #gl-container #gl-resultbox #gl-resultplain span
{
    font-size: 9pt;
    line-height: 10pt;
}
#gl-container #gl-resultbox #gl-resultplain td:hover, #gl-container #gl-resultbox #gl-resultplain span:hover
{
    background-color: ` + HOVER2_CLR_BG + `;
    color: ` + HOVER2_CLR_TEXT + `;
}
#gl-container #gl-resultbox #gl-resultlink a
{
    font-size: 10pt;
    line-height:11pt;
}
`;

//
//GM-Script specific code - END
//

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

//
//GM-Script - END
//

