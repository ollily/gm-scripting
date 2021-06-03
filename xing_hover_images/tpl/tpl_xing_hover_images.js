
//
// Global Code - END
//

//
// GM-Script specific code - START
//

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
 * @param hImg - a placeholder-div or the image
 * @param newImage - the preview image
 * @param loopIdx - how many tries we already made
 */
function lgm_showPreview(parentElem, hDiv, hImg, newImage) {

	var offsetW = (gmCumulativeOffset(parentElem)[0]) + offSetLeftFix;
	var offsetH = 0; //cumulativeOffset(parentElem)[1];
	var ratio = parentElem.style.width / parentElem.style.height; // parentElem.width / parentElem.height;
	var iZoom = 1.33;

	gmSetAtI(hDiv, "style", "cursor:wait");
	//hDiv.css("cursor", "wait");

	gmSetAtI(hImg, "style", "cursor:wait");
	//hImg.css("cursor", "wait");

	var pE = gmGetElI(parentElem);
	//var pE = $(parentElem);

	gmSetAtI(pE, "style", "cursor:wait");
	//pE.css("cursor", "wait");

	var iPoint = ["auto", "auto"];

	if (!newImage.complete && loopIdx <= loopIdxMax) {
		// image not loaded

		gmSetCoI(hImg, "");
//		hImg.empty();

		gmSetCoI(hImg, loopIdx);
//		hImg.text(loopIdx);


		loopIdx++;

		offsetH = gmCalcOffsetH(parentElem, iPoint, iZoom);
//		offsetH = calcOffsetH(parentElem, iPoint, iZoom);

		gmSetDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom);
//		setDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom);

		window.setTimeout(function() { lgm_showPreview(parentElem, hDiv, hImg, newImage); }, loopIdxWait);

	} else {
		// set Image
		gmSetCoI(hDiv, "");
//		hDiv.empty();

		var hA = gmCreateObj(null, "a");
//		var hA = $("<a>");

		gmSetAtI(hA, "id", "a" + gmGetAtI(hImg, "id"));
//		hA.attr("id", "a" + hImg.attr("id"));

		gmSetAtI(hA, "target", "#blank");
//		hA.attr("target", "#blank");

		gmAddObj(hA, hDiv);
//		hDiv.append(hA);

		hImg = gmCreateObj(null, "img");
//		hImg = $("<img>");


		gmSetAtI(hImg, "hi-preview");
//		hImg.addClass("hi-preview");

		gmSetAtI(hImg, "id", gmGetAtI(hA, "id"));
//		hImg.attr("id", hA.attr("id"));

		gmAddObj(hImg, hA);
//		hA.append(hImg);

		// get text
		var picText = gmGetAtI(pE, "alt");
//		var picText = pE.attr("alt");

		if (!picText || picText.length < 1) {
			picText = gmGetAtI(pE, "title");
//			picText = pE.attr("title");
		}


		// set text
		if (picText && picText.length >= 1) {

			var objText = gmCreateObj(null, "div");
//			var objText = $("<div>");

			gmSetCoI(objText, picText);
//			objText.text(picText);

			gmSetAtI(objText, "id", "cap" + gmGetAtI(hImg, "id"));
//			objText.attr("id", "cap" + hImg.attr("id"));

			gmSetAtI(objText, "class", "hi-caption");
//			objText.addClass("hi-caption");

			gmAddObj(objText, hDiv);
//			hDiv.append(objText);
		}

		gmSetAtI(hImg, "src", newImage.src);
//		hImg.attr("src", newImage.src);

		gmSetAtI(hA, "href", gmGetReplaceUrl(elemSearchUrl, elemReplUrlLarge, newImage.src));
//		hA.attr("href", getReplaceUrl(elemSearchUrl, elemReplUrlLarge, newImage.src));

		gmSetAtI(hA, "title", "[" + picText + "]");
//		hA.attr("title", "[" + picText + "]");

		gmSetAtI(hImg, "title", gmGetAtI(hA, "title"));
//		hImg.attr("title", hA.attr("title"));

		gmSetAtI(hImg, "alt", gmGetAtI(hImg,"title"));
//		hImg.attr("alt", hImg.attr("title"));


		// set layout
		iPoint = gmGetImageSize(newImage);
		offsetH = gmCalcOffsetH(parentElem, iPoint, iZoom);
		gmSetDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom);
		gmSetImgLayout(hDiv, hImg, iPoint, iZoom);
//		iPoint = getImageSize(newImage);
//		offsetH = calcOffsetH(parentElem, iPoint, iZoom);
//		setDivLayout(hDiv, iPoint, offsetW, offsetH, ratio, iZoom);
//		setImgLayout(hDiv, hImg, iPoint, iZoom);

		// remove hourglass
		gmSetAtI(hDiv, "style", "cursor:auto");
