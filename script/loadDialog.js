"use strict";

function LoadDialog(){

	var ld = this;
	var data = null;
	
	this.dialog1 = function () {
		var $dialog = $(
			crel('div', {title: 'Laden'},
				crel('p',
					'Der Kamelbaukasten kann nur SVG-Dateien laden, die mit dem Kamelbaukasten erstellt wurden.'
				),
				crel('input', {type: 'file'}
				)
			)
		);

		var disable = function() {
			$dialog.parent().find(":button:contains('Laden')").prop("disabled", true).addClass("ui-state-disabled");;
		};

		var enable = function() {
			$dialog.parent().find(":button:contains('Laden')").prop("disabled", false).removeClass("ui-state-disabled");;
		};

		var loadFn = function(e, theFile) {
			enable();
			data = e.target.result;
		}


		var loadImage = function(xml) {
			window.scene.clear();

			var elements = xml.find('*[id^=element_]');
			for (var e=0, element; element=elements[e]; e++) {
				var type = element.tagName; // svg:image or svg:text
				var oid = element.id;
				var guAttrs = {};
				for(var x=0, attr; attr=element.attributes[x]; x++) {
					if (attr.name.substr(0,3) != "gu:")
						continue;

					guAttrs[attr.name.substr(3)] = attr.value;
				}
				//TODO: create element (using custom image add function; be aware of no-history!)
				console.log('create element', oid, element)
				if (type == "svg:image") {
					var handle = new ZeichenBild({
						uoid: oid,
						src: element.getAttribute("xlink:href"),
						transformData: guAttrs,
					})
				} else if (type == "svg:text") {
					var handle = new ZeichenText({
						uoid: oid,
						text: element.textContent,
						transformData: guAttrs,
					})
				} else {
					throw "Invalid type.";
				}
				handle.insert();
			}
			window.scene.suspend();
			window.scene.resume();
		}

		$dialog.find('input[type=file]')[0].addEventListener('change', handleFileSelect('readAsText', 'image/svg\\+xml', loadFn, disable), false);

		$dialog.dialog({
			modal: true,
			minWidth: 600,
			buttons: {
				'Laden': function () {
					$(this).dialog("close");
					var xml = $($.parseXML(data));
					loadImage(xml);
					console.log(xml);					
				},
				'Abbrechen': function () { $(this).dialog("close"); }
			},
			close: function() { $(this).dialog("destroy"); }	
		});
		disable();
	};


	this.dialog1();
}
