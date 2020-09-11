/** Utility methods */
function removeClassById(id, klass) {
    document.getElementById(id).classList.remove(klass);
}

function addClassById(id, klass) {
    document.getElementById(id).classList.add(klass);
}

function removeClassByClass(klass, css_klass) {
    [].forEach.call(document.getElementsByClassName(klass), function(el) { el.classList.remove(css_klass) });
}

function addClassByClass(klass, css_klass) {
    [].forEach.call(document.getElementsByClassName(klass), function(el) { el.classList.add(css_klass) });
}

/** Utility methods */


App.config(function($stateProvider) {

    $stateProvider
        .state('appointment-view', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id/:widget/:bgcolor/:hdrcolor/:btncolor/:icncolor",
            controller: 'AppointmentController',
            params: {
                widget: { squash: true, value: null },
                bgcolor: { squash: true, value: null },
                hdrcolor: { squash: true, value: null },
                btncolor: { squash: true, value: null },
                icncolor: { squash: true, value: null }
            },
            templateUrl: "modules/appointment/templates/l1/view.html"
        }).state('appointment-booked', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id",
            controller: 'AppointmentBookedController',
            templateUrl: "modules/appointment/templates/l1/booked.html"
        }).state('classes-booked', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id",
            controller: 'ClassesBookedController',
            templateUrl: "modules/appointment/templates/l1/booked-classes.html"
        }).state('appointment-notification', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id",
            controller: 'NotificationController',
            templateUrl: "modules/appointment/templates/l1/notification.html"
        }).state('appointment-location', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id",
            controller: 'LocationController',
            templateUrl: "modules/appointment/templates/l1/location.html"
        }).state('class-location', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id",
            controller: 'ClassLocationController',
            templateUrl: "modules/appointment/templates/l1/book-class-session.html"
        }).state('appointment-checkout', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id/deposit_percentage/:deposit_percentage/meta_data/:meta_data",
            controller: 'AppointmentCheckoutController',
            templateUrl: "modules/appointment/templates/l1/checkout.html"
        }).state('appointment-checkout-operation', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id/deposit_percentage/:deposit_percentage/meta_data/:meta_data/remove_id/:remove_id/rm_service_id/:rm_service_id",
            controller: 'OperationCheckoutController',
            templateUrl: "modules/appointment/templates/l1/checkout.html"
        }).state('appointment-payment-success', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id",
            controller: 'PaymentSuccessController',
            templateUrl: "modules/appointment/templates/l1/success.html"
        }).state('transaction-details', {
            url: BASE_PATH + "/appointment/mobile_view/index/value_id/:value_id/booking_id/:booking_id",
            controller: 'TransactionController',
            templateUrl: "modules/appointment/templates/l1/transaction.html"
        });


}).controller("AppointmentController", function(Customer, $controller, AUTH_EVENTS, $ionicModal, $scope,$stateParams, $state, Appointment) {
        
    $scope.value_id = Appointment.value_id = $stateParams.value_id;
    $scope.is_logged_in = Customer.isLoggedIn();
    $scope.is_loading = true;
    $scope.isDisplayAppointment = true;
    Appointment.widget = $scope.widget = ($stateParams.widget !== null);

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        if (Appointment.widget) {
            viewData.enableBack = false;
        }
    });

    /*SET COLOR DYNAMIC*/
    Appointment.bgcolor  = $stateParams.bgcolor;
    Appointment.hdrcolor = $stateParams.hdrcolor;
    Appointment.btncolor = $stateParams.btncolor;
    Appointment.icncolor = $stateParams.icncolor;

    if ( $stateParams.bgcolor != null ) {
        $scope.COLOR_BACKGROUND = 'ion-content.appointment { background-color: #' + $stateParams.bgcolor + ' !important; }';
    }
    if ( $stateParams.hdrcolor != null ) {
        $scope.COLOR_HEADER = 'ion-header-bar.bar-header.bar{ background-color: #' + $stateParams.hdrcolor + ' !important; }';
    }
    if ( $stateParams.btncolor != null ) {
        $scope.COLOR_BUTTON = 'ion-content.appointment button{ background-color: #' + $stateParams.btncolor + ' !important; }';
    }
    if ( $stateParams.icncolor != null ) {
        $scope.COLOR_ICON = '.tab-item-active > .icon, .tab-item-active > span.tab-title { color: #'+$stateParams.icncolor+' !important; }';
    }

    Appointment.getSettings().success(function(data) {
        
        Appointment.settings = data.settings;
        $scope.display_appointments = data.settings.display_appointments;
        $scope.display_classes = data.settings.display_classes;
        $scope.settings = Appointment.settings;
        $scope.advance_user_management = data.settings.advance_user_management;
    }).finally(function() {
        $scope.is_loading = false;
    });

    $scope.$on(AUTH_EVENTS.loginSuccess, function() {
        $scope.is_logged_in = true;
        if (!$scope.isDisplayAppointment) {
            $scope.gotoBookAppointment();
        }

        if($scope.display_appointments == 1 && $scope.isDisplayAppointment){
            $scope.gotoAppointment();
        }
        if($scope.display_classes == 1){
            $scope.gotoClassesSessions();
        }
       
    });

    $scope.login = function() {
        Customer.loginModal($scope);
    };

    $scope.gotoAppointment = function() {
        if (!Customer.isLoggedIn()) {
            $scope.login();
        } else {
        $state.go("appointment-booked", {
                value_id: $scope.value_id
            }); 
        }
    };
    $scope.gotoClassesSessions = function() {
        if (!Customer.isLoggedIn()) {
            $scope.login();
        } else {
           $state.go("classes-booked", {
                value_id: $scope.value_id
            });
        }
    };

    $scope.gotoBookAppointment = function() {
        if ($scope.advance_user_management == 1) {
            $scope.isDisplayAppointment = false;
            if (!Customer.isLoggedIn()) {
                $scope.login();
            } else {
                $state.go("appointment-location", {
                    value_id: $scope.value_id
                }); 
            }
        } else{
            $state.go("appointment-location", {
                value_id: $scope.value_id
            });
        }
    };
    $scope.show_taransaction = false;
    /*code for new features for class session bookings*/
     $scope.gotoBookClassSession = function() {
        $state.go("class-location", {
            value_id: $scope.value_id
        });
    };
    
        

}).controller('AppointmentBookedController', function($controller, $scope, $ionicModal, $stateParams, $state,
                                                        $translate, Appointment, Customer, $ionicPopup) {

    $scope.value_id = Appointment.value_id = $stateParams.value_id;
    $scope.is_logged_in = Customer.isLoggedIn();
    $scope.is_loading = true;
    $scope.settings = Appointment.settings;
    Appointment.unsetMultiAppointmentData('multi_appointment_data');
    $scope.page_title = $translate.instant("Appointments");

    $scope.goBack = function() {
        $state.go("appointment-view", {
            value_id: $scope.value_id
        });
    };
    /*code to create min cancel event time*/
    d = Math.round(new Date().getTime() / 1000);
    switch (parseInt($scope.settings.cancel_criteria)) {
        case 0:
            {
                $scope.cancel_criteria = false;
                break;
            }
        case 1:
            {
                $scope.cancel_criteria = 0;
                break;
            }
        case 2:
            {
                $scope.cancel_criteria = d + (60 * 60);
                break;
            }
        case 3:
            {
                $scope.cancel_criteria = d + (60 * 60 * 2);
                break;
            }
        case 4:
            {
                $scope.cancel_criteria = d + (60 * 60 * 6);
                break;
            }
        case 5:
            {
                $scope.cancel_criteria = d + (60 * 60 * 12);
                break;
            }
        case 6:
            {
                $scope.cancel_criteria = d + (60 * 60 * 24);
                break;
            }
        case 7:
            {
                $scope.cancel_criteria = d + ((60 * 60 * 24) * 7);
                break;
            }
        default:
            {
                $scope.cancel_criteria = false;
                break;
            }
    }
    $scope.cancel_appointment = function(appointment_id, list) {

        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant("Confirm cancel"),
            template: $translate.instant("Are you sure you want to cancel this appointment?")
        });

        confirmPopup.then(function(res) {
            if (res) {
                $scope.is_loading = true;
                $scope.cancel_event_by_provider = 1;
                Appointment.cancelappointment(3, appointment_id, $scope.cancel_event_by_provider)
                    .success(function(data) {
                        list.status = 3;
                    }).finally(function() {
                        $scope.is_loading = false;
                    });
            }
        });
    };

    $scope.notification = function() {
        $state.go("appointment-notification", {
            value_id: $scope.value_id
        });
    };

    $scope.login = function() {
        Customer.loginModal($scope);

        $state.go("appointment-view", {
            value_id: $scope.value_id
        });
    };

    $scope.loadContent = function(mode) {
        if (!$scope.is_logged_in) {
            $state.go("appointment-view", { value_id: $scope.value_id });
        } else {
            Customer.find().success(function(data) {
                Appointment.displayappointmentlist(data.id).success(function(data) {
                    if (data.status == "success") {
                        $scope.appointmentlist = data.data;
                    } else {
                        $scope.booking_zero = data.message;
                    }
                }).finally(function() {
                    $scope.is_loading = false;
                });

            });
        }
    };

    $scope.apt_time = function(apttime) {
        if ($scope.cancel_criteria === false) {
            return $scope.cancel_criteria;
        }
       
        return Math.round(new Date(apttime).getTime() / 1000) >= $scope.cancel_criteria;
    };

    $scope.loadContent();

     $scope.gotoTransaction = function(booking_id) {
        $state.go("transaction-details", {
            value_id: $scope.value_id,
            booking_id:booking_id
        });
       
    };

}).controller('ClassesBookedController', function($controller, $scope, $ionicModal, $stateParams, $state,
                                                        $translate, Appointment, Customer, $ionicPopup) {

    $scope.value_id = Appointment.value_id = $stateParams.value_id;
    $scope.is_logged_in = Customer.isLoggedIn();
    $scope.is_loading = true;
    $scope.settings = Appointment.settings;

    $scope.page_title = $translate.instant("Classes");

    $scope.goBack = function() {
        $state.go("appointment-view", {
            value_id: $scope.value_id
        });
    };
    /*code to create min cancel event time*/
    d = Math.round(new Date().getTime() / 1000);
    switch (parseInt($scope.settings.cancel_criteria)) {
        case 0:
            {
                $scope.cancel_criteria = false;
                break;
            }
        case 1:
            {
                $scope.cancel_criteria = 0;
                break;
            }
        case 2:
            {
                $scope.cancel_criteria = d + (60 * 60);
                break;
            }
        case 3:
            {
                $scope.cancel_criteria = d + (60 * 60 * 2);
                break;
            }
        case 4:
            {
                $scope.cancel_criteria = d + (60 * 60 * 6);
                break;
            }
        case 5:
            {
                $scope.cancel_criteria = d + (60 * 60 * 12);
                break;
            }
        case 6:
            {
                $scope.cancel_criteria = d + (60 * 60 * 24);
                break;
            }
        case 7:
            {
                $scope.cancel_criteria = d + ((60 * 60 * 24) * 7);
                break;
            }
        default:
            {
                $scope.cancel_criteria = false;
                break;
            }
    }
    $scope.cancel_appointment = function(appointment_id, list) {

        var confirmPopup = $ionicPopup.confirm({
            title: $translate.instant("Confirm cancel"),
            template: $translate.instant("Are you sure you want to cancel this appointment?")
        });

        confirmPopup.then(function(res) {
            if (res) {
                $scope.is_loading = true;
                $scope.cancel_event_by_provider = 1;
                Appointment.cancelappointment(3, appointment_id, $scope.cancel_event_by_provider)
                    .success(function(data) {
                        list.status = 3;
                    }).finally(function() {
                        $scope.is_loading = false;
                    });
            }
        });
    };

    $scope.notification = function() {
        $state.go("appointment-notification", {
            value_id: $scope.value_id
        });
    };

    $scope.login = function() {
        Customer.loginModal($scope);

        $state.go("appointment-view", {
            value_id: $scope.value_id
        });
    };

    $scope.loadContent = function(mode) {
        if (!$scope.is_logged_in) {
            $state.go("appointment-view", { value_id: $scope.value_id });
        } else {
            Customer.find()
                .success(function(data) {
                    Appointment.displayclasseslist(data.id)
                        .success(function(data) {
                            if (data.status == "success") {
                                $scope.appointmentlist = data.data;
                            } else {
                                $scope.booking_zero = data.message;
                            }
                        }).finally(function() {
                            $scope.is_loading = false;
                        });

                });
        }
    };

    $scope.apt_time = function(apttime) {
        if ($scope.cancel_criteria === false) {
            return $scope.cancel_criteria;
        }
       
        return Math.round(new Date(apttime).getTime() / 1000) >= $scope.cancel_criteria;
    };

    $scope.loadContent();

}).controller('NotificationController', function(Customer, $controller, AUTH_EVENTS, $ionicModal, $scope,
                                                 $stateParams, $state, Appointment) {

    $scope.value_id = Appointment.value_id = $stateParams.value_id;
    $scope.settings = Appointment.settings;

    Customer.find().success(function(data) {
        Appointment.getnotificationstatus(data.id).success(function(data) {
            
        if (data.status) {
                $scope.isActive = data.notification_time;;
            } else {
                $scope.isActive = 2;
            }
        }).finally(function() {
            $scope.is_loading = false;
        });
    });


    $scope.value_id = Appointment.value_id = $stateParams.value_id;

    $scope.notify_time = function(index) {
        $scope.isActive = index;
        Customer.find().success(function(data) {
            Appointment.appointmentnotify(data.id, index).success(function(data) {
                // do nothing.
            }).finally(function() {
                $scope.is_loading = false;
            });
        });
    };
}).controller('LocationController', function($controller,$ionicPopup, $sce,$ionicScrollDelegate, $ionicTabsDelegate, Authorization,Customer, $ionicModal, AUTH_EVENTS, $rootScope, $scope, $stateParams,$translate, $compile, $state, Appointment, $timeout,Enterprisepaymentpro,$ionicLoading) {
    Enterprisepaymentpro.getPaymentValueId();
    $scope.location_tab = true;
    $scope.category_tab = true;
    $scope.service_tab  = true;
    $scope.provider_tab = true;
    $scope.date_tab     = true;
    $scope.info_tab     = true;
    $scope.confirm_tab  = true;
    $scope.is_loading   = true;
    $scope.value_id     = Appointment.value_id = $stateParams.value_id;
    $scope.is_logged_in = Customer.isLoggedIn();

    $scope.location_title   = $translate.instant("Location");
    $scope.category_title   = $translate.instant("Category");
    $scope.service_title    = $translate.instant("Service");
    $scope.provider_title   = $translate.instant("Provider");
    $scope.date_title       = $translate.instant("Date");
    $scope.info_title       = $translate.instant("Info");
    $scope.confirm_title    = $translate.instant("Confirm");
    var category_for        = 1;//for serice appointment
    var service_type        = 1;

    $scope.isUserLocation = true;

    $scope.trustAsHtml = function(string) {
        return $sce.trustAsHtml(string);
    };
    
    $scope.settings = Appointment.settings;
    
    if ( Appointment.bgcolor != null ) {
        $scope.COLOR_BACKGROUND = 'ion-content.appointment { background-color: #' + Appointment.bgcolor + ' !important; }';
    }
    if ( Appointment.hdrcolor != null ) {
        $scope.COLOR_HEADER = 'ion-header-bar.bar-header.bar{ background-color: #' + Appointment.hdrcolor + ' !important; }';
    }
    if ( Appointment.btncolor != null ) {
        $scope.COLOR_BUTTON = 'ion-content.appointment button{ background-color: #' + Appointment.btncolor + ' !important; }';
    }
    if ( Appointment.icncolor != null ) {
        $scope.COLOR_ICON = '.view_appointment .tab-item-active > .icon, .view_appointment .tab-item-active > span.tab-title { color: #'+Appointment.icncolor+' !important; }';
    }
    
    $scope.login = function() {
        Customer.loginModal($scope);
    };

    //Code to show available Locations
    Appointment.getLocations().success(function(data) {
        $scope.location = false;
        $scope.page_title = data.page_title;
        if (data.locations) {
            $scope.isUserLocation = true;
            if (data.total_records == 1) {
                $scope.location_tab = false;
                $scope.gotoloc(data.locations[0].location_id);
            }
            $scope.locations = data.locations;
            $scope.location = true;
            $scope.goBack = function() {
                $state.go("appointment-view", {
                    value_id: $scope.value_id
                });
            }
        } else {
            $scope.isUserLocation = false;
        }
    }).finally(function() {
        $scope.is_loading = false;
    });

    $scope.showLocations    = true;
    $scope.showCategories   = false;
    $scope.showServices     = false;
    $scope.showProviders    = false;
    $scope.showCalendar     = false;
    $scope.showTime         = false;
    $scope.showInformation  = false;
    $scope.showConfirmInformation = false;
    $scope.thankyoupage     = false;

    $scope.gotoloc = function(location_id) {
        $ionicTabsDelegate.select(1);
        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.is_loading       = true;
        $scope.showLocations    = false;
        $scope.showCategories   = true;
        $scope.location_id      = location_id;

        //Code to show available Categories

        Appointment.getcategories($scope.location_id, category_for).success(function(data) {
                $scope.is_loading = true;
                $scope.category = false;
                $scope.page_title = data.page_title;
                $scope.categories = data.categories;
                $scope.category = true;

                if (data.total_records == 0) {
                    $scope.no_category = true;
                    $scope.category_present = false;
                    $scope.blank_category = "Category Not Present";
                } else {
                    if (data.total_records == 1) {
                        $scope.category_tab = false;
                        $scope.gotoCategory(data.categories[0].category_id);
                    }
                    if(data.total_records > 1){
                        Appointment.setLocalKey('local_key',1);
                        $scope.showServices = true;
                    }else{
                        Appointment.setLocalKey('local_key',0);
                        $scope.category = true;
                    }

                    $scope.no_category = false;
                    $scope.category_present = true;
                    if (data.categories) {
                        $scope.locations = data.locations;
                        $scope.location = true;
                    }
                }

                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: $scope.value_id
                    });
                }

            }).finally(function() {
                $scope.is_loading = false;
            });

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showCategories = false;
            $scope.showLocations = true;

            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

    };

    $scope.gotoCategory = function(category_id) {
        $ionicTabsDelegate.select(2);
        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.is_loading       = true;
        $scope.showCategories   = false;
        $scope.showServices     = true;
        $scope.category_id      = category_id;

        //Code to show available Services
        Appointment.getservices($scope.location_id, $scope.category_id, service_type).success(function(data) {
                $scope.page_title = data.page_title;
                if (data.total_records == 0) {
                    $scope.no_service = true;
                    $scope.service_present = false;
                    $scope.blank_service = "Service Not Present";
                } else {
                    $scope.no_service = false;
                    $scope.service_present = true;
                    $scope.service = false;
                    $scope.services = data.services;
                    $scope.service = true;
                }
                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: $scope.value_id
                    });
                }
            }).finally(function() {
                $scope.is_loading = false;
            });

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showLocations = true;

            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

        $scope.loadcategory = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = true;
            $scope.showServices = false;
        };
    };

    $scope.gotoService = function(service_id, name,price) {
        $ionicTabsDelegate.select(3);

        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.is_loading = true;
        $scope.showServices = false;
        $scope.showProviders = true;
        $scope.service_id = service_id;
        $scope.service_name = name;
        $scope.price = price;

        /* var res             =  $scope.price.split(",");
        var s_amount       = res[0]+'.'+res[1];

        var char_check = s_amount.charAt(s_amount.length-1);
        
        if (char_check == '€' ) {
            $scope.currency = '€';
            console.log('Eur go---');
            var amount_res      = s_amount.split(" €");
            $scope.service_amount  = amount_res[0];
        }else{
            var char_check  = s_amount.charAt(0)
            //s_amount.charAt(s_amount.length-1);
            if (char_check == '$' ) {
                $scope.currency = '$';
                console.log('Dolar go---');
                var amount_res      = s_amount.split("$");
                $scope.service_amount  = amount_res[1];
            }
        }*/


    $scope.payme_details_show =false;
    Appointment.getPaymentSettings( $scope.price).success(function(data){
        $scope.payment_settings = data.payment_settings;

        if ($scope.payment_settings.paid_on_booking == 1){
           
            var current_customer_appointments_check =  Appointment.getMultiAppointmentData('multi_appointment_data');
            if($scope.book_multi_appointment > 0){
                $scope.payme_details_show = false;
            }else{
                $scope.payme_details_show = true;
            }
            $scope.deposit   = data.payment_settings.deposit;
            $scope.deposit_without_currency = data.payment_settings.deposit_without_currency;
            $scope.net_due   =  data.payment_settings.net_due;
        }
       
    })
    /////////////////////
        //Code to show available Providers
        Appointment.getproviders($scope.location_id, $scope.category_id, $scope.service_id).success(function(data) {
                $scope.provider         = false;
                $scope.page_title       = data.page_title;
                if (data.provider) {
                    $scope.providers    = data.providers;
                    $scope.base_url     = data.base_url;
                    $scope.date_format  = data.date_format;
                }

                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: $scope.value_id
                    });
                };

            }).finally(function() {
                $scope.is_loading = false;
            });

        $scope.custom = true;
        $scope.prv = 0;
        $scope.show_pro_info = function(provider_id) {
            $scope.prv = ($scope.prv == provider_id) ? 0 : provider_id;
        };

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showProviders = false;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showLocations = true;

            Appointment.getLocations().success(function(data) {
                $scope.locations = data.locations;
            }).finally(function() {
                $scope.is_loading = false;
            });
        };

        $scope.loadcategory = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showProviders = false;
            $scope.showLocations = false;
            $scope.showCategories = true;
            $scope.showServices = false;
        };

        $scope.loadservice = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showProviders = false;
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = true;
        };
    };

    $scope.gotoProvider = function(provider_id, name) {
        $ionicTabsDelegate.select(4);

        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.page_title = $translate.instant("Appointments");
        $scope.showProviders = false;
        $scope.showCalendar = true;
        $scope.provider_id = provider_id;
        $scope.provider_name = name;

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = true;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = false;

            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

        $scope.loadcategory = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = true;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = false;
        };

        $scope.loadservice = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = true;
            $scope.showProviders = false;
            $scope.showCalendar = false;
            $scope.showTime = false;
        };

        $scope.loadprovider = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = true;
            $scope.showCalendar = false;
            $scope.showTime = false;

        };
    };

    var d = new Date();
    var present_month = d.getMonth();
    var present_date = d.getDate();

    $scope.loadContent = function(mode) {
        var month = [
            $translate.instant("January"),
            $translate.instant("February"),
            $translate.instant("March"),
            $translate.instant("April"),
            $translate.instant("May"),
            $translate.instant("June"),
            $translate.instant("July"),
            $translate.instant("August"),
            $translate.instant("September"),
            $translate.instant("October"),
            $translate.instant("November"),
            $translate.instant("December")
        ];
        var days = [
            $translate.instant("Sunday"),
            $translate.instant("Monday"),
            $translate.instant("Tuesday"),
            $translate.instant("Wednesday"),
            $translate.instant("Thursday"),
            $translate.instant("Friday"),
            $translate.instant("Saturday")
        ];
        var days_abr = [
            $translate.instant("Sun"),
            $translate.instant("Mon"),
            $translate.instant("Tue"),
            $translate.instant("Wed"),
            $translate.instant("Thu"),
            $translate.instant("Fri"),
            $translate.instant("Sat")
        ];

        Number.prototype.pad = function(num) {
            var str = '';
            for (var i = 0; i < (num - this.toString().length); i++)
                str += '0';
            return str += this.toString();
        };

        function calendari(widget, data) {
            var original = widget.getElementsByClassName('active')[0];

            if (typeof original === 'undefined') {
                original = document.createElement('table');
                original.setAttribute('data-actual',
                    data.getFullYear() + '/' +
                    data.getMonth() + '/' +
                    data.getDate());
                widget.appendChild(original);
            }
            var diff = data - new Date(original.getAttribute('data-actual'));
            diff = new Date(diff).getMonth();
            var e = document.createElement('table');

            e.addclass = 'table table-bordered table-fixed monthview-datetable';
            e.className = diff === 0 ? 'hide-left' : 'hidden-right';
            e.innerHTML = '';

            widget.appendChild(e);
            e.setAttribute('data-actual',
                data.getDate().pad(2) + '/' +
                (data.getMonth()).pad(2) + '/' +
                data.getFullYear());

            var row = document.createElement('tr');
            var title = document.createElement('th');

            title.setAttribute('colspan', 7);

            var boto_prev = document.createElement('button');
            boto_prev.className = 'boto-prev';
            boto_prev.innerHTML = '&#9666;';

            var boto_next = document.createElement('button');
            boto_next.className = 'boto-next';
            boto_next.innerHTML = '&#9656;';

            title.appendChild(boto_prev);
            title.appendChild(document.createElement('span')).innerHTML =
                month[data.getMonth()] + '<span class="any">' + data.getFullYear() + '</span>';

            title.appendChild(boto_next);

            boto_prev.onclick = function() {
                data.setMonth(data.getMonth() - 1);
                calendari(widget, data);
            };

            boto_next.onclick = function() {
                data.setMonth(data.getMonth() + 1);
                calendari(widget, data);
            };

            row.appendChild(title);
            e.appendChild(row);

            row = document.createElement('tr');

            for (var i = 1; i < 7; i++) {
                row.innerHTML += '<th><small>' + days_abr[i] + '</small></th>';
            }

            row.innerHTML += '<th><small>' + days_abr[0] + '</small></th>';
            e.appendChild(row);

            var cal_mes = new Date(data.getFullYear(), data.getMonth(), -1).getDay();
            if (cal_mes == 6) {
                var actual = new Date(data.getFullYear(),
                    data.getMonth());
            } else {
                var actual = new Date(data.getFullYear(),
                    data.getMonth(), -cal_mes);
            }
            for (var s = 0; s < 6; s++) {
                var row = document.createElement('tr');
                for (var d = 1; d < 8; d++) {
                    var cell = document.createElement('td');
                    var span = document.createElement('small');

                    cell.appendChild(span);
                    cell.setAttribute('id',
                        actual.getDate().pad(2) + '/' +
                        (actual.getMonth() + 1).pad(2) + '/' +
                        actual.getFullYear()
                    );
                    cell.setAttribute('class',
                        actual.getDate().pad(2) + '-' +
                        (actual.getMonth() + 1).pad(2) + '-' +
                        actual.getFullYear()
                    );

                    var full_date = actual.getDate().pad(2) + '/' + (actual.getMonth() + 1).pad(2) + '/' + actual.getFullYear();
                    $scope.date = full_date;


                    if (actual.getMonth() !== data.getMonth()) {
                        cell.className = 'text-muted';
                    } else {
                        span.innerHTML = actual.getDate();
                        if ((data.getDate() > actual.getDate()) && (actual.getMonth() == present_month)) {
                            cell.className = 'previous';
                        } else {
                            cell.setAttribute('ng-click', 'viewDate("' + full_date + '")');
                        }
                    }
                    if (actual.getDate() == present_date && actual.getMonth() == present_month)
                        cell.className = 'today';

                    actual.setDate(actual.getDate() + 1);
                    $compile(cell)($scope);
                    row.appendChild(cell);
                }
                e.appendChild(row);
                if (actual.getMonth() !== data.getMonth() && (actual.getMonth() > data.getMonth())) {
                    break;
                }
            }
            setTimeout(function() {
                e.className = 'active';
                original.className +=
                    diff === 0 ? ' hidden-right' : ' hide-left';
            }, 20);
            original.className = 'inactive';

            setTimeout(function() {
                var inactives = document.getElementsByClassName('inactive');
                for (var i = 0; i < inactives.length; i++)
                    widget.removeChild(inactives[i]);
            }, 1000);
        }
        $timeout(function() { calendari(document.getElementById('calendar'), new Date()); });
    };
    $scope.loadContent();

    $scope.date = '';
    $scope.viewDate = function(date) {
        $scope.is_loading_time = true;
        if ($scope.date != '') {
            removeClassByClass($scope.date.split("/").join("-"), "item-divider");
            removeClassByClass($scope.date.split("/").join("-"), "item-divider-custom");
            addClassByClass(date.split("/").join("-"), "item-divider");
            addClassByClass(date.split("/").join("-"), "item-divider-custom");
        }
        $scope.date = $scope.display_date = date;
        if ($scope.date_format == 'mm/dd/yyyy') {
            var display_date = date.split("/");
            $scope.display_date = display_date[1] + '/' + display_date[0] + '/' + display_date[2];
        }

        Appointment.availabletimelist($scope.location_id, $scope.category_id, $scope.service_id, $scope.provider_id, date).success(function(data) {
                if (data.status == "success") {
                    $scope.is_loading_time = true;
                    $scope.time_persent = true;
                    $scope.showTime = true;
                    $scope.no_time = false;
                    $scope.displayTime = data.data.displayTime;
                    $scope.service_time = data.data.serviceTime;
                    $scope.sId = data.data.sId;
                    $scope.morningTime = {};
                    $scope.afternoonTime = {};
                    $scope.eveningTime = {};
                    var d = new Date(),
                        isToday = false,
                        t = 0;
                    var dd = ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
                    if (date == dd) {
                        isToday = true;
                        t = (d.getHours() * 3600) + (d.getMinutes() * 60);
                    }
                    for (var key in data.data.displayTime) {
                        if (isToday && key < t) {
                            continue;
                        }
                        if (key < 43200) {
                            $scope.morningTime[key] = data.data.displayTime[key];
                        }
                        if (key >= 43200 && key < 61200) {
                            $scope.afternoonTime[key] = data.data.displayTime[key];
                        }
                        if (key >= 61200) {
                            $scope.eveningTime[key] = data.data.displayTime[key];
                        }
                    }
                } else {
                    $scope.is_loading_time = true;
                    $scope.time_persent = false;
                    $scope.showTime = true;
                    $scope.no_time = true;
                    $scope.message = data.message;
                }

                $scope.goBack = function() {
                    $state.go("appointment-view", { value_id: $scope.value_id });
                };
                $scope.loadlocation = function(index) {
                    $ionicTabsDelegate.select(index);
                    $scope.showLocations = true;
                    $scope.showCategories = false;
                    $scope.showServices = false;
                    $scope.showProviders = false;
                    $scope.showCalendar = false;
                    $scope.showTime = false;

                    Appointment.getLocations().success(function(data) {
                        $scope.locations = data.locations;
                    }).finally(function() {
                        $scope.is_loading_time = false;
                    });
                };

                $scope.loadcategory = function(index) {
                    $ionicTabsDelegate.select(index);
                    $scope.showLocations = false;
                    $scope.showCategories = true;
                    $scope.showServices = false;
                    $scope.showProviders = false;
                    $scope.showCalendar = false;
                    $scope.showTime = false;
                };

                $scope.loadservice = function(index) {
                    $ionicTabsDelegate.select(index);
                    $scope.showLocations = false;
                    $scope.showCategories = false;
                    $scope.showServices = true;
                    $scope.showProviders = false;
                    $scope.showCalendar = false;
                    $scope.showTime = false;
                };

                $scope.loadprovider = function(index) {
                    $ionicTabsDelegate.select(index);
                    $scope.showLocations = false;
                    $scope.showCategories = false;
                    $scope.showServices = false;
                    $scope.showProviders = true;
                    $scope.showCalendar = false;
                    $scope.showTime = false;
                };
            }).finally(function() {
                $scope.is_loading_time = false;
            });

        return ($scope.showTime ? $scope.showTime = false : $scope.showTime = true)

    };
    $scope.showAlert = function(date){
        //$ionicPopup.alert({template:$translate.instant("Time slot already used for multi-booking."),buttons: [{ text: $translate.instant("OK") }]});
        $scope.viewDate(date);
        return;
    };
    $scope.gotoDateTime = function(k, v) {
       
        $ionicTabsDelegate.select(5);
        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);
          
        if (!$scope.is_logged_in) {
            $scope.$on(AUTH_EVENTS.loginSuccess, function() {
                $scope.is_logged_in = true;
                $scope.gotoDateTime();
                $scope.time = v;
                $scope.time_value = k;
               
            });
            $scope.login();
            return;
        }
        $scope.time = v;
        $scope.time_value = k;
        Customer.find()
            .success(function(data) {
                $scope.input.customer_id = data.id;
                $scope.input.Name = data.firstname + " " + data.lastname;
                $scope.input.Email = data.email;
            });
        /////////////////////
        $scope.nextgo_to = false;
        var current_customer_appointments   = JSON.parse( Appointment.getMultiAppointmentData('multi_appointment_data'));
        if(current_customer_appointments != null){
           angular.forEach(current_customer_appointments, function(value, index) {

                    if(value.time == v){
                    $scope.showAlert(value.date);
                    $scope.nextgo_to = true;
                    return;
                }
            });
        }
        if( $scope.nextgo_to != true){
            /*********POP UP FOR CONDITIO********/
             // A confirm dialog
            
            //check to check multi book enable or not
             Appointment.getSettings()
                .success(function(data) {
                    
                    $scope.settings = data.settings;
                }).finally(function() {
                    $scope.is_loading = false;
                });
               
                angular.element(document.querySelector('body')).removeClass('modal-open');

                var offset = new Date().getTimezoneOffset();
                if ($scope.settings.display_multi_appointments == 1) {
                    
                    var confirmPopup = $ionicPopup.confirm({
                        title: $translate.instant("Confirm"),
                        template: $translate.instant("Do you want to book another appointment ?"),
                        buttons: [
                            {  text: $translate.instant("NO"),onTap: function(e) {  return false; } },
                            {  text: $translate.instant("YES"),onTap: function(e) { return true; } },
                        ]
                    });

                    var multi_appointments = 0;
                    /*check for local storage multi appointment data set*/
                    if(Appointment.getMultiAppointmentData('multi_appointment_data') != null || Appointment.getMultiAppointmentData('multi_appointment_data') == undefined){
                        $scope.multi_appointments = [];
                    }

                    confirmPopup.then(function(res){
                        var confg = $scope.conf;
                        /*confimation for recuring*/
                        var date_arr    = $scope.date.split("/"); 
                        var date_val_str= date_arr[1]+'-'+''+date_arr[0]+'-'+date_arr[2];
                        var date_string = new Date(date_val_str);//dd-mm-yyyy
                        var weekdays    = new Array(7);
                        weekdays[0]     = "Sunday";
                        weekdays[1]     = "Monday";
                        weekdays[2]     = "Tuesday";
                        weekdays[3]     = "Wednesday";
                        weekdays[4]     = "Thursday";
                        weekdays[5]     = "Friday";
                        weekdays[6]     = "Saturday";
                        var booking_day = weekdays[date_string.getDay()];
                        
                        if(res) {
                            $scope.payme_details_show = false;
                            /*If customer clicks yes we want to book another appointment then go inside*/
                            var multi_appointment_obj =  {
                                value_id        :  $scope.value_id,
                                location_id     :  $scope.location_id,
                                category_id     :  $scope.category_id,
                                service_id      :  $scope.service_id,
                                provider_id     :  $scope.provider_id,
                                date            :  $scope.date,
                                time            :  $scope.time,
                                time_value      :  $scope.time_value,
                                service_time    :  $scope.service_time, 
                                sId             :  $scope.sId,
                                offset          :  offset, 
                                
                            };
                            /*push data to local cart*/
                            $scope.multi_appointments.push(multi_appointment_obj);
                            var current_customer_appointments_check =  Appointment.getMultiAppointmentData('multi_appointment_data');
                            //if we have multi multibooki details
                            if(current_customer_appointments_check  != null){
                                var current_customer_appointments   = JSON.parse( Appointment.getMultiAppointmentData('multi_appointment_data'));
                                angular.forEach(current_customer_appointments, function(value, index) {
                                     $scope.multi_appointments.push(value);
                                      
                                });
                                Appointment.setMultiAppointmentData( $scope.multi_appointments);
                            }else{
                                Appointment.setMultiAppointmentData( $scope.multi_appointments);
                            }
                            
                            $scope.book_multi_appointment = 1;
                            
                            $scope.showLocations    = false;
                            if(Appointment.getLocalKey('local_key') == 1 ){
                                $ionicTabsDelegate.select(1);
                                $scope.showServices     = false;
                                $scope.showCategories   = true;

                            }else{
                                $ionicTabsDelegate.select(2);
                                $scope.showCategories   = false;
                                $scope.showServices     = true;
                               
                            }
                            $scope.showProviders    = false;
                            $scope.showCalendar     = false;
                            $scope.showTime         = false;
                            $scope.showInformation  = false;
                            $scope.is_loading = false;
                        }else{
                            //not multi booking
                            $scope.showCalendar = false;
                            $scope.showTime = false;
                            confirmPopup.close();
                            $scope.showInformation = true;
                            //$('body').removeClass('modal-open');
                            angular.element(document.querySelector('body')).removeClass('modal-open');
                        }
                    });

                }else{
                    $scope.showCalendar = false;
                    $scope.showTime = false;
                    
                    $scope.showInformation = true;
                    //$('body').removeClass('modal-open');
                    angular.element(document.querySelector('body')).removeClass('modal-open');
                }
            }     
        /////////////////////
        $scope.input = Authorization;
        console.log('from appo');
        console.log($scope.input);

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = true;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = false;
            $scope.showTime = false;
            $scope.showInformation = false;
            $scope.thankyoupage = false;

            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

        $scope.loadcategory = function(index) {
            $scope.thankyoupage = false;
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = true;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = false;
            $scope.showTime = false;
            $scope.showInformation = false;
        };

        $scope.loadservice = function(index) {
            $scope.thankyoupage = false;
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = true;
            $scope.showProviders = false;
            $scope.showCalendar = false;
            $scope.showTime = false;
            $scope.showInformation = false;
        };
        $scope.loadprovider = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = true;
            $scope.showCalendar = false;
            $scope.showTime = false;
            $scope.showInformation = false;
            $scope.thankyoupage = false;
        };
        $scope.loaddate = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = true;
            $scope.showTime = false;
            $scope.showInformation = false;
            $scope.thankyoupage = false;
        }
    };

    $scope.gotoInformation = function() {
        $ionicTabsDelegate.select(6);
        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.showInformation = false;
        $scope.showConfirmInformation = true;
        $scope.thankyoupage = false;
        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = true;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = false;
            $scope.showTime = false;
            $scope.showInformation = false;
            $scope.showConfirmInformation = false;
            $scope.thankyoupage = false;
            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

        $scope.loadservice = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = true;
            $scope.showProviders = false;
            $scope.showCalendar = false;
            $scope.showTime = false;
            $scope.showInformation = false;
            $scope.showConfirmInformation = false;
            $scope.thankyoupage = false;

        };
        $scope.loadprovider = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = true;
            $scope.showCalendar = false;
            $scope.showTime = false;
            $scope.showInformation = false;
            $scope.showConfirmInformation = false;
            $scope.thankyoupage = false;
        };
        $scope.loaddate = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = true;
            $scope.showTime = false;
            $scope.showInformation = false;
            $scope.showConfirmInformation = false;
            $scope.thankyoupage = false;
        };
        $scope.loadinfo = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = false;
            $scope.showTime = false;
            $scope.showInformation = true;
            $scope.showConfirmInformation = false;
            $scope.thankyoupage = false;
        }
    };

