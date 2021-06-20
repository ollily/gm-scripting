// ---------------
// base-web.js - START
// ---------------
// noinspection JSUnusedGlobalSymbols

class PagelinksClazz {
    /**
     *
     * @param {string} link
     * @param {string|string[]} linkText
     */
    constructor(link, linkText) {
        this.link = link;
        if (!gmIsArray(linkText)) {
            this.linkText = [linkText];
        } else {
            this.linkText = linkText;
        }
    }
}

class KnowSiteClazz {
    /**
     * @param {string|RegExp} site
     */
    constructor(site) {
        this.site = site;
    }
}

class KnowSiteFilterClazz extends KnowSiteClazz {
    /**
     * @param {string|RegExp} site
     * @param {string} filter
     * @param {string|RegExp} path
     */
    constructor(site, filter, path) {
        super(site);
        this.filter = filter;
        this.path = path;
    }
}

class KnowSiteExtClazz extends KnowSiteClazz {
    /**
     * @param {string|RegExp} site
     * @param {string|RegExp} url
     * @param {string|RegExp} search
     * @param {string|RegExp} replace
     * @param {string|RegExp} replaceLarge
     * @param {number} withDownload
     */
    constructor(site, url, search, replace, replaceLarge, withDownload) {
        super(site);
        this.url = url;
        this.search = search;
        this.replace = replace;
        this.replace_large = replaceLarge;
        this.withDownload = withDownload;
    }
}

/**
 * List of all URLs which are known by this script.
 * @type {KnowSiteFilterClazz[]|KnowSiteExtClazz[]}
 */
let knownSite = [];

/**
 * Minimum width of the preview.
 * @type {number}
 */
const minWidth = 240;

/**
 * Maximum width of the preview.
 * @type {number}
 */
const maxWidth = 640;

/**
 * Adds an url which should be known for the search.
 *
 * @param {string} filter - a predefined searchtext for that url
 * @param {string|RegExp} site - the hostname as regular expression
 * @param {string|RegExp} path - a path as regular expression (optional)
 */
function gmAddSite(filter, site, path) {
    if (gmIsArray(knownSite)) {
        if (site && (site.length > 0)) {
            knownSite.push(new KnowSiteFilterClazz(
                site,
                (filter != null ? filter : ".+"),
                (path != null ? path : ""))
            );
            // const len = knownSite.length;
            // knownSite[len] = {};
            // knownSite[len].site = site;
            // knownSite[len].filter = (filter != null ? filter : ".+");
            // knownSite[len].path = (path != null ? path : "");
        }
    }
}

/**
 * Adds a config for a known site.
 *
 * @param {string|RegExp} site - a site pattern
 * @param {string|RegExp} urlElem - a pattern for the html-element to search in the page
 * @param {string|RegExp} urlSearch - a pattern to search inside the url of the html-element
 * @param {string|RegExp} urlReplace - a literal which will used for replacing the urlSearch
 * @param {string|RegExp} urlReplaceLarge - a literal which will used for replacing the urlSearch with a url for large images
 * @param {number} withDownload - 1=will add a download-link beneath the picture, else 0
 */
function gmAddSite2(site, urlElem, urlSearch, urlReplace, urlReplaceLarge, withDownload) {
    if (gmIsArray(knownSite)) {
        if (site && site.length > 0) {
            knownSite.push(new KnowSiteExtClazz(
                site,
                (urlElem != null ? urlElem : ".+"),
                (urlSearch != null ? urlSearch : ""),
                (urlReplace != null ? urlReplace : ""),
                (urlReplaceLarge != null ? urlReplaceLarge : ""),
                (withDownload != null ? withDownload : 0)
            ));
            // const len = knownSite.length;
            // knownSite[len] = {};
            // knownSite[len].site = site;
            // knownSite[len].url = (urlElem != null ? urlElem : ".+");
            // knownSite[len].search = (urlSearch != null ? urlSearch : "");
            // knownSite[len].replace = (urlReplace != null ? urlReplace : "");
            // knownSite[len].replace_large = (urlReplaceLarge != null ? urlReplaceLarge : "");
            // knownSite[len].withDownload = (withDownload != null ? withDownload : 0);
        }
    }
}

