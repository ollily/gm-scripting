// ==UserScript==
// @name         Highlight Confluence Templates
// @description
// @version      0.1
// @author       Oliver Glowa
// @tag          Userscripts
// @tag          Confluence
// @namespace    http://coding.glowa-net.com
// @license      Apache License, Version 2.0
// @license      https://www.apache.org/licenses/LICENSE-2.0.txt
// @homepageURL  -
// @supportURL   -
// @source       -
// @icon         https://glowa-net.de/favicon.ico
// @grant        none
// @run-at       document-idle
// ==/UserScript==

AJS.toInit(function () {
    const bodyNodes = document.getElementsByTagName('body');
    if (bodyNodes.length > 0) {
        const targetNode = bodyNodes[0];
        const config = {attributes: true, childList: true, subtree: true};
        const callback = function (_mutationsList, _observer) {
            if (AJS) {
                AJS.toInit(function () {
                    function markElements($elementSel, $color) {
                        const $element = AJS.$($elementSel);
                        if ($element && $element.size() > 0) {
                            $element.css("background-color", $color);
                            $element.css("border-radius", "5px");
                            $element.css("padding", "2px 3px");
                        }
                    }
                    function addLogo($elementSel) {
                        const $element = AJS.$($elementSel);
                        if ($element && $element.size() > 0) {
                            $element.addClass("asys-logo-64-bg");
                            $element.css("border-radius", "5px");
                            $element.css("border", "1px solid var(--asys-blue-1st)");
                            $element.css("padding", "2px 3px");
                        }
                    }

                    function markCoreBlueprints() {
                        const $templateElements = '#create-dialog .templates .template[data-blueprint-module-complete-key*="de.smartics.atlassian.confluence.smartics-projectdoc-confluence-space-core"]:not([data-create-result="space"]) img';
                        const $textColor = "darkorange";
                        markElements($templateElements, $textColor);
                    }

                    function markPMBlueprints() {
                        const $templateElements = '#create-dialog .templates .template[data-blueprint-module-complete-key*="de.smartics.atlassian.confluence.smartics-projectdoc-confluence-space-prjmgmt"]:not([data-create-result="space"]) img';
                        const $textColor = "darkgreen";
                        markElements($templateElements, $textColor);
                    }

                    function markSoftwareBlueprints() {
                        const $templateElements = '#create-dialog .templates .template[data-blueprint-module-complete-key*="de.smartics.atlassian.confluence.smartics-projectdoc-confluence-space-swdev"]:not([data-create-result="space"]) img';
                        const $textColor = "indigo";
                        markElements($templateElements, $textColor);
                    }

                    function markCustomTemplates() {
                        const $templateElements = '#create-dialog .templates label.template span.icon-content-template-large';
                        addLogo($templateElements);
                    }
                    if (AJS.$("#create-dialog").size() > 0) {
                        markCoreBlueprints();
                        markPMBlueprints();
                        markSoftwareBlueprints();
                        markCustomTemplates();
                    }
                });
            }
        }
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    }
});