///////////////////

       
    $scope.gotoBookAppointment  = function() {
        $scope.is_loading       = true;
        var multi_booking_data  = null;
        var current_appointments_check = Appointment.getMultiAppointmentData('multi_appointment_data')
        if (current_appointments_check != null && current_appointments_check != undefined) {
            multi_booking_data  = JSON.stringify(Appointment.getMultiAppointmentData('multi_appointment_data'));
            $scope.booking_type = 2; //multibooking
        }else{
            $scope.booking_type = 1;//single booking
        }
        
        $scope.showLocations    = false;
        $scope.showServices     = false;
        $scope.showCategories   = false;
        $scope.showProviders    = false;
        $scope.showTime         = false;
        $scope.showCalendar     = false;
        $scope.showInformation  = false;
        $scope.showConfirmInformation = false;
        $scope.thankyoupage = false;
        var offset = new Date().getTimezoneOffset();
        var book_appointment_payment_obj =  {
            value_id        :  $scope.value_id,
            location_id     :  $scope.location_id,
            category_id     :  $scope.category_id,
            service_id      :  $scope.service_id,
            provider_id     :  $scope.provider_id,
            date            :  $scope.date,
            time            :  $scope.time,
            time_value      :  $scope.time_value,
            service_time    :  $scope.service_time, 
            sId             :  $scope.sId,
            booking_type    :  $scope.booking_type,
            service_amount  :  $scope.service_amount,
            service_name    :  $scope.service_name,
            currency        :  $scope.currency,
            input           :  $scope.input,
            multi_booking_data: multi_booking_data,
            offset          : offset, 
            
        };
        Appointment.getPaymentSettings($scope.service_amount).success(function(data)
        {
            $scope.is_loading       = true;
            $scope.payment_settings = data.payment_settings;
        }).finally(function() {
            Appointment.getSettings().success(function(data) {
                $scope.is_loading = true;
                    $scope.settings = Appointment.settings;
                }).finally(function() {
                   $scope.is_loading = false;
                    var current_customer_appointments_check =  Appointment.getMultiAppointmentData('multi_appointment_data');
                    //paid on booking check only for single booking and also not work for multibooking display_multi_appointments
                    if ($scope.payment_settings.paid_on_booking == 1 && (current_customer_appointments_check == null || current_customer_appointments_check == undefined)) {
                        var book_appointment_obj=  {
                            value_id            :  $scope.value_id,
                            location_id         :  $scope.location_id,
                            category_id         :  $scope.ategory_id,
                            service_id          :  $scope.service_id,
                            provider_id         :  $scope.provider_id,
                            date                :  $scope.date,
                            time                :  $scope.time,
                            time_value          :  $scope.time_value,
                            service_time        :  $scope.service_time, 
                            sId                 :  $scope.sId,
                            booking_type        :  1,
                            service_amount      :  $scope.service_amount,
                            deposit             :  $scope.deposit,
                            due_later           :  $scope.net_due, 
                            deposit_percentage  :  $scope.payment_settings.require_payment_for_booking,
                            input               :  $scope.input,
                            multi_booking_data  :  $scope.multi_booking_data,
                            offset              :  $scope.offset, 
                            customer_id         :  $scope.input['customer_id'],
                        };
                        //check payment module install by user or not from editr section
                        if (Enterprisepaymentpro.enterprisepaymentValueId) {
                            console.log('before go- sigle booking--');
                            console.log(book_appointment_obj);
                            //temp comment for payment disable
                           $state.go('enterprisepayment_process',{value_id: Enterprisepaymentpro.enterprisepaymentValueId, amount:$scope.deposit_without_currency,return_value_id: $stateParams.value_id,order_id:1,meta_data:JSON.stringify(book_appointment_obj)}, {reload: true});
                        } else {
                            var alertPopup = $ionicPopup.alert({
                              template: $translate.instant("Please add Enterprisepayment Module in the App")
                            });
                        }
                        
                    } else {
                        
                        /*variable to set multi*/
                        //var current_customer_appointments_check =  Appointment.getMultiAppointmentData('multi_appointment_data');
                        if($scope.book_multi_appointment > 0  && current_customer_appointments_check != null && current_customer_appointments_check != undefined){
                            $scope.book_multi_appointment = 1;
                            /********************************/
                            $scope.payme_details_show = false;
                            /*If customer clicks yes we want to book another appointment then go inside*/
                            var multi_appointment_obj =  {
                                value_id        :  $scope.value_id,
                                location_id     :  $scope.location_id,
                                category_id     :  $scope.category_id,
                                service_id      :  $scope.service_id,
                                service_amount  :  $scope.service_amount,
                                provider_id     :  $scope.provider_id,
                                date            :  $scope.date,
                                time            :  $scope.time,
                                time_value      :  $scope.time_value,
                                service_time    :  $scope.service_time, 
                                sId             :  $scope.sId,
                                input           :  $scope.input,
                                offset          :  offset, 
                                customer_id     :  $scope.input['customer_id'],

                                
                            };
                            /*push data to local cart*/
                            $scope.multi_appointments.push(multi_appointment_obj);
                            if(current_customer_appointments_check != null){
                                var current_customer_appointments = JSON.parse( Appointment.getMultiAppointmentData('multi_appointment_data'));
                                angular.forEach(current_customer_appointments, function(value, index) {
                                             $scope.multi_appointments.push(value);
                                              
                                    });
                                Appointment.setMultiAppointmentData( $scope.multi_appointments);
                            }else{
                                Appointment.setMultiAppointmentData( $scope.multi_appointments);
                            }
                            /********************************/
                            $scope.multi_appointments = JSON.parse( Appointment.getMultiAppointmentData('multi_appointment_data'));
                            $scope.multi_appointments.forEach(function (newItem) {
                                    newItem.input                =  $scope.input;
                            });
                            Appointment.setMultiAppointmentData( $scope.multi_appointments);
                            var all_multi_appo_data = Appointment.getMultiAppointmentData('multi_appointment_data');

                            /****************************Do if payment for multibboking if enanle payment and multibooking********************************/
                            if ($scope.payment_settings.paid_on_booking == 1 && $scope.settings.display_multi_appointments == 1){
                                //////////////////----------This wil use for multi booking-------------////////////
                               
                                $state.go("appointment-checkout", {
                                    value_id            :  $scope.value_id,
                                    deposit_percentage  :  $scope.payment_settings.require_payment_for_booking,
                                    meta_data:JSON.stringify(all_multi_appo_data)
                                });
                                ///////////////////////------------------------//////////////////////////////////
                            }else{
                                //defaulti multibboking without payment
                                Appointment.multiappointmentsession(all_multi_appo_data).success(function(data) {
                                    Appointment.unsetMultiAppointmentData('multi_appointment_data');
                                    if (data.success == true) {
                                        Appointment.unsetMultiAppointmentData('multi_appointment_data');
                                        $scope.appointment_success = true;
                                        $scope.success = $translate.instant("Thank You!");
                                        Appointment.getnotificationstatus($scope.input['customer_id']).success(function(data) {
                                           
                                            if (data.status) {
                                                $scope.notification_time = data.notification_time;
                                            } else {
                                                $scope.notification_time = 2;
                                            }

                                        }).finally(function() {
                                            $scope.is_loading = false;
                                            $scope.thankyoupage = true;
                                        });
                                        $scope.thankyoupage = true;
                                    } else {
                                        $scope.appointment_error = true;
                                        $scope.error = data.message;
                                    }

                                    $scope.goBack = function() {
                                        $state.go("appointment-view", {
                                            value_id: $scope.value_id
                                        });
                                    };
                                }).finally(function() {
                                    $scope.is_loading = false;

                                });
                            }
                            ////////////////////////////End Multi booking payment////////////////////////////////
                            
                        }else{
                            
                            $scope.book_multi_appointment = 0;
                            Appointment.bookappointment($scope.location_id, $scope.category_id, $scope.service_id, $scope.provider_id,
                            $scope.date, $scope.time, $scope.time_value, $scope.service_time, $scope.sId, $scope.input, offset, $scope.book_multi_appointment)
                            .success(function(data) {
                                Appointment.unsetMultiAppointmentData('multi_appointment_data');
                                if (data.status == "success") {
                                    $scope.appointment_success = true;
                                    $scope.success = $translate.instant("Thank You!");
                                    Appointment.getnotificationstatus($scope.input['customer_id'])
                                        .success(function(responsedata) {
                                           
                                            if (responsedata.status) {
                                                $scope.notification_time = responsedata.notification_time;
                                            } else {
                                                $scope.notification_time = 2;
                                            }

                                        }).finally(function() {
                                            $scope.is_loading = false;
                                        });
                                    $scope.thankyoupage = true;
                                     /*$state.go("appointment-payment-success", {
                                        value_id: $scope.value_id,//app_data.value_id
                                    });*/
                                } else {
                                    $scope.appointment_error = true;
                                    $scope.error = data.message;
                                }

                                $scope.goBack = function() {
                                    $state.go("appointment-view", {
                                        value_id: $scope.value_id
                                    });
                                };

                            }).finally(function() {
                                $scope.is_loading = false;
                            });
                        }/*else*/
                    
                    }//paid on booking ends
                });//setting finaly
            });
        $scope.goBack = function() {
            $state.go("appointment-view", {
                value_id: $scope.value_id
            });
        }
    }

    /******come for sinle payment booking**/
    //check for payer id get from paymet and then inside
    
    if (Enterprisepaymentpro.payerId !=null) {
        $scope.is_loading = true;
        $scope.showLocations = false;
        $scope.showServices = false;
        $scope.showCategories = false;
        $scope.showProviders = false;
        $scope.showTime = false;
        $scope.showCalendar = false;
        $scope.showInformation = false;
        $scope.showConfirmInformation = false;
        $scope.thankyoupage = false;
        var enterprisepayment_response = JSON.parse(Enterprisepaymentpro.metaData);
        var token           = Enterprisepaymentpro.token;
        var payment_code    = Enterprisepaymentpro.paymentCode;
        $timeout(function() {
              $scope.getPaymentConfirm(enterprisepayment_response,token,payment_code);
        }, 500);
    }
    $scope.showLoading = function() {
        $ionicLoading.show({
            template: $translate.instant('Please wait...')
        });
    };
    $scope.hideLoading = function(){
        $ionicLoading.hide();
    };
    //go for payment after confirmation
    $scope.getPaymentConfirm = function(app_data,token,payment_code){

        $scope.showLoading();
        console.log('confirm payment');
        console.log(app_data);
        
        //for single booking       
        if (app_data.booking_type == 1) {
            $scope.is_loading               = true;
            $scope.book_multi_appointment = 0;
            Appointment.bookappointmentwithpayment($stateParams.value_id,app_data.location_id, app_data.category_id, app_data.service_id, app_data.provider_id,
            app_data.date, app_data.time, app_data.time_value, app_data.service_time, app_data.sId, app_data.input, app_data.offset, $scope.book_multi_appointment,token,payment_code,app_data.deposit,app_data.due_later,app_data.deposit_percentage)
            .success(function(data) {
                Appointment.unsetMultiAppointmentData('multi_appointment_data');
                if (data.status == "success") {
                    $scope.hideLoading();
                    $scope.appointment_success = true;
                    $scope.success = $translate.instant("Thank You!");
                   // $scope.success_heading  = $translate.instant("Thanks you for payment!");
                    //$scope.success_msg      = $translate.instant("You`ll receive your bookig details on email soon.");
                    Appointment.getnotificationstatus(app_data.input['customer_id']).success(function(data) {
                            if (data.status) {
                                $scope.notification_time = data.notification_time;
                            } else {
                                $scope.notification_time = 2;
                            }

                        }).finally(function() {
                            $scope.is_loading = false;
                            $scope.thankyoupage = true;
                        });
                        //$scope.thankyoupage = true;
                    $state.go("appointment-payment-success", {
                        value_id: $scope.value_id,//app_data.value_id
                    });
                    Enterprisepaymentpro.payerId = null;
                } else {
                    $scope.appointment_error = true;
                    $scope.error = data.message;
                }

                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: app_data.value_id
                    });
                };

            }).finally(function() {
                $scope.is_loading = false;
            });
        }else{
             $state.go("appointment-payment-success", {
                                        value_id: $scope.value_id,//app_data.value_id
                                    });
        }
    };
}).controller('ClassLocationController', function($controller,$ionicPopup, $ionicScrollDelegate, $ionicTabsDelegate, Authorization,Customer, $ionicModal, AUTH_EVENTS, $rootScope, $scope, $stateParams, $translate, $compile, $state, Appointment, $timeout) { 
    $scope.location_tab = true;
    $scope.category_tab = true;
    $scope.service_tab = true;
    $scope.provider_tab = true;
    $scope.date_tab = true;
    $scope.info_tab = true;
    $scope.confirm_tab = true;
    $scope.is_loading = true;
    $scope.value_id = Appointment.value_id = $stateParams.value_id;
    $scope.is_logged_in = Customer.isLoggedIn();

    $scope.location_title = $translate.instant("Location");
    $scope.category_title = $translate.instant("Category");
    $scope.class_title = $translate.instant("Class");
    $scope.class_details = $translate.instant("Details");
    $scope.date_title = $translate.instant("Date");
    $scope.info_title = $translate.instant("Info");
    $scope.confirm_title = $translate.instant("Confirm");
    var category_for = 2;//for serice appointment
    var service_type = 2;
    $scope.settings = Appointment.settings;
    
    if ( Appointment.bgcolor != null ) {
        $scope.COLOR_BACKGROUND = 'ion-content.appointment { background-color: #' + Appointment.bgcolor + ' !important; }';
    }
    if ( Appointment.hdrcolor != null ) {
        $scope.COLOR_HEADER = 'ion-header-bar.bar-header.bar{ background-color: #' + Appointment.hdrcolor + ' !important; }';
    }
    if ( Appointment.btncolor != null ) {
        $scope.COLOR_BUTTON = 'ion-content.appointment button{ background-color: #' + Appointment.btncolor + ' !important; }';
    }
    if ( Appointment.icncolor != null ) {
        $scope.COLOR_ICON = '.view_appointment .tab-item-active > .icon, .view_appointment .tab-item-active > span.tab-title { color: #'+Appointment.icncolor+' !important; }';
    }
    
    $scope.login = function() {
        Customer.loginModal($scope);
    };

    //Code to show available Locations
    Appointment.getLocations().success(function(data) {
        $scope.location = false;
        $scope.page_title = data.page_title;
        if (data.locations) {
            if (data.total_records == 1) {
                $scope.location_tab = false;
                $scope.gotoloc(data.locations[0].location_id);
            }
            $scope.locations = data.locations;
            $scope.location = true;
            $scope.goBack = function() {
                $state.go("appointment-view", {
                    value_id: $scope.value_id
                });
            }
        }
    }).finally(function() {
        $scope.is_loading = false;
    });

    $scope.showLocations = true;
    $scope.showCategories = false;
    $scope.showServices = false;
    $scope.showProviders = false;
    $scope.showCalendar = false;
    $scope.showTime = false;
    $scope.showInformation = false;
    $scope.showConfirmInformation = false;
    $scope.thankyoupage = false;

    /*function which is use for show location and details*/
    $scope.gotoloc = function(location_id) {
        $ionicTabsDelegate.select(1);
        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.is_loading = true;
        $scope.showLocations = false;
        $scope.showCategories = true;
        $scope.location_id = location_id;

        //Code to show available Categories

        Appointment.getcategories($scope.location_id, category_for)
            .success(function(data) {
                $scope.is_loading = true;
                $scope.category = false;
                $scope.page_title = data.page_title;
                $scope.categories = data.categories;
                $scope.category = true;

                if (data.total_records == 0) {
                    $scope.no_category = true;
                    $scope.category_present = false;
                    $scope.blank_category = "Category Not Present";
                } else {
                    if (data.total_records == 1) {
                        $scope.category_tab = false;
                        $scope.gotoCategory(data.categories[0].category_id);
                    }
                    if(data.total_records > 1){
                        Appointment.setLocalKey('local_key',1);
                        $scope.showServices = true;
                    }else{
                        Appointment.setLocalKey('local_key',0);
                        $scope.category = true;
                    }

                    $scope.no_category = false;
                    $scope.category_present = true;
                    if (data.categories) {
                        $scope.locations = data.locations;
                        $scope.location = true;
                    }
                }

                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: $scope.value_id
                    });
                }

            }).finally(function() {
                $scope.is_loading = false;
            });

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showCategories   = false;
            $scope.showLocations    = true;

            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

    };
    /*end to go to location function*/

    /*go to category view function*/
     $scope.gotoCategory = function(category_id) {
        $ionicTabsDelegate.select(2);
        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.is_loading       = true;
        $scope.showCategories   = false;
        $scope.showServices     = true;
        $scope.category_id      = category_id;

        //Code to show available Services
        Appointment.getservices($scope.location_id, $scope.category_id, service_type)
            .success(function(data) {
                $scope.page_title = data.page_title;
                if (data.total_records == 0) {
                    $scope.no_service = true;
                    $scope.service_present = false;
                    $scope.blank_service = "Service Not Present";
                } else {
                    $scope.no_service = false;
                    $scope.service_present = true;
                    $scope.service = false;
                    $scope.services = data.services;
                    $scope.service = true;
                }
                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: $scope.value_id
                    });
                }
            }).finally(function() {
                $scope.is_loading = false;
            });

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showLocations = true;

            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

        $scope.loadcategory = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations    = false;
            $scope.showCategories   = true;
            $scope.showServices     = false;
        };
    };
    /*end of go to category view function*/
    /*got to service view function*/
    $scope.gotoService = function(service_id, name,price) {
        $ionicTabsDelegate.select(3);
       
        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.is_loading       = true;
        $scope.showServices     = false;
        $scope.showProviders    = true;
        $scope.service_id       = service_id;
        $scope.service_name     = name;
        $scope.price            = price;
        Appointment.getPaymentSettings( $scope.price ).success(function(data){
        $scope.payment_settings = data.payment_settings;

        if ($scope.payment_settings.paid_on_booking == 1){
            $scope.payme_details_show       = true;
            $scope.deposit                  = data.payment_settings.deposit;
            $scope.net_due                  =  data.payment_settings.net_due;
            $scope.deposit_without_currency = data.payment_settings.deposit_without_currency;
        }
       
    })
    /////////////////////
        //Code to show available class details
        //Code to show available Services
        var service_type = 2;
        Appointment.getclassdetails($scope.location_id, $scope.category_id, 2,$scope.service_id).success(function(data) {
                $scope.have_assign_provider = data.have_assign_provider;
                
                //$scope.page_title = data.page_title;
                $scope.location_id          = $scope.location_id;
                $scope.page_title           = data.name;
                $scope.provider_name        = data.provider_name;
                $scope.class_session_name   = data.name;
                $scope.capacity             = data.capacity;
                $scope.class_description    = data.class_description;
                $scope.class_id             = data.service_id;
                $scope.class_provider_id    = data.provider_id;
                $scope.class_category_id    = data.category_id;
                $scope.class_value_id       = data.value_id;
                $scope.provider_name        = data.provider_name;
                $scope.class_details_obj    = data;
                $scope.class_recurrent_in   = data.class_recurrent_in;
                $scope.class_end_date       = data.class_end_date;
                $scope.days_enable  = 0;
                $scope.date_enable  = 0;
                 $scope.time_enable = 0;
                if ( data.booked_seats > 0 ) {
                    $scope.booked_seats = data.booked_seats;
                }else{
                    $scope.booked_seats = 0;
                }
               
                /*check recurent type of class is 1 for days whoch was selected and 2 for date specific*/
                
                //for date
                if(data.class_date){
                   
                    // recurent in date
                    $scope.date_enable = 1;
                    $scope.recurrent_date_details = data.class_date;
                    
                }
                //for time
                if(data.class_time){
                   
                    // recurent in date
                    $scope.time_enable = 1;
                    $scope.recurrent_time_details = data.class_time;
                    
                }
                //for days
                if(data.class_days_detail){
                    
                    $scope.days_enable = 1;
                    $scope.recurrent_days_details = data.class_days_detail;
                }

                


                if (data.total_records == 0) {
                    $scope.no_service = true;
                    $scope.service_present = false;
                    $scope.blank_service = "Details Not Present";
                } else {
                    $scope.no_service = false;
                    $scope.service_present = true;
                    $scope.service = false;
                    $scope.services = data.services;

                    $scope.service = true;
                }
                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: $scope.value_id
                    });
                }
            }).finally(function() {
                $scope.is_loading = false;
            });

        

        $scope.custom = true;
        $scope.prv = 0;
        $scope.show_pro_info = function(provider_id) {
            $scope.prv = ($scope.prv == provider_id) ? 0 : provider_id;
        };

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showProviders = false;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showLocations = true;

            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

        $scope.loadcategory = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showProviders = false;
            $scope.showLocations = false;
            $scope.showCategories = true;
            $scope.showServices = false;
        };

        $scope.loadservice = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showProviders    = false;
            $scope.showLocations    = false;
            $scope.showCategories   = false;
            $scope.showServices     = true;
        };
    };
    /*end of go to service view function*/
    /*go to provider section*/
    $scope.gotoClassDetails = function(provider_id, name) {
        $ionicTabsDelegate.select(4);

        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.page_title       = $translate.instant("Appointments");
        $scope.showProviders    = false;
        $scope.showCalendar     = true;
        $scope.provider_id      = provider_id;
        $scope.provider_name    = name;

        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = true;
            $scope.showCategories = false;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = false;

            Appointment.getLocations()
                .success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
        };

        $scope.loadcategory = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = true;
            $scope.showServices = false;
            $scope.showProviders = false;
            $scope.showCalendar = false;
        };

        $scope.loadservice = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations = false;
            $scope.showCategories = false;
            $scope.showServices = true;
            $scope.showProviders = false;
            $scope.showCalendar = false;
            $scope.showTime = false;
        };

        $scope.loadprovider = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations    = false;
            $scope.showCategories   = false;
            $scope.showServices     = false;
            $scope.showProviders    = true;
            $scope.showCalendar     = false;
            $scope.showTime         = false;

        };
    };
    /*ends of got to provider function*/
    var d = new Date();
    var present_month   = d.getMonth();
    var present_date    = d.getDate();

    
    $scope.date = '';
   
    $scope.showAlert = function(date){
        $ionicPopup.alert({template:$translate.instant("All seats already booked."),buttons: [{ text: $translate.instant("OK") }]});
        $scope.viewDate(date);
        return;
    };

    // call this function after click book on class details page
    $scope.gotoClassDateTime = function(class_id, class_value_id, class_provider_id, capacity, booked_seats) {
        
        if(capacity == booked_seats && capacity != undefined && booked_seats !=undefined){
            $ionicPopup.alert({template:$translate.instant("All seats already booked."),buttons: [{ text: $translate.instant("OK") }]});
            return;
        }else{
            if (!$scope.is_logged_in) {
                $scope.$on(AUTH_EVENTS.loginSuccess, function() {
                    $scope.is_logged_in = true;
                    $scope.gotoClassDateTime();
                    // $scope.gotoService();
                });
                $scope.login();
                return;
            }
            $scope.input = Authorization;
            console.log('from class session');
            console.log($scope.input);
            Customer.find().success(function(data) {
                $scope.customer_input       = data;
                $scope.input.customer_id    = data.id;
                $scope.input.Name           = data.firstname + " " + data.lastname;
                $scope.input.Email          = data.email;
            });
            $ionicTabsDelegate.select(4);
            $scope.showProviders    = false;
            $scope.showCalendar     = false;
            $scope.showInformation  = true;
            $scope.loadlocation     = function(index) {
                $ionicTabsDelegate.select(index);
                $scope.showLocations    = true;
                $scope.showCategories   = false;
                $scope.showServices     = false;
                $scope.showProviders    = false;
                $scope.showCalendar     = false;
                $scope.showTime         = false;
                $scope.showInformation  = false;
                $scope.thankyoupage     = false;
                Appointment.getLocations().success(function(data) {
                    $scope.locations = data.locations;
                }).finally(function() {
                    $scope.is_loading = false;
                });
            };

            $scope.loadcategory = function(index) {
                $scope.thankyoupage     = false;
                $ionicTabsDelegate.select(index);
                $scope.showLocations    = false;
                $scope.showCategories   = true;
                $scope.showServices     = false;
                $scope.showProviders    = false;
                $scope.showCalendar     = false;
                $scope.showTime         = false;
                $scope.showInformation  = false;
            };

            $scope.loadservice = function(index) {
                $scope.thankyoupage = false;
                $ionicTabsDelegate.select(index);
                $scope.showLocations    = false;
                $scope.showCategories   = false;
                $scope.showServices     = true;
                $scope.showProviders    = false;
                $scope.showCalendar     = false;
                $scope.showTime         = false;
                $scope.showInformation  = false;
            };
            $scope.loadprovider = function(index) {
                $ionicTabsDelegate.select(index);
                $scope.showLocations        = false;
                $scope.showCategories       = false;
                $scope.showServices         = false;
                $scope.showProviders        = true;
                $scope.showCalendar         = false;
                $scope.showTime             = false;
                $scope.showInformation      = false;
                $scope.thankyoupage         = false;
            };
            $scope.loaddate = function(index) {
                
                $ionicTabsDelegate.select(index);
                $scope.showLocations    = false;
                $scope.showCategories   = false;
                $scope.showServices     = false;
                $scope.showProviders    = false;
                $scope.showCalendar     = false;
                $scope.showTime         = false;
                $scope.showInformation  = true;
                $scope.thankyoupage     = false;
            }
        }//else
        
    };//gotoclassdatetime function

    $scope.gotoInformation = function() {
        $ionicTabsDelegate.select(5);
        $timeout(function() {
            $ionicScrollDelegate.scrollTop();
        }, 100);

        $scope.showInformation = false;
        $scope.showConfirmInformation = true;
        $scope.thankyoupage = false;
        $scope.loadlocation = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations            = true;
            $scope.showCategories           = false;
            $scope.showServices             = false;
            $scope.showProviders            = false;
            $scope.showCalendar             = false;
            $scope.showTime                 = false;
            $scope.showInformation          = false;
            $scope.showConfirmInformation   = false;
            $scope.thankyoupage             = false;
            Appointment.getLocations().success(function(data) {
                $scope.locations = data.locations;
            }).finally(function() {
                $scope.is_loading = false;
            });
        };

        $scope.loadservice = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations            = false;
            $scope.showCategories           = false;
            $scope.showServices             = true;
            $scope.showProviders            = false;
            $scope.showCalendar             = false;
            $scope.showTime                 = false;
            $scope.showInformation          = false;
            $scope.showConfirmInformation   = false;
            $scope.thankyoupage             = false;
        };
        $scope.loadprovider = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations            = false;
            $scope.showCategories           = false;
            $scope.showServices             = false;
            $scope.showProviders            = true;
            $scope.showCalendar             = false;
            $scope.showTime                 = false;
            $scope.showInformation          = false;
            $scope.showConfirmInformation   = false;
            $scope.thankyoupage             = false;
        };
        $scope.loaddate = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations            = false;
            $scope.showCategories           = false;
            $scope.showServices             = false;
            $scope.showProviders            = false;
            $scope.showCalendar             = true;
            $scope.showTime                 = false;
            $scope.showInformation          = false;
            $scope.showConfirmInformation   = false;
            $scope.thankyoupage             = false;
        };
        $scope.loadinfo = function(index) {
            $ionicTabsDelegate.select(index);
            $scope.showLocations            = false;
            $scope.showCategories           = false;
            $scope.showServices             = false;
            $scope.showProviders            = false;
            $scope.showCalendar             = false;
            $scope.showTime                 = false;
            $scope.showInformation          = true;
            $scope.showConfirmInformation   = false;
            $scope.thankyoupage             = false;
        }
    };

    $scope.gotoBookClass = function(class_details_obj,location_id, customer_input) {
        $scope.is_loading               = true;
        $scope.showLocations            = false;
        $scope.showServices             = false;
        $scope.showCategories           = false;
        $scope.showProviders            = false;
        $scope.showTime                 = false;
        $scope.showCalendar             = false;
        $scope.showInformation          = false;
        $scope.showConfirmInformation   = false;
        $scope.thankyoupage             = false;
        console.log(customer_input);
        var offset      = new Date().getTimezoneOffset();
        $scope.input    = customer_input
        Appointment.checkclassbooking(class_details_obj,  offset, location_id, customer_input).success(function(data) {
            if (data.check == 1) {
                $ionicPopup.alert({template:$translate.instant("You have already booked this class."),buttons: [{ text: $translate.instant("OK") }]});
                $state.go("appointment-view", {
                    value_id: $scope.value_id
                });
               
            } else {
                Appointment.bookclass(class_details_obj,  offset, location_id, customer_input).success(function(data) {
                if (data.success == true) {
                    $scope.appointment_success = true;
                    $scope.success = $translate.instant("Thank You!");

                    Appointment.getnotificationstatus(customer_input.id).success(function(data) {
                        if (data.status) {
                            $scope.notification_time = data.notification_time;
                        } else {
                            $scope.notification_time = 2;
                        }

                    }).finally(function() {
                        $scope.is_loading = false;
                    });
                    $scope.thankyoupage = true;
                } else {
                    $scope.appointment_error = true;
                    $scope.error = data.message;

                }
                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: $scope.value_id
                    });
                };

            }).finally(function() {
                $scope.is_loading = false;
            });
        }
           

        });
        $scope.goBack = function() {
            $state.go("appointment-view", {
                value_id: $scope.value_id
            });
        }
    }

}).controller('AppointmentCheckoutController', function($controller,$timeout,$ionicPopup, $ionicScrollDelegate, $ionicTabsDelegate, Authorization,Customer, $ionicModal, AUTH_EVENTS, $rootScope, $scope, $stateParams,$translate, $compile, $state, Appointment, $timeout,Enterprisepaymentpro,$ionicLoading) { 
    Enterprisepaymentpro.getPaymentValueId();
    $scope.page_title           = $translate.instant('Checkout');
    var appointment_data        = JSON.parse($stateParams.meta_data);
    $scope.booking_checkout     = appointment_data;
    $scope.deposit_percentage   = $stateParams.deposit_percentage;
    console.log($stateParams.booking_checkout);
    console.log('data in AppointmentCheckoutController ----Multi----->');
    console.log($scope.booking_checkout);
    $scope.is_loading               = true;
    $scope.value_id                 = Appointment.value_id = $stateParams.value_id;
    Appointment.getcheckoutdetails(appointment_data,$scope.deposit_percentage).success(function(data){
        $scope.is_loading           = false;
        console.log(data);
        $scope.selected_services    = data.services;
        $scope.deposit              = parseFloat(Math.round(data.deposit * 100) / 100).toFixed(2);//Math.round(paid_amount * 100) / 100;
        $scope.net_due              = parseFloat(Math.round(data.due_later * 100) / 100).toFixed(2) ;
        $scope.total                = parseFloat(Math.round(data.total * 100) / 100).toFixed(2);
        $scope.currency             = data.currency;
        $scope.percentage           = data.percentage;
    }).finally(function() {
        $scope.is_loading = false;
    });
    $scope.getPayment = function()  {
       //check payment module install by user or not from editr section
        if (Enterprisepaymentpro.enterprisepaymentValueId) {
            console.log('before go---');
            console.log(appointment_data);
            //temp comment for payment disable
           $state.go('enterprisepayment_process',{value_id: Enterprisepaymentpro.enterprisepaymentValueId, amount:$scope.deposit,return_value_id: $stateParams.value_id,order_id:1,meta_data:JSON.stringify(appointment_data)}, {reload: true});
        } else {
            var alertPopup = $ionicPopup.alert({
              template: $translate.instant("Please add Enterprisepayment Module in the App")
            });
        }
        
    }
    $scope.removefromcart = function(sreail_number, rm_service_id) {
        $scope.sreail_number = sreail_number;
        $scope.rm_service_id = rm_service_id;
         
        Appointment.getPaymentSettings().success(function(data){
            $scope.payment_settings = data.payment_settings;
        }).finally(function() {
            $state.go("appointment-checkout-operation", {
                value_id            :  $scope.value_id,
                deposit_percentage  :  $scope.payment_settings.require_payment_for_booking,
                meta_data:JSON.stringify($scope.booking_checkout),
                remove_id:$scope.sreail_number,
                rm_service_id:$scope.rm_service_id,
            });
        });
    };
}).controller('OperationCheckoutController', function($controller,$timeout,$ionicPopup, $ionicScrollDelegate, $ionicTabsDelegate, Authorization,Customer, $ionicModal, AUTH_EVENTS, $rootScope, $scope, $stateParams,$translate, $compile, $state, Appointment, $timeout,Enterprisepaymentpro,$ionicLoading) { 
    Enterprisepaymentpro.getPaymentValueId();
    $scope.page_title           = $translate.instant('Checkout');
    var appointment_data        = JSON.parse($stateParams.meta_data);
    $scope.booking_checkout     = appointment_data;
    $scope.deposit_percentage   = $stateParams.deposit_percentage;
    $scope.remove_serial_no     = $stateParams.remove_id;
    $scope.rm_service_id        = $stateParams.rm_service_id;
    $scope.is_loading               = true;
    $scope.value_id                 = Appointment.value_id = $stateParams.value_id;
    Appointment.getcheckoutdetailsoperations(appointment_data,$scope.deposit_percentage,$scope.remove_serial_no, $scope.rm_service_id).success(function(data){
        $scope.is_loading           = false;
        if (data.response == 1) {
            $scope.selected_services    = data.services;
            $scope.deposit              = parseFloat(Math.round(data.deposit * 100) / 100).toFixed(2);//Math.round(paid_amount * 100) / 100;
            $scope.net_due              = parseFloat(Math.round(data.due_later * 100) / 100).toFixed(2) ;
            $scope.total                = parseFloat(Math.round(data.total * 100) / 100).toFixed(2);
            $scope.currency             = data.currency;
            $scope.percentage           = data.percentage;
            Appointment.unsetMultiAppointmentData('multi_appointment_data');
            Appointment.setMultiAppointmentData( data.cart_data);
        }else{
            Appointment.unsetMultiAppointmentData('multi_appointment_data');
            $state.go("appointment-view", {
                value_id: $stateParams.value_id
            });
        }
    }).finally(function() {
        $scope.is_loading = false;
    });
    $scope.getPayment = function()  {
        //check payment module install by user or not from editr section
        if (Enterprisepaymentpro.enterprisepaymentValueId) {
            console.log('before go---');
             var appointment_data =  Appointment.getMultiAppointmentData('multi_appointment_data');
            console.log(appointment_data);
            //temp comment for payment disable
           $state.go('enterprisepayment_process',{value_id: Enterprisepaymentpro.enterprisepaymentValueId, amount:$scope.deposit,return_value_id: $stateParams.value_id,order_id:1,meta_data:JSON.stringify(appointment_data)}, {reload: true});
        } else {
            var alertPopup = $ionicPopup.alert({
              template: $translate.instant("Please add Enterprisepayment Module in the App")
            });
        }
        
    }
   
    $scope.removefromcart = function(sreail_number,rm_service_id) {
        $scope.sreail_number = sreail_number;
        $scope.rm_service_id = rm_service_id;
        Appointment.getPaymentSettings().success(function(data){
            $scope.payment_settings = data.payment_settings;
        }).finally(function() {
            var current_customer_appointments_check =  Appointment.getMultiAppointmentData('multi_appointment_data');
            $state.go("appointment-checkout-operation", {
                value_id            :  $scope.value_id,
                deposit_percentage  :  $scope.payment_settings.require_payment_for_booking,
                meta_data:JSON.stringify(current_customer_appointments_check),
                remove_id:$scope.sreail_number,
                rm_service_id:$scope.rm_service_id,
            });
        });
    };

}).controller('PaymentSuccessController', function($controller,$ionicPopup, $ionicScrollDelegate, $ionicTabsDelegate, Authorization,Customer, $ionicModal, AUTH_EVENTS, $rootScope, $scope, $stateParams,$translate, $compile, $state, Appointment, $timeout,Enterprisepaymentpro,$ionicLoading){
    $scope.page_title       = $translate.instant('Success');
    //check both token and payemer ids from all payment then go for booking appoitment
    $scope.showSuccessMsg   = false;
    $scope.success_heading  = $translate.instant("Thank you for your booking!");
    $scope.success_msg      = $translate.instant("You`ll receive your booking details on email soon.");
    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
        viewData.enableBack = false;
    });
    $scope.value_id = Appointment.value_id = $stateParams.value_id;
    if (Enterprisepaymentpro.payerId !=null) {
        var enterprisepayment_response  = JSON.parse(Enterprisepaymentpro.metaData);
        console.log(enterprisepayment_response);
        var token                       = Enterprisepaymentpro.token;
        var payment_code                = Enterprisepaymentpro.paymentCode;
        $timeout(function() {
            $scope.getPaymentConfirm(enterprisepayment_response,token,payment_code);
        }, 500);
    }
    $scope.showLoading = function() {
        $ionicLoading.show({
            template: $translate.instant('Please wait...')
        });
    };
    $scope.hideLoading = function(){
        $ionicLoading.hide();
    };
    
    //go for payment after confirmation
    $scope.getPaymentConfirm = function(app_data,token,payment_code){
        $scope.showLoading();
        Appointment.getPaymentSettings(app_data.service_amount).success(function(data){
            $scope.payment_settings = data.payment_settings;
            $scope.require_payment_for_booking = data.payment_settings.require_payment_for_booking;
        }).finally(function() {
            $scope.book_multi_appointment = 1;
            //for single booking
            if (app_data.booking_type == 1) {
                 //go for payment after confirmation
   

        $scope.showLoading();
        console.log('confirm payment');
        console.log(app_data);
        
        
            $scope.is_loading               = true;
            $scope.book_multi_appointment = 0;
            Appointment.bookappointmentwithpayment($stateParams.value_id,app_data.location_id, app_data.category_id, app_data.service_id, app_data.provider_id,
            app_data.date, app_data.time, app_data.time_value, app_data.service_time, app_data.sId, app_data.input, app_data.offset, $scope.book_multi_appointment,token,payment_code,app_data.deposit,app_data.due_later,app_data.deposit_percentage)
            .success(function(data) {
                Appointment.unsetMultiAppointmentData('multi_appointment_data');
                if (data.status == "success") {
                    $scope.hideLoading();
                    $scope.appointment_success = true;
                    $scope.success = $translate.instant("Thank You!");
                   // $scope.success_heading  = $translate.instant("Thanks you for payment!");
                    //$scope.success_msg      = $translate.instant("You`ll receive your bookig details on email soon.");
                    Appointment.getnotificationstatus(app_data.input['customer_id']).success(function(data) {
                        
                            if (data.status) {
                                $scope.notification_time = data.notification_time;
                            } else {
                                $scope.notification_time = 2;
                            }

                        }).finally(function() {
                            $scope.is_loading = false;
                            $scope.thankyoupage = true;
                        });
                        //$scope.thankyoupage = true;
                    $state.go("appointment-payment-success", {
                        value_id: $scope.value_id,//app_data.value_id
                    });
                    Enterprisepaymentpro.payerId = null;
                } else {
                    $scope.appointment_error = true;
                    $scope.error = data.message;
                }

                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: app_data.value_id
                    });
                };

            }).finally(function() {
                $scope.is_loading = false;
            });
       
    
            }else{
                //booking type multi
                Appointment.bookmultiappointmentwithpayment( app_data, token,payment_code, $scope.require_payment_for_booking).success(function(data) {
               
                Appointment.unsetMultiAppointmentData('multi_appointment_data');
                if (data.status == "success") {
                    $scope.hideLoading();
                    $scope.showSuccessMsg = true;
                    $scope.appointment_success = true;
                    $scope.success_heading  = $translate.instant("Thank you for your booking!");
                    $scope.success_msg      = $translate.instant("You`ll receive your booking details on email soon.");
                    Appointment.getnotificationstatus(app_data.customer_id).success(function(data) {
                       
                        if (data.status) {
                            $scope.notification_time = data.notification_time;
                        } else {
                            $scope.notification_time = 2;
                        }

                    }).finally(function() {
                        $scope.is_loading = false;
                    });
                    $state.go("appointment-payment-success", {
                        value_id: $scope.value_id,//app_data.value_id
                    });
                    Enterprisepaymentpro.payerId = null;
                } else {
                    $scope.appointment_error = true;
                    $scope.error = data.message;
                }

                $scope.goBack = function() {
                    $state.go("appointment-view", {
                        value_id: $stateParams.value_id
                    });
                };

            }).finally(function() {
                $scope.is_loading = false;
            });
            }
            
        });
    };

    $scope.goBack = function() {
        $state.go("appointment-view", {
            value_id: $stateParams.value_id
        });
    };
}).controller('TransactionController', function($controller,$ionicPopup, $ionicScrollDelegate, $ionicTabsDelegate, Authorization,Customer, $ionicModal, AUTH_EVENTS, $rootScope, $scope, $stateParams,$translate, $compile, $state, Appointment, $timeout,Enterprisepaymentpro,$ionicLoading){
    $scope.page_title   = $translate.instant('Transaction Details');
    $scope.is_loading   = true;
    var booking_id      = $stateParams.booking_id;
    Appointment.gettransationsdetails(booking_id).success(function(t_data) {
        console.log(t_data);
        $scope.transaction = t_data;
    }).finally(function() {
        $scope.is_loading = false;
    });

    $scope.goBack = function() {
        $state.go("appointment-view", {
            value_id: $stateParams.value_id
        });
    };
});