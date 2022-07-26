export function flexBoxLayout(type) {
    switch (type) {
        case 'top-left':
            return {
                flexFlow: 'row wrap',
                alignContent: 'flex-start',
                justifyContent: 'flex-start',
            };
        case 'top-center':
            return {
                flexFlow: 'row wrap',
                alignContent: 'flex-start',
                justifyContent: 'center',
            };
        case 'top-right':
            return {
                flexFlow: 'row wrap',
                alignContent: 'flex-start',
                justifyContent: 'flex-end',
            };
        case 'center-left':
            return {
                flexFlow: 'column wrap',
                alignContent: 'flex-start',
                justifyContent: 'center',
            };
        case 'center-right':
            return {
                flexFlow: 'column wrap',
                alignContent: 'flex-end',
                justifyContent: 'center',
            };
        case 'bottom-left':
            return {
                flexFlow: 'row wrap',
                alignContent: 'flex-end',
                justifyContent: 'flex-start',
            };
        case 'bottom-center':
            return {
                flexFlow: 'row wrap',
                alignContent: 'flex-end',
                justifyContent: 'center',
            };
        case 'bottom-right':
            return {
                flexFlow: 'row wrap',
                alignContent: 'flex-end',
                justifyContent: 'flex-end',
            };
        default:
            return {
                flexFlow: 'row wrap',
                alignContent: 'flex-start',
                justifyContent: 'flex-end',
            };
    }
}
