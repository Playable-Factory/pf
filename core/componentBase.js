class ComponentBase {
	_className = "ComponentBase";

	_initDefault(gameObject, variableData, sceneManager) {
		this._node = gameObject;
		this._configVarData = variableData;
		this._sceneManager = sceneManager;
	}

	_initPublicVariables() {
		if (!this._configVarData) return;

		for (let varData of this._configVarData) {
			if (this[varData.var_name] !== undefined || this[varData.var_name] !== null) {
				if (this._isUUID(varData.var_value)) {
					let uuid = varData.var_value;
					let obj = this._sceneManager.getObjectByUUID(uuid);
					if (obj && obj.entity) {
						this[varData.var_name] = obj.entity.getComponent(varData.var_type);
					}
				} else {
					this[varData.var_name] = varData.var_value;
				}
			}
		}
	}

	_isUUID(str) {
		const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
		return uuidRegex.test(str);
	}

	onAdd(entity) {}

	onRemove() {}

	init() {}

	update(delta) {}

	resize(w, h) {}
}

export default ComponentBase;
