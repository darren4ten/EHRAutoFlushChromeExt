//1. chrome进入到eHR补单申请页面
//2. F12后选择控制台(Console)
//3. 把下面脚本贴到控制台回车
//4. 控制台输入形如autoFill('1.1,1.2,1.3p,1.4')后回车即可。
//autoFill参数为一到多个日期，用逗号分割;如果日期后有p表示补晚上的, 无p表示补早上的

////脚本
//window.autoFill = (function (getData, send, values) {
//    return function (dates) {
//        if (!dates) return;
//        var empId = values.empId();
//        var personId = values.personId();

//        dates = dates.split(',');
//        for (var i = 0; i < dates.length; i++) {
//            var s = dates[i];
//            var x = s.split('p');
//            var morning = x.length == 1;
//            var d = x[0].split('.');

//            var o = getData(empId, personId, d[0] * 1, d[1] * 1, morning);
//            send(values, o);
//        }
//        location.reload();
//    };
//})(function (empId, personId, month, day, morning, time) {
//    var getDate = function (year, month, day, z) {
//        var m = month > 9 ? month : ('0' + month);
//        var d = day > 9 ? day : ('0' + day);
//        if (z) {
//            return [year, '-', m, '-', d, 'T00:00:00.000Z'].join('');
//        }

//        return [year, '-', m, '-', d].join('');
//    };
//    morning = morning === undefined ? true : morning;
//    var year = new Date().getFullYear();
//    var date = getDate(year, month, day, true);
//    time = time || (morning ? '09:00' : '18:00');

//    var submitModel = {
//        "currentData": {
//            "Attenddate": date,
//            "timecardtypeid": morning ? 'ONWORK' : 'OFFWORK',
//            "carddate": date,
//            "cardtime": time,
//            "reasonid": "c005e8fb-2274-482a-a801-d7009a1e3a92",
//            "shoulddate": date.split('T')[0],
//            "shouldtime": time,
//            "recordId": ''
//        },
//        "personId": personId,
//        "classnae": "办公室白班",
//        "timecardtypeidText": morning ? '上班' : '下班',
//        "reasonidText": "漏刷卡",
//        "empId": empId,
//        "itemNo": 0,
//        "isAddNew": true
//    };

//    return submitModel;
//}, function (values, submitModel, then) {
//    var s = JSON.stringify(submitModel);
//    window.console && window.console.log(s);
//    var url = values.url();
//    window.console && window.console.log(url);

//    $.ajax({
//        async: false,
//        url: url,
//        type: 'post',
//        contentType: 'application/json',
//        dataType: 'json',
//        data: s,
//        success: function (response) {
//            window.console && window.console.log(JSON.stringify(response));
//            if (!response.flag) {
//                window.bg && bg.warning("", response.message);
//                flag = false;

//                window.console && window.console.log('fail');
//            }
//            else {
//                if (response.message) {
//                    window.bg && bg.warning("", response.message);
//                }
//                if (response.data.warning) {
//                    window.bg && bg.warning("", response.data.warning);
//                }

//                window.console && window.console.log('success');
//            }

//            then && then();
//        }
//    });
//}, (function () {
//    var win = function () { return window.frames['main']; };
//    return {
//        url: function () { return (function (w) { return w.kendo.format('{0}/BPM/Forms/HcmForm27/ValidDataBeforeSave?formkind={1}&formNo={2}', w.baseUrl, w._opts.model.formKind, w._opts.model.formNo); })(win()); },
//        empId: function () { return win().$("#fm_emp_Id").data("ehrStaffPicker").value().staffNo; },
//        personId: function () { return win().$('#fm_emp_Id').val(); }
//    };
//})());



/*
 * 自动获取需要补卡的日期
 */
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

