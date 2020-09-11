/**
 *
 * layout_baguera_14 example
 *
 * All the following functions are required in order for the Layout to work
 */
App.service("layout_baguera_14", function($rootScope, HomepageLayout) {
  var service = {};

  /**
   * Must return a valid template
   *
   * @returns {string}
   */
  service.getTemplate = function() {
    return "modules/layout/home/layout_baguera_14/view.html";
  };

  /**
   * Must return a valid template
   *
   * @returns {string}
   */
  service.getModalTemplate = function() {
    // return "templates/home/l10/modal.html";
    return "modules/layout/home/layout_baguera_14/modal.html";
  };

  /**
   * onResize is used for css/js callbacks when orientation change
   */
  service.onResize = function() {
    /** Do nothing for this particular one */
  };

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
    return features;
  };

  return service;
});

App.controller("LayoutBaguera14Controller", function(
  $scope,
  $log,
  $location,
  $timeout,
  Application,
  HomepageLayout,
  LayoutBaguera14State
) {
  $log.debug("hello from LayoutBaguera14Controller");

  // general layout options
  $scope.vm = {
    features: [],
    banner_header_text: "",
    banner_see_more_text: "See more",
    banner_skip_text: "Skip",
    homepage_header_text: "",
    banner_see_more_feature_number: 1,
    banner_enabled: 1,
    banner_force_reload: 0,
    layout_version: 0,
    sections: [],
    state: LayoutBaguera14State.get(),
    style: {
      // css layouts options
      homepage_display_icons: 1,
      text_direction: "ltr",
      banner_background_image: "",
      banner_header_text_color: "#000000",
      banner_see_more_text_color: "#000000",
      banner_see_more_background_color: "#bf0d02",
      banner_skip_text_color: "#000000",
      banner_skip_background_color: "#f79400",
      banner_background_color: "#ffffff",
      homepage_header_text_color: "#000000",
      homepage_sections_text_color: "#000000",
      homepage_section_style: "triangles",
      homepage_sections_background_color: "#ffffff"
    }
  };

  // retreive layout options & features list
  HomepageLayout.getFeatures().then(function(features) {
    // general param
    $scope.vm.banner_enabled = parseInt(features.layoutOptions.banner_enabled);
    $scope.vm.banner_force_reload = parseInt(
      features.layoutOptions.banner_force_reload
    );
    $scope.vm.banner_header_text = features.layoutOptions.banner_header_text;
    $scope.vm.layout_version = features.layoutOptions.layout_version;
    $log.debug("layout version:", $scope.vm.layout_version);
    $scope.vm.banner_see_more_text =
      features.layoutOptions.banner_see_more_text;
    $scope.vm.banner_skip_text = features.layoutOptions.banner_skip_text;
    $scope.vm.homepage_header_text =
      features.layoutOptions.homepage_header_text;
    $log.debug("header text:", $scope.vm.homepage_header_text);
    $scope.vm.banner_see_more_feature_number = parseInt(
      features.layoutOptions.banner_see_more_feature_number
    );
    if (isNaN($scope.vm.banner_see_more_feature_number)) {
      $scope.vm.banner_see_more_feature_number = 1;
    }
    $log.debug(
      "feature choosen number",
      $scope.vm.banner_see_more_feature_number
    );

    // retriving sections list for in menu separation between feature
    var tmp_section_names_csv = features.layoutOptions.section_names_csv;
    var tmp_section_indexes_csv = features.layoutOptions.section_indexes_csv;
    if (tmp_section_names_csv && tmp_section_indexes_csv) {
      var section_names = tmp_section_names_csv.split(",");
      var section_indexes = tmp_section_indexes_csv.split(",");
    } else {
      var section_names = [];
      var section_indexes = [];
    }

    var section_list = [];
    if (
      section_indexes.length == section_names.length &&
      section_indexes.length > 0
    ) {
      for (var i = 0; i < section_names.length; i++) {
        section_list.push({
          name: section_names[i],
          index: section_indexes[i]
        });
      }
    }
    $scope.vm.sections = section_list;
    $log.debug(section_list);
    var feature_list = features.overview.options
      ? JSON.parse(JSON.stringify(features.overview.options))
      : [];
    $scope.vm.features = feature_list;

    // style css param
    $scope.vm.style.banner_background_image = features.layoutOptions
      .banner_background_image
      ? DOMAIN +
        "/images/homepage_layout/layout_baguera_14/" +
        features.layoutOptions.banner_background_image
      : "";

    $scope.vm.style.homepage_display_icons = parseInt(
      features.layoutOptions.homepage_display_icons
    );
    $scope.vm.style.homepage_section_style =
      features.layoutOptions.homepage_section_style;
    if ($scope.vm.style.homepage_section_style == "ss-style-transparent") {
      $scope.vm.style.homepage_sections_background_color = "transparent";
    } else {
      $scope.vm.style.homepage_sections_background_color =
        features.layoutOptions.homepage_sections_background_color;
    }
    $scope.vm.style.banner_header_text_color =
      features.layoutOptions.banner_header_text_color;
    $scope.vm.style.banner_see_more_text_color =
      features.layoutOptions.banner_see_more_text_color;
    $scope.vm.style.banner_see_more_background_color =
      features.layoutOptions.banner_see_more_background_color;
    $scope.vm.style.banner_skip_text_color =
      features.layoutOptions.banner_skip_text_color;
    $scope.vm.style.text_direction = features.layoutOptions.text_direction;
    $scope.vm.style.banner_skip_background_color =
      features.layoutOptions.banner_skip_background_color;
    $scope.vm.style.banner_background_color =
      features.layoutOptions.banner_background_color;
    $scope.vm.style.homepage_header_text_color =
      features.layoutOptions.homepage_header_text_color;
    $scope.vm.style.homepage_sections_text_color =
      features.layoutOptions.homepage_sections_text_color;
    $scope.vm.style.banner_header_text_align = verticalAligmmentCssStyle(
      features.layoutOptions.banner_header_text_align
    );
    $scope.vm.style.homepage_menu_align = horizontalAligmmentCssStyle(
      features.layoutOptions.homepage_menu_align
    );
    $scope.vm.style.homepage_section_align = horizontalAligmmentCssStyle(
      features.layoutOptions.homepage_section_align
    );

    LayoutBaguera14State.loadLocalForage().then(function(state) {
      if (state !== null) {
        var tmp_state = LayoutBaguera14State.get();
        if (
          $scope.vm.banner_force_reload &&
          $scope.vm.layout_version > tmp_state.version
        ) {
          LayoutBaguera14State.set({
            version: $scope.vm.layout_version,
            skipped: false,
            opened: false
          });
        }
        $scope.vm.state = LayoutBaguera14State.get();
      }
    });
  });

  /*
   * Create css style for vertical alignment (using flexbox)
   */
  function verticalAligmmentCssStyle(align) {
    switch (align) {
      case "bottom":
        return "align-items: flex-end;";
        break;
      case "middle":
        return "align-items: center;";
        break;
      case "top":
        return "align-items: flex-start;";
        break;
      default:
        return "";
    }
  }

  /*
   * Create css style for horizontal alignment (using flexbox)
   */
  function horizontalAligmmentCssStyle(align) {
    switch (align) {
      case "right":
        return "align-items: flex-end;";
        break;
      case "center":
        return "align-items: center;";
        break;
      case "left":
        return "align-items: flex-start;";
        break;
      default:
        return "";
    }
  }

  function goToUrl(path) {
    $location.path(path);
  }

  // ensure index is within features array
  // convert index starting to 1 to starting to zero
  function safeFeatureIndex(features, wanted_index) {
    if (wanted_index <= 0 || wanted_index > features.length) {
      wanted_index = 0;
    } else {
      wanted_index = wanted_index - 1;
    }
    return wanted_index;
  }

  $scope.getSection = function(index) {
    for (var i = 0; i < $scope.vm.sections.length; i++) {
      if (parseInt($scope.vm.sections[i].index) - 1 == index) {
        return $scope.vm.sections[i];
      }
    }
    return false;
  };

  $scope.clickOnSkip = function() {
    LayoutBaguera14State.set({
      skipped: true,
      opened: $scope.vm.state.opened,
      version: $scope.vm.state.version
    });
    $scope.vm.state = LayoutBaguera14State.get();
    LayoutBaguera14State.saveLocalForage().catch(function(err) {
      $log.debug(
        "error while trying to save layout option to localforage",
        err
      );
    });
  };

  $scope.clickOnSeeMore = function() {
    LayoutBaguera14State.set({
      skipped: $scope.vm.state.skipped,
      version: $scope.vm.state.version,
      opened: true
    });
    $scope.vm.state = LayoutBaguera14State.get();
    var safe_feature_index = safeFeatureIndex(
      $scope.vm.features,
      $scope.vm.banner_see_more_feature_number
    );
    goToUrl($scope.vm.features[safe_feature_index].path);
    // LayoutBaguera14State.saveLocalForage()
    //   .then(function() {
    //
    //   })
    //   .catch(function(err) {
    //     $log.debug(
    //       "error while trying to save layout option to localforage",
    //       err
    //     );
    //   });
  };
});
