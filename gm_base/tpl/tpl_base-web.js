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

var FL_TAG = "result-list";
var FL_ID = "_FL";

function gmPrepareLinkData(curlink, withDesc) {
    var linkData = [];
    linkData.push(gmGetAtI(curlink, "href"));
    if (withDesc != 0) {
        linkData.push(gmGetAtI(curlink, "title"));
        linkData.push(gmGetAtI(curlink, "aria-label"));
        linkData.push(gmGetAtI(curlink, "alt"));
        linkData.push(gmGetAtI(curlink, "onmouseover"));
        linkData.push(gmGetAtI(curlink, "onclick"));
        linkData.push(curlink.innerHTML.replace("\\n", "").replace("#", ""));
    }
    return linkData;
}

function gmPrepareLinkTextData(curlink, withDesc) {
    var linkTextData = [];
    try {
        var tmpTextData = [];
        tmpTextData.push(curlink.text);
        if (withDesc != 0) {
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

function gmPrepareSearchRegExp(searchPattern) {
    if (!searchPattern || searchPattern.length <= 0) {
        searchPattern = ".*";
    } else if (searchPattern.charAt(0) == "/" && searchPattern.charAt(searchPattern.length - 1) == "/") {
        searchPattern = searchPattern.substring(1, searchPattern.length);
        searchPattern = searchPattern.substring(0, searchPattern.length -1);
    } else {
        searchPattern = searchPattern.replace(/\?/g, ".").replace(/\./g, "\.").replace(/\*/g, ".*");
    }
    //alert(searchPattern);
    searchPattern = new RegExp(searchPattern, "i");
    return searchPattern;
}


/**
 * Search for all matching links in the page.
 *
 * @param searchPattern - the search pattern or leave "" to get all
 * @param withDesc      - 0 = search only in links,
 *                        1 = search also in link description
 * @returns {Array} an array with all found links
 */
function gmFindLinksInPage(searchPattern, withDesc) {
    var pagelinks = [];
    if (withDesc == null) {
        withDesc = 0;
    }
    if (bTestMode) {
        pagelinks = gmGenTestEntries(40);
    } else {
        searchPattern = gmPrepareSearchRegExp(searchPattern);
        for (var i=0; i < document.links.length; i++) {
            var curlink = document.links[i];
            var ne = -1;
            var searchParamLink = gmPrepareLinkData(curlink, withDesc);
            var found = gmLinkMatchesPattern(searchParamLink, searchPattern);
            if (found) {
                if (gmGetAtI(curlink.id, FL_TAG) != FL_ID) {
                    var htmllink = gmGetAtI(curlink, "href");
                    var searchParamText = gmPrepareLinkTextData(curlink, withDesc);
                    var htmltext = gmLinkGenerateLinkText(searchParamText);
                    for (var j=0; j < pagelinks.length; j++) {
                        if (htmllink == pagelinks[j][0]) {
                            ne = j;
                            break;
                        }
                    }
                    if (ne > -1) {
                        pagelinks[ne][1].push(htmltext);
                        pagelinks[ne][1] = gmOnlyUnique(pagelinks[ne][1]);
                        //alert(pagelinks[ne][1]);
                    } else {
                        var curlink = [htmllink, [htmltext]];
                        pagelinks.push(curlink);
                    }
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
 * @param searchPattern - a search text (might be a regular expression)
 * @returns {Boolean} TRUE= the search text is found in the array, or FALSE
 */
function gmLinkMatchesPattern(arrText, searchPattern) {
    var found = false;
    if (gmIsArray(arrText)) {
        for (var i=0; i < arrText.length; i++) {
            var searchText = arrText[i];
            try {
                found = searchText.search(searchPattern) != -1;
            } catch (e) {
                // ignored
            }
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
function gmLinkGenerateLinkText(arrText) {
    var searchTextClean = [];
    var htmlText = "";
    if (gmIsArray(arrText)) {
        for (var idxST = 0; idxST < arrText.length; idxST++) {
            arrText[idxST] = trim(gmCleanText(arrText[idxST]));
        }
        htmlText = gmOnlyUnique(arrText).join("");
    }
    return htmlText;
}

/**
 * Adds a javascript block into the page.
 *
 * @param scc - a string, a function or an array with the javascript code or a function-list
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
 * @param scLink - a string or an array with the url of the javascript-file
 * FIXME: Check
 */
function gmAddScriptLinkGlobal(scLink) {
    var isSet = false;
    var head = gmGetHead();
    if (head && scLink && scLink.length > 0) {
        var allScLink = [];
        if (gmIsArray(scLink)) {
            allScLink = scLink;
        } else {
            allScLink = [scLink];
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
 * @param scc - a string or an array with the css code
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
 * @param maxEntries - number of entries to generate
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
    testArray = [];
    for ( var i = 1; i <= maxEntries; i++) {
        var curlink = "http://" + currSite + currPath + "/link-" + i;
        var htmllink = curlink;
        var htmltext = "linktext-" + i;
        var curlink = [htmllink, htmltext];
        testArray.push(curlink);
    }
    return testArray;
}

/**
 * Calculate the offset of an element relating to the elemnt at the most top.
 *
 * @param element - the element to check the offeset
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
 * @param iPoint - a screen point, to add an additional offset
 * @param iZoom  - the zoom factor 1= Originalsize
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
 * @param searchForPattern - the pattern to search for
 * @param replaceWithText  - the text what will be inserted instead
 * @param oldUrl           - the URL to search in
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

function gmOpenInTab(url) {
    if (url) {
        window.open(url,"_blank");
    }
    return true;
}
// ---------------
// base-web.js - END
// ---------------
