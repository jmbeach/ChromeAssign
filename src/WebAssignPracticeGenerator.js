function WebAssignPracticeGenerator() {
    var me = this;
    var strSelectButtons = "input[name*=Practice]";
    var strRemoveFromOnClick = ""
    WebAssignPracticeGenerator.prototype.PracticeUrls = function () {
        var $btns = $(strSelectButtons);
        var urls = [];
        for (var i = 0; i < $btns.length; i++) {
            var $btn = $($btns[i]);
            // get btn onclick
            var onclick = $btn.attr("onclick");
            onclick = onclick.replace("waUtil.openWindow('", "");
            var indexOfEndOfUrl = onclick.indexOf("'");
            var url = onclick.substring(0, indexOfEndOfUrl - 1);
            urls.push(url);
        }
        return urls;
    }
    var _getHtml = function (url,index,length, htmls,callback) {
        var i = index;
        var len = length;
        $.ajax({
            url: url,
            success: function (data) {
                htmls[i] = data;
                if (htmls.length == len) {
                    callback(null, htmls);
                }
            },
            error: function (err) {
                console.log(err);
                callback(err);
            }
        });
    }
    var makeIframe = function (url) {
        return "<iframe src=\"https://webassign.net" + url + "\" width=\"100%\" height=\"600px\"></iframe>";
    };
    WebAssignPracticeGenerator.prototype.GetHtmls = function (callback) {
        var urls = me.PracticeUrls();
        var htmls = [];
        if (!urls.length) return;
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            _getHtml(url,i, urls.length,htmls,callback);
        }
    }
    WebAssignPracticeGenerator.prototype.GetHtmlIframes = function () {
        var urls = me.PracticeUrls();
        if (!urls.length) return;
        var body = '<button id="printButton" >Print this page<\/button>';
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            body += makeIframe(url)
        }
        return body;
    }
    WebAssignPracticeGenerator.prototype.GeneratePracticeHtml = function (callback) {
        me.GetHtmls(function (err, htmls) {
            if (err) callback(err);
            var body = "";
            for (var i = 0; i < htmls.length; i++) {
                var html = htmls[i];
                var $html = $.parseHTML(html);
                var inner = $html[89];
                var $inner = $(inner);
                var strProblem = $inner.html();
                body += strProblem;
            }
            var re = /\<img.*src\=\"\//g;
            body = body.replace(re, '<img src="https://webassign.net/');
            re = /(\<form.*action\=\")\//g;
            body = body.replace(re, '$1https://webassign.net/');
            re = /(\<form.*method\=\"post\".*)(\>)/g;
            body = body.replace(re, '$1 target="_blank">');
            callback(null, body);
        });
    }
	var addScript = function(document,src) {
		var baseUrl = "chrome-extension://mnccjognhpkgdbcjbmpmhedbbdpoomkg/lib/";
		var script = document.createElement("script");
		script.src = +baseUrl + src;
		document.body.appendChild(script);
	};
	var addRawJs = function (head, src) {
	    var script = $("<script type=\"text/javascript\">" + src + "<\/script>");
	    head.appendChild(script[0]);
	}
	var addCss = function (head, src) {
	    var link = $("<link rel=\"stylesheet\" type=\"text/css\" href=\"" + src + "\"/>");
	    head.appendChild(link[0]);
	};
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.WA == "generate") {
            //me.GeneratePracticeHtml(function (err, res) {
            //    var css = [
            //        "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/common/css/layout.css",
            //        "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/common/css/student.css",
            //        "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/common/css/nav.css",
            //        "https://webassign.net/wastatic/wacache96da2f590cd7246bbde0051047b0d6f7/themes/css/blue.css",
            //        "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/questions/css/question.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/css/question/mark.css"
            //        , "https://webassign.net/wastatic/wacache96da2f590cd7246bbde0051047b0d6f7/popup/css/form.css"
            //        , "https://webassign.net/wastatic/wacache96da2f590cd7246bbde0051047b0d6f7/popup/css/nav.css"
            //        , "https://webassign.net/wastatic/wacache96da2f590cd7246bbde0051047b0d6f7/popup/css/popup.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/common/css/tabs.css"
            //        , "https://webassign.net/wastatic/wacache96da2f590cd7246bbde0051047b0d6f7/forms/css/newpassword.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/css/questions/assets.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/css/pads/graphingtool/application.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/css/pads/numberline/style.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/css/pads/mathpad/expressionpad.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/pads/css/pad.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/pads/css/calcPad.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/pads/css/mathPad.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/pads/css/physPad.css",
            //        "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/pads/css/chemPad.css"
            //        , "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/css/print.css"
            //        ,"https://webassign.net/vendor/wacache96da2f590cd7246bbde0051047b0d6f7/mathquill/mathquill.css"
            //    ];
            //    var rawJs = " //<![CDATA[ \nfunction addLoadEvent(func) { var oldonload = window.onload; if (typeof window.onload != 'function') { try { window.onload = func; } catch(err) {} } else { window.onload = function() { oldonload(); func(); } } } //]]>";
            //    var js = [
            //        "https://webassign.net/vendor/jquery/jquery-1.7.1.min.js",
            //        "https://webassign.net/out/wacache96da2f590cd7246bbde0051047b0d6f7/common/js/faculty.js"
            //        , "https://webassign.net/vendor/mootools/mootools-core-1.3.2-comp-yc.js"
            //        , "https://webassign.net/vendor/mootools/mootools-more-1.3.2.1-comp-yc.js"
            //        , "https://webassign.net/vendor/wacache96da2f590cd7246bbde0051047b0d6f7/jquery/plugins/doubletap.js"
            //        , "https://webassign.net/vendor/wacache96da2f590cd7246bbde0051047b0d6f7/mathquill/mathquill.js"
            //        , "https://webassign.net/static/wacache96da2f590cd7246bbde0051047b0d6f7/js/pads/mathpad/AnimationsEffect.js"
            //        , "https://webassign.net/static/wacache96da2f590cd7246bbde0051047b0d6f7/js/pads/mathpad/ButtonsOperation.js"
            //        , "https://webassign.net/static/wacache96da2f590cd7246bbde0051047b0d6f7/js/pads/mathpad/PanelContainer.js"
            //        , "https://webassign.net/static/wacache96da2f590cd7246bbde0051047b0d6f7/js/pads/mathpad/XmlGenerator.js"
            //        , "https://webassign.net/static/wacache96da2f590cd7246bbde0051047b0d6f7/js/pads/mathpad/ExternalXml.js"
            //        , "https://webassign.net/static/wacache96da2f590cd7246bbde0051047b0d6f7/js/pads/mathpad/ExpressionPad.js"
            //    ];
                var w = window.open();
                w.document.title = "Webassign Practice";
                var rawJs = "function printPage() {window.print(); for (var k = 0; k < window.frames.length; k++) {window.frames[k].focus(); window.frames[k].print(); } }";
		addScript(w.document,"jquery.min.js");
		addScript(w.document,"jquery.printPage.js");
		addScript(w.document,"../src/onLoad.js");
		//addRawJs(head,rawJs);
            //    for (var i = 0; i < css.length; i++) {
            //        addCss(head, css[i]);
            //    }
            //    addRawJs(head, rawJs);
            //    for (var i = 0; i < js.length; i++) {
            //        addScript(head, js[i]);
            //    }
            //    //var moreRawJs = " jQuery(document).on('ready', function() { jQuery('#webAssign').click(function(){return;}); }); // support for legacy way of getting responses from flash elements when submission button is pressed function getPadXML() { jQuery.each(jQuery('.mathquill-editable'), function(index, element){ var xml = jQuery.INST().xmlGenerator.getXmlData(element); var id = jQuery(element).attr('id').split('editable-math-')[1]; jQuery('#' + id).val(xml); }); } ";
            //    //addRawJs(moreRawJs);
                $(w.document.body).html(me.GetHtmlIframes());
            //});
        }
    });
}
new WebAssignPracticeGenerator();
