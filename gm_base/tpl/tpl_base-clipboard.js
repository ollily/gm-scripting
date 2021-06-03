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
    gmAddScriptGlobal(new Array(gmClipRef, gmCopy2clipboard, gmIsClipboardSupported));
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