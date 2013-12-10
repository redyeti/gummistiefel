/*
 *  Wie man ganz im Prinzip png-Dateien erzeugen kann!
 *  Achtung, canvas taints usw. beachten
 */

$c = $("<canvas>");
$c.width("800px").height("600px");
$c[0].width = 800;
$c[0].height = 600;
c=$c[0].getContext("2d");
c.drawImage($("#Hg")[0], 0, 0);

f = $("#1").data('freetrans');
ox = $('#1')[0].clientWidth / 2;
oy = $('#1')[0].clientHeight / 2;

c.translate(f.x + ox, f.y + oy);
c.scale(f.scalex, f.scaley);
c.rotate(f.angle * Math.PI / 180);
c.drawImage($("#1")[0], -ox, -oy);


location.href = $c[0].toDataURL()
