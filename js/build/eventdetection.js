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

var ConsoleOutput;

(function(){
	var table, frag, container, messageContainer, counter;

	ConsoleOutput = function(opts)
	{
		table = document.getElementById(opts.table);
		frag = document.createDocumentFragment();
		container = document.getElementById(opts.container);
		messageContainer = document.getElementById(opts.messages);
		counter = document.getElementById(opts.counter);
		ConsoleOutput.resize();
		return ConsoleOutput;
	};

	ConsoleOutput.logEvents = function()
	{
		var count = 0;
		var vehicles = VehicleManager.retrieveEvents();
		ConsoleOutput.clear();
		for (var vehicleID in vehicles)
		{
			var vehicle = vehicles[vehicleID];
			var rows = [];
			for (var vehicleEvent in vehicle)
			{
				var eventTimes = vehicle[vehicleEvent];
				for (var eventPoint in eventTimes)
				{
					var eventColor = CanvasArtist.getColor(eventPoint);
					var tr = document.createElement("TR");
					var labelCell = document.createElement("TD");
					var colorCell = document.createElement("TD");

					labelCell.innerHTML = "&rarr; " + vehicleEvent + " at Time #" + eventPoint;
					colorCell.style.width = "5px";
					colorCell.style.backgroundColor = eventColor;
					if (eventPoint == 9)
					{
						var img = document.createElement("img");
						img.src = CanvasArtist.images["star"].src;
						colorCell.appendChild(img);
					}


					tr.appendChild(labelCell);
					tr.appendChild(colorCell);
					rows.push(tr);
				}
			}
			if (rows.length > 0)
			{
				var tr = document.createElement("TR");
				var td = document.createElement("TD");
				td.innerHTML = "Events For " + vehicleID;
				td.style.fontWeight = "bold";
				td.colSpan = 2;
				tr.appendChild(td);

				frag.appendChild(tr);
				for (var i=0; i < rows.length; i ++)
				{
					count++;
					frag.appendChild(rows[i]);
				}
			}
		}
		counter.innerHTML = count/2;
		table.appendChild(frag);
	};

	ConsoleOutput.resize = function()
	{
		var height = $(window).height();
		container.style.height = height-5;
		messageContainer.style.height = height-55;
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

	VehicleManager.addNewVehicle = function(opts) {
		var vehicle = new Vehicle({
			id : vehicles.length,
			startx : opts.startx,
			starty : opts.starty
		});
		VehicleManager.workingVehicle = vehicle;
		vehicles.push(vehicle);
	};

	VehicleManager.detectEvents = function() {
		var vehiclesToCheck = vehicles.slice(0);

		for (var i=vehicles.length-1; i > -1; i--)
		{
			for (var k=vehiclesToCheck.length-1; k > -1; k--)
			{
				if (k !== i && vehiclesToCheck[k] !== null)
				{
					vehicles[i].detectEvents(vehiclesToCheck[k]);
				}
			}
			vehiclesToCheck[i] = null;
		}
	};

	VehicleManager.retrieveEvents = function() {
		var events = {};
		var loop = vehicles.length;
		for (var i=0; i < loop; i++)
		{
			events["Vehicle " + i] = vehicles[i].events;
		}
		return events;
	};

	VehicleManager.redraw = function() {
		CanvasArtist.clear();
		for (var i=0; i < vehicles.length; i++)
		{
			vehicles[i].draw();
		}
	};

	VehicleManager.clear = function() {
		vehicles = [];
	};
})();
var Vehicle;

(function(){
	var circleRadius = 35;

	Vehicle = function(opts){
		this.id = opts.id;
		this.points = [];
		this.events = {};
		this.displayed = true;
		if (opts.startx !== undefined && opts.starty !== undefined)
		{
			this.setStartPoint(opts.startx,opts.starty);
		}
	};

	Vehicle.prototype.setStartPoint = function(x, y)
	{
		this.startPoint = new Waypoint(x, y, circleRadius);
		CanvasArtist.drawImageAtPoint(x,y,"airplane", "Vehicle " + this.id);
	};

	Vehicle.prototype.setEndPoint = function(x, y)
	{
		this.endPoint = new Waypoint(x, y, circleRadius);
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
			this.points.push(new Waypoint(
				this.startPoint.x + (xMovement * i) + Math.floor(Math.random()*25) + 10,
				this.startPoint.y + yMovement * i + Math.floor(Math.random()*25) + 10,
				circleRadius
			));
		}
		this.points.push(this.endPoint);
	};

	Vehicle.prototype.draw = function()
	{
		CanvasArtist.drawTrajectory(this.points, this.events);
		CanvasArtist.drawImageAtPoint(this.startPoint.x, this.startPoint.y, "airplane", "Vehicle " + this.id);
		CanvasArtist.drawImageAtPoint(this.endPoint.x, this.endPoint.y, "star");
	};

	Vehicle.prototype.detectEvents = function(vehicle2)
	{
		for (var i=this.points.length-1; i >-1; i--)
		{
			if (this.points[i].tooClose(vehicle2.points[i]))
			{
				this.addEvent(vehicle2, i);
				vehicle2.addEvent(this, i);
			}
		}
	};

	Vehicle.prototype.addEvent = function(vehicle, point)
	{
		if (this.events["Vehicle " + vehicle.id] === undefined)
		{
			this.events["Vehicle " + vehicle.id] = {};
		}
		this.events["Vehicle " + vehicle.id][point] = true;
	};


	var Waypoint = function(x, y, r) {
		this.x = x;
		this.y = y;
		this.r = r;
	};

	Waypoint.prototype.tooClose = function(point) {
		var xDifference = point.x - this.x;
		var yDifference = point.y - this.y;
		var distance = Math.sqrt(xDifference * xDifference + yDifference * yDifference);
		return distance < point.r + this.r;
	};
})();
var UIManager;

