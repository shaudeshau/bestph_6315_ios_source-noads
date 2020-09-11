
angular.module("starter").factory("Socialnetworks", function ($pwaRequest) {
    var factory = {
        value_id: null,
        settings: [],
        cardDesign: false
    };

    /**
     *
     * @param value_id
     */
    factory.setValueId = function (value_id) {
        factory.value_id = value_id;
    };

    factory.loadSettings = function () {
        var payload = $pwaRequest.getPayloadForValueId(factory.value_id);
        if (payload !== false) {
            return $pwaRequest.resolve(payload);
        }

        // Otherwise fallback on PWA!
        return $pwaRequest.get("socialnetworks/mobile_newsfeed/load-settings", {
            urlParams: {
                value_id: factory.value_id
            }
        });
    };
    
    factory.unreadMessagesCount = function () {
        var payload = $pwaRequest.getPayloadForValueId(factory.value_id);
        if (payload !== false) {
            return $pwaRequest.resolve(payload);
        }

        // Otherwise fallback on PWA!
        return $pwaRequest.get("socialnetworks/mobile_newsfeed/update-unread-messages-count", {
            urlParams: {
                value_id: factory.value_id
            }
        });
    };

    factory.toggleDesign = function () {
        factory.cardDesign = !factory.cardDesign;
    };

    return factory;
});



/**
 * Module Socialnetworks
 *
 * @author Xtraball SAS <dev@xtraball.com>
 * @version 4.17.0
 */
angular.module("starter").factory("SocialnetworksPost", function ($pwaRequest) {
    var factory = {
        value_id: null,
        extendedOptions: {},
        collections: []
    };

    /**
     *
     * @param value_id
     */
    factory.setValueId = function (value_id) {
        factory.value_id = value_id;
    };

    /**
     *
     * @param options
     */
    factory.setExtendedOptions = function (options) {
        factory.extendedOptions = options;
    };

    /**
     * Pre-Fetch feature.
     */
    factory.preFetch = function () {
    };

    factory.findAll = function (offset, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksPost.findAll] missing value_id");
        }

        return $pwaRequest.get("socialnetworks/mobile_post/find-all", angular.extend({
            urlParams: {
                value_id: this.value_id,
                offset: offset
            },
            refresh: refresh
        }, factory.extendedOptions));
    };

    factory.findAllNearby = function (location, offset, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksPost.findAllNearby] missing value_id");
        }

        return $pwaRequest.get("socialnetworks/mobile_post/find-all-nearby", angular.extend({
            urlParams: {
                value_id: this.value_id,
                latitude: location.latitude,
                longitude: location.longitude,
                offset: offset
            },
            refresh: refresh
        }, factory.extendedOptions));
    };
    
    factory.findAllSearch = function (location, offset, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksPost.findAllSearch] missing value_id");
        }

        return $pwaRequest.get("socialnetworks/mobile_post/find-all-search", angular.extend({
            urlParams: {
                value_id: this.value_id,
                //latitude: location.latitude,
                //longitude: location.longitude,
                offset: offset
            },
            refresh: refresh
        }, factory.extendedOptions));
    };

    factory.findAllProfile = function (offset) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksPost.findAllProfile] missing value_id");
        }

        return $pwaRequest.get("socialnetworks/mobile_post/find-all-profile", angular.extend({
            urlParams: {
                value_id: this.value_id,
                offset: offset
            },
            refresh: true
        }, factory.extendedOptions));
    };
    

    factory.findAllBlocked = function () {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksPost.findAllBlocked] missing value_id");
        }

        return $pwaRequest.get("socialnetworks/mobile_post/find-all-blocked", angular.extend({
            urlParams: {
                value_id: this.value_id
            },
            refresh: true
        }, factory.extendedOptions));
    };

    factory.findAllMap = function (location, offset, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksPost.findAllMap] missing value_id");
        }

        return $pwaRequest.get("socialnetworks/mobile_post/find-all-map", angular.extend({
            urlParams: {
                value_id: this.value_id,
                latitude: location.latitude,
                longitude: location.longitude,
                offset: offset
            },
            refresh: refresh
        }, factory.extendedOptions));
    };

    factory.like = function (postId) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksPost.like] missing value_id");
        }

        return $pwaRequest.post("socialnetworks/mobile_post/like-post", angular.extend({
            urlParams: {
                value_id: this.value_id,
                postId: postId
            }
        }, factory.extendedOptions));
    };

    factory.unlike = function (postId) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksPost.like] missing value_id");
        }

        return $pwaRequest.post("socialnetworks/mobile_post/unlike-post", angular.extend({
            urlParams: {
                value_id: this.value_id,
                postId: postId
            }
        }, factory.extendedOptions));
    };

    /**
     * Send new post!
     *
     * @param postId
     * @param form
     */
    factory.sendPost = function (postId, form) {
        return $pwaRequest.post("socialnetworks/mobile_post/send-post", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                postId: postId,
                form: form
            },
            cache: false
        });
    };

    /**
     * Send new comment!
     *
     * @param postId
     * @param commentId
     * @param form
     */
    factory.sendComment = function (postId, commentId, form) {
        return $pwaRequest.post("socialnetworks/mobile_post/send-comment", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                postId: postId,
                commentId: commentId,
                form: form
            },
            cache: false
        });
    };

    /**
     * Report unwanted post!
     *
     * @param postId
     * @param reportMessage
     */
    factory.reportPost = function (postId, reportMessage) {
        return $pwaRequest.post("socialnetworks/mobile_report/report-post", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                postId: postId,
                reportMessage: reportMessage
            }
        });
    };

    /**
     * Block unwanted user!
     *
     * @param sourceId
     * @param from
     */
    factory.blockUser = function (sourceId, from) {
        return $pwaRequest.post("socialnetworks/mobile_post/block-user", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                from: from,
                sourceId: sourceId
            }
        });
    };

    /**
     * Block unwanted user!
     *
     * @param sourceId
     * @param from
     */
    factory.unblockUser = function (sourceId, from) {
        return $pwaRequest.post("socialnetworks/mobile_post/unblock-user", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                from: from,
                sourceId: sourceId
            }
        });
    };

    /**
     * Delete own post!
     *
     * @param postId
     */
    factory.deletePost = function (postId) {
        return $pwaRequest.post("socialnetworks/mobile_post/delete-post", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                postId: postId
            }
        });
    };

    /**
     * Delete self comment!
     *
     * @param commentId
     */
    factory.deleteComment = function (commentId) {
        return $pwaRequest.post("socialnetworks/mobile_post/delete-comment", {
            urlParams: {
                value_id: factory.value_id,
                commentId: commentId
            }
        });
    };

    /**
     * Report unwanted comment!
     *
     * @param commentId
     * @param reportMessage
     */
    factory.reportComment = function (commentId, reportMessage) {
        return $pwaRequest.post("socialnetworks/mobile_report/report-comment", {
            urlParams: {
                value_id: factory.value_id
            },
            data: {
                commentId: commentId,
                reportMessage: reportMessage
            }
        });
    };

    return factory;
});

