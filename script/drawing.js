/*
 * Grundlegende Klassen für den Zeichenbereich: 
 * Der Zeichenbereich selbst und die Zeichenelemente (ZeichenBild oder ZeichenText)
 */

"use strict";

function Zeichenbereich(area) {
	var myzb = this;

	this.history = new History();

	var nextId = 1;
	var suspended = false;

	this.getID = function getID () {
		while ($('#element_'+(nextId)).length)
			nextId++;
		return 'element_'+(nextId);
	}

	var $selection = $(null);

	$(area).on('freetrans', function(evt) {
		var $t = $(evt.target); 
		if (!comp($t.data('gum-ft'), $t.data('freetrans'))) {
			scene.history.append(new HistoryItemTransform($t)).refresh();
			$t.data('gum-ft', new Copy($t.data('freetrans')));
			myzb.updateObjInfo();
		}
	});

	$(area).on('mousedown', '.ft-widget', function(evt) {
		var $t = $(evt.target); 
		myzb.select($t);		
		evt.stopPropagation();
	});
	
	//FIXME: use $(area).find(".hg")
	var $hg = $("#Hg");

	$hg.on('dragstart', function(evt) {
		return false;
	});
	$hg.on('mousedown', function(evt) {
		// Benutze Timeout, um sicherzustellen, dass 
		// andere Events (change, etc.) vorher ablaufen,
		// die das aktuell ausgewählte Objekt beeinflussen.
		window.setTimeout(function () {myzb.select(null);}, 0);
	});

	this.clear = function clear() {
		this.history.clear();
		$hg.attr("src","bilder/hintergrunz/Back.png");
		$(area).find("*").not($hg).remove();
		nextId = 1;
		this.selectionFix();
		return this;
	}

	this.select = function select($obj) {
		$obj = $($obj);
		$(area).find('.ft-widget').not($obj).freetrans('controls',false).removeClass('selected');
		$obj.freetrans('controls',true).addClass('selected');
		$selection = $obj;
		if ($obj.length) {
			$("#objInfo").show();
			myzb.updateObjInfo();
		} else {
			$("#objInfo").hide();
		}
		return this;
	}

	this.updateObjInfo = function updateObjInfo() {
		var $s = $($selection);
		var f = $s.data('freetrans');

		// if not yet initialized, deferred update
		if (f == null) {
			var h = this;
			$s.load(function () {
				h.updateObjInfo();
			})
			return;
		}

		var o = parseFloat($s.css('opacity')).toFixed(3);
		o = o.replace(/\.([0-9][1-9]*)0*/, ".$1");

		var input = function (value, action, attrib, factor) {
			var out = crel("input",{
				type: "text",
				value: value
			});
			var $out = $(out);
			$out.css('width','3em');

			$out.change(function () {
				console.log("X");
				var a = new action($s, attrib, $(this).val(), factor)
				window.scene.history.append(a).redo();
			});


			return out;
		}

		$("#objId").val($s.attr('id').substr(8));
		$("#objPos").empty().append(
			crel("table", {style: "white-space: nowrap;"},
				crel("tr",
					crel("td", "x"),
					crel("td", input(f.x, HistoryItemTransformField, 'x', 1)),
					crel("td", "y"),
					crel("td", input(f.y, HistoryItemTransformField, 'y', 1))
				),
				crel("tr",
					crel("td", "w"),
					crel("td", input(f.scalex * 100, HistoryItemTransformField, 'scalex', 100),"%"),
					crel("td", "h"),
					crel("td", input(f.scaley * 100, HistoryItemTransformField, 'scaley', 100),"%")
				),
				crel("tr",
					crel("td", "r"),
					crel("td", input(f.angle, HistoryItemTransformField, 'angle', 1),"°"),
					crel("td", "α"),
					crel("td", input(o, HistoryItemCSS, "opacity", o))
				)
			)
		);

		$(".objSpecificInfo").hide();
		if ($selection.filter("img").length) {
			$("#objGraphic").show()
		}
		if ($selection.filter("div").length) {
			$("#fFamily").val($s.css('font-family'));
			$("#fColor").spectrum('set', $s.css('color'));
			$("#fText").val($s.text());
			$("#objText").show();
		}

		return this;
	};

	this.getSelection = function getSelection() {
		return $selection;
	}

	this.suspend = function suspend() {
		if (suspended)
			throw "Do not double suspend.";

		$(area).find(".zeichen").each(function () {
			$(this).data('gum-ft', new Copy($(this).data('freetrans')));
			$(this).freetrans('destroy');
		});
		if ($("ft-controls, ft-container").length)
			throw "Could not destroy freetrans.";
		suspended = true;
		return this;
	}
	this.resume = function resume() {
		if (!suspended)
			throw "Do not double resume.";

		$(area).find(".zeichen").each(function () {
			$(this).freetrans(new Copy($(this).data('gum-ft')));
		});
		this.selectionFix();
		suspended = false;
		return this;
	}

	this.selectionFix = function selectionFix() {
		this.select(this.getSelection().filter(":visible"));
	}

	/*
 	this.clear
 	this.save
	this.load
 	*/
}

