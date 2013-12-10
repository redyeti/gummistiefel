/*
 * Grundlegende Klassen für den Zeichenbereich: 
 * Der Zeichenbereich selbst und die Zeichenelemente (ZeichenBild oder ZeichenText)
 */

"use strict";

function Zeichenbereich(area) {
	var myzb = this;

	this.history = new History();

	var nextId = 1;

	this.getID = function getID () {
		return nextId++;
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
		myzb.select(null);
	});


	this.clear = function clear() {
		this.history.clear();
		$hg.attr("src","bilder/hintergrunz/Back.png");
		$(area).find("*").not($hg).remove();
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
	}

	this.updateObjInfo = function updateObjInfo() {
		var $s = $($selection);
		var f = $s.data('freetrans');
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

		$("#objId").val($s.attr('id'));
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
	};

	this.getSelection = function getSelection() {
		return $selection;
	}


	/*
 	this.clear
 	this.save
	this.load
 	*/
}

function ZeichenElement(selector) {
	this.$selector = $(selector)

	this.render = function render(attributes) {
		attributes.uoid = scene.getID();

		// Rendern und Anzeigen
		var template = this.getTemplate();
		this.$selector = $(new EJS({text: template}).render(attributes));
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

	this.insert = function insert() {
		$("#Zeichenbereich").append(this.$selector);
		this.$selector.freetrans({x:20, y:20});
		this.init();
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

/*
ZeichenElement.deselectAll
*/

ZeichenBild.prototype = new ZeichenElement;
ZeichenBild.prototype.constructor = ZeichenBild;

//ZeichenBild.prototype = ZeichenElement.prototype;
function ZeichenBild(attributes) {
	ZeichenElement.call(this);
	this.getTemplate = function getTemplate() {
		return '<img alt="" title="" id="<%= uoid %>" src="<%= src %>" class="zeichen" />';
	};
	this.render(attributes);
	
}

ZeichenText.prototype = new ZeichenElement;
function ZeichenText(attributes) {
	this.getTemplate = function getTemplate() {
		return '<div><%= text %></div>';
	};
	this.render(attributes);
}
