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
// @version         0.01.001
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
 */

(function () {
    'use strict';
    const appTitle = 'DCM';

    const macrUnsupp = [
        /* Misc */
        "data-macro-name=gallery",
        "data-macro-name=loremipsum",
        "data-macro-name=search",
        "data-macro-name=spaces",
        "data-macro-name=unmigrated-wiki-markup",
        "data-macro-name=gadget",
        "data-macro-name=html",
        "data-macro-name=html-include",
        "data-macro-name=rss",
        "data-macro-name=rss-include",
        "data-macro-name=um-css-style",
        "data-macro-name=um-iframe",
        "data-macro-name=um-rule-blue",
        /* Linking for Confluence */
        "data-macro-name=child-counter",
        "data-macro-name=incoming-links",
        "data-macro-name=link-to",
        "data-macro-name=link-window",
        "data-macro-name=orphaned-links",
        "data-macro-name=outgoing-links",
        "data-macro-name=undefined-links",
        /* PDT */
        "data-macro-name^=rojectdoc",
        "data-macro-name=projectdoc-story-points",
        "data-macro-name=projectdoc-story-relevance",
        "data-macro-name=projectdoc-story-status",
        "data-macro-name=projectdoc-actor-type",
        "data-macro-name=projectdoc-communication-type",
        "data-macro-name=projectdoc-feature-importance",
        "data-macro-name=projectdoc-issue-severity",
        "data-macro-name=projectdoc-issue-status",
        "data-macro-name=projectdoc-project-constraint-type",
        "data-macro-name=projectdoc-project-vision-type",
        "data-macro-name=projectdoc-quality-scenario-type",
        "data-macro-name=projectdoc-technical-debt-quality",
        "data-macro-name=projectdoc-use-case-level",
        "data-macro-name=projectdoc-user-character-type",
        "data-macro-name=projectdoc-user-type",
        "data-macro-name=projectdoc-stakeholder-rating-macro",
        "data-macro-name=projectdoc-action-button-macro",
        "data-macro-name=projectdoc-attachment-link-macro",
        "data-macro-name=projectdoc-box-deprecated",
        "data-macro-name=projectdoc-box-fault",
        "data-macro-name=projectdoc-box-feedback",
        "data-macro-name=projectdoc-box-generic",
        "data-macro-name=projectdoc-box-pending",
        "data-macro-name=projectdoc-box-question",
        "data-macro-name=projectdoc-box-references",
        "data-macro-name=projectdoc-box-version",
        "data-macro-name=projectdoc-changelog-macro",
        "data-macro-name=projectdoc-complexity",
        "data-macro-name=projectdoc-count-macro",
        "data-macro-name=projectdoc-display-all-properties-macro",
        "data-macro-name=projectdoc-display-space-attribute-macro",
        "data-macro-name=projectdoc-even-rating-macro",
        "data-macro-name=projectdoc-hide",
        "data-macro-name=projectdoc-hml-rating",
        "data-macro-name=projectdoc-index-entries-table-macro",
        "data-macro-name=projectdoc-level-macro",
        "data-macro-name=projectdoc-priority",
        "data-macro-name=projectdoc-property-display-as-list-macro",
        "data-macro-name=projectdoc-random-static-transclusion-macro",
        "data-macro-name=projectdoc-table-set-macro",
        "data-macro-name=projectdoc-tag-list-macro",
        "data-macro-name=projectdoc-transclusion-property-display-as-link-macro",
        "data-macro-name=projectdoc-transclusion-text-macro",
        /* Scroll */
        "data-macro-name=excerpt-includeplus",
        /* Table Filter and Charts for Confluence */
        "data-macro-name=ai-table",
        "data-macro-name=spreadsheet-body-table",
        "data-macro-name=spreadsheet-include",
        "data-macro-name=spreadsheet-table",
        /* Advanced Table */
        "data-macro-name=attachment-table",
        "data-macro-name=csv",
        /* Comala Document Management */
        "data-macro-name=workflow-reporter",
    ];
    const macrMaybe = [];
    const macrTransition = [
        /* Misc */
        "data-macro-name=create-from-template",
        "data-macro-name=viewppt",
        "data-macro-name=portfolio-for-jira-plan",
        /** BPMN Modeler Enterprise */
        "data-macro-name=vbcp-macro-enterprise",
        /* PDT */
        "data-macro-name=projectdoc-aside-panel-macro",
        "data-macro-name=projectdoc-box-caution",
        "data-macro-name=projectdoc-box-example",
        "data-macro-name=projectdoc-box-info",
        "data-macro-name=projectdoc-box-note",
        "data-macro-name=projectdoc-box-tip",
        "data-macro-name=projectdoc-box-warning",
        "data-macro-name=projectdoc-code-block-placeholder-macro",
        "data-macro-name=projectdoc-content-marker",
        "data-macro-name=projectdoc-create-one-document-macro",
        "data-macro-name=projectdoc-definition-list-macro",
        "data-macro-name=projectdoc-display-list",
        "data-macro-name=projectdoc-display-table",
        "data-macro-name=projectdoc-display-template-list",
        "data-macro-name=projectdoc-dynamic-document-link-macro",
        "data-macro-name=projectdoc-hide-from-reader-macro",
        "data-macro-name=projectdoc-in-document-link-macro",
        "data-macro-name=projectdoc-iteration",
        "data-macro-name=projectdoc-layout-element-macro",
        "data-macro-name=projectdoc-link-external",
        "data-macro-name=projectdoc-link-wiki",
        "data-macro-name=projectdoc-name-list",
        "data-macro-name=projectdoc-page-include-macro",
        "data-macro-name=projectdoc-physical-children-macro",
        "data-macro-name=projectdoc-primary-page-property-display-macro",
        "data-macro-name=projectdoc-properties-marker",
        "data-macro-name=projectdoc-properties-supplier-from-documents-macro",
        "data-macro-name=projectdoc-properties-supplier-macro",
        "data-macro-name=projectdoc-quote",
        "data-macro-name=projectdoc-quote-external",
        "data-macro-name=projectdoc-section",
        "data-macro-name=projectdoc-space-list-macro",
        "data-macro-name=projectdoc-space-property-display-macro",
        "data-macro-name=projectdoc-steps-macro",
        "data-macro-name=projectdoc-table-merger-macro",
        "data-macro-name=projectdoc-tour-by-property-macro",
        "data-macro-name=projectdoc-tour-macro",
        "data-macro-name=projectdoc-transclude-documents-macro",
        "data-macro-name=projectdoc-transclusion-ancestor-property-macro",
        "data-macro-name=projectdoc-transclusion-macro",
        "data-macro-name=projectdoc-transclusion-parent-property",
        "data-macro-name=projectdoc-transclusion-properties-display",
        "data-macro-name=projectdoc-transclusion-property-display",
        "data-macro-name=projectdoc-transclusion-property-display-as-image-macro",
        "data-macro-name=projectdoc-transclusion-property-display-ref",
        "data-macro-name=projectdoc-transclusion-property-display-ref-concat",
        "data-macro-name=projectdoc-transclusion-ref-macro",
        /* Table Filter and Charts for Confluence */
        "data-macro-name=csv-table",
        "data-macro-name=pivot-table",
        "data-macro-name=table-chart",
        "data-macro-name=table-excerpt",
        "data-macro-name=table-excerpt-include",
        "data-macro-name=table-filter",
        "data-macro-name=table-joiner",
        /* Scroll */
        "data-macro-name=includeplus",
        "data-macro-name=scroll-exportbutton",
        /* Linking for Confluence */
        "data-macro-name=add-page",
        "data-macro-name=link-page",
        /* Advanced Table */
        "data-macro-name=jql-table",
        "data-macro-name=json-table",
        "data-macro-name=table-plus",
    ];
    const cssUnsupp = "dcm-cssUnsupp";
    const styleUnsupp = "border:1px solid #e90f40 !important;background-color: #e90f40 !important;border-radius: 5px; display: inline !important; visibility: visible !important;";
    const cssMaybe = "dcm-cssMaybe";
    const styleMaybe = "border:1px solid #002749 !important;background-color: #002749 !important;border-radius: 5px; display: inline !important; visibility: visible !important;";
    const cssTransition = "dcm-cssTransition";
    const styleTransition = "border:1px solid #b0c800 !important;background-color: #b0c800 !important;border-radius: 5px; display: inline !important; visibility: visible !important;";

    const cssContainer = "dcm-cssContainer";
    const styleContainer = "position:fixed;right:15px;bottom:15px;min-width:100px;max-width:50%;min-height:20px;max-height:95%;padding:0;margin:0 5px 5px 0;border:2px solid #0068a9;border-radius:5px;background-color:hsl(203, 100%, 96%);color:#000000;display:grid;grid-template-columns:auto;visibility:visible;z-index:9999;";
    const cssTitle = "dcm-cssTitle";
    const styleTitle = "display:grid;row-gap:0;grid-template-columns:auto auto;margin:0;padding:2px 0 0 0;font-weight:bold;color:#b0c800;background-color:#0068a9";
    const cssTitleDiv = "dcm-cssTitle div";
    const styleTitleDiv = "margin:0;padding:0 0 0 2px;text-align:right";
    const cssTitleButton = "dcm-cssTitle button";
    const styleTitleButton = "border:1px solid #e90f40;border-radius:5px;color:#e90f40;margin:2px 1px;padding:0 2px;font-weight:bold;";
    const cssContent = "dcm-cssContent";
    const styleContent = "display:grid;row-gap:0;grid-template-columns:auto auto;margin:5px 0;padding:0;";
    const cssContentDiv = "dcm-cssContent div";
    const styleContentDiv = "font-size:smaller;font-weight:normal;font-style;normal;margin:0;padding:0 5px;";

    const Func = {
        createCss: function () {
            let header = $("head");
            if (header) {
                let styleTag = '<style id="dcm-styleTag">' +
                        "." + cssUnsupp + " {" + styleUnsupp + "}" +
                        "." + cssMaybe + " {" + styleMaybe + "}" +
                        "." + cssTransition + " {" + styleTransition + "}" +
                        "." + cssContainer + " {" + styleContainer + "}" +
                        "." + cssTitle + " {" + styleTitle + "}" +
                        "." + cssTitleDiv + " {" + styleTitleDiv + "}" +
                        "." + cssTitleButton + " {" + styleTitleButton + "}" +
                        "." + cssContent + " {" + styleContent + "}" +
                        "." + cssContentDiv + " {" + styleContentDiv + "}" +
                        "</style>";
                header.append(styleTag);
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
                    Func.analyze()
                });
                $("#dcm-btn-close").on("click", function () {
                    Func.close()
                });
            }
            return container;
        },
        searchMacros: function (macroList, cssClazz, summaryBox, header) {
            summaryBox.append('<div style="font-size:medium;font-weight:bold;font-style:normal">' + header + '</div><div/>');
            let found = false;
            macroList.forEach((macro) => {
                let foundMacros = $("*[" + macro + "]");
                if (foundMacros) {
                    if (foundMacros.length > 0) {
                        let logText = macro.replace("data-macro-name=", "");
                        //alert(logText);
                        found = true;
                        summaryBox.append("<div>" + logText + "</div><div>" + foundMacros.length + "</div>")
                        foundMacros.addClass(cssClazz);
                        foundMacros.attr("title", logText);
                    }
                }
            });
            if (!found) {
                summaryBox.append('<div>-</div><div/>');
            }
        },
        analyze: function () {
            let body = $("body");
            body.css("cursor", "progress");
            let oldContent = $("#dcm-sum-content div");
            oldContent.remove();
            let summBox = $("#dcm-sum-content");
            let header = '<span style="color:#e90f40">Unsupported</span>';
            Func.searchMacros(macrUnsupp, cssUnsupp, summBox, header);
            header = '<span style="color:#002749">Maybe</span>';
            Func.searchMacros(macrMaybe, cssMaybe, summBox, header);
            header = '<span style="color:#b0c800">Transitioning</span>';
            Func.searchMacros(macrTransition, cssTransition, summBox, header);
            body.css("cursor", "default");
        },
        close: function () {
            $("#dcm-sum-container").remove();
            $("#dcm-styleTag").remove();
        },
        writeSummary: function (macro, amount) {

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