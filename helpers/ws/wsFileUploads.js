"use strict";
//files transfer and upload
const fs = require('fs');
const path = require('path');
const files = {}; 
const uploadFile =  (filePath, data, cb) => {
    if(!files[data.name]){
        //new file event triggered
        // console.log("new event triggered")
        const fileExt = path.extname(data.name);
        data.name = data.name.split('.')[0] + '-' + Date.now() + fileExt;
        files[data.name] = Object.assign(
            {}, 
            { name: null, type: null, size: 0, data: [], slice: 0, wStream: null },
            data
        ); 
        files[data.name].data = []; 
        files[data.name].wStream = fs.createWriteStream(`${filePath}/${data.name}`, {flags:'a'});  
    }
    //convert the ArrayBuffer to Buffer 
    let bufferData = new Buffer.from( new Uint8Array(data.data)); 
    //save the data 
    files[data.name].wStream.write(bufferData); 
    
    //logic to request for next slice
    if(files[data.name].slice * 100000 < files[data.name].size){
        files[data.name].slice++;
        cb(null,
            { 
                isFinish: false,
                currentSlice: files[data.name].slice,
                name: files[data.name].name,
            }
        )
    }
    else {
        // console.log(files);
        const filename = files[data.name].name;
        delete files[data.name];
        cb(null,
            { 
                isFinish: true,
                name: filename
            }
        )
    }
}


module.exports = {
    uploadFile,
}
