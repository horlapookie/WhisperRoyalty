
import sharp from 'sharp';

export class ImageProcessor {
    static async processSticker(buffer) {
        try {
            // Process sticker with Sharp
            const processedBuffer = await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .jpeg({ quality: 90 })
                .toBuffer();
            
            return processedBuffer;
        } catch (error) {
            console.log('Sharp processing failed, using original buffer:', error.message);
            return buffer;
        }
    }
    
    static async resizeImage(buffer, width = 512, height = 512) {
        try {
            const processedBuffer = await sharp(buffer)
                .resize(width, height, {
                    fit: 'contain',
                    background: { r: 255, g: 255, b: 255, alpha: 1 }
                })
                .jpeg({ quality: 90 })
                .toBuffer();
            
            return processedBuffer;
        } catch (error) {
            console.log('Image resize failed, using original:', error.message);
            return buffer;
        }
    }
    
    static async optimizeForSticker(buffer) {
        try {
            // Optimize image specifically for sticker format
            const processedBuffer = await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp({ quality: 80 })
                .toBuffer();
            
            return processedBuffer;
        } catch (error) {
            console.log('Sticker optimization failed, using original:', error.message);
            return buffer;
        }
    }
}
