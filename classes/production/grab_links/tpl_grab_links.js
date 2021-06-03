<<<<<<< HEAD
/**
 * Define the global variables used for this script.
 */
var scriptID = "GM-GL";

var contlinks;
var odiv;
var ores;
var o1;
var oform;
var initFilter;

var bshow = '\\/';
var bhide = '/\\';
var hmin = '25px';
var hmax = '99.5%';
var hmaxauto = 'auto';
var hmaxlh = 14;
var h_on = -1;
var h_off = -2;
var bDescA = "D";
var tDescA = "search in link & description";
var vDescA = "1";
var bDescD = "L";
var tDescD = "search in link ONLY";
var vDescD = "0";

/**
 * Add the DOM-Objects used in this script.
 */
function lgmAddControlsGrabLinks() {

	gmAddClipboardSupport();
	contlinks = gmCreateObj(null, "div", "gl-container");
	odiv = gmCreateObj(contlinks, "div", "gl-searchbox");
	oact = gmCreateObj(contlinks, "div", "gl-actionbox");
	ores = gmCreateObj(contlinks, "div", "gl-resultbox");
	oform = gmCreateObj(odiv, "form", "gl-searchform");

	initFilter = gmFoundFilter(currSite, currPath);
	var searchText_Desc = "enter your search\n" +
	 "Simple Wildcards = (?, *)\n" +
	 "Regular Expression = /searchtext/";
	gmCreateInput(oform, "text", "gl-searchtext", initFilter, searchText_Desc, null, null,
			function() {
				return gmSelectInput(this);
			});

	gmCreateButton(oform, "submit", "gl-sstart", "S", "start search", null, function() {
		return lgmFilterURL('gl-searchtext');
	});
	gmCreateButton(oform, "button", "gl-sreset", "R", "clear search", null, function() {
		return lgmRemall('gl-searchtext');
	});
	gmCreateButton(oform, "button", "gl-sshow", bshow, "show/hide result", null, function() {
		return lgmShowhide();
	});
	//var odiv = gmCreateObj(oform, "label", "gl-ldesc");
	gmCreateButton(oform, "button", "gl-sdesc", bDescA, tDescA, vDescA, function() {
		return lgmToggleSearchDesc('gl-sdesc');
	});
	gmCreateInput(oform, "text", "gl-scount", "", "number of hits", 1, null, null, null);

	var selCap = "SA";
	var selTit = "De-/Select All";
	if (gmIsClipboardSupported()) {
		selCap = "CA";
		selTit = "Select & Copy All";
	}
	gmCreateButton(oact, "button", "gl-aselect", selCap, selTit, null, function() {
		return lgmSelectall('gl-resultplain', 'gl-resultlink');
	});
	gmCreateButton(oact, "button", "gl-ashowplain", "PR", "Show Plain Results", null, function() {
		lgmShow('gl-resultplain', 'gl-resultlink');
	});
	gmCreateButton(oact, "button", "gl-ashowlink", "RL", "Show Results as Link", null, function() {
		lgmShow('gl-resultlink', 'gl-resultplain');
	});

	gmCreateObj(ores, "div", "gl-resultplain");
	gmCreateObj(ores, "div", "gl-resultlink");

	gmAddObj(contlinks, gmGetBody());
	lgmShowhide(h_off);
}

/**
 * Shows the layer in param f and hides the layer in param b.
 *
 * @param f -
 *            the layer to put in front
 * @param b -
 *            the layer to put in the bakc
 */
function lgmShow(f, b) {
	var obf = gmGetStyle(f);
	var obb = gmGetStyle(b);

	if (obf && obb) {

		var idxF = gmGetAtI(obf, "index");
		//var idxF = obf.zIndex;

		var idxB = gmGetAtI(obb, "index");
		//var idxB = obb.zIndex;
		if (!idxF || isNaN(idxF) || idxF == '') {
			idxF = 910;
		}
		if (!idxB || isNaN(idxB) || idxB == '') {
			idxB = idxF - 1;
		}
		if (idxF < idxB) {
			var i = idxF;
			idxF = idxB;
			idxB = i;
		}
		gmSetAtI(obf, "index", idxF);
		gmSetAtI(obf, "visibility", "visible");
		gmSetAtI(obf, "left", 0);
		gmSetAtI(obb, "index", idxB);
		gmSetAtI(obb, "visibility", "hidden");
		gmSetAtI(obf, "left", 2000);
	}
}

