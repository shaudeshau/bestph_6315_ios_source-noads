App.factory('ProgressiveLoyalty', function($rootScope, $sbhttp, Url, $http) {

    var factory = {};

    factory.value_id = null;

    factory.findAll = function() {

        if(!this.value_id) return;

        return $sbhttp({
            method: 'GET',
            url: Url.get("progressiveloyaltycards/mobile_view/findall", {value_id: this.value_id}),
            cache: false,
            responseType:'json'
        });
    };

    factory.validate = function(pad) {

        if(!this.value_id) return;

        var url = Url.get("progressiveloyaltycards/mobile_view/validate", {value_id: this.value_id});

        var data = {
            customer_card_id: pad.card.id,
            number_of_points: pad.number_of_points,
            password: pad.password,
            mode_qrcode: pad.mode_qrcode
        };

        return $sbhttp.post(url, data);
    };

    factory.validate_redeem = function(pad) {

        if(!this.value_id) return;

        var url = Url.get("progressiveloyaltycards/mobile_view/reedemreward", {value_id: this.value_id});

        var data = {
            customer_card_id: pad.customer_card_id,
            redeem_id: pad.redeem_id,
            reward_id: pad.reward_id,
            password: pad.password,
            mode_qrcode: pad.mode_qrcode
        };

        return $sbhttp.post(url, data);
    };

    factory.redeemreward = function(rewards) {

        if(!this.value_id) return;

        var url = Url.get("progressiveloyaltycards/mobile_view/reedem", {value_id: this.value_id});

        var data = {
            customer_card_id: rewards.customer_card_id,
            redeem_id: rewards.redeem_id,
            reward_id: rewards.reward_id,
            password: rewards.password,
            mode_qrcode: rewards.mode_qrcode
        };

        return $sbhttp.post(url, data);
    };

    factory.enter = function(customer_id) {

        if (!this.value_id && customer_id) return;

        return $http({
            method: 'GET',
            url: Url.get("progressiveloyaltycards/mobile_view/logvisit", { value_id: this.value_id, customer_id: customer_id }),
            cache: false,
            responseType: 'json'
        });
    };

    return factory;
});
