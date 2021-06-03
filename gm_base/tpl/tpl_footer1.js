
//
// Global Code - END
//

//
// GM-Script specific code - START
//

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

//
// GM-Script specific code - END
//
