var CanvasArtist;

(function(){
	var canvas, leftOffset, topOffset, ctx;
	var images = {};
	var timeColors = [
		"#000000",
		"#AA00AA",
		"#FFFF00",
		"#0000FF",
		"#00AA00",
		"#B8860B",
		"#008080",
		"#F4A460",
		"#BC8F8F",
		"#00FF00"
	];

	CanvasArtist = function(opts) {
		canvas = document.getElementById(opts.canvasid);
		ctx = canvas.getContext("2d");
		topOffset = opts.topOffset;
		leftOffset = opts.leftOffset;
		loadImages();

		CanvasArtist.resizeCanvas();
		return CanvasArtist;
	};

	CanvasArtist.images = images;

	CanvasArtist.getColor = function(index) {
		return timeColors[index];
	};

	CanvasArtist.resizeCanvas = function() {
		canvas.width = $(window).width()-230;
		canvas.height = $(window).height();
		canvas.style.top = topOffset;
		canvas.style.left = leftOffset;
	};

	CanvasArtist.clear = function()
	{
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	};

	CanvasArtist.getContext = function() {
		return ctx;
	};

	CanvasArtist.getCanvas = function() {
		return canvas;
	};

	CanvasArtist.drawCircleAtPoint = function(x, y, r, fill)
	{
		ctx.beginPath();
		ctx.arc(x,y,r,0,Math.PI*2,true);
		if (fill === true)
		{
			ctx.fill();
		}
		else
		{
			ctx.stroke();
		}
		ctx.closePath();
	};

	CanvasArtist.drawImageAtPoint = function(x, y, imgName, label)
	{
		var img = images[imgName];

		if (img !== undefined)
		{
			ctx.globalAlpha = .75;
			ctx.drawImage(img, x-img.width/2, y-img.height/2);
			ctx.globalAlpha = 1;
			if (label !== undefined)
			{
				ctx.font = "11pt Arial bold";
				ctx.fillText(label, x-30, y-26);
			}
		}
	};

	CanvasArtist.drawTrajectory = function(points, events)
	{
		ctx.beginPath();
		ctx.moveTo(points[0].x, points[0].y);
		for (var i=1; i < points.length; i++)
		{
			ctx.lineTo(points[i].x, points[i].y);
			ctx.stroke();
		}
		ctx.closePath();
		for (var i=1; i < points.length-1; i++) {
			ctx.strokeStyle = timeColors[i];
			ctx.fillStyle = timeColors[i];
			CanvasArtist.drawCircleAtPoint(points[i].x, points[i].y, 6, true);
		}

		for (var flyingEvent in events)
		{
			var vehicleEventTimestamps = events[flyingEvent];
			ctx.strokeStyle = "#FF0000";
			for (var timestamp in vehicleEventTimestamps)
			{
				var flyingEventPoint = points[timestamp];
				CanvasArtist.drawCircleAtPoint(flyingEventPoint.x, flyingEventPoint.y, flyingEventPoint.r, false);
			}
		}
		ctx.fillStyle = "#000000";
		ctx.strokeStyle = "#000000";
	};

	CanvasArtist.calculateX = function(x)
	{
		return x - canvas.offsetLeft;
	};

	CanvasArtist.calculateY = function(y)
	{
		return y - canvas.offsetTop;
	};

	function loadImages()
	{
		var airplane = new Image();
		airplane.src = "./images/airplane.png";
		airplane.onload = function() { images.airplane = airplane; };

		var star = new Image();
		star.src = "./images/star.png";
		star.onload = function() { images.star = star; };
	}

})();

