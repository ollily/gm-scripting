// ---------------
// base-core.js - START
// ---------------
// noinspection JSUnusedGlobalSymbols

/**
 * List of all URLs which are known by this script.
 */
const knownSite = [];
const CURR_HOST = document.location.host;
let CURR_PORT = document.location.port;

/**
 * The URL we are currently running on.
 */
let currSite = CURR_HOST;
if (document.location.port) {
    CURR_PORT = ":" + document.location.port;
    if (currSite.search(CURR_PORT) === -1) {
        currSite += ":" + document.location.port;
    }
}

const currPath = document.location.href.substring(document.location.href.indexOf(currSite) + currSite.length);
const bTestMode = false;
const INIT_ONLOAD = true;

// - General DHTML-Lib - Start
// - modified & extended dhtml.js from selfhtml.de

let DHTML = false, DOM = false, MSIE4 = false, NS4 = false, OP = false;

const SHORT_ID = "id";
const ATTR_SEP = ";";

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
    return gmGetEl(SHORT_ID, identifier, null);
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
    let element, elementList;
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
        return null;
    }
    if (DOM) {
        if (mode.toLowerCase() === "id") {
            element = document.getElementById(identifier);
            return element;
        }
        if (mode.toLowerCase() === "name") {
            elementList = document.getElementsByName(identifier);
            element = elementList[elementNumber];
            if (!element || element === "undefined") {
                element = null;
            }
            return element;
        }
        if (mode.toLowerCase() === "tagname") {
            elementList = document.getElementsByTagName(identifier);
            element = elementList[elementNumber];
            return element;
        }
        return null;
    }
    if (MSIE4) {
        if (mode.toLowerCase() === "id" || mode.toLowerCase() === "name") {
            element = document.all(identifier);
            return element;
        }
        if (mode.toLowerCase() === "tagname") {
            elementList = document.all.tags(identifier);
            element = elementList[elementNumber];
            return element;
        }
        return null;
    }
    if (NS4) {
        if (mode.toLowerCase() === "id" || mode.toLowerCase() === "name") {
            element = document[identifier];
            if (!element) {
                element = document.anchors[identifier];
            }
            return element;
        }
        if (mode.toLowerCase() === "layerindex") {
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
        if (mode.toLowerCase() === "name") {
            return document.getElementsByName(identifier);
        }
        if (mode.toLowerCase() === "tagname") {
            return document.getElementsByTagName(identifier);
        }
        return null;
    }
    if (MSIE4) {
        if (mode.toLowerCase() === "id" || mode.toLowerCase() === "name") {
            return document.all(identifier);
        }
        if (mode.toLowerCase() === "tagname") {
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
    return gmGetAt(SHORT_ID, identifier, null, attributeName);
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
    let attribute = null;
    const element = gmGetEl(mode, identifier, elementNumber);
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
    return gmGetCo(SHORT_ID, identifier, null);
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
    let content = null;
    const element = gmGetEl(mode, identifier, elementNumber);
    if (element) {
        if (DOM && element.firstChild) {
            if (element.firstChild.nodeType === 3) {
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
    return gmSetCo(SHORT_ID, identifier, null, text);
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
    const element = gmGetEl(mode, identifier, elementNumber);
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
    return gmSetAt(SHORT_ID, identifier, null, attributeName, attributeValue);
}

/**
 * Sets a new value for an attribute to an element, any existing attribute value
 * is replaced.
 *
 * @param mode -
 *            how the Identifier is interpreted (id, name, tagname)
 * @param identifier -
 *            the key (id, name, tagname) of the element
 * @param elementNumber
 * @param attributeName -
 *            the unique name of the attribute
 * @param attributeValue -
 *            the new value for that attribute
 * @returns {Boolean} TRUE = the value could be set, else FALSE
 */
function gmSetAt(mode, identifier, elementNumber, attributeName, attributeValue) {
    //var attribute;
    const element = gmGetEl(mode, identifier, elementNumber);
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
    const oldValue = gmGetAt(mode, identifier, attributeName);
    const newValue = oldValue + ATTR_SEP + attributeValue;
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
    return gmAppAt(SHORT_ID, identifier, attributeName, attributeValue);
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
    let isType = false;
    if (obj != null) {
        if (objType == null) {
            objType = "Object";
        }
        try {
            let tObjType = eval(objType);
            isType = (obj.constructor === tObjType);
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
    let ret = null;
    if (a != null) {
        ret = String(a);
        let pos = 0;
        while (a.charAt(pos) === " ") {
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
    let ret = null;
    if (a != null) {
        ret = String(a);
        let pos = a.length - 1;
        while (a.charAt(pos) === " ") {
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
    let cleanText = "";
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
    let numFound = "";
    if (isNaN(a)) {
        if (a && a.length > 0) {
            for (let int = 0; int < a.length; int++) {
                const a_ele = a[int];
                if (!isNaN(a_ele)) {
                    numFound += a_ele;
                } else {
                }
            }
        }
    } else {
        numFound = a;
    }
    let newNum = Number(numFound).valueOf();
    if (typeof (newNum) != "number") {
        newNum = 0;
    }
    return newNum;
}

const SORT_NO = 0;
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
    const sortedArray = unsortedArray;
    if (sortMode == null) {
        sortMode = false;
    }
    if (sortMode === SORT_NUM) {
        sortedArray.sort(function (aE, bE) {
            return aE - bE;
        });
    } else if (sortMode === SORT_REV) {
        sortedArray.reverse();
    } else if (sortMode || sortMode === SORT_DEF) {
        sortedArray.sort();
    }
    return sortedArray;
}

function gmSortObject(unsortedObjects, sortField) {
    try {
        if (gmIsArray(unsortedObjects)) {
            unsortedObjects.sort(function (aElem, bElem) {
                    const x = aElem[sortField].toLowerCase();
                    const y = bElem[sortField].toLowerCase();
                    if (x < y) {
                        return -1;
                    }
                    if (x > y) {
                        return 1;
                    }
                    return 0;
                }
            );
        }

    } catch (ex) {
        alert(ex);
    }
    return unsortedObjects;
}

function gmOnlyUnique(arrArray) {
    let arrUnique = [];
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
    let isDone;
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
        window.addEventListener("load", function (e) {
            gmAddHandler(e);
        });
    }
}

// ---------------
// base-core.js - END
// ---------------
