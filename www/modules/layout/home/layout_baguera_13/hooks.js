/**
 *
 * layout_baguera_13 homepage hook
 *
 * All the following functions are required in order for the Layout to work
 */
App.service("layout_baguera_13", function(
  $rootScope,
  $timeout,
  $state,
  $ionicHistory,
  HomepageLayout
) {
  var service = {};

  /**
     * Swiper instance
     *
     * @type {null}
     */
  var swipe_instance = null;

  /**
     * features array
     *
     * @type {null}
     */
  // var _features = null;

  /**
     * Last clicked index
     *
     * @type {number}
     */
  service.last_index = 0;

  /**
     * Must return a valid template
     *
     * @returns {string}
     */
  service.getTemplate = function() {
    return "modules/layout/home/layout_baguera_13/view.html";
  };

  /**
     * Must return a valid template
     *
     * @returns {string}
     */
  service.getModalTemplate = function() {
    return "modules/layout/home/layout_baguera_13/modal.html";
  };

  /**
     * onResize is used for css/js callbacks when orientation change
     */
  service.onResize = function() {};

  /**
     * Manipulate the features objects
     *
     * Examples:
     * - you can re-order features
     * - you can push/place the "more_button"
     *
     * @param features
     * @param more_button
     * @returns {*}
     */
  service.features = function(features, more_button) {
    // remove my account from menu
    features.overview.options = features.overview.options.filter(function(
      el
    ) {
      return el.code !== "tabbar_account";
    });
    features.options = features.options.filter(function(el) {
      return el.code !== "tabbar_account";
    });

    // only add more button if more than 4 features
    if (features.options.length > 4) {
      features.overview.options = features.overview.options.slice(0, 3); // remove the 4th feature from menu to replace with more button
      features.overview.options.push(more_button);
    }
    return features;
  };

  return service;
});