/**
 * Switch the search mode.
 *
 * @param button - the button to read the current state from
 */
function lgmToggleSearchDesc(button) {
	var oBut = gmGetElI(button);
	if (oBut){
		var curValue = gmGetAtI(oBut, "value");
		if (curValue == vDescD) {
			gmSetCoI(oBut, bDescA);
			gmSetAtI(oBut, "value", vDescA);
			gmSetAtI(oBut, "title", tDescA);
		} else {
			gmSetCoI(oBut, bDescD);
			gmSetAtI(oBut, "value", vDescD);
			gmSetAtI(oBut, "title", tDescD);
		}
	}
}

/**
 * Shows the complete layer with a default size or special size.
 *
 * @param onoff -
 *            a numeric height, on, off or null
 * @returns {Boolean} always false
 * @see #h_on
 * @see #h_off
 * @see #hmin
 * @see #hmax
 * @see #hmaxauto
 */
function lgmShowhide(onoff) {
	var c = gmGetElI('gl-container');
	var styleC = gmGetStyle(c);

	var c1 = gmGetElI('gl-resultbox');
	var styleC1 = gmGetStyle(c1);

	var bts = gmGetElI('gl-sshow');
	var ocountt = gmGetElI("gl-scount");

	var h;

	if (onoff) {
		h = onoff;
	} else {
		h = parseFloat(gmGetAtI(styleC, "height"));
		//h = c.css("height");
	}

	if (h == h_on || h == parseFloat(hmin)) {
		// if container should be shown or currently is at min size
		//alert("will be maximize " + h);
		h = hmax;
		var cnt = gmGetAtI(ocountt, "value");
		if (!isNaN(cnt)) {
			h = hmaxauto;
		} else {
			h = hmin;
		}
	} else {
		//alert("will be mini" + h);
		h = hmin;
	}

	var btntext = bshow;
	if (h == hmin) {
		btntext = bshow;
	} else {
		btntext = bhide;
	}

	gmSetAtI(styleC, "height", h);
	gmSetAtI(styleC1, "height", h);
	//alert(h);

	gmSetCoI(bts, btntext);

	return false;
}

/**
 * Clears any filter text and searchs again.
 *
 * @param a -
 *            the search input containing the text-filter
 * @returns {Boolean} always false
 */
function lgmRemall(a) {

	var oa = gmGetElI(a);

	if (oa) {
		gmSetAtI(oa, "value", "");
		lgmFilterURL(oa);
		oa.focus();
	}
	return false;
}

/**
 * @param selElementA
 * @param selElementB
 * @returns {Boolean} always false
 */
