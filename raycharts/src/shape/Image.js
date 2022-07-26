import * as zrender from 'zrender';
import { image2Base } from '../utils';

class zImage extends zrender.Image {
    constructor(opts, type = true) {
        const imageURL = opts?.style?.image ?? '';
        if (type === true && imageURL.includes('http')) {
            image2Base(imageURL)
                .then((res) => {
                    this.attr('style', { image: res });
                    // console.log(res, this);
                })
                .catch((err) => {
                    this.attr('style', { image: imageURL });
                    console.log(err);
                });
            delete opts.style.image;
        }
        super(opts);
    }
}

export default zImage;
