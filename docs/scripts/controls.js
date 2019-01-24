"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DOMControls = function () {
	/**
  * The constructor step up the class, option defaults and prepares the DOM
  */

	function DOMControls(options, parent, globalCallback, DOMNames) {
		_classCallCheck(this, DOMControls);

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
		this.globalCallback = globalCallback || function () {};
		this.DOMNames = DOMNames || {
			IDPrefix: ["option"],
			wrapper: ["option"],
			inputWrapper: ["option__input_wrapper"],
			labelWrapper: ["option__label_wrapper"],
			valueWrapper: ["option__value_wrapper"],
			radioWrapper: ["option__radio_wrapper"]

			/**
    * Setup the DOM
    * Check if the options are correct
    * Create elements
    */
		};var keys = Object.keys(this.options);

		var _iteratorNormalCompletion = true;
		var _didIteratorError = false;
		var _iteratorError = undefined;

		try {
			for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
				var key = _step.value;

				var option = this.options[key];

				// Throw errors for undefined required fields
				if (option.type === undefined || option.value === undefined) {
					throw "Option " + key + " must have a type and a value";
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
				var wrapperElement = document.createElement("div");
				var inputWrapperElement = document.createElement("div");
				var labelWrapperElement = document.createElement("div");
				var valueWrapperElement = document.createElement("div");
				var inputElement = document.createElement("input");
				var labelElement = document.createElement("label");
				var valueElement = document.createElement("span");

				// Set the ID of the element
				// The keys are unique (by definition) so each ID is unique
				var ID = this.DOMNames.IDPrefix.join("_") + "_" + key;

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
						var _wrapperElement = document.createElement("div");
						for (var i = 0; i < option.values.length; ++i) {
							// Create input element
							var _inputElement = document.createElement("input");
							var _labelElement = document.createElement("label");
							var _inputWrapperElement = document.createElement("div");
							var _labelWrapperElement = document.createElement("div");
							// Set input element id and name
							_inputElement.type = "radio";
							_inputElement.value = option.values[i];
							_inputElement.id = ID + "__" + i;
							_inputElement.name = ID;
							_inputElement.checked = option.values[i] === option.value;
							var _inputAttributes = Object.keys(option.attributes);
							var _iteratorNormalCompletion2 = true;
							var _didIteratorError2 = false;
							var _iteratorError2 = undefined;

							try {
								for (var _iterator2 = _inputAttributes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
									var attr = _step2.value;

									_inputElement.setAttribute(attr, option.attributes[attr]);
								}
								// Set label
							} catch (err) {
								_didIteratorError2 = true;
								_iteratorError2 = err;
							} finally {
								try {
									if (!_iteratorNormalCompletion2 && _iterator2.return) {
										_iterator2.return();
									}
								} finally {
									if (_didIteratorError2) {
										throw _iteratorError2;
									}
								}
							}

							_labelElement.setAttribute("for", ID + "__" + i);
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
						var inputAttributes = Object.keys(option.attributes);
						var _iteratorNormalCompletion3 = true;
						var _didIteratorError3 = false;
						var _iteratorError3 = undefined;

						try {
							for (var _iterator3 = inputAttributes[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
								var _attr = _step3.value;

								inputElement.setAttribute(_attr, option.attributes[_attr]);
							}
						} catch (err) {
							_didIteratorError3 = true;
							_iteratorError3 = err;
						} finally {
							try {
								if (!_iteratorNormalCompletion3 && _iterator3.return) {
									_iterator3.return();
								}
							} finally {
								if (_didIteratorError3) {
									throw _iteratorError3;
								}
							}
						}

						inputWrapperElement.className = this.DOMNames.inputWrapper.join(" ");
						inputWrapperElement.appendChild(inputElement);
						wrapperElement.appendChild(inputWrapperElement);
						option.inputElements.push(inputElement);
						break;
				}

				// Add callbacks
				var _iteratorNormalCompletion4 = true;
				var _didIteratorError4 = false;
				var _iteratorError4 = undefined;

				try {
					for (var _iterator4 = option.inputElements[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
						var element = _step4.value;

						switch (option.type) {
							case "button":
							case "reset":
								element.addEventListener("click", this.callback.bind(this, key, false));
								break;

							case "file":
								element.addEventListener("change", function (key, ev) {
									var files = this.options[key].inputElements[0].files;
									var reader = new FileReader();
									// Calling the class callback is useless here
									reader.onload = this.options[key].callback;
									var _iteratorNormalCompletion5 = true;
									var _didIteratorError5 = false;
									var _iteratorError5 = undefined;

									try {
										for (var _iterator5 = files[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
											var file = _step5.value;
											reader.readAsDataURL(file);
										}
									} catch (err) {
										_didIteratorError5 = true;
										_iteratorError5 = err;
									} finally {
										try {
											if (!_iteratorNormalCompletion5 && _iterator5.return) {
												_iterator5.return();
											}
										} finally {
											if (_didIteratorError5) {
												throw _iteratorError5;
											}
										}
									}
								}.bind(this, key));
								break;

							default:
								element.addEventListener("input", this.callback.bind(this, key, false));
								break;
						}
					}

					// Set wrapper classes
				} catch (err) {
					_didIteratorError4 = true;
					_iteratorError4 = err;
				} finally {
					try {
						if (!_iteratorNormalCompletion4 && _iterator4.return) {
							_iterator4.return();
						}
					} finally {
						if (_didIteratorError4) {
							throw _iteratorError4;
						}
					}
				}

				wrapperElement.className = this.DOMNames.wrapper.join(" ");

				// Append the wrapper to the parent
				this.parent.appendChild(wrapperElement);
			}
		} catch (err) {
			_didIteratorError = true;
			_iteratorError = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion && _iterator.return) {
					_iterator.return();
				}
			} finally {
				if (_didIteratorError) {
					throw _iteratorError;
				}
			}
		}
	}

	/**
  * Callback function
  * Called in the scope of the class
  */

	_createClass(DOMControls, [{
		key: "callback",
		value: function callback(key, ignoreCallback) {
			var option = this.options[key];
			var value = void 0;

			switch (option.type) {
				case "checkbox":
					value = Boolean(option.inputElements[0].checked);
					break;

				case "radio":
					var _iteratorNormalCompletion6 = true;
					var _didIteratorError6 = false;
					var _iteratorError6 = undefined;

					try {
						for (var _iterator6 = option.inputElements[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
							var element = _step6.value;

							if (element.checked) {
								value = element.value;
							}
						}
					} catch (err) {
						_didIteratorError6 = true;
						_iteratorError6 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion6 && _iterator6.return) {
								_iterator6.return();
							}
						} finally {
							if (_didIteratorError6) {
								throw _iteratorError6;
							}
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
					var _keys = Object.keys(this.options);
					for (var i = 0; i < _keys.length; ++i) {
						if (this.options[_keys[i]].type !== "reset") {
							this.set(_keys[i], this.options[_keys[i]].default);
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

	}, {
		key: "set",
		value: function set(key, value) {
			var option = this.options[key];

			switch (option.type) {
				case "checkbox":
					option.inputElements[0].checked = Boolean(value);
					break;

				case "radio":
					var _iteratorNormalCompletion7 = true;
					var _didIteratorError7 = false;
					var _iteratorError7 = undefined;

					try {
						for (var _iterator7 = option.inputElements[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
							var element = _step7.value;

							element.checked = false;
							if (element.value === value) {
								element.checked = true;
							}
						}
					} catch (err) {
						_didIteratorError7 = true;
						_iteratorError7 = err;
					} finally {
						try {
							if (!_iteratorNormalCompletion7 && _iterator7.return) {
								_iterator7.return();
							}
						} finally {
							if (_didIteratorError7) {
								throw _iteratorError7;
							}
						}
					}

					break;

				default:
					option.inputElements[0].value = value;
					break;
			}

			this.callback.call(this, key, true);
		}
	}, {
		key: "get",
		value: function get(key) {
			return this.options[key].value;
		}
	}]);

	return DOMControls;
}();
//# sourceMappingURL=controls.js.map