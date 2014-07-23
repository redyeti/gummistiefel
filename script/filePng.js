"use strict;"
/*
 *  Wie man ganz im Prinzip png-Dateien erzeugen kann!
 *  Achtung, canvas taints usw. beachten
 */

function PNGWriter() {
	var $canvas = $("<canvas>");
	$canvas[0].width = 800;
	$canvas[0].height = 600;
	var context = $canvas[0].getContext("2d");

	var DOMURL = window.URL || window.webkitURL || window;

	svgw = new SVGWriter();

	this.draw = function draw(el) {
		return svgw.draw(el);
	}

	this.getUrl = function(callback) {
		var img = new Image();
		// make this call synchronous (yuck!)
		var ready = false;
		svgw.getUrl(function(url) {
			img.src = url;
			$(img).load(function() {
				context.drawImage(img, 0, 0);
				callback($canvas[0].toDataURL());
			});
		});
	}
}

function scene2png(callback) {
	var w = new PNGWriter()
	scene.suspend();
	$("#Zeichenbereich").children().each(function () {
	    w.draw(this);
	});
	scene.resume();
	w.getUrl(callback);
}
