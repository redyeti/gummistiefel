/*
 * Hilfsfunktionen, die nirgendwo so richtig hinpassen
 */

"use strict";

function Copy(x) {
	for (var i in x) {
		if (i[0] != "_")
			this[i] = x[i];
	}
}

function comp(x,y) {
	for (var i in x) {
		if (y[i] != x[i] && i[0] != "_")
			return false;
	}
	return true;
}

function handleFileSelect(method, match, readyCallback, initCallback) {
	var _handleFileSelect = function(evt) {
		var files = evt.target.files; // FileList object

		// Loop through the FileList and render image files as thumbnails.
		for (var i = 0, f; f = files[i]; i++) {
			if (initCallback)
				initCallback(f);


			// Only process image files.
			//if (!f.type.match('image.*')) {
			if (!f.type.match(match)) {
				continue;
			}

			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onload = (function(theFile) {
				return function(e) {
					readyCallback(e, theFile);
				};
			})(f);

			// Read in the image file as a data URL.
			console.log(reader[method], method)
			reader[method](f);
		}
	};
	return _handleFileSelect;
}
