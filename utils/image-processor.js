
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

class ImageProcessor {
    static async processImageToSticker(inputBuffer, options = {}) {
        try {
            const {
                width = 512,
                height = 512,
                quality = 90
            } = options;

            const processedBuffer = await sharp(inputBuffer)
                .resize(width, height, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .webp({ quality })
                .toBuffer();

            return processedBuffer;
        } catch (error) {
            throw new Error(`Image processing failed: ${error.message}`);
        }
    }

    static async convertStickerToImage(inputBuffer, format = 'png') {
        try {
            let processedBuffer;
            
            if (format === 'jpg' || format === 'jpeg') {
                processedBuffer = await sharp(inputBuffer)
                    .jpeg({ quality: 90 })
                    .toBuffer();
            } else {
                processedBuffer = await sharp(inputBuffer)
                    .png()
                    .toBuffer();
            }

            return processedBuffer;
        } catch (error) {
            throw new Error(`Sticker conversion failed: ${error.message}`);
        }
    }

    static async processVideoFrame(inputBuffer) {
        try {
            // For video thumbnails or first frames
            const processedBuffer = await sharp(inputBuffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 0 }
                })
                .webp({ quality: 90 })
                .toBuffer();

            return processedBuffer;
        } catch (error) {
            throw new Error(`Video frame processing failed: ${error.message}`);
        }
    }
}

module.exports = ImageProcessor;
