


App.config(function($stateProvider) {

    
    $stateProvider.state('socialnetworks-home', {
    	cache:false,
        url: BASE_PATH+"/socialnetworks/mobile_home/index/value_id/:value_id",
        controller: 'SocialnetworksNewsfeedController',
        templateUrl: "modules/socialnetworks/templates/l1/home.html",
    });
    
    $stateProvider.state('socialnetworks-search', {
    	cache:false,
        url: BASE_PATH+"/socialnetworks/mobile_search/index/value_id/:value_id",
        controller: 'SocialnetworksSearchController',
        templateUrl: "modules/socialnetworks/templates/l1/tabs/search.html",
    });
    
    $stateProvider.state('socialnetworks-detail', {
    	cache:false,
        url: BASE_PATH+"/socialnetworks/mobile_detail/index/value_id/:value_id/customer_id/:customer_id",
        controller: 'SocialnetworksdetailController',
        templateUrl: "modules/socialnetworks/templates/l1/view.html",
    });
    
    $stateProvider.state('socialnetworks-listing', {
    	cache:false,
        url: BASE_PATH+"/socialnetworks/mobile_list/index/value_id/:value_id/customer_id/:customer_id/type/:type",
        controller: 'SocialnetworksListController',
        templateUrl: "modules/socialnetworks/templates/l1/followers-friends-list.html",
    });
    

})
 .controller("SocialnetworksNewsfeedController", function ($rootScope, $scope, $state, $stateParams, $translate, $timeout,
                                               $ionicSideMenuDelegate, Customer, Dialog,
                                               Location, Socialnetworks, SocialnetworksUtils, GoogleMaps) {
                                              console.log('home controller'); 

    angular.extend($scope, {
        settingsIsLoaded: false,
        value_id: $stateParams.value_id,
        collection: [],
        pageTitle: "",
        hasMore: false,
        currentTab: "post",
    });
    
    Socialnetworks.setValueId($stateParams.value_id);

    $scope.getCardDesign = function () {
        return Socialnetworks.cardDesign;
    };

    $scope.getSettings = function () {
        return Socialnetworks.settings;
    };

    $scope.locationIsDisabled = function () {
        return !Location.isEnabled;
    };

    /**
     * Are we in a tab that requires the location
     * @returns {*|number}
     */
    $scope.locationTab = function () {
        return ["nearby", "map"].indexOf($scope.currentTab) !== -1;
    };

    $scope.requestLocation = function () {
        Dialog
        .confirm(
            "Error",
            "We were unable to request your location.<br />Please check that the application is allowed to use the GPS and that your device GPS is on.",
            ["TRY AGAIN", "DISMISS"],
            -1,
            "location")
        .then(function (success) {
            if (success) {
                Location.isEnabled = true;
                Loader.show();
                Location
                .getLocation({timeout: 30000, enableHighAccuracy: false}, true)
                .then(function (payload) {
                    // GPS is OK!!
                    Loader.hide();
                    Dialog.alert("Success", "We finally got you location", "OK", 2350, "socialnetworks");
                }, function () {
                    Loader.hide();
                    Dialog
                    .alert(
                        "Error",
                        "We were unable to request your location.<br />Please check that the application is allowed to use the GPS and that your device GPS is on.",
                        "OK",
                        3700,
                        "location"
                    );
                });
            }
        });
    };

    $scope.toggleDesign = function () {
        Socialnetworks.toggleDesign();
    };
    
    $scope.showTab = function (tabName) {
        $ionicSideMenuDelegate.canDragContent(tabName !== "map");

        var homeScope = $scope;

        if (tabName === "profile" &&
            !Customer.isLoggedIn()) {
            return Customer.loginModal(
                undefined,
                function () {
                    homeScope.showTab("profile");
                },
                undefined,
                function () {
                    homeScope.showTab("profile");
                }
            );
        }

        $scope.currentTab = tabName;
    };
    
    $scope.$on('$ionicView.afterLeave', function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.classTab = function (key) {
        if ($scope.currentTab === key) {
            return ["fw-icon-selected", "icon-active-custom"];
        }
        return ["icon-custom"];
    };

    $scope.isEnabled = function (key) {
        var features = $scope.getSettings().features;

        return features[key];
    };

    $scope.displayProfile = function () {
        var features = $scope.getSettings().features;

        return features.enableUserLike ||
            features.enableUserPost ||
            features.enableUserComment;
    };

    $scope.displaySubHeader = function () {
        var features = $scope.getSettings().features;

        return features.enableNearby ||
               features.enableMap ||
               features.enableGallery ||
               features.enableUserPost;
    };

    $scope.displayIcon = function (key) {
        var icons = $scope.getSettings().icons;
        switch (key) {
            case "post":
                return (icons.post !== null) ?
                    "<img class=\"fw-icon-header icon-topics\" src=\"" + icons.post + "\" />" :
                    "<i class=\"icon ion-sb-fw-topics\"></i>";
            case "nearby":
                return (icons.nearby !== null) ?
                    "<img class=\"fw-icon-header icon-nearby\" src=\"" + icons.nearby + "\" />" :
                    "<i class=\"icon ion-sb-fw-nearby\"></i>";
            case "map":
                return (icons.map !== null) ?
                    "<img class=\"fw-icon-header icon-map\" src=\"" + icons.map + "\" />" :
                    "<i class=\"icon ion-sb-fw-map\"></i>";
            case "search":
                return (icons.map !== null) ?
                    "<img class=\"fw-icon-header icon-search\" src=\"" + icons.map + "\" />" :
                    "<i class=\"ionicons ion-android-contacts\"></i>";//"<i class=\"icon ion-sb-search\"></i>";
            case "gallery":
                return (icons.gallery !== null) ?
                    "<img class=\"fw-icon-header icon-gallery\" src=\"" + icons.gallery + "\" />" :
                    "<i class=\"icon ion-sb-fw-gallery\"></i>";
            case "new":
                return (icons.new !== null) ?
                    "<img class=\"fw-icon-header icon-post\" src=\"" + icons.new + "\" />" :
                    "<i class=\"icon ion-sb-fw-post\"></i>";
            case "profile":
                return (icons.profile !== null) ?
                    "<img class=\"fw-icon-header icon-post\" src=\"" + icons.profile + "\" />" :
                    "<i class=\"icon ion-sb-fw-profile\"></i>";
        }
    };

    $scope.refresh = function () {
        $rootScope.$broadcast("socialnetworks.refresh");
    };

    // Modal create post!
    $scope.newPost = function () {
        if (!Customer.isLoggedIn()) {
            return Customer.loginModal();
        }

        return SocialnetworksUtils.postModal();
    };

    GoogleMaps.init();
    
    $scope.displayChatHistory = function () {
        
        $state.go('socialnetworks-chat-history', {
            value_id: $scope.value_id
        });
    };
    
    $rootScope.goToSearch = function(){ console.log('anjana');
        $state.go('socialnetworks-search', {
            value_id: $scope.value_id
        });
    };
        
    
    $scope.displaySearchPage = function () {
        
        if(!Customer.isLoggedIn()){
    		 $rootScope.is_loading = false;
	    	return Customer.loginModal(undefined,function() {
                        $rootScope.goToSearch();

                });
        	
    	}
        $rootScope.goToSearch();
        /*
        $state.go('socialnetworks-search', {
            value_id: $scope.value_id
        });*/
    };
    
    $rootScope.loadTab = function(){
        Socialnetworks
    .loadSettings()
    .then(function (payload) {
        Socialnetworks.settings = angular.copy(payload.settings);
        Socialnetworks.cardDesign = Socialnetworks.settings.cardDesign;
        $scope.unread_messages_count = payload.unread_messages_count;
        $scope.settingsIsLoaded = true;
    });
    };
    
    
    if (!Customer.isLoggedIn()) {
         
        return Customer.loginModal(undefined,function() {
                $rootScope.loadTab();

        });   
               
    }
    $rootScope.loadTab();
    

    $rootScope.$on("socialnetworks.pageTitle", function (event, payload) {
        $timeout(function () {
            $scope.pageTitle = payload.pageTitle;
        });
    });
})
  .controller('SocialnetworksdetailController', function($cordovaCamera, Dialog, $cordovaGeolocation,AUTH_EVENTS, $http, $ionicActionSheet,$ionicModal, $location, $rootScope, $scope, $stateParams, $timeout, $translate, Application, Url,$window,LinkService, $state, Socialnetworks) {

    
    $scope.$on("connectionStateChange", function(event, args) {
        if(args.isOnline == true) {
            $scope.loadContent();
        }
    });

    $scope.is_loading = true;
	
    $scope.value_id = $stateParams.value_id;
    $scope.customer_id = $stateParams.customer_id;
    

    $scope.loadContent = function(){
    	
 	$http({
            method: 'GET',
            url: Url.get("socialnetworks/mobile_list/customerdetails", {value_id: $scope.value_id, customer_id:$scope.customer_id}),
            cache: false,
            responseType:'json'
        }).then( function(data){console.log('loaded');
        	data = data.data;
        	$scope.collection = data.collection;
                $scope.author = data.author;
                $scope.friends = data.friends;
                $scope.followers = data.followers;
                $scope.following = data.is_following;
                $scope.receiver_has_followed = data.receiver_has_followed;
                $scope.logged_in_user_id = data.logged_in_user_id;
                $scope.page_title = data.pageTitle;
                $scope.settings = Socialnetworks.settings.additionalSettings;
                $scope.is_friend = data.isFriend;
                $scope.meta_datas = data.customer_meta_datas;
                $scope.meta_fields = data.meta_fields;

        }).finally(function() {
            $scope.is_loading = false;
        });
    }
    
    
    $scope.loadContent();
    
    $scope.chatEnable = function (enable_chat, is_friend) { 
        if( Socialnetworks.settings.features.enableUserChat ){
            if( $scope.logged_in_user_id != $scope.customer_id && (enable_chat == 'all' || is_friend) ){
                return true;
            }
        }
        return false;
    };
    
    $scope.canFollow = function () {
        return Socialnetworks.settings.features.enableUserFollow;
    };
    
    $scope.followVisible = function ( following ){
        if( $scope.canFollow() ){
            if( $scope.logged_in_user_id != $scope.customer_id && !following ){
                return true;
            }
        }
        return false;
    };
    
    $scope.userImagePath = function (image) {console.log('detail_image='+image);
        // Empty image
        if ( image == null || image.length <= 0) {console.log('no image');
            return "modules/socialnetworks/images/customer-placeholder.png";
        }
        return IMAGE_URL + "images/customer" + image;
    };
    
    $scope.followCustomer = function ( ){
       
        var params = {value_id: $scope.value_id, customer_id: $scope.customer_id};
        $scope.following = true;
        $http({
            method: 'GET',
            url: Url.get("socialnetworks/mobile_list/followcustomer", params),
            cache: false,
            responseType:'json'
        }).then( function(data){

                $scope.is_loading = false; 

                if( data.status ){
                    $scope.followers = $scope.followers + 1;
                    
                    if( $scope.receiver_has_followed ){//now they are friends
                        $scope.friends = $scope.friends + 1;
                    }
                    for( var key= 0; key < $scope.collection.length; key++ ){
                        //$scope.collection[key]['following'] = true;
                        $scope.collection[key]['followers_count'] = $scope.collection[key]['followers_count'] + 1;
                    }
                }
        });
    };
        
    
    $scope.openChatWindow = function ( ){
            
            var params = {value_id: this.value_id, user_id: $scope.customer_id};
                $http({
                    method: 'GET',
                    url: Url.get("socialnetworks/mobile_chat/getconversation", params),
                    cache: false,
                    responseType:'json'
                }).then( function(data){
                        //console.log('conversationid is: '+ data.data.conversation_id);
                        $scope.is_loading = false; 

                        $rootScope.user = data.data.user;          
                        $rootScope.toUserId = $scope.customer_id;

                        $state.go('socialnetworks-chat', {
                            value_id: $scope.value_id,
                            conversation_id: data.data.conversation_id
                        });
                });
    };
    
    $scope.goToFollowersOrFriendsList = function (type, customer_id){
        
        if( !customer_id ){
            customer_id = $scope.customer_id;
        }
        if( (type === 'friends' && $scope.friends) || (type === 'followers' && $scope.followers ) ){
            $state.go('socialnetworks-listing', {
                value_id: $scope.value_id,
                customer_id: customer_id,
                type: type
            });
        }
    };
     

})
  .controller('SocialnetworksListController', function($cordovaCamera, Dialog, $cordovaGeolocation,AUTH_EVENTS, $http, $ionicActionSheet,$ionicModal, $location, $rootScope, $scope, $stateParams, $timeout, $translate, Application, Url,$window,LinkService, $state) {

    $scope.is_loading = true;
	
    $scope.value_id = $stateParams.value_id;
    $scope.customer_id = $stateParams.customer_id;
    $scope.type = $stateParams.type;
    

    $scope.loadContent = function(){
    	
 	$http({
            method: 'GET',
            url: Url.get("socialnetworks/mobile_list/customerslist", {value_id: $scope.value_id, customer_id:$scope.customer_id, type: $scope.type}),
            cache: false,
            responseType:'json'
        }).then( function(data){console.log('loaded');
        	data = data.data;
        	$scope.collection = data.collection;
                $scope.pageTitle = data.pageTitle;
                $scope.listType = data.listType;
               
        }).finally(function() {
            $scope.is_loading = false;
        });
    }
    
    $scope.loadContent();
    
    $scope.customerImagePath = function(image){
         // Empty image
        if ( image == null || image.length <= 0) {
            return "modules/socialnetworks/images/customer-placeholder.png";
        }
        return IMAGE_URL + "images/customer" + image;
    };
    
    $scope.showProfile = function ( customer_id ){
                   
        $state.go('socialnetworks-detail', {
            value_id: $scope.value_id,
            customer_id: customer_id
        });
    };

})

.controller("SocialnetworksPostController", function ($ionicScrollDelegate, $rootScope, $scope, $state,
                                               $stateParams, $timeout, SocialnetworksPost) {
    angular.extend($scope, {
        isLoading: false,
        collection: [],
        hasMore: false
    });
console.log('Post Controller');
    SocialnetworksPost.setValueId($stateParams.value_id);

    $scope.loadMore = function () {
        $scope.loadContent(false, true);
    };

    $scope.loadContent = function (refresh, loadMore) {
        if (refresh === true) {
            $scope.isLoading = true;
            $scope.collection = [];

            $timeout(function () {
                $ionicScrollDelegate.$getByHandle("mainScroll").scrollTop();
            });
        }

        SocialnetworksPost
        .findAll($scope.collection.length, refresh)
        .then(function (payload) {console.log('find all post'+ payload);
            $scope.collection = $scope.collection.concat(payload.collection);

            $rootScope.$broadcast("socialnetworks.pageTitle", {pageTitle: payload.pageTitle});

            $scope.hasMore = $scope.collection.length < payload.total;

        }, function (payload) {

        }).then(function () {
            if (loadMore === true) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }

            if (refresh === true) {
                $scope.isLoading = false;
            }
        });
    };
    
    $rootScope.$on("socialnetworks.refresh", function () {
        // Refresh only the "active" tab
        if ($scope.currentTab === "post") {
            $scope.loadContent(true);
        }
    });

    $scope.loadContent($scope.collection.length === 0);
})

