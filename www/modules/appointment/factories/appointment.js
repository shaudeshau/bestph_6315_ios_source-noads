App.factory('Appointment', function($rootScope, $http, Url,$window) {

    var factory = {};
    factory.value_id = null;
    factory.settings = {};
    factory.widget = false;
    factory.bgcolor = factory.hdrcolor = factory.btncolor = factory.icncolor = null;
    
    /***************Function which is use for storing multi appointment data **********
    ****************locally untill confiramtion for booking****************************
    ***********************************************************************************/
    factory.setMultiAppointmentData = function (cart_data) {
        $window.localStorage.setItem("multi_appointment_data", JSON.stringify(cart_data));
    };

    factory.getMultiAppointmentData = function () {
       return $window.localStorage.getItem('multi_appointment_data');
    };
     factory.unsetMultiAppointmentData = function(key) {
        $window.localStorage.removeItem(key);
    };

     factory.setLocalKey = function (local_key) {
        $window.localStorage.setItem("local_key", local_key);
    };

    factory.getLocalKey = function () {
       return $window.localStorage.getItem('local_key');
    };
     factory.unSetLocalKey = function(key) {
        $window.localStorage.removeItem(key);
    };
///////////////
     factory.setLocalRunKey = function (run_local_key) {
        localStorage.setItem("run_local_key", run_local_key);
    };

    factory.getLocalRunKey = function () {
       return localStorage.getItem('run_local_key');
    };
     factory.unSetLocalRunKey = function(run_local_key) {
        localStorage.removeItem(run_local_key);
    };
    /************ END OF MULTI LOCAL STORAGE FUNCTIONS***************/
    factory.getSettings = function() {
        if (!this.value_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/settings", {
                value_id: this.value_id
            }),
            cache: false,
            responseType: 'json'
        });
    };
    
    factory.getPaymentSettings = function(s_price) {
        if (!this.value_id && s_price) return;
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/paymentstings"),
            data: {
                value_id: this.value_id,
               
                s_price: s_price
            },
            cache: false,
            responseType: 'json'
        });
    };
    factory.getLocations = function() {

        if (!this.value_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/index", {
                value_id: this.value_id
            }),
            cache: false,
            responseType: 'json'
        });
    };

    factory.getcategories = function(location_id,category_for) {

        if (!this.value_id && location_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/getcategories", {
                value_id: this.value_id,
                location_id: location_id,
                category_for : category_for
            }),
            cache: false,
            responseType: 'json'
        });
    };

    factory.getservices = function(location_id, category_id, service_type) {

        if (!this.value_id && location_id && category_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/getservices", {
                value_id: this.value_id,
                location_id: location_id,
                category_id: category_id,
                service_type: service_type,
            }),
            cache: false,
            responseType: 'json'
        });
    };
    factory.getclassdetails = function(location_id, category_id, service_type, service_id) {

        if (!this.value_id && location_id && category_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/getclassdetails", {
                value_id: this.value_id,
                location_id: location_id,
                category_id: category_id,
                service_type: service_type,
                service_id: service_id
            }),
            cache: false,
            responseType: 'json'
        });
    };


    factory.getproviders = function(location_id, category_id, service_id) {

        if (!this.value_id && location_id && category_id && service_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/getproviders", {
                value_id: this.value_id,
                location_id: location_id,
                category_id: category_id,
                service_id: service_id
            }),
            cache: false,
            responseType: 'json'
        });
    };
    
    factory.availabletimelist = function(location_id, category_id, service_id, provider_id, date) {
        if (!location_id && category_id && service_id && provider_id && date) return;


        var url = Url.get("appointment/mobile_view/availabletimelist");
        var data = {
            location_id:location_id,
            service_id: service_id,
            provider_id: provider_id,
            date: date,
            value_id: this.value_id
        };
        return $http.post(url, data);
    };

    factory.bookappointment = function(location_id, category_id, service_id, provider_id, date, time, time_value, service_time,sId, input, offset, book_multi_appointment) {
        if (!this.value_id && location_id && category_id && service_id && provider_id && input) return;
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/bookappointment"),
            data: {
                value_id: this.value_id,
                location_id: location_id,
                category_id: category_id,
                service_id: service_id,
                provider_id: provider_id,
                date: date,
                time: time,
                time_value: time_value,
                service_time: service_time,
                sId:sId,
                input: input,
                offset: offset,
                book_multi_appointment: book_multi_appointment
            },
            cache: false,
            responseType: 'json'
        });
    };
       
    factory.bookclass = function(class_booking_details,offset,location_id, customer) {
        
        if (!this.value_id) return;
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/bookclasssession"),
            data: {
                value_id: class_booking_details.value_id,
                location_id: location_id,
                category_id: class_booking_details.category_id,
                service_id: class_booking_details.service_id,
                provider_id: class_booking_details.provider_id,
                offset: offset,
                page_title: class_booking_details.page_title,
                name:class_booking_details.name,
                provider_name:class_booking_details.provider_name,
                app_id: class_booking_details.app_id,
                capacity: class_booking_details.capacity,
                class_description: class_booking_details.class_description,
                class_date: class_booking_details.class_date,
                class_time: class_booking_details.class_time,
                service_type:class_booking_details.service_type,
                class_days_detail: class_booking_details.class_days_detail,
                is_checked_recurrent:class_booking_details.is_checked_recurrent,
                class_recurrent_in:class_booking_details.class_recurrent_in,
                customer_id : customer.id,
                Name : customer.firstname + " " + customer.lastname,
                Email : customer.email,
                
            },
            cache: false,
            responseType: 'json'
        });
    };
    factory.checkclassbooking = function(class_booking_details,offset,location_id, customer) {
        
        if (!this.value_id) return;
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/checkclassbooking"),
            data: {
                value_id: class_booking_details.value_id,
                location_id: location_id,
                category_id: class_booking_details.category_id,
                service_id: class_booking_details.service_id,
                provider_id: class_booking_details.provider_id,
                offset: offset,
                page_title: class_booking_details.page_title,
                name:class_booking_details.name,
                provider_name:class_booking_details.provider_name,
                app_id: class_booking_details.app_id,
                capacity: class_booking_details.capacity,
                class_description: class_booking_details.class_description,
                class_date: class_booking_details.class_date,
                class_time: class_booking_details.class_time,
                service_type:class_booking_details.service_type,
                class_days_detail: class_booking_details.class_days_detail,
                is_checked_recurrent:class_booking_details.is_checked_recurrent,
                class_recurrent_in:class_booking_details.class_recurrent_in,
                customer_id : customer.id,
                Name : customer.firstname + " " + customer.lastname,
                Email : customer.email,
                
            },
            cache: false,
            responseType: 'json'
        });
    };
     /*book multi appintment*/
    factory.multiappointmentsession = function(book_multi_appointment) {
        if (!this.value_id && book_multi_appointment) return;
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/bookmultiappointment"),
            data: {
                value_id: this.value_id,
                book_multi_appointment: book_multi_appointment,
            },
            cache: false,
            responseType: 'json'
        });
    };
    factory.displayappointmentlist = function(customer_id) {
        if (!this.value_id && customer_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/displayappointmentlist", {
                value_id: this.value_id,
                customer_id: customer_id
            }),
            cache: false,
            responseType: 'json'
        });
    };

    
    factory.displayclasseslist = function(customer_id) {
        if (!this.value_id && customer_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/displayclasseslist", {
                value_id: this.value_id,
                customer_id: customer_id
            }),
            cache: false,
            responseType: 'json'
        });
    };
    factory.cancelappointment = function(status, appointment_id,cancel_event_by_provider) {
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/cancelappointment"),
            data: {
                value_id: this.value_id,
                status: 3,
                appointment_id: appointment_id,
                cancel_event_by_provider: 1
            },
            cache: false,
            responseType: 'json'
        });
    };

    factory.appointmentnotify = function(customer_id,index) {
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/appointmentnotify"),
            data: {
                value_id: this.value_id,
                customer_id: customer_id,
                index: index
            },
            cache: false,
            responseType: 'json'
        });
    };

    factory.displayappointmentlist = function(customer_id) {
        if (!this.value_id && customer_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/displayappointmentlist", {
                value_id: this.value_id,
                customer_id: customer_id
            }),
            cache: false,
            responseType: 'json'
        });
    };

    factory.getnotificationstatus = function(customer_id) {
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/getnotificationstatus"),
            data: { value_id: this.value_id, customer_id: customer_id},
            cache: false,
            responseType: 'json'
        });
    };
    

     factory.find = function(cust_id) {
       
        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/find"),
            cache: false,
            responseType:'json'
        });
    };
    factory.gettransationsdetails = function(booking_id) {
        if (!this.value_id && booking_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/gettransationsdetails", {
                value_id: this.value_id,
                booking_id: booking_id
            }),
            cache: false,
            responseType: 'json'
        });
    };
    factory.getcheckoutdetails = function(multi_checkoutdetails, multi_percentage) {
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/getcheckoutdetails"),
            data: { value_id: this.value_id, multi_checkoutdetails: multi_checkoutdetails,multi_percentage:multi_percentage},
            cache: false,
            responseType: 'json'
        });
    };
     factory.getcheckoutdetailsoperations = function(multi_checkoutdetails, multi_percentage,serial_id,rm_service_id) {
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/getcheckoutdetailsoperations"),
            data: { value_id: this.value_id, multi_checkoutdetails: multi_checkoutdetails,multi_percentage:multi_percentage,serial_id:serial_id,rm_service_id:rm_service_id},
            cache: false,
            responseType: 'json'
        });
    };
    factory.bookappointmentwithpayment = function(value_id,location_id, category_id, service_id, provider_id, date, time, time_value, service_time,sId, input, offset, book_multi_appointment,token,payment_code,deposit,due_later,deposit_percentage) {
        if (!value_id && location_id && category_id && service_id && provider_id && input) return;
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/bookappointment"),
            data: {
                value_id: value_id,
                location_id: location_id,
                category_id: category_id,
                service_id: service_id,
                provider_id: provider_id,
                date: date,
                time: time,
                time_value: time_value,
                service_time: service_time,
                sId:sId,
                input: input,
                offset: offset,
                book_multi_appointment: book_multi_appointment,
                transaction_id:token,
                payment_code:payment_code,
                //amount:service_amount,
                deposit:deposit,
                due_later:due_later,
                deposit_percentage:deposit_percentage,
            },
            cache: false,
            responseType: 'json'
        });
    };
     factory.bookmultiappointmentwithpayment = function(multi_app_data, token,payment_code,deposit_percentage) {
        return $http({
            method: 'POST',
            url: Url.get("appointment/mobile_view/bookmultiappointmentwithpayment"),
            data: { 
                value_id: this.value_id,
                multi_app_data: multi_app_data,
                transaction_id:token,
                payment_code:payment_code,
                deposit_percentage:deposit_percentage,
            },
            cache: false,
            responseType: 'json'
        });
    };
      factory.chekenterprisepayment = function() {
        if (!this.value_id) return;

        return $http({
            method: 'GET',
            url: Url.get("appointment/mobile_view/chekenterprisepayment", {
                value_id: this.value_id,
               
            }),
            cache: false,
            responseType: 'json'
        });
    };

    return factory;
}).run(function(_, Appointment, AUTH_EVENTS, $rootScope, Customer, $timeout, $state) {

    /* ------------------ Login the customers ----------*/
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
        $timeout(function(){
            if(Appointment.widget){
                $state.go("appointment-view", {
                    value_id: Appointment.value_id,
                    widget: Appointment.widget,
                    bgcolor: Appointment.bgcolor,
                    hdrcolor: Appointment.hdrcolor,
                    btncolor: Appointment.btncolor,
                    icncolor: Appointment.icncolor
                }, {
                    reload: true
                });
            }
        },400);
    });
    /*------------------login end------------------------------*/

});

App.factory('Authorization', function() {

    authorization = {};
    authorization.Name = "";
    authorization.Email = "";
    authorization.PhoneNo = "";
    authorization.customer_id = "";
    return authorization;
});
