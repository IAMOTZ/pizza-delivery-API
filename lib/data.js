const fs = require('fs');
const path = require('path');

const lib = {};

// Base directory for data storing.
lib.baseDataDir = path.normalize(`${__dirname}/../.data`);

// Method for writing to a new file.
lib.create = (directory, fileName, data, callBack) => {
  const filePath = `${lib.baseDataDir}/${directory}/${fileName}.json`;
  fs.open(filePath, 'wx', (err, fileDescriptor) => {
    if (!err) {
      const stringifiedData = JSON.stringify(data);
      fs.writeFile(fileDescriptor, stringifiedData, (err) => {
        if (!err) {
          fs.close(fileDescriptor, (err) => {
            if (!err) {
              callBack(false);
            } else {
              callbackify('Error closing an opened file');
            }
          });
        } else {
          callBack('Error writing to a new file');
        }
      });
    } else {
      callBack('Error opening a new file');
    }
  })
};

// Method for updating an existing file
lib.update = (directory, fileName, data, callBack) => {
  const filePath = `${lib.baseDataDir}/${directory}/${fileName}.json`;
  fs.open(filePath, 'r+', (err, fileDescriptor) => {
    if (!err) {
      fs.truncate(fileDescriptor, (err) => {
        if (!err) {
          const stringifiedData = JSON.stringify(data);
          fs.writeFile(fileDescriptor, stringifiedData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callBack(false);
                } else {
                  callbackify('Error closing an opened file');
                }
              });
            } else {
              callBack('Error writing to a file');
            }
          });
        } else {
          callBack('Error truncating a file');
        }
      });
    } else {
      callBack('Error opening a file');
    }
  });
};

// Method for reading the content of a file.
lib.read = (directory, fileName, callBack) => {
  const filePath = `${lib.baseDataDir}/${directory}/${fileName}.json`;
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (!err) {
      callBack(false, JSON.parse(data));
    } else {
      callBack('Error reading from a file');
    }
  });
};

// Method for deleting a file.
lib.delete = (directory, fileName, callBack) => {
  const filePath = `${lib.baseDataDir}/${directory}/${fileName}.json`;
  fs.unlink(filePath, (err) => {
    if (!err) {
      callBack(false);
    } else {
      callBack('Error deleting a file, it might not exist');
    }
  });
};

module.exports = lib;