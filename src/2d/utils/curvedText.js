import { Container, Text, SimpleRope, Point, Matrix } from 'pixi.js-legacy';

export default class CurvedText extends Container {
    constructor(text, style) {
        super();
        var text = new Text(text, style);
        text.resolution = 1;
        text.style.trim = true;
        text.updateText();

        var radius = 256; // PLAY WITH THIS VALUE
        var maxRopePoints = 100;
        var step = Math.PI / maxRopePoints;

        var ropePoints = maxRopePoints - Math.round((text.texture.width / (radius * Math.PI)) * maxRopePoints);
        ropePoints /= 2;

        var points = [];
        for (var i = maxRopePoints - ropePoints; i > ropePoints; i--) {
            var x = radius * Math.cos(step * i);
            var y = radius * Math.sin(step * i);
            points.push(new Point(x, -y));
        }

        var rope = new SimpleRope(text.texture, points);
        this.addChild(rope);
        var bounds = this.getLocalBounds();
        var matrix = new Matrix();
        matrix.tx = -bounds.x;
        matrix.ty = -bounds.y;
    }
}


// const cont = new CurvedText(
//     "YOU WIN!",
//     {
//         fontFamily: "ui-font",
//         fontSize: 64,
//         fill: "#000000",
//     }
// );
// scene.addChild(cont);

// cont.calculateBounds();
// const bounds = cont.getBounds();

// cont.onResizeCallback = (w, h) => {
//     cont.scale.set(
//         Math.min((w * 0.3) / bounds.width, (h * 0.2) / bounds.height)
//     );
//     cont.pivot.set(
//         (bounds.x + bounds.width + bounds.x) * 0.5,
//         (bounds.y + bounds.height + bounds.y) * 0.5
//     );
//     cont.x = w * 0.5;
//     cont.y = h * 0.5;

//     Utils.setInitials(cont);
// };
// cont.onResizeCallback(scene.lastWidth, scene.lastHeight);