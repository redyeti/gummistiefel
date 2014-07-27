/*
 * Initialisierungen etc.
 */

"use strict";

$(function () {
	$("#librarySelect input").button();

	// Initialisiere Bilder links
	$("#libTradi").click(function () {
		loadLibrary("traditionell");
	});
	$("#libVector").click(function () {
		loadLibrary("vector");
	});
	$("#libKamelo").click(function () {
		new KpLibraryDialog();
	});

	$("#libTradi").click();

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
		new SaveDialog();
	});
	$("#btnLaden").click(function () {
		new LoadDialog();
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
			crel("div", {"class": "clear", style: "margin-bottom: 20px;"}),
			function(output) {
				var input = crel("input", {type: "file", style: "display:none;"});
				input.addEventListener('change', handleFileSelect("readAsDataURL", "image/.*", function(e) {
					var src = e.target.result;
					window.scene.history.append(new HistoryItemBackground(src)).redo();
					$(".ui-dialog-content").dialog('close');
				}), false);
				var btn = crel("input", {type: "button", value: "… oder lade eine Datei von deinem Rechner"});
				$(btn).button();
				$(btn).click(function(){input.click()});
				output(btn);
			},
			crel("br"),
			"Sollte 800×600 Pixel groß sein oder zumindest das richtige Seitenverhältnis haben (Bitte Lizenzen beachten)"
		)).dialog({
			minWidth: 630,
			modal: true,
			buttons: {
				'Abbruch': function () { $(this).dialog("close"); }
			}	
		});
	});

	(function () {
		$("#btnBild").click(function() {
			var input = crel("input", {type: "file", style: "display:none;"});
			input.addEventListener('change', handleFileSelect("readAsDataURL", "image/.*", function(e) {
				var src = e.target.result;
				new ZeichenBild({src: src});
			}), false);
			input.click();
		});
	})();

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

		// TODO: Use meta on mac instead of WHICH key?
		var evt = (e.ctrlKey?"C":"") + (e.shiftKey?"S":"") + (e.altKey?"A":"") + (e.metaKey?"M":"") + e.which;

		console.log("Key Event", evt);
		var bindings = {
			/*
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
			// DEL - löschen
			46: function () { $("#btnDel:visible").click(); },
			// T - Text einfügen
			84: function () { $("#btnText").click(); }			
		}
		var currentBinding = bindings[evt];
		if (currentBinding) {
			currentBinding();
			e.preventDefault();
		}


	});

	$("#btnText").click( function (evt) {
		new ZeichenText({text: "Text"});
	});

	$("#fColor").spectrum({
		color: "#000",
		showInput: true,
		showPalette: true,
		palette: [
			['black', 'gray', 'silver', 'white', 'maroon', 'red', 'yellow', 'fuchsia'],
			['olive', 'green', 'lime', 'teal', 'navy', 'blue', 'aqua', 'purple', ],
		],
		showSelectionPalette: true,
		preferredFormat: "name",
		showInitial: true,
		change: function(color) {
			scene.history.append(new HistoryItemCSS(window.scene.getSelection(), 'color', color.toHexString())).redo();
		}
	});

	$("#fFamily").autocomplete({
		delay: 0,
		minLength: 0,
		source: [
			'Arial',
			'Arial Black',
			'Century Schoolbook',
			'Comic Sans MS',
			'Garamond',
			'Helvetica',
			'Impact',
			'Lucida Console',
			'Rockwell',
			'Times New Roman',
			'Verdana',
			'serif',
			'sans-serif',
			'monospace',
			'fantasy',
			'cursive'
		]
});
	$("#fFamily").focus(function () {
		$(this).autocomplete('search', '');
	});
	$("#fFamily").click(function () { $(this).trigger('focus'); });

	//FIXME: this does not work! --> event of autocomplete? (+ enter)
	$("#fFamily").blur(function () { scene.history.append(new HistoryItemCSS(scene.getSelection(), 'font-family', $(this).val())).redo(); console.log("c");});
	$("#fFamily").change(function () { scene.history.append(new HistoryItemCSS(scene.getSelection(), 'font-family', $(this).val())).redo(); console.log("c");});


	$("#fText").change(function() {
		window.scene.history.append(new HistoryItemText(scene.getSelection(), $(this).val())).redo();
		
	});

	window.scene = new Zeichenbereich('#Zeichenbereich');

	var oldfreetrans = $.fn.freetrans;
	console.log(oldfreetrans);
	$.fn.freetrans = function() {
		var t = this;
		var $this = this;
		var args = arguments;
		if ($this.width() == 0 || $this.height == 0){
			// use deferred freetrans if necessary
			$this.load(function() {
				oldfreetrans.apply(t, args);
			});
			return $this;
		} else {
			return oldfreetrans.apply(this, args);
		}
	}
});

function iframe_dialog(title, src) {
	$("#iframeDialog iframe").attr('src', src);
	$("#iframeDialog").attr('title', title).show().dialog({
		width: 800,
		height: 600,
		buttons: {
			'Ok': function () { $(this).dialog("close"); }
		}
	});
}
