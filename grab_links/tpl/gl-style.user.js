const MAIN_FONT_TYPE = "Consolas"; //"Arial, Courier New";
const MAIN_FONT_SIZE = "10pt !important";
const MAIN_CLR_TEXT = "#000000";
const MAIN_CLR_BG = "#e0e0e0"; //"#CED8F6";
const MAIN_FORMS_CLR_BORDER = "#808080"; //"#819FF7";
const MAIN_FORMS_CLR_TEXT = MAIN_CLR_TEXT;
const MAIN_FORMS_CLR_BG = "#ffffff";
const MAIN_FORMS_HEIGHT = "20px !important";
const MAIN_FORMS_LINE_HEIGHT = "15px";
const HOVER1_CLR_TEXT = "#e0e0e0";
const HOVER1_CLR_BG = "#a80000";
const HOVER2_CLR_TEXT = "#ffffff";
const HOVER2_CLR_BG = "#a80000";
const FOCUS_CLR_BG = "#ffffcc";
const SCROLLBAR_CLR_RULER = "#a00000"; //"#e0e0e0";
const SCROLLBAR_CLR_BG = MAIN_FORMS_CLR_BORDER;

const CSS_STYLE = `
#gl-container
{
    -moz-text-size-adjust: none;
    background-attachment: scroll;
    background-clip: border-box;
    background-color: ` + MAIN_CLR_BG + `;
    background-image: none;
    background-origin: padding-box;
    background-position: 0%;
    background-repeat: repeat;
    background-size: auto;
    color: ` + MAIN_CLR_TEXT + `;
    display: block;
    font-family: ` + MAIN_FONT_TYPE + `;
    font-size: ` + MAIN_FONT_SIZE + `;
    line-height: 15px;
    max-height: 99%;
    max-width: 50%;
    margin: 0;
    min-height: 1%;
    min-width: 225px;
    padding: 0 2px;
    overflow: hidden;
    position: fixed !important;
    right: 1px !important;
    scrollbar-color: ` + SCROLLBAR_CLR_RULER + ` ` + SCROLLBAR_CLR_BG + `;
    scrollbar-width: initial;
    text-align: left;
    top: 0 !important;
    vertical-align: top;
    width: 225px;
    white-space: nowrap;
    z-index: 2147483647;
}
/* General Styles */
#gl-container, #gl-container input, #gl-container button, #gl-container div, #gl-container a:hover
{
    -moz-border-radius: 5px;
    border: 0 none ` + MAIN_FORMS_CLR_BORDER + `;
    border-image-outset: 0;
    border-image-repeat: stretch;
    border-image-slice: 100%;
    border-image-source: none;
    border-image-width: 0;
    border-radius: 5px;
}
#gl-container input, #gl-container button
{
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    border: 2px solid ` + MAIN_FORMS_CLR_BORDER + `;
    box-sizing: border-box;
    font-family: ` + MAIN_FONT_TYPE + `;
    font-size: ` + MAIN_FONT_SIZE + `;
    font-weight: bold;
    height: ` + MAIN_FORMS_HEIGHT + `;
    line-height: ` + MAIN_FORMS_LINE_HEIGHT + `;
    margin: 0;
    margin-right: 1px;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
    padding: 0;
    text-align: left;
    vertical-align: top;
    white-space: nowrap;
}
#gl-container button
{
    padding: 0 3px;
}
#gl-container input:hover, #gl-container input:focus
{
    background-color: ` + FOCUS_CLR_BG + `;
}
#gl-container button:hover, #gl-container button:focus
{
    border-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + HOVER1_CLR_TEXT + `;
    background-color: ` + HOVER1_CLR_BG + `;
}
#gl-container a
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    font-family: ` + MAIN_FONT_TYPE + `;
    text-decoration: underline dotted ` + MAIN_FORMS_CLR_TEXT + `;
    white-space: nowrap;
}
#gl-container a:hover
{
    color: ` + HOVER1_CLR_TEXT + `;
    background-color: ` + HOVER1_CLR_BG + `;
    text-decoration: none transparent;
}
#gl-container #gl-searchbox, #gl-container #gl-actionbox, #gl-container #gl-resultbox
{
    border: transparent none 0;
    display: block;
    left: 0 !important;
    margin: 0;
    padding: 0;
    position: relative !important;
    top: 0 !important;
    white-space: nowrap;
}
#gl-container #gl-searchbox, #gl-container #gl-actionbox
{
    height: ` + MAIN_FORMS_HEIGHT + `;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
}
/* Search Box */
#gl-container #gl-searchform input
{
    height: ` + MAIN_FORMS_HEIGHT + `;
    max-height: ` + MAIN_FORMS_HEIGHT + `;
    min-height: ` + MAIN_FORMS_HEIGHT + `;
    padding: 0 3px;
    text-align: left;
}
#gl-container #gl-searchform #gl-searchtext
{
    max-width: 115px;
    min-width: 50px;
}
#gl-container #gl-searchbox #gl-scount
{
    background-color: ` + MAIN_CLR_BG + `;
    font-size: smaller !important;
    max-width: 28px;
    min-width: 5px;
    text-align: center;
}
/* Action Box */
#gl-container #gl-actionbox #gl-awide
{
    margin-left: 6px;
}
/* Result Box */
#gl-container #gl-resultbox
{
    max-height: 99%;
    max-width: 225px;
    min-height: 1%;
    min-width: 225px;
    overflow: auto;
    width: 225px;
}
#gl-container #gl-resultbox #gl-resultplain, #gl-container #gl-resultbox #gl-resultlink
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    border: transparent none 0;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    display: block;
    left: 0 !important;
    max-height: 99%;
    max-width: 225px;
    min-height: 1%;
    min-width: 225px;
    height: 96%;
    overflow-y: auto;
    overflow-x: auto;
    padding: 2px;
    position: absolute !important;
    scrollbar-color: ` + SCROLLBAR_CLR_RULER + ` ` + SCROLLBAR_CLR_BG + `;
    scrollbar-width: initial;
    top: 1px !important;
    width: 225px;
    white-space: nowrap;
}
#gl-container #gl-resultbox #gl-resultplain
{
    visibility: visible;
    z-index: 910;
}
#gl-container #gl-resultbox #gl-resultlink
{
    visibility:hidden;
    z-index: 909;
}
#gl-container #gl-resultbox table, #gl-container #gl-resultbox tr, #gl-container #gl-resultbox td, #gl-container #gl-resultbox span
{
    background-color: ` + MAIN_FORMS_CLR_BG + `;
    color: ` + MAIN_FORMS_CLR_TEXT + `;
    font-family: ` + MAIN_FONT_TYPE + `;
    margin: 0;
    padding: 0;
    white-space: nowrap;
}
#gl-container #gl-resultbox #gl-resultplain td, #gl-container #gl-resultbox #gl-resultplain span
{
    font-size: 9pt;
    line-height: 10pt;
}
#gl-container #gl-resultbox #gl-resultplain td:hover, #gl-container #gl-resultbox #gl-resultplain span:hover
{
    background-color: ` + HOVER2_CLR_BG + `;
    color: ` + HOVER2_CLR_TEXT + `;
}
#gl-container #gl-resultbox #gl-resultlink a
{
    font-size: 10pt;
    line-height:11pt;
}
`;
