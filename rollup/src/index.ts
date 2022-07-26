import zrender from "zrender";

function A() {
    console.log("hello world");
}
A();
const box = document.getElementById('box');
const zr = zrender.init(box);

const w = zr.getWidth();
const h = zr.getHeight();

const r = 30;
const circle = new zrender.Circle({
    shape: {
        cx: r,
        cy: h / 2,
        r: r,
    },
    style: {
        fill: "transparent",
        stroke: "#FF6EBE",
    },
    silent: true,
});

circle
    .animate("shape", true)
    .when(5000, {
        cx: w - r,
    })
    .when(10000, {
        cx: r,
    })
    .start();

zr.add(circle);
