$(document).ready(function() {
    // capture message length
    $("#message").keydown( function(e){
        $("#len").text("(length: " + $("#message").val().length + ")");
        console.log("*");
    });

    var choose_opts = {
        success: function(files) {
            alert("Here's the file link: " + files[0].link);
        },

        cancel: function() {},

        linkType: "preview",

        multiselect: false,

        extensions: [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]
    };

    $("#photo-select").click(function(e) {
        Dropbox.choose(choose_opts);
    });
});
