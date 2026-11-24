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
// @version         0.02.002
// @require         https://releases.jquery.com/git/jquery-3.x-git.slim.min.js
// @include         https://*.*/spaces/*
// ==/UserScript==

/*
History
0.01.001: Initial Version
0.02.001: Optimizing code
0.02.002: Macrolist updated (24.11.26)
 */

(function () {
    'use strict';
    const appTitle = 'DCM';
    const appVersion = '0.02.001';
    
    const macrUnsupp = ["attachment-table", "csv", "gallery", "unmigrated-wiki-markup", "search", "spaces", "loremipsum", "projectdoc-story-points", "projectdoc-story-relevance", "projectdoc-story-status", "projectdoc-actor-type", "projectdoc-communication-type", "projectdoc-feature-importance", "projectdoc-issue-severity", "projectdoc-issue-status", "projectdoc-project-constraint-type", "projectdoc-project-vision-type", "projectdoc-quality-scenario-type", "projectdoc-technical-debt-quality", "projectdoc-use-case-level", "projectdoc-user-character-type", "projectdoc-user-type", "vbcp-enterprise-process-net-macro", "workflow-reporter", "html", "html-include", "rss", "rss-include", "um-rule-blue", "um-iframe", "um-css-style", "link-to", "child-counter", "incoming-links", "orphaned-links", "outgoing-links", "undefined-links", "link-window", "projectdoc-stakeholder-rating-macro", "projectdoc-hide", "projectdoc-display-all-properties-macro", "projectdoc-display-all-space-properties-macro", "projectdoc-display-space-attribute-macro", "projectdoc-index-entries-table-macro", "projectdoc-tag-list-macro", "projectdoc-action-button-macro", "projectdoc-attachment-link-macro", "projectdoc-box-deprecated", "projectdoc-box-fault", "projectdoc-box-feedback", "projectdoc-box-generic", "projectdoc-box-pending", "projectdoc-box-question", "projectdoc-box-references", "projectdoc-box-version", "projectdoc-changelog-macro", "projectdoc-complexity", "projectdoc-count-macro", "projectdoc-even-rating-macro", "projectdoc-hml-rating", "projectdoc-level-macro", "projectdoc-priority", "projectdoc-property-display-as-list-macro", "projectdoc-random-static-transclusion-macro", "projectdoc-table-set-macro", "projectdoc-transclusion-property-display-as-link-macro", "projectdoc-transclusion-text-macro", "excerpt-includeplus", "ai-table", "spreadsheet-body-table", "spreadsheet-include", "spreadsheet-table", ];
    const macrMaybe = ["portfolio-for-jira-plan", "jql-table", "json-table", "table-plus", "gadget", "viewdoc", "viewppt", "vbcp-macro-enterprise", "add-page", "add-page-form", "link-page", "projectdoc-hide-from-anonymous-user-macro", "projectdoc-definition-list-macro", "projectdoc-aside-panel-macro", "projectdoc-box-example", "projectdoc-box-info", "projectdoc-box-tip", "projectdoc-box-warning", "projectdoc-code-block-placeholder-macro", "projectdoc-content-marker", "projectdoc-create-one-document-macro", "projectdoc-display-template-list", "projectdoc-dynamic-document-link-macro", "projectdoc-in-document-link-macro", "projectdoc-layout-element-macro", "projectdoc-page-include-macro", "projectdoc-physical-children-macro", "projectdoc-properties-supplier-from-documents-macro", "projectdoc-properties-supplier-macro", "projectdoc-properties-supply-by-attachment-macro", "projectdoc-quote", "projectdoc-space-list-macro", "projectdoc-space-property-display-macro", "projectdoc-steps-macro", "projectdoc-tour-by-property-macro", "projectdoc-transclusion-macro", "projectdoc-section", "projectdoc-transclude-documents-macro", "projectdoc-transclusion-ancestor-property-macro", "projectdoc-transclusion-properties-display", "projectdoc-transclusion-property-display-as-image-macro", "projectdoc-transclusion-property-display-ref", "projectdoc-transclusion-property-display-ref-concat", "projectdoc-transclusion-ref-macro", "includeplus", "sv-pagetree", "table-chart", "table-filter", "csv-table", "json-from-table", "pivot-table", "table-excerpt", "table-excerpt-include", "table-joiner", ];
    const macrTransition = ["create-from-template", "projectdoc-hide-from-reader-macro", "projectdoc-table-merger-macro", "projectdoc-box-caution", "projectdoc-box-note", "projectdoc-display-list", "projectdoc-display-table", "projectdoc-iteration", "projectdoc-link-external", "projectdoc-link-wiki", "projectdoc-name-list", "projectdoc-primary-page-property-display-macro", "projectdoc-properties-marker", "projectdoc-quote-external", "projectdoc-tour-macro", "projectdoc-transclusion-parent-property", "projectdoc-transclusion-property-display", "scroll-exportbutton", ];

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
        createSumBox: function (parent, title, version) {
            let container;

            if (parent) {
                let appTitle = title + "-" + version;
                container = '<div id="dcm-sum-container" class="dcm-cssContainer">';
                container += '<div id="dcm-sum-title" class="dcm-cssTitle"><div style="text-align:left">' + appTitle + '</div><div><button id="dcm-btn-start" alt="Start" title="Start Analysis">Start</button><button id="dcm-btn-close" alt="Close" title="Close">X</button></div></div>';
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
            let container = Func.createSumBox($("body"), appTitle, appVersion);
        }
    };

    const Init = {
        start: function () {
            App.start();
        }
    };

    Init.start();
})();