var Vehicle;

(function(){
	var circleRadius = 35;

	Vehicle = function(opts){
		this.id = opts.id;
		this.points = [];
		this.events = {};
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
