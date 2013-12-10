/*
 * Initialisierungen etc.
 */

"use strict";

$(function () {
	// Initialisiere Bilder links
	
	var container = $('#guiBarLeft').empty();
	for (var i=0; i< bibliothek.length; i++) {
		container.append(
			crel('img', {
				'src': "bilder/bibliothek/" + bibliothek[i][0],
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

	$("#btnRueck").click(function () {
		if ($(this).hasClass("disabled"))
			return;

		window.scene.history.undo();
	});

	$("#btnVor").click(function () {
		if ($(this).hasClass("disabled"))
			return;

		window.scene.history.redo();
	});

	$("#btnNeu").click(function () {
		if (window.scene.history.isEmpty()) {
			window.scene.clear();
		} else {
			$("<div title='Neues Bild erstellen?'>Wenn du ein neues Bild erstellst, wird all deine bisherige Arbeit vernichtet, wenn du sie nicht gespeichert hast. Trotzdem ein neues Bild erstellen?</div>").dialog({
				modal: true,
				buttons: {
					'Ja, ich will!': function () { window.scene.clear(); $(this).dialog("close"); },
					'Doch behalten': function () { $(this).dialog("close"); }
				}	
			});
		}
	});

	$("#btnDup").click(function() {
		window.scene.history.append(new HistoryItemDuplicate(window.scene.getSelection())).redo();
	});

	window.scene = new Zeichenbereich('#Zeichenbereich');
});
