/*!*************************************************************************************************
 * jQuery.forms.js
 * -------------------------------------------------------------------------------------------------
 * PROJECT SUMMARY: Enhancements mediated by jQuery to dynamic behavior of Gravity Forms and
 * intended for Washington State University (WSU) websites built in the WSU WordPress platform.
 * Designed especially for the websites of the WSU Office of Undergraduate Education.
 *
 * AUTHOR: Daniel Rieck [daniel.rieck@wsu.edu] (https://github.com/invokeImmediately)
 *
 * REPOSITORY: https://github.com/invokeImmediately/WSU-UE---JS
 *
 * LICENSE: ISC - Copyright (c) 2019 Daniel C. Rieck.
 *
 *   Permission to use, copy, modify, and/or distribute this software for any purpose with or
 *   without fee is hereby granted, provided that the above copyright notice and this permission
 *   notice appear in all copies.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS" AND DANIEL RIECK DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS
 *   SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL
 *   DANIEL RIECK BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
 *   DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF
 *   CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
 *   PERFORMANCE OF THIS SOFTWARE.
 **************************************************************************************************/

////////////////////////////////////////////////////////////////////////////////////////////////////
// TABLE OF CONTENTS
// -----------------
// §1: Gravity Forms enhancement modules........................................................56
//     §1.1: EmailConfirmations class...........................................................59
//         §1.1.1: Public properties............................................................83
//         §1.1.2: Public methods...............................................................99
//     §1.2: GfCheckboxValidators class........................................................131
//         §1.2.1: Private properties..........................................................149
//         §1.2.2: Public properties...........................................................154
//         §1.2.3: Privileged methods..........................................................159
//         §1.2.4: Constructor's main execution section........................................175
//         §1.2.5: Public methods..............................................................181
//     §1.3: OueGFs class......................................................................309
//         §1.3.1: Public properties...........................................................326
//         §1.3.2: Public methods..............................................................355
//         §1.3.3: Lexically scoped supporting functions.......................................382
//     §1.4: WsuIdInputs class.................................................................409
//         §1.4.1: Public properties...........................................................429
//         §1.4.2: Public methods..............................................................444
//         §1.4.3: Lexically scoped supporting functions.......................................541
// §2: Application of OUE-wide Gravity Forms enhancements......................................566
//     §2.1: Application of OueGFs module......................................................572
//     §2.2: Document ready bindings...........................................................580
//     §2.3: Binding of Handlers to Window Load................................................601
//     §2.4: Window Load Event Bindings........................................................613
//     §2.5: Function declarations.............................................................620
////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: Gravity Forms enhancement modules

////////////////////////////////////////////////////////////////////////////////////////////////
// §1.1: EmailConfirmations class

/**
 * Gravity Forms enhancement module for preventing the user from pasting input into email
 * confirmation fields.
 *
 * Keeps users from being lazy and circumventing the mistake prevention effects of having to
 * explicitly enter emails twice.
 *
 * @class
 */
