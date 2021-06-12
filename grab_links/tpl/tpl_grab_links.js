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
        return lgmFilterURL('gl-searchtext');
    });
    gmCreateButton(glFormTag, "button", "gl-sreset", "R", "clear search", null, function() {
        return lgmRemall('gl-searchtext');
    });
    gmCreateButton(glFormTag, "button", "gl-sshow", glBtnShowResultText, glBtnShowResultTextDesc, null, function() {
        return lgmShowhide();
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
        lgmShow('gl-resultplain', 'gl-resultlink');
    });
    gmCreateButton(glActionDiv, "button", "gl-ashowlink", "RL", "Show Results as Link", null, function() {
        lgmShow('gl-resultlink', 'gl-resultplain');
    });
    gmCreateButton(glActionDiv, "button", "gl-awide", "W", descWidthWide, null, function() {
        lgmToggleContainer('gl-container', 'gl-resultbox', 'gl-resultplain', 'gl-resultlink', 'gl-awide');
    });
    // result fields
    gmCreateObj(glResultDiv, "div", "gl-resultplain");
    gmCreateObj(glResultDiv, "div", "gl-resultlink");
    // init
    gmAddObj(glContainer, gmGetBody());
    lgmShowhide(RESULT_HIDE);
    //alert(glFormTag.outerHTML);
}

/**
 * Shows the layer in param frontLayer and hides the layer in param behindLayer.
 * @param frontLayer  - the layer to put in front
 * @param behindLayer - the layer to put in the bakc
 */
function lgmShow(frontLayer, behindLayer) {
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
function lgmShowhide(bOnOff) {
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
function lgmRemall(searchField) {
    var oSearchField = gmGetElI(searchField);
    if (oSearchField) {
        gmSetAtI(oSearchField, "value", "");
        lgmFilterURL(oSearchField);
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
function lgmFilterURL(searchField) {
    var oSearchField = gmGetElI(searchField);
    if (oSearchField) {
        var searchText = gmGetAtI(oSearchField, "value");
        lgmShowLinks(searchText);
        lgmShow('gl-resultplain', 'gl-resultlink');
        lgmShowhide(RESULT_SHOW);
    }
    return false;
}

/**
 * Searchs for all URL in the page and optional filters by a regular expression.
 * @returns {Boolean} always false
 */
function lgmShowLinks(searchText) {
    try {
        var oResultPlainDiv = gmGetElI("gl-resultplain");
        var oResultLinkDiv = gmGetElI("gl-resultlink");
        var oResultCount = gmGetElI("gl-scount");
        // search for all matching links in the page
        var arrFoundInPage = lgmShowLinksCreateSearchLinks(searchText);
        var arrLinksPlain = new Array();
        var arrLinksLink = new Array();
        //alert(arrFoundInPage.length);
        arrFoundInPage = gmSortArray(arrFoundInPage, null);
        // now build the output
        for ( var i = 0; i < arrFoundInPage.length; i++) {
            if (i % 10 == 0) {
                gmSetAtI(oResultCount, i);
            }
            var currLink = arrFoundInPage[i][0];
            var currCaption = lgmShowLinksCreateCleanCaption(arrFoundInPage[i][1]);
            // row for plain text
            var curPId = scriptID + "P" + i;
            lgmShowLinksCreatePlainRow(arrLinksPlain, currLink, currCaption,curPId);
            // row for htmllink
            var curLId = scriptID + "L" + i;
            lgmShowLinksCreateLinkRow(arrLinksLink, currLink, currCaption, curLId);
        }
        if (oResultPlainDiv) {
            lgmShowLinksAddPlain(oResultPlainDiv, arrLinksPlain);
            gmCreateObj(oResultPlainDiv, "br", null);
        }
        if (oResultLinkDiv) {
            arrLinksLink.sort();
            lgmShowLinksAddPlain(oResultLinkDiv, arrLinksLink);
            gmCreateObj(oResultLinkDiv, "br", null);
        }
        if (oResultCount) {
            gmSetAtI(oResultCount, "value", arrFoundInPage.length);
        }
    } catch (ex) {
        alert(ex);
    }
    return false;
}

function lgmShowLinksCreateSearchLinks(searchText) {
    // search for all matching links in the page
    var arrFoundInPage = new Array();
    if (bTestMode) {
        arrFoundInPage = gmGenTestEntries(40);
    } else {
        var sMode = gmGetAtI("gl-sdesc", "value");
        arrFoundInPage = gmFindLinksInPage(searchText, sMode);
    }
    return arrFoundInPage;
}

function lgmShowLinksCreateCleanCaption(currCaption) {
    currCaption = trim(currCaption);
    if (currCaption != null) {
        currCaption = currCaption.replace(/[\n\r]/g, '');
        if (currCaption.indexOf("<") >= 0) {
            currCaption = currCaption.replace(/<(?:.|\n)*?>/gm, '').replace(/\s{2,}/gm, ' ');
        }
    }
    if (currCaption == null || currCaption == "" || currCaption == "#") {
        currCaption = "n/a";
    }
    return currCaption;
}

function lgmShowLinksCreateTblRow(arrLinksPlain, currLink, currCaption) {
    // row for table text
    var tblrow = gmCreateObj(null, "tr", null);
    var plainlink = gmCreateObj(tblrow, "td", null);
    gmSetAtI(plainlink, "title", currCaption + "\n[" + currLink + "]");
    gmSetCoI(plainlink, currLink);
    arrLinksPlain.push(tblrow);
}

function lgmShowLinksCreatePlainRow(arrLinksPlain, currLink, currCaption, curId) {
    // row for plain text
    var plainlink = gmCreateObj(null, "span", curId);
    gmSetAtI(plainlink, "title", currCaption + "\n[" + currLink + "]");
    gmSetCoI(plainlink, currLink);
    arrLinksPlain.push(plainlink);
}

function lgmShowLinksCreateLinkRow(arrLinksLink, currLink, currCaption, curId) {
    // row for htmllink
    var alink = gmCreateLink(null, curId, currLink, currCaption, currCaption, "_blank", null);
    gmSetAtI(alink, FL_TAG, FL_ID);
    arrLinksLink.push(alink);
}

function lgmShowLinksAddPTable(oResultPlainDiv, arrLinksPlain) {
    gmEmptyObj(oResultPlainDiv);
    var tblPlain = gmCreateObj(oResultPlainDiv, "table", null);
    for ( var idxLinks = 0; idxLinks < arrLinksPlain.length; idxLinks++) {
        gmAddObj(arrLinksPlain[idxLinks], tblPlain);
    }
}

function lgmShowLinksAddPlain(oResultLinkDiv, arrLinksLink) {
    gmEmptyObj(oResultLinkDiv);
    for ( var idxLinks = 0; idxLinks < arrLinksLink.length; idxLinks++) {
        gmAddObj(arrLinksLink[idxLinks], oResultLinkDiv);
        gmCreateObj(oResultLinkDiv, "br", null);
    }
}
