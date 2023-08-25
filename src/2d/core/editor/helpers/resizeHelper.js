import { Point, TextMetrics, Texture } from "pixi.js-legacy";
import pfGlobals from "../../../pfGlobals";

export default class ResizeHelper {
	static setBaseWidthHeight(gameObject) {
		let baseWidth, baseHeight;

		if (gameObject.data.type == "sprite") {
			baseWidth = gameObject.texture.orig.width;
			baseHeight = gameObject.texture.orig.height;
		} else if (gameObject.data.type == "animatedSprite") {
			baseWidth = gameObject.textures[0].orig.width;
			baseHeight = gameObject.textures[0].orig.height;
		} else if (gameObject.data.type == "text") {
			const metrics = TextMetrics.measureText(gameObject.text, gameObject.style);
			baseWidth = metrics.width;
			baseHeight = metrics.height;
		} else if (gameObject.data.type == "graphics") {
			if (gameObject.data.shapeType == "rectangle") {
				baseWidth = gameObject.data.width + gameObject.data.lineWidth;
				baseHeight = gameObject.data.height + gameObject.data.lineWidth;
			} else if (gameObject.data.shapeType == "circle") {
				baseWidth = gameObject.data.radius * 2 + gameObject.data.lineWidth;
				baseHeight = gameObject.data.radius * 2 + gameObject.data.lineWidth;
			} else if (gameObject.data.shapeType == "ellipse") {
				baseWidth = gameObject.data.width * 2 + gameObject.data.lineWidth;
				baseHeight = gameObject.data.height * 2 + gameObject.data.lineWidth;
			}
		} else if (gameObject.data.type == "container" || gameObject.data.type == "particle") {
			gameObject.setBases = () => {
				const bounds = gameObject.data;

				baseWidth = bounds.width;
				baseHeight = bounds.height;

				gameObject.customBounds = bounds;

				return { baseWidth, baseHeight };
			};

			let bases = gameObject.setBases();
			baseWidth = bases.baseWidth;
			baseHeight = bases.baseHeight;
		} else if (gameObject.data.type == "spine") {
			const bounds = gameObject.data.sizeRect;

			baseWidth = bounds.width;
			baseHeight = bounds.height;
		} else if (gameObject.data.type == "bitmaptext") {
			baseWidth = gameObject.textWidth;
			baseHeight = gameObject.textHeight;
		} else if (gameObject.data.type == "nineslice") {
			baseWidth = gameObject.data.origWidth;
			baseHeight = gameObject.data.origHeight;
		}

		gameObject.baseWidth = baseWidth;
		gameObject.baseHeight = baseHeight;

		return { baseWidth, baseHeight };
	}

	static getSpace(gameObject, orientation) {
		const data = gameObject.data.resizeData[orientation];

		let totalWidth = 0;
		let totalHeight = 0;

		let topMost = 0;
		let bottomMost = 0;
		let leftMost = 0;
		let rightMost = 0;

		let parentBounds = {};

		if (gameObject.parent == pfGlobals.pixiScene) {
			totalWidth = pfGlobals.pixiScene.lastWidth;
			totalHeight = pfGlobals.pixiScene.lastHeight;

			parentBounds = {
				x: 0,
				y: 0,
				width: totalWidth,
				height: totalHeight,
			};
		} else if (gameObject.parent == pfGlobals.pixiViewport) {
			totalWidth = pfGlobals.pixiViewport.worldWidth;
			totalHeight = pfGlobals.pixiViewport.worldHeight;

			parentBounds = {
				x: 0,
				y: 0,
				width: totalWidth,
				height: totalHeight,
			};
		} else {
			totalWidth = gameObject.parent.baseWidth;
			totalHeight = gameObject.parent.baseHeight;

			parentBounds = {
				x: gameObject.parent.anchor ? -gameObject.parent.anchor.x * gameObject.parent.baseWidth : 0, // NEW
				y: gameObject.parent.anchor ? -gameObject.parent.anchor.y * gameObject.parent.baseHeight : 0,
				width: totalWidth,
				height: totalHeight,
			};
		}

		topMost = parentBounds.y;
		bottomMost = parentBounds.y + parentBounds.height;
		leftMost = parentBounds.x;
		rightMost = parentBounds.x + parentBounds.width;

		gameObject.refObjects = [];

		if (data.topRef) {
			let topObj = gameObject.parent.children.filter((c) => c.data && c.data.uuid == data.topRef)[0];
			if (topObj) {
				topObj.onResizeCallback(topObj.parent.lastWidth || topObj.parent.baseWidth, topObj.parent.lastHeight || topObj.parent.baseHeight); // NEW
				topObj.topRef = gameObject;
				let lb = topObj.getLocalBounds();

				topMost = topObj.y + (-lb.y + topObj.pivot.y) * topObj.scale.y;
			}
		}

		if (data.bottomRef) {
			let bottomObj = gameObject.parent.children.filter((c) => c.data && c.data.uuid == data.bottomRef)[0];
			if (bottomObj) {
				bottomObj.onResizeCallback(bottomObj.parent.lastWidth || bottomObj.parent.baseWidth, bottomObj.parent.lastHeight || bottomObj.parent.baseHeight);
				bottomObj.bottomRef = gameObject;
				let lb = bottomObj.getLocalBounds();

				bottomMost = bottomObj.y + (lb.y - bottomObj.pivot.y) * bottomObj.scale.y;
			}
		}

		if (data.leftRef) {
			let leftObj = gameObject.parent.children.filter((c) => c.data && c.data.uuid == data.leftRef)[0];
			if (leftObj) {
				leftObj.onResizeCallback(leftObj.parent.lastWidth || leftObj.parent.baseWidth, leftObj.parent.lastHeight || leftObj.parent.baseHeight);
				leftObj.leftRef = gameObject;
				let lb = leftObj.getLocalBounds();

				leftMost = leftObj.x + (-lb.x + leftObj.pivot.x) * leftObj.scale.x;
			}
		}

		if (data.rightRef) {
			let rightObj = gameObject.parent.children.filter((c) => c.data && c.data.uuid == data.rightRef)[0];
			if (rightObj) {
				rightObj.onResizeCallback(rightObj.parent.lastWidth || rightObj.parent.baseWidth, rightObj.parent.lastHeight || rightObj.parent.baseHeight);
				rightObj.rightRef = gameObject;
				let lb = rightObj.getLocalBounds();

				rightMost = rightObj.x + (lb.x - rightObj.pivot.x) * rightObj.scale.x;
			}
		}

		let remainedHeight = bottomMost - topMost;
		let remainedWidth = rightMost - leftMost;

		return {
			topMost,
			bottomMost,
			leftMost,
			rightMost,
			totalWidth,
			totalHeight,
			remainedWidth,
			remainedHeight,
		};
	}