var EmailConfirmations = ( function( $ ) {

	'use strict';

	/**
	 * Constructor for EmailConfirmations.
	 *
	 * @param {string} selGField - Selects the Gravity Form field containing the input in which the
	 *     email and its confirmation will be entered.
	 */
	function EmailConfirmations( selGfield ) {

		////////////////////////////////////////////////////////////////////////////////////////////
		// §1.1.1: Public properties

		/**
		 * The collection of selectors used to find inputs accepting emails and email confirmations
		 * in the DOM.
		 *
		 * @public
		 */
		this.sels = {
			gform: '.gform_wrapper',
			gfield: selGfield,
			inputs: ".ginput_right input[type='text']"
		};
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// §1.1.2: Public methods

	/**
	 * Initializes the event handling that will prevent misuse of the email confirmation field.
	 *
	 * @public
	 */
	EmailConfirmations.prototype.init = function () {
		var $forms = $( this.sels.gform );
		var inputSel = this.sels.gfield + ' ' + this.sels.inputs;

		if ( $forms.length ) {	
			$forms.on( 'paste', inputSel, this.onPaste );
		}
	};

	/**
	 * Handler for paste events triggered in inputs accepting email confirmations.
	 *
	 * @public
	 *
	 * @param {Event} e - Contains information about the paste event.
	 */
	EmailConfirmations.prototype.onPaste = function ( e ) {
		e.stopPropagation();
		e.preventDefault();
	};

	return EmailConfirmations;
} )( jQuery );

////////////////////////////////////////////////////////////////////////////////////////////////
// §1.2: GfCheckboxValidators

/**
 * Gravity Forms enhancement module for validating checkbox input containers wherein all checkboxes
 * must be checked.
 *
 * Links the state of a Gravity Forms checkbox field to a subsequent (and ideally hidden) validator
 * field. Currently, all of the checkboxes must be selected for the field to be validated.
 *
 * @class
 */
var GfCheckboxValidators = ( function( $ ) {
	
	'use strict';

	function GfCheckboxValidators( sels ) {

		////////////////////////////////////////////////////////////////////////////////////////////
		// §1.2.1: Private properties

		var _$form;

		////////////////////////////////////////////////////////////////////////////////////////////
		// §1.2.2: Public properties

		this.sels = sels;

		////////////////////////////////////////////////////////////////////////////////////////////
		// §1.2.3: Privileged methods

		this.get$form = function () {
			return _$form;
		}

		this.findForm = function () {
			if ( this.IsObjValid() ) {
				_$form = $ ( this.sels.formContainer )
			} else {
				console.log( "Object wasn't valid." );
				_$form = $( [] );
			}
		}

		////////////////////////////////////////////////////////////////////////////////////////////
		// §1.2.4: Constructor's main execution section

		this.findForm();
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// §1.2.5: Public methods

	/**
	 * Finish the process of hiding validator fields from the user.
	 *
	 * Removes tab indexing from the field so that JavaScript can safely automate population of the
	 * validator field with input based on the state of the preceding checkbox field.
	 *
	 * @access public
	 *
	 * @memberof GfCheckboxValidators
	 */
	GfCheckboxValidators.prototype.finishHidingValidators = function () {
		var $form;
		var $field;
		var $validator;
		var $validator_input;

		$form = this.get$form();
		if ( this.IsObjValid() && $form.length) {
			// Isolate validator and its target field in the DOM.
			$field = $form.find( this.sels.validatedField );
			$validator = $field.next( this.sels.validator );

			// Disable tab indexing to form validators.
			if ( $field.length && $validator.length ) {
				$validator_input = $validator.find( "input" );
				$validator_input.attr( 'tabindex', '-1' );
			}
		}
	};

	/**
	 * Initialize validation of validated checkbox fields by their subsequent validator fields.
	 *
	 * The validator's input element will be set to "validated" if all checkboxes are checked,
	 * otherwise it will be set to an empty string.
	 *
	 * @access public
	 *
	 * @memberof GfCheckboxValidators
	 *
	 * @throws {Error} Member function IsObjValid will automatically be called and must return true.
	 * @throws {Error} The specified validated and validator fields must be found within the form,
	 *     and each validated field must be followed by a validator field as a sibling.
	 * @throws {Error} Validated fields must contain checkbox input elements, and validator fields
	 *     must contain a single input element.
	 */
	GfCheckboxValidators.prototype.initValidation = function() {
		var $form;
		var sels = this.sels;
		var stillValid;

		stillValid = this.IsObjValid();
		if ( !stillValid ) {
			throw Error( "Object properties did not pass validity check." );
		} else {
			// Find the form appropriate fields within the form.
			$form = this.get$form();
			$form.on('change', sels.validatedField + " :checkbox", function () {
				var $checkBoxes;
				var $parentField;
				var $this;
				var $validator_input;
				var allChecked = true;
				var stillValid = true;

				$this = $( this );
				$parentField = $this.parents( sels.validatedField );
				$checkBoxes = $parentField.find( " :checkbox" );
				$validator_input = $parentField.next( sels.validator ).find( "input" );
				stillValid = $validator_input.length === 1;
				try {
					if ( !stillValid ) {
						throw Error( "Found a validated field in the DOM that was not followed by a\
 matching, properly formed validator sibling; checkbox state cannot be properly validated." );
					} else {
						// Check the state of all the checkbox inputs within the validated field.
						$checkBoxes.each( function () {
							if ( allChecked && !this.checked) {
								allChecked = false;
							}
						} );

						// Appropriately set the state of the validator's input element.
						if ( allChecked && $validator_input.val() != "validated" ) {
							$validator_input.val( "validated" );
						} else if ( $validator_input.val() != "" ) {
							$validator_input.val( "" );
						}
					}
				} catch ( err ) {
					console.log(err.name + ": " + err.message);
				}
			} );
		}
	};

	/**
	 * Check the validity of the instance based on the types and values of its members.
	 *
	 * @return {boolean} Returns true if members are properly typed and their values conform to
	 *     expectations. Returns false otherwise.
	 */
	GfCheckboxValidators.prototype.IsObjValid = function() {
		var stillValid = true;
		var selsProps;

		if ( !( typeof this.sels === 'object' ) ) {
			stillValid = false
		} else if ( stillValid ) {
			selsProps = Object.getOwnPropertyNames( this.sels );
		}
		if ( stillValid && !( selsProps.length === 3 &&
				selsProps.find( function( elem ) { return elem === 'formContainer'; } ) &&
				selsProps.find( function( elem ) { return elem === 'validatedField'; } ) &&
				selsProps.find( function( elem ) { return elem === 'validator'; } ) ) ) {
			stillValid = false;
		}
		// TODO: Check for properly formed selector strings.

		return stillValid;
	};

	return GfCheckboxValidators;
} )( jQuery );

////////////////////////////////////////////////////////////////////////////////////////////
// §1.3: OueGFs

/**
 * Module for adding enhancements to Gravity Forms found on OUE websites.
 *
 * @class
 */
var OueGFs = ( function( $ ) {
	
	'use strict';

	/**
	 * Constructor for OueGFs.
	 */
	function OueGFs() {

		////////////////////////////////////////////////////////////////////////////////////////////
		// §1.3.1: Public properties

		/**
		 * Collection of selectors used to find form elements in the DOM.
		 *
		 * @public
		 */
		this.selectors = {
			gforms: '.gform_wrapper',
			wsuIds: '.gf-is-wsu-id',
			emailConfirmations: '.ginput_container_email'
		};

		/**
		 * Module for enhancing form inputs that accept WSU ID numbers.
		 *
		 * @public
		 */
		this.wsuIds = null;

		/**
		 * Module for enhancing to form inputs that accept WSU ID numbers.
		 *
		 * @public
		 */
		this.emailConfirmations = null;
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// §1.3.2: Public methods

	/**
	 * Initialize Gravity Forms found on the page.
	 *
	 * @public
	 */
	OueGFs.prototype.init = function () {
		this.completeDomLoadedTasks();
	};

	/**
	 * Perform Gravity Forms intialization steps that should take place once the DOM has loaded.
	 *
	 * @public
	 */
	OueGFs.prototype.completeDomLoadedTasks = function () {
		var instance = this;
		$( function () {
			if ( $( instance.selectors.gforms ).length ) {
				initEmailConfirmations( instance );
				initWsuIdInputs( instance );
			}
		} );
	};

	////////////////////////////////////////////////////////////////////////////////////////////
	// §1.3.3: Lexically scoped supporting functions

	/**
	 * Initialize inputs accepting WSU ID numbers.
	 *
	 * @param {OueGFs} obj - An OueGFs instance that needs to be initialized.
	 */
	function initEmailConfirmations( obj ) {
		obj.emailConfirmations = new EmailConfirmations( obj.selectors.emailConfirmations );
		obj.emailConfirmations.init();
	}

	/**
	 * Initialize inputs accepting WSU ID numbers.
	 *
	 * @param {OueGFs} obj - An OueGFs instance that needs to be initialized.
	 */
	function initWsuIdInputs( obj ) {
		obj.wsuIds = new WsuIdInputs( obj.selectors.wsuIds );
		obj.wsuIds.init();
	}

	return OueGFs;

} )( jQuery );

////////////////////////////////////////////////////////////////////////////////////////////////
// §1.4: WsuIdInputs

/**
 * Provides RegEx mediated validation of gravity form inputs that accept WSU ID numbers.
 *
 * @class
 */
var WsuIdInputs = ( function ( $ ) {
	
	'use strict';

	/**
	 * Constructor for WsuIdInputs class.
	 *
	 * @param {string} selGField - Selects the Gravity Form field containing the input in which the
	 *     WSU ID number will be entered.
	 */
	function WsuIdInputs( selGfield ) {

		////////////////////////////////////////////////////////////////////////////////////////////
		// §1.4.1: Public properties

		/**
		 * The collection of selectors used to find inputs accepting WSU ID numbers in the DOM.
		 *
		 * @public
		 */
		this.sels = {
			gform: '.gform_wrapper',
			gfield: selGfield,
			inputs: "input[type='text']"
		};
	}

	////////////////////////////////////////////////////////////////////////////////////////////
	// §1.4.2: Public methods

	/**
	 * Initializes RegEx mediated validation of inputs accepting WSU ID numbers.
	 *
	 * @public
	 */
	WsuIdInputs.prototype.init = function () {
		var $forms = $( this.sels.gform );
		var inputSel = this.sels.gfield + ' ' + this.sels.inputs;

		$forms.on( 'blur', inputSel, this.onBlur );
		$forms.on( 'keydown', inputSel, this.onKeydown );
		$forms.on( 'paste', inputSel, this.onPaste );
	};

	/**
	 * Handler for blur events triggered in inputs accepting WSU ID numbers.
	 *
	 * @private
	 *
	 * @param {Event} e - Contains information about the blur event.
	 */

	WsuIdInputs.prototype.onBlur = function( e ) {
		var $this = $( this );
		var inputText = $this.val();
		var frep = getFinalRegExPattern();

		if ( inputText != '' ) {
			if ( frep.exec( inputText ) == null ) {
				$this.val( '' );
				alert( 'The WSU ID you entered did not follow the correct pattern; please try again\
. When the leading zero is included, WSU ID numbers are 9 digits long. You can also drop the leadin\
g zero and enter in 8 digits.' );
			}
		}
	};

	/**
	 * Handler for keydown events triggered in inputs accepting WSU ID numbers.
	 *
	 * @public
	 *
	 * @param {Event} e - Contains information about the keydown event.
	 */
	WsuIdInputs.prototype.onKeydown = function ( e ) {
		var $this = $( this );
		var inputText = $this.val();
		var akc = getAcceptableKeyCodes();

		if ( ( e.keyCode < 48 || ( e.keyCode > 57 && e.keyCode < 96 ) || e.keyCode > 105 )
				&& !~akc.indexOf( e.keyCode ) && !( e.keyCode == 86 && e.ctrlKey ) ) {
			e.preventDefault();
		} else if ( !~akc.indexOf( e.keyCode ) && inputText.length >= 9 ) {
			e.preventDefault();
			alert( 'Note: WSU ID numbers are no greater than nine (9) digits in length.' );
		}
	};

	/**
	 * Handler for paste events triggered in inputs accepting WSU ID numbers.
	 *
	 * @public
	 *
	 * @param {Event} e - Contains information about the paste event.
	 */
	WsuIdInputs.prototype.onPaste = function ( e ) {
		var $this = $( this );
		var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
		var inputText = clipboardData.getData( 'Text' );
		var regExMask = /[^0-9]+/g;

		if ( regExMask.exec( inputText ) != null ) {
			var errorMsg = 'Note: WSU ID numbers can only contain digits.';
			e.stopPropagation();
			e.preventDefault();
			$this.val( inputText.replace( regExMask, '' ) );
			inputText = $this.val();
			if ( inputText.length > 9 ) {
				$this.val( inputText.slice( 0, 9 ) );
				errorMsg += ' Also, they must be no greater than nine (9) digits in length.';
			}
			errorMsg += ' What you pasted will automatically be corrected; please check the result \
to see if further corrections are needed.';
			alert( errorMsg );
		} else if ( inputText.length > 9 ) {
			e.stopPropagation();
			e.preventDefault();
			$this.val( inputText.slice( 0,9 ) );
			alert( 'WSU ID numbers are no greater than nine (9) digits in length. What you pasted w\
ill automatically be corrected. Please check the result to see if further corrections are needed.'
				);
		}
	};

	////////////////////////////////////////////////////////////////////////////////////////////
	// §1.4.3: Lexically scoped supporting functions

	/**
	 * Obtains the regular expression pattern representing valid complete or incomple WSU ID input.
	 *
	 * @return {RegExp}
	 */
	function getFinalRegExPattern() {
		return /(?:^[0-9]{8}$)|(?:^0[0-9]{8}$)/;
	}

	/**
	 * Obtains the list of key codes for acceptable keystrokes when a WSU ID input has focus.
	 *
	 * @return {Array}
	 */
	function getAcceptableKeyCodes() {
		return [ 8, 9, 20, 35, 36, 37, 39, 46, 110, 144 ];
	}

	return WsuIdInputs;

} )( jQuery );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: Application of OUE-wide Gravity Forms enhancements

( function ( $ ) {
	'use strict';

	////////////////////////////////////////////////////////////////////////////////////////////////
	// §2.1: Application of OueGFs module

	var oueGfs;

	oueGfs = new OueGFs();
	oueGfs.init();

	////////////////////////////////////////////////////////////////////////////////////////////////
	// §2.2: Document ready bindings

	$( function () {
		var $requiredFields;
		if ( $( '.gform_body' ).length > 0 ) {
			setupActvtrChckbxs( '.oue-gf-actvtr-checkbox' );
			setupActvtrChain( '.oue-gf-actvtr-chain' );
			setupUploadChain( '.oue-gf-upload-chain' );
			
			// TODO: streamline functions by querying all ul.gform_fields li.gfield, then determine
			//   how to handle object by finding div children with gfield_container_class. Best to
			//   implement as a class.
			$requiredFields =  $( 'li.gfield_contains_required' );
			hghlghtRqrdInpts( $requiredFields.find( 'input' ) );
			hghlghtRqrdChckbxs( $requiredFields.find( 'ul.gfield_checkbox, ul.gfield_radio' ) );
			hghlghtRqrdTxtAreas( $requiredFields.find( 'textarea' ) );
			hghlghtRqrdSelects( $requiredFields.find( 'select' ) );
		}
	} );

	////////////////////////////////////////////////////////////////////////////////////////////////
	// §2.3: Binding of Handlers to Window Load

	$( document ).on( 'gform_post_render', function () {
		var $requiredFields =  $( 'li.gfield_contains_required' );

		checkRqrdInpts( $requiredFields.find( 'input' ) );
		checkRqrdChckbxs( $requiredFields.find( 'ul.gfield_checkbox, ul.gfield_radio' ) );
		checkRqrdTxtAreas( $requiredFields.find( 'textarea' ) );
	} );


	////////////////////////////////////////////////////////////////////////////////////////////////
	// §2.4: Window Load Event Bindings

	$( window ).load( function () {
		hghlghtRqrdRchTxtEdtrs( $( '.gfield_contains_required.uses-rich-editor' ) );
	} );

	////////////////////////////////////////////////////////////////////////////////////////////////
	// §2.5: Function declarations

	/**
	 * Check each input element within a required gravity form field to determine if an entry has
	 * already made by the user and highlight the input if not.
	 *
	 * @param {jQuery} $inputs - The set of input elements contained in required gravity form
	 *     fields.
	 */
	function checkRqrdInpts ( $inputs ) {
		if ( $.isJQueryObj( $inputs ) ) {
			$inputs.each( function () {
				var $thisInput = $( this );
				if ( $thisInput.val() == '' ) {
					$thisInput.removeClass( 'gf-value-entered' );
				} else {
					$thisInput.addClass( 'gf-value-entered' );
				}
			} );
		}
	}
	
	/**
	 * Highlight input elements within required gravity form fields until a value has been properly
	 * entered by the user.
	 *
	 * @param {jQuery} $inputs - The set of input elements contained in required gravity form
	 *     fields.
	 */
	function hghlghtRqrdInpts ( $inputs ) {
		if ( $.isJQueryObj( $inputs ) ) {
			$inputs.each( function () {
				var $thisInput = $( this );
				$thisInput.blur( function () {
					if ( $thisInput.val() == '' ) {
						$thisInput.removeClass( 'gf-value-entered' );
					} else {
						$thisInput.addClass( 'gf-value-entered' );
					}
				} );
			} );
		}
	}

	/**
	 * Check each checkbox list within required gravity form checkbox fields to determine if at
	 * least one checkbox has already been checked by the user and highlight the list if not.
	 *
	 * @param {jQuery} $lists - The set of list elements wrapping checkbox inputs and contained in
	 *     required gravity form fields.
	 */
	function checkRqrdChckbxs ( $lists ) {
		if ( $.isJQueryObj( $lists ) ) {
			$lists.each(function () {
				var $this = $( this );
				var $inputs = $this.find( 'input' );
				var inputReady = false;
				$inputs.each( function () {
					if ( $( this ).prop( 'checked' ) == true && !inputReady ) {
						inputReady = true;
					}
				} );
				if ( inputReady ) {
					$this.addClass( 'gf-value-entered' );
				} else {
					$this.removeClass( 'gf-value-entered' );
				}
			} );
		}
	}

	/**
	 * Highlight required gravity form fields containing checkbox elements until at least one box is
	 * checked by the user.
	 *
	 * @param {jQuery} $lists - The set of list elements wrapping checkbox inputs and contained in
	 *     required gravity form fields.
	 */
	function hghlghtRqrdChckbxs ( $lists ) {
		if ( $.isJQueryObj( $lists ) ) {
			$lists.each( function () {
				var $inputs;
				var $this;

				$this = $( this );
				$inputs = $this.find( 'input' );
				$inputs.each( function () {
					var $thisChild = $( this );
					$thisChild.change( function () {
						var $parentsInputs;
						var $thisParent;
						var inputReady = false;

						$thisParent = $thisChild.parents( 'ul.gfield_checkbox, ul.gfield_radio' );
						$parentsInputs = $thisParent.find( 'input' );
						$parentsInputs.each(function () {
							if ( $( this ).prop( 'checked' ) == true && !inputReady ) {
								inputReady = true;
							}
						} );
						if ( inputReady ) {
							$thisParent.addClass( 'gf-value-entered' );
						} else {
							$thisParent.removeClass( 'gf-value-entered' );
						}
					} );
				} );
			} );
		}
	}

	/**
	 * Check each text area element within a required gravity form field to determine if an entry
	 * has already made by the user and highlight the element if not.
	 *
	 * @param {jQuery} $textAreas - The set of text area elements contained in required gravity form
	 *     fields.
	 */
	function checkRqrdTxtAreas ( $textAreas ) {
		checkRqrdInpts( $textAreas );
	}

	/**
	 * Highlight text area elements within required gravity form fields until a value has been
	 * entered by the user.
	 *
	 * @param {jQuery} $textAreas - The set of text arewa elements contained in required gravity
	 *     form fields.
	 */
	function hghlghtRqrdTxtAreas ( $textAreas ) {
		hghlghtRqrdInpts( $textAreas );
	}

	/**
	 * Highlight rich text editors within required gravity form fields until a value has been
	 * entered by the user.
	 *
	 * @param {jQuery} $fields - The set of rich text editor fields that are also required gravity
	 *     form fields.
	 */
	function hghlghtRqrdRchTxtEdtrs( $fields ) {
		if ( $.isJQueryObj( $fields ) && $fields.length > 0 ) {
			$fields.each( function () {
				var $editorForm = $( this ).find( 'iframe' );
				$editorForm.each( function () {
					var $editorBody = $( this ).contents().find( '#tinymce' );
					$editorBody.css( {
						 backgroundColor: 'rgba(255,0,0,0.1)',
						 fontFamily: '"Open sans", sans-serif'
					} );
					$editorBody.focus( function () {
						$( this ).css( 'background-color', 'rgba(255,255,255,1)' );
					} );
					$editorBody.blur( function () {
						var $this = $( this );
						if ( $this.text().replace( /\n|\uFEFF/g, '' ) == '' ) {
							$this.css( 'background-color', 'rgba(255,0,0,0.1)' );
						}
					} );
				} );
			} );
		}
	}

	/**
	 * Highlight select elements within required gravity form fields until a value has been selected
	 * by the user.
	 *
	 * @param {jQuery} $selects - The set of text arewa elements contained in required gravity
	 *     form fields.
	 */
	function hghlghtRqrdSelects ( $selects ) {
		if ( $.isJQueryObj( $selects ) ) {
			$selects.each( function () {
				var $thisInput = $( this );
				var $childSlctdOptn = $thisInput.find( 'option:selected' );
				var optionVal = $childSlctdOptn.text();
				if ( optionVal != '' ) {
					$thisInput.addClass( 'gf-value-entered' );
				} else {
					$thisInput.removeClass( 'gf-value-entered' );
				}
				$thisInput.change( function () {
					$childSlctdOptn = $thisInput.find( 'option:selected' );
					optionVal = $childSlctdOptn.text();
					if ( optionVal != '' ) {
						$thisInput.addClass( 'gf-value-entered' );
					} else {
						$thisInput.removeClass( 'gf-value-entered' );
					}
				} );
			} );
		}
	}

	/**
	 * Set up activator checkboxes that disappear once one is selected.
	 *
	 * @param {string} selector - String for selecting from the DOM gravity form fields designated
	 *     as activator checkboxes.
	 */
	function setupActvtrChckbxs ( selector ) {
		if ( $.type( selector ) === 'string' ) {
			$( '.gform_body' ).on( 'change', selector + ' input', function () {
				var $thisChild = $( this );
				var $thisParent = $thisChild.parents( selector );
				$thisParent.addClass( 'gf-activated' );
			} );
		}
	}

	/**
	 * Setup a chain of activator checkboxes, wherein once a checkbox is activated/deactivated, only
	 * its closest previous sibling is hidden/shown.
	 *
	 * @param {string} selector - String for selecting gravity form fields from the DOM that are
	 *     designated as chained activator checkboxes.
	 */
	function setupActvtrChain ( selector ) {
		if ( $.type( selector ) === 'string' ) {
			$( '.gform_body' ).on( 'change', selector + ' input', function () {
				var $thisChild = $( this );
				var $thisParent = $thisChild.parents( selector );
				var $parentPrevSblngs = $thisParent.prevAll( selector );
				if ( $thisChild.prop( 'checked' ) ) {
					$parentPrevSblngs.first().addClass( 'gf-hidden' );
				} else {
					$parentPrevSblngs.first().removeClass( 'gf-hidden' );
				}
			} );
		}
	}

	/**
	 * Setup a chain of file uploading inputs, wherein only the left-most input in the tree is
	 * visible. As the user uploads files in sequence, the next nearest neighbor is unveiled.
	 *
	 * @param {string} selector - String for selecting gravity form fields from the DOM that are
	 *     designated as part of an upload chain.
	 */
	function setupUploadChain ( selector ) {
		if ( $.type( selector ) === 'string' ) {

			// TODO: CHECK IF UPLOADS ALREADY EXIST:
			//  It is possible to arrive at this point in execution after the user has submitted a
			//  form containing errors that also already contains transcripts uploaded to input
			//  fields that will be hidden by default. The following blocks of code resolve this
			//  situation by showing such fields, as well as their nearest neighbors.
			var $inputs = $( selector + " input[type='file']" );
			$inputs.each( function () {
				var $thisInput = $( this );
				var $nextDiv = $thisInput.nextAll( 'div[id]' ).first();
				if ( $nextDiv.length > 0 ) {
					$thisInput.addClass( 'gf-value-entered' );
					var $parentOfInput = $thisInput.parents( selector ).first();
					$parentOfInput.removeClass( 'gf-hidden' );
					var $parentNextSblngs = $parentOfInput.nextAll( selector ).first();
					$parentNextSblngs.removeClass( 'gf-hidden' );
				}
			} );

			// TODO: Break up this long, complicated execution sequence  into additional functions.
			$( '.gform_body' ).on( 'change', selector + " input[type='file']", function () {
				var $thisInput = $( this );
				if ( $thisInput.prop( 'files' ) != null && $thisInput.prop( 'files' ).length > 0 ) {
					var valuePassed = true;
					var $parentOfInput = $thisInput.parents( selector ).first();
					var $parentNextSblngs = $parentOfInput.nextAll( selector );
					var $parentPrevSblngs = $parentOfInput.prevAll( selector );
					if ( $parentNextSblngs.length != 0 || $parentPrevSblngs.length != 0 ) {
						var originalFileName = $thisInput.prop( 'files' ).item( 0 ).name;
						$parentPrevSblngs.each( function () {
							if ( valuePassed ) {
								var $thisSblng = $( this );
								var $thisSblngInput =
									$thisSblng.find( "input[type='file']" ).first();
								if ( $thisSblngInput.prop( 'files' ) != null &&
										$thisSblngInput.prop( 'files' ).length > 0 ) {
									var thisFileName = $thisSblngInput.prop( 'files' ).item( 0 ).name;
									valuePassed = originalFileName != thisFileName;
								}
							}
						} );
						$parentNextSblngs.each( function () {
							if ( valuePassed ) {
								var $thisSblng = $( this );
								var $thisSblngInput = $thisSblng.find( "input[type='file']" ).first();
								if ( $thisSblngInput.prop( 'files' ) != null &&
										$thisSblngInput.prop( 'files' ).length > 0) {
									var thisFileName = $thisSblngInput.prop( 'files' ).item(0).name;
									valuePassed = originalFileName != thisFileName;
								}
							}
						});
					}
					if ( valuePassed ) {
						$thisInput.addClass( 'gf-value-entered' );
						$parentNextSblngs.first().removeClass( 'gf-hidden' );
					} else {
						alert('A file with the same name has already been uploaded; please choose a\
 different file.');
						$thisInput.get(0).value = '';
					}
				} else {
					$thisChild.removeClass( 'gf-value-entered' );
				}
			} );
		}
	}
} )( jQuery );
