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
