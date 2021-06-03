/**
 * Adds site which should be known by this script.
 * Can be left empty.
 */
function lgm_addKnownSites() {
    gmAddSite2(".+\.flickr\.com", ".+\.static\.{0,1}flickr\.com\.+?_(s|t)\.(jpg|gif|png)", "\_(s|t)\.", "_m.", "_b.", 1 );
    gmAddSite2(".+\.net", "^.+_(s|t)\.(jpg|gif|png)", "\_(s|t)\.", "_m.", "_b.", 1 );

    return true;
}

/**
 * Adds CSS-Styles for this script.
 * Can be left empty.
 */
function lgm_addStyles() {
    // the main container
    var style = new Array();
    style.push("a.hi-dlink, a.hi-dlink:hover {z-index:990;text-decoration:none;padding:1pt 2pt;border:#ff6080 solid 1px;background-color:rgba(255, 255, 255, 0.5);color:#ffffff;font-size:8pt;font-weight:bold");
    style.push("a.hi-dlink:hover {border:1pt #ff6080 solid;background-color:#ff6080;color:#ffffff}");
    style.push("div.hi-preview {position:absolute;z-index:997;overflow:hidden;padding:0px;margin:0px;border:solid #cccccc 1px;"
        + "zIndex:997;background-color:#eeeeee;font-family:Arial,Courier;font-size:"+picTextFontSize+";font-weight:bold;}");
    style.push("img.hi-preview {border:0pt none #ffffff;z-index:998;}");
    style.push("div.hi-wait {font-size:10pt;font-weight:bold; }");
    style.push("div.hi-caption {font-size:"+picTextFontSize+";font-weight:bold;overflow:hidden;background-color:#eeeeee;z-index:999;}");
    gmAddStyleGlobal(style);
    return true;
}

/**
 * Adds HTML-Objects for this script.
 * Can be left empty.
 */
function lgm_addControls() {
    var foundSite = gmFoundFilter2(currSite);
    if (gmIsObject(foundSite)) {
        img2Search = foundSite.url;
        elemSearchUrl = foundSite.search;
        elemReplUrl = foundSite.replace;
        elemReplUrlLarge = foundSite.replace_large;
        elemWithDownLink = foundSite.withDownload;
    }
    return true;
};

/**
 * Now add the event handler.
 */
function addHandlerOld(e) {
     var imgList = $("img");
    var searchPattern = new RegExp(img2Search);

    for(var i=0; i < imgList.size(); i++) {
//        var unId = new Date().getTime();
        var imgObj = $(imgList.get(i));
        var imgName = imgObj.attr("src");
        var s = searchPattern.test(imgName);

        if( s ) {
            //alert(imgName);
//            var tagdivid = "div" + unId;
//            var tagimgid = "img" + unId;
//            var divid = "#div" + unId;
//            var imgid = "#img" + unId;
            var [divid, imgid, tagdivid, tagimgid] = defineIds();
//            var refid;

            imgObj.mouseover(
                function(e) {
                    refid = this;
                    addMouseOver(e, divid, imgid, tagdivid, tagimgid);
                });

            addDLink(imgObj, tagdivid);

        };
    }
            $("body").mouseover(
                function(e) {
                    addMouseOut(e, divid, imgid, tagdivid, tagimgid);
//                    refid = null;
                });
}

/**
 * The first action which should be excecuted in this script.
 * Can be left empty.
 */
function lgm_addInitAction() {
     var imgList = $("img");
    var [divid, imgid, tagdivid, tagimgid] = defineIds();
     imgList.live("mouseover",
        function(e) {
            var searchPattern = new RegExp(img2Search);
            var imgName = $(this).attr("src");
            var s = searchPattern.test(imgName);
            if (s) {
                refid = this;
                addMouseOver(e, divid, imgid, tagdivid, tagimgid);
                addDLink($(refid), tagdivid);
            };
         });

    $("body").mouseover(
        function(e) {
            addMouseOut(e, divid, imgid, tagdivid, tagimgid);
        });
}

//$(window).ready(
//    function(e) {
//        addHandler2(e);
//    }
//);

gmInitEventHandler();