.controller("SocialnetworksCommentController", function ($scope) {

})
.controller("SocialnetworksEditCommentController", function ($scope, $rootScope, $stateParams, $translate,
                                                      Socialnetworks, SocialnetworksPost, Dialog, Picture, Loader) {

    angular.extend($scope, {
        pageTitle: $translate.instant("Edit comment", "socialnetworks"),
        form: {
            text: "",
            picture: "",
            date: null,

        }
    });

    SocialnetworksPost.setValueId($stateParams.value_id);

    $scope.getCardDesign = function () {
        return Socialnetworks.cardDesign;
    };

    $scope.getSettings = function () {
        return Socialnetworks.settings;
    };

    $scope.picturePreview = function () {
        // Empty image
        if ($scope.form.picture.indexOf("/") === 0) {
            return IMAGE_URL + "images/application" + $scope.form.picture;
        }
        return $scope.form.picture;
    };

    $scope.takePicture = function () {
        return Picture
            .takePicture()
            .then(function (success) {
                $scope.form.picture = success.image;
            });
    };

    $scope.removePicture = function () {
        $scope.form.picture = "";
    };

    $scope.clearForm = function () {
        $scope.form = {
            text: "",
            picture: ""
        };
    };

    $scope.canSend = function () {
        return ($scope.form.text.length > 0 || $scope.form.picture.length > 0);
    };

    $scope.sendComment = function () {
        var commentId = $scope.comment.id;
        var postId = $scope.comment.postId;

        if (!$scope.canSend()) {
            Dialog.alert("Error", "You must send at least a message or a picture.", "OK", -1, "socialnetworks");
            return false;
        }

        Loader.show();

        // Append now
        $scope.form.date = Math.round(Date.now() / 1000);

        return SocialnetworksPost
            .sendComment(postId, commentId, $scope.form)
            .then(function (payload) {
                Loader.hide();
                $rootScope.$broadcast("socialnetworks.refresh");
                $rootScope.$broadcast("socialnetworks.refresh.comments", {comments: payload.comments, postId: payload.postId});
                $scope.close();
            }, function (payload) {
                // Show error!
                Loader.hide();
                Dialog.alert("Error", payload.message, "OK", -1, "socialnetworks");
            });
    };

    if ($scope.comment !== undefined) {
        // Replace <br /> with \n for textarea, leave other formatting intact!
        $scope.form.text = $scope.comment.text.replace(/(<br( ?)(\/?)>)/gm, "\n");
        if ($scope.comment.image.length > 0) {
            $scope.form.picture = $scope.comment.image;
        }
    }
})
.controller("SocialnetworksProfileController", function ($scope, $stateParams, $timeout,
                                                  Customer, SocialnetworksUtils, SocialnetworksPost, Lightbox) {
    angular.extend($scope, {
        isLoading: true,
        collection: [],
        customer: Customer.customer,
        hasMore: false
    });

    SocialnetworksPost.setValueId($stateParams.value_id);

    $scope.customerFullname = function () {
        return $scope.customer.firstname + " " + $scope.customer.lastname;
    };

    $scope.profileCallback = function () {
        // Do nothing!
        $scope.loadContent(true, false);
        $timeout(function () {
            $scope.customer = Customer.customer;
        });
    };

    $scope.customerImagePath = function () {
        // Empty image
        if ($scope.customer.image &&
            $scope.customer.image.length > 0) {
            return IMAGE_URL + "images/customer" + $scope.customer.image;
        }
        return "modules/socialnetworks/images/customer-placeholder.png";
    };

    $scope.editProfile = function () {
        return Customer.loginModal(
            undefined,
            $scope.profileCallback,
            $scope.profileCallback,
            $scope.profileCallback);
    };

    $scope.showBlockedUsers = function () {
        SocialnetworksUtils.showBlockedUsersModal();
    };

    $scope.loadMore = function () {
        $scope.loadContent(false, true);
    };

    $scope.loadContent = function (refresh, loadMore) {
        if (refresh) {
            $scope.isLoading = true;
            $scope.collection = [];
        }

        SocialnetworksPost
        .findAllProfile($scope.collection.length)
        .then(function (payload) {
            $scope.collection = $scope.collection.concat(payload.collection);
            $scope.hasMore = $scope.collection.length < payload.total;

            $timeout(function () {
                Lightbox.run(".list-posts");
            }, 200);
        }, function (payload) {
            // Error!
        }).then(function () {
            if (loadMore === true) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }

            $scope.isLoading = false;
        });
    };

    $scope.loadContent(true, false);
})
.controller("SocialnetworksProfileBlockedUsersController", function ($scope, $rootScope, $stateParams, SocialnetworksPost) {
    angular.extend($scope, {
        isLoading: true,
    });

    SocialnetworksPost.setValueId($stateParams.value_id);

    $scope.loadContent = function () {
        $scope.isLoading = true;

        SocialnetworksPost
        .findAllBlocked()
        .then(function (payload) {console.log('loaded blocked users');
            $scope.collection = payload.collection;
        }, function (payload) {
            // Error!
        }).then(function () {
            $scope.isLoading = false;
        });
    };

    $scope.loadContent();

    $rootScope.$on("socialnetworks.blockedUsers.refresh", function () {
        $scope.loadContent();
    });
})
.controller("SocialnetworksNewController", function ($scope, $rootScope, $session, $state, $stateParams, $translate, $q,
                                              Customer, Socialnetworks, SocialnetworksPost, Dialog, Picture, Loader, Location,
                                              GoogleMaps, Popover, $timeout) {

    angular.extend($scope, {
        pageTitle: $translate.instant("Create a post", "socialnetworks"),
        form: {
            text: "",
            picture: "",
            date: null,
            location: {
                latitude: 0,
                longitude: 0,
                locationShort: ""
            }
        },
        fetchingLocation: false,
        shortLocation: "",
        popoverItems: [],
        actionsPopover: null,
        preference: "always",
        preferenceKey: "socialwall.location.preference"
    });

    SocialnetworksPost.setValueId($stateParams.value_id);

    $scope.getCardDesign = function () {
        return Socialnetworks.cardDesign;
    };

    $scope.getSettings = function () {
        return Socialnetworks.settings;
    };

    $scope.locationIsDisabled = function () {
        return !Location.isEnabled;
    };

    $scope.requestLocation = function () {
        Dialog
        .confirm(
            "Error",
            "We were unable to request your location.<br />Please check that the application is allowed to use the GPS and that your device GPS is on.",
            ["TRY AGAIN", "DISMISS"],
            -1,
            "location")
        .then(function (success) {
            if (success) {
                Location.isEnabled = true;
                Loader.show();
                Location
                .getLocation({timeout: 30000, enableHighAccuracy: false}, true)
                .then(function (payload) {
                    // GPS is OK!!
                    Loader.hide();
                    Dialog.alert("Success", "We finally got you location", "OK", 2350, "socialnetworks");

                    // Re-init scope to fetch location now.

                    $scope.init();
                }, function () {
                    Loader.hide();
                    Dialog
                    .alert(
                        "Error",
                        "We were unable to request your location.<br />Please check that the application is allowed to use the GPS and that your device GPS is on.",
                        "OK",
                        3700,
                       "location"
                    );
                });
            }
        });
    };

    $scope.myAvatar = function () {
        // Empty image
        if (Customer.customer &&
            Customer.customer.image &&
            Customer.customer.image.length > 0) {
            return IMAGE_URL + "images/customer" + Customer.customer.image;
        }
        return "modules/socialnetworks/images/customer-placeholder.png";
    };

    $scope.picturePreview = function () {
        // Empty image
        if ($scope.form.picture.indexOf("/") === 0) {
            return IMAGE_URL + "images/application" + $scope.form.picture;
        }
        return $scope.form.picture;
    };

    $scope.myName = function () {
        return Customer.customer.firstname + " " + Customer.customer.lastname;
    };

    $scope.takePicture = function () {
        return Picture
            .takePicture()
            .then(function (success) {
                $scope.form.picture = success.image;
            });
    };

    $scope.removePicture = function () {
        $scope.form.picture = "";
    };

    $scope.clearForm = function () {
        $scope.form = {
            text: "",
            picture: "",
            location: {
                latitude: 0,
                longitude: 0,
                locationShort: ""
            }
        };
    };

    $scope.canSend = function () {
        return ($scope.form.text.length > 0 || $scope.form.picture.length > 0);
    };

    $scope.sendPost = function () {
        var postId = ($scope.post !== undefined) ? $scope.post.id : null;

        if ($scope.fetchingLocation) {
            Dialog.alert("Wait", "Please wait while we are fetching your location.", "OK", 2350, "socialnetworks");
            return false;
        }

        if (!$scope.canSend()) {
            Dialog.alert("Error", "You must send at least a message or a picture.", "OK", -1, "socialnetworks");
            return false;
        }

        Loader.show();

        // Append now
        $scope.form.date = Math.round(Date.now() / 1000);

        return SocialnetworksPost
            .sendPost(postId, $scope.form)
            .then(function (payload) {
                Loader.hide();
                $rootScope.$broadcast("socialnetworks.refresh");
                $scope.close();
            }, function (payload) {
                // Show error!
                Loader.hide();
                Dialog.alert("Error", payload.message, "OK", -1, "socialnetworks");
            });
    };

    /** Location preference */

    // Popover actions!
    $scope.openActions = function ($event) {
        $scope
        .closeActions()
        .then(function () {
            Popover
            .fromTemplateUrl("features/fanwall2/assets/templates/l1/modal/post/actions-popover.html", {
                scope: $scope
            }).then (function (popover) {
                $scope.actionsPopover = popover;
                $scope.actionsPopover.show($event);
            });
        });
    };

    $scope.closeActions = function () {
        try {
            if ($scope.actionsPopover) {
                return $scope.actionsPopover.hide();
            }
        } catch (e) {
            // We skip!
        }

        return $q.resolve();
    };

    // Re-init scope on settings change!
    $scope.changeLocationSettings = function (preference, reinit) {
        $scope.preference = preference;
        $session
        .setItem($scope.preferenceKey, preference)
        .then(function (value) {
            if (reinit === true) {
                $scope.init();
            }
        })
        .catch(function (err) {
            if (reinit === true) {
                $scope.init();
            }
        });
    };

    $scope.buildPopoverItems = function () {
        $scope.popoverItems = [];

        if (!$scope.locationIsDisabled()) {
            $scope.popoverItems.push({
                label: $translate.instant("Locate me once", "socialnetworks"),
                icon: "icon ion-android-locate",
                click: function () {
                    $scope
                    .closeActions()
                    .then(function () {
                        $scope.changeLocationSettings("once", true);
                    });
                }
            });

            $scope.popoverItems.push({
                label: $translate.instant("Always ask", "socialnetworks"),
                icon: "icon ion-help",
                click: function () {
                    $scope
                    .closeActions()
                    .then(function () {
                        $scope.changeLocationSettings("ask", true);
                    });
                }
            });

            $scope.popoverItems.push({
                label: $translate.instant("Always locate me", "socialnetworks"),
                icon: "icon ion-sb-location-on",
                click: function () {
                    $scope
                    .closeActions()
                    .then(function () {
                        $scope.changeLocationSettings("always", true);
                    });
                }
            });

            $scope.popoverItems.push({
                label: $translate.instant("Never locate me", "socialnetworks"),
                icon: "icon ion-sb-location-off",
                click: function () {
                    $scope
                    .closeActions()
                    .then(function () {
                        $scope.changeLocationSettings("never", true);
                    });
                }
            });
        } else {
            $scope.popoverItems.push({
                label: $translate.instant("Check my location", "socialnetworks"),
                icon: "icon ion-sb-location-off",
                click: function () {
                    $scope
                    .closeActions()
                    .then(function () {
                        $scope.requestLocation();
                    });
                }
            });
        }

    };


    if ($scope.post !== undefined) {
        $scope.pageTitle = "Edit post";
        $scope.form.text = $scope.post.text.replace(/(<br( ?)(\/?)>)/gm, "\n");
        if ($scope.post.image.length > 0) {
            $scope.form.picture = $scope.post.image;
        }
    }

    $scope.noLocation = function () {
        $timeout(function () {
            $scope.fetchingLocation = false;
            $scope.form.location.latitude = 0;
            $scope.form.location.longitude = 0;
            $scope.shortLocation = $translate.instant("no location, check your preferences", "socialnetworks");
            $scope.form.location.locationShort = $translate.instant("no location, check your preferences", "socialnetworks");
        });
    };

    $scope.fetchLocation =  function () {
        if (!$scope.locationIsDisabled()) {
            $scope.fetchingLocation = true;
            Location
            .getLocation({timeout: 10000, enableHighAccuracy: false}, true)
            .then(function (position) {
                $scope.form.location.latitude = position.coords.latitude;
                $scope.form.location.longitude = position.coords.longitude;

                GoogleMaps
                .reverseGeocode(position.coords)
                .then(function (results) {
                    if (results.length > 0) {
                        var place = results[0];

                        try {
                            $scope.shortLocation = _.find(place.address_components, function (item) {
                                return item.types.indexOf("locality") >= 0;
                            }).long_name;
                        } catch (e) {
                            $scope.shortLocation = place.formatted_address;
                        }

                        $scope.form.location.locationShort = $scope.shortLocation;
                        $scope.fetchingLocation = false;
                    }
                }, function () {
                    $scope.fetchingLocation = false;
                    $scope.shortLocation = Number.parseFloat(position.coords.latitude).toFixed(5) + ", " + Number.parseFloat(position.coords.longitude).toFixed(5);
                    $scope.form.location.locationShort = "unknown";
                });
            }, function () {
                $scope.noLocation();
            });
        } else {
            $scope.fetchingLocation = false;
        }
    };

    $scope.init = function () {
        $scope.buildPopoverItems();

        switch ($scope.preference) {
            case "never":
                $scope.noLocation();
                $scope.popoverIcon = "icon ion-sb-location-off";
                break;
            case "once":
                $scope.fetchLocation();
                $scope.changeLocationSettings("never", false);
                $scope.popoverIcon = "icon ion-android-locate";
                break;
            case "ask":
                $scope.popoverIcon = "icon ion-help";
                Dialog
                .confirm(
                    "Location",
                    "Share my location for this post?",
                    ["YES", "NO"],
                    -1,
                    "socialnetworks")
                .then(function (success) {
                    if (success) {
                        $scope.fetchLocation();
                    } else {
                        $scope.noLocation();
                    }
                });
                break;
            case "always":
                $scope.popoverIcon = "icon ion-sb-location-on";
                $scope.fetchLocation();
                break;
        }
    };

    $session
    .getItem($scope.preferenceKey)
    .then(function (preference) {
        if (preference === null) {
            $scope.preference = "always";
        } else {
            $scope.preference = preference;
        }
        $scope.init();
    })
    .catch( function (err) {
        // Something went wrong!
        $scope.preference = "always";
        $scope.init();
    });

})
.controller("SocialnetworksGalleryController", function ($rootScope, $scope, $state, $stateParams, $timeout, $ionicScrollDelegate,
                                                  Socialnetworks, SocialnetworksGallery) {
    angular.extend($scope, {
        isLoading: false,
        collection: [],
        hasMore: false,
    });

    SocialnetworksGallery.setValueId($stateParams.value_id);

    $scope.getCardDesign = function () {
        return Socialnetworks.cardDesign;
    };

    $scope.getSettings = function () {
        return Socialnetworks.settings;
    };

    $scope.imagePath = function (image) {
        if (image.length <= 0) {
            return "modules/socialnetworks/images/placeholder.png"
        }
        return IMAGE_URL + "images/application" + image;
    };

    $scope.loadMore = function () {
        $scope.loadContent(false, true);
    };

    $scope.loadContent = function (refresh, loadMore) {
        if (refresh === true) {
            $scope.isLoading = true;
            $scope.collection = [];
            SocialnetworksGallery.collection = [];

            $timeout(function () {
                $ionicScrollDelegate.$getByHandle("mainScroll").scrollTop();
            });
        }

        SocialnetworksGallery
        .findAll($scope.collection.length, refresh)
        .then(function (payload) {
            $scope.collection = $scope.collection.concat(payload.collection);
            SocialnetworksGallery.collection = SocialnetworksGallery.collection.concat(payload.collection);

            $rootScope.$broadcast("socialnetworks.pageTitle", {pageTitle: payload.pageTitle});

            $scope.hasMore = $scope.collection.length < payload.total;

        }, function (payload) {

        }).then(function () {
            if (loadMore === true) {
                $scope.$broadcast("scroll.infiniteScrollComplete");
            }

            if (refresh === true) {
                $scope.isLoading = false;
            }
        });
    };

    $rootScope.$on("socialnetworks.refresh", function () {
        // Refresh only the "active" tab
        if ($scope.currentTab === "gallery") {
            $scope.loadContent(true);
        }
    });

    $scope.loadContent($scope.collection.length === 0);
})
.controller("SocialnetworksNearbyController", function ($ionicScrollDelegate, $rootScope, $scope, $state,
                                                     $stateParams, $timeout, Socialnetworks, SocialnetworksPost, Location) {
        angular.extend($scope, {
            isLoading: true,
            collection: [],
            location: {
                latitude: 0,
                longitude: 0
            },
            hasMore: false
        });

        SocialnetworksPost.setValueId($stateParams.value_id);

        $scope.getCardDesign = function () {
            return Socialnetworks.cardDesign;
        };

        $scope.loadMore = function () {
            $scope.loadContent(false, true);
        };

        $scope.locationIsDisabled = function () {
            return !Location.isEnabled;
        };

        $scope.loadContent = function (refresh, loadMore) {
            if ($scope.locationIsDisabled()) {
                return false;
            }

            if (refresh === true) {
                $scope.isLoading = true;
                $scope.collection = [];

                $timeout(function () {
                    $ionicScrollDelegate.$getByHandle("mainScroll").scrollTop();
                });
            }

            return SocialnetworksPost
                .findAllNearby($scope.location, $scope.collection.length, refresh)
                .then(function (payload) {
                    $scope.collection = $scope.collection.concat(payload.collection);

                    $rootScope.$broadcast("socialnetworks.pageTitle", {pageTitle: payload.pageTitle});

                    $scope.hasMore = $scope.collection.length < payload.total;

                }, function (payload) {

                }).then(function () {
                    if (loadMore === true) {
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                    }

                    if (refresh === true) {
                        $scope.isLoading = false;
                    }
                });
        };

        $rootScope.$on("socialnetworks.refresh", function () {
            // Refresh only the "active" tab
            if ($scope.currentTab === "nearby") {
                $scope.loadContent(true);
            }
        });

        Location
            .getLocation({timeout: 10000}, true)
            .then(function (position) {
                $scope.location.latitude = position.coords.latitude;
                $scope.location.longitude = position.coords.longitude;
            }, function () {
                $scope.location.latitude = 0;
                $scope.location.longitude = 0;
            }).then(function () {
                $scope.loadContent($scope.collection.length === 0);
            });
    })
