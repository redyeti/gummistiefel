var gui = {
	place: function place (src) {
		var element = new EJS({url: 'templates/newImage.ejs'}).render({src: src});
	}
}
