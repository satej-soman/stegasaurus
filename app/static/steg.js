var StegApp = (function(document, window, $) {

    return function() {

        var self = this;

        this.imageSelected = false;

        this.displayRawImage = function(imageUrl) {

            this.imageSelected = true;
            this.rawImageUrl = imageUrl;

            var $imageWrapper = $("#image-wrapper");
            // clear existing image if it exists
            $imageWrapper.children('img').remove();

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

        this.encodeImage = function() {
            if (!this.imageSelected) {
                alert("Must select image first!");
                return;
            }
        }
    }

}(document, window, jQuery));

$(document).ready(function() {

    var app = new StegApp();

    // expose for debugging
    window.stegApp = app;

    // capture message length
    $("#message").keydown( function(e){
        $("#len").text("(length: " + $("#message").val().length + ")");
        console.log("*");
    });

    var choose_opts = {
        success: function(files) {
            var rawImageUrl = files[0].link;
            app.displayRawImage(rawImageUrl);
        },

        cancel: function() {},

        linkType: "direct",

        multiselect: false,

        extensions: [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]
    };

    $("#submit").click(function(e) {
        app.encodeImage();
    });

    $("#photo-select").click(function(e) {
        Dropbox.choose(choose_opts);
    });
});