//		hDiv.css("cursor", "auto");

		gmSetAtI(hImg, "style", "cursor:pointer");
//		hImg.css("cursor", "pointer");

		gmSetAtI(pE, "style", "cursor:pointer");
//		pE.css("cursor", "pointer");

		gmSetAtI(hA, "style", "cursor:pointer");
//		hA.css("cursor", "pointer");

	}
}

function lgm_showPreview2(parentElem, hDiv, hImg, newImage) {
	//var info = "pic: " + parentElem.src + "\n div: " + hDiv.id + "\n img: " + hImg.id + "\n new: " + newImage.src;
	//alert(info);
//	gmSetAtI(gmGetBody(), "style", "background-color:red");
}

/**
 * Scans the list of images and adds the preview-handler in case the url matches with the search-pattern.
 *
 * @param searchPattern - the regular expression which must match with the image-url
 * @param imgList - an array of images (html-tag)
 */
function lgm_addPreviewHandler(searchPattern, imgList) {

	for(var i=0; i < imgList.length; i++) {
//		for(var i=0; i < imgList.size(); i++) {

		var imgObj = gmGetElI(imgList[i]);
//			var imgObj = $(imgList.get(i));
//			alert(typeof imgObj);
		var imgName = gmGetAtI(imgObj, "src");
//			var imgName = imgObj.attr("src");
		var s = searchPattern.test(imgName);
//		alert(imgName + " " + s);
		if( s ) {

			var tagdivid = "div" + i;
			var tagimgid = "img" + i;
	//		var divid = "#div" + i;
//			var imgid = "#img" + i;
			var refid = null;
			//alert(imgName + " " + tagdivid + " " + tagimgid);

			var replaceUrl = gmGetReplaceUrl(elemSearchUrl, elemReplUrlLarge, imgName);
	//		var replaceUrl = getReplaceUrl(elemSearchUrl, elemReplUrlLarge, imgObj.attr("src"));

			imgObj.addEventListener('mouseover',
//			imgObj.onmouseover =
				function(e) {
					refid = this;
					const localTag = tagdivid;
					const localImg = tagimgid;
					replaceUrl = gmGetReplaceUrl(elemSearchUrl, elemReplUrl, this.src);
	//				replaceUrl = getReplaceUrl(elemSearchUrl, elemReplUrl, this.src);
					var newImage = new Image();
					newImage.src = replaceUrl;
					var hDiv;
					var hImg;

					if (gmIsInstanceOf(gmGetElI(localImg), Image)) {
	//				if ($("body").find(imgid).is("img")) {
						hDiv = gmGetElI(localTag);
	//					hDiv = $(divid);

						hImg = gmGetElI(localImg);
	//					hImg = $(imgid);
					} else {
						hDiv = gmCreateObj(null, "div", localTag);
						gmSetAtI(hDiv, "class", "hi-preview");
	//					hDiv = $("<div id=\"" + tagdivid + "\" class=\"hi-preview\"></div>");

						hImg = gmCreateObj(null, "div", localImg);
						gmSetAtI(hImg, "class", "hi-wait");
						gmSetInput(hImg, "0");
	//					hImg = $("<div id=\"" + tagimgid + "\" class=\"hi-wait\">0</div>");

						gmSetCoI(hDiv, "");
						gmAddObj(hImg, hDiv);

						gmAddObj(hDiv, null);
	//					$("body").append(hDiv);
	//					$(divid).empty().append(hImg);
					}
					gmSetAtI(hDiv, "style", "cursor:wait");
	//				hDiv.css("cursor", "wait");

					gmSetAtI(hImg, "style", "cursor:wait");
	//				hImg.css("cursor", "wait");

					loopIdx = 0;
					lgm_showPreview(this, hDiv, hImg, newImage, 0);
//			};
				}
			);
			imgObj.addEventListener('mouseout',
				function(e) {
					refid = this;
					const localTag = tagdivid;
					const localImg = tagimgid;

					var bRemove = true;
					var evTarget = e.target;

					var jDiv = null;

					if (evTarget == refid) {
						jDiv = gmGetElI(localTag);
					} else {
						bRemove = false;
					}
					alert(refid.src + "< >" + bRemove + "< >" + evTarget.src + "< >" + (jDiv == null));
					if (bRemove) {
						if (gmIsObject(jDiv)) {
							gmSetAtI(jDiv, "style", "cursor:auto");
							gmDelObj(jDiv);
//							gmSetAtI(gmGetBody(), "style", "background-color:blue");

						}
					}
					//gmSetAtI(refid, "style", "cursor:auto");

				}
			);
			if (elemWithDownLink == 1) {
				var dlLink = gmCreateObj(null, "a");
				gmSetAtI(dlLink, "id", "dl" + tagdivid);
				gmSetAtI(dlLink, "class", "hi-dlink");
				gmSetCoI(dlLink, "Download");
	//			var dlLink = $("<a href=\"\" id=\"dl" + tagdivid + "\" class=\"hi-dlink\">Download</a>");

				gmSetAtI(dlLink, "target", "#blank");
				gmSetAtI(dlLink, "href", replaceUrl);
	//			dlLink.attr({"target":"#blank","href":replaceUrl});

				gmSetAtI(dlLink, "title", "download [" + gmGetAtI(dlLink, "href") + "]");
	//			dlLink.attr("title","download ["+dlLink.attr("href") +"]");
//				alert(dlLink);
				gmAddObj(dlLink, imgObj.parentNode);
	//			imgObj.parent().after(dlLink);
			}

//			lgm_addBodyListener();
		}
	}
}

