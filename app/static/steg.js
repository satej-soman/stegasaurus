var stegApp = (function(document, window, $) {

    var module = {};

    module.displayRawImage = function(imageUrl) {
        var $imageWrapper = $("#image-wrapper");
        var $image = $("<img/>")
            .attr("src", imageUrl)
            .attr("width", "100%");

        // Load image, then add to page
        $image.load(function() {
            $imageWrapper.append($(this));

            // Expand message box height to image height
            $messageBox = $("#message");

            $messageBox.height($(this).height());
        });

    };

    return module;

}(document, window, jQuery));

$(document).ready(function() {

    var state = {};

    // capture message length
    $("#message").keydown( function(e){
        $("#len").text("(length: " + $("#message").val().length + ")");
        console.log("*");
    });

    var choose_opts = {
        success: function(files) {
            var rawImageUrl = files[0].link;
            state.rawImageUrl = rawImageUrl;
            console.log(rawImageUrl);
            stegApp.displayRawImage(rawImageUrl);
        },

        cancel: function() {},

        linkType: "direct",

        multiselect: false,

        extensions: [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]
    };

    $("#photo-select").click(function(e) {
        Dropbox.choose(choose_opts);
    });
});
