/*
 * Aktionen = jede Änderung an einem Zeichenelement oder der Zeichenfläche ist eine Aktion
 * Jede Aktion muss über die History abgewickelt werden, damit rückgängig und wiederholen funktionieren.
 * Daher wird jeder Aktions-Typus als HistoryItem repräsentiert, auf die History aufgesetzt und ausgeführt.
 */

function HistoryItemCreate(handle) {
	this.redo = function redo() {
		handle.insert();
		window.scene.select(handle.$selector);
	};
	this.undo = function undo() {
		handle.remove();
		window.scene.selectionFix();
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
		$element.data('gum-ft', after);
	};
	this.undo = function undo() {
		$element.data('gum-ft', before);
	};
	this.getText = function getText() {
		return "Element bewegen / transformieren";
	};
}

function HistoryItemTransformField(element, prop, after, factor) {
	var $element = $(element);
	var before = $element.data('freetrans')[prop];
	
	this.redo = function redo() {
		$element.data('gum-ft')[prop] = parseFloat(after)/factor;
	};

	this.undo = function undo() {
		$element.data('gum-ft')[prop] = parseFloat(before)/factor;
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

function HistoryItemDuplicate(orig) {
	var $orig = $(orig);

	// avoid duplicate ids
	var id = $orig.attr('id');
	$orig.removeAttr('id');
	window.scene.suspend();

	var $deriv = $orig.clone(false);
	$deriv.data('gum-ft', new Copy($orig.data('gum-ft')));

	// reassign ids
	$orig.attr('id',id);
	$deriv.attr('id', scene.getID());
	window.scene.resume();

	this.redo = function redo() {
		$deriv.insertBefore($orig).gs('reInit');
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
	window.scene.suspend();
	var $prev = $item.prev();
	window.scene.resume();

	console.log("del",$item,$prev);

	this.redo = function redo() {
		$item.gs('remove');
	};
	this.undo = function undo() {
		$item.insertAfter($prev);
	};
	this.getText = function getText() {
		return "Löschen";
	};
}

function HistoryItemChLayer(item, aim) {
	var $item = $(item);
	window.scene.suspend();
	var $prev = $item.prev();
	window.scene.resume();

	this.redo = function redo() {
		aim($item);
	};
	this.undo = function undo() {
		$item.prependAfter($prev, "#Zeichenbereich");
	};
	this.getText = function getText() {
		return "Ebene ändern";
	};
}

function HistoryItemChLayerBottom(item) {
	HistoryItemChLayer.call(this, item, function ($item) {
		$item.insertAfter("#Hg");
	});
}

function HistoryItemChLayerTop(item) {
	HistoryItemChLayer.call(this, item, function ($item) {
		$item.appendTo($item.parent());
	});
}

function HistoryItemChLayerUp(item) {
	HistoryItemChLayer.call(this, item, function ($item) {
		$item.insertAfter($item.next(".zeichen"));
	});
}

function HistoryItemChLayerDown(item) {
	HistoryItemChLayer.call(this, item, function ($item) {
		$item.insertBefore($item.prev(".zeichen"));
	});
}

function HistoryItemBackground(newUrl) {
	var oldUrl = $("#Hg").attr('src');
	this.redo = function redo() {
		$("#Hg").attr('src',newUrl);
	}
	this.undo = function undo() {
		$("#Hg").attr('src',oldUrl);
	}
	this.getText = function getText() {
		return "Hintergrunz ändern";
	}
}
