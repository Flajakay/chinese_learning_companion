const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class DataService {
  constructor() {
    this.appDataPath = app.getPath('userData');
    this.ensureDataDirectory();
  }

  ensureDataDirectory() {
    if (!fs.existsSync(this.appDataPath)) {
      fs.mkdirSync(this.appDataPath, { recursive: true });
    }
  }

  loadData(key) {
    try {
      const filePath = path.join(this.appDataPath, `${key}.json`);
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        return { success: true, data: JSON.parse(data) };
      }
      return { success: false, error: 'File not found' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  saveData(key, data) {
    try {
      const filePath = path.join(this.appDataPath, `${key}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  getAppDataPath() {
    return this.appDataPath;
  }
}

module.exports = new DataService();
