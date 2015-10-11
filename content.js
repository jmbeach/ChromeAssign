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
    WebAssignPracticeGenerator.prototype.GetHtmls = function (callback) {
        var urls = me.PracticeUrls();
        var htmls = [];
        if (!urls.length) return;
        for (var i = 0; i < urls.length; i++) {
            var url = urls[i];
            $.ajax({
                url: url,
                success: function (data) {
                    htmls.push(data);
                    if (htmls.length == urls.length) {
                        callback(null, htmls);
                    }
                },
                error: function (err) {
                    console.log(err);
                    callback(err);
                }
            });
        }
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
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        if (request.WA == "generate") {
            me.GeneratePracticeHtml(function (err, res) {
                var w = window.open();
                w.document.title = "Webassign Practice";
                $(w.document.body).html(res);
            });
        }
    });
}
new WebAssignPracticeGenerator();