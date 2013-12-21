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

	context.textBaseline = "top";
	context.textAlign = "left";

	this.draw = function draw(el) {
		var $el = $(el);
		context.save();

		var f = $el.data('gum-ft');
		if (f) {
			var ox = $el[0].clientWidth;
			var oy = $el[0].clientHeight;


			// freetrans gibt die x- und y-Koordinaten sehr merkwürdig an:
			// der x-wert bezeichnet die Stelle, der rechten unteren Ecke,
			// abzüglich der unskalierten Breite des Objektes; y Analog.
			// Demnach liegt der Mittelpunkt bei x+(1-scalex/2)*breite.
			// Daher ergibt sich folgede Berechnung:
			context.translate(f.x + (1-f.scalex/2.0)*ox, f.y + (1-f.scaley/2.0)*oy);
			context.rotate(f.angle * Math.PI / 180);
			context.scale(f.scalex, f.scaley);
			context.translate(-0.5*ox, -0.5*oy);
		} 	

		if ($el.is('img')) {
			console.log("draw", $el.attr('src'));
			context.drawImage($el[0], 0, 0, $el.width(), $el.height());		
		} else if ($el.is('div')) {
			context.fillStyle = $el.css('color');
			context.font = (function (e) { 
				var out = [];
				for (var x in e) {
					out.push($el.css(x));
				}
				return out.join(" ");
			})(["font-family", "font-size", "font-weight"])
			context.fillText($el.text(),-ox,-oy);
		} else {
			throw "Invalid object.";
		}
		context.restore();
	}

	this.getUrl = function() {
		return $canvas[0].toDataURL();
	}
}

function scene2png() {
	var w = new PNGWriter()
	scene.suspend();
	$("#Zeichenbereich").children().each(function () {
	    w.draw(this);
	});
	scene.resume();
	return w.getUrl();
}
