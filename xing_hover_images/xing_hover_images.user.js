// ==UserScript==
// @name			XING Hover Images
// @fullname		Enlarge Profile Images
// @description		Enlarge all Profile Images to normal size
// @namespace		http://userscripts.org/users/ollily
// @author			ollily2907
// @source			http://userscripts.org:8080/scripts/show/86396
// @run-at			document-end
// @licence			http://www.gnu.org/licenses/gpl-3.0.txt
// @licence			http://creativecommons.org/licenses/by-nc-sa/3.0/
// @license			(CC) by-nc-sa
// @include         https://*.xing.com/*
// @include         http://*.xing.com/*
// @include         https://xing.com/*
// @include         http://xing.com/*
// @version			1.00.00
// @date			$LastChangedDate: 2014-05-28 22:26:22 +0200 (Mi, 28 Mai 2014) $
// @revision		$LastChangedRevision: 61 $
// @include			http://gmonkey.*.*/test/*
// @include			http://devzone.*.*/test/gm/*
// ==/UserScript==

/*
Changes:
2013-04-01
- JQuery removed

2012-07-25
- JQuery does not identify all images

2012-07-23
- Correct (!) image url for public images added

2012-07-12
- Image url for public images added

2011-12-27
- Version Number changed

2011-12-20
- Image is displayed in upper area
- Correct image urls
- Image size enlarged

2011-10-20
- Correct image urls

2010-10-15
- Add download link

2010-10-10
- Some Fixes
- Beautify the code

2010-10-08
- Switched to JQuery
- Some Fixes

2010-09-08
- Initial Version
 */

/*
Known Bugs:
- search result, does not display the large preview
 */

//
// Global Code - START
//


//
// Global Code - START
//


//
// Global Code - END
//


//
//GM-Script specific code - START
//

// ---------------
// base-core.js - START
// ---------------

var knownSite = new Array();
var currHost = document.location.host;
var currPort = document.location.port;

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
//if (currHost.search("localhost") == 0) {
//	bTestMode = true;
//};

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
	if (a && a.length > 0) {
		for ( var int = 0; int < a.length; int++) {
			var a_ele = a[int];
			if (!isNaN(a_ele)) {
				numFound += a_ele;
			} else {
			}
		}
	}
	return eval(numFound);
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
 * @returns {Object} the object with added attributes FIXME: Check
 */
