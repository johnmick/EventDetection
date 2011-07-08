(function(){
	var EventDetection = window.EventDetection = {};

	$(document).ready(function(){
		EventDetection.CanvasArtist = CanvasArtist({
			canvasid:"CANVAS",
			leftOffset:"255px",
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
			counter:"EVENT_COUNT",
			detecttime:"ALG_TIME",
			numchecked:"NUM_WAYPOINTS",
			drawtime:"DRAW_TIME"
		});

		EventDetection.VehicleManager = VehicleManager;
	});
})();
