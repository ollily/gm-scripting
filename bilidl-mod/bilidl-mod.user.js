// ==UserScript==
// @name            bilidl-mod
// @fullname        bilibili.com downloader (european mod)
// @description     Download bilibili videos (european mod)
// @author          ollily2907
// @license         MIT License
// @homepageURL     https://github.com/ollily/gm-scripting
// @supportURL      https://github.com/ollily/gm-scripting
// @downloadURL     https://raw.githubusercontent.com/ollily/gm-scripting/grab_links/grab_links.user.js
// @installURL      https://raw.githubusercontent.com/ollily/gm-scripting/grab_links/grab_links.user.js
// @updateURL       https://raw.githubusercontent.com/ollily/gm-scripting/grab_links/grab_links.user.js
// @source          https://raw.githubusercontent.com/ollily/gm-scripting/grab_links/grab_links.user.js
// @icon            https://raw.githubusercontent.com/ollily/gm-scripting/master/grab_links/resource/gl_logo.png
// @compatible      firefox >=52
// @compatible      chrome >=57
// @namespace       http://userscripts.org/users/ollily
// @run-at          document-idle
// @version         0.01.000
// @match                https://www.bilibili.com/bangumi/play/*
// @match                https://www.bilibili.com/video/*
// @grant                none
// @require              https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js
// @require              https://unpkg.com/@ffmpeg/ffmpeg@0.7.0/dist/ffmpeg.min.js
// @require              https://cdnjs.cloudflare.com/ajax/libs/jquery/1.7.2/jquery.min.js
// ==/UserScript==

//
//GM-Script specific code - START
//

(function () {
    "use strict";
    let btnGet = "Get";
    let controller, fileName, dataObj, qualityList, videoList;
    let span = document.createElement("span"),
        option = document.createElement("option"),
        div = document.createElement("div"),
        select = document.createElement("select"),
        button = document.createElement("button");
    let loop = function (i) {
        if ($(i)[0] === undefined) {
            setTimeout(() => {
                loop(i);
            }, 1000);
        } else {
            fileName = $(i)[0].textContent;
        }
    };

    if ($(".special-cover")[0] != undefined) {
        div.style.position = "absolute";
    }
    div.style.marginLeft = "137.667px";
    button.style.width = "90px";
    button.style.height = "49px";
    button.style.fontSize = "20px";
    select.style.fontSize = "20px";
    select.style.height = "45px";
    select.style.width = "320px";
    span.style.fontSize = "20px";
    button.setAttribute("v-on:click", "click");
    option.setAttribute("v-for", "i in options");
    button.textContent = "{{text}}";
    option.textContent = "{{ i }}";
    span.textContent = "{{text}}";

    if (window.location.href.match(/video/)) {
        $("#video-page-app")[0].after(div);
        div.prepend(select);
        select.after(button);
        select.prepend(option);
        button.after(span);
        loop(".tit");
    } else if (window.location.href.match(/bangumi/)) {
        $("#app")[0].before(div);
        div.prepend(select);
        select.after(button);
        select.prepend(option);
        button.after(span);
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

    let statVm = new Vue({
        el: span,
        data: {
            text: ""
        }
    });

    let buttVm = new Vue({
        el: button,
        data: {
            text: btnGet,
            signal: false
        },
        methods: {
            click: function () {
                if (buttVm.signal === false) {
                    controller = new AbortController();
                    this.signal = true;
                    this.stat2();
                    for (let i = 0; i < seleVm.$el.length; i++) {
                        let s = seleVm.$el[i];
                        if (s.selected === true) {
                            this.download(i);
                        }
                    }
                } else {
                    //abort
                    this.signal = false;
                    controller.abort();
                    this.stat1();
                    statVm.text = " 已取消!";
                }
            },
            download: async function (i) {
                try {
                    let resV = await fetch(videoList[i].baseUrl.replace("http:", "https:"), {signal: controller.signal});
                    let resA = await fetch(dataObj.dash.audio[0].baseUrl.replace("http:", "https:"), {signal: controller.signal});
                    const readerV = resV.body.getReader();
                    const readerA = resA.body.getReader();
                    const VcontentLength = resV.headers.get("Content-Length");
                    const AcontentLength = resA.headers.get("Content-Length");
                    const totalLength = ((parseInt(VcontentLength) + parseInt(AcontentLength)) / (1024 * 1024)).toFixed(2);
                    let receivedLength = 0;
                    let vchunks = [];
                    let achunks = [];
                    //fetch progress
                    while (true) {
                        const {done, value} = await readerV.read();
                        if (done) {
                            break;
                        }
                        vchunks.push(value);
                        receivedLength += value.length;
                        statVm.text = ` DL:${(parseFloat(receivedLength) / 1024 / 1024).toFixed(2)}MiB Aprox:${totalLength}MiB`;
                    }
                    while (true) {
                        const {done, value} = await readerA.read();
                        if (done) {
                            break;
                        }
                        achunks.push(value);
                        receivedLength += value.length;
                        statVm.text = ` DL:${(parseFloat(receivedLength) / 1024 / 1024).toFixed(2)}MiB Aprox:${totalLength}MiB`;
                    }
                    let vblob = new Blob(vchunks);
                    let ablob = new Blob(achunks);
                    statVm.text = ` Apply... Aprox:${totalLength}MiB`;
                    let result = await mergeVideo(vblob, ablob);
                    let blob = new Blob([result.data]);
                    let dl = document.createElement("a");
                    dl.download = `${fileName}.mp4`;
                    dl.href = URL.createObjectURL(blob);
                    dl.click();
                    URL.revokeObjectURL(dl.href);
                    dl.remove();
                    statVm.text = ` Multiplexing! Total:${totalLength}MiB`;
                    this.stat1();
                    this.signal = false;
                } catch (err) {
                    console.log(err.name);
                    if (err.name != "AbortError") {
                        statVm.text = " An error occurred! Please try again";
                    }
                    this.stat1();
                }
            },
            stat1: function () {
                this.text = "download";
                this.$el.style.backgroundColor = "";
            },
            stat2: function () {
                this.text = "cancel";
                this.$el.style.backgroundColor = "#99ccff";
            }
        }
    });

    try {
        // parse url
        for (let i = 0; i < document.querySelectorAll("script").length; i++) {
            if (/^window.__playinfo__/.test(document.querySelectorAll("script")[i].innerText)) {
                dataObj = JSON.parse(document.querySelectorAll("script")[i].innerText.replace("window.__playinfo__=", "")).data;
                break;
            }
        }
        qualityList = [];
        videoList = dataObj.dash.video;
        videoList.forEach((item, index) => {
            let fps;
            if (item.id == 116 || item.id == 74) {
                fps = "60";
            } else {
                fps = "";
            }
            qualityList[index] = item.height + "p" + fps + " " + item.mimeType.replace(/....../, "") + "-" + item.codecs;
        });
    } catch (err) {
        //error when parsing premium video with non-premium account or getting network issue
        statVm.text = " Analysis error! Try refreshing page";
        buttVm.$el.disabled = true;
    }

    let optionsList = {options: qualityList};
    let seleVm = new Vue({
        el: select,
        data: optionsList
    });
})();
//
//GM-Script specific code - END
//


//
//GM-Script - END
//

