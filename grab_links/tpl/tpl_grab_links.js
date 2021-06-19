/**
 * Define the global variables used for this script.
 */
const scriptID = "GM-GL";

let glContainer;
let glSearchDiv;
let glResultDiv;
let glActionDiv;
let glFormTag;
let initFilter;

const glBtnShowResultText = "SR";
const glBtnShowResultTextDesc = "show result";
const glBtnHideResultText = "HR";
const glBtnHideResultTextDesc = "hide result";

const glContainerHeightMin = "20px";
const glContainerHeightMax = "99%";
const glContainerHeightMaxAuto = "auto";
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
const resWidthWide = "100%";
const resWidthSmall = "225px";
const divWidthWide = "99%";
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
    gmCreateInput(glFormTag, "text", "gl-searchtext", initFilter, searchText_Desc, null, null, function () {
        return gmSelectInput(this);
    });
    gmCreateButton(glFormTag, "submit", "gl-sstart", "S", "start search", null, function () {
        return lgmSearchLinks("gl-searchtext", "gl-sdesc");
    });
    gmCreateButton(glFormTag, "button", "gl-sreset", "R", "clear search", null, function () {
        return lgmResetSearch("gl-searchtext");
    });
    gmCreateButton(glFormTag, "button", "gl-sshow", glBtnShowResultText, glBtnShowResultTextDesc, null, function () {
        return lgmShowHideResult();
    });
    gmCreateButton(glFormTag, "button", "gl-sdesc", glBtnSearchModeAText, glBtnSearchModeADesc, glBtnSearchModeAValue, function () {
        return lgmToggleSearchDesc("gl-sdesc");
    });
    gmCreateInput(glFormTag, "text", "gl-scount", "", "number of hits", 1, null, null, null);
    // copy fields
    let selCap = "SA";
    let selTit = "De-/Select All";
    if (gmIsClipboardSupported()) {
        selCap = "CA";
        selTit = "Select & Copy All";
    }
    gmCreateButton(glActionDiv, "button", "gl-aselect", selCap, selTit, null, function () {
        return lgmSelectall("gl-resultplain", "gl-resultlink");
    });
    gmCreateButton(glActionDiv, "button", "gl-ashowplain", "PR", "Show Plain Results", null, function () {
        lgmSwitchResultDisplay("gl-resultplain", "gl-resultlink");
    });
    gmCreateButton(glActionDiv, "button", "gl-ashowlink", "RL", "Show Results as Link", null, function () {
        lgmSwitchResultDisplay("gl-resultlink", "gl-resultplain");
    });
    gmCreateButton(glActionDiv, "button", "gl-awide", "W", descWidthWide, null, function () {
        lgmToggleContainer("gl-container", "gl-resultbox", "gl-resultplain", "gl-resultlink", "gl-awide");
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
 *
 * @param {string|Object} frontLayer  the layer to put in front
 * @param {string|Object} behindLayer the layer to put in the bakc
 */
function lgmSwitchResultDisplay(frontLayer, behindLayer) {
    const oFrontLayer = gmGetStyle(frontLayer);
    const oBehindLayer = gmGetStyle(behindLayer);
    if (oFrontLayer && oBehindLayer) {
        let idxFront = gmGetAtI(oFrontLayer, "index");
        let idxBehind = gmGetAtI(oBehindLayer, "index");

        if (!idxFront || isNaN(idxFront) || idxFront === "") {
            idxFront = 910;
        }
        if (!idxBehind || isNaN(idxBehind) || idxBehind === "") {
            idxBehind = idxFront - 1;
        }
        if (idxFront < idxBehind) {
            const i = idxFront;
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
 *
 * @param {string|Object} btnSearch - the button to read the current state from
 */
function lgmToggleSearchDesc(btnSearch) {
    const oBtnSearch = gmGetElI(btnSearch);
    if (oBtnSearch) {
        const curValue = gmGetAtI(oBtnSearch, "value");
        if (curValue === glBtnSearchModeLValue) {
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

/**
 *
 * @param {string|Object} contDiv
 * @param {string|Object} resultDiv
 * @param {string|Object} resultPlainDiv
 * @param {string|Object} resultLinkDiv
 * @param {string|Object} btnAction
 */
function lgmToggleContainer(contDiv, resultDiv, resultPlainDiv, resultLinkDiv, btnAction) {
    const oContDiv = gmGetElI(contDiv);
    const oResultDiv = gmGetElI(resultDiv);
    const oBtnAction = gmGetElI(btnAction);
    if (oContDiv && oResultDiv) {
        const oContDivStyle = gmGetStyle(oContDiv);
        const oResultDivStyle = gmGetStyle(oResultDiv);
        const oResultPlainDivStyle = gmGetStyle(resultPlainDiv);
        const oResultLinkDivStyle = gmGetStyle(resultLinkDiv);
        let newContWidth = contWidthWide;
        let newResultWidth = resWidthWide;
        let newResultDivWidth = divWidthWide;
        let newDescWidth = descWidthSmall;
        let newBtnActionText = "S";
        const curValue = gmGetAtI(oContDivStyle, "width");
        if (curValue === contWidthWide) {
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
 *
 * @param {boolean|number} [bOnOff=] bOnOff - a numeric height, on, off or null
 * @returns {boolean} always false
 *
 * @see #RESULT_HIDE
 * @see #RESULT_HIDE
 * @see #glContainerHeightMin
 * @see #glContainerHeightMax
 * @see #glContainerHeightMaxAuto
 */
function lgmShowHideResult(bOnOff) {
    const oCont = gmGetElI("gl-container");
    const oContStyle = gmGetStyle(oCont);
    const oCont1 = gmGetElI("gl-resultbox");
    const oContStyle1 = gmGetStyle(oCont1);
    const oBtnShow = gmGetElI("gl-sshow");
    const oSearchCount = gmGetElI("gl-scount");
    let currHeight;
    if (bOnOff) {
        currHeight = bOnOff;
    } else {
        currHeight = parseFloat(gmGetAtI(oContStyle, "height"));
    }
    if (currHeight === RESULT_SHOW || currHeight === parseFloat(glContainerHeightMin)) {
        // if container should be shown or currently is at min size
        currHeight = glContainerHeightMax;
        const searchCnt = gmGetAtI(oSearchCount, "value");
        //alert(searchCnt);
        if (isNaN(searchCnt)) {
            currHeight = glContainerHeightMaxAuto;
            //} else {
            //    currHeight = glContainerHeightMin;
        }
    } else {
        currHeight = glContainerHeightMin;
    }
    let buttonText = glBtnShowResultText;
    let buttonTextDesc = glBtnShowResultTextDesc;
    if (currHeight !== glContainerHeightMin) {
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
 *
 * @param {string|Object} searchField - the search input containing the text-filter
 * @returns {boolean} always false
 */
function lgmResetSearch(searchField) {
    const oSearchField = gmGetElI(searchField);
    if (oSearchField) {
        gmSetAtI(oSearchField, "value", "");
        lgmSearchLinks(oSearchField);
        oSearchField.focus();
    }
    return false;
}

/**
 * Selects the content of element A or B.
 *
 * @param {string|Object} selElementA - the first container element
 * @param {string|Object} selElementB - the second container element
 * @returns {boolean} always false
 */
function lgmSelectall(selElementA, selElementB) {
    let selectedElem = null;
    const oSelElemA = gmGetElI(selElementA);
    const oSelElemAStyle = gmGetStyle(oSelElemA);
    if (oSelElemA != null && gmGetAtI(oSelElemAStyle, "visibility") === "visible") {
        selectedElem = oSelElemA;
    } else {
        const oSelElemB = gmGetElI(selElementB);
        const oSelElemBStyle = gmGetStyle(oSelElemB);
        if (oSelElemB != null && gmGetAtI(oSelElemBStyle, "visibility") === "visible") {
            selectedElem = oSelElemB;
        }
    }
    if (selectedElem != null) {
        let bForce = false;
        if (gmIsClipboardSupported()) {
            bForce = true;
        }
        const selText = gmSelectText(selectedElem, bForce);
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
 * @param {string|Object} searchFieldAttr - the search input containing the text-filter
 * @param {string|Object} [searchModeAttr=] searchModeAttr - the searchMode input
 * @returns {boolean} always false
 */
function lgmSearchLinks(searchFieldAttr, searchModeAttr) {
    try {
        const searchText = gmGetAtI(searchFieldAttr, "value");
        const searchMode = gmGetAtI(searchModeAttr, "value");
        const arrFoundInPage = gmFindLinksInPage(searchText, searchMode);
        lgmLinksInResult(arrFoundInPage);
        lgmSwitchResultDisplay("gl-resultplain", "gl-resultlink");
        lgmShowHideResult(RESULT_SHOW);
    } catch (ex) {
        alert(ex);
    }
    return false;
}

/**
 * Searchs for all URL in the page and optional filters by a regular expression.
 *
 * @param {Object[]} arrLinks - array with found links
 * @returns {boolean} always false
 */
function lgmLinksInResult(arrLinks) {
    const arrLinksPlain = [];
    let arrLinksLink = [];
    try {
        const oResultPlainDiv = gmGetElI("gl-resultplain");
        const oResultLinkDiv = gmGetElI("gl-resultlink");
        const oResultCount = gmGetElI("gl-scount");
        const arrFoundInPage = gmSortArray(arrLinks);
        for (let i = 0; i < arrFoundInPage.length; i++) {
            const currLink = arrFoundInPage[i][0];
            const currCaption = lgmCleanArrayCaption(arrFoundInPage[i][1]);
            //alert(currCaption);
            arrLinksPlain.push(lgmPrepareLinkAsPlain(currLink, currCaption, i));
            arrLinksLink.push(lgmPrepareLinkAsLink(currLink, currCaption, i));
            // lgmPrepareLinkAsPlain(arrLinksPlain, currLink, currCaption, i);
            // lgmPrepareLinkAsLink(arrLinksLink, currLink, currCaption, i);
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

/**
 * Removes unallowed chars from a text.
 *
 * @param {string} dirtyCaption - a text with unallowed chars
 * @returns {string} the cleaned text
 */
function lgmCleanCaption(dirtyCaption) {
    dirtyCaption = trim(dirtyCaption);
    if (dirtyCaption != null) {
        dirtyCaption = dirtyCaption.replace(/[\n\r]/g, "");
        if (dirtyCaption.indexOf("<") >= 0) {
            dirtyCaption = dirtyCaption.replace(/<(?:.|\n)*?>/gm, "").replace(/\s{2,}/gm, " ");
        }
    }
    return dirtyCaption;
}

/**
 * Removes unallowed chars from an array or a single text.
 *
 * @param {string|string[]} arrCaption - an array or a text with unallowed chars
 * @returns {string} the cleaned array or text
 */
function lgmCleanArrayCaption(arrCaption) {
    let cleanCaption;
    if (gmIsArray(arrCaption)) {
        let arrCleanCaption = [];
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

/**
 * Creates a span element containing an url as plain text.
 *
 * @param {string} currLink    - the url
 * @param {string} currCaption - the text for the url
 * @param {number} curId       - the id for the span
 * @returns {Object} the newly span element
 */
function lgmPrepareLinkAsPlain(currLink, currCaption, curId) {
    // row for plain text
    const curPId = scriptID + "P" + curId;
    let plainLink = gmCreateObj(null, "span", curPId);
    gmSetAtI(plainLink, "data-href", currLink);
    plainLink = gmCreateObjCommon(plainLink, currLink, currCaption, null,
        function () {
            lgmSelectEntry(this);
            return false;
        },
        null, null, null,
        function () {
            gmOpenInTab(this["data-href"]);
            return true;
        }
    );
    return plainLink;
}

/**
 * Creates a a element containing an url as plain text.
 *
 * @param {string} currLink    - the url
 * @param {string} currCaption - the text for the url
 * @param {number} curId       - the id for the span
 * @return {Object} the newly a element
 */
function lgmPrepareLinkAsLink(currLink, currCaption, curId) {
    // row for htmllink
    const curLId = scriptID + "L" + curId;
    const plainCaption = "[" + currLink + "]";
    const alink = gmCreateLink(null, curLId, currLink, currCaption, plainCaption, "_blank",
        function () {
            lgmSelectEntry(this);
            return false;
        },
        function () {
            gmOpenInTab(this["href"]);
            return true;
        }
    );
    gmSetAtI(alink, "data-title", currCaption);
    gmSetAtI(alink, FL_TAG, FL_ID);
    return alink;
}

/**
 * Fills the container element with the result object.
 *
 * @param {string|Object} oResultLinkDiv - the container element
 * @param {Object[]} arrLinksLink - array with the result objects
 */
function lgmPrepareLinksInContainer(oResultLinkDiv, arrLinksLink) {
    gmEmptyObj(oResultLinkDiv);
    for (let idxLinks = 0; idxLinks < arrLinksLink.length; idxLinks++) {
        gmAddObj(arrLinksLink[idxLinks], oResultLinkDiv);
        gmCreateObj(oResultLinkDiv, "br", null);
    }
}

/**
 * Select a result entry.
 *
 * @param {Object} oEntry - a page element
 */
function lgmSelectEntry(oEntry) {
    try {
        gmSelectText(oEntry, false);
    } catch (ex) {
        alert(ex);
    }
}
