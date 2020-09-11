App.config(function($stateProvider) {

    $stateProvider.state('progressiveloyaltycards_view', {
        url: BASE_PATH + "/progressiveloyaltycards/mobile_view/index/value_id/:value_id/:enter",
        params: {
            enter: {
                squash: true,
                value: null
            }
        },
        cache: false,
        controller: 'ProgressiveLoyaltyCardsViewController',
        templateUrl: "modules/progressiveloyaltycards/templates/l1/view.html"
    });

}).controller('ProgressiveLoyaltyCardsViewController', function($cordovaBarcodeScanner, $filter, $rootScope, $scope,
                                                                $state, $stateParams, $timeout, $translate, $window,
                                                                Application, Customer, Dialog, Modal,
                                                                ProgressiveLoyalty, SB, Url, httpCache) {
    $scope.is_loading = true;
    $scope.enter = $stateParams.enter;
    $scope.is_redeem_function = true;

    $scope.$on(SB.EVENTS.AUTH.loginSuccess, function() {
        $scope.is_logged_in = true;
        $state.go('progressiveloyaltycards_view',{value_id: $scope.value_id}, { reload: true }); 
    });
    $scope.$on(SB.EVENTS.AUTH.logoutSuccess, function() {
        $scope.is_logged_in = false;
        $scope.loadContent();
    });
    $scope.$on('$ionicView.beforeEnter', function(event, viewData) {
        viewData.enableBack = false;
        $scope.loadContent();
    });
    $scope.myGoBack = function() {
        $state.go('home');
    };
    

    $scope.value_id = ProgressiveLoyalty.value_id = $stateParams.value_id;
    //This var is here to show the unlock by qrcode section in pad template
    //Because this template could be used in other feature without qrcode validation
    $scope.unlock_by_qrcode = true;
    $scope.pro_image = BASE_URL + '/app/local/modules/ProgressiveLoyaltyCards/resources/media/library/default_reward_image.png';

    $scope.pad = {
        password: "",
        points: [],
        number_of_points: 0,
        add: function(nbr, mnp) {
            if (mnp != undefined) {
                if (this.password.length < 4) {

                    this.password += nbr;
                    if (this.password.length == 4) {
                        $scope.validate();
                    }

                }
            } else {
                if (this.password.length < 4) {
                    this.password += nbr;
                    if (this.password.length == 4) {
                        $scope.validate_redeem();
                    }
                }
            }
            return this;
        },
        remove: function() {
            this.password = this.password.substr(0, this.password.length - 1);
            return this;
        }
    };

    $scope.loadContent = function() {
        $scope.is_loading = true;
        $scope.is_logged_in = Customer.isLoggedIn();
        ProgressiveLoyalty.findAll().success(function(data) {
            $scope.card = data.card;
            $scope.card_is_locked = data.card_is_locked;
            $scope.points = data.points;
            $scope.page_title = data.page_title;
            $scope.tc_id = data.tc_id;
            $scope.pictos = data.picto_urls;
            $scope.rewards = data.rewards;
            $scope.base_url = data.base_url;
            $scope.card_name = data.card.name;
            $scope.layout_id = data.layout_id;
            $scope.max_no_of_points = data.card.max_number_of_points;
            $scope.no_of_points = data.card.number_of_points;
            $scope.cover_image = data.cover_image;
            $scope.active_reward_image = data.active_reward_image;
            $scope.deactive_reward_image = data.deactive_reward_image;
            $scope.one_point_only = data.one_point_only;
            $scope.header_color = data.header_color;
            $scope.font_family = data.font_family;
            $scope.list_item_color = data.list_item_color;
            if (data.rewards.current) {
                $scope.current_rewards = data.rewards.current;
            }
            if (data.rewards.previous) {
                $scope.previous_rewards = data.rewards.previous;
            }
            $scope.is_rewards = $filter('filter')($scope.current_rewards, {is_redeem: 0 });
            if(!$scope.is_rewards.length){
                $scope.is_rewards = $filter('filter')($scope.previous_rewards, {is_redeem: 0 });
            }
            
            $scope.is_coupons = $filter('filter')($scope.current_rewards, {is_redeem: 1,is_used:0 });
            if(!$scope.is_coupons.length){
                $scope.is_coupons = $filter('filter')($scope.previous_rewards, {is_redeem: 1,is_used:0 });
            }
            $scope.COLOR_BUTTON = '.img_color { background-color: ' + data.button_color + ' !important; }';

            $scope.reward_point_array = [];
            $scope.reward_images = [];
            var rw = {};
            angular.forEach($scope.rewards, function(reward, key) {
                if (key == 'current') {
                    angular.forEach(reward, function(rwd_value, rwd_key) {
                        rw = {};
                        rw.value = rwd_value.number_of_points_to_redeem;
                    
                        if(parseInt(rwd_value.number_of_points_to_redeem) <=  parseInt($scope.no_of_points)){
                            rw.uri = ( rwd_value.image_active != '') ?  $scope.base_url + '/images/application' + rwd_value.image_active : $scope.active_reward_image;
                        } else {
                            rw.uri = ( rwd_value.image_inactive != '') ? $scope.base_url + '/images/application' + rwd_value.image_inactive : $scope.deactive_reward_image;
                        }
                        $scope.reward_images.push(rw);
                        $scope.reward_point_array.push(rwd_value.number_of_points_to_redeem);
                    });
                }
            });
        }).finally(function() {
            $scope.is_loading = false;
            if ($scope.layout_id == '3') {
                $timeout(function() {
                    progressive_report($scope.max_no_of_points, $scope.no_of_points);
                }, 1000);
            }
        });
    };


  $scope.showTermConditions = function() {
     // Dialog.prompt('Term & Conditions', $scope.card.term_conditions , 'OK');
      Modal.fromTemplateUrl('modules/progressiveloyaltycards/templates/l1/term_conditions.html', {
       scope: $scope,
       animation: 'slide-in-up'
      }).then(function(modal) {
          $scope.term_conditions = $scope.card.term_conditions;
          $scope.tcModal = modal;
          $scope.tcModal.show().finally(function() {  
          $scope.is_loading = false;   
          });
      });
  };

   $scope.closeTCModal = function() {
      $scope.tcModal.hide();
  };


    function progressive_report(max_no_of_points, no_of_points) {
        var reward_image_size = 50;
        var option = {
            background: $scope.header_color,
            card_background: $scope.list_item_color,
            achived_point: no_of_points,
            total_point : max_no_of_points,
            lineWidth: 15,
            curve_gap: 0.7,
            point_label:'POINTS',
            font_family: $scope.font_family,
            image_size:reward_image_size,
            rewards: $scope.reward_images //[{value:2,uri:'https://graph.facebook.com/531664351/picture'},{value:4,uri:'http://placehold.it/50x50/ff0/000?text=Y'},{value:6,uri:'https:\/\/enterprise.easyapp.pt\/app\/local\/modules\/ProgressiveLoyaltyCards\/resources\/media\/library\/default_reward.png'}]
        };
        generate(option);
    }

    $scope.open_description_current = function(redeem_reward_id, reward_active_img) {
        if ($scope.rdm_rwd_id != redeem_reward_id) {
            $scope.rdm_rwd_id = redeem_reward_id;
            $scope.show_coupan = false;
        } else {
            $scope.show_coupan = false; 
            $scope.rdm_rwd_id = 0; 
        }
    };


    $scope.redeem_coupan = function(rewards) {
        $scope.is_loading = true;
        ProgressiveLoyalty.redeemreward(rewards)
            .success(function(data) {
                if (data) {
                    $state.go('progressiveloyaltycards_view',
                        {
                            value_id: $scope.value_id
                        }, {
                            reload: true
                        }
                    );
                }
            }).finally(function() {

            });
    };

    $scope.openPad = function(card) {
        /*if ($rootScope.isNotAvailableInOverview()) {
            return;
        }*/
        if (!Customer.isLoggedIn()) {
            $scope.login();
            return;
        }
        $scope.pad.password = "";
        if (card.reward_id) {
            $scope.is_redeem_function = false;
            $scope.pad.redeem_id = "";
            $scope.pad.reward_id = "";
            $scope.pad.reward_id = card.reward_id;
            $scope.pad.redeem_id = card.redeem_id;
            $scope.pad.customer_card_id = card.customer_card_id;
        }

        $scope.pad.modal = {};

        $scope.pad.points = [];
        $scope.pad.buttons = [];
        $scope.pad.mode_qrcode = false;
        for (var i = 0; i < 10; i++) {
            $scope.pad.buttons.push(i);
        }
        $scope.pad.card = card;
        $scope.pad.number_of_points = 1;
        $scope.page_title = $scope.pad_title;

        var remaining = card.max_number_of_points - card.number_of_points;
        var points = [];
        for (var i = 0; i <= remaining - 1; i++) {
            points[i] = i + 1;
        }

        $scope.pad.points = points;

        Modal.fromTemplateUrl('modules/progressiveloyaltycards/templates/l1/pad.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.pad.modal = modal;
            $scope.pad.modal.show();
        });

    };
    $scope.closePad = function() {
        $state.go('progressiveloyaltycards_view',
            {
                value_id: $scope.value_id
            }, {
                reload: true
            }
        );
    };

    $scope.$on('$destroy', function() {
        if ($scope.pad.modal) {
            $scope.pad.modal.remove();
        }
    });

    $scope.validate_redeem = function() {
        ProgressiveLoyalty.validate_redeem($scope.pad).success(function(data) {
            if (data) {
                if (data.message) {
                    $timeout(function() {
                        Dialog.alert('', data.message, 'OK');
                    }, 2000);
                }

                if (data.close_pad) {
                    $scope.closePad();
                } else {
                    $scope.pad.password = "";
                }

                //if (data.success) {
                //    progressive_report($scope.max_no_of_points, $scope.no_of_points);
                //    httpCache.remove(Url.get("progressiveloyaltycards/mobile_view/findall", {
                //        value_id: $stateParams.value_id
                //    }));
                //    $scope.loadContent();
                //}
            }
            //$rootScope.$broadcast(SB.EVENTS.CACHE.clearSocialGaming);
        }).error(function(data) {

            if (data && data.message) {
                $timeout(function() {
                    Dialog.alert('Error', data.message, 'OK', -1);
                }, 2000);
            }
        }).finally(function() {
            $state.go('progressiveloyaltycards_view',
                {
                    value_id: $scope.value_id
                }, {
                    reload: true
                }
            );
        });
    };

    $scope.validate = function() {
        ProgressiveLoyalty.validate($scope.pad).success(function(data) {
            if (data) {
                

                if (data.close_pad) {
                    $scope.closePad();
                } else {
                    $scope.pad.password = "";
                }

                //if (data.number_of_points) {
                //    if ($scope.layout_id == '3') {
                //        progressive_report($scope.max_no_of_points, data.number_of_points);
                //    }
                //    // Not sure it's still relevant!
                //    httpCache.remove(Url.get("progressiveloyaltycards/mobile_view/findall", {
                //        value_id: $stateParams.value_id
                //    }));
                //    $scope.loadContent();
                //    $scope.card.number_of_points = data.number_of_points;
                //
                //} else {
                //    $scope.loadContent();
                //}
                if (data.message) {
                    $timeout(function() {
                        Dialog.alert('', data.message, 'OK', -1);
                    }, 3000);
                }
                if (data.customer_card_id) {
                    $scope.card.id = data.customer_card_id;
                }
            }
            //$rootScope.$broadcast(SB.EVENTS.CACHE.clearSocialGaming);

        }).error(function(data) {

             if (data && data.message) {
                $timeout(function() {
                    Dialog.alert('Error', data.message, 'OK', -1);
                }, 3000);

                if (data.close_pad) {
                    $scope.closePad();
                    if (data.card_is_locked) {
                        $scope.card_is_locked = true;
                    }
                } else {
                    $scope.pad.password = "";
                }
             }
        }).finally(function() {
            $state.go('progressiveloyaltycards_view',
                {
                    value_id: $scope.value_id
                }, {
                    reload: true
                }
            );
        });
    };

    $scope.login = function() {
        Customer.loginModal($scope);
    };

    $scope.openScanCamera = function() {

        if (!Application.is_webview) {
            $scope.scan_protocols = ["sendback:"];

            if (!$scope.is_logged_in) {
                Modal.fromTemplateUrl('templates/customer/account/l1/login.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(function(modal) {
                    Customer.modal = modal;
                    Customer.modal.show();
                });

                $scope.$on('modal.hidden', function() {
                    $scope.is_logged_in = Customer.isLoggedIn();
                    $scope.showScanCamera();
                });
            } else {
                $scope.showScanCamera();
            }
        } else {
            Dialog.alert('Info', 'This will open the code scan camera on your device.', 'OK', -1);
        }

    };

    $scope.showScanCamera = function() {
        $cordovaBarcodeScanner.scan().then(function(barcodeData) {

            if (!barcodeData.cancelled && barcodeData.text != "") {

                $timeout(function() {
                    $scope.good_qr_code = false;
                    for (var i = 0; i < $scope.scan_protocols.length; i++) {
                        if (barcodeData.text.toLowerCase().indexOf($scope.scan_protocols[i]) == 0) {
                            $scope.good_qr_code = true;
                            $scope.is_loading = true;

                            var qrcode = barcodeData.text.replace($scope.scan_protocols[i], "");
                            $scope.pad.password = qrcode;
                            $scope.pad.mode_qrcode = true;
                            
                            if($scope.is_redeem_function){      
                                $scope.validate();      
                            } else {        
                                $scope.validate_redeem();       
                            }
                            break;
                        }
                    }

                    if (!$scope.good_qr_code) {
                        Dialog.alert('Info', 'Unreadable QRCode, sorry.', 'OK', -1);
                    }

                });

            }

        }, function(error) {
            Dialog.alert('Error', 'An error occurred while reading the code.', 'OK', -1);
        });
    };

    if ($scope.isOverview) {

        $window.prepareDummy = function() {
            $timeout(function() {
                $scope.card = {
                    id: -1,
                    is_visible: true
                };
                $scope.points = [];
            });
        };

        $scope.$on("$destroy", function() {
            $window.prepareDummy = null;
           
        });
    }

    $scope.showTc = function() {
        $state.go("tc-view", {
            tc_id: $scope.tc_id
        });
    };

});