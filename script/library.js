"use strict";

function loadLibrary(name) {
	var container = $('#library').empty();
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

/*function KpLibraryDialog() {
	$.ajax({
		url: 'http://kamelopedia.net/api.php',
		data: {
			action: 'query',
			prop: 'images',
			generator: 'categorymembers',
			gcmtitle: 'Kategorie:Kamelbaukasten-Bildsatz',
			imlimit: 100,
			gcmlimit: 100,
			format: "json"
		},
		dataType: 'json',
		complete: function(arg) {
			console.log(this, arg);
		}
	});
}*/
/* Load kamelopedia user libraries:
 * http://kamelopedia.net/api.php?action=query&prop=images&generator=categorymembers&gcmtitle=Kategorie:Kamelopedia&imlimit=100&gcmlimit=100
 * Als Kategorie dann natürlich stattdessen irgendwie Kategorie:Kamelbaukasten-Bibliothek
 * 
 * Use Cryptojs um md5 des Dateinamens zu erzeugen:
 * http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/md5.js
 * (MIT-License)
 * und setze damit dann den Datepfad zusammen:
 * 'http://kamelopedia.net/images/' + hash.substr(0,1) + '/' + hash.substr(0,2) + '/' + encodeURIComponent(filename)
 */
