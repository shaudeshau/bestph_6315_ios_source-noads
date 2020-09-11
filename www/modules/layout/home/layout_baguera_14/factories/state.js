App.factory("LayoutBaguera14State", function($log, Application) {
  $log.debug('hello from LayoutBaguera14State')
  var state = {
    skipped: false,
    opened: false,
    version: 0
  };
  var app_id = Application.app_id;
  $log.debug("app id: ", Application.app_id)

  return {
    loadLocalForage: function (opened) {
      return new Promise(function (resolve, reject)
      {
        localforage.getItem('app_'+ app_id + '_layout_baguera_14_banner_opened')
        .then(function (value) {
          if (value !== null) {
            var new_state = JSON.parse(value)
            state.skipped = new_state.skipped;
            state.opened = new_state.opened;
            state.version = new_state.version;
            resolve(new_state)
          }
          resolve(value)
        })
        .catch(function (err) {
          reject(err)
        })
      })
    },
    saveLocalForage: function () {
      return new Promise(function (resolve, reject)
      {
        localforage.setItem('app_'+ app_id + '_layout_baguera_14_banner_opened', JSON.stringify(state))
        .then(function (value) {
          resolve(value)
        })
        .catch(function (err) {
          reject(err)
        })
      })
    },
    get: function () {
      return {
        skipped: state.skipped,
        opened: state.opened,
        version: state.version
      };
    },
    set: function (new_state) {
      state.skipped = new_state.skipped;
      state.opened = new_state.opened;
      state.version = new_state.version;
    }
  };
});
