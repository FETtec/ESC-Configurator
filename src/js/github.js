function loadGithubReleases(url, callback) {
    // alert(request.getResponseHeader('some_header'));
    // Link: <https://api.github.com/resource?page=2>; rel="next",
    // <https://api.github.com/resource?page=5>; rel="last"
    $.ajax({
        dataType: "json",
        url: url,
        success: function (data, textStatus, request) {
            var temp = [];
            var link = request.getResponseHeader('Link');
            Array.prototype.push.apply(temp, data);
            if (link == null) {
                callback(temp);
            } else {
                console.log("TODO: Paging!");
                callback(temp);
            }
        }
    });
}

function getAjax(url) {
    return $.ajax({
        type: 'GET',
        url: url,
        success: function (response) {
            //Data = response;
        }
    });
}

function checkGithubRelease(url, currVersion) {

    var releaseInfo = [];

    getAjax(url).done(function (response) {
        console.log('Latest release found: ' + response[0].tag_name, ' current version: ' + currVersion);
        if (semver.gt(response[0].tag_name, currVersion)) {
            // only apply to array when we are outdated
            if (DEBUG) console.log("Update available!");
            $.each(response, function (index, value) {
                releaseInfo.push(value);
            });
        }
    });
    return releaseInfo;

}