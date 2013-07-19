function checkBounty(url, cb) {
    bounty = false
    $.get("https://api.bountysource.com/search?_method=POST&query=" + encodeURIComponent(url)).done(function(redir) {
        if(redir.hasOwnProperty("redirect_to")) {
            issueurl = "https://api.bountysource.com" + redir['redirect_to'].replace("#","/");
            $.get(issueurl).done(function(data) {
                //data['bounty_total'];
                $('.discussion-stats')
                    .append($("<span class=\"state-indicator bounty\"></span>")
                    .append($("<a href=\"" + data['frontend_url'] + "\">$" + data['bounty_total'] + "</a>")
                    .css("color", "#FFFFFF"))
                    );
            });
        }
    });
    return bounty;
}

bounty = checkBounty(window.location.href);
