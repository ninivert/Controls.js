const controls = new DOMControls({
	"button": {
		type: "button",
		value: "Click me!",
		label: "Click dat button below",
		callback: function() {
			alert("hello world!");
		}
	},
	"checkbox": {
		type: "checkbox",
		value: true,
		label: "Check me!",
		showValue: true
	},
	"radio": {
		type: "radio",
		value: "Option 1",
		label: "I'm a radio input",
		values: ["Option 1", "Option 2", "Option 3"]
	},
	"number": {
		type: "number",
		value: 1,
		label: "Number input (try going over 10 or making the input empty)",
		showValue: true,
		attributes: {
			min: 0,
			max: 10,
			step: 0.1
		}
	},
	"range": {
		type: "range",
		value: 1,
		label: "Range input",
		showValue: true,
		attributes: {
			min: 0,
			max: 10,
			step: 0.1
		}
	},
	"text": {
		type: "text",
		value: "hello world",
		label: "Text input (max length 20 chars)",
		attributes: {
			maxlength: 20,
			placeholder: "Write something"
		}
	},
	"date": {
		type: "date",
		value: "2019-01-02",
		label: "Date input",
		showValue: true // Useful for debugging the format
	},
	"color": {
		type: "color",
		value: "#000000",
		label: "Color input",
		showValue: true
	},
	"file": {
		type: "file",
		value: "",
		label: "Upload an image file that will be appended a the end of the document",
		callback: function(e) {
			const img = new Image();
			img.src = e.target.result;
			const a = document.getElementsByTagName("main")[0];
			a.appendChild(img);
		},
		attributes: {
			accept: "image/*"
		}
	},
	"reset": {
		type: "reset",
		value: "Reset to default"
	}
}, document.getElementById("options"), function() {
	console.log("global callback");
});