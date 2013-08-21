define([
    "scyllaApp"
], function(
    scyllaApp
    ){


    return scyllaApp
        .directive('processing', function() {

            return {
                restrict:'E',
                transclude: false,
                scope: {
                    show: '=show',
                    message: '=message'
                },
                templateUrl: 'app/directives/spin/processing.html',
                link: function(scope, element, attrs) {
                    var spinner = new Spinner({
                        lines: 17, // The number of lines to draw
                        length: 40, // The length of each line
                        width: 10, // The line thickness
                        radius: 60, // The radius of the inner circle
                        corners: 1, // Corner roundness (0..1)
                        rotate: 0, // The rotation offset
                        direction: 1, // 1: clockwise, -1: counterclockwise
                        color: '#000', // #rgb or #rrggbb or array of colors
                        speed: 1, // Rounds per second
                        trail: 60, // Afterglow percentage
                        shadow: true, // Whether to render a shadow
                        hwaccel: false, // Whether to use hardware acceleration
                        className: 'spinner', // The CSS class to assign to the spinner
                        zIndex: 2e9, // The z-index (defaults to 2000000000)
                        top: 'auto', // Top position relative to parent in px
                        left: 'auto' // Left position relative to parent in px
                    }).spin();
                    var loadingContainer = element.find('.processing-spinner-container')[0];
                    loadingContainer.appendChild(spinner.el);
                }
            };


        });


});