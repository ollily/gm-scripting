// ---------------
// base-clipboard.js - START
// ---------------
// noinspection JSUnresolvedVariable,JSUnresolvedFunction,JSUnusedGlobalSymbols

/**
 * @returns {Object} the reference to the base window, might be the greasemonkey
 *          unsafeWindow
 */
function gmClipRef() {
    let refWindow = window;
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
    let privsMan = null;
    const wdw = gmClipRef();
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
 * @param {string|Object} text - the text to copy to the clipboard
 * @param {boolean} bQuite - don't schow any alerts
 * @param {Object} refWindow - a reference on the page (optional)
 * @returns {string|null} text = if set to clipboard, else null
 */
function gmCopy2clipboard(text, bQuite, refWindow) {
    const resultText = text;
    let wdw = gmClipRef();
    if (wdw.clipboardData) {
        wdw.clipboardData.setData("text", text);
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
            let e = wdw.Components.classes["@mozilla.org/widget/clipboard;1"].createInstance(wdw.Components.interfaces.nsIClipboard);
            if (!e)
                return null;
        } catch (ex) {
            if (!bQuite) {
                alert("1:" + ex);
            }
            return null;
        }
        try {
            let b = wdw.Components.classes["@mozilla.org/widget/transferable;1"]
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
            let o = wdw.Components.classes["@mozilla.org/supports-string;1"]
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
            let t = wdw.Components.interfaces.nsIClipboard;
            e.setData(b, null, t.kGlobalClipboard);
        } catch (ex) {
            if (!bQuite) {
                alert("4:" + ex);
            }
            return null;
        }
        if (!bQuite) {
            alert("Copy doesn't work!");
        }
        return text;
    }
}

/**
 * Same as {@link #gmCopy2clipboard(text, bQuite, refWindow)}, but customized only for use in a webpage.
 * Not usable for a greasemonkey script.
 *
 * @param {*} text - the text to copy to the clipboard
 */
function copyPostToClipboard(text) {
    let clipboard = null, transferable = null, clipboardID = null;
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
        const str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
        str.data = text;
        transferable.setTransferData("text/unicode", str, str.data.length * 2);
        try {
            clipboardID = Components.interfaces.nsIClipboard;
            if (clipboard) {
                clipboard.setData(transferable, null, clipboardID.kGlobalClipboard);
            }
        } catch (e) {
            alert(e);
        }
    }
}

/**
 * Adds the functions for using a "copy to clipboard" in a web-page.
 */
function gmAddClipboardSupport() {
    gmAddScriptGlobal([gmClipRef, gmCopy2clipboard, gmIsClipboardSupported]);
}

/**
 * @returns {boolean} TRUE=using clipboard is supported, else FALSE
 */
function gmIsClipboardSupported() {
    let isOK = false;
    try {
        let privsMan = gmPrivsManager();
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
