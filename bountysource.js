function issuePage() {
    if($(".bounty").length == 0) {
        $(".state-indicator.open")
            .after($("<a class=\"state-indicator bounty\" href=\"#\"><small>loading bounty</small></a>"));
        function makeBountyBox(issueurl) {
            $.get(issueurl).done(function(data) {
                buttontext = "$" + data['bounty_total'];
                if(data['bounty_total'] == 0.0) {
                    buttontext = "Set bounty";
                }
                $('.bounty')
                    .text(buttontext)
                    .attr("href", data['frontend_url']);
                var s = "s"
                var backers = data['bounties'].length;
                if(backers == 1) {
                    s = "";
                }
                $('.discussion-stats').append("<p><strong>" + backers + "</strong> backer" + s + "</p>")
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

regex = {}
regex['issuePage'] = /https:\/\/github.com\/.*\/.*\/issues\/[0-9]*/
regex['issueList'] = /https:\/\/github.com\/.*\/.*\/issues(?!\/).*/

function checkPage(a,b,url) {
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
