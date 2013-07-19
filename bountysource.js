function issuePage() {
    if($(".bounty").length == 0) {
        function makeBountyBox(issueurl) {
            $.get(issueurl).done(function(data) {
                //data['bounty_total'];
                $('.discussion-stats')
                    .append($("<a class=\"state-indicator bounty\" href=\"" + data['frontend_url'] + "\">$" + data['bounty_total'] + "</a>"));
            });
        }
        if(localStorage.hasOwnProperty(window.location.href)) {
            makeBountyBox(localStorage[window.location.href]);
        } else {
            $.get("https://api.bountysource.com/search?_method=POST&query=" + encodeURIComponent(window.location.href)).done(function(data) {
                if(data.hasOwnProperty("redirect_to")) {
                    issueurl = "https://api.bountysource.com" + data['redirect_to'].replace("#","/");
                    localStorage[window.location.href] = issueurl;
                    makeBountyBox(issueurl);
                }
            });
        }
    }
}

function issueList() {
    $('.issue-list-item').each(function(index) {
        var issue = $(this.getElementsByTagName("li")[0]);
        var url = this.getElementsByClassName("js-navigation-open")[0].href;
        function makeBountyBox(issueurl) {
            $.get(issueurl).done(function(data) {
                issue.append("<a href=\"" + data['frontend_url'] + "\">$" + data['bounty_total'] + " bounty</a>");
            });
        }
        if(localStorage.hasOwnProperty(url)) {
            makeBountyBox(localStorage[url]);
        } else {
            $.get("https://api.bountysource.com/search?_method=POST&query=" + encodeURIComponent(url)).done(function(data) {
                if(data.hasOwnProperty("redirect_to")) {
                    issueurl = "https://api.bountysource.com" + data['redirect_to'].replace("#","/");
                    localStorage[url] = issueurl;
                    makeBountyBox(issueurl);
                }
            });
        }
    });
}

function checkPage(a,b,url) {
    regex = {}
    regex['issuePage'] = /https:\/\/github.com\/.*\/.*\/issues\/[0-9]*/
    regex['issueList'] = /https:\/\/github.com\/.*\/.*\/issues(?!\/).*/
    if(regex['issuePage'].test(window.location.href)) {
        issuePage();
    } else if(regex['issueList'].test(window.location.href)) {
        issueList();
    }
};

$(document).ready(function() {
    //checkPage();
    $(window).bind("message", function(e) {
        if(e.originalEvent.data == "ajaxStop") {
            checkPage()
        }
    });
    var s = document.createElement('script');
    s.src = chrome.extension.getURL("injected.js");
    (document.head||document.documentElement).appendChild(s);
    });
