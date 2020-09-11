"use strict";

angular.module('starter').directive('smartengineBackImg', function ($timeout) {
    return function (scope, element, attrs) {
        $timeout(function () { 
            var url = attrs.smartengineBackImg;
            var color = attrs.adsBackgroundColor;
            element.css({
                'background-image': 'url(' + url +')',
                'background-color': color
            });
        }, 3000);
    };
});