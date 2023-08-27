import Coordinate from "./coordinate";

/**
 * A utility class for working with containers and calculating their dimensions.
 *
 * @class ContainerHelper
 */
export default class ContainerHelper {
	constructor() {}

	/**
	 * Finds the maximum and minimum X coordinates of the children within the container.
	 *
	 * @static
	 * @method ContainerHelper.findMaxAndMinX
	 * @param {Container} cont - The container containing child objects.
	 * @returns {object} An object containing the minimum and maximum X coordinates.
	 */
	static findMaxAndMinX(cont) {
		let minX = Infinity;
		let maxX = 0;

		for (let i = 0; i < cont.children.length; i++) {
			let controlFlag;
			let currChild = cont.children[i];
			cont.excludes.forEach((item) => {
				if (currChild == item) {
					controlFlag = true;
				}
			});

			if (controlFlag) {
				continue;
			}

			let gScale = Coordinate.toGlobalScale(currChild);
			//console.log(currChild.baseWidth, currChild.scale.x, gScale)

			if (minX > currChild.x - currChild.baseWidth * currChild.scale.x * currChild.anchor.x) {
				minX = currChild.x - currChild.baseWidth * currChild.scale.x * currChild.anchor.x;
			}
			if (maxX < currChild.x + currChild.baseWidth * currChild.scale.x * (1 - currChild.anchor.x)) {
				maxX = currChild.x + currChild.baseWidth * currChild.scale.x * (1 - currChild.anchor.x);
			}
		}

		return {
			minX,
			maxX,
		};
	}

	/**
	 * Finds the maximum and minimum Y coordinates of the children within the container.
	 *
	 * @static
	 * @method ContainerHelper.findMaxAndMinY
	 * @param {Container} cont - The container containing child objects.
	 * @returns {object} An object containing the minimum and maximum Y coordinates.
	 */
	static findMaxAndMinY(cont) {
		let minY = Infinity;
		let maxY = 0;

		for (let i = 0; i < cont.children.length; i++) {
			let controlFlag;
			let currChild = cont.children[i];

			cont.excludes.forEach((item) => {
				if (currChild == item) {
					controlFlag = true;
				}
			});

			if (controlFlag) {
				continue;
			}

			if (minY > currChild.y - currChild.baseHeight * currChild.scale.y * currChild.anchor.y) {
				minY = currChild.y - currChild.baseHeight * currChild.scale.y * currChild.anchor.y;
			}

			if (maxY < currChild.y + currChild.baseHeight * currChild.scale.y * (1 - currChild.anchor.y)) {
				maxY = currChild.y + currChild.baseHeight * currChild.scale.y * (1 - currChild.anchor.y);
			}
		}

		return {
			minY,
			maxY,
		};
	}
}
