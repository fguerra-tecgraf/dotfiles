/* Quick function to help reduce duplication in my config, thanks mostly to
   holomorph who did pretty much all of this ❤ 

   Adds two new commands and two new hint modes:
   * :launchv  - Opens the current buffer url prefering yt-dl
   * :launchvq - Same as above but prefers quvi
   
   Hints: 
   * ;u - launches the current hint prefering yt-dl
   * ;q - Same but prefers quvi
*/
 
function launchv(target, quvi=true) {

    /* Escape anything which could be used to inject shell commands before
     * passing it to the commands */
    var uri = target.replace(/([$`"\\])/g, "\\$1");

    function exec(launcher, uri) {
        return commands.execute(launcher + ' "' + uri + '" &');
    }

    /* filter certain urls to more appropriate programs before passing to
     * quvi */
    if(uri.match(/twitch\.tv\/.*\/c\/[0-9]+/))
        exec("!yt-dl", uri);
    else if(uri.match(/twitch\.tv/))
        exec("!lstream", uri);

    /* Open youtube playlists of any kind directly with mpv */
    else if(uri.match(/youtube.*[?&]list=PL/))
        exec("!mpv", uri);

    /* For everything else */
    else if(quvi)
        exec("!quvi dump -b mute", uri);
    else
        exec("!yt-dl", uri);
}

hints.addMode("q", "Launch video from hint (quvi)",
    function (elem, loc) launchv(loc));

hints.addMode("u", "Launch video from hint (yt-dl)",
    function (elem, loc) launchv(loc, quvi=false));

group.commands.add(["launchv", "lv"], "Launches current buffer video (yt-dl).",
    function(args) { var uri = buffer.URL;
        launchv(uri, quvi=false); });

group.commands.add(["launchvq", "lvq"], "Launches current buffer video (quvi).",
    function(args) { var uri = buffer.URL;
        launchv(uri); });