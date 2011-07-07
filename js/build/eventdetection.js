(function(){
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
		"#00FF00",
	];

	CanvasArtist = function(opts) {
		canvas = document.getElementById(opts.canvasid);
		ctx = canvas.getContext("2d");
		topOffset = opts.topOffset;
		leftOffset = opts.leftOffset;
		loadImages();

		CanvasArtist.resizeCanvas(opts.width, opts.height);
		return CanvasArtist;
	};

	CanvasArtist.resizeCanvas = function(width, height) {
		canvas.width = width;
		canvas.height = height;
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

	CanvasArtist.drawImageAtPoint = function(x, y, imgName)
	{
		var img = images[imgName];

		if (img !== undefined)
		{
			ctx.globalAlpha = .75;
			ctx.drawImage(img, x-img.width/2, y-img.height/2);
			ctx.globalAlpha = 1;
		}
	};

	CanvasArtist.drawTrajectory = function(points)
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

var UIManager;

(function(){
	var mode = "def";

	UIManager = function(opts) {
		$(CanvasArtist.getCanvas()).click(UIManager.canvasClicked);
		$("#" + opts.addvehiclebutton).click(UIManager.addVehicleRequest);
		return UIManager;
	};

	UIManager.addVehicleRequest = function()
	{
		if (mode === "def")
		{
			UIManager.setMode("addStartPoint");
			ConsoleOutput.log("Select Starting Point");
		}

	};

	UIManager.canvasClicked = function(e)
	{
		switch (UIManager.getMode())
		{
			case "def":
				mode ="addStartPoint";
				UIManager.canvasClicked(e);
				break;
			case "addStartPoint":
				var vehicle = new Vehicle({
					startx : CanvasArtist.calculateX(e.pageX), 
					starty : CanvasArtist.calculateY(e.pageY)
				});
				VehicleManager.addNewVehicle(vehicle);
				mode = "addEndPoint";
				break;
			case "addEndPoint":
				VehicleManager.workingVehicle.setEndPoint(
					CanvasArtist.calculateX(e.pageX), 
					CanvasArtist.calculateY(e.pageY)
				);
				VehicleManager.redraw();
				mode = "def";
				break;
		}
	};

	UIManager.getMode = function()
	{
		return mode;
	};

	UIManager.setMode = function(m)
	{
		mode = m;
	};
})();
var ConsoleOutput;

(function(){
	var table, frag;

	ConsoleOutput = function(opts)
	{
		table = document.getElementById(opts.table);
		frag = document.createDocumentFragment();
		$("#" + opts.clearbutton).click(ConsoleOutput.clear);
		return ConsoleOutput;
	};

	ConsoleOutput.log = function(message)
	{
		var tr = document.createElement("TR");
		var num = document.createElement("TD");
		var msg = document.createElement("TD");
		msg.innerHTML = message;
		msg.style.borderBottom="1px solid #000000";
		num.style.borderTop="1px solid #000000";
		msg.style.borderTop="1px solid #000000";
		tr.appendChild(msg);
		frag.appendChild(tr);
		table.appendChild(frag);
	};

	ConsoleOutput.clear = function()
	{
		$(table).empty();
	};
})();
var VehicleManager;

(function(){
	var vehicles = [];

	VehicleManager = function(opts) {

	};

	VehicleManager.addNewVehicle = function(vehicle) {
		VehicleManager.workingVehicle = vehicle;
		vehicles.push(vehicle);
	};

	VehicleManager.redraw = function() {
		CanvasArtist.clear();
		for (var i=0; i < vehicles.length; i++)
		{
			vehicles[i].draw();
		}
	};
})();
var Vehicle;

(function(){
	var circleRadius = 5;

	Vehicle = function(opts){
		this.startPoint;
		this.endPoint;
		this.points = [];
		if (opts.startx !== undefined && opts.starty !== undefined)
		{
			this.setStartPoint(opts.startx,opts.starty);
		}
	};

	Vehicle.prototype.setStartPoint = function(x, y)
	{
		this.startPoint = new Point(x, y, circleRadius);
		CanvasArtist.drawImageAtPoint(x,y,"airplane");
	};

	Vehicle.prototype.setEndPoint = function(x, y)
	{
		this.endPoint = new Point(x, y, circleRadius);
		this.generateWayPoints();
		this.draw();
	};

	Vehicle.prototype.generateWayPoints = function()
	{
		var xMovement = (this.endPoint.x - this.startPoint.x) / 9;
		var yMovement = (this.endPoint.y - this.startPoint.y) / 9;

		this.points.push(this.startPoint);
		for (var i=1; i < 9; i++)
		{
			this.points.push(new Point(
				this.startPoint.x + (xMovement * i) + Math.floor(Math.random()*25) + 10,
				this.startPoint.y + yMovement * i + Math.floor(Math.random()*25) + 10,
				circleRadius
			));
		}
		this.points.push(this.endPoint);
	};

	Vehicle.prototype.draw = function()
	{
		CanvasArtist.drawTrajectory(this.points);
		CanvasArtist.drawImageAtPoint(this.startPoint.x, this.startPoint.y, "airplane");
		CanvasArtist.drawImageAtPoint(this.endPoint.x, this.endPoint.y, "star");
	};

	Vehicle.prototype.collides = function(vehicle2)
	{


	};

	var Point = function(x, y) {
		this.x = x;
		this.y = y;
	};
})();
(function(){
	var EventDetection = window.EventDetection = {};

	$(document).ready(function(){
		EventDetection.CanvasArtist = CanvasArtist({
			canvasid:"CANVAS",
			width:$(document).width()-230,
			height:$(document).height(),
			leftOffset:"225px",
			topOffset:"0px"
		});

		EventDetection.UIManager = UIManager({
			addvehiclebutton:"ADD_VEHICLE_BUTTON"
			
		});

		EventDetection.ConsoleOutput = ConsoleOutput({
			table:"CONSOLE_TABLE",
			clearbutton:"CLEAR_CONSOLE_BUTTON"
		});

		EventDetection.VehicleManager = VehicleManager;

	});
})();
})();