App.controller("LayoutInviteLoginCtrl", function(
  $cordovaCamera,
  $cordovaOauth,
  $ionicActionSheet,
  $ionicLoading,
  $ionicPopup,
  $ionicScrollDelegate,
  $q,
  $rootScope,
  $scope,
  $log,
  $timeout,
  $translate,
  $window,
  Application,
  Customer,
  Dialog,
  FacebookConnect,
  SafePopups,
  HomepageLayout,
  Url
) {
  $log.debug("Hello from LayoutInviteLoginCtrl Controller");
  var WavesJS = document.createElement("script"); // visual effet on touch
  WavesJS.type = "text/javascript";
  WavesJS.src = "modules/layout/home/layout_baguera_13/waves-effect.js";
  WavesJS.onload = function() {
    $scope.loadContent();
  };
  document.body.appendChild(WavesJS);

  $scope.is_connected = false;
  $scope.display_login_form = false;
  $scope.display_account_form = false;
  $scope.display_forgot_password_form = false;
  $scope.display_privacy_policy = false;
  $scope.display_edit_form = false;
  $scope.customer = {};
  $scope.is_loading = false;
  $scope.is_logged_in = Customer.isLoggedIn();
  $scope.can_connect_with_facebook = !!Customer.can_connect_with_facebook;
  $scope.avatar_url = null;
  $scope.has_avatar = false;
  $scope.show_avatar = true;
  $scope.avatar_loaded = false;
  $scope.has_loggin_features = false;
  $scope.privacy_policy = Application.privacy_policy;
  // review
  $scope.displayReview = false;
  $scope.reviewId = "0";
  $scope.displayReviewPrompt = true;
  $scope.displayReviewLink = true;
  $scope.hostname = DOMAIN;
  // styling scope
  $scope.bgBtnColorStyle = "background-color: rgba(254, 254, 254, 0.1);";
  $scope.menuBgColorStyle = "background-color: rgba(254, 254, 254, 0.1);";
  $scope.inputTextColorStyle = "color: #000000;";
  $scope.item1ColorStyle = "background-color: rbga(255, 255, 255, 0.3);";
  $scope.item2ColorStyle = "background-color: rbga(255, 255, 255, 0.4);";
  $scope.item3ColorStyle = "background-color: rbga(255, 255, 255, 0.6);";
  $scope.item4ColorStyle = "background-color: rbga(255, 255, 255, 0.5);";
  $scope.item1TextColor = "#000000";
  $scope.item2TextColor = "#000000";
  $scope.item3TextColor = "#000000";
  $scope.item4TextColor = "#000000";

  $scope.getBgOpacity = function(hex, opacity) {
    hex = hex.replace("#", "");
    var r = parseInt(hex.substring(0, 2), 16);
    var g = parseInt(hex.substring(2, 4), 16);
    var b = parseInt(hex.substring(4, 6), 16);
    opacity = opacity > 1 ? opacity / 100 : opacity;

    return (
      "background-color: rgba(" +
      r +
      ", " +
      g +
      ", " +
      b +
      ", " +
      opacity +
      ");"
    );
  };

  $scope.getItemStyle = function(index) {
    var to_return = "";
    switch (parseInt(index)) {
      case 0:
        to_return = $scope.item1ColorStyle;
        break;
      case 1:
        to_return = $scope.item2ColorStyle;
        break;
      case 2:
        to_return = $scope.item3ColorStyle;
        break;
      case 3:
        to_return = $scope.item4ColorStyle;
        break;
      default:
        to_return = "";
        break;
    }
    return to_return;
  };

  $scope.getItemTextStyle = function(index) {
    var to_return = "";
    switch (parseInt(index)) {
      case 0:
        to_return = "color: " + $scope.item1TextColor + ";";
        break;
      case 1:
        to_return = "color: " + $scope.item2TextColor + ";";
        break;
      case 2:
        to_return = "color: " + $scope.item3TextColor + ";";
        break;
      case 3:
        to_return = "color: " + $scope.item4TextColor + ";";
        break;
      default:
        to_return = "";
        break;
    }
    return to_return;
  };

  HomepageLayout.getFeatures().then(function(features) {
    $scope.slide1Image = features.layoutOptions.slide1Image
      ? $scope.hostname + "/images/homepage_layout/layout_baguera_13/" + features.layoutOptions.slide1Image
      : "";
    $scope.slide1Text = features.layoutOptions.slide1Text;
    $scope.slide2Image = features.layoutOptions.slide2Image
      ? $scope.hostname + "/images/homepage_layout/layout_baguera_13/" + features.layoutOptions.slide2Image
      : "";
    $scope.slide2Text = features.layoutOptions.slide2Text;
    $scope.slide3Image = features.layoutOptions.slide3Image
      ? $scope.hostname + "/images/homepage_layout/layout_baguera_13/" + features.layoutOptions.slide3Image
      : "";
    $scope.slide3Text = features.layoutOptions.slide3Text;
    $scope.slideInterval = features.layoutOptions.slideInterval;
    $scope.item1TextColor = features.layoutOptions.item1TextColor;
    $scope.item2TextColor = features.layoutOptions.item2TextColor;
    $scope.item3TextColor = features.layoutOptions.item3TextColor;
    $scope.item4TextColor = features.layoutOptions.item4TextColor;
    $scope.displayReview = features.layoutOptions.displayReview == "1";
    $scope.reviewId = features.layoutOptions.reviewId;
    $scope.displayReviewPrompt =
      features.layoutOptions.displayReviewPrompt == "1";
    $scope.displayReviewLink = features.layoutOptions.displayReviewLink == "1";
    $scope.inputTextColorStyle =
      "color: " + features.layoutOptions.inputTextColor + ";";

    if (features.layoutOptions.bgColor && features.layoutOptions.bgOpacity)
      $scope.bgBtnColorStyle = $scope.getBgOpacity(
        features.layoutOptions.bgColor,
        features.layoutOptions.bgOpacity
      );

    if (
      features.layoutOptions.menuBgColor &&
      features.layoutOptions.menuBgOpacity
    ) {
      $scope.menuBgColorStyle = $scope.getBgOpacity(
        features.layoutOptions.menuBgColor,
        features.layoutOptions.menuBgOpacity
      );
    }

    if (
      features.layoutOptions.item1BgColor &&
      features.layoutOptions.item1BgOpacity
    ) {
      $scope.item1ColorStyle = $scope.getBgOpacity(
        features.layoutOptions.item1BgColor,
        features.layoutOptions.item1BgOpacity
      );
    }

    if (
      features.layoutOptions.item2BgColor &&
      features.layoutOptions.item2BgOpacity
    ) {
      $scope.item2ColorStyle = $scope.getBgOpacity(
        features.layoutOptions.item2BgColor,
        features.layoutOptions.item2BgOpacity
      );
    }

    if (
      features.layoutOptions.item3BgColor &&
      features.layoutOptions.item3BgOpacity
    ) {
      $scope.item3ColorStyle = $scope.getBgOpacity(
        features.layoutOptions.item3BgColor,
        features.layoutOptions.item3BgOpacity
      );
    }

    if (
      features.layoutOptions.item4BgColor &&
      features.layoutOptions.item4BgOpacity
    ) {
      $scope.item4ColorStyle = $scope.getBgOpacity(
        features.layoutOptions.item4BgColor,
        features.layoutOptions.item4BgOpacity
      );
    }

    if (Customer.isLoggedIn()) {
      $scope.is_logged_in = true;
      $scope.has_loggin_features = true;
      var _features = features;

      _features.overview.options = _features.overview.options.filter(function(
        el
      ) {
        return el.code !== "tabbar_account";
      });
      $scope.loggin_features = _features;
    }
  });

  $scope.hideAvatar = function() {
    $scope.show_avatar = false;
  };

  $scope.avatarLoaded = function() {
    $scope.avatar_loaded = true;
    $scope.show_avatar = true;
  };

  $scope.clickOnEdit = function() {
    $scope.display_edit_form = true;
    $scope.display_account_form = false;
    $scope.display_forgot_password_form = false;
  };

  $scope.clickOnConnexion = function() {
    $scope.display_login_form = true;
    $scope.display_account_form = false;
    $scope.display_forgot_password_form = false;
  };

  $scope.clickOnForgot = function() {
    $scope.display_login_form = false;
    $scope.display_forgot_password_form = true;
    $scope.is_loading = false;
  };

  $scope.clickOnAbort = function() {
    $scope.display_login_form = false;
    $scope.display_account_form = false;
    $scope.display_forgot_password_form = false;
  };

  $scope.clickOnAbortEdit = function() {
    $scope.display_edit_form = false;
    $scope.display_account_form = false;
    $scope.display_login_form = false;
    $scope.display_forgot_password_form = false;
  };

  $scope.clickOnPrivacyPolicy = function() {
    $scope.display_privacy_policy = true;
  };

  $scope.clickOnBackPolicy = function() {
    $scope.display_privacy_policy = false;
  };

  $scope.clickOnlogout = function() {
    $scope.is_loading = true;
    Customer.logout()
      .then(function(data) {
        FacebookConnect.logout();
        $scope.is_loading = false;
        if (data.success) {
          $scope.is_logged_in = false;
        }
      })
      .then(function() {
        $scope.is_loading = false;
        $scope.display_login_form = true;
        $scope.display_account_form = false;
        $scope.display_forgot_password_form = false;
      });
  };

  $scope.clickOnCreateAccount = function() {
    $scope.display_login_form = false;
    $scope.display_account_form = true;
    $scope.display_forgot_password_form = false;
  };

  $scope.loginSubmit = function() {
    $scope.is_loading = true;
    Customer.login($scope.customer).then(
      function(data) {
        if (data && data.success) {
          Customer.find()
            .then(function(customer) {
              $scope.customer = customer;
              $scope.is_logged_in = true;
              $scope.loadContent();
            })
            .then(function() {
              $scope.is_loading = false;
            });
        }
      },
      function(data) {
        $scope.is_loading = false;
        if (data && angular.isDefined(data.message)) {
          Dialog.alert("Error", data.message, "OK", -1);
        }
      }
    );
  };

  $scope.editAccountSubmit = function() {
    $scope.is_loading = true;
    Customer.save($scope.customer)
      .then(
        function(data) {
          if (angular.isDefined(data.message)) {
            Dialog.alert("", data.message, "OK", -1);
          }

          if (data.success) {
            $scope.display_edit_form = false;
          }
        },
        function(data) {
          if (data && angular.isDefined(data.message)) {
            Dialog.alert("Error", data.message, "OK", -1);
          }
        }
      )
      .then(function() {
        $scope.is_loading = false;
        $ionicLoading.hide();
      });
  };

  $scope.forgotPasswordSubmit = function() {
    $scope.is_loading = true;
    Customer.forgottenpassword($scope.customer.email)
      .then(
        function(data) {
          if (data && angular.isDefined(data.message)) {
            Dialog.alert("", data.message, "OK", -1);

            if (data.success) {
              $scope.display_forgot_password_form = false;
              $scope.display_login_form = true;
            }
          }
          return data;
        },
        function(data) {
          if (data && angular.isDefined(data.message)) {
            Dialog.alert("Error", data.message, "OK", -1);
          }
          return data;
        }
      )
      .then(function() {
        $scope.is_loading = false;
      });
  };

  $scope.loginWithFacebook = function() {
    if (
      (typeof IS_PREVIEWER !== "undefined" &&
        angular.isDefined(IS_PREVIEWER)) ||
      $rootScope.isOverview ||
      Application.is_webview
    ) {
      $rootScope.showMobileFeatureOnlyError();
      return;
    }
    FacebookConnect.login();
  };

  $scope.registerSubmit = function() {
    $scope.is_loading = true;
    Customer.save($scope.customer)
      .then(function(data) {
        if (angular.isDefined(data.message)) {
          Dialog.alert("", data.message, "OK", -1);
        }
        if (data.success) {
          $scope.display_login_form = false;
          $scope.display_account_form = false;
          $scope.display_forgot_password_form = false;
          $scope.is_logged_in = true;
          $scope.loginSubmit();
        }
      })
      .then(function() {
        $scope.is_loading = false;
      });
  };

  $scope.loadContent = function() {
    if (!$scope.is_logged_in) return;

    Customer.find()
      .then(function(customer) {
        $scope.customer = customer;
        $scope.customer.metadatas = _.isObject($scope.customer.metadatas)
          ? $scope.customer.metadatas
          : {};
        $scope.avatar_url = Customer.getAvatarUrl($scope.customer.id);

        return customer;
      })
      .then(function() {
        return HomepageLayout.getActiveOptions().then(function(options) {
          $scope.optional_fields = {
            ranking: !!_.find(options, { use_ranking: "1" }),
            nickname: !!_.find(options, { use_nickname: "1" })
          };
          $scope.custom_fields = [];

          _.forEach(options, function(opt) {
            var fields = _.get(opt, "custom_fields");

            if (_.isArray(fields) && fields.length > 0) {
              $scope.custom_fields.push(
                _.pick(opt, ["name", "code", "custom_fields"])
              ); // We keep a small copy of the option
              _.forEach(fields, function(field) {
                var mpath = opt.code + "." + field.key;
                _.set(
                  // We create metadata with default value if it doesn't exist
                  $scope.customer.metadatas,
                  mpath,
                  _.get($scope.customer.metadatas, mpath, field.default || null)
                );
              });
            }
          });
        });
      })
      .then(function() {
        $scope.has_avatar = true;
        $scope.display_login_form = false;
        $scope.is_logged_in = true;
        $scope.is_loading = false;
      });
  };

  $scope.editAvatar = function() {
    var buttons = [{ text: $translate.instant("Edit") }];

    if ($scope.customer.avatar != null) {
      var text =
        "Cancel " + ($scope.customer.delete_avatar ? "delete" : "edit");
      buttons.push({ text: $translate.instant(text) });
    } else {
      if ($scope.customer.is_custom_image) {
        buttons.push({ text: $translate.instant("Delete") });
      }
    }

    var hideSheet = $ionicActionSheet.show({
      buttons: buttons,
      cancelText: $translate.instant("Cancel"),
      cancel: function() {
        hideSheet();
      },
      buttonClicked: function(index) {
        if (index == 0) {
          // We have to use timeout, if we do not,
          // next action sheet will loose focus after 400ms
          // because of the closing one. For more details,
          // see this : https://github.com/driftyco/ionic/blob/1.x/js/angular/service/actionSheet.js#L138
          $timeout($scope.takePicture, 600);
        }
        if (index == 1) {
          if ($scope.customer.avatar != null) {
            // Cancel edit/delete :
            $scope.customer.avatar = null;
            $scope.customer.delete_avatar = false;
            $scope.avatar_url = Customer.getAvatarUrl($scope.customer.id);
          } else {
            $scope.customer.avatar = false;
            $scope.customer.delete_avatar = true;
            $scope.avatar_url = Customer.getAvatarUrl($scope.customer.id, {
              ignore_stored: true
            });
          }
        }
        return true;
      }
    });
  };

  $scope.takePicture = function(field) {
    var gotImage = function(image_url) {
      // TODO: move all picture taking and cropping modal
      // into a dedicated service for consistence against modules
      $scope.cropModal = { original: image_url, result: null };

      // DO NOT REMOVE popupShowing !!!
      // img-crop directive doesn't work if it has been loaded off screen
      // We show the popup, then switch popupShowing to true, to add
      // img-crop in the view.
      $scope.popupShowing = false;
      $ionicPopup
        .show({
          template:
            '<div style="position: absolute" class="cropper"><img-crop ng-if="popupShowing" image="cropModal.original" result-image="cropModal.result" area-type="square" result-image-size="256" result-image-format="image/jpeg" result-image-quality="0.9"></img-crop></div>',
          cssClass: "avatar-crop",
          scope: $scope,
          buttons: [
            {
              text: $translate.instant("Cancel"),
              type: "button-default",
              onTap: function(e) {
                return false;
              }
            },
            {
              text: $translate.instant("OK"),
              type: "button-positive",
              onTap: function(e) {
                return true;
              }
            }
          ]
        })
        .then(function(result) {
          if (result) {
            $scope.cropModalCtrl = null;
            $scope.avatar_url = $scope.cropModal.result;
            $scope.customer.avatar = $scope.cropModal.result;
            $scope.customer.delete_avatar = false;
          }
        });
      $scope.popupShowing = true;
    };

    var gotError = function(err) {
      // An error occured. Show a message to the user
    };

    if (Application.is_webview) {
      var input = angular.element("<input type='file' accept='image/*'>");
      var selectedFile = function(evt) {
        var file = evt.currentTarget.files[0];
        var reader = new FileReader();
        reader.onload = function(evt) {
          gotImage(evt.target.result);
          input.off("change", selectedFile);
        };
        reader.onerror = gotError;
        reader.readAsDataURL(file);
      };
      input.on("change", selectedFile);
      input[0].click();
    } else {
      var source_type = Camera.PictureSourceType.CAMERA;

      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          { text: $translate.instant("Take a picture") },
          { text: $translate.instant("Import from Library") }
        ],
        cancelText: $translate.instant("Cancel"),
        cancel: function() {
          hideSheet();
        },
        buttonClicked: function(index) {
          if (index == 0) {
            source_type = Camera.PictureSourceType.CAMERA;
          }
          if (index == 1) {
            source_type = Camera.PictureSourceType.PHOTOLIBRARY;
          }

          var options = {
            quality: 90,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: source_type,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 256,
            targetHeight: 256,
            correctOrientation: true,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
            gotImage("data:image/jpeg;base64," + imageData);
          }, gotError);

          return true;
        }
      });
    }
  };

  function updateScopeOnAuthEvent() {
    $scope.is_loading = true;
    Customer.find()
      .then(function(customer) {
        HomepageLayout.getFeatures().then(function(features) {
          if (Customer.isLoggedIn()) {
            $scope.is_logged_in = true;
            $scope.has_loggin_features = true;
            var _features = features;

            _features.options = _features.options.filter(function(el) {
              return el.code !== "tabbar_account";
            });
            $scope.loggin_features = _features;
          } else {
            $scope.is_logged_in = false;
            $scope.has_loggin_features = false;
          }
        });
        if (customer.length === 0) {
          customer = { email: "", password: "" };
        }
        $scope.customer = customer;
        $scope.customer.metadatas = _.isObject($scope.customer.metadatas)
          ? $scope.customer.metadatas
          : {};
        $scope.avatar_url = Customer.getAvatarUrl($scope.customer.id);
        $scope.has_avatar = true;

        return customer;
      })
      .then(function() {
        $scope.is_loading = false;
      });
  }

  $rootScope.$on("auth-login-success", function() {
    $log.debug("auth-login-success");
    updateScopeOnAuthEvent();
  });

  $rootScope.$on("auth-logout-success", function() {
    $log.debug("auth-logout-success");
    updateScopeOnAuthEvent();
  });

  $rootScope.$on("auth-register-success", function() {
    $log.debug("auth-register-success");
    updateScopeOnAuthEvent();
  });

  $scope.loadContent();
});