function ZeichenElement(selector, attributes) {
	this.$selector = $(selector)

	this.render = function render() {
		if (!attributes.uoid)
			attributes.uoid = scene.getID();

		// Rendern und Anzeigen
		this.$selector = $(this.create(attributes));
		// Zur Scene und zur History hinzufügen
		window.scene.history.append(new HistoryItemCreate(this)).redo();
	}

	this.init = function init() {
		this.$selector.freetrans('controls', false);
		this.$selector.data('gum-ft', new Copy(this.$selector.data('freetrans')));
	}

	this.cloneData = function cloneData() {
		this.$selector.data('gum-ft', new Copy(this.$selector.data('gum-ft')));
	}

	this.deInit = function deInit() {
		if (this.$selector.data('freetrans'))
			this.$selector.freetrans('destroy');
	}

	this.reInit = function reInit() {
		this.$selector.freetrans(new Copy(this.$selector.data('gum-ft')));
		this.$selector.freetrans('controls', false);
	}

	this.remove = function remove() {
		this.deInit()
		this.$selector.detach();
	}

	this.getTransformData = function getTransformData() {
		if (attributes.transformData) {
			for (var x=0, a; a=['x', 'y', 'angle', 'scalelimit', 'scalex', 'scaley'][x]; x++)
				attributes.transformData[a] = parseFloat(attributes.transformData[a]);
			console.log(attributes.transformData);
			return attributes.transformData;
		} else {
			return {x:20, y:20};
		}
	}

	/*
	this.select
	this.update
	*/
};

$.fn.gs = function(fn) {
	var args = Array(arguments).slice(1)
	var handle = new ZeichenElement(this);
	var result = handle[fn].apply(handle, args);
	if (result == null)
		return this;
	else
		return result;
}

function ZeichenBild(attributes) {
	ZeichenElement.call(this, null, attributes);
	var zb = this;

	this.create = function create() {
		return crel('img', {
			alt: "",
			title: "",
			id: attributes.uoid,
			src: attributes.src,
			'class': "zeichen"
			});
	};

	this.insert = function insert() {
		var handle = this;
		this.$selector.load(function () {
			handle.$selector.freetrans(zb.getTransformData());
			handle.init();
		});
		$("#Zeichenbereich").append(this.$selector);
	}

	this.render(attributes);
	
}

function ZeichenText(attributes) {
	ZeichenElement.call(this, null, attributes);
	this.create = function create() {
		return crel('div', {
			id: attributes.uoid,
			style: "cursor: pointer; font-size: 40pt;",
			'class': "zeichen"
			},
		attributes.text);
			
	}

	this.insert = function insert() {
		var handle = this;
		$("#Zeichenbereich").append(this.$selector);
		handle.$selector.freetrans(this.getTransformData());
		handle.init();
	}

	this.render(attributes);
}
