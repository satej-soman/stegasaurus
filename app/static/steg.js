var StegApp = (function(document, window, $, Dropbox, Spinner) {

    return function() {

        var self = this,

            spinOpts = {
                lines: 13, // The number of lines to draw
                length: 20, // The length of each line
                width: 10, // The line thickness
                radius: 30, // The radius of the inner circle
                corners: 1, // Corner roundness (0..1)
                rotate: 0, // The rotation offset
                direction: 1, // 1: clockwise, -1: counterclockwise
                color: '#000', // #rgb or #rrggbb or array of colors
                speed: 1, // Rounds per second
                trail: 60, // Afterglow percentage
                shadow: false, // Whether to render a shadow
                hwaccel: false, // Whether to use hardware acceleration
                className: 'spinner', // The CSS class to assign to the spinner
                zIndex: 2e9, // The z-index (defaults to 2000000000)
                top: 'auto', // Top position relative to parent in px
                left: 'auto' // Left position relative to parent in px
            },

            spinner = new Spinner(spinOpts);

        this.rawImageUrl = null;
        this.encodedData = null;
        this.imageSelected = false;

        this.startSpinner = function() {
            console.log("Spin baby spin");
            spinner.spin($('body')[0]);
        };

        this.stopSpinner = function() {
            spinner.stop();
        };

        this.displayRawImage = function(imageUrl) {

        	console.log("*")

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

                $("#load-button").removeClass('active').addClass('disabled');
                $("#encode-button").removeClass('disabled').addClass('active');
            });

        };


        this.displayDecodedImage = function(imageUrl) {

        	console.log("*")

            this.imageSelected = true;
            this.rawImageUrl = imageUrl;

            var $imageWrapper = $("#image-wrapper-decoded");
            // clear existing image if it exists
            $imageWrapper.children('img').remove();

            var $image = $("<img/>")
                .attr("src", imageUrl)
                .attr("width", "100%");

            // Load image, then add to page
            $image.load(function() {
                $imageWrapper.append($(this));

                // Expand message box height to image height
                $messageBox = $("#decoded-message");

                $messageBox.height($(this).height());

                $("#load-button").removeClass('active').addClass('disabled');
                $("#encode-button").removeClass('disabled').addClass('active');
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
                return "error";
            }
            return this.encodedData;
        };

        this.encodeImage = function() {

            var endpoint = window.location.origin + '/encoder/';
            var message = $("#message").val();

            if (!this.imageSelected) {
                this.error("Must select image first!");
                return;
            }

            if (!message) {
                this.error("Must enter message to encode!");
                return;
            }

            this.startSpinner();

           $.ajax({
               type: 'POST',
               url: endpoint,
               data: {
                   img_url: self.rawImageUrl,
                   message: $("#message").val()
               }
           }).done(function(data) {

               self.encodedData = data;
               self.stopSpinner();

               self.info("Image successfully encoded!");

               $("#encode-button").removeClass('active').addClass('disabled');
               $("#save-button").removeClass('disabled').addClass('active');

           });
        };

        this.decodeImage = function() {

                var endpoint = window.location.origin + '/decoder/';
                var image    = $("#encoded-image-url").val();

                if (!image){
                        this.error("Must select image to decode!");
                        return;
                }

                this.displayDecodedImage(image);

                this.startSpinner();

                $.ajax({
                        type: 'POST',
                        url: endpoint,
                        data: {
                                img_url: image
                        }
                }).done(function(data) {
                        self.decodedData = data;
                        self.stopSpinner();
                        $("#decoded-message").text(self.decodedData);
                        self.info("Image successfully decoded!");
                })
        };

    };

}(document, window, jQuery, Dropbox, Spinner));

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

    $("#encode-button").click(function(e) {
        app.encodeImage();
    });


    $("#load-button").click(function(e) {
        Dropbox.choose(choose_opts);
    });

    $("#save-button").click(function(e) {
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
