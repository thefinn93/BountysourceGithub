function issuePage() {
    if($(".bounty").length == 0) {
        $(".discussion-topic-header").after($("<div></div>")
            .addClass("discusion-topic-infobar js-infobar bountysource")
            .append($("<div>")
                .css("float", "left")
                .addClass("bounty bounty-left")
                .text("Loading bounty...")
            )
            .append($("<div>")
                .css("float", "right")
                .addClass("bounty bounty-right")
            )
        )
        function makeBountyBox(issueurl) {
            $.get(issueurl).done(function(data) {
                if(data['bounty_total'] == 0.0) {
                    $('.bounty-left')
                        .text("No bounty on bountysource")
                        .append($("<a>")
                            .attr("href", data['frontend_url'])
                            .addClass("minibutton")
                            .text("Add bounty")
                        )
                } else {
                    var s = "s"
                    var backers = data['bounties'].length;
                    if(backers == 1) {
                        s = "";
                    }
                    $('.bounty-right')
                        .append("<p><strong>" + backers + "</strong> backer" + s + "</p>")
                    $('.bounty-left')
                        .text("$" + data['bounty_total'] + " bounty on Bountysource")
                        .append($("<a>")
                            .attr("href", data['frontend_url'] + "/bounties")
                            .addClass("minibutton")
                            .text("View Bounties")
                        )
                        .append($("<a>")
                            .attr("href", data['frontend_url'])
                            .addClass("minibutton")
                            .text("Add bounty")
                        )
                }
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
