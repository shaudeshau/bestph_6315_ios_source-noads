
angular.module('starter').filter('nl2br', nl2br);
//nl2br.$inject = [];
function nl2br() {

    return function(data) {
        if (!data) return data;
        return data.replace(/\n\r?/g, '<br />');
    };
}

App.config(function($stateProvider) {
    
    $stateProvider.state('socialnetworks-chat', {
    	cache:false,
        url: BASE_PATH+"/socialnetworks/mobile_chat/index/value_id/:value_id/conversation_id/:conversation_id",
        controller: 'SocialnetworksChatController',
        templateUrl: "modules/socialnetworks/templates/l1/chat.html",
    });
    
    $stateProvider.state('socialnetworks-chat-history', {
    	cache:false,
        url: BASE_PATH+"/socialnetworks/mobile_conversations/index/value_id/:value_id",
        controller: 'SocialnetworksChatHistoryController',
        templateUrl: "modules/socialnetworks/templates/l1/tabs/chat-history.html",
    });

}).controller('SocialnetworksChatController', function($cordovaCamera, $cordovaGeolocation,AUTH_EVENTS, $http, $ionicActionSheet,$ionicModal, $ionicScrollDelegate, $rootScope, $scope, $stateParams, $timeout, $interval, $translate, Application, Url, $state, Picture, Dialog, $filter) {
    $scope.$on("connectionStateChange", function(event, args) {
        if(args.isOnline == true) {console.log('online');
            $scope.loadContent();
        }
    });
    console.log('chat controller');
    $scope.is_loading = true;
    $scope.value_id = $stateParams.value_id;
    $scope.conversation_id = $stateParams.conversation_id;
    $scope.limit = $scope.total = 100;
    
    $scope.loadContent = function(limit){ 
     
        var next_limit= $scope.limit+ limit; 
       console.log('loading content..'+limit + ', new limit=>'+next_limit);
        params = {
            value_id: $scope.value_id, 
            conversation_id: $scope.conversation_id, 
            user_id: $rootScope.toUserId,
            limit: next_limit
        };
        
        
    	$http({
            method: 'GET',
            url: Url.get("socialnetworks/mobile_chat/getmessages", params),
            cache: false,
            responseType:'json'
        }).then( function(data){ 
                $scope.doneLoading = true;
                $scope.messages = data.data.messages;
                $scope.toUser = data.data.toUser;
                
                $scope.total = data.data.total;
                $scope.more_messages = data.data.more_messages;
        console.log($scope.limit+'updated count='+$scope.total + ',more_messages='+$scope.more_messages);
                console.log('toUser=' + $scope.toUser._id);
                
                
                $scope.user = $rootScope.user;
                $scope.input = {
                        message: localStorage['userMessage-' + $scope.toUser._id] || ''
                };
        });
    };
    
    $scope.userImagePath = function(image){
         // Empty image
        if ( image == null || image.length <= 0) {
            return "modules/socialnetworks/images/customer-placeholder.png";
        }
        return IMAGE_URL + "images/customer" + image;
    };
    
    $scope.markMessagesRead = function(){ console.log('marking unread messages to read..')
        var url = Url.get("socialnetworks/mobile_chat/markread", {value_id: $scope.value_id, conversation_id: $scope.conversation_id });
        
        return $http.get(url);
    };
    
    $scope.markMessagesRead();
    
    $scope.saveMessage = function( message ){ 
        console.log('saving='+$scope.conversation_id);
        var url = Url.get("socialnetworks/mobile_chat/savemessage", {value_id: $scope.value_id, conversation_id: $scope.conversation_id, to_userId: $scope.toUser._id });
        var data = { message: message };

        return $http.post(url, data);
        
    }
    
    $scope.messageDate = function (message_date) {
        
        return $filter("moment_calendar")(message_date);
    };

    
    
    $scope.loadOlderMessages = function(limit){ 
        $scope.loadContent( limit );
    };
        
        $scope.input;
        
        var messageCheckTimer;

        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        var footerBar; // gets set in $ionicView.enter
        var scroller;
        var txtInput; // ^^^
        
        $scope.$on('$ionicView.enter', function () {console.log('enter view');
                getMessages();

                $timeout(function () {
                        footerBar = document.body.querySelector('.homeView .bar-footer');
                        scroller = document.body.querySelector('.homeView .scroll-content');
                        txtInput = angular.element(footerBar.querySelector('textarea'));
                }, 0);

                messageCheckTimer = $interval(function () {
                        // here you could check for new messages if your app doesn't use push notifications or user disabled them
                        getMessages();
                }, 10000);
        });

        $scope.$on('$ionicView.leave', function () {
                // Make sure that the interval is destroyed
                if (angular.isDefined(messageCheckTimer)) {
                        $interval.cancel(messageCheckTimer);
                        messageCheckTimer = undefined;
                }
        });

        $scope.$on('$ionicView.beforeLeave', function () {
                if (!$scope.input.message || $scope.input.message === '') {
                        localStorage.removeItem('userMessage-' + $scope.toUser._id);
                }
        });

        function getMessages() {
                $scope.loadContent(0);
                
        }

        $scope.$watch('input.message', function (newValue, oldValue) {
                console.log('input.message $watch, newValue ' + newValue);
                if (!newValue) newValue = '';
                if( $scope.toUser ){
                    localStorage['userMessage-' + $scope.toUser._id] = newValue;
                }
        });

        var addMessage = function (message) {
                message._id = new Date().getTime(); // :~)
                message.date = new Date();
                message.username = $scope.user.username;
                message.userId = $scope.user._id;
                message.pic = $scope.user.picture;
                $scope.messages.push(message);
                
        };
        
        
        $scope.savePicture = function() {
            var url = Url.get("socialnetworks/mobile_chat/savepicture", {value_id: $scope.value_id, conversation_id: $scope.conversation_id });
            var data = {picture: $scope.picture };

            return $http.post(url, data);
        }

        var lastPhoto = 'img/donut.png';

        $scope.sendPhoto = function () {
            
            Picture.takePicture()
                                .then(function(success) {
                                     //$scope.preview_src[field.id]    = success.image;
                                    $scope.picture       = success.image;  //console.log('image===>'+$scope.picture);
                                    Dialog.alert("Loading..", "Saving picture, please wait..", "OK", 2350, "fanwall");
                                    if( $scope.savePicture() ) {
                                        
                                        var message = {
                                               toId: $scope.toUser._id,
                                               photo: $scope.picture
                                       };
                                       addMessage(message);
                                   }

                            });
                                
                                $timeout(function () {
                                        getMessages();
                                        
                                }, 2000);
                                return true;
                
        };

        $scope.sendMessage = function (sendMessageForm) {
                var message = {
                        toId: $scope.toUser._id,
                        text: $scope.input.message
                };
                $scope.saveMessage( $scope.input.message );
                // if you do a web service call this will be needed as well as before the viewScroll calls
                // you can't see the effect of this in the browser it needs to be used on a real device
                // for some reason the one time blur event is not firing in the browser but does on devices
                keepKeyboardOpen();

                //MockService.sendMessage(message).then(function(data) {
                $scope.input.message = '';

                addMessage(message);
                $timeout(function () {
                        keepKeyboardOpen();
                }, 0);

                $timeout(function () {
                        getMessages();
                        
                        keepKeyboardOpen();
                }, 2000);
                //});
        };

        // this keeps the keyboard open on a device only after sending a message, it is non obtrusive
        function keepKeyboardOpen() {
                console.log('keepKeyboardOpen');
                txtInput.one('blur', function () {
                        console.log('textarea blur, focus back on it');
                        txtInput[0].focus();
                });
        }
        $scope.refreshScroll = function (scrollBottom, timeout) {
                $timeout(function () {
                        scrollBottom = scrollBottom || $scope.scrollDown;
                        viewScroll.resize();
                        if (scrollBottom) {
                                viewScroll.scrollBottom(true);
                        }
                        $scope.checkScroll();
                }, timeout || 1000);
        };
        $scope.scrollDown = true;
        $scope.checkScroll = function () {
                $timeout(function () {
                        var currentTop = viewScroll.getScrollPosition().top;
                        var maxScrollableDistanceFromTop = viewScroll.getScrollView().__maxScrollTop;
                        $scope.scrollDown = (currentTop >= maxScrollableDistanceFromTop);
                        $scope.$apply();
                }, 0);
                return true;
        };

        var openModal = function (templateUrl) {
                return $ionicModal.fromTemplateUrl(templateUrl, {
                        scope: $scope,
                        animation: 'slide-in-up',
                        backdropClickToClose: false
                }).then(function (modal) {
                        modal.show();
                        $scope.modal = modal;
                });
        };

        $scope.photoBrowser = function (message) {
                var messages = $filter('orderBy')($filter('filter')($scope.messages, { photo: '' }), 'date');
                $scope.activeSlide = messages.indexOf(message);
                $scope.allImages = messages.map(function (message) {
                        return message.photo;
                });

                openModal('templates/modals/fullscreenImages.html');
        };

        $scope.closeModal = function () {
                $scope.modal.remove();
        };

        $scope.onMessageHold = function (e, itemIndex, message) {
                console.log('onMessageHold');
                //console.log('message: ' + JSON.stringify(message, null, 2));
                $ionicActionSheet.show({
                        buttons: [{
                                text: 'Copy Text'
                        }, {
                                        text: 'Delete Message'
                                }],
                        buttonClicked: function (index) {
                                switch (index) {
                                        case 0: // Copy Text
                                                cordova.plugins.clipboard.copy(message.text);

                                                break;
                                        case 1: // Delete
                                                // no server side secrets here :~)
                                                console.log('index='+itemIndex + '==' + $scope.messages[itemIndex]['_id']);
                                                
                                                var delete_url = Url.get("socialnetworks/mobile_chat/deletemessage", {value_id: $scope.value_id });
                                                var data = { id: $scope.messages[itemIndex]['_id'] };

                                                $scope.messages.splice(itemIndex, 1);
                                                
                                                $http.post(delete_url, data);
                                                
                                                $timeout(function () {
                                                        viewScroll.resize();
                                                }, 0);

                                                break;
                                }

                                return true;
                        }
                });
        };

        // this prob seems weird here but I have reasons for this in my app, secret!
        $scope.viewProfile = function (msg) {
                if (msg.userId === $scope.user._id) {
                        // go to your profile
                } else {
                        // go to other users profile
                }
        };

        $scope.$on('elastic:resize', function (event, element, oldHeight, newHeight) {
                if (!footerBar) return;

                var newFooterHeight = newHeight + 10;
                newFooterHeight = (newFooterHeight > 44) ? newFooterHeight : 44;

                footerBar.style.height = newFooterHeight + 'px';
                scroller.style.bottom = newFooterHeight + 'px';
        });

})
.controller('SocialnetworksChatHistoryController', function($cordovaCamera, $cordovaGeolocation,AUTH_EVENTS, $http, $ionicActionSheet,$ionicModal, $ionicScrollDelegate, $rootScope, $scope, $stateParams, $timeout, $interval, $translate, Application, Url, $state, Picture, Dialog, $filter) {
    /*$scope.$on("connectionStateChange", function(event, args) {
        if(args.isOnline == true) {console.log('online');
            $scope.loadContent();
        }
    });*/
    console.log('chat history');
    $scope.isLoading = true;
    $scope.value_id = $stateParams.value_id;
    
    $scope.loadContent = function(){ 
       
        params = {
            value_id: $scope.value_id
        };
        
    	$http({
            method: 'GET',
            url: Url.get("socialnetworks/mobile_chat/getallconversations", params),
            cache: false,
            responseType:'json'
        }).then( function(data){ 
                $scope.isLoading = false;
                $scope.collection = data.data.collection;
                $scope.pageTitle = data.data.pageTitle;
                
                $scope.user = data.data.user;          
                $scope.toUserId = data.data.id;
        });
    };
    
    $scope.loadContent();
    
    $scope.customerImagePath = function(image){console.log('chat='+image);
         // Empty image
        if ( image == null || image.length <= 0) {console.log('no image');
            return "modules/socialnetworks/images/customer-placeholder.png";
        }
        return IMAGE_URL + "images/customer" + image;
    };
    
    $scope.messageDate = function (message_date) {
        
        return $filter("moment_calendar")(message_date * 1000);
    };
    
    $scope.openChat = function( conversation_id, toUserId ){
        
        $rootScope.user = $scope.user;  
        $rootScope.toUserId =  toUserId;       
        $state.go('socialnetworks-chat', {
            value_id: $scope.value_id,
            conversation_id: conversation_id
        });
    };
    
});