class GeneralLoader{

    static load(assetList, callback){

        var numOfAssetLoaded = 0;
        var totalAssetToLoad = 0;

        function assetLoaded() {
            numOfAssetLoaded++;
            if (numOfAssetLoaded >= totalAssetToLoad) {
                callback && callback();
                callback = null;
            }
        }
        
        for (var asset of assetList) {
            totalAssetToLoad++;
            if (asset.type == "font") {
                 this.loadFont(asset.key, asset.src, assetLoaded);
             }
        }

        if (assetList.length == 0) {
            setTimeout(() => {
                callback && callback();
                callback = null;
            }, 100);
        }
    }

    static loadFont(key, fontFile, callback) {
        var newFont = new FontFace(key, `url(${fontFile})`);
        newFont.load().then(function (loaded) {
            document.fonts.add(loaded);
            callback();
        }).catch(function (error) {
            return error;
        });
    }
}

export default GeneralLoader;