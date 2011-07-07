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