	static getBounds(gameObject) {
		const bounds = {
			x: 0,
			y: 0,
			width: 0,
			height: 0,
		};

		if (gameObject.anchor) {
			bounds.x = -gameObject.anchor.x * gameObject.baseWidth;
			bounds.y = -gameObject.anchor.y * gameObject.baseHeight;
		} else {
			bounds.x = -gameObject.pivot.x;
			bounds.y = -gameObject.pivot.y;
		}
		if (gameObject.data.type == "nineslice") {
			bounds.width = gameObject.width;
			bounds.height = gameObject.height;
		} else {
			bounds.width = gameObject.baseWidth;
			bounds.height = gameObject.baseHeight;
		}

		return bounds;
	}

	static getScale(gameObject, orientation) {
		const data = gameObject.data.resizeData[orientation];
		const { topMost, bottomMost, leftMost, rightMost, totalWidth, totalHeight, remainedWidth, remainedHeight } = this.getSpace(gameObject, orientation);

		let scale = { x: 1, y: 1 };

		if (gameObject.data.type == "text") {
			const metrics = TextMetrics.measureText(gameObject.text, gameObject.style);
			gameObject.baseWidth = metrics.width;
			gameObject.baseHeight = metrics.height;
		} else if (gameObject.data.type == "sprite") {
			gameObject.baseWidth = gameObject.texture.orig.width;
			gameObject.baseHeight = gameObject.texture.orig.height;
		}

		if (data.scaleType == "min") {
			scale.x = scale.y = Math.min((remainedWidth * data.widthRatio) / gameObject.baseWidth, (remainedHeight * data.heightRatio) / gameObject.baseHeight);
		} else if (data.scaleType == "max") {
			scale.x = scale.y = Math.max((remainedWidth * data.widthRatio) / gameObject.baseWidth, (remainedHeight * data.heightRatio) / gameObject.baseHeight);
		} else if (data.scaleType == "stretch") {
			scale.x = (remainedWidth * data.widthRatio) / gameObject.baseWidth;
			scale.y = (remainedHeight * data.heightRatio) / gameObject.baseHeight;
		}
		return scale;
	}

