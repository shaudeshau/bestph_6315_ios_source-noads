angular
.module("starter")
.directive("socialnetworksPostList", function ($timeout, Lightbox) {console.log("post list directive");
    return {
        restrict: "E",
        replace: true,
        templateUrl: "modules/socialnetworks/templates/l1/tabs/directives/post-list.html",
        link: function (scope) {
            scope.$watch("post", function () {
                // Updating local `post` instance
                console.log("Updating local post instance");
                scope._post = scope.post;
            });
        },
        controller: function ($scope) {
            $scope.listDidRender = function () {
                $timeout(function () {
                    Lightbox.run(".list-posts");
                }, 200);
            };
        }
    };
})
.directive("socialnetworksPostItem", function ($rootScope, $filter, $sce, $translate, $timeout, $q,
                                        Customer, Dialog, Loader, Socialnetworks, SocialnetworksPost, SocialnetworksUtils,
                                        Lightbox, Popover, $state, $stateParams) {
        return {
            restrict: 'E',
            templateUrl: "modules/socialnetworks/templates/l1/tabs/directives/post-item.html",
            controller: function ($scope) {
                $scope.actionsPopover = null;
                $scope.popoverItems = [];

                $scope.getCardDesign = function () {
                    return Socialnetworks.cardDesign;
                };

                $scope.getSettings = function () {
                    return Socialnetworks.settings;
                };

                $scope.userLike = function () {
                    return $scope.getSettings().features.enableUserLike;
                };

                $scope.userComment = function () {
                    return $scope.getSettings().features.enableUserComment;
                };
               
                $scope.canFollow = function () {
                    return $scope.getSettings().features.enableUserFollow;
                };

                $scope.showText = function () {
                    return $filter("linky")($scope.post.text);
                };

                $scope.showLikeOrComment = function () {
                    return ($scope.post.likeCount > 0 || $scope.post.commentCount > 0) &&
                        ($scope.canLikeOrComment());
                };

                $scope.canLikeOrComment = function () {
                    return ($scope.userLike() || $scope.userComment());
                };

                $scope.imagePath = function () {
                    if ($scope.post.image.length <= 0) {
                        return "modules/socialnetworks/images/placeholder.png";
                    }
                    return IMAGE_URL + "images/application" + $scope.post.image;
                };

                $scope.authorImagePath = function () {
                    // Empty image
                    if ($scope.post.author.image.length <= 0) {
                        return "modules/socialnetworks/images/customer-placeholder.png";
                    }
                    // App icon
                    if ($scope.post.author.image.indexOf("/var/cache") === 0) {
                        return IMAGE_URL + $scope.post.author.image;
                    }
                    return IMAGE_URL + "images/customer" + $scope.post.author.image;
                };

                $scope.liked = function () {
                    return $scope.post.likes;
                };

                $scope.authorName = function () {
                    return $scope.post.author.firstname + " " + $scope.post.author.lastname;
                };

                $scope.publicationDate = function () {
                    return $filter("moment_calendar")($scope.post.date * 1000);
                };
                
                $scope.showProfile = function (){
                    if($scope.post.customerId){ 
                        $state.go('socialnetworks-detail', {
                            value_id: $stateParams.value_id,
                            customer_id: $scope.post.customerId
                        });
                        // as this will satify only in map tab's post modal
                        if(typeof $scope.close === "function"){
                            $scope.close();
                        }
                    }
                };
                
                $scope.hasFollowers = function () {
                     if($scope.post.follower_count > 0){
                         return true;
                     }
                     return false;
                };
                
                $scope.goToFollowersList = function (){
                    if( $scope.post.follower_count ){
                        $state.go('socialnetworks-listing', {
                            value_id: $stateParams.value_id,
                            customer_id: $scope.post.customerId,
                            type: 'followers'
                        });
                        $scope.close();
                    }
                };

                // Popover actions!
                $scope.openActions = function ($event) {
                    $scope
                    .closeActions()
                    .then(function () {
                        Popover
                        .fromTemplateUrl("features/fanwall2/assets/templates/l1/tabs/directives/actions-popover.html", {
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

                $scope.flagPost = function () {
                    var title = $translate.instant("Report this message!", "socialnetworks");
                    var message = $translate.instant("Please let us know why you think this message is inappropriate.", "socialnetworks");
                    var placeholder = $translate.instant("Your message.", "socialnetworks");

                    Dialog
                        .prompt(
                            title,
                            message,
                            "text",
                            placeholder,
                            ["OK", "CANCEL"],
                            -1,
                            "socialnetworks")
                        .then(function (value) {
                            Loader.show();

                            SocialnetworksPost
                                .reportPost($scope.post.id, value)
                                .then(function (payload) {
                                    Dialog.alert("Thanks!", payload.message, "OK", 2350, "socialnetworks");
                                }, function (payload) {
                                    Dialog.alert("Error!", payload.message, "OK", -1, "socialnetworks");
                                }).then(function () {
                                    Loader.hide();
                                });
                        });
                };

                /**
                 *
                 * */
                $scope.buildPopoverItems = function () {
                    var viewHistory = {
                        label: $translate.instant("View edit history", "socialnetworks"),
                        icon: "icon ion-clock",
                        click: function () {
                            $scope
                            .closeActions()
                            .then(function () {
                                $scope.showHistory();
                            });
                        }
                    };

                    if ($scope.isOwner()) {
                        $scope.popoverItems.push({
                            label: $translate.instant("Edit post", "socialnetworks"),
                            icon: "icon ion-edit",
                            click: function () {
                                $scope
                                .closeActions()
                                .then(function () {
                                    $scope.editPost();
                                });
                            }
                        });

                        if ($scope.post.history.length > 0) {
                            $scope.popoverItems.push(viewHistory);
                        }

                        $scope.popoverItems.push({
                            label: $translate.instant("Delete post", "socialnetworks"),
                            icon: "icon ion-android-delete",
                            click: function () {
                                $scope
                                .closeActions()
                                .then(function () {
                                    $scope.deletePost();
                                });
                            }
                        });
                    } else {
                        $scope.popoverItems.push({
                            label: $translate.instant("Report post", "socialnetworks"),
                            icon: "icon ion-flag",
                            click: function () {
                                $scope
                                .closeActions()
                                .then(function () {
                                    $scope.flagPost();
                                });
                            }
                        });

                        if ($scope.post.history.length > 0) {
                            $scope.popoverItems.push(viewHistory);
                        }

                        if ($scope.post.customerId !== 0) {
                            $scope.popoverItems.push({
                                label: $translate.instant("Block all user posts", "socialnetworks"),
                                icon: "ion-android-remove-circle",
                                click: function () {
                                    $scope
                                    .closeActions()
                                    .then(function () {
                                        $scope.blockUser();
                                    });
                                }
                            });
                        }

                    }
                };

                $scope.blockUser = function () {
                    if (!Customer.isLoggedIn()) {
                        return Customer.loginModal();
                    }
                    SocialnetworksUtils.blockUser($scope.post.id, "from-post");
                };

                $scope.showHistory = function () {
                    SocialnetworksUtils.showPostHistoryModal($scope.post);
                };

                $scope.deletePost = function () {
                    Dialog
                    .confirm(
                        "Confirmation",
                        "You are about to delete this post!",
                        ["YES", "NO"],
                        -1,
                        "socialnetworks")
                    .then(function (value) {
                        if (!value) {
                            return;
                        }
                        Loader.show();

                        SocialnetworksPost
                        .deletePost($scope.post.id, value)
                        .then(function (payload) {
                            $rootScope.$broadcast("socialnetworks.refresh");
                            //Dialog.alert("Thanks!", payload.message, "OK", 2350, "socialnetworks");
                        }, function (payload) {
                            Dialog.alert("Error!", payload.message, "OK", -1, "socialnetworks");
                        }).then(function () {
                            Loader.hide();
                        });
                    });
                };

                $scope.commentModal = function () {
                    SocialnetworksUtils.commentModal($scope.post);
                };

                $scope.toggleLike = function () {
                    if (!Customer.isLoggedIn()) {
                        return Customer.loginModal();
                    }

                    // Prevent spamming like/unlike!
                    if ($scope.post.likeLocked === true) {
                        return false;
                    }

                    $scope.post.likeLocked = true;
                    if ($scope.post.iLiked) {
                        // Instant feedback while saving value!
                        $scope.post.iLiked = false;

                        SocialnetworksPost
                            .unlike($scope.post.id)
                            .then(function (payload) {
                                // Decrease like count if success!
                                $scope.post.likeCount--;
                            }, function (payload) {
                                // Revert value if failed!
                                $scope.post.iLiked = true;
                            }).then(function () {
                                $scope.post.likeLocked = false;
                            });

                    } else {
                        // Instant feedback while saving value!
                        $scope.post.iLiked = true;

                        SocialnetworksPost
                            .like($scope.post.id)
                            .then(function (payload) {
                                // Increase like count if success!
                                $scope.post.likeCount++;
                            }, function (payload) {
                                // Revert value if failed!
                                $scope.post.iLiked = false;
                            }).then(function () {
                                $scope.post.likeLocked = false;
                            });
                    }

                    return true;
                };

                $scope.isOwner = function () {
                    if (!Customer.isLoggedIn()) {
                        return false;
                    }

                    return Customer.customer.id === $scope.post.customerId;
                };

                $scope.editPost = function () {
                    return SocialnetworksUtils.postModal($scope.post);
                };

                // Build items!
                $scope.buildPopoverItems();

                $rootScope.$on("socialnetworks.modal.ready", function () {
                    $timeout(function () {
                        Lightbox.run(".show-post");
                    }, 200);
                });
            }
        };
    })
.directive("socialnetworksPostHistoryItem", function (Socialnetworks) {
        return {
            restrict: "E",
            templateUrl: "modules/socialnetworks/templates/l1/modal/post/history-item.html",
            controller: function ($scope, $filter) {
                $scope.getCardDesign = function () {
                    return Socialnetworks.cardDesign;
                };

                $scope.imagePath = function () {
                    if ($scope.item.image.length <= 0) {
                        return "modules/socialnetworks/images/placeholder.png";
                    }
                    return IMAGE_URL + "images/application" + $scope.item.image;
                };

                $scope.publicationDate = function () {
                    return $filter("moment_calendar")($scope.item.date * 1000);
                };
            }
        };
    })
.directive('socialnetworksCommentForm', function ($timeout, Customer, Dialog, Picture, SocialnetworksPost) {
        return {
            restrict: 'E',
            replace: true,
            templateUrl: "modules/socialnetworks/templates/l1/modal/directives/comment-form.html",
            controller: function ($scope) {
                angular.extend($scope, {
                    form: {
                        text: "",
                        date: null,
                        picture: null
                    },
                    isSending: false
                });

                $scope.takePicture = function () {
                    if (!Customer.isLoggedIn()) {
                        return Customer.loginModal();
                    }

                    if ($scope.isSending) {
                        return false;
                    }

                    return Picture
                    .takePicture()
                    .then(function (success) {
                        $scope.form.picture = success.image;
                    });
                };

                $scope.clearComment = function () {
                    $timeout(function () {
                        $scope.form = {
                            text: "",
                            picture: null
                        };
                    });
                };

                $scope.showClearComment = function () {
                    return ($scope.form.text.length > 0 || $scope.form.picture !== null);
                };

                $scope.instantAppend = function (text) {
                    var now = Math.round(Date.now() / 1000);
                    var comment = {
                        id: now,
                        postId: $scope.post.id,
                        customerId: Customer.customer.id,
                        text: text.replace(/(\r\n|\n\r|\r|\n)/g, "<br />"),
                        image: "",
                        isFlagged: false,
                        date: now,
                        history: [],
                        author: {
                            firstname: Customer.customer.firstname,
                            lastname: Customer.customer.lastname,
                            nickname: Customer.customer.nickname,
                            image: Customer.customer.image
                        }
                    };

                    $scope.post.comments.push(comment);
                };

                $scope.sendComment = function () {
                    if (!Customer.isLoggedIn()) {
                        return Customer.loginModal();
                    }

                    // Prevent multiple submits & empty comments!
                    if ($scope.isSending || !$scope.showClearComment()) {
                        return false;
                    }

                    // Append now
                    $scope.form.date = Math.round(Date.now() / 1000);

                    // Instantly append post
                    $scope.instantAppend($scope.form.text);

                    $scope.isSending = true;

                    return SocialnetworksPost
                    .sendComment($scope.post.id, null, $scope.form)
                    .then(function (payload) {
                        $scope.clearComment();

                        // Post is updated!
                        $timeout(function () {
                            $scope.post.comments = angular.copy(payload.comments);
                            $scope.post.commentCount = $scope.post.comments.length;
                        });

                    }, function (payload) {
                        // Show error!
                        Dialog.alert("Error", payload.message, "OK", -1, "socialnetworks");

                        $scope.post.comments.pop();

                    }).then(function () {
                        $scope.isSending = false;
                    });
                };
            }
        };
    })
.directive("socialnetworksCommentList", function ($timeout, ModalScrollDelegate, Lightbox) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "modules/socialnetworks/templates/l1/modal/directives/comment-list.html",
        link: function (scope) {
            scope.$watch("post", function () {console.log('comment list');
                // Updating local `post` instance
                scope._post = scope.post;
            });
        },
        controller: function ($rootScope, $scope) {console.log('1');
            $scope.scrollToBottom = function () {
                $timeout(function () {
                    ModalScrollDelegate
                        .$getByHandle("fanwall-comment-list")
                        .scrollBottom(true);

                    $timeout(function () {
                        Lightbox.run(".list-comments");
                    }, 200);
                }, 200);
            };

            $scope.listDidRender = function () {
                $scope.scrollToBottom();
            };

            $rootScope.$on("socialnetworks.refresh.comments", function (event, payload) {
                // Comments are updated!
                if (payload.postId === $scope.post.id) {
                    $timeout(function () {
                        $scope.post.comments = angular.copy(payload.comments);
                        $scope.post.commentCount = $scope.post.comments.length;
                    });
                }
            });
        }
    };
})
.directive("socialnetworksCommentItem", function ($rootScope, $filter, $timeout, $translate, $q, Customer, Dialog, Loader,
                                           Socialnetworks, SocialnetworksPost, SocialnetworksUtils, Popover, $state, $stateParams) {
        return {
            restrict: 'E',
            templateUrl: "modules/socialnetworks/templates/l1/modal/directives/comment-item.html",
            controller: function ($scope) {console.log('comment item'+$stateParams.value_id);
                $scope.actionsPopover = null;
                $scope.popoverItems = [];
                
                $scope.getCardDesign = function () {
                    return Socialnetworks.cardDesign;
                };

                $scope.getSettings = function () {
                    return Socialnetworks.settings;
                };

                $scope.authorImagePath = function () {
                    if ($scope.comment.author.image.length <= 0) {
                        return "modules/socialnetworks/images/customer-placeholder.png"
                    }
                    return IMAGE_URL + "images/customer" + $scope.comment.author.image;
                };

                $scope.isBlocked = function () {
                    return $scope.comment.isBlocked;
                };

                $scope.isFromMe = function () {
                    return $scope.comment &&
                        ($scope.comment.customerId === Customer.customer.id);
                };

                $scope.imagePath = function () {
                    return IMAGE_URL + "images/application" + $scope.comment.image;
                };

                $scope.showText = function () {
                    return $filter("linky")($scope.comment.text);
                };

                $scope.authorName = function () {
                    return $scope.comment.author.firstname + " " + $scope.comment.author.lastname;
                };

                $scope.publicationDate = function () {
                    return $filter("moment_calendar")($scope.comment.date * 1000);
                };

                $scope.isOwner = function () {
                    if (!Customer.isLoggedIn()) {
                        return false;
                    }

                    return Customer.customer.id === $scope.comment.customerId;
                };
                
                $scope.showProfile = function (){
                    if( $scope.comment.customerId ){
                        $state.go('socialnetworks-detail', {
                            value_id: $stateParams.value_id,
                            customer_id: $scope.comment.customerId
                        });

                        $scope.close();
                    }
                };

                $scope.deleteComment = function () {
                    if (!Customer.isLoggedIn()) {
                        return Customer.loginModal();
                    }

                    var title = $translate.instant("Delete this comment!", "socialnetworks");
                    var message = $translate.instant("Are you sure?", "socialnetworks");

                    return Dialog
                    .confirm(
                        title,
                        message,
                        ['YES', 'NO'])
                    .then(function (success) {
                        if (success) {
                            Loader.show();

                            SocialnetworksPost
                            .deleteComment($scope.comment.id)
                            .then(function (payload) {
                                $scope.post.comments = angular.copy(payload.comments);
                                $scope.post.commentCount = $scope.post.comments.length;
                            }, function (payload) {
                                Dialog.alert("Error!", payload.message, "OK", -1, "socialnetworks");
                            }).then(function () {
                                Loader.hide();
                            });
                        }
                    });
                };

                $scope.flagComment = function () {
                    if (!Customer.isLoggedIn()) {
                        return Customer.loginModal();
                    }

                    var title = $translate.instant("Report this message!", "socialnetworks");
                    var message = $translate.instant("Please let us know why you think this message is inappropriate.", "socialnetworks");
                    var placeholder = $translate.instant("Your message.", "socialnetworks");

                    return Dialog
                    .prompt(
                        title,
                        message,
                        "text",
                        placeholder,
                        ["OK", "CANCEL"],
                        -1,
                        "socialnetworks")
                    .then(function (value) {
                        Loader.show();

                        SocialnetworksPost
                        .reportComment($scope.comment.id, value)
                        .then(function (payload) {
                            Dialog.alert("Thanks!", payload.message, "OK", 2350, "socialnetworks");
                        }, function (payload) {
                            Dialog.alert("Error!", payload.message, "OK", -1, "socialnetworks");
                        }).then(function () {
                            Loader.hide();
                        });
                    });
                };

                // Popover actions!
                $scope.openActions = function ($event) {
                    $scope
                    .closeActions()
                    .then(function () {
                        Popover
                        .fromTemplateUrl("modules/socialnetworks/templates/l1/modal/directives/actions-popover.html", {
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

                $scope.blockUser = function () {
                    if (!Customer.isLoggedIn()) {
                        return Customer.loginModal();
                    }

                    SocialnetworksUtils.blockUser($scope.comment.id, "from-comment");
                };

                $scope.unblockUser = function () {
                    SocialnetworksUtils.unblockUser($scope.comment.id, "from-comment");
                };

                $scope.editComment = function () {
                    return SocialnetworksUtils.editCommentModal($scope.comment);
                };

                $scope.showHistory = function () {
                    SocialnetworksUtils.showCommentHistoryModal($scope.comment);
                };

                /**
                 *
                 */
                $scope.buildPopoverItems = function () {
                    $scope.popoverItems = [];

                    var historyAction = {
                        label: $translate.instant("View edit history", "socialnetworks"),
                        icon: "icon ion-clock",
                        click: function () {
                            $scope
                            .closeActions()
                            .then(function () {
                                $scope.showHistory();
                            });
                        }
                    };

                    if ($scope.isOwner()) {
                        $scope.popoverItems.push({
                            label: $translate.instant("Edit comment", "socialnetworks"),
                            icon: "icon ion-edit",
                            click: function () {
                                $scope
                                .closeActions()
                                .then(function () {
                                    $scope.editComment();
                                });
                            }
                        });

                        if ($scope.comment.history.length > 0) {
                            $scope.popoverItems.push(historyAction);
                        }

                        $scope.popoverItems.push({
                            label: $translate.instant("Delete comment", "socialnetworks"),
                            icon: "icon ion-android-delete",
                            click: function () {
                                $scope
                                .closeActions()
                                .then(function () {
                                    $scope.deleteComment();
                                });
                            }
                        });
                    } else {
                        if (!$scope.isBlocked()) {
                            $scope.popoverItems.push({
                                label: $translate.instant("Report post", "socialnetworks"),
                                icon: "icon ion-flag",
                                click: function () {
                                    $scope
                                    .closeActions()
                                    .then(function () {
                                        $scope.flagComment();
                                    });
                                }
                            });

                            if ($scope.comment.history.length > 0) {
                                $scope.popoverItems.push(historyAction);
                            }

                            $scope.popoverItems.push({
                                label: $translate.instant("Block all user posts", "socialnetworks"),
                                icon: "ion-android-remove-circle",
                                click: function () {
                                    $scope
                                    .closeActions()
                                    .then(function () {
                                        $scope.blockUser();
                                    });
                                }
                            });
                        } else {
                            $scope.popoverItems.push({
                                label: $translate.instant("Unblock user", "socialnetworks"),
                                icon: "ion-android-remove-circle",
                                click: function () {
                                    $scope
                                    .closeActions()
                                    .then(function () {
                                        $scope.unblockUser();
                                    });
                                }
                            });
                        }
                    }
                };

                // Build items!
                $scope.buildPopoverItems();

                $rootScope.$on("socialnetworks.refresh.comments", function (event, payload) {
                    // Comments are updated!
                    if (payload.postId === $scope.post.id) {
                        $timeout(function () {
                            $scope.buildPopoverItems();
                        });
                    }
                });
            }
        };
    })
.directive("socialnetworksCommentHistoryItem", function (Socialnetworks) {
        return {
            restrict: "E",
            templateUrl: "modules/socialnetworks/templates/l1/modal/comment/history-item.html",
            controller: function ($scope, $filter) {
                $scope.getCardDesign = function () {
                    return Socialnetworks.cardDesign;
                };

                $scope.imagePath = function () {
                    if ($scope.item.image.length <= 0) {
                        return "modules/socialnetworks/images/placeholder.png";
                    }
                    return IMAGE_URL + "images/application" + $scope.item.image;
                };

                $scope.publicationDate = function () {
                    return $filter("moment_calendar")($scope.item.date * 1000);
                };
            }
        };
    })
.directive("socialnetworksGallery", function ($timeout, ModalScrollDelegate, Lightbox) {
    return {
        restrict: "E",
        replace: true,
        templateUrl: "modules/socialnetworks/templates/l1/tabs/directives/gallery.html",
        controller: function ($scope) {
            $scope.listDidRender = function () {
                $timeout(function () {
                    Lightbox.run(".fanwall-gallery");
                }, 200);
            };

            $scope.imagePath = function (item) {
                return IMAGE_URL + "images/application" + item.image;
            };
        }
    };
})
.directive("socialnetworksBlockedUserItem", function ($stateParams, $rootScope, $translate, $q,
                                               SocialnetworksPost, SocialnetworksUtils, Popover) {
        return {
            restrict: 'E',
            templateUrl: "modules/socialnetworks/templates/l1/modal/profile/blocked-user-item.html",
            controller: function ($scope) {
                $scope.actionsPopover = null;
                $scope.popoverItems = [];

                SocialnetworksPost.setValueId($stateParams.value_id);

                $scope.customerFullname = function () {
                    return $scope.item.firstname + " " + $scope.item.lastname;
                };

                $scope.customerImagePath = function () {
                    // Empty image
                    if ($scope.item.image.length <= 0) {
                        return "modules/socialnetworks/images/customer-placeholder.png";
                    }
                    return IMAGE_URL + "images/customer" + $scope.item.image;
                };

                $scope.unblockUser = function () {
                    SocialnetworksUtils
                    .unblockUser($scope.item.id, "from-user")
                    .then(function () {
                        $rootScope.$broadcast("socialnetworks.blockedUsers.refresh");
                    });
                };

                // Popover actions!
                $scope.openActions = function ($event) {
                    $scope
                    .closeActions()
                    .then(function () {
                        Popover
                        .fromTemplateUrl("modules/socialnetworks/templates/l1/tabs/directives/actions-popover.html", {
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

                /**
                 *
                 */
                $scope.buildPopoverItems = function () {
                    $scope.popoverItems = [];

                    $scope.popoverItems.push({
                        label: $translate.instant("Unblock user", "socialnetworks"),
                        icon: "icon ion-android-remove-circle",
                        click: function () {
                            $scope
                            .closeActions()
                            .then(function () {
                                $scope.unblockUser();
                            });
                        }
                    });
                };

                // Build items!
                $scope.buildPopoverItems();
            }
        };
    })
.directive("socialnetworksProfileList", function ($timeout, Lightbox) {console.log("profile list directive");
    return {
        restrict: "E",
        replace: true,
        templateUrl: "modules/socialnetworks/templates/l1/tabs/directives/profile-list.html",
        link: function (scope) {
            scope.$watch("post", function () {
                // Updating local `post` instance
                console.log("Updating local profile instance");
                scope._post = scope.post;
            });
        },
        controller: function ($scope) {
            $scope.listDidRender = function () {
                $timeout(function () {
                    Lightbox.run(".list-posts");
                }, 200);
            };
        }
    };
})
.directive("socialnetworksProfileItem", function ($rootScope, $filter, $sce, $translate, $timeout, $q,
                                        Customer, Dialog, Loader, Socialnetworks, SocialnetworksPost, SocialnetworksUtils,
                                        Lightbox, Popover, $state, $http, Url) {
        return {
            restrict: 'E',
            templateUrl: "modules/socialnetworks/templates/l1/tabs/directives/profile-item.html",
            controller: function ($scope) {

                $scope.getCardDesign = function () {
                    return Socialnetworks.cardDesign;
                };

                $scope.getSettings = function () {
                    return Socialnetworks.settings;
                };
                
                $scope.chatEnable = function () {
                    return $scope.getSettings().features.enableUserChat;
                };

                $scope.followEnable = function () {
                    return $scope.getSettings().features.enableUserFollow;
                };
                
                $scope.hasFollowers = function () {
                     if($scope.post.followers_count > 0){
                         return true;
                     }
                     return false;
                };
                
                $scope.hasFriends = function () {
                     if($scope.post.friends > 0){
                         return true;
                     }
                     return false;
                };
                
                $scope.goToFollowersOrFriendsList = function (type) {
                    if( (type === 'followers' && $scope.hasFollowers()) || (type === 'friends' && $scope.hasFriends() ) ){
                        $state.go('socialnetworks-listing', {
                            value_id: $scope.value_id,
                            customer_id: $scope.post.customer_id,
                            type: type
                        });
                    }
                };
                
                $scope.canFollow = function () {
                    if( $scope.followEnable() && !$scope.post.following ){
                            return true;
                    }
                    return false;
                };
                
                $scope.followCustomer = function ( index, customerId ){
                    console.log($scope.value_id+'follow customer=>' + $scope.post.customer_id);
                    var params = {value_id: $scope.value_id, customer_id: $scope.post.customer_id};
                    $scope.post.following = true;

                    $http({
                        method: 'GET',
                        url: Url.get("socialnetworks/mobile_list/followcustomer", params),
                        cache: false,
                        responseType:'json'
                    }).then( function(data){

                            $scope.is_loading = false; 

                            if( data.status ){console.log('followed..');

                                $scope.post.followers_count = $scope.post.followers_count + 1;
                                //check if they become friends then update the count
                                if( $scope.post.receiver_has_followed ){
                                    $scope.post.friends = $scope.post.friends + 1;
                                }
                            }
                    });
                };
                
                $scope.canChat = function () {
                    if( $scope.chatEnable() ){
                        if( $scope.settings.enable_chat_for == 'all' || $scope.post.is_friend ){
                            return true;
                        }
                    }
                    return false;
                };
                
                $scope.canChatOrFollow = function () {
                    return ($scope.canChat() || $scope.canFollow());
                };
                
                $scope.openChatWindow = function (){
                    
                    var params = {value_id: $scope.value_id, user_id: $scope.post.customer_id};
                    $http({
                        method: 'GET',
                        url: Url.get("socialnetworks/mobile_chat/getconversation", params),
                        cache: false,
                        responseType:'json'
                    }).then( function(data){
                            console.log('conversationid is: '+ data.data.conversation_id);
                            $scope.is_loading = false; 

                            $rootScope.user = data.data.user;          
                            $rootScope.toUserId = $scope.post.customer_id;

                            $state.go('socialnetworks-chat', {
                                value_id: $scope.value_id,
                                conversation_id: data.data.conversation_id
                            });
                    });
                };

                $scope.imagePath = function () {
                    if ($scope.post.image.length <= 0) {
                        return "modules/socialnetworks/images/placeholder.png";
                    }
                    return IMAGE_URL + "images/application" + $scope.post.image;
                };

                $scope.customerImagePath = function () {
                    // Empty image
                    if ($scope.post.image == '' || $scope.post.image == null  ) {
                        return "modules/socialnetworks/images/customer-placeholder.png";
                    }
                    // App icon
                    if ( $scope.post.image != null && $scope.post.image.indexOf("/var/cache") === 0) {
                        return IMAGE_URL + $scope.post.image;
                    }
                    return IMAGE_URL + "images/customer" + $scope.post.image;
                };


                $scope.customerName = function () {
                    return $scope.post.firstname + " " + $scope.post.lastname;
                };
                
                $scope.showProfile = function (){
                    if( $scope.post.customer_id ){
                        $state.go('socialnetworks-detail', {
                            value_id: $scope.value_id,
                            customer_id: $scope.post.customer_id
                        });
                    }
                };

/*
                $scope.isOwner = function () {
                    if (!Customer.isLoggedIn()) {
                        return false;
                    }

                    return Customer.customer.id === $scope.post.customerId;
                };*/


                $rootScope.$on("socialnetworks.modal.ready", function () {
                    $timeout(function () {
                        Lightbox.run(".show-post");
                    }, 200);
                });
            }
        };
    });