/**
 * Searchs in the list of known sites, if this site is found and returns the
 * predefined searchtext. If multiple sites will match, the LAST matching
 * filter will be returned.
 *
 * @param {string} site - the hostname of the site to search for
 * @param {string} path - the path of the site to search for (optional)
 * @returns {string} the predefined searchtext
 */
function gmFoundFilter(site, path) {
    let retFilter = "";
    if (gmIsArray(knownSite) && site) {
        if (!path) {
            path = "";
        }
        //for (let i = 0; i < knownSite.length; i++) {
        let init = 0;
        for (let currSite of knownSite) {
            //let currSite = knownSite[i];
            if (site.search(currSite.site) >= 0) {
                if (init === 0 && currSite.path === "") {
                    retFilter = currSite.filter;
                    init = 1;
                }
                let fIdx = path.search(currSite.path);
                if (path !== "" && (fIdx >= 0)) {
                    retFilter = currSite.filter;
                    break;
                } else if (path === "" && currSite.path === "") {
                    retFilter = currSite.filter;
                    break;
                }
            }
        }
    }
    return retFilter;
}

/**
 * Searchs in the list of known sites, if this site is found and returns the predefined searchtext. If multiple sites will match, the LAST matching site will be returned.
 *
 * @param {string} site - the hostname of the site to search for
 * @return {KnowSiteExtClazz} a found site configuration
 */
function gmFoundFilter2(site) {
    let retFilter = null;
    if (gmIsArray(knownSite) && site) {
        for (let currSite of knownSite) {
            if (site.search(currSite.site) >= 0) {
                retFilter = currSite;
            }
        }
        //for (let i = 0; i < knownSite.length; i++) {
        //  if (site.search(knownSite[i].site) >= 0) {
        // retFilter = knownSite[i];
        //}
    }
    return retFilter;
}

/** @type {string} */
const FL_TAG = "result-list";
/** @type {string} */
const FL_ID = "_FL";

/**
 *
 * @param {string|HTMLElement} curlink
 * @param {number} withDesc
 * @return {string[]}
 */
function gmPrepareLinkData(curlink, withDesc) {
    const linkData = [];
    linkData.push(gmGetAtI(curlink, "href"));
    if (withDesc !== 0) {
        linkData.push(gmGetAtI(curlink, "title"));
        linkData.push(gmGetAtI(curlink, "aria-label"));
        linkData.push(gmGetAtI(curlink, "alt"));
        linkData.push(gmGetAtI(curlink, "onmouseover"));
        linkData.push(gmGetAtI(curlink, "onclick"));
        linkData.push(curlink.innerHTML.replace("\\n", "").replace("#", ""));
    }
    return linkData;
}

/**
 *
 * @param {string|HTMLAnchorElement} curlink
 * @param {number} withDesc
 * @return {string[]}
 */
function gmPrepareLinkTextData(curlink, withDesc) {
    let linkTextData = [];
    try {
        const tmpTextData = [];
        tmpTextData.push(curlink.text);
        if (withDesc !== 0) {
            tmpTextData.push(gmGetAtI(curlink, "title"));
            tmpTextData.push(gmGetAtI(curlink, "alt"));
            tmpTextData.push(gmGetAtI(curlink, "aria-label"));
            tmpTextData.push(gmGetAtI(curlink, "onmouseover"));
            tmpTextData.push(gmGetAtI(curlink, "onclick"));
            tmpTextData.push(curlink.innerHTML);
            linkTextData = tmpTextData.map(function (value) {
                if (gmIsUndefined(value)) {
                    return "";
                } else if (gmIsObject(value)) {
                    return value.toString();
                } else if (gmIsInstanceOf(value, String)) {
                    return gmCleanText(value);
                } else {
                    return value;
                }
            });
        }
    } catch (ex) {
        alert(ex);
    }
    return linkTextData;
}

/**
 *
 * @param {string} searchPattern
 * @return {RegExp}
 */
