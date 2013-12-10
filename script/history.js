/*
 * Die Definition der History - für rückgängig und wiederholen.
 */

"use strict";

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
			$("#btnVor").attr('title', 'Wiederholen: ' + actionStack[nextAction].getText());
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

	this.isEmpty = function isEmpty() {
		return ! actionStack.length;
	}

	this.clear = function clear() {
		actionStack = [];
		nextAction = 0;
		updateButtons();
	}

	/*
	this.clear
	*/
}

