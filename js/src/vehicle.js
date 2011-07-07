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