(function(){
	var mode = "def";

	UIManager = function(opts) {
		$(CanvasArtist.getCanvas()).click(UIManager.canvasClicked);
		$("#" + opts.addvehiclebutton).click(UIManager.addVehicleRequest);
		$(window).resize(UIManager.resize);
		$("#" + opts.clearbutton).click(UIManager.clear);
		return UIManager;
	};

	UIManager.resize = function()
	{
		CanvasArtist.resizeCanvas();
		UIManager.redraw();
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
				VehicleManager.addNewVehicle({
					startx : CanvasArtist.calculateX(e.pageX), 
					starty : CanvasArtist.calculateY(e.pageY)
				});
				mode = "addEndPoint";
				break;
			case "addEndPoint":
				VehicleManager.workingVehicle.setEndPoint(
					CanvasArtist.calculateX(e.pageX), 
					CanvasArtist.calculateY(e.pageY)
				);
				VehicleManager.detectEvents();
				UIManager.redraw();
				ConsoleOutput.logEvents();
				mode = "def";
				break;
		}
	};

	UIManager.redraw = function()
	{
		VehicleManager.redraw();
		ConsoleOutput.resize();
	};

	UIManager.getMode = function()
	{
		return mode;
	};

	UIManager.setMode = function(m)
	{
		mode = m;
	};

	UIManager.clear = function()
	{
		VehicleManager.clear();
		UIManager.redraw();
		ConsoleOutput.logEvents();
	};
})();
(function(){
	var EventDetection = window.EventDetection = {};

	$(document).ready(function(){
		EventDetection.CanvasArtist = CanvasArtist({
			canvasid:"CANVAS",
			leftOffset:"225px",
			topOffset:"0px"
		});

		EventDetection.UIManager = UIManager({
			addvehiclebutton:"ADD_VEHICLE_BUTTON",
			clearbutton:"CLEAR_CONSOLE_BUTTON"
		});

		EventDetection.ConsoleOutput = ConsoleOutput({
			table:"CONSOLE_TABLE",
			messages:"CONSOLE_MESSAGES",
			container:"CONSOLE_CONTAINER",
			counter:"EVENT_COUNT"
		});

		EventDetection.VehicleManager = VehicleManager;

	});
})();
})();
