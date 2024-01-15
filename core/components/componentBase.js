class ComponentBase {
	_className = "ComponentBase";

	_initDefault(gameObject, variableData, sceneManager) {
		this._node = gameObject;
		this._configVarData = variableData;
		this._sceneManager = sceneManager;
	}

	_initPublicVariables() {
		if (!this._configVarData) return;

		//console.log(this._className, this._configVarData);
		for (let varData of this._configVarData) {
			if (
				this[varData.var_name] !== undefined ||
				this[varData.var_name] !== null
			) {
				if (this._isUUID(varData.var_value)) {
					let uuid = varData.var_value;
					let obj = this._sceneManager.getObjectByUUID(uuid);
					if (obj) {
						if (obj.entity) {
							let target = obj.entity.getComponent(varData.var_type);
							if (!target) {
								target = obj.entity.mainObj;
							}
							this[varData.var_name] = target;
						} else {
							this[varData.var_name] = obj;
						}
					}
				} 
				else if(varData.var_type == 'params'){
					this[varData.var_name] = app.data[varData.var_value];
				}
				else {
					this[varData.var_name] = varData.var_value;
				}
			}
		}
	}

	_isUUID(str) {
		const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
		return uuidRegex.test(str);
	}

	get entity() {
		return this._node.entity;
	}

	awake() {}

	onAdd(entity) {}

	onRemove() {}

	init() {}

	update(delta) {}

	resize(w, h) {}
}

export default ComponentBase;
