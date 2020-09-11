var folder_title = '';
App.config(function($stateProvider) {

    $stateProvider.state('loginredirect-view', {
        url: BASE_PATH+"/loginredirect/mobile_view/index/value_id/:value_id",
        controller: 'LoginredirectController',
        templateUrl: "modules/loginredirect/templates/l1/view.html"
    });


}).controller('LoginredirectController', function($ionicModal,$ionicHistory,$http,Url, $cordovaOauth,AUTH_EVENTS, $ionicScrollDelegate, $location,$window, $scope, $state,$rootScope, $translate, $stateParams, Loginredirect, Application, Customer, Dialog, HomepageLayout) {

   

    

	$scope.is_loading = false;

   

    $scope.loadContent = function() {
        if(!$rootScope.is_logged_in) return;
		$scope.is_loading = true;

       	$http({
            method: 'GET',
            url: Url.get("loginredirect/mobile_account_login/getallactivemenu"),
            //data: data,
            cache: false,

            responseType:'json'
        }).success(function(data) {
        	$rootScope.accessibleValues = data.accessibleValues;
        	var location = window.location.href;
	        location = location.split("#");
	        location = location[0]+"#"+BASE_PATH+"/"+data.appurl;
	        $rootScope.redirectLoginUrl = location;
	        $rootScope.accessibleValues = data.accessibleValues;

            $rootScope.loginRedirected = true; 
	        window.location.href = $rootScope.redirectLoginUrl;
	       	$scope.is_loading = true;


        });
        
    };

});

