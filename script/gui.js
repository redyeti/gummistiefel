"use strict";

function Copy(x) {
	for (var i in x) {
		if (i[0] != "_")
			this[i] = x[i];
	}
}

function comp(x,y) {
	for (var i in x) {
		if (y[i] != x[i] && i[0] != "_")
			return false;
	}
	return true;
}

function Zeichenbereich(area) {
	this.history = new History();

	var nextId = 1;

	this.getID = function getID () {
		return nextId++;
	}

	$(area).on('freetrans', function(evt) {
		console.log('trans!', evt);
		var $t = $(evt.target); 
		if (!comp($t.data('gum-ft'), $t.data('freetrans'))) {
			scene.history.append(new HistoryItemTransform($t)).refresh();
			$t.data('gum-ft', new Copy($t.data('freetrans')));
		}
	});

	$(area).on('mousedown', '.ft-widget', function(evt) {
		console.log('SEL');
		var $t = $(evt.target); 
		$(area).find('.ft-widget').not($t).freetrans('controls',false).removeClass('selected');
		$($t).freetrans('controls',true).addClass('selected');
		evt.stopPropagation();
	});

	$("#Hg").on('dragstart', function(evt) {
		return false;
	});
	$('#Hg').on('mousedown', function(evt) {
		$(area).find('.ft-widget').freetrans('controls',false).removeClass('selected');
	});

	/*
 	this.clear
 	this.save
	this.load
 	*/
}

function History() {
 	var nextAction = 0;
	var actionStack = [];

	function updateButtons () {
		if (nextAction == 0) {
			// Kein Rückgängig
			$("#btnRueck").addClass("disabled").attr('title', 'Rückgängig');
			
		} else {
			$("#btnRueck").removeClass("disabled");
			$("#btnRueck").attr('title', 'Rückgängig: ' + actionStack[nextAction-1].getText());
		}

		if (nextAction == actionStack.length) {
			// Kein Wiederholen
			$("#btnVor").addClass("disabled").attr('title', 'Wiederholen');
		} else {
			$("#btnVor").removeClass("disabled");
			$("#btnRueck").attr('title', 'Wiederholen: ' + actionStack[nextAction].getText());
		}
	}

	updateButtons();

 	this.append = function append(action) {
		actionStack = actionStack.slice(0, nextAction);
		actionStack.push(action);
		return this;
	};

	this.undo = function undo() {
		actionStack[--nextAction].undo();
		updateButtons();
		return this;
	};

	this.redo = function redo() {
		actionStack[nextAction++].redo();
		updateButtons();
		return this;
	};

	this.refresh = function refresh() {
		nextAction = actionStack.length;
		updateButtons();
		return this;
	};

	this.log = function log() {
		for (var i=0; i<actionStack.length; i++) {
			console.log(i, actionStack[i], (i == nextAction - 1) ? '*' : null);
		}
	};

	/*
	this.clear
	*/
}

function HistoryItemCreate(element) {
	this.redo = function redo() {
		element.insert();
	};
	this.undo = function undo() {
		element.remove();
	};
	this.getText = function getText() {
		return "Element erzeugen";
	};
}

function HistoryItemTransform(element) {
	var $element = $(element);
	console.log("CrHist", $element);
	var before = new Copy($element.data('gum-ft'));
	var after = new Copy($element.data('freetrans'));

	console.log($element, '*', before, after);

	this.redo = function redo() {
		console.log($element, '>', before, after);
		$element.freetrans('destroy');
		$element.freetrans(new Copy(after));
		$element.data('gum-ft', new Copy($element.data('freetrans')));
	};
	this.undo = function undo() {
		console.log($element, '<', before, after);
		$element.freetrans('destroy');
		$element.freetrans(new Copy(before));
		$element.data('gum-ft', new Copy($element.data('freetrans')));
	};
	this.getText = function getText() {
		return "Element bewegen / transformieren";
	};
}

function HistoryItemUpdate(redo, undo, text) {}
function HistoryItemDelete(object) {}

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

	this.insert = function insert() {
		$("#Zeichenbereich").append(this.$selector);
		this.$selector.freetrans({x:20, y:20});
		this.$selector.freetrans('controls', false);
		this.$selector.data('gum-ft', new Copy(this.$selector.data('freetrans')));
	}

	this.remove = function remove() {
		$("#Zeichenbereich").append(this.$selector);
		this.$selector.freetrans('destroy');
		this.$selector.detach();
	}

	/*
	this.select
	this.update
	*/
};

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
/* var gui = {
	place: function place (src) {
		var element = new EJS({url: 'templates/newImage.ejs'}).render({src: src});
	}
}*/

