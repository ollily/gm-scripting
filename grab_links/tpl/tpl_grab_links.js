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
