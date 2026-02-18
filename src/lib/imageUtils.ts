/**
 * Client-side image optimization utility.
 * Resizes images to target dimensions with high quality before upload.
 */

interface ResizeOptions {
    maxWidth: number;
    maxHeight: number;
    quality?: number; // 0-1, default 0.92
    format?: 'image/webp' | 'image/jpeg';
    mode?: 'cover' | 'contain'; // cover = fill & crop, contain = fit within
}

/**
 * Resize and optimize an image file on the client before uploading.
 * - `cover` mode: fills the target dimensions exactly, cropping excess (ideal for banners)
 * - `contain` mode: fits within the target dimensions, preserving aspect ratio (ideal for products)
 */
export function resizeImage(file: File, options: ResizeOptions): Promise<File> {
    const {
        maxWidth,
        maxHeight,
        quality = 0.92,
        format = 'image/webp',
        mode = 'cover',
    } = options;

    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            let drawWidth: number;
            let drawHeight: number;
            let offsetX = 0;
            let offsetY = 0;
            let canvasWidth = maxWidth;
            let canvasHeight = maxHeight;

            if (mode === 'cover') {
                // Fill the exact target dimensions, crop the excess
                const scale = Math.max(maxWidth / img.width, maxHeight / img.height);
                drawWidth = img.width * scale;
                drawHeight = img.height * scale;
                offsetX = (maxWidth - drawWidth) / 2;
                offsetY = (maxHeight - drawHeight) / 2;
            } else {
                // Contain: fit image within bounds, keep aspect ratio
                const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
                drawWidth = img.width * scale;
                drawHeight = img.height * scale;
                canvasWidth = Math.round(drawWidth);
                canvasHeight = Math.round(drawHeight);
                offsetX = 0;
                offsetY = 0;
            }

            const canvas = document.createElement('canvas');
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Canvas not supported'));
                return;
            }

            // High quality rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

            canvas.toBlob(
                (blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob'));
                        return;
                    }
                    const ext = format === 'image/webp' ? 'webp' : 'jpg';
                    const resizedFile = new File([blob], `optimized.${ext}`, { type: format });
                    resolve(resizedFile);
                },
                format,
                quality
            );
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
}

/** Preset: Banner image — exactly 1280x400, cover mode, high quality */
export function resizeBannerImage(file: File): Promise<File> {
    return resizeImage(file, {
        maxWidth: 1280,
        maxHeight: 400,
        quality: 0.95,
        format: 'image/webp',
        mode: 'cover',
    });
}

/** Preset: Product image — max 800x800, contain mode, high quality */
export function resizeProductImage(file: File): Promise<File> {
    return resizeImage(file, {
        maxWidth: 800,
        maxHeight: 800,
        quality: 0.92,
        format: 'image/webp',
        mode: 'contain',
    });
}
