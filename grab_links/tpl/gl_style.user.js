const CLR_BG = "#e0e0e0"; //"#CED8F6";
const CLR_FRMS_BRD = "#808080"; //"#819FF7";
const CLR_FRMS_BG = "#ffffff";
const CLR_FRMS_TX = "#000000";
const FRMS_HGT = "20px !important";
const CLR_HOV = "#e0e0e0";
const CLR_HOV_BG = "#A80000";
const CLR_HOV2 = "#A80000";
const CLR_FOC = "#FFFFCC";
const SCRB_C1 = "#A00000"; //"#e0e0e0";
const SCRB_C2 = CLR_FRMS_BRD;
const FNT_FRMS = "Consolas"; //"Arial, Courier New";
const FNT_FRMS_SZ = "10pt !important";

const CSS_STYLE = `
#gl-container
{
    position: fixed !important;
    top: 0 !important;
    right: 1px !important;
    margin: 0;
    padding: 0 2px;
    text-align: left;
    vertical-align: top;
		display: block;
    min-height: 1%;
    max-height: 99%;
    min-width: 225px;
    max-width: 50%;
		width: 225px;
    overflow: hidden;
    z-index: 2147483647;
    color: `+CLR_FRMS_TX+`;
    font-family: `+FNT_FRMS+`;
    font-size: `+FNT_FRMS_SZ+`;
    line-height: 15px;
    white-space: nowrap;
    scrollbar-color: `+SCRB_C1+` `+SCRB_C2+`;
    scrollbar-width: initial;
    -moz-text-size-adjust: none;
    background-attachment: scroll;
    background-clip: border-box;
    background-color: `+CLR_BG+`;
    background-image: none;
    background-origin: padding-box;
    background-position: 0%;
    background-repeat: repeat;
    background-size: auto;
}
/* General Styles */
#gl-container, #gl-container input, #gl-container button, #gl-container div, #gl-container a:hover
{
    -moz-border-radius: 5px;
    border-radius: 5px;
    border: 0 none `+CLR_FRMS_BRD+`;
    border-image-outset: 0;
    border-image-repeat: stretch;
    border-image-slice: 100%;
    border-image-source: none;
    border-image-width: 0;
}
#gl-container input, #gl-container button
{
    border: 2px solid `+CLR_FRMS_BRD+`;
    color: `+CLR_FRMS_TX+`;
    background-color: `+CLR_FRMS_BG+`;
    font-family: `+FNT_FRMS+`;
    font-size: `+FNT_FRMS_SZ+`;
    font-weight: bold;
    padding: 0;
    margin: 0;
    margin-right: 1px;
    min-height: `+FRMS_HGT+`;
    max-height: `+FRMS_HGT+`;
    height: `+FRMS_HGT+`;
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
    background-color: `+CLR_FOC+`;
}
#gl-container button:hover, #gl-container button:focus
{
    border-color: `+CLR_FRMS_BG+`;
    color: `+CLR_HOV+`;
    background-color: `+CLR_HOV_BG+`;
}
#gl-container a {
    color: `+CLR_FRMS_TX+`;
    background-color: `+CLR_FRMS_BG+`;
		text-decoration: underline dotted `+CLR_FRMS_TX+`;
    white-space: nowrap;
}
#gl-container a:hover {
    color: `+CLR_HOV+`;
    background-color: `+CLR_HOV_BG+`;
		text-decoration: none transparent;
}
#gl-container #gl-searchbox, #gl-container #gl-actionbox, #gl-container #gl-resultbox
{
    position: relative !important;
    top: 0 !important;
    left: 0 !important;
		display: block;
    padding: 0;
    margin: 0;
    border: transparent none 0;
    white-space: nowrap;
}
#gl-container #gl-searchbox, #gl-container #gl-actionbox
{
    min-height: `+FRMS_HGT+`;
    max-height: `+FRMS_HGT+`;
    height: `+FRMS_HGT+`;
}
/* Search Box */
#gl-container #gl-searchform input
{
    text-align: left;
    padding: 0 3px;
    min-height: `+FRMS_HGT+`;
    max-height: `+FRMS_HGT+`;
    height: `+FRMS_HGT+`;
}
#gl-container #gl-searchform #gl-searchtext
{
    min-width: 50px;
    max-width: 115px;
}
#gl-container #gl-searchbox #gl-scount
{
    text-align: center;
    background-color: `+CLR_BG+`;
    min-width: 5px;
    max-width: 25px;
}
/* Action Box */
#gl-container #gl-actionbox #gl-awide
{
		margin-left: 6px;
}
/* Result Box */
#gl-container #gl-resultbox
{
    min-height: 1%;
    max-height: 99%;
    min-width: 225px;
    max-width: 225px;
		width: 225px;
    overflow: auto;
}
#gl-container #gl-resultbox #gl-resultplain, #gl-container #gl-resultbox #gl-resultlink
{
    position: absolute !important;
    top: 1px !important;
    left: 0 !important;
    min-height: 1%;
    max-height: 99%;
    min-width: 225px;
    max-width: 225px;
		width: 225px;
		height: 96%;
    border: transparent none 0;
    scrollbar-color: `+SCRB_C1+` `+SCRB_C2+`;
    scrollbar-width: initial;
    overflow-y: auto;
		overflow-x: auto;
		padding: 2px;
    color: `+CLR_FRMS_TX+`;
    background-color: `+CLR_FRMS_BG+`;
    white-space: nowrap;
		display: block;
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
#gl-container #gl-resultbox table, #gl-container #gl-resultbox tr, #gl-container #gl-resultbox td
{
    margin: 0;
    padding: 0;
    white-space: nowrap;
    color: `+CLR_FRMS_TX+`;
    background-color: `+CLR_FRMS_BG+`;
    font-family: `+FNT_FRMS+`;
}
#gl-container #gl-resultbox #gl-resultplain td
{
    font-size: 9pt;
    line-height: 100%;
}
#gl-container #gl-resultbox #gl-resultplain td:hover
{
    color: `+CLR_HOV2+`;
}
#gl-container #gl-resultbox #gl-resultlink a
{
    font-size: 10pt;
    line-height:120%;
}
#gl-container #gl-actionbo, #gl-container #gl-resultbo, #gl-container #gl-searchbo
{
    visibility: hidden !important;
    display: none !important;
}
`;
