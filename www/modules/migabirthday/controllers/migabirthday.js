App.config(function($stateProvider) {
    $stateProvider.state('migabirthday-view', {
        url: BASE_PATH + "/migabirthday/mobile_view/index/value_id/:value_id",
        controller: 'MigabirthdayViewController',
        cache: false,
        templateUrl: 'modules/migabirthday/templates/l1/view.html'
    });

}).controller('MigabirthdayViewController', function($scope, $stateParams, Migabirthday,
                                                     Customer, Dialog, Loader, $state, $translate) {
    $scope.is_loading = true;
    $scope.page_title = "Migabirthday";
    $scope.is_logged_in = Customer.isLoggedIn();
    $scope.status = false;
    $scope.birthday_info = {};
    //date drop downs work
    $scope.days = [{
        id: '',
        name: $translate.instant('Day')
    }];
    for(d = 1; d <= 31; d++) {
        $scope.days.push({id: d, name: d});
    }
    $scope.months = [{
        id: '',
        name: $translate.instant('Month')
      }, {
        id: '01',
        name: $translate.instant('January')
      }, {
        id: '02',
        name: $translate.instant('February')
      }, {
        id: '03',
        name: $translate.instant('March')
      }, {
        id: '04',
        name: $translate.instant('April')
      }, {
        id: '05',
        name: $translate.instant('May')
      }, {
        id: '06',
        name: $translate.instant('June')
      }, {
        id: '07',
        name: $translate.instant('July')
      }, {
        id: '08',
        name: $translate.instant('August')
      }, {
        id: '09',
        name: $translate.instant('September')
      }, {
        id: '10',
        name: $translate.instant('October')
      }, {
        id: '11',
        name: $translate.instant('November')
      }, {
        id: '12',
        name: $translate.instant('December')
      }];
      $scope.today = new Date();
      $scope.start_year = 1920;
      $scope.max_year = new Date($scope.today.setFullYear($scope.today.getFullYear() - 12)).getFullYear();
      $scope.years = [{
        id: '',
        name: $translate.instant('Year')
      }]; 
      for (y = $scope.start_year; y <= $scope.max_year; y++) {
        $scope.years.push({ id: y, name: y });
      }

    $scope.loadContent = function() {
        Migabirthday
        .load($stateParams.value_id)
        .success(function(data) {
            $scope.birthday_info = data;
        }).finally(function() {
            $scope.is_loading = false;
        });
    };

    $scope.updateDOB = function () {
        $scope.is_loading = true;
        Loader.show();
        Migabirthday.update($stateParams.value_id, $scope.birthday_info.day, $scope.birthday_info.month, $scope.birthday_info.year).success(function(data) {
            Dialog.alert('Success', 'D.O.B updated successfully.', 'OK');
            $scope.loadContent();
        }).error(function onError(data) {
            Dialog.alert('Error', data.message, 'OK');
        }).finally(function() {
            $scope.is_loading = false;
            Loader.hide();
        });
    };

    $scope.openProfile = function (value_id) {
        $state.go('extendedprofile-view', {value_id: value_id});
    };

    $scope.loadContent();
});