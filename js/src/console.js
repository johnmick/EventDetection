var ConsoleOutput;

(function(){
	var table, frag;

	ConsoleOutput = function(opts)
	{
		table = document.getElementById(opts.table);
		frag = document.createDocumentFragment();
		$("#" + opts.clearbutton).click(ConsoleOutput.clear);
		return ConsoleOutput;
	};

	ConsoleOutput.log = function(message)
	{
		var tr = document.createElement("TR");
		var num = document.createElement("TD");
		var msg = document.createElement("TD");
		msg.innerHTML = message;
		msg.style.borderBottom="1px solid #000000";
		num.style.borderTop="1px solid #000000";
		msg.style.borderTop="1px solid #000000";
		tr.appendChild(msg);
		frag.appendChild(tr);
		table.appendChild(frag);
	};

	ConsoleOutput.clear = function()
	{
		$(table).empty();
	};
})();