function lgmSelectall(selElementA, selElementB) {
	var osel = null;

	var oa = gmGetElI(selElementA);
	var styleOA = gmGetStyle(oa);

	if (oa != null && gmGetAtI(styleOA, "visibility") == "visible") {
		osel = oa;
	} else {
		var ob = gmGetElI(selElementB);
		var styleOB = gmGetStyle(ob);

		if (ob != null && gmGetAtI(styleOB, "visibility") == "visible") {
			osel = ob;
		}
	}

	if (osel != null) {
		var bForce = false;
		if (gmIsClipboardSupported()) {
			bForce = true;
		}
		var selText = gmSelectText(osel, bForce);
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
 *
 * @param a -
 *            the search input containing the text-filter
 * @returns {Boolean} always false
 */
function lgmFilterURL(a) {
	var oa = gmGetElI(a);
	//var oa = $(a);

	if (oa) {
		var sea = gmGetAtI(oa, "value");
		lgmShowLinks(sea);
		lgmShow('gl-resultplain', 'gl-resultlink');
		lgmShowhide(h_on);
	}
	return false;
}

/**
 * Searchs for all URL in the page and optional filters by a regular expression.
 *
 * @returns {Boolean} always false
 */
function lgmShowLinks(sea) {
	var oresplaind = gmGetElI("gl-resultplain");
	var oreslinkd = gmGetElI("gl-resultlink");
	var ocountt = gmGetElI("gl-scount");

	// search for all matching links in the page
	var pagelinks = new Array();
	if (bTestMode) {
		pagelinks = gmGenTestEntries(sea);
	} else {
		var sMode = gmGetAtI("gl-sdesc", "value");
		pagelinks = gmFindLinksInPage(sea, sMode);
	}

	var linkstbl = new Array();
	var alllinks = new Array();

	//alert(pagelinks.length);
	pagelinks = gmSortArray(pagelinks, null);
	var tblrow = null;

	// now build the output
	for ( var i = 0; i < pagelinks.length; i++) {
		if (i % 50 == 0) {
			gmSetAtI(ocountt, i);
		}
		var curlink = pagelinks[i][0];
		var curcap = trim(pagelinks[i][1]);

		if (curcap != null) {
			curcap = curcap.replace(/[\n\r]/g, '');
			if (curcap.indexOf("<") >= 0) {
				curcap = curcap.replace(/<(?:.|\n)*?>/gm, '').replace(/\s{2,}/gm, ' ');
			}
		}
		if (curcap == null || curcap == "" || curcap == "#") {
			curcap = "n/a";
		}

		// row for plain text
		tblrow = gmCreateObj(null, "tr", null);
		var plainlink = gmCreateObj(tblrow, "td", null);

		gmSetAtI(plainlink, "title", curcap + "\n[" + curlink + "]");
		gmSetCoI(plainlink, curlink);

		linkstbl.push(tblrow);

		// row for htmllink
		var alink = gmCreateLink(null, scriptID + i, curlink, curcap, curcap, "_blank", null);
		gmSetAtI(alink, FL_TAG, FL_ID);

		alllinks.push(alink);
	}

	if (oresplaind) {
		gmEmptyObj(oresplaind);

		var tblPlain = gmCreateObj(oresplaind, "table", null);
		for ( var idxLinks = 0; idxLinks < linkstbl.length; idxLinks++) {
			gmAddObj(linkstbl[idxLinks], tblPlain);
		}
		gmCreateObj(oresplaind, "br", null);
	}

	if (oreslinkd) {
		gmEmptyObj(oreslinkd);
		alllinks.sort();

		for ( var idxLinks = 0; idxLinks < alllinks.length; idxLinks++) {
			gmAddObj(alllinks[idxLinks], oreslinkd);
			gmCreateObj(oreslinkd, "br", null);
		}

		gmCreateObj(oreslinkd, "br", null);
	}

	if (ocountt) {
		gmSetAtI(ocountt, "value", pagelinks.length);
	}

	return false;
}
=======
/**
 * Define the global variables used for this script.
 */
var scriptID = "GM-GL";

var contlinks;
var odiv;
var ores;
var o1;
var oform;
var initFilter;

var bshow = '\\/';
var bhide = '/\\';
var hmin = '25px';
var hmax = '99.5%';
var hmaxauto = 'auto';
var hmaxlh = 14;
var h_on = -1;
var h_off = -2;
var bDescA = "D";
var tDescA = "search in link & description";
var vDescA = "1";
var bDescD = "L";
var tDescD = "search in link ONLY";
var vDescD = "0";

/**
 * Add the DOM-Objects used in this script.
 */
function lgmAddControlsGrabLinks() {

	gmAddClipboardSupport();
	contlinks = gmCreateObj(null, "div", "gl-container");
	odiv = gmCreateObj(contlinks, "div", "gl-searchbox");
	oact = gmCreateObj(contlinks, "div", "gl-actionbox");
	ores = gmCreateObj(contlinks, "div", "gl-resultbox");
	oform = gmCreateObj(odiv, "form", "gl-searchform");

	initFilter = gmFoundFilter(currSite, currPath);
	var searchText_Desc = "enter your search\n" +
	 "Simple Wildcards = (?, *)\n" +
	 "Regular Expression = /searchtext/";
	gmCreateInput(oform, "text", "gl-searchtext", initFilter, searchText_Desc, null, null,
			function() {
				return gmSelectInput(this);
			});

	gmCreateButton(oform, "submit", "gl-sstart", "S", "start search", null, function() {
		return lgmFilterURL('gl-searchtext');
	});
	gmCreateButton(oform, "button", "gl-sreset", "R", "clear search", null, function() {
		return lgmRemall('gl-searchtext');
	});
	gmCreateButton(oform, "button", "gl-sshow", bshow, "show/hide result", null, function() {
		return lgmShowhide();
	});
	//var odiv = gmCreateObj(oform, "label", "gl-ldesc");
	gmCreateButton(oform, "button", "gl-sdesc", bDescA, tDescA, vDescA, function() {
		return lgmToggleSearchDesc('gl-sdesc');
	});
	gmCreateInput(oform, "text", "gl-scount", "", "number of hits", 1, null, null, null);

	var selCap = "SA";
	var selTit = "De-/Select All";
	if (gmIsClipboardSupported()) {
		selCap = "CA";
		selTit = "Select & Copy All";
	}
	gmCreateButton(oact, "button", "gl-aselect", selCap, selTit, null, function() {
		return lgmSelectall('gl-resultplain', 'gl-resultlink');
	});
	gmCreateButton(oact, "button", "gl-ashowplain", "PR", "Show Plain Results", null, function() {
		lgmShow('gl-resultplain', 'gl-resultlink');
	});
	gmCreateButton(oact, "button", "gl-ashowlink", "RL", "Show Results as Link", null, function() {
		lgmShow('gl-resultlink', 'gl-resultplain');
	});

	gmCreateObj(ores, "div", "gl-resultplain");
	gmCreateObj(ores, "div", "gl-resultlink");

	gmAddObj(contlinks, gmGetBody());
	lgmShowhide(h_off);
}

/**
 * Shows the layer in param f and hides the layer in param b.
 *
 * @param f -
 *            the layer to put in front
 * @param b -
 *            the layer to put in the bakc
 */
function lgmShow(f, b) {
	var obf = gmGetStyle(f);
	var obb = gmGetStyle(b);

	if (obf && obb) {

		var idxF = gmGetAtI(obf, "index");
		//var idxF = obf.zIndex;

		var idxB = gmGetAtI(obb, "index");
		//var idxB = obb.zIndex;
		if (!idxF || isNaN(idxF) || idxF == '') {
			idxF = 910;
		}
		if (!idxB || isNaN(idxB) || idxB == '') {
			idxB = idxF - 1;
		}
		if (idxF < idxB) {
			var i = idxF;
			idxF = idxB;
			idxB = i;
		}
		gmSetAtI(obf, "index", idxF);
		gmSetAtI(obf, "visibility", "visible");
		gmSetAtI(obf, "left", 0);
		gmSetAtI(obb, "index", idxB);
		gmSetAtI(obb, "visibility", "hidden");
		gmSetAtI(obf, "left", 2000);
	}
}

/**
 * Switch the search mode.
 *
 * @param button - the button to read the current state from
 */
function lgmToggleSearchDesc(button) {
	var oBut = gmGetElI(button);
	if (oBut){
		var curValue = gmGetAtI(oBut, "value");
		if (curValue == vDescD) {
			gmSetCoI(oBut, bDescA);
			gmSetAtI(oBut, "value", vDescA);
			gmSetAtI(oBut, "title", tDescA);
		} else {
			gmSetCoI(oBut, bDescD);
			gmSetAtI(oBut, "value", vDescD);
			gmSetAtI(oBut, "title", tDescD);
		}
	}
}

/**
 * Shows the complete layer with a default size or special size.
 *
 * @param onoff -
 *            a numeric height, on, off or null
 * @returns {Boolean} always false
 * @see #h_on
 * @see #h_off
 * @see #hmin
 * @see #hmax
 * @see #hmaxauto
 */
function lgmShowhide(onoff) {
	var c = gmGetElI('gl-container');
	var styleC = gmGetStyle(c);

	var c1 = gmGetElI('gl-resultbox');
	var styleC1 = gmGetStyle(c1);

	var bts = gmGetElI('gl-sshow');
	var ocountt = gmGetElI("gl-scount");

	var h;

	if (onoff) {
		h = onoff;
	} else {
		h = parseFloat(gmGetAtI(styleC, "height"));
		//h = c.css("height");
	}

	if (h == h_on || h == parseFloat(hmin)) {
		// if container should be shown or currently is at min size
		//alert("will be maximize " + h);
		h = hmax;
		var cnt = gmGetAtI(ocountt, "value");
		if (!isNaN(cnt)) {
			h = hmaxauto;
		} else {
			h = hmin;
		}
	} else {
		//alert("will be mini" + h);
		h = hmin;
	}

	var btntext = bshow;
	if (h == hmin) {
		btntext = bshow;
	} else {
		btntext = bhide;
	}

	gmSetAtI(styleC, "height", h);
	gmSetAtI(styleC1, "height", h);
	//alert(h);

	gmSetCoI(bts, btntext);

	return false;
}

/**
 * Clears any filter text and searchs again.
 *
 * @param a -
 *            the search input containing the text-filter
 * @returns {Boolean} always false
 */
function lgmRemall(a) {

	var oa = gmGetElI(a);

	if (oa) {
		gmSetAtI(oa, "value", "");
		lgmFilterURL(oa);
		oa.focus();
	}
	return false;
}

/**
 * @param selElementA
 * @param selElementB
 * @returns {Boolean} always false
 */
function lgmSelectall(selElementA, selElementB) {
	var osel = null;

	var oa = gmGetElI(selElementA);
	var styleOA = gmGetStyle(oa);

	if (oa != null && gmGetAtI(styleOA, "visibility") == "visible") {
		osel = oa;
	} else {
		var ob = gmGetElI(selElementB);
		var styleOB = gmGetStyle(ob);

		if (ob != null && gmGetAtI(styleOB, "visibility") == "visible") {
			osel = ob;
		}
	}

	if (osel != null) {
		var bForce = false;
		if (gmIsClipboardSupported()) {
			bForce = true;
		}
		var selText = gmSelectText(osel, bForce);
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
 *
 * @param a -
 *            the search input containing the text-filter
 * @returns {Boolean} always false
 */
function lgmFilterURL(a) {
	var oa = gmGetElI(a);
	//var oa = $(a);

	if (oa) {
		var sea = gmGetAtI(oa, "value");
		lgmShowLinks(sea);
		lgmShow('gl-resultplain', 'gl-resultlink');
		lgmShowhide(h_on);
	}
	return false;
}

/**
 * Searchs for all URL in the page and optional filters by a regular expression.
 *
 * @returns {Boolean} always false
 */
function lgmShowLinks(sea) {
	var oresplaind = gmGetElI("gl-resultplain");
	var oreslinkd = gmGetElI("gl-resultlink");
	var ocountt = gmGetElI("gl-scount");

	// search for all matching links in the page
	var pagelinks = new Array();
	if (bTestMode) {
		pagelinks = gmGenTestEntries(sea);
	} else {
		var sMode = gmGetAtI("gl-sdesc", "value");
		pagelinks = gmFindLinksInPage(sea, sMode);
	}

	var linkstbl = new Array();
	var alllinks = new Array();

	//alert(pagelinks.length);
	pagelinks = gmSortArray(pagelinks, null);
	var tblrow = null;

	// now build the output
	for ( var i = 0; i < pagelinks.length; i++) {
		if (i % 50 == 0) {
			gmSetAtI(ocountt, i);
		}
		var curlink = pagelinks[i][0];
		var curcap = trim(pagelinks[i][1]);

		if (curcap != null) {
			curcap = curcap.replace(/[\n\r]/g, '');
			if (curcap.indexOf("<") >= 0) {
				curcap = curcap.replace(/<(?:.|\n)*?>/gm, '').replace(/\s{2,}/gm, ' ');
			}
		}
		if (curcap == null || curcap == "" || curcap == "#") {
			curcap = "n/a";
		}

		// row for plain text
		tblrow = gmCreateObj(null, "tr", null);
		var plainlink = gmCreateObj(tblrow, "td", null);

		gmSetAtI(plainlink, "title", curcap + "\n[" + curlink + "]");
		gmSetCoI(plainlink, curlink);

		linkstbl.push(tblrow);

		// row for htmllink
		var alink = gmCreateLink(null, scriptID + i, curlink, curcap, curcap, "_blank", null);
		gmSetAtI(alink, FL_TAG, FL_ID);

		alllinks.push(alink);
	}

	if (oresplaind) {
		gmEmptyObj(oresplaind);

		var tblPlain = gmCreateObj(oresplaind, "table", null);
		for ( var idxLinks = 0; idxLinks < linkstbl.length; idxLinks++) {
			gmAddObj(linkstbl[idxLinks], tblPlain);
		}
		gmCreateObj(oresplaind, "br", null);
	}

	if (oreslinkd) {
		gmEmptyObj(oreslinkd);
		alllinks.sort();

		for ( var idxLinks = 0; idxLinks < alllinks.length; idxLinks++) {
			gmAddObj(alllinks[idxLinks], oreslinkd);
			gmCreateObj(oreslinkd, "br", null);
		}

		gmCreateObj(oreslinkd, "br", null);
	}

	if (ocountt) {
		gmSetAtI(ocountt, "value", pagelinks.length);
	}

	return false;
}
>>>>>>> branch 'master' of https://github.com/ollily/gm-scripting.git
