/*
 * Aktionen = jede Änderung an einem Zeichenelement oder der Zeichenfläche ist eine Aktion
 * Jede Aktion muss über die History abgewickelt werden, damit rückgängig und wiederholen funktionieren.
 * Daher wird jeder Aktions-Typus als HistoryItem repräsentiert, auf die History aufgesetzt und ausgeführt.
 */

function HistoryItemCreate(handle) {
	this.redo = function redo() {
		handle.insert();
	};
	this.undo = function undo() {
		handle.remove();
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

function HistoryItemTransformField(element, prop, after, factor) {
	var $element = $(element);
	var before = $element.data('freetrans')[prop];
	
	this.redo = function redo() {
		var o = new Copy($element.data('freetrans'));
		o[prop] = parseFloat(after)/factor;
		$element.freetrans('destroy');
		$element.freetrans(o);
		$element.data('gum-ft', new Copy($element.data('freetrans')));
	};

	this.undo = function undo() {
		var o = new Copy($element.data('freetrans'));
		o[prop] = parseFloat(before)/factor;
		$element.freetrans('destroy');
		$element.freetrans(o);
		$element.data('gum-ft', new Copy($element.data('freetrans')));
	};

	this.getText = function getText() {
		return "Element bewegen / transformieren";
	}
}

function HistoryItemCSS(element, prop, after) {
	var $element = $(element);
	var before = $element.css(prop);
	
	this.redo = function redo() {
		$element.css(prop, after);
	};

	this.undo = function undo() {
		$element.css(prop, before);
	};

	this.getText = function getText() {
		return "CSS-Eigenschaft " + prop;
	}
}

$.fn.prependAfter = function(siblingSelector, parentSelector) {
	var $s = siblingSelector;
	var $p = parentSelector;

	if ($s.length)
		return this.insertAfter(siblingSelector);
	else
		return this.prependTo(parentSelector);
}

function HistoryItemDuplicate(orig) {
	var $orig = $(orig);

	// avoid duplicate ids
	var id = $orig.attr('id');
	$orig.removeAttr('id');
	$orig.gs('deInit');

	var $deriv = $orig.clone(false);
	$deriv.data('gum-ft', new Copy($orig.data('gum-ft')));

	// reassign ids
	$orig.attr('id',id);
	$deriv.attr('id', scene.getID());

	this.redo = function redo() {
		$orig.gs('deInit');
		$deriv.insertBefore($orig).gs('reInit');
		$orig.gs('reInit');
	};
	this.undo = function undo() {
		$deriv.gs('remove');
	};
	this.getText = function getText() {
		return "Element duplizieren";
	};
}

function HistoryItemDelete(item) {
	var $item = $(item);
	var $prev = $($item.parents().andSelf().prevAll().find(".zeichen")[0]);

	console.log("del",$item,$prev);

	this.redo = function redo() {
		$item.gs('remove');
	};
	this.undo = function undo() {
		$prev.gs('deInit');
		$item.prependAfter($prev, "#Zeichenbereich").gs('reInit');
		$prev.gs('reInit');
	};
	this.getText = function getText() {
		return "Löschen";
	};
}

function HistoryItemChLayer(item, aim) {
	var $item = $(item);

	var $pAll = $item.parents().andSelf();

	var $zPrev = $pAll.prevAll().find(".zeichen");
	var $zNext = $pAll.nextAll().find(".zeichen");

	var $prev = $($zPrev[0]);

	var $aim = aim($zPrev, $zNext, $prev);

	this.redo = function redo() {
		console.log("Layer", $item, $aim, $prev);
		$item.gs('deInit');
		$aim.gs('deInit');
		$item.prependAfter($aim, "#Zeichenbereich").gs('reInit');
		$aim.gs('reInit');
	};
	this.undo = function undo() {
		$item.gs('deInit');
		$prev.gs('deInit');
		$item.prependAfter($aim, "#Zeichenbereich").gs('reInit');
		$prev.gs('reInit');
	};
	this.getText = function getText() {
		return "Ebene ändern";
	};
}

//HistoryItemChLayerTop.prototype = new HistoryItemChLayer();
function HistoryItemChLayerBottom(item) {
	HistoryItemChLayer.call(this, item, function ($zPref, $zNext, $prev) {
		return $(null);
	});
}

//HistoryItemChLayerBottom.prototype = new HistoryItemChLayer();
function HistoryItemChLayerTop(item) {
	HistoryItemChLayer.call(this, item, function ($zPref, $zNext, $prev) {
		return $(($zNext.length) ? $zNext[$zNext.length-1] : $zPrev[0]);
	});
}

//HistoryItemChLayerDown.prototype = new HistoryItemChLayer();
function HistoryItemChLayerUp(item) {
	HistoryItemChLayer.call(this, item, function ($zPref, $zNext, $prev) {
		return $($zNext[0]);
	});
}

//HistoryItemChLayerUp.prototype = new HistoryItemChLayer();
function HistoryItemChLayerDown(item) {
	HistoryItemChLayer.call(this, item, function ($zPrev, $zNext, $prev) {
		return $(($zPrev.length > 1) ? $zPrev[1] : $zPrev[0]);
	});
}
