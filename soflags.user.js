// ==UserScript==
// @name           Moderator Experience - Show Flags in Stack Exchange Toolbars
// @namespace      stackoverflow
// @author         Michael Mrozek (http://stackoverflow.com/users/309308)
// @author         jmort253 (http://stackoverflow.com/users/552792)
// @description    Show the number of flags in the top bar next to the tools link
// @include        http://*.stackoverflow.com/*
// @include        http://stackoverflow.com/*
// @include        http://*.serverfault.com/*
// @include        http://serverfault.com/*
// @include        http://*.superuser.com/*
// @include        http://superuser.com/*
// @include        http://*.stackexchange.com/*
// @include        http://mathoverflow.net/*
// @exclude        http://area51.stackexchange.com/*
// @version        2.0
// @history        2.0 - Updated to work with the new header bar released in Dec, 2013, as well as to continue to show Stack Overflow flags. 
// @history        2.0.1 - Name change: Moderator Experience - Show Flags in Stack Exchange Toolbars
// ==/UserScript==

function with_jquery(f) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.textContent = "(" + f.toString() + ")(jQuery)";
    document.body.appendChild(script);
};

with_jquery(function($) {
    // tools link means tools or review
    profile_links = $('.topbar-links > a.profile-me');
    var reputation = parseInt($('.topbar-links').find('.reputation').html().replace(',',''));
    var isBeta = $('#hlogo').find('.beta-title').length == 1;
    if(reputation < (isBeta ? 2000 : 10000)) // not enough rep to process flags
        return;
    
    if($('.topbar-links > .mod-only > a.icon-flag').length > 0) // flags indicator already present
        return;

    base_url = location.href.substring(0, location.href.indexOf("/", 7));
    $.get("/tools", function(tools_data) {
        tools = $(tools_data);
        var flagVal = $(tools_data).find('.bounty-indicator-tab').html();
        if(flagVal != null) {
            link = $('<div class="mod-only">\n\n<a href="/tools/flagged" class="topbar-icon icon-flag" title="we have posts flagged for moderator attention, perhaps you can help">\n<span class="supernovabg unread-count">'+flagVal+'</span>\n</a>\n</div>');
            profile_links.before(link);
        }
    });
});
