class DOMControls {
	/**
	 * The constructor step up the class, option defaults and prepares the DOM
	 */

	constructor(options, parent, globalCallback, DOMNames) {
		/**
		 * Setup class
		 */
		if (options === undefined || parent === undefined) {
			throw "Options and parent must be specified";
		}
		if (parent.nodeType !== 1) {
			throw "Parent node must be an element";
		}
		this.options = options;
		this.parent = parent;
		this.globalCallback = globalCallback || function() {};
		this.DOMNames = DOMNames || {
			IDPrefix: ["option"],
			wrapper: ["option"],
			inputWrapper: ["option__input_wrapper"],
			labelWrapper: ["option__label_wrapper"],
			valueWrapper: ["option__value_wrapper"],
			radioWrapper: ["option__radio_wrapper"]
		}

		/**
		 * Setup the DOM
		 * Check if the options are correct
		 * Create elements
		 */
		const keys = Object.keys(this.options);

		for (let key of keys) {
			const option = this.options[key];

			// Throw errors for undefined required fields
			if (option.type === undefined || option.value === undefined) {
				throw `Option ${key} must have a type and a value`;
			}

			// Set option defaults
			option.default = option.default === undefined ? option.value : option.default;
			option.attributes = option.attributes === undefined ? {} : option.attributes;
			// option.callback = option.callback === undefined ? function() {} : option.callback;
			option.showLabel = option.label === undefined ? false : true;
			option.showValue = option.showValue === undefined ? false : option.showValue;
			option.ignoreGlobalCallback = option.ignoreGlobalCallback === undefined ? false : option.ignoreGlobalCallback;
			option.ignoreReset = option.ignoreReset === undefined ? false : option.ignoreReset;
			option.inputElements = [];

			// Create DOM elements
			const wrapperElement = document.createElement("div");
			const inputWrapperElement = document.createElement("div");
			const labelWrapperElement = document.createElement("div");
			const valueWrapperElement = document.createElement("div");
			const inputElement = document.createElement("input");
			const labelElement = document.createElement("label");
			const valueElement = document.createElement("span");

			// Set the ID of the element
			// The keys are unique (by definition) so each ID is unique
			const ID = `${this.DOMNames.IDPrefix.join("_")}_${key}`

			// Setup the label for the element
			if (option.showLabel) {
				labelElement.innerHTML = option.label;
				labelElement.setAttribute("for", ID);
				labelWrapperElement.className = this.DOMNames.labelWrapper.join(" ");
				labelWrapperElement.appendChild(labelElement);
				wrapperElement.appendChild(labelWrapperElement);
				option.labelElement = labelElement;
			}

			// Setup the value for the element
			if (option.showValue) {
				valueElement.innerHTML = option.value;
				valueWrapperElement.className = this.DOMNames.valueWrapper.join(" ");
				valueWrapperElement.appendChild(valueElement);
				wrapperElement.appendChild(valueWrapperElement);
				option.valueElement = valueElement;
			}

			// Setup DOM input element
			switch (option.type) {
				case "radio":
					// Create multiple little inputs that are linked by the shared name
					const _wrapperElement = document.createElement("div");
					for (let i = 0; i < option.values.length; ++i) {
						// Create input element
						const _inputElement = document.createElement("input");
						const _labelElement = document.createElement("label");
						const _inputWrapperElement = document.createElement("div");
						const _labelWrapperElement = document.createElement("div");
						// Set input element id and name
						_inputElement.type = "radio";
						_inputElement.value = option.values[i];
						_inputElement.id = `${ID}__${i}`;
						_inputElement.name = ID;
						_inputElement.checked = option.values[i] === option.value;
						const inputAttributes = Object.keys(option.attributes);
						for (let attr of inputAttributes) {
							_inputElement.setAttribute(attr, option.attributes[attr]);
						}
						// Set label
						_labelElement.setAttribute("for", `${ID}__${i}`);
						_labelElement.innerHTML = option.values[i];
						// Classes for the wrappers
						_inputWrapperElement.className = this.DOMNames.inputWrapper.join(" ");
						_labelWrapperElement.className = this.DOMNames.labelWrapper.join(" ");
						// Append children
						_inputWrapperElement.appendChild(_inputElement);
						_labelWrapperElement.appendChild(_labelElement);
						_wrapperElement.appendChild(_inputWrapperElement);
						_wrapperElement.appendChild(_labelWrapperElement);
						option.inputElements.push(_inputElement);
					}
					_wrapperElement.id = ID;
					_wrapperElement.className = this.DOMNames.radioWrapper.join(" ");
					wrapperElement.appendChild(_wrapperElement);
					break;

				case "checkbox":
					inputElement.checked = option.value;
					// Notice no break, so jump to default

				default:
					inputElement.type = option.type;
					inputElement.value = option.value;
					inputElement.id = ID;
					const inputAttributes = Object.keys(option.attributes);
					for (let attr of inputAttributes) {
						inputElement.setAttribute(attr, option.attributes[attr]);
					}
					inputWrapperElement.className = this.DOMNames.inputWrapper.join(" ");
					inputWrapperElement.appendChild(inputElement);
					wrapperElement.appendChild(inputWrapperElement);
					option.inputElements.push(inputElement);
					break;
			}

			// Add callbacks
			for (let element of option.inputElements) {
				switch (option.type) {
					case "button":
					case "reset":
						element.addEventListener("click", this.callback.bind(this, key, false));
						break;

					case "file":
						element.addEventListener("change", (function(key, ev) {
							const files = this.options[key].inputElements[0].files;
							const reader = new FileReader();
							// Calling the class callback is useless here
							reader.onload = this.options[key].callback;
							for (let file of files) reader.readAsDataURL(file);
						}).bind(this, key));
						break;

					default:
						element.addEventListener("input", this.callback.bind(this, key, false));
						break;
				}
			}

			// Set wrapper classes
			wrapperElement.className = this.DOMNames.wrapper.join(" ");

			// Append the wrapper to the parent
			this.parent.appendChild(wrapperElement);
		}
	}

