$(function () {
	// Initialisiere Bilder links
	new EJS({url: 'templates/libraryButton.ejs'}).update('guiBarLeft', {images: bibliothek});
	// Weise denen auch eine Funktion zu
	$(".libraryButton").click( function (evt) {
		gui.place(this.src);
	});
});
