/**
 *
 * Layout_D9
 *
 * All the following functions are required in order for the Layout to work
 */
App.service('layout_d9', function ($rootScope, HomepageLayout) {

    var service = {};

    /**
     * Must return a valid template
     *
     * @returns {string}
     */
    service.getTemplate = function() {
        return "modules/layout/home/layout_d9/view.html";
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

App.controller('D9Controller', ['$scope', function($scope)
{
  var d9menuJS = document.createElement('script');
  d9menuJS.type = "text/javascript";
  d9menuJS.src = "modules/layout/home/layout_d9/d9-menu.js";
  d9menuJS.onload = function() {
    $scope.loadContent();
  };
  document.body.appendChild(d9menuJS);
}]);

