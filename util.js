const excel = require('excel');
const bwipjs = require('bwip-js');
const AdmZip = require('adm-zip');

const util= {
    getRecords: (filename) => {
        return new Promise((resolve, reject) => {
            excel(filename, function (err, data) {
                if(err) 
                    reject(err);
                data.shift();
                let records= data.map((row)=> {
                    return {filename: `${row[2]}.png`, data:`${row[0]},${row[1]},${row[2]},${row[3]}`};
                });

                resolve(records);

            });
        });
    },
    getPngBuffer: (args, filename) => {
        return new Promise((resolve, reject) => {
            bwipjs.toBuffer(args, (err, png) => {
                if (err) 
                    reject(err);

                resolve({file: filename, pngBuffer: png});
            });
        });
    },
    zip: (pngBufferArray) => {
        let zip = new AdmZip();

        for (let i = 0; i < pngBufferArray.length; i++) {
            zip.addFile(pngBufferArray[i].file, pngBufferArray[i].pngBuffer);
        }
        let zipFile = zip.toBuffer();
        zip.writeZip('barcodes.zip');
    }

}

module.exports = util;