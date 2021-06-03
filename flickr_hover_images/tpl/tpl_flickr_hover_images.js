/* -------------------------------- */
/**
 * Switch for debug-mode
 */
var gm_debug = false;
/**
 * List of all File which can be replaced, according to the same index of knownSite.
 */
var knownRepl = new Array();
/**
 * The pattern to search for filename inside the page.
 */
var img2Search = "";
/**
 * The pattern to search for a text inside a file name.
 */
var elemSearchUrl = "";
/**
 * The plain text with which the pattern (inside a file name) will be replaced.
 */
var elemReplUrl = "";
/**
 * The plain text with which the pattern (inside a file name) will be replaced for a large image.
 */
var elemReplUrlLarge = "";
/**
 * Will add a download-link beneath the picture.
 */
var elemWithDownLink = 0;

/**
 * value for correcting the preview position to the left (negative) or to the right (positive).
 */
var offSetLeftFix = -2;
/**
 * Font Size of the text in the description box.
 */
var picTextFontSize = 8;
/**
 * Height of the text description box. Should be 2 larger than font-size.
 */
var picTextHeight = 14;
/**
 * Current loop wait for loading the preview.
 */
var loopIdx = 0;
/**
 * Looping maximum iteration.
 */
var loopIdxMax = 15;
/**
 * Time in ms to wait before starting the next loop.
 */
var loopIdxWait = 300;

/**
 * Shows the preview image.
 *
 * @param parentElem - the orginal image in the page
 * @param hDiv - the div-element
 * @param hImg - the img-element
 * @param newImage - the preview image
 * @param loopIdx - how many tries we already made
 */
function showPreview(parentElem, hDiv, hImg, newImage) {

    var offsetW = (gmCumulativeOffset(parentElem)[0]) + offSetLeftFix;
    var offsetH = gmCumulativeOffset(parentElem)[1];
    var ratio = parentElem.width / parentElem.height;

    hDiv.css("cursor", "wait");
    hImg.css("cursor", "wait");
    var pE = $(parentElem);
    pE.css("cursor", "wait");

    if (!newImage.complete && loopIdx <= loopIdxMax) {
        // image not loaded
        hImg.empty();
        hImg.text(loopIdx);
        loopIdx++;
        var iPoint = ["auto", "auto"];
        gmSetDivLayout(hDiv, iPoint, offsetW, offsetH, ratio);
        window.setTimeout(function() { showPreview(parentElem, hDiv, hImg, newImage); }, loopIdxWait);

    } else {
        // set Image
        hDiv.empty();
        var hA = $("<a>");
        hA.attr("id", "a" + hImg.attr("id"));
        hA.attr("target", "#blank");
        hDiv.append(hA);
        hImg = $("<img>");
        hImg.addClass("hi-preview");
        hImg.attr("id", hA.attr("id"));
        hA.append(hImg);

        // get text
        var picText = pE.attr("alt");
        if (!picText || picText.length < 1) {
            picText = pE.attr("title");
        }

        // set text
        var objText = $("<div>");
        objText.text(picText);
        objText.attr("id", "cap" + hImg.attr("id"));
        objText.addClass("hi-caption");
        hDiv.append(objText);
        hImg.attr("src", newImage.src);
        hA.attr("href", gmGetReplaceUrl(elemSearchUrl, elemReplUrlLarge, newImage.src));

        hA.attr("title", "[" + picText + "]");
        hImg.attr("title", hA.attr("title"));
        hImg.attr("alt", hImg.attr("title"));

        // set layout
        var iPoint = gmGetImageSize(newImage);
        setDivLayout(hDiv, iPoint, offsetW, offsetH, ratio);
        setImgLayout(hDiv, hImg, iPoint);

        // remove hourglass
        hDiv.css("cursor", "auto");
        hImg.css("cursor", "pointer");
        pE.css("cursor", "pointer");
        hA.css("cursor", "pointer");
    }
}

function addDLink(imgObj, tagdivid) {
    if (elemWithDownLink == 1) {
        var replaceUrl = gmGetReplaceUrl(elemSearchUrl, elemReplUrlLarge, imgObj.attr("src"));
        var dlLink = $("<a href=\"\" id=\"dl" + tagdivid + "\" class=\"hi-dlink\">DL</a>");
        dlLink.attr({"target":"#blank","href":replaceUrl});
        dlLink.attr("title","download ["+dlLink.attr("href") +"]");
        var dlSpan = $("<span>");
        dlSpan.css("position","absolute");
        dlSpan.css("left",imgObj.position().left);
        dlSpan.css("top",imgObj.position().top);
        dlSpan.append(dlLink);
        imgObj.parent().before(dlSpan);
    }
}

var refid;

function addMouseOver(e, divid, imgid, tagdivid, tagimgid) {
    replaceUrl = gmGetReplaceUrl(elemSearchUrl, elemReplUrl, refid.src);
    var newImage = new Image();
    newImage.src = replaceUrl;
    var hDiv;
    var hImg;
    if ($("body").find(imgid).is("img")) {
        hDiv = $(divid);
        hImg = $(imgid);
    } else {
        hDiv = $("<div id=\"" + tagdivid + "\" class=\"hi-preview\"></div>");
        hImg = $("<div id=\"" + tagimgid + "\" class=\"hi-wait\">0</div>");
        $("body").append(hDiv);
        $(divid).empty().append(hImg);
    }
    hDiv.css("cursor", "wait");
    hImg.css("cursor", "wait");

    loopIdx = 0;
    //alert(refid.src);
    showPreview(refid, hDiv, hImg, newImage, 0);
}

function addMouseOut(e, divid, imgid, tagdivid, tagimgid) {
    var bRemove = true;
    var evTarget = e.target;

    var tMsg = (evTarget.tagName + " " + new Date().toGMTString()) + " ";

    var jDiv = null;
    if (evTarget != refid) {
        jDiv = $(divid);
        var jDivChilds = $(divid).find("*");
        if (jDiv.size() > 0 && jDivChilds.size() > 0) {
            tMsg += jDiv.get(0).tagName + " " + evTarget.id + " " + jDivChilds.size();
            if (evTarget == jDiv.get(0)) {
                bRemove = false;
            } else {
                for ( var childIdx = 0; childIdx < jDivChilds.size(); childIdx++) {
                    var currChild = jDivChilds[childIdx];
                    if (evTarget == currChild) {
                        bRemove = false;
                        break;
                    }
                }
            }
        }
    } else {
        bRemove = false;
    }
    tMsg += "" + bRemove;

    if (bRemove && jDiv != null) {
        if (jDiv.size() > 0) {
            jDiv.css("cursor", "auto");
            jDiv.remove();
            tMsg += " remove";
        }
    }
    //$(thisObj).css("cursor", "auto");

    if (gm_debug) {
        if ($("#se1").size() < 1) {
            $("body").before("<span id='se1'>0</span>");
        }
        $("#se1").text(tMsg);
    }
}

function defineIds() {
    var unId = new Date().getTime();
    var tagdivid = "div" + unId;
    var tagimgid = "img" + unId;
    var divid = "#div" + unId;
    var imgid = "#img" + unId;
    return [divid, imgid, tagdivid, tagimgid];
}


