var StegApp = (function(document, window, $, Dropbox) {

    return function() {

        var self = this;

        this.rawImageUrl = null;
        this.encodedData = null;
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

        this.error = function(errMsg) {
            alert(errMsg);
        };

        this.info = function(infoMsg){
            console.log(infoMsg);
        };

        this.getEncodedImage = function() {
            if (!this.encodedData) {
                this.error("Must encode an image first!");
                return;
            }
            return this.encodedData;
        };

        this.encodeImage = function() {

            var endpoint = window.location.href + 'encoder/';
            var message = $("#message").val()

            if (!this.imageSelected) {
                this.error("Must select image first!");
                return;
            }

            if (!message) {
                this.error("Must enter message to encode!");
                return;
            }

           $.ajax({
               type: 'POST',
               url: endpoint,
               data: {
                   img_url: self.rawImageUrl,
                   message: $("#message").val()
               }
           }).done(function(data) {

               self.encodedData = data;
               self.info("Image successfully encoded!");

           });
        };

        this.decodeImage = function() {

                var endpoint = window.location.href.split('?') + 'decoder/';
                var image    = $("#encoded-image-url").val();

                if (!image){
                        this.error("Must select image to decode!");
                        return;
                }

                $.ajax({
                        type: 'POST',
                        url: endpoint,
                        data: {
                                img_url: image
                        }
                }).done(function(data) {
                        self.decodedData = data;
                        $("#decoded-message").text(self.decodedData);
                        self.info("Image successfully decoded!");
                })
        };

    };

}(document, window, jQuery, Dropbox));

$(document).ready(function() {

    // expose for debugging
    var app = new StegApp();
    window.stegApp = app;

    // ENCODE PANEL
    // capture message length
    $("#message").keydown( function(e){
        $("#len").text("(length: " + $("#message").val().length + ")");
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

    $("#encode-submit").click(function(e) {
        app.encodeImage();
    });


    $("#photo-select").click(function(e) {
        Dropbox.choose(choose_opts);
    });

    $("#save").click(function(e) {
        var data =  app.getEncodedImage();
        if (data) {
            Dropbox.save(app.getEncodedImage(), "test.png");
        }
    });

    // DECODE PANEL
    $("#decode-submit").click(function(e) {
        app.decodeImage();
    });
});
