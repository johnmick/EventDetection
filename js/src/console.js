var ConsoleOutput;

(function(){
	var table, frag, container, messageContainer, counter, numCheckedLabel, detectTimeLabel, drawTimeLabel;

	ConsoleOutput = function(opts)
	{
		table = document.getElementById(opts.table);
		frag = document.createDocumentFragment();
		container = document.getElementById(opts.container);
		messageContainer = document.getElementById(opts.messages);
		counter = document.getElementById(opts.counter);
		numCheckedLabel = document.getElementById(opts.numchecked);
		detectTimeLabel = document.getElementById(opts.detecttime);
		drawTimeLabel = document.getElementById(opts.drawtime);
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
		ConsoleOutput.numEvents = count/2;
		table.appendChild(frag);
	};

	ConsoleOutput.setLabels = function()
	{
		counter.innerHTML = ConsoleOutput.numEvents;
		numCheckedLabel.innerHTML = ConsoleOutput.numChecked;
		detectTimeLabel.innerHTML = ConsoleOutput.detectTime;
		drawTimeLabel.innerHTML = ConsoleOutput.drawTime;
	};

	ConsoleOutput.resize = function()
	{
		var height = $(window).height();
		container.style.height = height-5 + "px";
		messageContainer.style.height = height-125 + "px";
	};

	ConsoleOutput.clear = function()
	{
		$(table).empty();
	};
})();
