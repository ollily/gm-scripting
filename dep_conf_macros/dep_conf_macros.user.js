// ==UserScript==
// @name            Deprecated Confluence Macros
// @name:de         Veraltete Confluence Makros
// @description     Marks all confluence macros, which will not be available on the cloud
// @description:de  Markiert alle Confluence Makros, welche in der Cloud nicht mehr zur Verfügung stehen
// @tag             Atlassian
// @tag             Confluence
// @tag             Macros
// @tag             Datacenter
// @tag             Cloud
// @author          ollily
// @license         Apache License, Version 2.0
// @license         https://www.apache.org/licenses/LICENSE-2.0.txt
// @homepageURL     https://ollily.github.io/gm-scripting/
// @supportURL      https://github.com/ollily/gm-scripting/issues
// @updateURL       https://cdn.jsdelivr.net/gh/ollily/gm-scripting/dep_conf_macros/dep_conf_macros.user.js
// @downloadURL     https://cdn.jsdelivr.net/gh/ollily/gm-scripting/dep_conf_macros/dep_conf_macros.user.js
// @source          https://github.com/ollily/gm-scripting/dep_conf_macros/dep_conf_macros.user.js
// @icon            https://cdn.jsdelivr.net/gh/ollily/gm-scripting/dep_conf_macros/resource/logo.png
// @namespace       http://coding.glowa-net.com
// @run-at          document-end
// @version         0.02.001
// @grant           unsafeWindow
// @grant           GM_addStyle
// @grant           GM.addStyle
// @grant           GM_getResourceText
// @grant           GM.getResourceText
// @require         https://releases.jquery.com/git/jquery-3.x-git.slim.min.js
// @include         https://*.*/spaces/*
// ==/UserScript==

/*
 History
 0.01.001: Initial Version
 0.02.001: Optimizing code
 */

