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
