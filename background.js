function loadEHRpage() {
    window.open("http://172.17.1.89/eHR/eattendance/eAttendanceTimecardData/TimecardDataManage.aspx?fromPlugin=1");
}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {
    switch (request.type) {
        case "dom-loaded":
            //alert("dom-loaded");
            break;
        case "btnStartEHR":
            {
                localStorage.setItem("ehrStartDate", request.start);
                localStorage.setItem("ehrEndDate", request.end);
                //sendResponse({ ehrStartDate: request.start, ehrEndDate: request.end });
                //alert(request.start);
                loadEHRpage();
            }
            break;
            //case "getLocData": {
            //    alert(localStorage.getItem(request.key));
            //    sendResponse(localStorage.getItem(request.key));
            //}; break;
    }
    return true;
});


function onRequest(request, sender, sendResponse) {
    if (request.action == 'getLocData') {
        //alert("Background:" + request.key + ";" + localStorage.getItem(request.key));
        sendResponse(localStorage.getItem(request.key));
    }
};
chrome.extension.onRequest.addListener(onRequest);

