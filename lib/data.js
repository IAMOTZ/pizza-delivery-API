const fs = require('fs');
const path = require('path');

const lib = {};

// Base directory for data storing.
lib.baseDataDir = path.normalize(`${__dirname}/../.data`);

// For writing to a new file.
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

lib.update = () => { };

lib.read = () => { };

lib.delete = () => { };

module.exports = lib;


// Testing the methods
lib.create('users', 'tunmise', {name: 'lanre'}, (err) => {
  if(!err) {
    console.log('File writing successful');
  } else {
    console.log('File writing failed', err);
  }
});