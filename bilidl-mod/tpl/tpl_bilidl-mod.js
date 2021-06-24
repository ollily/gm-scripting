/**
 * Define the global variables used for this script.
 */
const scriptID = "BDM";

(function () {
    "use strict";
    const size_mb = 1048576;
    const size_byt = 1 / size_mb;
    const btnColorText = "#3aaf20";
    const btnColorBg = "#aff5a0";
    const btnColorText2 = "#af2020";
    const btnColorBg2 = "#f5a0a0";
    const btnColorText3 = "#aaaaaa";
    const btnColorBg3 = "#eeeeee";

    let controller, fileName, dataObj, qualityList, videoList;

    let div = gmCreateObj(null, "div", `${scriptID}cont`);
    let select = gmCreateObj(div, "select", `${scriptID}sel`);
    let option = gmCreateObj(select, "option", null);
    let button = gmCreateObj(div, "button", `${scriptID}btnDL`);
    let span = gmCreateObj(div, "span", `${scriptID}prog`);

    let loop = function (searchText) {
        let tmpFile = $(searchText)[0];
        if (tmpFile === undefined) {
            setTimeout(() => {
                loop(searchText);
            }, 1000);
        } else {
            fileName = tmpFile.textContent;
        }
    };

    gmSetStyle(div, "position", "relative");
    gmSetStyle(div, "top", "0");
    gmSetStyle(div, "left", "25px");
    gmSetStyle(div, "margin", "0");
    gmSetStyle(div, "padding", "2px");
    gmSetStyle(div, "font-size", "14px");
    gmSetStyle(div, "font-family", "Tahoma, Arial");
    gmSetStyle(div, "color", "#000000");
    gmSetStyle(div, "background-color", btnColorBg3);
    gmSetStyle(div, "min-width", "100px");
    gmSetStyle(div, "max-width", "380px");
    gmSetStyle(div, "overflow", "visible");
    gmSetStyle(div, "z-index", "99999");
    gmSetStyle(div, "white-space", "nowrap");
    gmSetStyle(div, "border-radius", "4px");

    gmSetStyle(select, "margin", "0");
    gmSetStyle(select, "padding", "3px 5px");
    gmSetStyle(select, "border", "2px solid " + btnColorBg);
    gmSetStyle(select, "max-height", "50px");
    gmSetStyle(select, "max-width", "350px");
    gmSetStyle(select, "border-radius", "4px");

    gmSetStyle(button, "margin", "0 2px");
    gmSetStyle(button, "padding", "2px 5px");
    gmSetStyle(button, "cursor", "pointer");
    gmSetStyle(button, "color", btnColorText);
    gmSetStyle(button, "background-color", btnColorBg);
    gmSetStyle(button, "border", "1px solid " + btnColorText3);
    gmSetStyle(button, "border-radius", "4px");
    button.setAttribute("v-on:click", "click");
    button.textContent = "{{text}}";

    option.setAttribute("v-for", "i in options");
    option.textContent = "{{ i }}";

    gmSetStyle(span, "font-size", "8pt");
    gmSetStyle(span, "line-height", "9pt");
    gmSetStyle(span, "padding", "0 5px");
    span.textContent = "{{text}}";

    if (window.location.href.match(/video/)) {
        $("#video-page-app")[0].after(div);
        loop(".tit");
    } else if (window.location.href.match(/bangumi/)) {
        $("#app")[0].before(div);
        loop(".bilibili-player-video-top-title");
    }

    //merge
    const ffWorker = FFmpeg.createWorker();
    (async function () {
        await ffWorker.load();
    })();
    let mergeVideo = async (video, audio) => {
        await ffWorker.write("video.mp4", video);
        await ffWorker.write("audio.mp4", audio);
        await ffWorker.run("-i video.mp4 -i audio.mp4 -c copy output.mp4", {
            input: ["video.mp4", "audio.mp4"],
            output: "output.mp4"
        });
        let data = await ffWorker.read("output.mp4");
        await ffWorker.remove("output.mp4");
        return data;
    };

    let statusVm = new Vue({
        el: span,
        data: {
            text: ""
        }
    });

    let buttonVm = new Vue({
        el: button,
        data: {
            text: "Get",
            signal: false
        },
        methods: {
            click: function () {
                if (buttonVm.signal === false) {
                    controller = new AbortController();
                    this.signal = true;
                    this.stat2();
                    for (let idxStreams = 0; idxStreams < selectVm.$el.length; idxStreams++) {
                        let s = selectVm.$el[idxStreams];
                        if (s.selected === true) {
                            this.download(idxStreams);
                        }
                    }
                } else {
                    //abort
                    this.signal = false;
                    controller.abort();
                    this.stat1();
                    statusVm.text = " Cancelled!";
                }
            },
            download: async function (stream) {
                try {
                    let resV = await fetch(videoList[stream].baseUrl.replace("http:", "https:"), {signal: controller.signal});
                    let resA = await fetch(dataObj.dash.audio[0].baseUrl.replace("http:", "https:"), {signal: controller.signal});
                    const readerV = resV.body.getReader();
                    const readerA = resA.body.getReader();
                    const VcontentLength = resV.headers.get("Content-Length");
                    const AcontentLength = resA.headers.get("Content-Length");
                    const totalLength = ((parseInt(VcontentLength) + parseInt(AcontentLength)) / (size_mb)).toFixed(1);

                    let receivedLength = 0;
                    let vchunks = [];
                    let achunks = [];

                    let bProc = true;
                    //fetch video
                    while (true) {
                        const {done, value} = await readerV.read();
                        if (done) {
                            break;
                        }
                        vchunks.push(value);
                        receivedLength += value.length;
                        if (bProc) {
                            progress(statusVm, receivedLength, totalLength);
                        }
                        bProc = !bProc;
                    }
                    //fetch audio
                    while (true) {
                        const {done, value} = await readerA.read();
                        if (done) {
                            break;
                        }
                        achunks.push(value);
                        receivedLength += value.length;
                        if (bProc) {
                            progress(statusVm, receivedLength, totalLength);
                        }
                        bProc = !bProc;
                    }
                    statusVm.text = ` ${totalLength}MB`;

                    // prepare download link
                    let vblob = new Blob(vchunks);
                    let ablob = new Blob(achunks);
                    let result = await mergeVideo(vblob, ablob);
                    let blob = new Blob([result.data]);

                    //let dl = document.createElement("a");
                    let dl = gmCreateObj(null, "a", scriptID + "aDL");
                    dl.download = `${fileName}.mp4`;
                    dl.href = URL.createObjectURL(blob);
                    dl.click();
                    URL.revokeObjectURL(dl.href);
                    dl.remove();

                    statusVm.text = ` Done:${totalLength}MB`;
                    this.stat1();
                    this.signal = false;
                } catch (err) {
                    console.log(err.name);
                    if (err.name !== "AbortError") {
                        statusVm.text = " An error occurred! Please try again";
                    }
                    this.stat1();
                }
            },
            stat1: function () {
                this.text = "download";
                this.$el.style.backgroundColor = btnColorBg;
                this.$el.style.color = btnColorText;
            },
            stat2: function () {
                this.text = "cancel";
                this.$el.style.backgroundColor = btnColorBg2;
                this.$el.style.color = btnColorText2;
            }
        }
    });

    try {
        // parse url
        for (let idxScript = 0; idxScript < document.querySelectorAll("script").length; idxScript++) {
            if (/^window.__playinfo__/.test(document.querySelectorAll("script")[idxScript].innerText)) {
                dataObj = JSON.parse(document.querySelectorAll("script")[idxScript].innerText.replace("window.__playinfo__=", "")).data;
                break;
            }
        }
        qualityList = [];
        videoList = dataObj.dash.video;
        videoList.forEach((item, index) => {
            let fps;
            if (item.id === 116 || item.id === 74) {
                fps = "60";
            } else {
                fps = "  ";
            }
            qualityList[index] = item.height + "p" + fps + " " + item.mimeType.replace(/....../, "") + "-" + item.codecs;
        });
    } catch (err) {
        //error when parsing premium video with non-premium account or getting network issue
        statusVm.text = " Analysis error! Try refreshing page";
        buttonVm.$el.disabled = true;
    }

    let optionsList = {options: qualityList};
    let selectVm = new Vue({
        el: select,
        data: optionsList
    });

    /**
     *
     * @param {HTMLElement} el
     * @param {number|string} proc
     * @param {number|string} totalLength
     */
    function progress(el, proc, totalLength) {
        let curProc = (parseFloat(proc) * size_byt).toFixed(1);
        el.text = ` ${curProc}/${totalLength}MB`;

    }
})();