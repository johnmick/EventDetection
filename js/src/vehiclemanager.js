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
