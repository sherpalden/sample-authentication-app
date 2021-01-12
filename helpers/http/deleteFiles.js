const fs = require('fs');

const deleteSingleFile = (filePath) => {
	return new Promise((resolve, reject) => {
		fs.unlink(filePath, (err) => {
			if(err && err.code == 'ENOENT') {
				reject(err);
			} 
			else if (err) {
				reject(err);
			} 
			else {
				resolve();
			}
		})
	})
}

const deleteMultipleFiles = (filePaths) => {
	return new Promise((resolve, reject) => {
		let allFileExists = true;
		let notFoundFiles = [];
		filePaths.forEach(filePath => {
			if (!fs.existsSync(filePath)) {
				allFileExists = false;
				notFoundFiles.push(filePath);
			}
		})
		if(allFileExists) {
			for(const filePath of filePaths) {
				fs.unlink(filePath, err => {
					if(err){
						reject(err);
					}
				});
			}
			resolve();
		}
		else {
			reject({'error':"Files not found",'files': notFoundFiles})
		}
	})
}

const deleteFiles =  (filePaths) => {
    return new Promise((resolve, reject) => {
        for(filePath of filePaths){
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, err => {
                    if(err){
                        reject(err);
                    }
                });
            }
        }
        resolve();
    })
}

const deleteFile =  (filePath) => {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, err => {
                if(err){
                    reject(err);
                }
            });
        }
    resolve();
    })
}

module.exports = {
	deleteSingleFile,
	deleteMultipleFiles,
	deleteFiles,
	deleteFile
}
















