function issuePage() {
    $.get("https://api.bountysource.com/search?_method=POST&query=" + encodeURIComponent(window.location.href), {global: false}).done(function(redir) {
        if(redir.hasOwnProperty("redirect_to")) {
            issueurl = "https://api.bountysource.com" + redir['redirect_to'].replace("#","/");
            $.get(issueurl, {global: false}).done(function(data) {
                //data['bounty_total'];
                $('.discussion-stats')
                    .append($("<span class=\"state-indicator bounty\"></span>")
                    .append($("<a href=\"" + data['frontend_url'] + "\">$" + data['bounty_total'] + "</a>")
                    .css("color", "#FFFFFF"))
                    );
            });
        }
    });
}

function issueList() {
    $('.issue-list-item').each(function(index) {
        var issue = $(this.getElementsByTagName("li")[0]);
        var issueURL = this.getElementsByClassName("js-navigation-open")[0].href;
        $.get("https://api.bountysource.com/search?_method=POST&query=" + encodeURIComponent(issueURL), {global: false}).done(function(redir) {
            if(redir.hasOwnProperty("redirect_to")) {
                var issueurl = "https://api.bountysource.com" + redir['redirect_to'].replace("#","/");
                $.get(issueurl, {global: false}).done(function(data) {
                    issue.append("<a href=\"" + data['frontend_url'] + "\">$" + data['bounty_total'] + " bounty</a>");
                });
            }
        });
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
    checkPage();
    });
