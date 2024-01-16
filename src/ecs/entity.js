export default class Entity {
    /**
     * Creates an instance of Entity.
     * @param {Object} mainObj - The main object that the entity belongs to.
     */
    constructor(mainObj) {
        /**
         * The main object that the entity belongs to.
         * @type {Object}
         */
        this.mainObj = mainObj;
        /**
         * A Map object to store components.
         * @type {Map}
         */
        this.components = new Map();
        /**
         * An array to store components.
         * @type {Array}
         */
        this.componentsArray = [];
    }

    /**
     * Calls the awake method of all components attached to the entity.
     */
    awake() {
        this.runOnAllComponents((component) => {
            component.awake();
        });
    }

    /**
     * Calls the init method of all components attached to the entity.
     * Sets the inited property to true.
     */
    init() {
        this.runOnAllComponents((component) => {
            component.init();
        });
        this.inited = true;
    }

    /**
     * Calls the update method of all components attached to the entity.
     * @param {number} ratio - The ratio of the elapsed time to the expected frame time.
     * @param {number} delta - The elapsed time since the last frame.
     */
    update(ratio, delta) {
        if (!this.inited) return;

        if (this.mainObj._update) this.mainObj._update(ratio, delta);
        for (let i = 0; i < this.componentsArray.length; i++) {
            this.componentsArray[i].update(ratio, delta);
        }
    }

    /**
     * Calls the resize method of all components attached to the entity.
     * @param {number} w - The new width of the entity.
     * @param {number} h - The new height of the entity.
     */
    resize(w, h) {
        if (!this.inited) return;

        this.runOnAllComponents((component) => {
            component.resize(w, h);
        });
    }

    /**
     * Calls the onRemove method of all components attached to the entity.
     * Clears the components array and the components map.
     */
    destroy() {
        if (!this.inited) return;

        while (this.componentsArray.length > 0) {
            let component = this.componentsArray.pop();
            component.onRemove();
        }
        this.components.clear();
    }

    /**
     * Adds a new component to the entity.
     * @param {Component} component - The component to add.
     * @param {String} componentName - The component name string.
     * @returns {Component} - The added component.
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
     * Removes a component from the entity.
     * @param {Component} componentClass - The class of the component to remove.
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

    /**
     * Gets a component from the entity whose class name includes the specified string.
     * @param {string} componentName - The string to search for in the component class names.
     * @returns {Component} - The first component whose class name includes the specified string.
     */
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


    /**
     * Calls the specified function on all components attached to the entity.
     * @param {Function} actionFunc - The function to call on each component.
     */
    runOnAllComponents(actionFunc) {
        for (let i = 0; i < this.componentsArray.length; i++) {
            actionFunc(this.componentsArray[i]);
        }
    }
}