function gmPrepareSearchRegExp(searchPattern) {
    if (!searchPattern || searchPattern.length <= 0) {
        searchPattern = ".*";
    } else if (searchPattern.charAt(0) === "/" && searchPattern.charAt(searchPattern.length - 1) === "/") {
        searchPattern = searchPattern.substring(1, searchPattern.length);
        searchPattern = searchPattern.substring(0, searchPattern.length - 1);
    } else {
        searchPattern = searchPattern.replace(/\?/g, ".").replace(/\./g, "\.").replace(/\*/g, ".*");
    }
    //alert(searchPattern);
    return new RegExp(searchPattern, "i");
}

/**
 * Search for all matching links in the page.
 *
 * @param {string} searchPattern - the search pattern or leave "" to get all
 * @param {number} withDesc      - 0 = search only in links,
 *                        1 = search also in link description
 * @returns {PagelinksClazz[]} an array with all found links
 */
function gmFindLinksInPage(searchPattern, withDesc) {
    let pagelinks = [];
    if (!withDesc) {
        withDesc = 0;
    }
    if (bTestMode) {
        pagelinks = gmGenTestEntries(40);
    } else {
        //searchPattern = gmPrepareSearchRegExp(searchPattern);
        //for (let linksIdx = 0; linksIdx < document.links.length; linksIdx++) {
        for (let curLink of document.links) {
            //let curLink = document.links[linksIdx];
            const found = gmLinkMatchesPattern(curLink, searchPattern, withDesc);
            if (found && gmGetAtI(curLink.id, FL_TAG) !== FL_ID) {
                let htmlLink = gmGetAtI(curLink, "href");
                let htmlText = gmLinkGenerateLinkText(curLink, withDesc);
                let bFound = false;
                for (let foundLinksIdx = 0; foundLinksIdx < pagelinks.length; foundLinksIdx++) {
                    let currPageLink = pagelinks[foundLinksIdx];
                    if (htmlLink === currPageLink.link) {
                        bFound = true;
                        currPageLink.linkText.push(htmlText);
                        pagelinks[foundLinksIdx].linkText = gmOnlyUnique(currPageLink.linkText);
                        //alert(pagelinks[foundLinksIdx].linkText);
                        break;
                    }
                }
                if (!bFound) {
                    pagelinks.push(new PagelinksClazz(htmlLink, htmlText));
                }
            }
        }
    }
    return pagelinks;
}

/**
 * <b>DON'T USE DIRECTLY</b>
 *
 * @param {string|Object} curLink
 * @param {string} searchPattern - a search text (might be a regular expression)
 * @param {number} withDesc
 * @returns {boolean} TRUE= the search text is found in the array, or FALSE
 */
function gmLinkMatchesPattern(curLink, searchPattern, withDesc) {
    let cleanSearchPattern = gmPrepareSearchRegExp(searchPattern);
    const arrText = gmPrepareLinkData(curLink, withDesc);
    let bFound = false;
    if (gmIsArray(arrText)) {
        for (let i = 0; i < arrText.length; i++) {
            const searchText = arrText[i];
            try {
                bFound = searchText.search(cleanSearchPattern) !== -1;
            } catch (e) {
                // ignored
            }
            if (bFound) {
                break;
            }
        }
    }
    return bFound;
}

/**
 * <b>DON'T USE DIRECTLY</b>
 *
 * @param {string|Object} curLink
 * @param {number} withDesc
 * @returns {string} the final link description
 */
function gmLinkGenerateLinkText(curLink, withDesc) {
    let arrText = gmPrepareLinkTextData(curLink, withDesc);
    let searchTextClean = [];
    let htmlText = "";
    if (gmIsArray(arrText)) {
        for (let idxST = 0; idxST < arrText.length; idxST++) {
            searchTextClean[idxST] = trim(gmCleanText(arrText[idxST]));
        }
        htmlText = gmOnlyUnique(searchTextClean).join("");
    }
    return htmlText;
}

/**
 * Adds a javascript block into the page.
 *
 * @param {Object|Function|Array|string} scc - a string, a function or an array with the javascript code or a function-list
 * @returns {boolean} TRUE = if the script block could be set, else FALSE
 */
