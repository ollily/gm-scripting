/**
 * Adds site which should be known by this script.
 * Can be left empty.
 */
function lgm_addKnownSites() {
    gmAddSite2(".+\\.xing\.com", "\/(?:pub|)img\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );
    gmAddSite2(".+\.net", "\/(?:pub|)img\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );
    gmAddSite2("localhost.*", "(?:|^\/|.+?\/)(?:pub|)img\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );

//    gmAddSite(".+\\.xing\.com", "\/img\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );
//    gmAddSite(".+\\.xing\.com", "\/pubimg\/users\/.+(?:\_s[0-9]{1,}.*?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\.(?:jpg|gif|png)", "(\\_s[0-9]{1,}.+?|\,[0-9]{1,}.[0-9]{1,3}x[0-9]{1,3})\\.", ".", ".", 0 );
//    gmAddSite(".+\.net", "\/img\/users\/.+(?:\_s[0-9].*?|\,[0-9].[0-9]+?x[0-9]+?)\.(?:jpg|gif|png)", "(\\_s[0-9].+?|\,[0-9].[0-9]+?x[0-9]+?)\\.", ".", ".", 0 );

};

/**
 * Adds CSS-Styles for this script.
 * Can be left empty.
 */
function lgm_addStyles() {
    GM_addStyle("a.hi-dlink, a.hi-dlink:hover {position:relative;top:2px;text-decoration:none;padding:1pt 2pt;border:#000000 solid 1px;background-color:#ffffff;color:#000000;font-size:8pt;font-weight:bold");
    GM_addStyle("a.hi-dlink:hover {border:1pt #ff6080 solid;background-color:#ff6080;color:#ffffff}");
    GM_addStyle("div.hi-preview {position:absolute;overflow:hidden;padding:0px;margin:0px;border:solid #cccccc 1px;"
        + "z-index:1997;background-color:#eeeeee;font-family:Arial,Courier;font-size:"+picTextFontSize+";font-weight:bold;}");
    GM_addStyle("img.hi-preview {border:0pt none #ffffff;z-index:1998;}");
    GM_addStyle("div.hi-wait {font-size:10pt;font-weight:bold; }");
    GM_addStyle("div.hi-caption {font-size:"+picTextFontSize+";font-weight:bold;overflow:hidden;background-color:#eeeeee;z-index:1999;}");
};

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

//    alert(img2Search);

    //    getFilter(currSite);
};

/**
 * The first action which should be excecuted in this script.
 * Can be left empty.
 */
function lgm_addInitAction() {
    lgm_initScript(null);
};
