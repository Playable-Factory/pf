import * as PIXI from 'pixi.js-legacy';

export default class Trail extends PIXI.Container {
    constructor() {
        super();
        // PIXI SCENE

        var circlesContainer;
        var circleFollower, mouseX, mouseY, targetMouse;
        var friction = 0.8;
        var numberOfFollowers = 20;

        circlesContainer = new PIXI.Container();

        // CREATE CIRCLES
        for (let index = 0; index < numberOfFollowers; index++) {
            var size = map(index, 0, numberOfFollowers, 2, 10);
            var circ = createCircle(0, 0, size, index);
            circlesContainer.addChild(circ);
        }
        this.addChild(circlesContainer);

        targetMouse = {
            x: 0,
            y: 0
        };
        circleFollower = circlesContainer.children[numberOfFollowers - 1];

        window.addEventListener('pointermove', (e) => onMouseMove(e));

        var onMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            targetMouse = {
                x: mouseX,
                y: mouseY
            };
        };



        PIXI.Ticker.shared.add(() => {
            updateCircles();
        })

        var updateCircles = () => {
            for (let index = 0; index < circlesContainer.children.length; index++) {

                var circle = circlesContainer.children[index];
                var nextCircle;

                if (index < circlesContainer.children.length - 1) {
                    nextCircle = circlesContainer.children[index + 1];
                }

                if (index === circlesContainer.children.length - 1) {
                    var pos = followTarget(circle, targetMouse, index);
                    circle.position.set(pos.x, pos.y);
                } else if (nextCircle) {
                    var tar = {
                        x: nextCircle.position.x,
                        y: nextCircle.position.y
                    };
                    var pos = followTarget(circle, tar, index);
                    circle.position.set(pos.x, pos.y);
                }

            }

        };

        var followTarget = (follower, target, index) => {
            var cX = lerp(follower.position.x, target.x, friction + (index * 0.009));
            var cY = lerp(follower.position.y, target.y, friction + (index * 0.009));

            var direction = {
                x: follower.position.x - target.x,
                y: follower.position.y - target.y
            }
            var angle = Math.atan2(direction.y, direction.x);

            var cAX = Math.cos(angle);
            var cAY = Math.sin(angle);

            var position = {
                x: cX + cAX,
                y: cY + cAY
            };

            return position;
        }
    }
}


var lerp = (start, stop, amt) => {
    return amt * (stop - start) + start;
};

function normalize(value, min, max) {
    return (value - min) / (max - min);
}

function interpolate(value, min, max) {
    return min + (max - min) * value;
}

function map(value, min1, max1, min2, max2) {
    return interpolate(normalize(value, min1, max1), min2, max2);
}

var rgb2hex = (rgb) => {
    return ((rgb[0] * 255 << 16) + (rgb[1] * 255 << 8) + rgb[2] * 255);
};

var createCircle = (x, h, r, index) => {
    var circle = new PIXI.Graphics();
    var color = rgb2hex([0, 0, index * 10]);
    circle.beginFill(color);
    circle.drawCircle(x, h, r);
    circle.endFill();
    return circle;
}