function gmAddScriptGlobal(scc) {
    let isSet = false;
    if (gmIsObject(scc) || gmIsFunction(scc) || (scc && scc.length > 0)) {
        const head = gmGetHead();
        if (head) {
            const script = gmCreateObj(head, "script");
            script.type = "text/javascript";

            let allscc = "";
            if (gmIsArray(scc)) {
                for (let i = 0; i < scc.length; i++) {
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
 * @param {string|string[]} scLink - a string or an array with the url of the javascript-file
 * FIXME: Check
 */
function gmAddScriptLinkGlobal(scLink) {
    let isSet = false;
    const head = gmGetHead();
    if (head && scLink && scLink.length > 0) {
        let allScLink;
        if (gmIsArray(scLink)) {
            allScLink = scLink;
        } else {
            allScLink = [scLink];
        }

        for (let i = 0; i < allScLink.length; i++) {
            const newScript = gmCreateObj(head, "script");
            newScript.type = "text/javascript";
            newScript.src = allScLink[i];
        }
        isSet = true;
    }
    return isSet;
}

/**
 * Adds a style block into the page.
 *
 * @param {string|string[]} scc - a string or an array with the css code
 * @returns {boolean} TRUE = if the style block could be set, else FALSE
 */
function gmAddStyleGlobal(scc) {
    let isSet = false;
    if (gmIsObject(scc) || (scc && scc.length > 0)) {
        const head = gmGetHead();
        if (head) {
            const style = gmCreateObj(head, "style");
            style.type = "text/css";

            let allscc = "";
            if (gmIsArray(scc)) {
                for (let i = 0; i < scc.length; i++) {
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
 * @param {number} maxEntries - number of entries to generate
 * @returns {PagelinksClazz[]} array of entries
 */
function gmGenTestEntries(maxEntries) {
    if (isNaN(maxEntries)) {
        maxEntries = 1;
    }
    if (maxEntries < 0) {
        maxEntries = 0;
    } else if (maxEntries > 100) {
        maxEntries = 100;
    }
    let testArray = [];
    for (let i = 1; i <= maxEntries; i++) {
        let htmlLink = "https://" + currSite + currPath + "/link-" + i;
        let htmlText = "linktext-" + i;
        testArray.push(new PagelinksClazz(htmlLink, htmlText));
    }
    return testArray;
}

/**
 * Calculate the offset of an element relating to the elemnt at the most top.
 *
 * @param {Object|HTMLInputElement} element - the element to check the offeset
 * @returns {number[]} an array with the leftOffset, topOffset
 *          FIXME:TEST
 */
function gmCumulativeOffset(element) {
    let valueT = 0;
    let valueL = 0;
    if (element) {
        valueL = element.width || 0;
        do {
            valueT += element.offsetTop || 0;
            valueL += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);
    }
    return [valueL, valueT];
}

/**
 * Calculates the horizontal offset to the right in relation to it's parent element.
 *
 * @param {Object} parentElem - the element to calculate the offset from
 * @param {Array} iPoint - a screen point, to add an additional offset
 * @param {number} iZoom  - the zoom factor 1= Originalsize
 * @returns {number} the horizontal offset or 0 FIXME:Test
 */
function gmCalcOffsetH(parentElem, iPoint, iZoom) {
    if (isNaN(iZoom)) {
        iZoom = 1;
    }
    let offsetH = 0;
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
 * @param {string} searchForPattern - the pattern to search for
 * @param {string} replaceWithText  - the text what will be inserted instead
 * @param {string} oldUrl           - the URL to search in
 * @returns {string} the url with replaced text
 */
function gmGetReplaceUrl(searchForPattern, replaceWithText, oldUrl) {
    let newUrl = oldUrl;
    if (oldUrl != null) {
        if (searchForPattern !== "") {
            // there is something to replace
            if (replaceWithText == null) {
                replaceWithText = "";
            }
            const patternReplace = new RegExp(searchForPattern);
            newUrl = oldUrl.replace(patternReplace, replaceWithText);
        }
    }
    return newUrl;
}

/**
 * Returns the actual server of the running page.
 *
 * @returns {string} a server name
 */
function gmGetCurrentSite() {
    let currSite = document.location.host;
    if (document.location.port) {
        currSite += ":" + document.location.port;
    }
    return currSite;
}

/**
 * Determine the metrics of that image.
 *
 * @param {Object} newImage - the image to inspect
 * @returns {number[]} the image metrics [width, height] in px
 */
function gmGetImageSize(newImage) {
    let imageObjectWidth = 0;
    let imageObjectHeight = 0;

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
    return [imageObjectWidth, imageObjectHeight];
}

/**
 * Add a default style to a div-element.
 *
 * @param {Object} hDiv - the div-element
 * @param {number[]} iPoint - metrics of the image [width, height] in px
 * @param {number} offsetW - an offset (number) for the width (optional), default is 5px
 * @param {number} offsetH - an offset (number) for the height (optional), default is 5px
 * @param {number} ratio - the aspect ratio of the image, only is used, if we have no image height
 * @param {number} iZoom -
 * @returns {boolean} TRUE = the layout could be added, else FALSE
 */
function gmSetDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom) {
    let w = "auto";
    let h = "auto";
    let oH = "5px";
    let oW = "5px";

    let isSet = false;
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
        // noinspection JSCheckFunctionSignatures
        if (!isNaN(w)) {
            w *= iZoom;
            w = w + "px";
        }
        // noinspection JSCheckFunctionSignatures
        if (!isNaN(h)) {
            h *= iZoom;
            h = h + "px";
        }
        let css = gmGetAtI(hDiv, "style");
        if (css === false) {
            css = "";
        }
        css += ";width:" + w + ";height:" + h + ";top:" + oH + ";left:" + oW;
        gmSetAtI(hDiv, "style", css);
        isSet = true;
    }

    return isSet;
}

/**
 * Add a default style to an img-element.
 *
 * @param {Object} hDiv - the div-element
 * @param {Object} hImg - the img-element
 * @param {number[]} iPoint - metrics of the image [width, height] in px
 * @param {number} iZoom - the zoom factor (1 = Originalsize)
 * @returns {boolean} TRUE = the layout could be added, else FALSE
 */
function gmSetImgLayout(hDiv, hImg, iPoint, iZoom) {
    let h = "auto";
    let w = "auto";

    let isSet = false;
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
                    let ratio = gmToNo(hImg.style.width) / gmToNo(hImg.style.height);
                    h = (gmToNo(hDiv.style.width) / ratio);// + picTextHeight;
                }
            } else {
                h = iPoint[1]; // + picTextHeight;
            }
        }
        // noinspection JSCheckFunctionSignatures
        if (!isNaN(w)) {
            w *= iZoom;
            w = w + "px";
        }
        // noinspection JSCheckFunctionSignatures
        if (!isNaN(h)) {
            h *= iZoom;
            h = h + "px";
        }
        let css = gmGetAtI(hDiv, "style");
        if (css === false) {
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
 * @param {string|Object} obj - the object from which to get the css-style
 * @returns {Object} the css-style-object from that object
 */
function gmGetStyle(obj) {
    let res = null;
    const oObj = gmGetElI(obj);
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
 * @returns {number} height of the document body
 */
function gmGetBodyHeight() {
    let D = gmGetBody();
    let Dh = 0;
    let Eh = 0;
    if (D) {
        // noinspection JSCheckFunctionSignatures
        Dh = Math.max(isNaN(D.style.height) ? 0 : D.style.height, D.scrollHeight, D.offsetHeight, D.clientHeight);
    }
    if (D.documentElement) {
        D = D.documentElement;
        // noinspection JSCheckFunctionSignatures
        Eh = Math.max(isNaN(D.style.height) ? 0 : D.style.height, D.scrollHeight, D.offsetHeight, D.clientHeight);
    }
    return Math.max(Dh, Eh);
}

/**
 *
 * @param {string} url
 * @return {boolean}
 */
function gmOpenInTab(url) {
    if (url) {
        window.open(url, "_blank");
    }
    return true;
}

// ---------------
// base-web.js - END
// ---------------
