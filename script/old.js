
	//global vars

	var uoID = 0; //unique object ID
	var zNow = 200; // z-index modificator

	// text properties
	var tcol   = "black";
	var tsize  = "12";
	var tfont  = "Arial";
	var tstyle = "normal";
	var tweight= "normal";
	var tdeco  = "none";
	var tspace = "1";

	// default Zeichenbereich (wird nach dem Erstellen der Seite gefüllt)
	var defaultZArea = null;

	// current selection
	var selection = $([]);

	// prefixes for browser dependend css styles
	var browserprefixes = ["", "-o-","-moz-","-webkit-","-ms-"];


	// Öffnet den Hintergrund-Wechsel-Dialog
	function open_background_dialog(){
		window.open("Popups/change_backgr.html", "Hintergrund_aendern","height=400, width=400, left=300, top=400");
	}

	// Öffnet den Autoren-Dialog
	function open_autoren(){
		window.open("Popups/Autoren.html", "Autoren","scrollbars=yes, height=400, width=600, left=400, top=300");
	}

	// Öffnet die Hilfe
	function open_hilfe(){
		window.open("Popups/Hilfe.html", "Hilfe","scrollbars=yes, height=400, width=420, left=400, top=300");
	}

	// Öffnet den Grafik-Dialog
	function open_uploaddialog(){
		window.open("Popups/upload.html", "Bild_einfuegen","height=120, width=560, left=300, top=400");
	}

	// Hilfsfunktion für die Erstellung von neuen Objekten 
	// Kümmert sich um die Id und um alles, was alle Zeichenobjekte gemeinsam haben
	function create($inner){
		++uoID;
		var name = 'Nr_'+uoID;

		var $ndiv = $('<div/>');
		$ndiv.attr('id',name);

		$inner.dblclick(function(){
			this.style.zIndex = ++zNow;
			mk_infobox($(this).parent());
		});

		$inner.click(function(){
			mk_infobox($(this).parent());
		});

		$inner.attr('class', 'drag');
		$inner.css("position","absolute");
		$inner.css("top","20px");
		$inner.css("left","20px");

		$ndiv.append($inner);
		$('#Zeichenbereich').append($ndiv)
	}

	// Fügt ein Bild von irgendwo mit den Namen "objname" zum Bild hinzu
	function add_bild(objname){

		var $img = $("<img alt='' title='' />");
		$img.attr('src', objname);

		create($img);
	}

	// Fügt ein Objekt aus dem Bilderordner mit dem namen "objname" zum Bild hinzu
	function add_obj(objname){
		return add_bild("Bilder/"+objname);
	}

	function del_obj(objname){
		if (uoID > 0){
			$('#Zeichenbereich')[0].removeChild(document.getElementById("Nr_" +uoID));
			--uoID;
			hide_infobox();
		}
	}

	function del_ask($obj){
		var frage = confirm("Objekt wirklich löschen?");
		if (frage){
			$($obj).remove();
			hide_infobox();
		}
	}

	function clone_selection(){
		var $clones = selection.children().clone();
		$clones.css("border","none");
		$clones.css("margin","0px");
		create($clones);
	}

	// Leert den Bildschirm
	function neu(){
		var frage = confirm('Möchten Sie das aktuelle Bild wirklich löschen?');
		if (frage==true){
			$("#Zeichenbereich").html(defaultZArea);
			awaySplash();
			uoID = 0;
		} 
	}


	function mk_infobox($el){
		update_selection_box(true);
		$("#infobox").show();
		selection = $el;
		update_selection_box();
		
		var $img = $el.children();
		
		// update box title
		$("#cselid").text($el.attr("id"));

		// get width and height 

		if ($el.data("width") == null) {
			$el.data("width",$img.width());
		}
		
		if ($el.data("height") == null) {
			$el.data("height",$img.height());	
		}
		
		$("#sel_width").val(parseInt($img.width()/$el.data("width")*100));
		$("#sel_height").val(parseInt($img.height()/$el.data("height")*100));

		// get rotation

		if ($el.data("rotation") == null) {
			$el.data("rotation", 0) 
		}

		$("#sel_rotation").val(parseInt($el.data("rotation")));

		// get alpha

		if ($el.data("alpha") == null) {
			$el.data("alpha", 100) 
		}

		$("#sel_alpha").val(parseInt($el.data("alpha")));
		
		// get z-index

		$("#sel_zindex").val($img.css("z-index"));
	}

	function hide_infobox(){
		$("#infobox").hide();
		update_selection_box();
	}

	function update_selection_box (unmask){
		if (!unmask && $('#showselbox').attr('checked') && $("#infobox").is(":visible")) {
			selection.children().css("border","1px red dashed");
			selection.children().css("margin","-1px");
		} else {
			selection.children().css("border","none");
			selection.children().css("margin","0px");
		}
	}

	function update_selection() {
		$img = selection.find("img");

		// set width and height
		$img.width(selection.data("width")*parseInt($("#sel_width").val())/100);
		$img.height(selection.data("height")*parseInt($("#sel_height").val())/100);
		
		// set rotation
		var rotation = parseInt($("#sel_rotation").val());
		selection.data("rotation", rotation);

		$.each(browserprefixes, function (num, prefix) {
			$img.css(prefix+"transform","rotate("+rotation+"deg)");
		});

		// set alpha
		selection.data("alpha", parseInt($("#sel_alpha").val()));

		$.each(browserprefixes, function (num, prefix) {
			$img.css(prefix+"opacity",parseInt($("#sel_alpha").val())/100);
		});

		// set z-index
		$img.css("z-index", $("#sel_zindex").val());

		// update infobox
		mk_infobox(selection);
		return false;
	}

	// Entfernt den Splash
	function awaySplash(){
		$('#splsh')[0].innerHTML="";
	}

	function splash(){
		window.setTimeout("awaySplash()",4000);
	}

	// erstellt den Text aus der Infobox
	function enter_txt(){
		var ttext=$.trim($('#test').val());
		if(ttext != ""){
			var $text = $("<div style='height:60px; padding:20px; margin:20px; max-width:800px;'/>");
			$text.css("color", tcol);
			$text.css("font-family", tfont);
			$text.css("font-size", tsize+"px");
			$text.css("font-style", tstyle);
			$text.css("font-weight", tweight);
			$text.css("text-decoration", tdeco);
			$text.css("letter-spacing", tspace+"px");
			$text.text(ttext);
			create($text);
		}
	}

