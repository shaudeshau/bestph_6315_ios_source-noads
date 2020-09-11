App.factory('Migabirthday', function($http, Url) {
    
    var factory = {};
    //value_id
    factory.value_id = null;
    factory.day = null;
    factory.month = null;
    factory.year = null;

    factory.load = function(value_id) {
        if(!value_id) return;
        return $http({
            method: 'GET',
            url: Url.get("migabirthday/mobile_view/load", {value_id: value_id}),
            cache: false,
            responseType:'json'
        });
    };

    factory.update = function(value_id, day, month, year) {
        if(!value_id) return;
        return $http({
            method: 'GET',
            url: Url.get("migabirthday/mobile_view/update", {value_id: value_id, day: day, month: month, year: year}),
            cache: false,
            responseType:'json'
        });
    };

    return factory;
    
});