import * as zrender from 'zrender';
import { Group, Polyline, Polygon, BrokenLine, LineArea, Circle, Trapezoid } from '../../shape';
import { getMaxR, getCircleSize, getCenterPoint } from '../../utils';

const limitValue = (per, limit) => (limit * per) / 100;

function Test(props) {
    // 图形组
    const Graphics = new Group({ name: `Graphics` });

    const { maxWidth, maxHeight, configData } = props;

    // const vertex = [
    //     [100, 100],
    //     [180, 300],
    //     [300, 200],
    //     [420, 300],
    //     [500, 100],
    // ];
    // const base = [
    //     [100, 300],
    //     [200, 350],
    //     [300, 300],
    //     [400, 350],
    //     [500, 300],
    // ];
    // const pointsArr = vertex.map((point, i) => ({ vertex: point, base: base[i] }));
    //
    // Graphics.add(
    //     new renderLineArea({
    //         subZ: 1,
    //         configData,
    //         pointsArr: pointsArr,
    //         majorColor: 'rgba(255, 255, 255, 0.3)',
    //         lineWidthLimit: maxWidth * 0.1,
    //     }),
    // );

    // vertex.forEach((i) => {
    //     Graphics.add(
    //         new Circle({
    //             shape: {
    //                 cx: i[0],
    //                 cy: i[1],
    //                 r: 4,
    //             },
    //         }),
    //     );
    // });
    // base.forEach((i) => {
    //     Graphics.add(
    //         new Circle({
    //             shape: {
    //                 cx: i[0],
    //                 cy: i[1],
    //                 r: 4,
    //             },
    //         }),
    //     );
    // });

    // 梯形测试;
    function getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    const randomPosition = new Array(4)
        .fill(Math.min(maxWidth, maxHeight))
        .map((i) => [getRandomInt(i), getRandomInt(i)]);

    const polygonCenter = randomPosition.reduce(
        ([px, py], [cx, cy]) => [(px + cx) / 2, (py + cy) / 2],
        [0, 0],
    );
    // const positionArr = randomPosition.sort((a, b) => getVectorR(polygonCenter, a) - getVectorR(polygonCenter, b));

    const positionArr = [
        [100, 100],
        [400, 50],
        [440, 330],
        [180, 300],
    ];

    const testPolygon = new Polygon({
        shape: {
            points: positionArr,
        },
        style: {
            fill: 'rgba(255, 255, 255, 0.3)',
        },
    });

    Graphics.add(testPolygon);

    const { tleft, tright, bright, bleft } = configData.general.border.radius;

    const rArr = [tleft, tright, bright, bleft].map((i) => limitValue(1000, i));

    positionArr.forEach((_, i, arr) => {
        const currRadius = getMaxR(arr, rArr, i);
        const circleSize = getCircleSize(arr, i, currRadius);
        const [targetX, targetY] = getCenterPoint(arr, i, circleSize);
        const cutCircle = new Circle({
            position: [targetX, targetY],
            shape: {
                r: circleSize,
            },
            style: {
                fill: 'rgba(255, 255, 255, 0.3)',
            },
        });
        Graphics.add(cutCircle);
    }, Graphics);

    const testTrapezoid = new Trapezoid({
        shape: {
            x: 100,
            y: 100,
            points: positionArr,
            r: rArr,
        },
        style: {
            fill: null,
            // fill: 'rgba(255, 0, 255, 0.1)',
            stroke: 'rgba(255, 255, 0, 0.3)',
            lineWidth: 2,
        },
    });

    Graphics.add(testTrapezoid);

    return Graphics;
}

export default Test;