	static getPosition(gameObject, orientation) {
		const data = gameObject.data.resizeData[orientation];
		const { topMost, bottomMost, leftMost, rightMost, totalWidth, totalHeight, remainedWidth, remainedHeight } = this.getSpace(gameObject, orientation);

		let verSpace = 0;
		let horSpace = 0;

		if (data.verSpaceUnit == "%") {
			verSpace = remainedHeight * (data.verSpace / 100);
		} else if (data.verSpaceUnit == "px") {
			verSpace = data.verSpace;
		} else if (data.verSpaceUnit == "self") {
			verSpace = gameObject.baseHeight * gameObject.scale.y * (data.verSpace / 100);
		}

		if (data.horSpaceUnit == "%") {
			horSpace = remainedWidth * (data.horSpace / 100);
		} else if (data.horSpaceUnit == "px") {
			horSpace = data.horSpace;
		} else if (data.horSpaceUnit == "self") {
			horSpace = gameObject.baseWidth * gameObject.scale.x * (data.horSpace / 100);
		}

		let position = { x: 0, y: 0 };

		const leftX = leftMost /* + gameObject.baseWidth * gameObject.scale.x * origin.x */ + horSpace;
		const centerX = leftMost + remainedWidth * 0.5 /* + gameObject.baseWidth * gameObject.scale.x * (origin.x - 0.5) */ + horSpace;
		const rightX = leftMost + remainedWidth /* - gameObject.baseWidth * gameObject.scale.x * (1 - origin.x) */ + horSpace;
		const topY = topMost /* + gameObject.baseHeight * gameObject.scale.y * origin.y */ + verSpace;
		const centerY = topMost + remainedHeight * 0.5 /* + gameObject.baseHeight * gameObject.scale.y * (origin.y - 0.5) */ + verSpace;
		const bottomY = topMost + remainedHeight /* - gameObject.baseHeight * gameObject.scale.y * (1 - origin.y) */ + verSpace;

		if (data.alignment == "0_0") {
			// top-left
			position.x = leftX;
			position.y = topY;
		} else if (data.alignment == "0_1") {
			// top-center
			position.x = centerX;
			position.y = topY;
		} else if (data.alignment == "0_2") {
			// top-right
			position.x = rightX;
			position.y = topY;
		} else if (data.alignment == "1_0") {
			// center-left
			position.x = leftX;
			position.y = centerY;
		} else if (data.alignment == "1_1") {
			// center-center
			position.x = centerX;
			position.y = centerY;
		} else if (data.alignment == "1_2") {
			// center-right
			position.x = rightX;
			position.y = centerY;
		} else if (data.alignment == "2_0") {
			// bottom-left
			position.x = leftX;
			position.y = bottomY;
		} else if (data.alignment == "2_1") {
			// bottom-center
			position.x = centerX;
			position.y = bottomY;
		} else if (data.alignment == "2_2") {
			// bottom-right
			position.x = rightX;
			position.y = bottomY;
		}

		return position;
	}

	static findMaxAndMinX(obj) {
		let minX = Infinity;
		let maxX = -Infinity;

		for (let i = 0; i < obj.children.length; i++) {
			let currChild = obj.children[i];
			const bounds = currChild.getBounds(); // get global bounds instead of local

			if (!currChild.data) {
				continue;
			}

			if (minX > bounds.x) {
				minX = bounds.x;
			}

			if (maxX < bounds.x + bounds.width) {
				maxX = bounds.x + bounds.width;
			}
		}

		// Convert the min and max X back to the local space of the object
		minX = obj.toLocal(new Point(minX, 0)).x;
		maxX = obj.toLocal(new Point(maxX, 0)).x;

		return { min: minX, max: maxX };
	}

	static findMaxAndMinY(obj) {
		let minY = Infinity;
		let maxY = -Infinity;

		for (let i = 0; i < obj.children.length; i++) {
			let currChild = obj.children[i];
			const bounds = currChild.getBounds(); // get global bounds instead of local

			if (!currChild.data) {
				continue;
			}

			if (minY > bounds.y) {
				minY = bounds.y;
			}

			if (maxY < bounds.y + bounds.height) {
				maxY = bounds.y + bounds.height;
			}
		}

		// Convert the min and max Y back to the local space of the object
		minY = obj.toLocal(new Point(0, minY)).y;
		maxY = obj.toLocal(new Point(0, maxY)).y;

		return { min: minY, max: maxY };
	}

	static recalculateContainerBounds(obj) {
		const minMaxX = ResizeHelper.findMaxAndMinX(obj);
		const minMaxY = ResizeHelper.findMaxAndMinY(obj);
		const wi = minMaxX.max - minMaxX.min;
		const he = minMaxY.max - minMaxY.min;

		const globalOfminPoses = obj.parent.toLocal(new Point(minMaxX.min, minMaxY.min), obj);

		const oldWidth = obj.data.width;
		const oldHeight = obj.data.height;
		const oldPivotRatioX = obj.data.pivot.x / oldWidth;
		const oldPivotRatioY = obj.data.pivot.y / oldHeight;

		obj.data.width = wi;
		obj.data.height = he;

		// update pivot
		const newPivotX = oldPivotRatioX * wi;
		const newPivotY = oldPivotRatioY * he;
		obj.data.pivot.x = newPivotX;
		obj.data.pivot.y = newPivotY;
		obj.pivot.set(newPivotX, newPivotY);

		obj.x = obj.pivot.x + globalOfminPoses.x;
		obj.y = obj.pivot.y + globalOfminPoses.y;
		obj.data.position.x = obj.x;
		obj.data.position.y = obj.y;

		obj.children.forEach((element) => {
			if (element.data) {
				element.data.position.x -= minMaxX.min;
				element.data.position.y -= minMaxY.min;
				element.x = element.data.position.x;
				element.y = element.data.position.y;
			}
		});

		ResizeHelper.setBaseWidthHeight(obj);
	}
}