/**
 * Module SocialNetworks
 *
 * @author Xtraball SAS <dev@xtraball.com>
 * @version 4.17.0
 */
angular.module("starter").factory("SocialnetworksUtils", function ($rootScope, $timeout, Dialog, Loader, Modal, SocialnetworksPost) {
    var factory = {
        _postModal: null,
        _showPostModal: null,
        _showPostHistoryModal: null,
        _showBlockedUsersModal: null,
        _commentModal: null,
        _editCommentModal: null
    };

    /**
     *
     * @param post
     */
    factory.postModal = function (post) {
        Modal
        .fromTemplateUrl("modules/socialnetworks/templates/l1/modal/new.html", {
            scope: angular.extend($rootScope.$new(true), {
                post: post,
                close: function () {
                    factory._postModal.hide();
                }
            }),
            animation: "slide-in-right-left"
        }).then(function (modal) {
            factory._postModal = modal;
            factory._postModal.show();

            return modal;
        });
    };

    /**
     *
     * @param postGroup
     */
    factory.showPostModal = function (postGroup) {
        var _localScope = angular.extend($rootScope.$new(true), {
            //postGroup: postGroup,
            //isPostDetails: true,
            modalReady: false,
            close: function () {
                factory._showPostModal.hide();
            }
        });

        Modal
        .fromTemplateUrl("modules/socialnetworks/templates/l1/modal/post.html", {
            scope: _localScope,
            animation: "slide-in-right-left"
        }).then(function (modal) {
            factory._showPostModal = modal;
            factory._showPostModal.show();

            // Sending data to modal only after rendering!
            $timeout(function () {
                _localScope.postGroup = postGroup;
                _localScope.isPostDetails = true;
                _localScope.modalReady = true;

                $rootScope.$broadcast("socialnetworks.modal.ready");
            }, 500);

            return modal;
        });
    };
    

    /**
     *
     * @param post
     */
    factory.showPostHistoryModal = function (post) {
        var _localScope = angular.extend($rootScope.$new(true), {
            modalReady: false,
            close: function () {
                factory._showPostHistoryModal.hide();
            }
        });

        Modal
        .fromTemplateUrl("modules/socialnetworks/templates/l1/modal/post/history.html", {
            scope: _localScope,
            animation: "slide-in-right-left"
        }).then(function (modal) {
            factory._showPostHistoryModal = modal;
            factory._showPostHistoryModal.show();

            // Sending data to modal only after rendering!
            $timeout(function () {
                _localScope.post = post;
                _localScope.modalReady = true;

                $rootScope.$broadcast("socialnetworks.modal.ready");
            }, 500);

            return modal;
        });
    };

    /**
     *
     * @param comment
     */
    factory.showCommentHistoryModal = function (comment) {
        var _localScope = angular.extend($rootScope.$new(true), {
            modalReady: false,
            close: function () {
                factory._showPostHistoryModal.hide();
            }
        });

        Modal
        .fromTemplateUrl("modules/socialnetworks/templates/l1/modal/comment/history.html", {
            scope: _localScope,
            animation: "slide-in-right-left"
        }).then(function (modal) {
            factory._showPostHistoryModal = modal;
            factory._showPostHistoryModal.show();

            // Sending data to modal only after rendering!
            $timeout(function () {
                _localScope.comment = comment;
                _localScope.modalReady = true;

                $rootScope.$broadcast("socialnetworks.modal.ready");
            }, 500);

            return modal;
        });
    };

    /**
     *
     */
    factory.showBlockedUsersModal = function () {
        var _localScope = angular.extend($rootScope.$new(true), {
            close: function () {
                factory._showBlockedUsersModal.hide();
            }
        });

        Modal
        .fromTemplateUrl("modules/socialnetworks/templates/l1/modal/profile/blocked.html", {
            scope: _localScope,
            animation: "slide-in-right-left"
        }).then(function (modal) {
            factory._showBlockedUsersModal = modal;
            factory._showBlockedUsersModal.show();

            return modal;
        });
    };

    /**
     *
     * @param post
     */
    factory.commentModal = function (post) {
        Modal
        .fromTemplateUrl("modules/socialnetworks/templates/l1/modal/comment.html", {
            scope: angular.extend($rootScope.$new(true), {
                post: post,
                close: function () {
                    factory._commentModal.hide();
                }
            }),
            animation: "slide-in-right-left"
        }).then(function (modal) {
            factory._commentModal = modal;
            factory._commentModal.show();

            return modal;
        });
    };

    /**
     *
     * @param comment
     */
    factory.editCommentModal = function (comment) {
        Modal
        .fromTemplateUrl("modules/socialnetworks/templates/l1/modal/comment/edit.html", {
            scope: angular.extend($rootScope.$new(true), {
                comment: comment,
                close: function () {
                    factory._editCommentModal.hide();
                }
            }),
            animation: "slide-in-right-left"
        }).then(function (modal) {
            factory._editCommentModal = modal;
            factory._editCommentModal.show();

            return modal;
        });
    };

    factory.blockUser = function (sourceId, from) {
        Dialog
        .confirm(
            "Confirmation",
            "You are about to block all this user messages!",
            ["YES", "NO"],
            -1,
            "socialnetworks")
        .then(function (value) {
            if (!value) {
                return;
            }
            Loader.show();

            SocialnetworksPost
            .blockUser(sourceId, from)
            .then(function (payload) {

                if (payload.refresh) {
                    $rootScope.$broadcast("socialnetworks.refresh");
                    $rootScope.$broadcast("socialnetworks.refresh.comments", {comments: payload.comments, postId: payload.postId});
                }

                Dialog.alert("Thanks!", payload.message, "OK", 2350, "socialnetworks");
            }, function (payload) {
                Dialog.alert("Error!", payload.message, "OK", -1, "socialnetworks");
            }).then(function () {
                Loader.hide();
            });
        });
    };

    factory.unblockUser = function (sourceId, from) {
        Dialog
        .confirm(
            "Confirmation",
            "You are about to unblock all this user messages!",
            ["YES", "NO"],
            -1,
            "socialnetworks")
        .then(function (value) {
            if (!value) {
                return;
            }
            Loader.show();

            SocialnetworksPost
            .unblockUser(sourceId, from)
            .then(function (payload) {

                if (payload.refresh) {
                    $rootScope.$broadcast("socialnetworks.refresh");
                    $rootScope.$broadcast("socialnetworks.refresh.comments", {comments: payload.comments, postId: payload.postId});
                }

                Dialog.alert("Thanks!", payload.message, "OK", 2350, "socialnetworks");
            }, function (payload) {
                Dialog.alert("Error!", payload.message, "OK", -1, "socialnetworks");
            }).then(function () {
                Loader.hide();
            });
        });
    };

    return factory;
});


angular.module("starter").factory("SocialnetworksGallery", function ($pwaRequest) {
    var factory = {
        value_id: null,
        extendedOptions: {},
        collection: []
    };

    /**
     *
     * @param value_id
     */
    factory.setValueId = function (value_id) {
        factory.value_id = value_id;
    };

    /**
     *
     * @param options
     */
    factory.setExtendedOptions = function (options) {
        factory.extendedOptions = options;
    };

    factory.findAll = function (offset, refresh) {
        if (!this.value_id) {
            return $pwaRequest.reject("[Factory::SocialnetworksGallery.findAll] missing value_id");
        }

        return $pwaRequest.get("socialnetworks/mobile_gallery/find-all", angular.extend({
            urlParams: {
                value_id: this.value_id,
                offset: offset
            },
            refresh: refresh
        }, factory.extendedOptions));
    };

    return factory;
});

