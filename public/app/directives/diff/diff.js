define([
    "scyllaApp"
], function(
    scyllaApp
    ){


    return scyllaApp
        .directive('diff', function() {

            return {
                templateUrl:'app/directives/diff/diff.html',
                transclude:true,
                link:function(scope, element, attrs) {
                    var diff;

                    // watch the expression, and update the UI on change.
                    scope.$watch(attrs.diff, function(value) {
                        scope.diff = value;
                    });

                }
            };


        });


})