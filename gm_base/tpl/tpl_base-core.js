// ---------------
// base-core.js - START
// ---------------

/**
 * List of all URLs which are known by this script.
 */
var knownSite = new Array();
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

/**
 * Sorts an array by a specific sort order (alphanumeric).
 *
 * @param unsortedArray -
 *            the aray which should be sorted
 * @param sortmode -
 *            the sort order or leave null to ignore sorting
 * @returns {Array} the sorted array
 */
function gmSortArray(unsortedArray, sortmode) {
    var sortedArray = unsortedArray;
    if (sortmode == null) {
        sortmode = false;
    }
    if (sortmode) {
        sortedArray.sort();
    }
    return sortedArray;
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
