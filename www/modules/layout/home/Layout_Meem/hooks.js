App.service('Layout_Meem', function ($rootScope, HomepageLayout) {

    var service = {};

    /**
     * Must return a valid template
     *
     * @returns {string}
     */
    service.getTemplate = function() {
        return 'modules/layout/home/Layout_Meem/view.html';
    };

    /**
     * Must return a valid template
     *
     * @returns {string}
     */
    service.getModalTemplate = function() {
        return 'templates/home/modal/view.html';
    };

    /**
     * onResize is used for css/js callbacks when orientation change
     */
    service.onResize = function() {

    };


    /**
     * Manipulate the features objects
     *
     * Examples:
     * - you can re-order features
     * - you can push/place the 'more_button'
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
