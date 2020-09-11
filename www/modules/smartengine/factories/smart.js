angular.module('starter').factory('Smartengine', function ($sbhttp, $rootScope, Url, Application, Customer) {
    var factory = {}; 
    factory.value_id = null;

    factory.load = function (version) {
        var plateform;

        if (ionic.Platform.isIOS()) {
            plateform = 'ios';
        } else if (ionic.Platform.isAndroid()) {
            plateform = 'android';
        } else {
            plateform = 'webview';
        }

        var params = {
            device_type: plateform,
            app_id: Application.app_id,
            version: version
        };
        return $sbhttp({
            method: 'GET',
            url: Url.get('smartengine/mobile_view/load', params),
            cache: false,
            responseType: 'json'
        });
    };


    factory.setDisplayCount = function (smartengine_id) {       
        var params = {           
            smartengine_id: smartengine_id,
            customer_id: Customer.id
        };
        return $sbhttp({
            method: 'POST',
            url: Url.get('smartengine/mobile_view/setdisplaycount', params),
            cache: false,
            responseType: 'json'
        });
    };

    factory.setClickCount = function (smartengine_id) {       
        var params = {           
            smartengine_id: smartengine_id,
            customer_id: Customer.id
        };
        return $sbhttp({
            method: 'POST',
            url: Url.get('smartengine/mobile_view/setclickcount', params),
            cache: false,
            responseType: 'json'
        });
    };

    return factory;
}).run(function ($sbhttp, $ionicPlatform, $ionicHistory, $rootScope, Url, $timeout, Smartengine, $state) {
    
    $ionicPlatform.ready(function () {
        document.addEventListener("deviceready", onDeviceReady, false);
    });

    function onDeviceReady() {
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
        document.addEventListener("online", onOnline, false);
        document.addEventListener("offline", onOffline, false);

        var firstTime = localStorage.getItem('first_time_loaded');
        if (!firstTime) {
          call_ads();
        }
    }

    function onPause() {
        localStorage.removeItem('first_time_loaded');
    }

    function onOffline() {
        localStorage.removeItem('first_time_loaded');
    }

    function onResume() {
        call_ads();
    }

    function onOnline() {
        call_ads();
    }

   function call_ads() {
        var currentState = $ionicHistory.currentStateName();
        if (currentState !== 'smartengine-view') {        
            var AppVersion = null;
            if ((cordova !== undefined) && ((cordova.platformId === 'android') || (cordova.platformId === 'ios'))) {
                cordova.getAppVersion
                    .getVersionNumber(function (version) {
                        AppVersion = version;
                    });
            }
            $timeout(function () {
                    Smartengine.load(AppVersion)
                        .success(function (data) {
                            if (data.success && data.data.length) {
                                var total_ads = data.data.length;
                                var ads_display = localStorage.getItem("smartengine_display_"+data.data[0].app_id+"_"+data.data[0].smartengine_id);
                                if(ads_display === null){
                                    ads_display = 0;
                                }
                                var targeting_options = data.data[0].targeting_options;
                                if(targeting_options.indexOf("frequency_cap") > 0){
                                    if(data.data[0].frequency_cap == "" || (parseInt(ads_display) < parseInt(data.data[0].frequency_cap))){
                                        $state.go('smartengine-view', { value_id: data.data[0].value_id, index : 0 });
                                    }else{
                                        if(total_ads > 1){
                                            for(var i = 1; i < total_ads; i++){
                                                if(data.data[i].frequency_cap == "" || (parseInt(ads_display) < parseInt(data.data[i].frequency_cap))){
                                                    $state.go('smartengine-view', { value_id: data.data[i].value_id, index :i });
                                                }
                                            }
                                        }
                                    }
                                }else{
                                    $state.go('smartengine-view', { value_id: data.data[0].value_id, index : 0 });
                                }
                            }
                        }).finally(function () {
                           localStorage.setItem('first_time_loaded', '1');
                        });
            }, 100);
        }
    }

});
