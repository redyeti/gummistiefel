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
		$("<div title='Neues Bild erstellen?'>Wenn du ein neues Bild erstellst, wird all deine bisherige Arbeit vernichtet, wenn du sie nicht gespeichert hast. Trotzdem ein neues Bild erstellen?</div>").dialog({
			modal: true,
			buttons: {
				'Ja, ich will!': function () { window.scene.clear(); $(this).dialog("close"); },
				'Doch behalten': function () { $(this).dialog("close"); }
			},
			close: function() { $(this).dialog("destroy"); }	
		});
	});

	$("#btnSpeichern").click(function () {
		var $tabs = [
			"Speichern als: <select>",
			"		<option value='spGum'>Gum</option>",
			"		<option value='spSvg'>Svg</option>",
			"		<option value='spPng'>Png</option>",
			"</select>",
			"<div id='spGum'>Gum-Dateien sind dem Kamelbaukasten sein eigenes Dateiformat. Hier steht nur das absolut nötigste drin, dafür kann das Format zwar vom Kamelbaukasten, aber auch von keinem anderen Grafikprogramm gelesen werden. Gum steht natürlich für Gummistiefel.</div>",
			"<div id='spSvg'>SVGs werden vielleicht ein bisschen größer als PNGs, können dafür aber auch wieder geladen und bearbeitet werden.<br>Tipp: Benutze die Dateiendung .gs.svg (nur) für Dateien die direkt mit dem Kamelbaukasten erstellt wurden, so ist schon durch die Endung klar, ob die Dateien wieder geladen werden können.</div>",
			"<div id='spPng'>PNGs können vom Kamelbaukasten nur geschrieben, aber später nicht mehr geladen werden.</div>"
		].join(" ");
		var $dialog = $("<div title='Speichern'></div>").append($tabs);
		var $select = $dialog.find("select");
		$select.change(function() {
			var id = '#'+$(this).val();
			$(this).parent().find("div").not(id).hide();
			$(id).show();
		});
		$select.trigger('change');

		$dialog.dialog({
			modal: true,
			minWidth: 600,
			buttons: {
				'Speichern': function () { $(this).dialog("close"); },
				'Abbrechen': function () { $(this).dialog("close"); }
			},
			close: function() { $(this).dialog("destroy"); }	
		});
	});

	$("#btnHg").click(function () {
		$(crel("div", {title: "Hintergrunz ändern"},
			crel("div","Wähle deinen Hintergrund aus:"),
			function(output) {
				for (var h in hintergrunzDateien) {
					var i = crel("img", {
						style: "cursor: pointer;",
						height: 150,
						width: 200,
						'class': 'bshg',
						src:"bilder/hintergrunz/"+hintergrunzDateien[h]
					});
					$(i).click(function () {
						window.scene.history.append(new HistoryItemBackground(this.src)).redo();
						$(this).parent(".ui-dialog-content").dialog("close");
					});
					output(i);
				}
			},
			crel("div", {"class": "clear"})
		)).dialog({
			minWidth: 630,
			modal: true,
			buttons: {
				'Abbruch': function () { $(this).dialog("close"); }
			}	
		});
	});

	$("#btnDup").click(function() {
		window.scene.history.append(new HistoryItemDuplicate(window.scene.getSelection())).redo();
	});
	$("#btnDel").click(function() {
		window.scene.history.append(new HistoryItemDelete(window.scene.getSelection())).redo();
	});
	$("#btnToTop").click(function() {
		window.scene.history.append(new HistoryItemChLayerTop(window.scene.getSelection())).redo();
	});
	$("#btnToBottom").click(function() {
		window.scene.history.append(new HistoryItemChLayerBottom(window.scene.getSelection())).redo();
	});
	$("#btnDown").click(function() {
		window.scene.history.append(new HistoryItemChLayerDown(window.scene.getSelection())).redo();
	});
	$("#btnUp").click(function() {
		window.scene.history.append(new HistoryItemChLayerUp(window.scene.getSelection())).redo();
	});

	// keys
	$(document).on('keydown', function(e) {
		if ($(e.target).is('input, textarea'))
			return;   
		console.log(""+(e.shiftKey?"S":"")+(e.ctrlKey?"^":"")+(e.altKey?"A":"")+(e.metaKey?"M":""), e.which);
		if (e.which === 46 /*DEL*/) {
			$("#btnDel:visible").click();
			e.preventDefault();
		}
		/*
 			DEL - löschen
			D - Duplizieren
			Pfeiltasten - Objekt verschieben (Shift für mehr/weniger)
			^Z, Shift-^Z - das übliche
			L, R - drehen
			P, N, - vorhergehendes, nächstes Element
			ESC - nichts auswählen
			^S, ^N, ^O - speichern, neu, laden
			^I - import
			F1, H, ^H - Hilfe
		*/
	});

	window.scene = new Zeichenbereich('#Zeichenbereich');
});