.controller("SocialnetworksMapController", function ($scope, $rootScope, $state, $stateParams, $timeout, $translate,
                                              $ionicSideMenuDelegate, Loader, Location, SocialnetworksPost, SocialnetworksUtils) {

    angular.extend($scope, {
        isLoading: true,
        collection: [],
        showInfoWindow: false,
        currentPost: null,
        filters: {
            latitude: 0,
            longitude: 0,
        }
    });
    SocialnetworksPost.setValueId($stateParams.value_id);

    $scope.hideInfoWindow = function () {
        $scope.showInfoWindow = false;
    };

    $scope.showPostModal = function (postGroup) {
        SocialnetworksUtils.showPostModal(postGroup);
    };

    $scope.$on("$ionicView.enter", function () {
        $ionicSideMenuDelegate.canDragContent(false);
    });

    $scope.$on("$ionicView.leave", function () {
        $ionicSideMenuDelegate.canDragContent(true);
    });

    $scope.loadContent = function () {
        Location
        .getLocation({timeout: 10000}, true)
        .then(function (position) {
            $scope.filters.latitude = position.coords.latitude;
            $scope.filters.longitude = position.coords.longitude;
        }, function () {
            $scope.filters.latitude = 0;
            $scope.filters.longitude = 0;
        }).then(function () {
            SocialnetworksPost
            .findAllMap($scope.filters, 0, false)
            .then(function (payload) {
                $scope.collection = payload.collection;
                $rootScope.$broadcast("socialnetworks.pageTitle", {pageTitle: payload.pageTitle});

                var markers = [];
                for (var position in $scope.collection) {
                    var postGroup = $scope.collection[position];
                    var marker = {
                        config: {
                            postGroup: angular.copy(postGroup)
                        },
                        onClick: (function (marker) {
                            $timeout(function () {
                                $scope.showPostModal(marker.config.postGroup);
                            });
                        })
                    };

                    marker.latitude = position.split("_")[0];
                    marker.longitude = position.split("_")[1];

                    var pinUrl;
                    switch (postGroup.length) {
                        case 1:
                            pinUrl = "modules/socialnetworks/images/pin1.svg";
                            break;
                        case 2:
                            pinUrl = "modules/socialnetworks/images/pin2.svg";
                            break;
                        case 3:
                            pinUrl = "modules/socialnetworks/images/pin3.svg";
                            break;
                        case 4:
                            pinUrl = "modules/socialnetworks/images/pin4.svg";
                            break;
                        case 5:
                        default:
                            pinUrl = "modules/socialnetworks/images/pin5.svg";
                            break;
                    }

                    marker.icon = {
                        url: pinUrl,
                        anchor: new google.maps.Point(26, 52),
                        scaledSize: new google.maps.Size(40, 40)
                    };

                    markers.push(marker);
                }

                $scope.mapConfig = {
                    cluster: true,
                    markers: markers,
                    bounds_to_marker: true
                };
            }).finally(function () {
                $scope.isLoading = false;
            });
        });
    };

    $scope.loadContent();
})
.controller("SocialnetworksSearchController", function ($cordovaGeolocation, $ionicScrollDelegate, $rootScope, $scope, $state,
                                                     $stateParams, $timeout, Socialnetworks, SocialnetworksPost, Location, $http, Url, Customer) {
        angular.extend($scope, {
            isLoading: true,
            collection: [],
            location: {
                latitude: 0,
                longitude: 0
            },
            hasMore: false,
            currentTab: "search",
        });
        
        
        $scope.value_id = $stateParams.value_id;

        $scope.getCardDesign = function () {
            return Socialnetworks.cardDesign;
        };

        $scope.loadMore = function () {
            $scope.loadContent(false, true);
        };

        $scope.locationIsDisabled = function () {
            return !Location.isEnabled;
        };
       
        $scope.loadContent = function (refresh, loadMore) {
           
            if (refresh === true) {
                $scope.isLoading = true;
                $scope.collection = [];
                $scope.settings = [];

                $timeout(function () {
                    $ionicScrollDelegate.$getByHandle("mainScroll").scrollTop();
                });
            }
            
            $scope.profiles_arr = $scope.sorted_profiles = $scope.paginated_profiles = [];
            $scope.current_page = 1;
            $scope.records_per_page = 10;
            $scope.previous_link = $scope.next_link = false;

            return SocialnetworksPost
                .findAllSearch($scope.location, $scope.collection.length, refresh)
                .then(function (payload) {
                    //$scope.collection = $scope.collection.concat(payload.collection);
                    
 
                    $scope.settings = payload.additionalSettings;
                    
                    $scope.profiles_arr = $scope.collection.concat(payload.collection);
                    if( $scope.settings ){
                        $scope.sortByFunc( $scope.settings.profile_sort_by );
                    }
                    $scope.movePage('', $scope.sorted_profiles);
                    $scope.pageTitle = payload.pageTitle;
                    $rootScope.$broadcast("socialnetworks.pageTitle", {pageTitle: payload.pageTitle});

                    $scope.hasMore = $scope.collection.length < payload.total;

                }, function (payload) {

                }).then(function () {
                    if (loadMore === true) {
                        $scope.$broadcast("scroll.infiniteScrollComplete");
                    }

                    if (refresh === true) {
                        $scope.isLoading = false;
                    }
                });
        };
        
        $scope.sortByFunc = function ( sortby_index ){
       
            Array.prototype.sortBy = function(p) {
                    return this.slice(0).sort(function(a,b) {
                      return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
                    });
            };
            var results = $scope.profiles_arr;
            var sorted_results = [];

            if( $scope.settings.sort_by_distance ){

                console.log('distance');
                $cordovaGeolocation.getCurrentPosition().then(function (position) {
                    //console.log( 'current_position' + position.coords.latitude + ',' + position.coords.longitude);
                    var user_lat = position.coords.latitude;
                    var user_long = position.coords.longitude;
                    var highest_distance = 0;
                    var places_without_geocodes = [];
                    for (i = 0; i < results.length; i++) {
                        console.log('place ' + i);
                        if( results[i]['locations'] && results[i]['locations'][sortby_index] ){

                            var place_lat = results[i]['locations'][sortby_index]['latitude'];
                            var place_long = results[i]['locations'][sortby_index]['longitude'];
                            distance = $scope.calculateDistance(user_lat, user_long, place_lat, place_long);
                            results[i]['distance'] = distance;
                            console.log(' distance=>'+distance);
                            highest_distance = highest_distance < distance ? distance : highest_distance;

                        }else{
                            places_without_geocodes.push(i);
                        }
                    }
                    // to show places (without geocodes) at the end
                    for (j = 0; j < places_without_geocodes.length; j++) {
                        results[places_without_geocodes[j]]['distance'] = highest_distance + 1;
                    }

                    sortby_index = 'distance';
                    sorted_results = results.sortBy( sortby_index );
                    //console.log($scope.collection);
                });
            }else{
                sorted_results = results.sortBy( sortby_index );
            }
            $scope.sorted_profiles = sorted_results;
        };

        $scope.calculateDistance = function (lat1, lon1, lat2, lon2) {
            var radlat1 = Math.PI * lat1/180;
            var radlat2 = Math.PI * lat2/180;
            var theta = lon1-lon2;
            var radtheta = Math.PI * theta/180;
            var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
            dist = Math.acos(dist);
            dist = dist * 180/Math.PI;
            dist = dist * 60 * 1.1515;
            dist = dist * 1.609344 ;
            return dist
        };
        
        $scope.movePage = function (direction, customers) {
            var btn_next = document.getElementById("btn_next");
            var btn_prev = document.getElementById("btn_prev");
            var paginated_data = [];

            if( customers ){
                $scope.paginated_profiles = customers;
            }

            var total_pages = Math.ceil($scope.paginated_profiles.length / $scope.records_per_page);

            if( direction == 'prev' ){
                if ($scope.current_page > 1) {
                    $scope.current_page--;
                }
            }
            if( direction == 'next' ){
                if ($scope.current_page < total_pages) {
                    $scope.current_page++;
                }
            }
            page = $scope.current_page;
                
            // Validate page
            if (page < 1) page = 1;
            if (page > total_pages) page = total_pages;

            var counter = 0;
            for (var i = (page-1) * $scope.records_per_page; i < (page * $scope.records_per_page); i++) {
                if( $scope.paginated_profiles[i] ){
                    paginated_data[counter] = $scope.paginated_profiles[i] ;
                    counter++;console.log(counter);
                }
            }
            if( !paginated_data.length ){
                $scope.collection = [];
            }else{
                $scope.collection = paginated_data;
            }
//console.log( page+ ',total profiles' + $scope.collection.length); 
            if (page <= 1) {
                $scope.previous_link = false;
            } else {
                $scope.previous_link = true;
            }

            if (page == total_pages ) {
                $scope.next_link = false;
            } else {
                $scope.next_link = true;
            }

        };


        $scope.searchByFunc = function (searchText ){

            if( searchText != ''){
                var orig_results = $scope.sorted_profiles;
                var search_fields = $scope.settings.profile_search_by;
                var new_results = [];
                var matched = 0; 
                
                if( search_fields.indexOf("firstname") === -1 && search_fields.indexOf("lastname") === -1 ){
                    // add firstname/lastname in search criteria
                    search_fields.push('firstname');
                    search_fields.push('lastname');
                }
                

                for (i = 0; i < orig_results.length; i++) {
                    //console.log(orig_results.length + 'counter='+i + 'data='+ orig_results[i]['metadatas']);

                    for( j = 0; j < search_fields.length; j++) {
                        var index = search_fields[j];
                        
                        var str = '';
                        //if integer that means metafields 
                        if( parseInt(index) === parseInt(index, 10) ){
                            if( orig_results[i]['metadatas'] && orig_results[i]['metadatas'][index]){ 
                                //console.log( 'search by=='+search_fields[j] + ',in=' + orig_results[i]['metadatas'][index]);
                                str = orig_results[i]['metadatas'][index].toLowerCase();
                            }
                        }else{//else firstname/lastname
                            
                            if( index === 'firstname'){
                                str = orig_results[i].firstname.toLowerCase();
                            }
                            if( index === 'lastname'){
                                str = orig_results[i].lastname.toLowerCase();
                            }
                            
                        }
                        
                        if( str.search(searchText.toLowerCase()) != -1 ){
                            //console.log('found in ' + str);
                            new_results[matched] = orig_results[i];
                            matched++;
                            break;
                        }
                    };
                };
            }else{
                new_results = $scope.sorted_profiles;
            }
            $scope.current_page = 0;
            $scope.previous_link = $scope.next_link = false;
            $scope.movePage('', new_results);
        };
        
        $scope.refresh = function () { 
            //$rootScope.$broadcast("socialnetworks.reload");
             $scope.loadContent(true);
        };
        /*
        $scope.$on("socialnetworks.reload", function () {
            // Refresh only the "active" tab
            if ($scope.currentTab === "search" ) { console.log('calling');
                $scope.loadContent(true);
            }
        });
        */
        
        
        $scope.loadContent($scope.collection.length === 0);
        /*
        Location
            .getLocation({timeout: 10000}, true)
            .then(function (position) {
                $scope.location.latitude = position.coords.latitude;
                $scope.location.longitude = position.coords.longitude;
            }, function () {
                $scope.location.latitude = 0;
                $scope.location.longitude = 0;
            }).then(function () {console.log('inside location');
                $scope.loadContent($scope.collection.length === 0);
            });*/
    });
    
    
App.run(function($rootScope,$http,AUTH_EVENTS,Url,HomepageLayout,$state,$location,Application,$ionicHistory,$ionicSideMenuDelegate, Socialnetworks, Customer) {

    var messagesInterval = null;
    
    $rootScope.getUnreadMessagesCount = function () { 
           Socialnetworks
            .unreadMessagesCount()
            .then(function (payload) {
                $rootScope.unread_messages_count = payload.unread_messages_count;
            });
    };
    
    $rootScope.$on('$stateChangeSuccess', function(event, toState,toParams, fromState, fromParams){
    
        if( Customer.isLoggedIn() ){
            // to check if there is any new chat message
            if( toState.name === 'socialnetworks-home' || toState.name === 'socialnetworks-detail'){
                if( messagesInterval === null ){
                    messagesInterval = setInterval($rootScope.getUnreadMessagesCount, 60000);
                }
                console.log(messagesInterval+'='+toState.name);
            }else{ 
                clearInterval( messagesInterval );
                messagesInterval = null;
            }
        }
    
   });
});








