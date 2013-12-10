/*
 * Wie man ganz im Prinzip svg-Dateien erzeugen kann.
 * Achtung: Darauf achten, alle Dateien auch einzubetten (mit data-url, taints beachten)
 * Außerdem: Gummistiefel-Metadaten einbinden, so dass man das SVG auch wieder laden kann.
 */

svg = '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">  <rect width="300" height="100" style="fill:rgb(0,0,255);stroke-width:1;stroke:rgb(0,0,0)" /></svg>';
$(svg).appendTo("body");
window.open("data:image/svg," + encodeURI(svg));