(function () {
    'use strict';
    const appTitle = 'DCM';

    const macrUnsupp = [
        /* Misc */
        "gallery",
        "loremipsum",
        "search",
        "spaces",
        "unmigrated-wiki-markup",
        "gadget",
        "html",
        "html-include",
        "rss",
        "rss-include",
        "um-css-style",
        "um-iframe",
        "um-rule-blue",
        /* Linking for Confluence */
        "child-counter",
        "incoming-links",
        "link-to",
        "link-window",
        "orphaned-links",
        "outgoing-links",
        "undefined-links",
        /* PDT */
        "projectdoc-story-points",
        "projectdoc-story-relevance",
        "projectdoc-story-status",
        "projectdoc-actor-type",
        "projectdoc-communication-type",
        "projectdoc-feature-importance",
        "projectdoc-issue-severity",
        "projectdoc-issue-status",
        "projectdoc-project-constraint-type",
        "projectdoc-project-vision-type",
        "projectdoc-quality-scenario-type",
        "projectdoc-technical-debt-quality",
        "projectdoc-use-case-level",
        "projectdoc-user-character-type",
        "projectdoc-user-type",
        "projectdoc-stakeholder-rating-macro",
        "projectdoc-action-button-macro",
        "projectdoc-attachment-link-macro",
        "projectdoc-box-deprecated",
        "projectdoc-box-fault",
        "projectdoc-box-feedback",
        "projectdoc-box-generic",
        "projectdoc-box-pending",
        "projectdoc-box-question",
        "projectdoc-box-references",
        "projectdoc-box-version",
        "projectdoc-changelog-macro",
        "projectdoc-complexity",
        "projectdoc-count-macro",
        "projectdoc-display-all-properties-macro",
        "projectdoc-display-space-attribute-macro",
        "projectdoc-even-rating-macro",
        "projectdoc-hide",
        "projectdoc-hml-rating",
        "projectdoc-index-entries-table-macro",
        "projectdoc-level-macro",
        "projectdoc-priority",
        "projectdoc-property-display-as-list-macro",
        "projectdoc-random-static-transclusion-macro",
        "projectdoc-table-set-macro",
        "projectdoc-tag-list-macro",
        "projectdoc-transclusion-property-display-as-link-macro",
        "projectdoc-transclusion-text-macro",
        /* Scroll */
        "excerpt-includeplus",
        /* Table Filter and Charts for Confluence */
        "ai-table",
        "spreadsheet-body-table",
        "spreadsheet-include",
        "spreadsheet-table",
        /* Advanced Table */
        "attachment-table",
        "csv",
        /* Comala Document Management */
        "workflow-reporter",
    ];
    const macrMaybe = [
        "projectdoc-properties-marker",
    ];
    const macrTransition = [
        /* Misc */
        "create-from-template",
        "viewppt",
        "portfolio-for-jira-plan",
        /** BPMN Modeler Enterprise */
        "vbcp-macro-enterprise",
        /* PDT */
        "projectdoc-aside-panel-macro",
        "projectdoc-box-caution",
        "projectdoc-box-example",
        "projectdoc-box-info",
        "projectdoc-box-note",
        "projectdoc-box-tip",
        "projectdoc-box-warning",
        "projectdoc-code-block-placeholder-macro",
        "projectdoc-content-marker",
        "projectdoc-create-one-document-macro",
        "projectdoc-definition-list-macro",
        "projectdoc-display-list",
        "projectdoc-display-table",
        "projectdoc-display-template-list",
        "projectdoc-dynamic-document-link-macro",
        "projectdoc-hide-from-reader-macro",
        "projectdoc-in-document-link-macro",
        "projectdoc-iteration",
        "projectdoc-layout-element-macro",
        "projectdoc-link-external",
        "projectdoc-link-wiki",
        "projectdoc-name-list",
        "projectdoc-page-include-macro",
        "projectdoc-physical-children-macro",
        "projectdoc-primary-page-property-display-macro",
        //"projectdoc-properties-marker",
        "projectdoc-properties-supplier-from-documents-macro",
        "projectdoc-properties-supplier-macro",
        "projectdoc-quote",
        "projectdoc-quote-external",
        "projectdoc-section",
        "projectdoc-space-list-macro",
        "projectdoc-space-property-display-macro",
        "projectdoc-steps-macro",
        "projectdoc-table-merger-macro",
        "projectdoc-tour-by-property-macro",
        "projectdoc-tour-macro",
        "projectdoc-transclude-documents-macro",
        "projectdoc-transclusion-ancestor-property-macro",
        "projectdoc-transclusion-macro",
        "projectdoc-transclusion-parent-property",
        "projectdoc-transclusion-properties-display",
        "projectdoc-transclusion-property-display",
        "projectdoc-transclusion-property-display-as-image-macro",
        "projectdoc-transclusion-property-display-ref",
        "projectdoc-transclusion-property-display-ref-concat",
        "projectdoc-transclusion-ref-macro",
        /* Table Filter and Charts for Confluence */
        "csv-table",
        "pivot-table",
        "table-chart",
        "table-excerpt",
        "table-excerpt-include",
        "table-filter",
        "table-joiner",
        /* Scroll */
        "includeplus",
        "scroll-exportbutton",
        /* Linking for Confluence */
        "add-page",
        "link-page",
        /* Advanced Table */
        "jql-table",
        "json-table",
        "table-plus",
    ];
    // Controlbox
    const cssContainer = "dcm-cssContainer";
    const styleContainer = "position:fixed;right:15px;bottom:15px;min-width:100px;max-width:50%;min-height:20px;max-height:95%;padding:0;margin:0 5px 5px 0;border:2px solid #0068a9;border-radius:5px;background-color:hsl(203, 100%, 96%);color:#000000;display:grid;grid-template-columns:auto;visibility:visible;z-index:9999;";
    const cssTitle = "dcm-cssTitle";
    const styleTitle = "display:grid;row-gap:0;grid-template-columns:auto auto;margin:0;padding:2px 0 0 0;font-weight:bold;color:#F5F5F5;background-color:#0068a9";
    const cssTitleDiv = "dcm-cssTitle div";
    const styleTitleDiv = "margin:0;padding:0 0 0 2px;text-align:right";
    const cssTitleButton = "dcm-cssTitle button";
    const styleTitleButton = "border:1px solid #657200;border-radius:5px;color:#657200;margin:0 1px 3px 1px;padding:0 2px;font-weight:bold;cursor:pointer;";
    const cssContent = "dcm-cssContent";
    const styleContent = "display:grid;row-gap:0;grid-template-columns:auto auto;margin:5px 0;padding:0;";
    const cssContentDiv = "dcm-cssContent div";
    const styleContentDiv = "font-size:smaller;font-weight:normal;font-style;normal;margin:0;padding:0 5px;";

    // Marking macros
    const cssUnsupp = "dcm-cssUnsupp";
    const styleUnsupp = "border:5px solid #e90f40 !important;background-color: #e90f40 !important;border-radius: 5px; display: inline !important; visibility: visible !important;";
    const cssMaybe = "dcm-cssMaybe";
    const styleMaybe = "border:5px solid #7bcef6 !important;background-color: #7bcef6 !important;border-radius: 5px; display: inline !important; visibility: visible !important;";
    const cssTransition = "dcm-cssTransition";
    const styleTransition = "border:5px solid #b0c800 !important;background-color: #b0c800 !important;border-radius: 5px; display: inline !important; visibility: visible !important;";

    const styles = new Map([
        [cssUnsupp, styleUnsupp],
        [cssMaybe, styleMaybe],
        [cssTransition, styleTransition],
        [cssContainer, styleContainer],
        [cssTitle, styleTitle],
        [cssTitleDiv, styleTitleDiv],
        [cssTitleButton, styleTitleButton],
        [cssContent, styleContent],
        [cssContentDiv, styleContentDiv],
    ]);
    const Func = {
        createCss: function () {
            let pageHeader = $("head");
            if (pageHeader) {
                pageHeader.append('<style id="dcm-styleTag"/>');
                let styleTag = $("#dcm-styleTag");
                if (styleTag) {
                    styles.forEach((styleText, cssStyle) => {
                        let styleEntry = "." + cssStyle + " {" + styleText + "}";
                        styleTag.append(styleEntry);
                    });
                }
                ;
            }
        },
        createSumBox: function (parent, title) {
            let container;

            if (parent) {
                container = '<div id="dcm-sum-container" class="dcm-cssContainer">';
                container += '<div id="dcm-sum-title" class="dcm-cssTitle"><div style="text-align:left">' + title + '</div><div><button id="dcm-btn-start" alt="Start" title="Start Analysis">Start</button><button id="dcm-btn-close" alt="Close" title="Close">X</button></div></div>';
                container += '<div id="dcm-sum-content" class="dcm-cssContent"></div>';
                container += '</div>';
                parent.prepend(container);
                $("#dcm-btn-start").on("click", function () {
                    Func.analyze("#content")
                });
                $("#dcm-btn-close").on("click", function () {
                    Func.close()
                });
            }

            return container;
        },
        searchMacros: function (macroList, cssClazz, summaryBox, summaryHeader, startPoint) {
            let found = false;
            summaryBox.append('<div style="font-size:medium;font-weight:bold;font-style:normal">' + summaryHeader + '</div><div/>');

            macroList.forEach((macro) => {
                let foundMacros = $(startPoint + " *[data-macro-name=" + macro + "]");
                if (foundMacros) {
                    if (foundMacros.length > 0) {
                        found = true;
                        summaryBox.append("<div>" + macro + "</div><div>" + foundMacros.length + "</div>")
                        foundMacros.addClass(cssClazz);
                        foundMacros.attr("title", macro);
                    }
                }
            });

            if (!found) {
                summaryBox.append('<div>-</div><div/>');
            }
        },
        analyze: function (startPoint) {
            $("body").css("cursor", "progress");

            // remove previous analysis
            let oldContent = $("#dcm-sum-content div");
            oldContent.remove();

            // start new analysis
            // unsupported
            let summaryBox = $("#dcm-sum-content");
            let summaryHeader = '<span style="color:#e90f40">Unsupported</span>';
            Func.searchMacros(macrUnsupp, cssUnsupp, summaryBox, summaryHeader, startPoint);
            // currently in discussion
            summaryHeader = '<span style="color:#7bcef6">Maybe</span>';
            Func.searchMacros(macrMaybe, cssMaybe, summaryBox, summaryHeader, startPoint);
            // transitioned
            summaryHeader = '<span style="color:#b0c800">Transitioning</span>';
            Func.searchMacros(macrTransition, cssTransition, summaryBox, summaryHeader, startPoint);

            $("body").css("cursor", "default");
        },
        close: function () {
            $("#dcm-sum-container").remove();
            $("#dcm-styleTag").remove();
        }
    };

    const App = {
        start: function () {
            Func.createCss();
            let container = Func.createSumBox($("body"), appTitle);
        }
    };

    const Init = {
        start: function () {
            App.start();
        }
    };

    Init.start();
})();