"use strict";

function loadLibrary(name) {
	var container = $('#guiBarLeft').empty();
	var bibliothek = window.library[name];
	for (var i=0; i< bibliothek.length; i++) {
		container.append(
			crel('img', {
				'src': "bilder/bibliothek/" + name + "/" + bibliothek[i][0],
				'style': bibliothek[i][1],
				'class': "libraryButton",
				'draggable': false
			})
		);
	}	

	// Weise denen auch eine Funktion zu
	$(".libraryButton").click( function (evt) {
		console.log(this, this.src);
		new ZeichenBild({src: this.src});
	});


}