var fetchTool = {
    opts: {
        userName: "",//默认空表示本人
        startDate: "2017-02-12",
        endDate: "2017-02-22",
        init: function (callback) {
            var that = this;
            chrome.extension.sendRequest({
                action: 'getLocData', key: 'ehrStartDate'
            }, function (response) {
                that.startDate = response && response.length ? response : fetchTool.getDefaultStartAndEnd().start;
                that.startDate = new Date(that.startDate).format("yyyy-MM-dd");
                chrome.extension.sendRequest({
                    action: 'getLocData', key: 'ehrEndDate'
                }, function (response) {
                    that.endDate = response && response.length ? response : fetchTool.getDefaultStartAndEnd().end;
                    that.endDate = new Date(that.endDate).format("yyyy-MM-dd");
                    callback && callback(that.startDate, that.endDate);
                });
            });

        },
        urlEHRSearch: "http://172.17.1.89/eHR/eattendance/eAttendanceTimecardData/TimecardDataManage.aspx",
        urlEHRApply: "http://172.17.1.89/eHR/BPM/Form/List?muid=0&formkind=HCM.FORM.27&callphaseid=apply&viewphaseid=apply",//EHR申请补刷卡网址formno=12846&
        urlEHRQueryEmpInfo: "http://172.17.1.89/eHR/eHRForBPM/EHRStaff/asyncsuggest?functionCode=010110250&multi=false&muid=0&isCrossMu=false&isShowChildren=false&activeStatus=true&AccessionStateScope=1%2C2%2C3%2C4%2C5%2C6&muid=0&isCrossMu=false",
        urlEHRCreateForm: "http://172.17.1.89/eHR/BPM/SystemAction/CreateForm?FormKind=HCM.FORM.27"
    },
    tips: {
        headerTipTmp: '<div id="formMsg" class="" style="line-height: 30px; text-align: center;color: green; font-weight: bold;  font-size: 20px;">@Msg</div>',
        applyHeaderTipProcessingMsg: "[EHR自动补刷卡插件]正在自动填写表单，请稍后...",
        applyHeaderTipCompletedMsg: "[EHR自动补刷卡插件]已完成自动填写表单，请检查补卡记录是否正确(默认是非星期天都需要补刷，查询完成之后窗口会自动关闭).",
        queryHeaderTipMsg: "[EHR自动补刷卡插件]正在自动查询需要补刷记录.(默认是非星期天都需要补刷，查询完成之后窗口会自动关闭)"
    },
    //开始查询打开数据
    startFetchData: function () {
        console.log("fetchTool init;");
        var setting = this.getPageSettings();
        if (!setting.needQuery && !setting.needPage) {
            var results = this.getUnApplyDays();
            if (results && results.length > 0) {
                this.loadEHRApplyPage(results.join(','));
                console.log("自动填写完毕");
            } else {
                alert("在" + this.opts.startDate + "到" + this.opts.endDate + "没有需要补刷的记录（默认规则，只有工作日需要打开）");
                console.log("自动填写完毕,没有需要补刷的记录");
            }
        }
    },
    //开始提交补卡数据
    startFillApplyData: function () {
        //从URL中查看需要补卡的数据
        var params = this.getParam("applyDaysString");
        if (params.length > 0) {
            //this.fillForm.configs.win = window.frames['main'];
            this.fillForm.autoFill(params);
        }
    },
    //是否是EHR打卡数据查询页
    isValidQueryUrl: function () {
        return window.location.href.lastIndexOf("eHR/eattendance/eAttendanceTimecardData") > -1 && this.getParam("fromPlugin") == 1;
    },
    //是否是填写EHR补卡信息的页面
    isValidApplyUrl: function () {
        return window.location.href.lastIndexOf("eHR/BPM/Form/List") > -1 && this.getParam("fromPlugin") == 1 && this.getParam("isFilled") != 1;
    },
    //获取默认的开始结束时间
    getDefaultStartAndEnd() {
        var today = new Date();
        var lastMonth = today.add("m", -1);
        var start = lastMonth.getFullYear() + "-" + (lastMonth.getMonth() + 1) + "-20";
        var end = today.getFullYear() + "-" + (today.getMonth() + 1) + "-20";
        return {
            start: start, end: end
        };
    },
    //如果需要更新设置信息，则返回true
    getPageSettings: function () {
        var needQuery = false;
        var needPage = false;

        //如果没有查询过，就查询
        //如果查询过且没有切换页面，则切换页面
        if (this.getParam("isQueryed") != 1) {
            //设置起始日期
            $("#txtDateF_GuruDate").val(this.opts.startDate);
            $("#txtDateT_GuruDate").val(this.opts.endDate);
            $("#Form1").attr("action", $("#Form1").attr("action") + "&isQueryed=1");
            $("#UserQuery1_nImgSearch").click();
            needQuery = true;
        } else if (this.getParam("isQueryed") == 1 && this.getParam("isPaged") != 1) {
            $("#Form1").attr("action", $("#Form1").attr("action") + "&isPaged=1");
            //设置最大页数
            $(".pager-sizes").val(200);

            var ev = document.createEvent("HTMLEvents");
            ev.initEvent("change", false, true);
            $(".pager-sizes")[0].dispatchEvent(ev);
            needPage = true;
        }
        return {
            needPage: needPage, needQuery: needQuery
        };
    },
    loadEHRQueryPage: function () {
        console.log(this.opts.urlEHRSearch);
        var that = this;
        var win = window.open(this.opts.urlEHRSearch + "?fromPlugin=1");
    },
    loadEHRApplyPage: function (applyDaysString) {
        var that = this;
        $.post(that.opts.urlEHRCreateForm, function (formData) {
            var win = window.open(that.opts.urlEHRApply + "&formno=" + formData.data.formNo + "&fromPlugin=1&applyDaysString=" + applyDaysString);
            //window.close();
        });
    },
    getParam: function (name) {
        return this.getUrlParam(window.location.href)[name];
    },
    getUrlParam: function (string) {
        var obj = {
        };
        if (string.indexOf("?") != -1) {
            var string = string.substr(string.indexOf("?") + 1);
            var strs = string.split("&");
            for (var i = 0; i < strs.length; i++) {
                var tempArr = strs[i].split("=");
                obj[tempArr[0]] = unescape(tempArr[1]);
            }
        }
        return obj;
    },
    //获取所有的需要刷卡的日期
    getAllNeedApplyDays: function (start, end, $table) {
        start = new Date(start);
        end = new Date(end);
        var result = [];
        while (start <= end) {
            if (start.getDay() != 6 && start.getDay() != 0) {
                //如果不是周六周日，则认为需要刷卡
                var dateStr = start.format("yyyy-MM-dd");
                var flushDateItems = $table.find('td:nth-child(7):contains(' + dateStr + ')');
                //默认都没有刷卡
                var isFlushedAM = false;
                var isFlushedPM = false;
                for (var i = 0; i < flushDateItems.length; i++) {
                    var $item = $(flushDateItems[i]);
                    var flushTime = $item.next('td').text();
                    var parts = flushTime.split(":");
                    var hour = parseInt(parts[0]);
                    var min = parseInt(parts[1]);
                    var sec = parseInt(parts[2]);
                    if (hour < 9 || (hour == 9 && min <= 0)) {
                        isFlushedAM = true;
                    }
                    if (hour >= 18 && min >= 0) {
                        isFlushedPM = true;
                    }
                }

                //生成补卡数据
                if (!isFlushedAM) {
                    result.push(dateStr);
                }
                if (!isFlushedPM) {
                    result.push(dateStr + "p");
                }
            }
            start = start.add("d", 1);
            console.log(start);
        }
        return result;
    },
    getUnApplyDays: function () {
        //只要不是周六周日则认为必须刷，如果刷卡时间不在规定范围内则也需要补刷
        var $table = $("#G_ugridCardData");
        var results = this.getAllNeedApplyDays(this.opts.startDate, this.opts.endDate, $table);
        console.log(results);
        return results;
    },
    //获取员工信息
    getEmpData: function (obj) {
        $.post(this.opts.urlEHRQueryEmpInfo, function (data) {
            var curItem = data.records[0];
            obj.fillForm.configs.empId = curItem.staffNo;
            obj.fillForm.configs.personId = curItem.id;
            obj && obj.startFillApplyData();
        });
    },
    fillForm: {
        configs: {
            win: window.frames['main'],
            url: function () {
                return 'http://172.17.1.89/eHR/BPM/Forms/HcmForm27/ValidDataBeforeSave?formkind=' + fetchTool.getParam("formkind") + '&formNo=' + fetchTool.getParam("formno");
            },
            empId: null,
            personId: null
        },
        send: function (submitModel, then) {
            var s = JSON.stringify(submitModel);
            window.console && window.console.log(s);
            var that = this;
            var url = that.configs.url();
            window.console && window.console.log(url);

            $.ajax({
                async: false,
                url: url,
                type: 'post',
                contentType: 'application/json',
                dataType: 'json',
                data: s,
                success: function (response) {
                    window.console && window.console.log(JSON.stringify(response));
                    if (!response.flag) {
                        window.bg && bg.warning("", response.message);
                        flag = false;

                        window.console && window.console.log('fail');
                    }
                    else {
                        if (response.message) {
                            window.bg && bg.warning("", response.message);
                        }
                        if (response.data.warning) {
                            window.bg && bg.warning("", response.data.warning);
                        }

                        window.console && window.console.log('success');
                    }

                    then && then();
                }
            });
        },
        getData: function (empId, personId, year, month, day, morning, time) {
            var getDate = function (year, month, day, z) {
                var m = month > 9 ? month : ('0' + month);
                var d = day > 9 ? day : ('0' + day);
                if (z) {
                    return [year, '-', m, '-', d, 'T00:00:00.000Z'].join('');
                }

                return [year, '-', m, '-', d].join('');
            };
            morning = morning === undefined ? true : morning;
            //var year = new Date().getFullYear();
            var date = getDate(year, month, day, true);
            time = time || (morning ? '09:00' : '18:00');

            var submitModel = {
                "currentData": {
                    "Attenddate": date,
                    "timecardtypeid": morning ? 'ONWORK' : 'OFFWORK',
                    "carddate": date,
                    "cardtime": time,
                    "reasonid": "c005e8fb-2274-482a-a801-d7009a1e3a92",
                    "shoulddate": date.split('T')[0],
                    "shouldtime": time,
                    "recordId": ''
                },
                "personId": personId,
                "classnae": "办公室白班",
                "timecardtypeidText": morning ? '上班' : '下班',
                "reasonidText": "漏刷卡",
                "empId": empId,
                "itemNo": 0,
                "isAddNew": true
            };

            return submitModel;
        },
        autoFill: function (dates) {
            var that = this;

            if (!dates) return;
            var empId = that.configs.empId;
            var personId = that.configs.personId;

            dates = dates.split(',');
            for (var i = 0; i < dates.length; i++) {
                var s = dates[i];
                var x = s.split('p');
                var morning = x.length == 1;
                var d = x[0].split('-');

                var o = that.getData(empId, personId, d[0] * 1, d[1] * 1, d[2] * 1, morning);
                that.send(o);
            }
            //补填完成之后，加上Filled标签
            window.location.href = window.location.href + "&isFilled=1";
            console.log("location.reload();");
        }
    }
};
$(function () {
    if (fetchTool.isValidQueryUrl()) {
        fetchTool.opts.init(function (start, end) {
            //fetchTool.opts.startDate = start;
            //fetchTool.opts.endDate = end;
            fetchTool.startFetchData();
            $(fetchTool.tips.headerTipTmp.replace("@Msg", fetchTool.tips.queryHeaderTipMsg)).insertBefore($("form"));
        });
    }
    else if (fetchTool.isValidApplyUrl()) {
        fetchTool.opts.init(function (start, end) {
            //fetchTool.opts.startDate = start;
            //fetchTool.opts.endDate = end;
            fetchTool.getEmpData(fetchTool);
            $(fetchTool.tips.headerTipTmp.replace("@Msg", fetchTool.tips.applyHeaderTipProcessingMsg)).insertBefore($(".container-fluid"));
        });
    }
});