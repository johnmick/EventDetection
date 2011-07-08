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
				var startTime = new Date();
				UIManager.redraw();
				ConsoleOutput.logEvents();
				ConsoleOutput.drawTime = new Date() - startTime;
				ConsoleOutput.setLabels();
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
