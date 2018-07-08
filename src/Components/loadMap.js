// Function - to allow the async call of Google maps.

export function loadMapJS(src) {
    var ref = window.document.getElementsByTagName("script")[0];
    var script = window.document.createElement("script");
    script.src = src;
    script.async = true;
    script.onerror = function () {
        document.write("Sorry, there was an error loading Google Maps.");
    };
    ref.parentNode.insertBefore(script, ref);
}


