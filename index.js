const util = require('./util');
const argv = require('yargs').argv;
const Ora = require('ora');
const spinner = new Ora({text: 'generating barcodes...' });

const BARCODE_TYPE = 'pdf417';

if (!argv.f) {
    spinner.fail('ERROR: missing args. Use node --f [FILENAME]');
} else {
    spinner.start();
    util.getRecords(argv.f)
        .then((records) => {
            let barcodePromise = [];

            records.forEach((record) => {
                let args = {};
                args.bcid = BARCODE_TYPE;
                args.text = record.data;

                barcodePromise.push(util.getPngBuffer(args, record.filename));
            });

            Promise.all(barcodePromise)
                .then((pngBufferArray) => {
                    util.zip(pngBufferArray);

                    spinner.succeed('Download Complete!');
                    spinner.stop();

                })
                .catch((err) => {
                    spinner.fail(`ERROR: failed to generate pngs -> ${err}`);
                });
        })
        .catch((err) => {
            spinner.fail(`ERROR: could not read the excel file -> ${err}`);
        });

    
}