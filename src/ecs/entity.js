export default class Entity {
	constructor(mainObj) {
		this.mainObj = mainObj;
		this.components = new Map(); // A Map object to store components
		this.componentsArray = []; // An array to store components
	}

	awake() {
		this.runOnAllComponents((component) => {
			component.awake();
		});
	}

	init() {
		this.runOnAllComponents((component) => {
			component.init();
		});
		this.inited = true;
	}

	update(ratio, delta) {
		if (!this.inited) return;

		if (this.mainObj._update) this.mainObj._update(ratio, delta);
		for (let i = 0; i < this.componentsArray.length; i++) {
			this.componentsArray[i].update(ratio, delta);
		}
	}

	resize(w, h) {
		if (!this.inited) return;

		this.runOnAllComponents((component) => {
			component.resize(w, h);
		});
	}

	destroy() {
		if (!this.inited) return;

		while (this.componentsArray.length > 0) {
			let component = this.componentsArray.pop();
			component.onRemove();
		}
		this.components.clear();
	}

	/**
	 * Adds a new component to the entity
	 * @param {Component} component - The component to add
	 * @param {String} componentName - The component name string
	 */
	addComponent(component, componentName) {
		if (!componentName) {
			componentName = component._className;
		}
		this.components.set(componentName, component);
		if (!component.node) {
			component._initDefault(this.mainObj);
		}
		component.onAdd(this);
		this.componentsArray.push(component);
		return component;
	}

	/**
	 * Removes a component from the entity
	 * @param {Component} componentClass - The class of the component to remove
	 */
	removeComponent(componentClass) {
		let index = this.componentsArray.findIndex((component) => {
			return component._className === componentClass;
		});
		if (index > -1) {
			let compo = this.componentsArray.splice(index, 1)[0];
			this.components.delete(componentClass.name);
			compo.onRemove();
		}
	}

	/**
	 * Gets a component from the entity
	 * @param {string} componentName - The name of the component to get
	 * @returns {Component} - The component with the specified name
	 */
	getComponent(componentName) {
		return this.components.get(componentName);
	}

	getComponentNameIncludes(componentName) {
		let component = null;
		for (let i = 0; i < this.componentsArray.length; i++) {
			if (this.componentsArray[i]._className.includes(componentName)) {
				component = this.componentsArray[i];
				break;
			}
		}
		return component;
	}

	/**
	 * Returns true if the entity has a component of the specified type
	 * @param {string} componentName - The name of the component to check for
	 * @returns {boolean} - True if the entity has a component with the specified name
	 */
	hasComponent(componentName) {
		return this.components.has(componentName);
	}

	/**
	 * Returns an array of all components attached to the entity
	 * @returns {Array<Component>} - An array of all components attached to the entity
	 */
	getAllComponents() {
		return Array.from(this.components.values());
	}

	runOnAllComponents(actionFunc) {
		for (let i = 0; i < this.componentsArray.length; i++) {
			actionFunc(this.componentsArray[i]);
		}
	}
}
