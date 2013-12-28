function SaveDialog () {

	var sd = this;

	this.dialog1 = function () {
		var $tabs = [
			"Speichern als: <select>",
			"		<option value='Gum'>Gum</option>",
			"		<option value='Svg'>Svg</option>",
			"		<option value='Png'>Png</option>",
			"</select>",
			"<div id='spGum'>Gum-Dateien sind dem Kamelbaukasten sein eigenes Dateiformat. Hier steht nur das absolut nötigste drin, dafür kann das Format zwar vom Kamelbaukasten, aber auch von keinem anderen Grafikprogramm gelesen werden. Gum steht natürlich für Gummistiefel.</div>",
			"<div id='spSvg'>SVGs werden vielleicht ein bisschen größer als PNGs, können dafür aber auch wieder geladen und bearbeitet werden.<br>Tipp: Benutze die Dateiendung .g.svg (nur) für Dateien die direkt mit dem Kamelbaukasten erstellt wurden, so ist schon durch die Endung klar, ob die Dateien wieder geladen werden können.</div>",
			"<div id='spPng'>PNGs können vom Kamelbaukasten nur geschrieben, aber später nicht mehr geladen werden.</div>"
		].join(" ");
		var $dialog = $("<div title='Speichern'></div>").append($tabs);
		var $select = $dialog.find("select");
		$select.change(function() {
			var id = '#sp'+$(this).val();
			$(this).parent().find("div").not(id).hide();
			$(id).show();
		});
		$select.trigger('change');

		$dialog.dialog({
			modal: true,
			minWidth: 600,
			buttons: {
				'Speichern': function () {
					filetype = $select.val();
					$(this).dialog("close");
					sd.dialog2(filetype);
				},
				'Abbrechen': function () { $(this).dialog("close"); }
			},
			close: function() { $(this).dialog("destroy"); }	
		});
	};

	this.render = function (filetype) {
		return window['scene2' + filetype.toLowerCase()]();
	};

	this.dialog2 = function (filetype) {
		var result = this.render(filetype);
	
		var $dialog = $(crel("div", {
			title:'Speichern',
			style:'text-align:center;'},
			"Fertig! Warte kurz auf das Vorschaubild und klicke dann auf \"Download\". Solltest du Probleme mit dem Download-Link haben, klicke mit rechts auf das Vorschaubild und wähle \"Bild speichern unter\".",
			crel("br"),
			crel("a", {
				href: result,
				target: "_blank",
				download: "gummistiefel.g."+filetype.toLowerCase()
			},
				crel("img", {
					'class': 'previewImage',
					style: 'width: 150px;',
					alt: '... bitte warten ...'
				}),
				crel("br"),
				"Download"
			)
		));
		
		$dialog.dialog({
			modal: true,
			buttons: {
				'Schließen': function () { $(this).dialog("close"); }
			},
			close: function() { $(this).dialog("destroy"); }	
		});
		$dialog.find("img.previewImage").attr('src',result);
	}

	this.dialog1();
}
