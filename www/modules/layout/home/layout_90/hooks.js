/**
 *
 * Layout_90 example
 *
 * All the following functions are required in order for the Layout to work
 */
App.service('layout_90', function ($rootScope, HomepageLayout) {

    var service = {};

    /**
     * Must return a valid template
     *
     * @returns {string}
     */
    service.getTemplate = function() {
        return "modules/layout/home/layout_90/view.html";
    };

    /**
     * Must return a valid template
     *
     * @returns {string}
     */
    service.getModalTemplate = function() {
        return "templates/home/l10/modal.html";
    };

    /**
     * onResize is used for css/js callbacks when orientation change
     */
    service.onResize = function() {
        /** Do nothing for this particular one */
    };

    /**
     * Manipulate the features objects
     *
     * Examples:
     * - you can re-order features
     * - you can push/place the "more_button"
     *
     * @param features
     * @param more_button
     * @returns {*}
     */
    service.features = function(features, more_button) {
        /** Place more button at the end */
        /**features.overview.options.push(more_button);*/
        return features;
    };

    return service;

});

App.controller('R90Controller', ['$scope', function($scope)
{
  var r9menuJS = document.createElement('script');
  r9menuJS.type = "text/javascript";
  r9menuJS.src = "modules/layout/home/layout_90/r9-menu.js";
  r9menuJS.onload = function() {
    $scope.loadContent();
  };
  document.body.appendChild(r9menuJS);
}]);