App.run(function($rootScope,Loginredirect,$window,PADLOCK_EVENTS,Padlock,$http,AUTH_EVENTS,Url,HomepageLayout,$state,$location,Application,$ionicHistory,Customer) {
	
	  $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
        $rootScope.redirectLoginUrl = '';
        $rootScope.accessibleValues = {};
        $rootScope.is_logged_in = false;


    });
    
    $rootScope.isRolesRefreshed = false;
    
    $rootScope.$on(PADLOCK_EVENTS.unlockFeatures, function() {

    	var qrcode = $window.localStorage.getItem("sb-uc");
    	$http({
            method: 'GET',
            url: Url.get("loginredirect/mobile_view/unlockByQRCode/qrcode/"+qrcode),
            responseType:'json'
        }).success(function(data) {
                   //alert(data.success);
        });
    	
    });

	$rootScope.refreshRoles = function(){
        $rootScope.is_logged_in = true;
			$http({
            method: 'GET',
            url: Url.get("loginredirect/mobile_account_login/getallactivemenu"),
            cache: false,
            responseType:'json'
        }).success(function(data) {
        	if(Customer.can_access_locked_features && !$rootScope.isRolesRefreshed){ //if app is closed and user is superuser from padlock refresh menus
				HomepageLayout.setNeedToBuildTheOptions(true);
				HomepageLayout.rebuildOptions();
				$rootScope.isRolesRefreshed = true;

				$rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
				return false;
        
        	}
        	$rootScope.redirectLoginUrl = '';
	        $rootScope.accessibleValues = '';
        	if(data.appurl==null) return false;
        	if(data.appurl=="qrcode"){
                    Padlock.unlockByQRCode(data.qrcode).success(function() {
                                                           Padlock.unlock_by_qrcode = true;
                                                          $window.localStorage.setItem('sb-uc', data.qrcode);
                                                          $rootScope.$broadcast(PADLOCK_EVENTS.unlockFeatures);
                                                          $ionicHistory.goBack();
                                                                });
                                                          

				return false;
        	}
        	$rootScope.accessibleValues = data.accessibleValues;
        	var location = window.location.href;
	        location = location.split("#");
	        location = location[0]+"#"+BASE_PATH+"/"+data.appurl;
	        $rootScope.redirectLoginUrl = location;
	        $rootScope.accessibleValues = data.accessibleValues;
	        
	        if($ionicHistory.currentStateName()=="loginredirect-view"){
	        	if(HomepageLayout.properties.options.autoSelectFirst ){
	        		$ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: false,
                    disableBack:true
                });
	        		
	        	}
	        	window.location.href = $rootScope.redirectLoginUrl;
	        }
	        
	       console.log("Redirect");
	       console.log($rootScope.onLoginredirectview);
	       if($rootScope.onLoginredirectview){
    			window.location.href = $rootScope.redirectLoginUrl;  // commented for now

    		}

        });	



    }
    
    $rootScope.$on("RefreshRoles", function() {
    		$rootScope.refreshRoles();
    });
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
    		$rootScope.refreshRoles();
    		
    });
    

	 $rootScope.accessibleValues = [];
	 $rootScope.redirectLoginUrl = '';
	 $rootScope.home = "home";
	 $rootScope.loginRedirected = 0;



	 $http({
            method: 'GET',
            url: Url.get("loginredirect/mobile_account_login/getallactivemenu"),
            //data: data,
            cache: false,

            responseType:'json'
        }).success(function(data) {
        	$rootScope.accessibleValues = data.accessibleValues;
            
        });

     HomepageLayout.getFeatures().then(function (features) {
            console.log("features");
            console.log(features);
            var LoginRedirect = false;
            var cnt =0;
            for(var i = 0; i <  features.data.pages.length; i++){

                if(features.data.pages[i].code=="loginredirect")
                    LoginRedirect = true;

            }
            $rootScope.home = features.data.pages[0].path;
             $rootScope.home = features.data.pages[0].path;
            var location = window.location.href;
	        location = location.split("#");
            var homelocation = location[1];
	        location = location[0]+"#"+$rootScope.home;
            $rootScope.home = location;

            /* if loginredirect enabled and user is trying to visit other page directly*/
            if(LoginRedirect && $window.location.href != $rootScope.home && homelocation!=BASE_PATH){
				/** send user to home and disbale back button(for sidemenulayout) **/
				 $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: false,
                    disableBack:true
                });
                if(!HomepageLayout.properties.options.autoSelectFirst)
                	$state.go("home");
                else
             		$window.location.href = $rootScope.home;

            }
         });

    $rootScope.$on('$stateChangeSuccess', function(event, toState,toParams, fromState, fromParams){
        if(HomepageLayout.properties.options.autoSelectFirst)
                setTimeout('$("ion-nav-bar .title").css("left","50px");$("ion-nav-bar.nav-bar-container").removeClass("hide")',2000);
        })
    
     $rootScope.$on('$stateChangeStart', function(event, toState,toParams, fromState, fromParams){

		/** if user is visiting the loginredirect view ***/
        if($rootScope.redirectLoginUrl!="" && fromParams.value_id!=$rootScope.loginRedirected && toState.name=="loginredirect-view"){
            event.preventDefault();
           
            $rootScope.loginRedirected = toParams.value_id; 
            window.location.href = $rootScope.redirectLoginUrl;  // commented for now
            
			/** if user is coming back from login redirected view **/
        }else if($rootScope.redirectLoginUrl!="" && fromParams.value_id==$rootScope.loginRedirected  && toState.name=="loginredirect-view"){
         	$rootScope.loginRedirected = 0;
            event.preventDefault();

	        if(!Application.is_customizing_colors && HomepageLayout.properties.options.autoSelectFirst ){

                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: false,
                    disableBack:true
                });
                window.location.href = $rootScope.home;
            
            }else{
            	$state.go("home");
            }
            
            
         


    }
    
    console.log("toState.name"+toState.name);
    if(toState.name=="loginredirect-view" || ($rootScope.onLoginredirectview && toState.name=="home") ){
         	$rootScope.onLoginredirectview = true;
         	console.log("onLoginredirectview"+$rootScope.onLoginredirectview);
         }else{
         	$rootScope.onLoginredirectview = false;
    }

    })
   



    
});


