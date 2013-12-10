/*
 * Hilfsfunktionen, die nirgendwo so richtig hinpassen
 */

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

