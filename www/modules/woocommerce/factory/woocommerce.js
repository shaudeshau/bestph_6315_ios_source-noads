App.factory('Woocommerce', function($pwaRequest) {

    var factory = {};

    factory.value_id = null;

    factory.loadContent = function() {
        return $pwaRequest.get("woocommerce/mobile_view/load", {
            urlParams: {
                value_id: this.value_id
            }
        });
    };

    factory.execWooQuery = function(action_call) {
        return $pwaRequest.post("woocommerce/mobile_view/execwoocommerce", {
            data: {
                value_id: this.value_id,
                action_call: action_call
            },
            urlParams: {
                value_id: this.value_id
            }
        });
    };

    factory.getCategoriesHierarchical = function() {
        return $pwaRequest.get("woocommerce/mobile_view/gethierarchicalcategories", {
            urlParams: {
                value_id: this.value_id
            }
        });
    };

    factory.getAllProducts = function(offset, category, product_id) {
        return $pwaRequest.get("woocommerce/mobile_view/getallproducts", {
            urlParams: {
                value_id: this.value_id,
                offset: offset,
                category: category,
                product_id: product_id
            }
        });
    };

    factory.getProduct = function(product_id) {
        return $pwaRequest.get("woocommerce/mobile_view/getproduct", {
            urlParams: {
                value_id: this.value_id,
                id: product_id
            }
        });
    };

    factory.getCategoryDetails = function(category_id, page) {
        return $pwaRequest.get("woocommerce/mobile_view/getcategorydetails", {
            urlParams: {
                value_id: this.value_id,
                id: category_id,
                page:page
            }
        });
    };

    factory.createCustomer = function(customer) {
        return $pwaRequest.post("woocommerce/mobile_view/createcustomer", {
            data: {
                value_id: this.value_id,
                customer: JSON.stringify(customer)
            },
            urlParams: {
                value_id: this.value_id
            }
        });
    };

    factory.checkCustomer = function(mail) {
        return $pwaRequest.get("woocommerce/mobile_view/checkcustomer", {
            urlParams: {
                value_id: this.value_id,
                mail: mail
            },
            cache: false
        });
    };

    factory.createOrder = function(order) {
        return $pwaRequest.get("woocommerce/mobile_view/createorder", {
            urlParams: {
                value_id: this.value_id,
                order: JSON.stringify(order)
            },
            cache: false
        });
    };

    factory.getGroupedDetails = function(parent_id) {
        return $pwaRequest.get("woocommerce/mobile_view/groupeddetails", {
            urlParams: {
                value_id: this.value_id,
                parent_id: parent_id
            }
        });
    };

    factory.payByStripe = function(card_token, order) {
        return $pwaRequest.post("woocommerce/mobile_view/paybycreditcard", {
            data: {
                value_id: this.value_id,
                token: JSON.stringify(card_token),
                order: JSON.stringify(order)
            },
            urlParams: {
                value_id: this.value_id
            }
        });
    };

    factory.getPaypalUrl = function(order) {
        return $pwaRequest.post("woocommerce/mobile_view/getpaypalurl", {
            data: {
                value_id: this.value_id,
                order: JSON.stringify(order)
            },
            urlParams: {
                value_id: this.value_id
            }
        });
    };

    return factory;
});
