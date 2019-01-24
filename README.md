# owo what's this ?

A JavaScript library to allow animators to easily create and interact with user-based inputs on the page.\
Here is a [live example](https://ninivert.github.io/Controls.js/) of what that might look like.\

Features:

- Support for all the major input types + a few customs (more coming soon)
- `get` and `set` methods to update the inputs
- Automatic labels and live JavaScript values
- Styling via explicit CSS classes
- Support for all the input attributes

# How do I use it ?

```javascript
const controls = new DOMControls(options, parent, globalCallback, DOMNames);

...

controls.set("moo_number_input", 1.2);
controls.set("foo_text_input", "hello world");
controls.get("moo_number_input"); // 1.2
controls.get("foo_text_input"); // "hello world"
```

## `options` object (required)

```javascript
const options = {
	"foo_btn": {
		type: "button",
		value: "click me!"
	},
	"goo_radio": {
		type: "radio",
		value: "option1", // option1 will be checked
		values: ["option1", "option2", "option3"],
	},
	"moo_range": {
		type: "range",
		value: 1,
		label: "Select a number",
		showValue: true,
		attributes: {
			min: 0,
			max: 10,
			step: 0.1
		}
	}
};
```

| Name | Function |
| --- | --- |
| type | Specifies the input type. Required |
| value | Initial input value. Required |
| callback | Callback function, called with the current input value |
| default | Default value for the input shown after reset.  Defaults to the initial value |
| label | Text of the input label |
| showValue | Enable input value display (useful for `range` inputs) |
| attributes | An object of HTML attributes to add to the input |
| ignoreGlobalCallback | By default, every input will trigger the `globalCallback` after its own callback. Setting this to true will disable `globalCallback` from being executed for this input. (useful for automatically updating canvas renderings) |
| ignoreReset | By default, clicking on the `reset`-typed input will set every input to its default value. Setting this to true will prevent this for this input. |

## `parent` element (required)

All the inputs will be appended to the parent element. I'd recommend to create a separate `div` for this.

```javascript
const parent = document.getElementById("container");
```

## `globalCallback` function (optional)

When given, every input will trigger this function after its own callback. I often use this to refresh a `canvas` element.

```javascript
const globalCallback = function() {
	// do stuff after each input
	console.log("global callback !");
}
```

## `DOMNames` object (optional)

Names used for the generation of the inputs, labels and wrappers. Have a look at the [live example](https://ninivert.github.io/Controls.js/) to see how it affects the generated HTML. Default is:

```javascript
{
	IDPrefix: ["option"],
	wrapper: ["option"],
	inputWrapper: ["option__input_wrapper"],
	labelWrapper: ["option__label_wrapper"],
	valueWrapper: ["option__value_wrapper"],
	radioWrapper: ["option__radio_wrapper"]
}
```

# Input types

## Button

`value` specifies the button text.

```javascript
"foo": {
	type: "button",
	value: "Click me!",
	label: "Click dat button below",
}
```

## Checkbox

`value` specifies the checkbox being ticked or not.

```javascript
"moo": {
	type: "checkbox",
	value: true
	label: "Check me!",
}
```

## Radio

`value` specifies which option is checked first. The `values` array specifies all the other values.

```javascript
"goo": {
	type: "radio",
	value: "option1",
	values: ["option1", "option2", "option3"]
}
```

## Number

The attributes are very useful to limit the size of the number, as well as its precision.

```javascript
"loo": {
	type: "number",
	value: 1,
	attributes: {
		min: 0,
		max: 10,
		step: 0.1
	}
}
```

## Range

Here the `showValue` option is very useful for the user.

```javascript
"woo": {
	type: "range",
	value: 1,
	showValue: true,
	attributes: {
		min: 0,
		max: 10,
		step: 0.1
	}
}
```

## Text-based inputs

`text`, `email`, `password`, `tel`, `search`, `url` all are text-based inputs

```
"soo": {
	type: "text",
	value: "hello world",
	label: "Enter text here",
	attributes: {
		maxlength: 10,
		placeholder: "Write something"
	}
}
```

## Date and time

`time`, `date`, `datetime-local`, `month`, `week` are time-based inputs.\
Using an empty string for the value works as well.

```javascript
"zoo": {
	type: "time",
	value: "",
	showValue: true // Useful for debugging the format
}
```

## Color

`color` will use the native color input for your system.

```javascript
"too": {
	type: "color",
	value: "#000000"
}
```

## File

The callback function is executed once the uploaded file has been loaded. Here I display an uploaded image on the document body.

```javascript
"roo": {
	type: "file",
	value: "",
	callback: function(e) {
		const img = new Image();
		img.src = e.target.result;
		document.body.appendChild(img);
	},
	attributes: {
		accept: "image/*"
	}
}
```

## Reset

Resets the entire field of options to their respective default values

```javascript
"boo": {
	type: "reset",
	value: "Reset to default",
}
```