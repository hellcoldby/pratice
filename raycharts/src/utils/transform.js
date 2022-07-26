const cacheMap = new Map();

function image2Base(imageURL) {
    return new Promise((resolve, reject) => {
        // cache
        if (cacheMap.has(imageURL)) {
            resolve(cacheMap.get(imageURL));
            return;
        }

        // init
        const downloadedImg = new Image();
        downloadedImg.crossOrigin = 'Anonymous';

        // callback
        const imageReceived = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');

            canvas.width = downloadedImg.width;
            canvas.height = downloadedImg.height;

            context.drawImage(downloadedImg, 0, 0);

            try {
                const Base64 = canvas.toDataURL('image/png');
                cacheMap.set(imageURL, Base64);
                resolve(Base64);
                return;
            } catch (err) {
                reject(err);
            }
        };

        // bind
        downloadedImg.addEventListener('load', imageReceived, false);

        // Error
        downloadedImg.onerror = () => reject('Image load ERROR');

        // trigger
        downloadedImg.src = imageURL;
    });
}

export { image2Base };