/**
 * Adds a listener to the body to hide the preview image.
 *
 * @param refid - the tag-id which must match the tagdivid
 * @param tagdivid - the tag-id from the surrounding preview image, which should be hidden
 */
function lgm_addBodyListener(refid, tagdivid) {
	gmGetBody().addEventListener('mouseover',
//			gmGetBody().onmouseover =
//			$("body").mouseover(
				function(e) {
					var bRemove = true;
					var evTarget = e.target;

					var tMsg = (evTarget.tagName + " " + new Date().toGMTString()) + " ";
					var jDiv = null;

					if (evTarget != refid) {
						jDiv = document.getElementById(tagdivid);
//						var jDiv = $(divid);

						var jDivChilds = new Array();
						if (jDiv) {
							jDivChilds = jDiv.childNodes;
						}
//						var jDivChilds = $(divid).find("*");

						if (jDivChilds.length > 0) {
//						if (jDiv.size() > 0 && jDivChilds.size() > 0) {

							tMsg += jDiv.tagName + " " + evTarget.id + " " + jDivChilds.length;
//							tMsg += jDiv.get(0).tagName + " " + evTarget.id + " " + jDivChilds.size();

							if (evTarget == jDiv[0]) {
//							if (evTarget == jDiv.get(0)) {
								bRemove = false;
							} else {
								for ( var childIdx = 0; childIdx < jDivChilds.length; childIdx++) {
//								for ( var childIdx = 0; childIdx < jDivChilds.size(); childIdx++) {
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

					if (bRemove) {
						if (gmIsObject(jDiv)) {
//						if (jDiv.size() > 0) {

							gmSetAtI(jDiv, "style", "cursor:auto");
//							jDiv.css("cursor", "auto");

							gmDelObj(jDiv);
//							jDiv.remove();

							tMsg += " remove";
						}
					}
					gmSetAtI(this, "style", "cursor:auto");
//					$(this).css("cursor", "auto");

//					if (gm_debug) {
//						if ($("#se1").size() < 1) {
//							$("body").before("<span id='se1'>0</span>");
//						}
//						$("#se1").text(tMsg);
//					}
				}
			);
}

/**
 * Now add the event handler.
 */
function lgm_initScript(e) {
	var imgList = gmGetElList("tagname", "img");
	//document.getElementsByTagName("img");
// 	var imgList = $("img");
	if (img2Search != "") {
		var searchPattern = new RegExp(img2Search);
//		alert(img2Search);
		lgm_addPreviewHandler(searchPattern, imgList);
	};

//	for(var i=0; i < imgList.length; i++) {
////	for(var i=0; i < imgList.size(); i++) {
//
//		var imgObj = gmGetElI(imgList[i]);
////		var imgObj = $(imgList.get(i));
////		alert(typeof imgObj);
//		var imgName = gmGetAtI(imgObj, "src");
////		var imgName = imgObj.attr("src");
////		alert(imgName);
//		var s = searchPattern.test(imgName);
//		if( s ) {
//			lgm_addPreviewHandler(s, imgObj, imgName, i);
//		}
//	}

	// add listener to document, in case images are dynamically added
//	document.addEventListener('DOMNodeInserted',
//		function(ev) {
//			var imgList = null;
//			switch (ev.target.nodeName) {
//			case 'IMG':
//				imgList = [ev.target];
//				break;
//
//			default:
//				imgList = ev.target.getElementsByTagName('img');
//				break;
//			}
//			lgm_addPreviewHandler(searchPattern, imgList);
//		}
//	);

}

window.onload =
	function(e) {
		gmAddHandler(e);
	};

//$(window).ready(
//	function(e) {
//		addHandler(e);
//	}
//);