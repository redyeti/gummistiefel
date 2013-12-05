"use strict";

$(function () {
	// Initialisiere Bilder links
	
	// Für gewöhnlich würde das hier in einem eigenen ejs-File stehen, aber da der Kamelbaukasten auch
	// lokal ausgeführt werden können soll, muss das hier rein, da Opera, Chrome & Co sonst aus
	// Sicherheitsgründen das Nachladen der Datei verbieten (Same-Origin-Policy)
	var template = '<% for (var i=0; i< images.length; i++) { %>'
		     + '<img src="bilder/bibliothek/<%= images[i][0] %>" style="<%= images[i][1] %>" class="libraryButton" draggable="false"/>'
		     + '<% } %>';
		
	new EJS({text: template}).update('guiBarLeft', {images: bibliothek});
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

	window.scene = new Zeichenbereich('#Zeichenbereich');
});
