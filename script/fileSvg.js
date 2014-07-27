"use strict";
/*
 * Wie man ganz im Prinzip svg-Dateien erzeugen kann.
 * Achtung: Darauf achten, alle Dateien auch einzubetten (mit data-url, taints beachten)
 * Außerdem: Gummistiefel-Metadaten einbinden, so dass man das SVG auch wieder laden kann.
 */

function SVGWriter(linkOnly) {
	var svg = ['<svg',
		'version="1.1"',
		'xmlns="http://www.w3.org/2000/svg"',
		'xmlns:svg="http://www.w3.org/2000/svg"',
		'xmlns:xlink="http://www.w3.org/1999/xlink"',
		'xmlns:gu="http://kamelbaukasten.kamelopedia.net/standard/gummistiefel-2.0.xsd"',
		'width="800"',
		'height="600"',
		'/>'
	].join(" ");
	var $svg = $(svg);

	this.draw = function draw(el) {
		var $el = $(el);
		var f = $el.data('gum-ft');
		var d = {x:0, y:0};

		var ox = $el.width() / 2;
		var oy = $el.height() / 2;

		var translate1 = "";
		var translate2 = "";
		if (f) {
			var t1 = [f.x + (2.0-f.scalex/1.0)*ox, f.y + (2.0-f.scaley/1.0)*oy];
			var t2 = [-1.0*ox, -1.0*oy];

			// Text an der Oberkante ausrichten
			// (baseline-attribute im svg funktionieren nicht überall)
			// Das hier tut's leider nur so ungefähr ...
			if ($el.is('div.zeichen')) {
				t1[1] += parseInt($el.css('font-size')) / 2;
				t1[1] += $el.height()/2;
			}

			translate1 = 'translate(' + t1[0] + ',' + t1[1] + ') ';
			translate2 = 'translate(' + t2[0] + ',' + t2[1] + ') ';
		}

		d.style = "";
		d.id = $el.attr('id');
		d.opacity = $el.css('opacity');

		for (var k in f) {
			var v = f[k];
			d["gu:"+k] = v;
		}

		//TODO: also try -webkit-... etc.
		if ($el.css('transform') != 'none') {
			//console.log($el.css('transform'));
			d.transform = translate1 + $el.css('transform') + translate2;
		}

		if ($el.is('img')) {

			var url;
			if (linkOnly) {
				url = location.href.replace(/[^/]*$/,"") + $el.attr('src');
			} else {
				// prepare Image
				var $canvas = $("<canvas>");
				$canvas[0].width = $el.width();
				$canvas[0].height = $el.height();
				var context = $canvas[0].getContext("2d");
				context.drawImage($el[0], 0, 0, $el.width(), $el.height());		
				url =  $canvas[0].toDataURL();
			}

			d.height = $el.height();
			d.width = $el.width();
			d["xlink:href"] = url;
			$svg.append(crel("svg:image", d));
		} else if ($el.is('div.zeichen')) {

			d.fill = $el.css('color');
			d['font-size'] = $el.css('font-size');
			d['font-family'] = $el.css('font-family');

			$svg.append(crel("svg:text", d, $el.text()));
		} else {
			throw "Invalid object.";
		}
	}

	this.getDom = function getDom() {
		return $svg;
	}
	this.getUrl = function getUrl(callback) {
		//console.log("get the url...");
		//this is a bit of a hack ...
		var data = $("<div>").append($svg).html();
		callback("data:image/svg+xml," + encodeURIComponent(data));
	}

	this.getData = function getData() {
		return $("<div>").append($svg).html();
	}
}

function scene2svg(callback, linkOnly) {
	var w = new SVGWriter(linkOnly)
	scene.suspend();
	$("#Zeichenbereich").children().each(function () {
	    w.draw(this);
	});
	scene.resume();
	//return w.getDom()
	w.getUrl(callback);
}
