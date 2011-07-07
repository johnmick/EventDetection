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
