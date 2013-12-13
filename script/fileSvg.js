"use strict";
/*
 * Wie man ganz im Prinzip svg-Dateien erzeugen kann.
 * Achtung: Darauf achten, alle Dateien auch einzubetten (mit data-url, taints beachten)
 * Außerdem: Gummistiefel-Metadaten einbinden, so dass man das SVG auch wieder laden kann.
 */

function SVGWriter() {
	var svg = ['<svg',
		'version="1.1"',
		'xmlns="http://www.w3.org/2000/svg"',
		'xmlns:svg="http://www.w3.org/2000/svg"',
		'xmlns:xlink="http://www.w3.org/1999/xlink"',
		'width="800"',
		'height="600"',
		'/>'
	].join(" ");
	var $svg = $(svg);

	this.draw = function draw(el) {
		var $el = $(el);
		if ($el.is('img')) {
			var f = $el.data('gum-ft');
			var d = {x:0, y:0};

			var ox = $el.width() / 2;
			var oy = $el.height() / 2;

			var translate1 = "";
			var translate2 = "";
			if (f) {
				var t1 = [f.x + (2.0-f.scalex/1.0)*ox, f.y + (2.0-f.scaley/1.0)*oy];
				var t2 = [-1.0*ox, -1.0*oy];

				translate1 = 'translate(' + t1[0] + ',' + t1[1] + ') ';
				translate2 = 'translate(' + t2[0] + ',' + t2[1] + ') ';
				//translate1 = 'translate(' + (f.x+ox) + ',' + (f.y+oy) + ') ';
				//translate2 = 'translate(' + (-ox) + ',' + (-oy) + ') ';
			}

			// prepare Image
			var $canvas = $("<canvas>");
			$canvas[0].width = $el.width();
			$canvas[0].height = $el.height();
			var context = $canvas[0].getContext("2d");
			context.drawImage($el[0], 0, 0, $el.width(), $el.height());		
			var url =  $canvas[0].toDataURL();

			d["xlink:href"] = url;
			d.id = $el.attr('id');
			d.height = $el.height();
			d.width = $el.width();
			//TODO: also try -webkit-... etc.
			if ($el.css('transform') != 'none') {
				console.log($el.css('transform'));
				d.transform = translate1 + $el.css('transform') + translate2;
			}

			$svg.append(crel("svg:image", d));
		} else {
			throw "Invalid object.";
		}
	}

	this.getDom = function getDom() {
		return $svg;
	}
	this.getUrl = function getUrl() {
		console.log("get the url...");
		//this is a bit of a hack ...
		var data = $("<div>").append($svg).html();
		return "data:image/svg+xml," + encodeURIComponent(data);
	}
}

function scene2svg() {
	var w = new SVGWriter()
	scene.suspend();
	$("#Zeichenbereich").children().each(function () {
	    w.draw(this);
	});
	scene.resume();
	//return w.getDom()
	return w.getUrl();
}
