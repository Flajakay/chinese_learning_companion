const dataService = require('../services/DataService');

const dataHandlers = {
  'get-app-data-path': () => {
    return dataService.getAppDataPath();
  },

  'save-data': (event, key, data) => {
    return dataService.saveData(key, data);
  },

  'load-data': (event, key) => {
    return dataService.loadData(key);
  }
};

module.exports = dataHandlers;
