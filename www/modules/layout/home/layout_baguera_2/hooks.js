/**
 *
 * Layout_Skeleton example
 *
 * All the following functions are required in order for the Layout to work
 */
App.service('layout_baguera_2', function ($rootScope, HomepageLayout) {

    var service = {};

    /**
     * Must return a valid template
     *
     * @returns {string}
     */
    service.getTemplate = function() {
        return "modules/layout/home/layout_baguera_2/view.html";
    };

    /**
     * Must return a valid template
     *
     * @returns {string}
     */
    service.getModalTemplate = function() {
        return "modules/layout/home/layout_baguera_2/modal.html";
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
        var third_option = features.overview.options[2];
        var fourth_option = features.overview.options[3];
        /** Placing more button at the third place (middle in layout) */
        features.overview.options[2] = more_button;
        features.overview.options[3] = third_option;
        features.overview.options[4] = fourth_option;
        /** Removing 4 first option for the modal */
        features.options = features.options.slice(4, features.options.length);

        return features;
    };

    return service;

});