function gmCreateObjCommon(obj, caption, tit, ro, ev_click, ev_focus) {
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
		if (ev_focus) {
			// obj.focus(ev_focus);
			obj.onfocus = ev_focus;
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
	obj = gmCreateObjCommon(obj, caption, tit, null, ev_click, null);
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
 * @returns {Object} the created DOM-Link
 */
function gmCreateLink(par, id, href, caption, tit, target, ev_click) {
	var obj = gmCreateObj(par, "a", id);
	obj = gmCreateObjCommon(obj, caption, tit, null, ev_click, null);
	if (href) {
		gmSetAtI(obj, "href", href);
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

var FL_TAG = "fltag";
var FL_ID = "_FL";

/**
 * Search for all matching links in the page.
 *
 * @param sea -
 *            the search pattern or leave "" to get all
 * @param withDesc -
 *            0 = search only in links, 1 = search also in link description
 * @returns {Array} an array with all found links
 */
function gmFindLinksInPage(sea, withDesc) {
	//
	if (withDesc == null) {
		withDesc = 0;
	}
	var pagelinks = new Array();

	if (!sea || sea.length <= 0) {
		sea = ".*";
	} else if (sea.charAt(0) == "/" && sea.charAt(sea.length - 1) == "/") {
		sea = sea.substring(1, sea.length);
		sea = sea.substring(0, sea.length -1);
	} else {
		sea = sea.replace(/\?/g, ".").replace(/\./g, "\.").replace(/\*/g, ".*");
	}
	//alert(sea);
	sea = new RegExp(sea, "i");
	for (var i=0; i < document.links.length; i++) {
		var curlink = document.links[i];
		var ne = 1;

		//var searchText = curlink.href;
		var searchText = new Array();
		searchText.push(gmGetAtI(curlink, "href"));
		if (withDesc != 0) {
			searchText.push(gmGetAtI(curlink, "alt"));
			searchText.push(gmGetAtI(curlink, "title"));
			searchText.push(gmGetAtI(curlink, "onmouseover"));
			searchText.push(gmGetAtI(curlink, "onclick"));
			searchText.push(curlink.innerHTML.replace("\\n", "").replace("#", ""));
		}
		var found = gmFindLinksInPage0(searchText, sea);

		if (found) {
			if (gmGetAtI(curlink.id, FL_TAG) != FL_ID) {
				var htmllink = gmGetAtI(curlink, "href");

				for (var j=0; j < pagelinks.length; j++) {
					if (htmllink == pagelinks[j][0]) {
						// link allready added, avoiding duplicates
						ne = 0; break;
					}
				}
				if (ne == 1) {

					var searchText = new Array();
					searchText.push(curlink.text);
					if (withDesc != 0) {
						searchText.push(gmGetAtI(curlink, "alt"));
						searchText.push(gmGetAtI(curlink, "title"));
						searchText.push(gmGetAtI(curlink, "onmouseover"));
						searchText.push(gmGetAtI(curlink, "onclick"));
						searchText.push(curlink.innerHTML);
					}
					var htmltext = gmFindLinksInPage1(searchText);

					//alert("L: "+htmllink + " T: " + htmltext);
					var curlink = new Array(htmllink, htmltext);
					pagelinks.push(curlink);
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
 * @param sea - a search text (might be a regular expression)
 * @returns {Boolean} TRUE= the search text is found in the array, or FALSE
 */
function gmFindLinksInPage0(arrText, sea) {
	var found = false;
	if (gmIsArray(arrText)) {
		//alert(arrText.join("\n"));
		for (var i=0; i < arrText.length; i++) {
			var searchText = arrText[i];
			try {
				found = searchText.search(sea) != -1;
			} catch (e) {
				// ignored
			}
			//alert("i:" + i + " S:" + sea + " F:" + found + " T:" + searchText);
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
function gmFindLinksInPage1(arrText) {
	var searchTextClean = new Array("", "", "");
	if (gmIsArray(arrText)) {
		//alert(arrText.join("\n"));
		for (var idxST = 0; idxST < arrText.length; idxST++) {
			var aEle = arrText[idxST];
			if (aEle != null) {
				try {
					aEle = ("" + aEle).replace("\\n", "").replace("#", "").trim();
					if (aEle != "") {
						var tarIdx = -1;
						switch (idxST) {
						case 0:
						case 1:
						case 2:
							tarIdx = 0;
							break;
						case 3:
						case 4:
							tarIdx = 1;
							break;
						case 5:
							tarIdx = 2;
							break;
						default:
							break;
						}
						if (tarIdx > -1) {
							if (searchTextClean[tarIdx].search(aEle) == -1) {
								if (searchTextClean[tarIdx] != "") {
									searchTextClean[tarIdx] += "\n";
								}
								searchTextClean[tarIdx] += aEle;
							}
						}
					}
				} catch (e) {
					// ignored
				}
			}
		}
	}

	var htmltext = "";

	if (searchTextClean.length > 0) {
		//alert(searchTextClean.join("\n"));
		if (searchTextClean[0] != "") {
			htmltext = searchTextClean[0];
		} else if (searchTextClean[1] != "") {
			htmltext = searchTextClean[1];
		} else if (searchTextClean[2] != "") {
			htmltext = searchTextClean[2];
		}
	}
	if (htmltext == null || htmltext == "") {
		htmltext = "n/a";
	}
	return htmltext;
}

/**
 * Adds a javascript block into the page.
 *
 * @param scc -
 *            a string, a function or an array with the javascript code or a
 *            function-list
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
 * @param scLink -
 *            a string or an array with the url of the javascript-file FIXME:
 *            Check
 */
function gmAddScriptLinkGlobal(scLink) {
	var isSet = false;
	var head = gmGetHead();
	if (head && scLink && scLink.length > 0) {
		var allScLink = new Array();
		if (gmIsArray(scLink)) {
			allScLink = scLink;
		} else {
			allScLink = new Array(scLink);
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
 * @param scc -
 *            a string or an array with the css code
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
 * @param maxEntries -
 *            number of entries to generate
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
	testArray = new Array();
	for ( var i = 1; i <= maxEntries; i++) {
		var curlink = "http://" + currSite + currPath + "/link-" + i;
		var htmllink = curlink;
		var htmltext = "linktext-" + i;
		var curlink = new Array(htmllink, htmltext);
		testArray.push(curlink);
	}
	return testArray;
}

/**
 * Calculate the offset of an element relating to the elemnt at the most top.
 *
 * @param element
 *            the element to check the offeset
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
 * @param iPoint -
 *            a screen point, to add an additional offset
 * @param iZoom -
 *            the zoom factor 1= Originalsize
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
 * @param searchForPattern -
 *            the pattern to search for
 * @param replaceWithText -
 *            the text what will be inserted instead
 * @param oldUrl -
 *            the URL to search in
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

// ---------------
// base-web.js - END
// ---------------

//
// Global Code - END
//

//
// GM-Script specific code - START
//

/* -------------------------------- */
/**
 * Switch for debug-mode
 */
var gm_debug = false;
/**
 * List of all File which can be replaced, according to the same index of knownSite.
 */
var knownRepl = new Array();
/**
 * The pattern to search for filename inside the page.
 */
var img2Search = "";
/**
 * The pattern to search for a text inside a file name.
 */
var elemSearchUrl = "";
/**
 * The plain text with which the pattern (inside a file name) will be replaced.
 */
var elemReplUrl = "";
/**
 * The plain text with which the pattern (inside a file name) will be replaced for a large image.
 */
var elemReplUrlLarge = "";
/**
 * Will add a download-link beneath the picture.
 */
var elemWithDownLink = 0;

/**
 * value for correcting the preview position to the left (negative) or to the right (positive).
 */
var offSetLeftFix = -2;
/**
 * Font Size of the text in the description box.
 */
var picTextFontSize = 8;
/**
 * Height of the text description box. Should be 2 larger than font-size.
 */
var picTextHeight = 14;
/**
 * Current loop wait for loading the preview.
 */
var loopIdx = 0;
/**
 * Looping maximum iteration.
 */
var loopIdxMax = 15;
/**
 * Time in ms to wait before starting the next loop.
 */
var loopIdxWait = 300;

/**
 * Shows the preview image.
 *
 * @param parentElem - the orginal image in the page
 * @param hDiv - the div-element
 * @param hImg - a placeholder-div or the image
 * @param newImage - the preview image
 * @param loopIdx - how many tries we already made
 */
function lgm_showPreview(parentElem, hDiv, hImg, newImage) {

	var offsetW = (gmCumulativeOffset(parentElem)[0]) + offSetLeftFix;
	var offsetH = 0; //cumulativeOffset(parentElem)[1];
	var ratio = parentElem.style.width / parentElem.style.height; // parentElem.width / parentElem.height;
	var iZoom = 1.33;

	gmSetAtI(hDiv, "style", "cursor:wait");
	//hDiv.css("cursor", "wait");

	gmSetAtI(hImg, "style", "cursor:wait");
	//hImg.css("cursor", "wait");

	var pE = gmGetElI(parentElem);
	//var pE = $(parentElem);

	gmSetAtI(pE, "style", "cursor:wait");
	//pE.css("cursor", "wait");

	var iPoint = ["auto", "auto"];

	if (!newImage.complete && loopIdx <= loopIdxMax) {
		// image not loaded

		gmSetCoI(hImg, "");
//		hImg.empty();

		gmSetCoI(hImg, loopIdx);
//		hImg.text(loopIdx);


		loopIdx++;

		offsetH = gmCalcOffsetH(parentElem, iPoint, iZoom);
//		offsetH = calcOffsetH(parentElem, iPoint, iZoom);

		gmSetDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom);
//		setDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom);

		window.setTimeout(function() { lgm_showPreview(parentElem, hDiv, hImg, newImage); }, loopIdxWait);

	} else {
		// set Image
		gmSetCoI(hDiv, "");
//		hDiv.empty();

		var hA = gmCreateObj(null, "a");
//		var hA = $("<a>");

		gmSetAtI(hA, "id", "a" + gmGetAtI(hImg, "id"));
//		hA.attr("id", "a" + hImg.attr("id"));

		gmSetAtI(hA, "target", "#blank");
//		hA.attr("target", "#blank");

		gmAddObj(hA, hDiv);
//		hDiv.append(hA);

		hImg = gmCreateObj(null, "img");
//		hImg = $("<img>");


		gmSetAtI(hImg, "hi-preview");
//		hImg.addClass("hi-preview");

		gmSetAtI(hImg, "id", gmGetAtI(hA, "id"));
//		hImg.attr("id", hA.attr("id"));

		gmAddObj(hImg, hA);
//		hA.append(hImg);

		// get text
		var picText = gmGetAtI(pE, "alt");
//		var picText = pE.attr("alt");

		if (!picText || picText.length < 1) {
			picText = gmGetAtI(pE, "title");
//			picText = pE.attr("title");
		}


		// set text
		if (picText && picText.length >= 1) {

			var objText = gmCreateObj(null, "div");
//			var objText = $("<div>");

			gmSetCoI(objText, picText);
//			objText.text(picText);

			gmSetAtI(objText, "id", "cap" + gmGetAtI(hImg, "id"));
//			objText.attr("id", "cap" + hImg.attr("id"));

			gmSetAtI(objText, "class", "hi-caption");
//			objText.addClass("hi-caption");

			gmAddObj(objText, hDiv);
//			hDiv.append(objText);
		}

		gmSetAtI(hImg, "src", newImage.src);
//		hImg.attr("src", newImage.src);

		gmSetAtI(hA, "href", gmGetReplaceUrl(elemSearchUrl, elemReplUrlLarge, newImage.src));
//		hA.attr("href", getReplaceUrl(elemSearchUrl, elemReplUrlLarge, newImage.src));

		gmSetAtI(hA, "title", "[" + picText + "]");
//		hA.attr("title", "[" + picText + "]");

		gmSetAtI(hImg, "title", gmGetAtI(hA, "title"));
//		hImg.attr("title", hA.attr("title"));

		gmSetAtI(hImg, "alt", gmGetAtI(hImg,"title"));
//		hImg.attr("alt", hImg.attr("title"));


		// set layout
		iPoint = gmGetImageSize(newImage);
		offsetH = gmCalcOffsetH(parentElem, iPoint, iZoom);
		gmSetDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom);
		gmSetImgLayout(hDiv, hImg, iPoint, iZoom);
//		iPoint = getImageSize(newImage);
//		offsetH = calcOffsetH(parentElem, iPoint, iZoom);
//		setDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom);
//		setImgLayout(hDiv, hImg, iPoint, iZoom);

		// remove hourglass
		gmSetAtI(hDiv, "style", "cursor:auto");
//		hDiv.css("cursor", "auto");

		gmSetAtI(hImg, "style", "cursor:pointer");
//		hImg.css("cursor", "pointer");

		gmSetAtI(pE, "style", "cursor:pointer");
//		pE.css("cursor", "pointer");

		gmSetAtI(hA, "style", "cursor:pointer");
//		hA.css("cursor", "pointer");

	}
}

function lgm_showPreview2(parentElem, hDiv, hImg, newImage) {
	//var info = "pic: " + parentElem.src + "\n div: " + hDiv.id + "\n img: " + hImg.id + "\n new: " + newImage.src;
	//alert(info);
//	gmSetAtI(gmGetBody(), "style", "background-color:red");
}

/**
 * Scans the list of images and adds the preview-handler in case the url matches with the search-pattern.
 *
 * @param searchPattern - the regular expression which must match with the image-url
 * @param imgList - an array of images (html-tag)
 */
function lgm_addPreviewHandler(searchPattern, imgList) {

	for(var i=0; i < imgList.length; i++) {
//		for(var i=0; i < imgList.size(); i++) {

		var imgObj = gmGetElI(imgList[i]);
//			var imgObj = $(imgList.get(i));
//			alert(typeof imgObj);
		var imgName = gmGetAtI(imgObj, "src");
//			var imgName = imgObj.attr("src");
		var s = searchPattern.test(imgName);
//		alert(imgName + " " + s);
		if( s ) {

			var tagdivid = "div" + i;
			var tagimgid = "img" + i;
	//		var divid = "#div" + i;
//			var imgid = "#img" + i;
			var refid = null;
			//alert(imgName + " " + tagdivid + " " + tagimgid);

			var replaceUrl = gmGetReplaceUrl(elemSearchUrl, elemReplUrlLarge, imgName);
	//		var replaceUrl = getReplaceUrl(elemSearchUrl, elemReplUrlLarge, imgObj.attr("src"));

			imgObj.addEventListener('mouseover',
//			imgObj.onmouseover =
				function(e) {
					refid = this;
					const localTag = tagdivid;
					const localImg = tagimgid;
					replaceUrl = gmGetReplaceUrl(elemSearchUrl, elemReplUrl, this.src);
	//				replaceUrl = getReplaceUrl(elemSearchUrl, elemReplUrl, this.src);
					var newImage = new Image();
					newImage.src = replaceUrl;
					var hDiv;
					var hImg;

					if (gmIsInstanceOf(gmGetElI(localImg), Image)) {
	//				if ($("body").find(imgid).is("img")) {
						hDiv = gmGetElI(localTag);
	//					hDiv = $(divid);

						hImg = gmGetElI(localImg);
	//					hImg = $(imgid);
					} else {
						hDiv = gmCreateObj(null, "div", localTag);
						gmSetAtI(hDiv, "class", "hi-preview");
	//					hDiv = $("<div id=\"" + tagdivid + "\" class=\"hi-preview\"></div>");

						hImg = gmCreateObj(null, "div", localImg);
						gmSetAtI(hImg, "class", "hi-wait");
						gmSetInput(hImg, "0");
	//					hImg = $("<div id=\"" + tagimgid + "\" class=\"hi-wait\">0</div>");

						gmSetCoI(hDiv, "");
						gmAddObj(hImg, hDiv);

						gmAddObj(hDiv, null);
	//					$("body").append(hDiv);
	//					$(divid).empty().append(hImg);
					}
					gmSetAtI(hDiv, "style", "cursor:wait");
	//				hDiv.css("cursor", "wait");

					gmSetAtI(hImg, "style", "cursor:wait");
	//				hImg.css("cursor", "wait");

					loopIdx = 0;
					lgm_showPreview(this, hDiv, hImg, newImage, 0);
//			};
				}
			);
			imgObj.addEventListener('mouseout',
				function(e) {
					refid = this;
					const localTag = tagdivid;
					const localImg = tagimgid;

					var bRemove = true;
					var evTarget = e.target;

					var jDiv = null;

					if (evTarget == refid) {
						jDiv = gmGetElI(localTag);
					} else {
						bRemove = false;
					}
					alert(refid.src + "< >" + bRemove + "< >" + evTarget.src + "< >" + (jDiv == null));
					if (bRemove) {
						if (gmIsObject(jDiv)) {
							gmSetAtI(jDiv, "style", "cursor:auto");
							gmDelObj(jDiv);
//							gmSetAtI(gmGetBody(), "style", "background-color:blue");

						}
					}
					//gmSetAtI(refid, "style", "cursor:auto");

				}
			);
			if (elemWithDownLink == 1) {
				var dlLink = gmCreateObj(null, "a");
				gmSetAtI(dlLink, "id", "dl" + tagdivid);
				gmSetAtI(dlLink, "class", "hi-dlink");
				gmSetCoI(dlLink, "Download");
	//			var dlLink = $("<a href=\"\" id=\"dl" + tagdivid + "\" class=\"hi-dlink\">Download</a>");

				gmSetAtI(dlLink, "target", "#blank");
				gmSetAtI(dlLink, "href", replaceUrl);
	//			dlLink.attr({"target":"#blank","href":replaceUrl});

				gmSetAtI(dlLink, "title", "download [" + gmGetAtI(dlLink, "href") + "]");
	//			dlLink.attr("title","download ["+dlLink.attr("href") +"]");
//				alert(dlLink);
				gmAddObj(dlLink, imgObj.parentNode);
	//			imgObj.parent().after(dlLink);
			}

//			lgm_addBodyListener();
		}
	}
}

/**
 * Adds a listener to the body to hide the preview image.
 *
 * @param refid - the tag-id which must match the tagdivid
 * @param tagdivid - the tag-id from the surrounding preview image, which should be hidden
 */
function lgm_addBodyListener(refid, tagdivid) {
	gmGetBody().addEventListener('mouseover',
//			gmGetBody().onmouseover =
//			$("body").mouseover(
				function(e) {
					var bRemove = true;
					var evTarget = e.target;

					var tMsg = (evTarget.tagName + " " + new Date().toGMTString()) + " ";
					var jDiv = null;

					if (evTarget != refid) {
						jDiv = document.getElementById(tagdivid);
//						var jDiv = $(divid);

						var jDivChilds = new Array();
						if (jDiv) {
							jDivChilds = jDiv.childNodes;
						}
//						var jDivChilds = $(divid).find("*");

						if (jDivChilds.length > 0) {
//						if (jDiv.size() > 0 && jDivChilds.size() > 0) {

							tMsg += jDiv.tagName + " " + evTarget.id + " " + jDivChilds.length;
//							tMsg += jDiv.get(0).tagName + " " + evTarget.id + " " + jDivChilds.size();

							if (evTarget == jDiv[0]) {
//							if (evTarget == jDiv.get(0)) {
								bRemove = false;
							} else {
								for ( var childIdx = 0; childIdx < jDivChilds.length; childIdx++) {
//								for ( var childIdx = 0; childIdx < jDivChilds.size(); childIdx++) {
									var currChild = jDivChilds[childIdx];
									if (evTarget == currChild) {
										bRemove = false;
										break;
									}
								}
							}
						}
					} else {
						bRemove = false;
					}
					tMsg += "" + bRemove;

					if (bRemove) {
						if (gmIsObject(jDiv)) {
//						if (jDiv.size() > 0) {

							gmSetAtI(jDiv, "style", "cursor:auto");
//							jDiv.css("cursor", "auto");

							gmDelObj(jDiv);
//							jDiv.remove();

							tMsg += " remove";
						}
					}
					gmSetAtI(this, "style", "cursor:auto");
//					$(this).css("cursor", "auto");

//					if (gm_debug) {
//						if ($("#se1").size() < 1) {
//							$("body").before("<span id='se1'>0</span>");
//						}
//						$("#se1").text(tMsg);
//					}
				}
			);
}

/**
 * Now add the event handler.
 */
function lgm_initScript(e) {
	var imgList = gmGetElList("tagname", "img");
	//document.getElementsByTagName("img");
// 	var imgList = $("img");
	if (img2Search != "") {
		var searchPattern = new RegExp(img2Search);
//		alert(img2Search);
		lgm_addPreviewHandler(searchPattern, imgList);
	};

//	for(var i=0; i < imgList.length; i++) {
////	for(var i=0; i < imgList.size(); i++) {
//
//		var imgObj = gmGetElI(imgList[i]);
////		var imgObj = $(imgList.get(i));
////		alert(typeof imgObj);
//		var imgName = gmGetAtI(imgObj, "src");
////		var imgName = imgObj.attr("src");
////		alert(imgName);
//		var s = searchPattern.test(imgName);
//		if( s ) {
//			lgm_addPreviewHandler(s, imgObj, imgName, i);
//		}
//	}

	// add listener to document, in case images are dynamically added
//	document.addEventListener('DOMNodeInserted',
//		function(ev) {
//			var imgList = null;
//			switch (ev.target.nodeName) {
//			case 'IMG':
//				imgList = [ev.target];
//				break;
//
//			default:
//				imgList = ev.target.getElementsByTagName('img');
//				break;
//			}
//			lgm_addPreviewHandler(searchPattern, imgList);
//		}
//	);

}

window.onload =
	function(e) {
		gmAddHandler(e);
	};

//$(window).ready(
//	function(e) {
//		addHandler(e);
//	}
//);

//
//GM-Script specific code - END
//

/**
 * Adds site which should be known by this script.
 * Can be left empty.
 */
function lgm_addKnownSites() {
	gmAddSite2(".+\\.xing\.com", "\/(?:pub|)img\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );
	gmAddSite2(".+\.net", "\/(?:pub|)img\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );
	gmAddSite2("localhost.*", "(?:|^\/|.+?\/)(?:pub|)img\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );

//	gmAddSite(".+\\.xing\.com", "\/img\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );
//	gmAddSite(".+\\.xing\.com", "\/pubimg\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );
//	gmAddSite(".+\.net", "\/img\/users\/.+(?:\_s[0-9].*?|\,[0-9].[0-9]+?x[0-9]+?)\.(?:jpg|gif|png)", "(\\_s[0-9].+?|\,[0-9].[0-9]+?x[0-9]+?)\\.", ".", ".", 0 );

};

/**
 * Adds CSS-Styles for this script.
 * Can be left empty.
 */
function lgm_addStyles() {
	GM_addStyle("a.hi-dlink, a.hi-dlink:hover {position:relative;top:2px;text-decoration:none;padding:1pt 2pt;border:#000000 solid 1px;background-color:#ffffff;color:#000000;font-size:8pt;font-weight:bold");
	GM_addStyle("a.hi-dlink:hover {border:1pt #ff6080 solid;background-color:#ff6080;color:#ffffff}");
	GM_addStyle("div.hi-preview {position:absolute;overflow:hidden;padding:0px;margin:0px;border:solid #cccccc 1px;"
		+ "z-index:1997;background-color:#eeeeee;font-family:Arial,Courier;font-size:"+picTextFontSize+";font-weight:bold;}");
	GM_addStyle("img.hi-preview {border:0pt none #ffffff;z-index:1998;}");
	GM_addStyle("div.hi-wait {font-size:10pt;font-weight:bold; }");
	GM_addStyle("div.hi-caption {font-size:"+picTextFontSize+";font-weight:bold;overflow:hidden;background-color:#eeeeee;z-index:1999;}");
};

/**
 * Adds HTML-Objects for this script.
 * Can be left empty.
 */
function lgm_addControls() {
	var foundSite = gmFoundFilter2(currSite);
	if (gmIsObject(foundSite)) {
		img2Search = foundSite.url;
		elemSearchUrl = foundSite.search;
		elemReplUrl = foundSite.replace;
		elemReplUrlLarge = foundSite.replace_large;
		elemWithDownLink = foundSite.withDownload;
	}

//	alert(img2Search);

	//	getFilter(currSite);
};

/**
 * The first action which should be excecuted in this script.
 * Can be left empty.
 */
function lgm_addInitAction() {
	lgm_initScript(null);
};

//
// GM-Script specific code - END
//