	/**
	 * Callback function
	 * Called in the scope of the class
	 */

	callback(key, ignoreCallback) {
		let option = this.options[key];
		let value;

		switch (option.type) {
			case "checkbox":
				value = Boolean(option.inputElements[0].checked);
				break;

			case "radio":
				for (let element of option.inputElements) {
					if (element.checked) {
						value = element.value;
					}
				}
				if (value === undefined) value = option.default;
				break;

			case "number":
			case "range":
			case "slider":
				if (option.inputElements[0].validity.valid) {
					value = parseFloat(option.inputElements[0].value || option.default);
				} else {
					value = option.value;
				}
				break;

			case "reset":
				const keys = Object.keys(this.options);
				for (let i = 0; i < keys.length; ++i) {
					if (this.options[keys[i]].type !== "reset") {
						this.set(keys[i], this.options[keys[i]].default);
					}
				}
				break;

			default:
				if (option.inputElements[0].validity.valid) {
					value = option.inputElements[0].value;
				} else {
					value = option.value;
				}
				break;
		}

		option.value = value;
		if (option.showValue) option.valueElement.innerHTML = value;
		if (option.callback !== undefined && !ignoreCallback) option.callback(value);
		if (!option.ignoreGlobalCallback && !ignoreCallback) this.globalCallback();
	}

	/**
	 * Getter and setter
	 */

	set(key, value) {
		const option = this.options[key];

		switch (option.type) {
			case "checkbox":
				option.inputElements[0].checked = Boolean(value);
				break;

			case "radio":
				for (let element of option.inputElements) {
					element.checked = false;
					if (element.value === value) {
						element.checked = true;
					}
				}
				break;

			default:
				option.inputElements[0].value = value;
				break;
		}

		this.callback.call(this, key, true);
	}
 
	get(key) {
		return this.options[key].value;
	}
}