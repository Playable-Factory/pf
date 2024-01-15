import { LoaderResource } from "@pixi/loaders/dist/esm/loaders";

LoaderResource.prototype._loadXhr = function () {
    this._boundOnProgress();
    this._boundXhrOnLoad();
};

LoaderResource.prototype._xhrOnLoad = function () {
    this.data = window.neutrinoScriptData;
    this.complete();
};
