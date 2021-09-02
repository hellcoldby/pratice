const urls = [
    {
        info: 'link1',
        time: 8000,
        priority:4,
    },
    {
        info: 'link2',
        time: 6000,
        priority:3,
    },
    {
        info: 'link3',
        time: 3000,
        priority:5,
    },
    {
        info: 'link4',
        time: 2000,
        priority:1,
    },
    {
        info: 'link5',
        time: 4000,
        priority:2,
    },
    {
        info: 'link6',
        time: 5000,
        priority: 7
    },
    {
        info: 'link7',
        time: 5500,
        priority:6
    }
];

function loadImg(url) {
    return new Promise((resolve, reject)=>{
        console.log('----' + url.info + 'start');
        setTimeout(()=>{
            console.log(url.info + '---- is ok!!!');
            resolve();
        },url.time)
    });
}

module.exports =  {urls, loadImg}