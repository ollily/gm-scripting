// ---------------
// base-object.js - START
// ---------------
// noinspection JSUnresolvedVariable,JSUnresolvedFunction,JSUnusedGlobalSymbols

/**
 * Creates an DOM-Object.
 *
 * @param par - the parent object to create the new object as child
 * @param objtyp - the type of the new object (HTML-Tagname)
 * @param id - the id and name of the new object
 * @returns {Object} the created object or null
 */
function gmCreateObj(par, objtyp, id) {
    // var obj = $("<" + objtyp + ">");
    let obj = null;
    if (objtyp != null && objtyp !== "") {
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
 * @param obj - the object to create the attributes in it
 * @param caption - a text which will be displayed for this object
 * @param tit - a W3C-conform title for that DOM
 * @param ro - if set != null, the DOM will be readonly
 * @param ev_click - a javascript-call for the click-event
 * @param ev_focus - a javascript-call for the focus-event
 * @param ev_mOver - a javascript-call for the mouseover-event
 * @param ev_mOut - a javascript-call for the mouseout-event
 * @param ev_dblClick - a javascript-call for the doubleclick-event
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
        }

        if (ev_dblClick) {
            // obj.click(ev_dblClick);
            obj.ondblclick = ev_dblClick;
        }

        if (ev_focus) {
            // obj.focus(ev_focus);
            obj.onfocus = ev_focus;
        }

        if (ev_mOver) {
            // obj.hover(ev_mOver);
            obj.onmouseover = ev_mOver;
        }

        if (ev_mOut) {
            // obj.hover(ev_mOut);
            obj.onmouseout = ev_mOut;
        }

    }
    return obj;
}

/**
 * Creates a DOM-Button.
 *
 * @param par - the parent object to create the new object as child
 * @param typ - the type of the new object (HTML-Tagname)
 * @param id - the id and name of the new object
 * @param caption - a text which will be displayed for this object
 * @param tit - a W3C-conform title for that DOM
 * @param initval - an initial value is set in this input
 * @param ev_click - a javascript-call for the click-event
 * @returns {Object} the created DOM-Button
 */
function gmCreateButton(par, typ, id, caption, tit, initval, ev_click) {
    let obj = gmCreateObj(par, "button", id);
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
 * @param par - the parent object to create the new object as child
 * @param id - the id and name of the new object
 * @param href
 * @param caption - a text which will be displayed for this object
 * @param tit - a W3C-conform title for that DOM
 * @param target
 * @param ev_click - a javascript-call for the click-event
 * @param ev_dblClick - a javascript-call for the doubleclick-event
 * @returns {Object} the created DOM-Link
 */
function gmCreateLink(par, id, href, caption, tit, target, ev_click, ev_dblClick) {
    let obj = gmCreateObj(par, "a", id);
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
 * @param par - the parent object to create the new object as child
 * @param typ - the type of the new input (Type-Attribute)
 * @param id - the id and name of the new object
 * @param initval - an initial value is set in this input
 * @param tit - a W3C-conform title for that DOM
 * @param ro - if set != null, the DOM will be readonly
 * @param ev_click - a javascript-call for the click-event
 * @param ev_focus - a javascript-call for the focus-event
 * @returns {Object} the new DOM-Input
 */
function gmCreateInput(par, typ, id, initval, tit, ro, ev_click, ev_focus) {
    let obj = gmCreateObj(par, "input", id);
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
 * @param obj - the object to append at the end of the child list
 * @param parent - the parent object to append to, leave null to put it to the
 *            document-body
 * @returns {Boolean} TRUE = the object could be added, else FALSE
 */
function gmAddObj(obj, parent) {
    let isSet = false;
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
 * @param id - the id of the object
 * @param initval - the new value for that element or empty
 * @returns {Boolean} TRUE = if the value could be set, else FALSE
 */
function gmSetInput(id, initval) {
    let isSet = false;
    // var obj = document.getElementById(id);
    const obj = gmGetElI(id);
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
 * @param inputElem - the element containing the text
 * @returns {Boolean} TRUE = if the input element could be selected, else FALSE
 */
function gmSelectInput(inputElem) {
    let isSet = false;
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
const SELECT_IE = 0;
/**
 * Constants for Selection of Text using Gecko Engine.
 */
const SELECT_G = 1;

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
const SELECT_CURR = gmGetTextSelectMode();

/**
 * Returns the selected Text or an empty String.
 *
 * @returns {String} the text which is currently selected.
 */
function gmGetSelectedText() {
    let selectedText = "";
    if (SELECT_IE === SELECT_CURR) {
        selectedText = document.selection.createRange().text;
    } else if (SELECT_G === SELECT_CURR) {
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
 * @param elem - an element for the Range-Object or null;
 * @returns {Range} a new Range-Object or null
 */
function gmGetNewRange(elem) {
    let textRange = null;
    if (SELECT_IE === SELECT_CURR) {
        textRange = document.selection.createRange();
    } else if (SELECT_G === SELECT_CURR) {
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
 * @param elem - the element to select the text in it
 * @param bForceSelect - TRUE=always select, FALSE=switch between select and unselect
 * @returns {String} the selected text or an empty string
 */
function gmSelectText(elem, bForceSelect) {
    let selection;
    let currSel = gmGetSelectedText();
    if (bForceSelect == null) {
        bForceSelect = false;
    }
    if (!bForceSelect && (currSel && currSel !== "")) {
        if (SELECT_IE === SELECT_CURR) {
            // noinspection BadExpressionStatementJS
            document.selection.empty;
        } else if (SELECT_G === SELECT_CURR) {
            selection = window.getSelection();
            selection.removeAllRanges();
        }
    } else {
        if (gmIsObject(elem)) {
            const tRange = gmGetNewRange(elem);
            if (SELECT_IE === SELECT_CURR) {
                tRange.select();
            } else if (SELECT_G === SELECT_CURR) {
                selection = window.getSelection();
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
    let isDel = false;
    let oObj = gmGetElI(obj);
    if (gmIsObject(oObj)) {
        const parent = oObj.parentNode;
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
    let isEmpty = false;
    let oObj = gmGetElI(obj);
    if (gmIsObject(oObj)) {
        while (oObj.firstChild) {
            oObj.removeChild(oObj.firstChild);
        }
        isEmpty = true;
    }
    return isEmpty;
}

// ---------------
// base-object.js - END
// ---------------
