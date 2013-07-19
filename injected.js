$(window).bind("ajaxStop", function() {
    window.postMessage("ajaxStop", "*")
});
