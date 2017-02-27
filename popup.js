// JavaScript source code
// popup.js
Date.prototype.add = function (strInterval, Number) {
    var dtTmp = this;
    switch (strInterval) {
        case 's': return new Date(Date.parse(dtTmp) + (1000 * Number));
        case 'n': return new Date(Date.parse(dtTmp) + (60000 * Number));
        case 'h': return new Date(Date.parse(dtTmp) + (3600000 * Number));
        case 'd': return new Date(Date.parse(dtTmp) + (86400000 * Number));
        case 'w': return new Date(Date.parse(dtTmp) + ((86400000 * 7) * Number));
        case 'q': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number * 3, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'm': return new Date(dtTmp.getFullYear(), (dtTmp.getMonth()) + Number, dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
        case 'y': return new Date((dtTmp.getFullYear() + Number), dtTmp.getMonth(), dtTmp.getDate(), dtTmp.getHours(), dtTmp.getMinutes(), dtTmp.getSeconds());
    }
};
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds()
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}


window.onload = function () {
    var today = new Date();
    var lastMonth = today.add("m", -1);
    var start = lastMonth.getFullYear() + "-" + (lastMonth.getMonth() + 1) + "-20";
    var end = today.getFullYear() + "-" + (today.getMonth() + 1) + "-20";

    document.getElementById("txtStart").value = start;
    document.getElementById("txtEnd").value = end;
    //$("#txtStart").val(start);
    //$("#txtEnd").val(end);

    document.getElementById("btnStartEHR").onclick = function () {
        //localStorage.setItem("ehrStartDate", document.getElementById("txtStart").value);
        //localStorage.setItem("ehrEndDate", document.getElementById("txtEnd").value);

        chrome.extension.sendMessage({
            type: "btnStartEHR",
            start: document.getElementById("txtStart").value,
            end: document.getElementById("txtEnd").value,
        });
    }
}


