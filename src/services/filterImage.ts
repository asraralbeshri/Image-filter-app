import fs from 'fs';
import Jimp = require('jimp');

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string, color: number): Promise<string> {

    console.log(color);
    //Filter image with greyscale color
    if (color == 1) {
        return new Promise(async resolve => {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const photo = await Jimp.read(inputURL);
            const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            await photo
                //.resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .greyscale()// set greyscale
                .write(__dirname + outpath, (img) => {
                    resolve(__dirname + outpath);
                    console.log(__dirname);
                });
        });
    }
    //Filter image with red color
    else if (color == 2) {
        return new Promise(async resolve => {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const photo = await Jimp.read(inputURL);
            const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            await photo
                //.resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .color([{ apply: 'red', params: [50] }])// set greyscale
                .write(__dirname + outpath, (img) => {
                    resolve(__dirname + outpath);
                });
        });
    }
    //Filter image with blue color
    else if (color == 3) {
        return new Promise(async resolve => {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const photo = await Jimp.read(inputURL);
            const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            await photo
                //.resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .color([{ apply: 'blue', params: [50] }])// set greyscale
                .write(__dirname + outpath, (img) => {
                    resolve(__dirname + outpath);
                });
        });
    }
    //Filter image with green color
    else if (color == 4) {
        return new Promise(async resolve => {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
            const photo = await Jimp.read(inputURL);
            const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
            await photo
                //.resize(256, 256) // resize
                .quality(60) // set JPEG quality
                .color([{ apply: 'green', params: [50] }])// set greyscale
                .write(__dirname + outpath, (img) => {
                    resolve(__dirname + outpath);
                });
        });
    }

}
//Add text to the image
export async function addTextToImage(inputURL: string, caption: string, txt_color: number): Promise<string> {
    //Determin the font type
    var font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
    if (txt_color == 1) {
        font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    }
    return new Promise(async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        await photo
            .resize(456, 456) // resize
            .quality(60) // set JPEG quality
            .blur(3) // set image blur 
            .print(font, photo.bitmap.width / 2 - 40, 50, caption, 30) // add text
            .write(__dirname + outpath, (img) => {
                resolve(__dirname + outpath);
            });
    });
}
//Resize the image 
export async function resizeImage(inputURL: string, width: number, height: number): Promise<string> {
    return new Promise(async resolve => {
        const w: number = width;
        const h: number = height;
        const photo = await Jimp.read(inputURL);
        const outpath = '/tmp/filtered.' + Math.floor(Math.random() * 2000) + '.jpg';
        await photo
            .resize(w, h) // resize
            .quality(60) // set JPEG quality
            .write(__dirname + outpath, (img) => {
                resolve(__dirname + outpath);
            });
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
    for (let file of files) {
        console.log(file);
        fs.unlinkSync(file);
        console.log("The files are deleted ..")
    }
}
