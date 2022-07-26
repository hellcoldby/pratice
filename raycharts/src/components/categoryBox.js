import * as zrender from 'zrender';
import { Group, Rect } from '../shape';
import { G_NAME, G_INDEX } from '../utils/common';

function categoryBox(config) {
    const {
        name: BaseName,
        maxSize: [maxWidth, maxHeight],
        offsetY: [upperOffsetY],
        _baseZ,
    } = config;

    const categoryBox = new Rect({
        name: `${G_NAME.hoverGuide} HoverPanel ${BaseName}`,
        z: _baseZ || G_INDEX.hover,
        shape: {
            width: maxWidth,
            height: maxHeight,
            x: -maxWidth / 2,
            y: -(maxHeight - upperOffsetY),
        },
        style: {
            fill: 'transparent',
        },
    });
    // .on('click', ({ target }) => console.log(target?.name));
    return categoryBox;
}

export default categoryBox;
