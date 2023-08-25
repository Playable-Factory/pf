import globals from "../../../../globals";


export default class Coordinate {
    constructor() {

    }

    static toLocalScale(obj) {
        let scaleX = obj.scale.x;
        let scaleY = obj.scale.y;

        let parents = [];

        while (obj.parent) {
            if (obj.parent != globals.pixiScene && obj.parent != pixiGlobals.scene) {
                scaleX /= obj.parent.scale.x;
                scaleY /= obj.parent.scale.y;
                parents.push(obj.parent);
                obj = obj.parent;
            } else {
                break;
            }
        }

        return { x: scaleX, y: scaleY, parents: parents };
    }

    static toGlobalScale(obj) {
        let scaleX = obj.scale.x;
        let scaleY = obj.scale.y;

        let parents = [];

        while (obj.parent) {
            if (obj.parent != globals.pixiScene && obj.parent != pixiGlobals.scene) {
                scaleX *= obj.parent.scale.x;
                scaleY *= obj.parent.scale.y;
                parents.push(obj.parent);
                obj = obj.parent;
            } else {
                break;
            }
        }

        return { x: scaleX, y: scaleY, parents: parents };
    }

    static toGlobalRotation(obj) {
        let rotation = obj.rotation;

        let parents = [];

        while (obj.parent) {
            if (obj.parent != globals.pixiScene && obj.parent != pixiGlobals.scene) {
                rotation += obj.parent.rotation;
                parents.push(obj.parent);
                obj = obj.parent;
            } else {
                break;
            }
        }

        return rotation;
    }

    static toLocalRotation(obj) {
        let rotation = obj.rotation;

        let tempObj = obj;
        let parents = [];

        while (tempObj.parent) {
            if (tempObj.parent != globals.pixiScene && tempObj.parent != pixiGlobals.scene) {
                rotation -= tempObj.parent.rotation;
                parents.push(tempObj.parent);
                tempObj = tempObj.parent;
            } else {
                break;
            }
        }

        return rotation;
    }


    static getGlobalData(obj, cX, cY, cW, cH) {
        const cont = obj.parent;
        if (cont != globals.pixiScene) {
            const x = cX || obj.x;
            const y = cY || obj.y;
            const width = cW || obj.width;
            const height = cH || obj.height;

            let angle = obj.angle;
            let tempObj = obj;
            while (tempObj.parent) {
                angle += tempObj.parent.angle;
                tempObj = tempObj.parent;
            }

            const gX = cont.x + x * cont.scale.x;
            const gY = cont.y + y * cont.scale.y;
            const gW = width * cont.scale.x;
            const gH = height * cont.scale.y;

            /* const sinA = Math.sin(angle * Math.PI / 180);
            const cosA = Math.cos(angle * Math.PI / 180);
            const xRotated = gX * cosA - gY * sinA;
            const yRotated = gX * sinA + gY * cosA; */

            if (cont.parent != globals.pixiScene) {
                return Coordinate.getGlobalData(cont, gX, gY, gW, gH);
            } else {
                return {
                    x: gX,
                    y: gY,
                    width: gW,
                    height: gH
                };
            }
        } else {
            return {
                x: cX || obj.x,
                y: cY || obj.y,
                width: obj.width,
                height: obj.height
            };
        }

    }

    static getLocalData(obj, cX, cY, cW, cH) {
        const cont = obj.parent;
        if (cont != globals.pixiScene) {
            const x = cX || obj.x;
            const y = cY || obj.y;
            const width = cW || obj.width;
            const height = cH || obj.height;

            const gX = (x - cont.x) / cont.scale.x;
            const gY = (y - cont.y) / cont.scale.y;
            const gW = width / cont.scale.x;
            const gH = height / cont.scale.y;

            if (cont.parent != globals.pixiScene) {
                return Coordinate.getLocalData(cont, gX, gY, gW, gH);
            } else {
                return {
                    x: gX,
                    y: gY,
                    width: gW,
                    height: gH
                };
            }
        } else {
            console.log("HERE")
            return {
                x: cX || obj.x,
                y: cY || obj.y,
                width: obj.width,
                height: obj.height
            };
        }
    }


}