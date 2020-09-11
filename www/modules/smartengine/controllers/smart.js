angular.module('starter').config(function ($stateProvider, HomepageLayoutProvider) {
    $stateProvider.state('smartengine-view', {
        url: BASE_PATH + '/smartengine/mobile_view/index/value_id/:value_id/:index',
        controller: 'SmartengineViewController',
        templateUrl: 'modules/smartengine/templates/l1/view.html',
        cache: false
    });
}).controller('SmartengineViewController', function ($state, $stateParams, $timeout, $scope, $translate, Smartengine, $ionicNavBarDelegate, $window, Url, $ionicViewService, $location) {
    $scope.value_id = Smartengine.value_id = $stateParams.value_id;
    $scope.currentPage = $stateParams.index;
    $ionicNavBarDelegate.showBackButton(false);
    $ionicNavBarDelegate.showBar(false);
    $scope.AppVersion = '';
    $scope.data = {};
    $scope.adsLists = [];
    $scope.slider = '';
    $scope.total_ads = 0;
    $scope.ads_background_image = '';
    $scope.showClose = true;
    $scope.is_slider = false;
    $scope.currentPage = 0;

    $scope.loadContent = function () {
        Smartengine.load($scope.AppVersion).success(function (data) {
            if (data.success && data.data) {
                $scope.adsLists = data.data;
                $scope.currectAds = data.data[$scope.currentPage];  
                $scope.total_ads = $scope.adsLists.length; 
                $scope.slider_images = [];               
                if($scope.adsLists[$scope.currentPage].slider_images != undefined && $scope.adsLists[$scope.currentPage].slider_images){
                    $scope.slider_images = JSON.parse($scope.adsLists[$scope.currentPage].slider_images)
                }
                $scope.is_slider = $scope.slider_images.length > 1 ? true : false;                
                var ads_display = localStorage.getItem("smartengine_display_"+$scope.adsLists[$scope.currentPage].app_id+"_"+$scope.adsLists[$scope.currentPage].smartengine_id);
                var targeting_options = $scope.adsLists[$scope.currentPage].targeting_options;                              
                if(targeting_options.indexOf("frequency_cap") > 0 && $scope.currentPage > 0){
                    $scope.skipAds();
                }

                if(ads_display != null){
                    ads_display = parseInt(ads_display) + 1
                    localStorage.setItem("smartengine_display_"+$scope.adsLists[$scope.currentPage].app_id+"_"+$scope.adsLists[$scope.currentPage].smartengine_id, parseInt(ads_display));
                }else{
                    localStorage.setItem("smartengine_display_"+$scope.adsLists[$scope.currentPage].app_id+"_"+$scope.adsLists[$scope.currentPage].smartengine_id, 1 );
                }                           
                
                var image_url = Url.get(data.path + '/' + $scope.adsLists[$scope.currentPage].upload_picture);
                image_url = image_url.replace(BASE_PATH, '');
                $timeout(function () {
                    $scope.ads_background_image = image_url;
                    var extension = image_url.split('.').pop();

                    if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
                        $scope.ads_background_image = image_url;
                        document.getElementById('ads_view').style.background = 'url(' + image_url + ')';                        
                    } else {
                        $scope.ads_background_image = "none";
                        document.getElementById('ads_view').style.background = 'none';
                    }                   
                    if ($scope.adsLists[$scope.currentPage].ad_background_color!='') {
                        $scope.ads_background_color = $scope.adsLists[$scope.currentPage].ad_background_color;
                        document.getElementById('ads_view').style.backgroundColor = $scope.adsLists[$scope.currentPage].ad_background_color;
                    } else {
                        $scope.ads_background_color = 'none';
                        document.getElementById('ads_view').style.backgroundColor = 'none';
                    }

                    $scope.showClose = $scope.adsLists[$scope.currentPage].close_button;
                    $scope.close_slider_background_color = $scope.adsLists[$scope.currentPage].close_slider_background_color;                    
              
                    var customcss = '.swiper-pagination-bullet-active{background: '+$scope.adsLists[$scope.currentPage].close_slider_background_color+' !important; opacity: 1 !important } .swiper-pagination-bullet {opacity : 0.4;background: '+$scope.adsLists[$scope.currentPage].close_slider_background_color+'} .ads-button {top: '+$scope.adsLists[$scope.currentPage].button_height+'%}'; // Your css
                    var css = document.createElement("style");
                    css.type = "text/css";
                    css.innerHTML = customcss;
                    document.body.appendChild(css);
                    $scope.$apply();
                }, 500);

                Smartengine.setDisplayCount($scope.adsLists[$scope.currentPage].smartengine_id); // display count API called
            }
        }).error(function () {}).finally(function () {
            $scope.adsModal();
        });
    };

    $scope.openLink = function (url , url_select, smartengine_id) { 
        Smartengine.setClickCount(smartengine_id);
        if(url_select == 'external_link'){
            $window.open(url, '_blank');
        }else{
            $ionicNavBarDelegate.showBackButton(true);
            $ionicNavBarDelegate.showBar(true); 
            $location.path(BASE_PATH+'/'+url);
        }     
    };

    /*$scope.skipAds = function () {
        localStorage.setItem('first_time_loaded', '1');  
        $ionicNavBarDelegate.showBackButton(true);
        $ionicNavBarDelegate.showBar(true);  
        $state.go('home');
    };*/

    $scope.skipAds = function () {
        localStorage.setItem('first_time_loaded', '1');  
        console.log($scope.total_ads ,  $scope.currentPage )
        if ($scope.total_ads == 1) {      
            $ionicNavBarDelegate.showBackButton(true);
            $ionicNavBarDelegate.showBar(true);      
            $state.go('home', {}, { reload: true });
        }

        if ($scope.total_ads == ($scope.currentPage + 1 )) {      
            $ionicNavBarDelegate.showBackButton(true);
            $ionicNavBarDelegate.showBar(true);      
            $state.go('home', {}, { reload: true });
        }

        if ($scope.total_ads > $scope.currentPage ) {      
           $scope.currentPage =  $scope.currentPage + 1 ;
           $scope.loadContent();
        }else{
            $ionicNavBarDelegate.showBackButton(true);
            $ionicNavBarDelegate.showBar(true);      
            $state.go('home', {}, { reload: true });
        }     
        
    };

    var setupSlider = function () {       
            $scope.data.sliderOptions = {
                initialSlide: 0,
                direction: 'horizontal',
                speed: 300,
                pagination: '',
                paginationHide: false
             };               
         
            $scope.data.sliderOptions2 = {
                initialSlide: 0,
                direction: 'horizontal',
                speed: 300,
                pagination: '.swiper-pagination',
                paginationHide: false,
                slidesPerView: 1,
                freeMode: false,
                nextButton: '.swiper-button-next',
                prevButton: '.swiper-button-prev',
                paginationClickable: false               
            };        
      
        $scope.data.sliderDelegate = null;
        $scope.$watch('data.sliderDelegate', function (newVal, oldVal) {
            if (newVal !== null) {
                $scope.data.sliderDelegate.on('slideChangeEnd', function () {
                    $scope.data.currentPage = $scope.data.sliderDelegate.activeIndex;                   
                    var ads_display = localStorage.getItem("smartengine_display_"+$scope.adsLists[0].app_id+"_"+$scope.adsLists[0].smartengine_id);
                    if(ads_display === null){
                      ads_display = 0;
                    }                    
                    
                    var targeting_options = $scope.adsLists[0].targeting_options;                                                
                    if(targeting_options.indexOf("frequency_cap") > 0){
                        if($scope.adsLists[0].frequency_cap == "" || (parseInt(ads_display) < parseInt($scope.adsLists[0].frequency_cap))){
                            if(ads_display != null){
                                 ads_display = parseInt(ads_display) + 1
                                 localStorage.setItem("smartengine_display_"+$scope.adsLists[0].app_id+"_"+$scope.adsLists[0].smartengine_id, parseInt(ads_display));
                            }else{
                                 localStorage.setItem("smartengine_display_"+$scope.adsLists[0].app_id+"_"+$scope.adsLists[0].smartengine_id, 1 );
                            }
                        }else{ 
                            $scope.skipAds();                     
                        }
                    }
                    console.log($scope.slider_images[$scope.data.currentPage]);
                    if($scope.slider_images[$scope.data.currentPage]){
                        var extension = $scope.slider_images[$scope.data.currentPage].split('.').pop();
                        if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
                            var image_url = Url.get('/images/application/' + $scope.slider_images[$scope.data.currentPage]);
                            image_url = image_url.replace(BASE_PATH, '');
                            $scope.ads_background_image = image_url;
                            document.getElementById('ads_view').style.background = 'url(' + image_url + ')';
                        } else {
                            document.getElementById('ads_view').style.background = 'none';
                        }
                    }

                    $scope.showClose = $scope.adsLists[0].close_button;                 
                    if ($scope.adsLists[0].ad_background_color!='') {
                      document.getElementById('ads_view').style.backgroundColor = $scope.adsLists[0].ad_background_color;
                    } else {
                       document.getElementById('ads_view').style.backgroundColor = 'none';
                    }                
                    $scope.$apply();
                });
            }
        });

        $scope.$on('$ionicSlides.sliderInitialized', function (event, data) {
            $scope.slider = data.slider;
        });
    };

     if ((cordova !== undefined) && ((cordova.platformId === 'android') || (cordova.platformId === 'ios'))) {
        cordova.getAppVersion.getVersionNumber(function (version) {
            $scope.AppVersion = version;
            $scope.loadContent();
        });
    } else {
        $scope.loadContent();
    }


    setupSlider(); 
});