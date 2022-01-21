/**
 * Created by tomer on 23/05/2017.
 */
var FleeqSDKLight;
if(typeof FleeqSDKLight === "undefined"){
    FleeqSDKLight = {
        _addCSSElement: function (filename) {
            var fileRef = document.createElement('link');
            fileRef.setAttribute("rel", "stylesheet");
            fileRef.setAttribute("type", "text/css");
            fileRef.setAttribute("href", filename);
            document.getElementsByTagName("head")[0].appendChild(fileRef);
        },
        _addJSElement: function (filename) {
            var fileRef = document.createElement('script');
            fileRef.setAttribute("type", "text/javascript");
            fileRef.setAttribute("src", filename);
            document.getElementsByTagName("head")[0].appendChild(fileRef);
        },
        start: function(){
            this._addCSSElement("https://s3-eu-west-1.amazonaws.com/fleeq-cdn/p/fleeq-sdk.min.css");
            this._addJSElement("https://s3-eu-west-1.amazonaws.com/fleeq-cdn/p/fleeq-sdk.min.js");
        }
    };
    FleeqSDKLight.start();
}