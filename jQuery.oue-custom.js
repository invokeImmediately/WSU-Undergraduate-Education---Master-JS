/*!************************************************************************************************
 * jQuery.oue-custom.js: custom JS code common to all WSU Undergraduate Education websites        *
 **************************************************************************************************/

/**************************************************************************************************
 * TABLE OF CONTENTS                                                                              *
 * -----------------                                                                              *
 *   §1: Addition of functions to jQuery......................................................49  *
 *     §1.1: jQuery.isCssClass................................................................52  *
 *     §1.2: jQuery.isJQueryObj...............................................................70  *
 *     §1.3: jQuery.logError..................................................................82  *
 *   §2: OUE website initilization modules...................................................153  *
 *     §2.1: OueDropDownToggle class.........................................................156  *
 *   §3: After dom is ready excution section.................................................303  *
 *   §4: After window loaded event bindings..................................................464  *
 *   §5: Window resize event bindings........................................................510  *
 *   §6: Function declarations...............................................................518  *
 *     §6.1: addA11yTabPressListener.........................................................521  *
 *     §6.2: addBlankTargetAttributes........................................................535  *
 *     §6.3: addDefinitionListButtons........................................................587  *
 *     §6.4: checkForLrgFrmtSingle...........................................................701  *
 *     §6.5: effectDropDownTogglePermanence..................................................718  *
 *     §6.6: finalizeLrgFrmtSideRight........................................................750  *
 *     §6.7: fixDogears......................................................................770  *
 *     §6.8: handleMouseClickForA11y.........................................................795  *
 *     §6.9: handleTabPressForA11y...........................................................804  *
 *     §6.10: initContentFlippers............................................................815  *
 *     §6.11: initDefinitionLists............................................................831  *
 *     §6.12: initDropDownToggles............................................................881  *
 *     §6.13: initFancyHrH2Motif.............................................................906  *
 *     §6.14: initFancyHrH3Motif.............................................................915  *
 *     §6.15: initHrH2Motif..................................................................924  *
 *     §6.16: initHrH3Motif..................................................................939  *
 *     §6.17: initQuickTabs..................................................................948  *
 *     §6.18: initReadMoreToggles...........................................................1012  *
 *     §6.19: initTocFloating...............................................................1032  *
 *     §6.20: initTriggeredByHover..........................................................1109  *
 *     §6.21: initWelcomeMessage............................................................1128  *
 *     §6.22: resizeLrgFrmtSideRight........................................................1138  *
 *     §6.23: setupDropDownTogglePermanence.................................................1146  *
 *     §6.24: showDefinitionListButtons.....................................................1172  *
 **************************************************************************************************/

( function ( $, thisFileName ) {

'use strict';

////////////////////////////////////////////////////////////////////////////////////////////////////
// §1: ADDITION OF FUNCTIONS to jQuery

////////
// §1.1: jQuery.isCssClass

/**
 * Checking function to verify that the passed argument is a valid CSS class.
 *
 * @param {*} possibleClass - Possible string consisting of a valid CSS class; could, in fact, be
 *     anything.
 */
$.isCssClass = function ( possibleClass ) {
	var cssClassNeedle = /^-?[_a-zA-Z]+[_a-zA-Z0-9-]*$/;
	var isClass;
	
	isClass = typeof possibleClass === 'string' && cssClassNeedle.test( possibleClass );

	return isClass;
}

////////
// §1.2: jQuery.isJQueryObj

/**
 * Checking function to verify that the passed argument is a valid jQuery object.
 *
 * @param {*} $obj - Possible jQuery object; could, in fact, be anything.
 */
$.isJQueryObj = function ( $obj ) {
	return ( $obj && ( $obj instanceof $ || $obj.constructor.prototype.jquery ) );
}

////////
// §1.3: jQuery.logError

/**
 * Log an error using the browser console in JSON notation.
 * 
 * @param {string} fileName - Name of the JS source file wherein the error was encountered.
 * @param {string} fnctnName - Name of the function that called $.logError.
 * @param {string} fnctnDesc - Description of what the calling function is supposed to do.
 * @param {string} errorMsg - Message that describes what went wrong within the calling function.
 */
$.logError = function ( fileName, fnctnName, fnctnDesc, errorMsg ) {
	var thisFuncName = "jQuery.logError";
	var thisFuncDesc = "Log an error using the browser console in JSON notation.";
	var bitMask;
	
	bitMask = typeof fileName === "string";
	bitMask = ( typeof fnctnName === "string" ) | ( bitMask << 1 );
	bitMask = ( typeof fnctnDesc === "string" ) | ( bitMask << 1 );
	bitMask = ( typeof errorMsg === "string" || typeof errorMsg === "object" ) | ( bitMask << 1 );
	if ( bitMask === 15 ) {
		console.log( "error = {\n\tfile: '" + fileName + "',\n\tfunctionName: '" + fnctnName +
			"'\n\tfunctionDesc: '" + fnctnDesc + "'\n\terrorMessage: '" + errorMsg + "'\n\t};" );
		if (typeof errorMsg === "object") {
			console.log( errorMsg );
		}
	} else {
		var incorrectTypings;
		var bitMaskCopy;
		var newErrorMsg;
		
		// Determine how many incorrectly typed arguments were encountered
		for ( var i=0, incorrectTypings = 0, bitMaskCopy = bitMask; i < 4; i++ ) {
			incorrectTypings += bitMaskCopy & 1;
			bitMaskCopy = bitMaskCopy >> 1;
		}
		
		// Construct a new error message
		if ( incorrectTypings == 1 ) {
			newErrorMsg = "Unfortunately, a call to jQuery.error was made with an incorrectly typed\
 argument.\n"
		} else {
			newErrorMsg = "Unfortunately, a call to jQuery.error was made with incorrectly typed ar\
guments.\n"
		}
		newErrorMsg += "Here are the arguments that were passed to jQuery.logError:\n";
		newErrorMsg += "\t\tfileName = " + fileName + "\n";
		if ( !( ( bitMask & 8 ) >> 3 ) ) {
			newErrorMsg += "\t\ttypeof filename = " + ( typeof fileName ) + "\n";
			fileName = thisFileName;
		}
		newErrorMsg += "\t\tfnctnName = " + fnctnName + "\n";
		if( !( ( bitMask & 4 ) >> 2 ) ) {
			newErrorMsg += "\t\ttypeof fnctnName = " + ( typeof fnctnName ) + "\n";
			fnctnName = thisFuncName;
		}
		newErrorMsg += "\t\tfnctnDesc = " + fnctnDesc + "\n";
		if( !( ( bitMask & 2 ) >> 1 ) ) {
			newErrorMsg += "\t\ttypeof fnctnDesc = " + ( typeof fnctnDesc ) + "\n";
			fnctnDesc = thisFuncDesc;
		}
		newErrorMsg += "\t\terrorMsg = " + errorMsg + "\n";
		if( !( bitMask & 1 ) ) {
			newErrorMsg += "\t\ttypeof errorMsg = " + ( typeof errorMsg ) + "\n";
		}
		console.log(newErrorMsg);
	}
}

} )( jQuery, 'jQuery.oue-custom.js' );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §2: OUE WEBSITE INITIALIZATION MODULES

////////
// §2.1: OueDropDownToggle class

/**
 * Module for initializing drop down toggles on OUE websites.
 *
 * @class
 */
var OueDropDownToggles = ( function( $, thisFileName ) {
	'use strict';

	/**
	 * Constructor for EmailConfirmations.
	 *
	 * @param {object} sels - Collection of selectors to drop down toggles and their components.
	 */
	function OueDropDownToggles( sels, activatingClass, animDuration ) {
		this.sels = sels;
		this.activatingClass = activatingClass;
		this.animDuration = animDuration;
	}

	OueDropDownToggles.prototype.isValid = function () {
		var stillValid;
		var props;

		// Check the integrity of the sels member.
		stillValid = typeof this.sels === 'object';
		if ( stillValid ) {
			props = Object.getOwnPropertyNames( this.sels );
			stillValid = props.length === 3 && props.find ( function( elem ) {
				return elem === 'toggles';
			} ) && props.find ( function( elem ) {
				return elem === 'targets';
			} ) && props.find ( function( elem ) {
				return elem === 'containers';
			} );
		}

		// Check the integrity of the activatingClass member.
		if ( stillValid ) {
			stillValid = typeof this.activatingClass === 'string' &&
				$.isCssClass( this. activatingClass);
		}

		// Check the integrity of the animDuration member.
		if ( stillValid ) {
			stillValid = typeof this.animDuration === 'number' && animDuration > 0;
		}	

		return stillValid;
	}

	OueDropDownToggles.prototype.initialize = function () {
		var $containers;
		var $toggles;

		if ( this.isValid() ) {
			$containers = $( this.sels.containers );
			$toggles = $containers.find( this.sels.toggles );
			setTabIndices( $toggles );
			preventAnchorHighlighting( $toggles );
			effectToggleStatePermanence( $toggles, this.activatingClass );
			bindClickHandlers( $containers, this.sels.toggles, this.activatingClass );
			bindKeydownHandlers( $containers, this.sels.toggles, this.sels.targets,
				this.activatingClass );			
		}
	}

	function bindClickHandlers( $containers, selToggles, activatingClass ) {
		var $this;

		$containers.on( 'click', selToggles, function () {
			$this = $( this );
			$this.blur();
			$this.toggleClass( activatingClass );
			setUpToggleStatePermanence( $this, activatingClass );
		} );
	}

	function bindKeydownHandlers( $containers, selToggles, activatingClass ) {
		var $this;

		$containers.on( 'keydown', selToggles, function ( e ) {
			e.preventDefault();
			$this = $ ( this );
			$this.toggleClass( activatingClass );
			setUpToggleStatePermanence( $this, activatingClass );
		} );
	}

	function effectToggleStatePermanence( $toggles, activatingClass ) {
		var $this;
		var state;
		var thisFuncName = "effectDropDownTogglePermanence";
		var thisFuncDesc = "Upon page load, sets the expansion state of a drop down toggle element \
based on previous user interactions during the session.";

		$toggles.each( function() {
			$this = $( this );
			if ( $this[0].id ) {
				try {
					state = sessionStorage.getItem( $this[0].id );
					if ( state == "expanded" ) {
						$this.toggleClass( activatingClass );
					}
				} catch( e ) {
					$.logError( thisFileName, thisFuncName, thisFuncDesc, e.message );
				}
			} else {
				$.logError( thisFileName, thisFuncName, thisFuncDesc,
					"No ID was set for this drop down toggle element; thus, expansion state permane\
nce cannot be effected." );
			}
		} );
	}

	function preventAnchorHighlighting( $toggles ) {
		$toggles.addClass( 'no-anchor-highlighting' );
	}

	function setTabIndices( $toggles ) {
		$toggles.attr( 'tabindex', 0 );
	}

	function setUpToggleStatePermanence( $toggle, activatingClass ) {
		var state;
		var thisFuncName = 'setUpToggleStatePermanence';
		var thisFuncDesc = 'Records the expansion state of a drop down toggle element in local stor\
age to later effect permanence.';

		if ( $toggle[0].id ) {
			try {
				state = $toggle.hasClass( activatingClass ) ? 'expanded' : 'collapsed';
				sessionStorage.setItem( $toggle[0].id, state );
			} catch( e ) {
				$.logError( thisFileName, thisFuncName, thisFuncDesc, e.message );
			}
		} else {
			$.logError( thisFileName, thisFuncName, thisFuncDesc, 'No ID was set for this drop down\
 toggle element; thus, expansion state permanence cannot be effected.' );
		}
	}

	return OueDropDownToggles;
} )( jQuery, 'jQuery.oue-custom.js' );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §3: AFTER DOM IS READY excution section

( function( $, thisFileName ) {

'use strict';

$( function () {
	var argsList = new Object(); // List of arguments that will be passed to functions
	var args; // List of arguments currently being utilized
	
	argsList.fixDogears = {
		slctrSiteNav: "#spine-sitenav",
		slctrDogeared: "li.current.active.dogeared",
		removedClasses: "current active dogeared"
	};
	args = argsList.fixDogears;
	fixDogears( args.slctrSiteNav, args.slctrDogeared, args.removedClasses );

	argsList.addBlankTargetAttributes = {
		slctrSpine: "#spine",
		slctrExternalLinks: "a.external"
	};
	args = argsList.addBlankTargetAttributes;
	addBlankTargetAttributes( args.slctrSpine, args.slctrExternalLinks );

	argsList.checkForLrgFrmtSingle = {
		slctrSingle: ".single.large-format-friendly",
		slctrMainHdr: "header.main-header",
		slctrHdrGroup: ".header-group",
		centeringClass: "centered"
	};
	args = argsList.checkForLrgFrmtSingle;
	checkForLrgFrmtSingle( args.slctrSingle, args.slctrMainHdr, args.slctrHdrGroup, 
		args.centeringClass );

	argsList.initHrH2Motif = {
		slctrStandardH2: ".column > h2:not(.fancy), .column > section > h2:not(.fancy)",
		slctrPrevHr: "hr:not(.subSection)",
		h2ClassesAdded: "no-top-margin",
		hrClassesAdded: "narrow-bottom-margin dark-gray thicker",
		animAddDrtn: 250
	};
	args = argsList.initHrH2Motif;
	initHrH2Motif( args.slctrStandardH2, args.slctrPrevHr, args.h2ClassesAdded, 
		args.hrClassesAdded, args.animAddDrtn );

	argsList.initFancyHrH2Motif = {
		slctrFancyH2: ".column > h2.fancy, .column > section > h2.fancy",
		slctrPrevHr: "hr:not(.subSection)",
		hrClassesAdded: "no-bottom-margin dark-gray thicker encroach-horizontal",
		animAddDrtn: 250
	};
	args = argsList.initFancyHrH2Motif;
	initFancyHrH2Motif( args.slctrFancyH2, args.slctrPrevHr, args.hrClassesAdded, 
		args.animAddDrtn );

	argsList.initHrH3Motif = {
		slctrStandardH3: ".column > h3:not(.fancy), .column > section > h3:not(.fancy)",
		slctrPrevHr: "hr:not(.subSection)",
		hrClassesAdded: "narrow-bottom-margin crimson",
		animAddDrtn: 250
	};
	args = argsList.initHrH3Motif;
	initHrH3Motif( args.slctrStandardH3, args.slctrPrevHr, args.hrClassesAdded, args.animAddDrtn );

	argsList.initFancyHrH3Motif = {
		slctrFancyH3: ".column > h3.fancy, .column > section > h3.fancy",
		slctrPrevHr: "hr:not(.subSection)",
		hrClassesAdded: "no-bottom-margin crimson encroach-horizontal",
		animAddDrtn: 250
	};
	args = argsList.initFancyHrH3Motif;
	initFancyHrH3Motif( args.slctrFancyH3, args.slctrPrevHr, args.hrClassesAdded, 
		args.animAddDrtn );

	argsList.initDropDownToggles = {
		slctrToggle: ".drop-down-toggle",
		slctrWhatsToggled: ".toggled-panel",
		activatingClass: "activated",
		animDuration: 500
	};
	args = argsList.initDropDownToggles;
	initDropDownToggles( args.slctrToggle, args.slctrWhatsToggled, args.activatingClass, 
		args.animDuration );

	argsList.initReadMoreToggles = {
		slctrToggleIn: ".read-more-toggle-in-ctrl",
		slctrToggleOut: ".read-more-toggle-out-ctrl",
		slctrPanel: ".read-more-panel",
		animDuration: 500
	};
	args = argsList.initReadMoreToggles;
	initReadMoreToggles( args.slctrToggleIn, args.slctrToggleOut, args.slctrPanel, 
		args.animDuration );

	argsList.initContentFlippers = {
		slctrCntntFlppr: ".content-flipper",
		slctrFlppdFront: ".flipped-content-front",
		slctrFlppdBack: ".flipped-content-back",
		animDuration: 500
	};
	args = argsList.initContentFlippers;
	initContentFlippers( args.slctrCntntFlppr, args.slctrFlppdFront, args.slctrFlppdBack, 
		args.animDuration );

	argsList.initDefinitionLists = {
		slctrDefList: "dl.toggled",
		slctrLrgFrmtSection: ".large-format-friendly",
		slctrColOne: ".column.one",
		slctrColTwo: ".column.two",
		dtActivatingClass: "activated",
		ddRevealingClass: "revealed",
		animSldDrtn: 400,
		animHghtDrtn: 100
	};
	args = argsList.initDefinitionLists;
	initDefinitionLists( args.slctrDefList, args.slctrLrgFrmtSection, args.slctrColOne, 
		args.slctrColTwo, args.dtActivatingClass, args.ddRevealingClass, args.animSldDrtn, 
		args.animHghtDrtn );

	argsList.addDefinitionListButtons = {
		slctrDefList: argsList.initDefinitionLists.slctrDefList,
		expandAllClass: "expand-all-button",
		collapseAllClass: "collapse-all-button",
		btnDisablingClass: "disabled",
		dtActivatingClass: argsList.initDefinitionLists.dtActivatingClass,
		ddRevealingClass: argsList.initDefinitionLists.ddRevealingClass,
		animSldDrtn: argsList.initDefinitionLists.animSldDrtn
	};
	args = argsList.addDefinitionListButtons;
	addDefinitionListButtons( args.slctrDefList, args.expandAllClass, args.collapseAllClass, 
		args.btnDeactivatingClass, args.dtActivatingClass, args.ddRevealingClass, 
		args.animSldDrtn );

	argsList.initQuickTabs = {
		slctrQtSctn: "section.row.single.quick-tabs"
	};
	args = argsList.initQuickTabs;
	initQuickTabs( args.slctrQtSctn );

	argsList.initTocFloating = {
		slctrToc: "p.vpue-jump-bar",
		slctrBackToToc: "p.vpue-jump-back"
	};
	args = argsList.initTocFloating;
	initTocFloating( args.slctrToc, args.slctrBackToToc );

	argsList.initTriggeredByHover = {
		slctrTrggrdOnHvr: ".triggered-on-hover",
		slctrCntntRvld: ".content-revealed",
		slctrCntntHddn: ".content-hidden",
		animDuration: 200
	};
	args = argsList.initTriggeredByHover;
	initTriggeredByHover( args.slctrTrggrdOnHvr, args.slctrCntntRvld, args.slctrCntntHddn, 
		args.animDuration );
	
	// TODO: initScrollingSidebars("...");
} );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §4: AFTER WINDOW LOADED event bindings

$( window ).on( "load", function () {
	var argsList = new Object();
	var args;

	argsList.finalizeLrgFrmtSideRight = {
		slctrSideRight: ".side-right.large-format-friendly",
		slctrColOne: ".column.one",
		slctrColTwo: ".column.two",
		trggrWidth: 1051,
		animDuration: 100
	};
	args = argsList.finalizeLrgFrmtSideRight;
	finalizeLrgFrmtSideRight( args.slctrSideRight, args.slctrColOne, args.slctrColTwo, 
		args.trggrWidth, args.animDuration );

	argsList.showDefinitionListButtons = {
		slctrDefList: "dl.toggled",
		expandAllClass: "expand-all-button",
		collapseAllClass: "collapse-all-button",
		animFadeInDrtn: 400
	};
	args = argsList.showDefinitionListButtons;
	showDefinitionListButtons( args.slctrDefList, args.expandAllClass, args.collapseAllClass,
		args.animFadeInDrtn );

	argsList.initWelcomeMessage = {
		slctrWlcmMsg: "#welcome-message",
		slctrPostWlcmMsg: "#post-welcome-message",
		msgDelay: 1000,
		fadeOutDuration: 500,
		fadeInDuration: 500
	};
	args = argsList.initWelcomeMessage;
	initWelcomeMessage( args.slctrWlcmMsg, args.slctrPostWlcmMsg, args.msgDelay, 
		args.fadeOutDuration, args.fadeInDuration );

	argsList.addA11yTabPressListener = {
		listenerCallback: handleTabPressForA11y
	}
	args = argsList.addA11yTabPressListener;
	addA11yTabPressListener( args.listenerCallback );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §5: WINDOW RESIZE event bindings

$( window ).resize( function () {
	resizeLrgFrmtSideRight( ".side-right.large-format-friendly", "div.column.one",
		"div.column.two", 1051, 100 );
} );

////////////////////////////////////////////////////////////////////////////////////////////////////
// §6: FUNCTION DECLARATIONS

////////
// §6.1: addA11yTabPressListener

/**
 * Add an event listener to handle for keyboard navigation implied by tab presses. 
 *
 * Intended to support accessibility design.
 *
 * @param {function} listenerCallback - Function callback triggered on keydown event.
 */
function addA11yTabPressListener( listenerCallback ) {
	window.addEventListener( "keydown", listenerCallback );
}

////////
// §6.2: addBlankTargetAttributes

/**
 * Adds missing blank target attributes to links within the WSU Spine as needed.
 * 
 * @param {string} slctrSpine - Selector string for locating the spine object within the DOM.
 * @param {string} slctrExternalLinks - Selector string for locating links within the spine that
 *     lead to destination external to the domain.
 */
function addBlankTargetAttributes( slctrSpine, slctrExternalLinks ) {
	var thisFnctnName = "addBlankTargetAttributes";
	var thisFnctnDesc = "Adds missing blank target attributes to links within the WSU Spine as \
needed.";
	if ( typeof slctrSpine === "string" && typeof slctrExternalLinks === "string" ) {
		var $spine = $( slctrSpine );
		if ( $spine.length === 1 ) {
			var $links = $spine.find( slctrExternalLinks );
			$links.each( function () {
				var $thisLink = $( this );
				if ( $thisLink.attr( "target" ) != "_blank" ) {
					$thisLink.attr( "target", "_blank" );
					var relStr = $thisLink.attr( "rel" );
					if ( relStr == undefined ) {
						$thisLink.attr( "rel", "noopener noreferrer" );
					} else {
						if ( relStr.search( /noopener/i ) < 0 ) {
							relStr += " noopener";
						}
						if ( relStr.search( /noreferrer/i ) < 0 ) {
							relStr += " noreferrer";
						}
						$thisLink.attr( "rel", relStr );
					}
				}
			} );
		} else {
			$.logError( 
				thisFileName, thisFnctnName, thisFnctnDesc,
				"I could not locate the WSU Spine element within the DOM."
			);
		}
	} else {
		$.logError( 
			thisFileName, thisFnctnName, thisFnctnDesc,
			"I was passed one or more incorrectly typed parameters. Here's what I was \
passed:\n\ttypeof slctrSpine = " + ( typeof slctrSpine ) + "\n\ttypeof slctrExternalLinks = " +
				( typeof slctrExternalLinks )
		);
	}
}

////////
// §6.3: addDefinitionListButtons

/**
 * Automatically creates and binds events to expand/collapse all buttons designed for improving UX
 * of OUE site definition lists.
 *
 * @param {string} slctrDefList - Selector string for locating definition list elements within the
 *     DOM that contain collapsible definitions.
 * @param {string} expandAllClass - CSS class for controlling the layout of expand all buttons.
 * @param {string} collapseAllClass - CSS class for controlling the layout of collapse all buttons.
 * @param {string} btnDisablingClass - CSS class applied to disable expand/collapse all buttons.
 * @param {string} dtActivatingClass - CSS class used to indicate an active/expanded state for
 *     definition terms.
 * @param {string} ddRevealingClass - CSS class used to realize a revealed, visible state on
 *     definitions.
 */
function addDefinitionListButtons( slctrDefList, expandAllClass, collapseAllClass, 
		btnDisablingClass, dtActivatingClass, ddRevealingClass, animSldDrtn ) {
	var thisFuncName = "addDefinitionListButtons";
	var thisFuncDesc = "Automatically creates and binds events to expand/collapse all buttons \
designed for improving UX of OUE site definition lists";
	
	// Find and remove any pre-existing expand/collapse all buttons
	var $lists = $( slctrDefList );
	var $existingExpandAlls = $lists.children( "." + expandAllClass );
	var $existingCollapseAlls = $lists.children( "." + collapseAllClass );
	if ( $existingExpandAlls.length > 0 ) {
		$existingExpandAlls.remove();
		$.logError( 
			thisFileName, thisFuncName, thisFuncDesc,
			"Expand all buttons were already discovered in the DOM upon document initialization; \
please remove all buttons from the HTML source code to avoid wasting computational resources."
		);
	}
	if ( $existingCollapseAlls.length > 0 ) {
		$existingCollapseAlls.remove();
		$.logError( 
			thisFileName, thisFuncName, thisFuncDesc,
			"Collapse all buttons were already discovered in the DOM upon document initialization; \
please remove all buttons from the HTML source code to avoid wasting computational resources."
		);
	}
	
	// Add initially hidden ( via CSS ) expand/collapse all buttons to definition lists
	$lists.prepend( '<div class="collapse-all-button">[-] Collapse All</div>' );
	$lists.prepend( '<div class="expand-all-button">[+] Expand All</div>' );
	var slctrExpandAll = slctrDefList + " > ." + expandAllClass;
	var $expandAlls = $( slctrExpandAll );
	var slctrCollapseAll = slctrDefList + " > ." + collapseAllClass;
	var $collapseAlls = $( slctrCollapseAll );
	
	// Bind handling functions to button click events
	$expandAlls.click( function() {
		var $thisExpand = $( this );
		if ( !$thisExpand.hasClass( btnDisablingClass ) ) {
			var $nextCollapse = $thisExpand.next( "." + collapseAllClass );
			var $parentList = $thisExpand.parent( slctrDefList );
			if ( $parentList.length == 1 ) {
				// TODO: Disable buttons
				var $defTerms = $parentList.children( "dt" );
				$defTerms.each( function() {
					var $thisDefTerm = $( this );
					if ( !$thisDefTerm.hasClass( dtActivatingClass ) ) {
						$thisDefTerm.addClass( dtActivatingClass );
						var $thisDefTermNext = $thisDefTerm.next( "dd" );
						$thisDefTermNext.addClass( ddRevealingClass );
						$thisDefTermNext.stop().animate( {
							maxHeight: $thisDefTermNext[0].scrollHeight
						}, animSldDrtn );
					}
				} );
				// TODO: Enable buttons
			} else {
				$.logError( 
					thisFileName, thisFuncName, thisFunDesc,
					"When trying to bind a click event on an expand all button to a handling \
function, could not locate the parental definition list within DOM."
				);
			}
		}
	} );
	$collapseAlls.click( function() {
		var $thisCollapse = $( this );
		if ( !$thisCollapse.hasClass( btnDisablingClass ) ) {
			var $prevExpand = $thisCollapse.prev( "." + expandAllClass );
			var $parentList = $thisCollapse.parent( slctrDefList );
			if ( $parentList.length == 1 ) {
				// TODO: Disable buttons
				var $defTerms = $parentList.children( "dt" );
				$defTerms.each( function() {
					var $thisDefTerm = $( this );
					if ( $thisDefTerm.hasClass( dtActivatingClass ) ) {
						$thisDefTerm.removeClass( dtActivatingClass );
						var $thisDefTermNext = $thisDefTerm.next( "dd" );
						$thisDefTermNext.removeClass( ddRevealingClass );
						$thisDefTermNext.stop().animate( {
							maxHeight: 0
						}, animSldDrtn );
					}
				} );
				// TODO: Enable buttons
			} else {
				$.logError( 
					thisFileName, thisFuncName, thisFunDesc,
					"When trying to bind a click event on collapse all button #" + 
						$thisCollapse.index() + "to a handling function, could not locate the \
parental definition list within the DOM."
				);
			}
		}
	} );
}

////////
// §6.4: checkForLrgFrmtSingle

function checkForLrgFrmtSingle( slctrSingle, slctrMainHdr, slctrHdrGroup, centeringClass ) {
	var $lrgFrmtSnglSctns;
	var $mainHeader;
	var $mnHdrChldDiv;

	$lrgFrmtSnglSctns = $( slctrSingle );
	if ( $lrgFrmtSnglSctns.length > 0 ) {
		$mainHeader = $( slctrMainHdr );
		$mainHeader.addClass( centeringClass );
		$mnHdrChldDiv = $mainHeader.find( slctrHdrGroup );
		$mnHdrChldDiv.addClass( centeringClass );
	}
}

////////
// §6.5: effectDropDownTogglePermanence

function effectDropDownTogglePermanence( $toggles, slctrWhatsToggled, activatingClass, 
		animDuration ) {
	var thisFuncName = "effectDropDownTogglePermanence";
	var thisFuncDesc = "Upon page load, sets the expansion state of a drop down toggle element \
based on previous user interactions during the session.";
	if ( $.isJQueryObj( $toggles ) ) {
		$toggles.each( function() {
			var $this = $( this );
			if ( $this[0].id ) {
				try {
					var state = sessionStorage.getItem( $this[0].id );
					if ( state == "expanded" ) {
						$this.toggleClass( activatingClass );
					}
				} catch( e ) {
					$.logError( thisFileName, thisFuncName, thisFuncDesc, e.message );
				}
			} else {
				$.logError( thisFileName, thisFuncName, thisFuncDesc,
					"No ID was set for this drop down toggle element; thus, expansion state \
permanence cannot be effected." );
			}
		} );
	} else {
		$.logError( thisFileName, thisFuncName, thisFuncDesc,
			"I was not passed a valid jQuery object." );
	}
}

////////
// §6.6: finalizeLrgFrmtSideRight

function finalizeLrgFrmtSideRight( slctrSideRight, slctrColOne, slctrColTwo, trggrWidth, 
		animDuration ) {
	if( $( window ).width() >= trggrWidth ) {
		$( slctrSideRight + ">" + slctrColTwo ).each( function () {
			var $this = $( this );
			var $thisPrev = $this.prev( slctrColOne );
			if( $this.height() != $thisPrev.height() ) {
				$this.height( $thisPrev.height() );
			}
			var crrntOpacity = $this.css( "opacity" );
			if ( crrntOpacity == 0 ) {
				$this.animate( {opacity: 1.0}, animDuration );
			}
		} );
	}
}

////////
// §6.7: fixDogears

function fixDogears( slctrSiteNav, slctrDogeared, removedClasses ) {
	// Fix bug wherein the wrong items in the spine become dogeared
	var $dogearedItems = $( slctrSiteNav ).find( slctrDogeared );
	if ( $dogearedItems.length > 1 ) {
		var currentURL = window.location.href;
		var currentPage = currentURL.substring( currentURL.substring( 0, currentURL.length -
 1 ).lastIndexOf( "/" ) + 1, currentURL.length - 1 );
		$dogearedItems.each( function () {
			var $this = $( this );
			var $navLink = $this.children( "a" );
			if ( $navLink.length == 1 ) {
				var navLinkURL = $navLink.attr( "href" );
				var navLinkPage = navLinkURL.substring( navLinkURL.substring( 0, navLinkURL.length -
 1 ).lastIndexOf( "/" ) + 1, navLinkURL.length - 1 );
				if ( navLinkPage != currentPage ) {
					$this.removeClass( removedClasses );
				}
			}
		} );
	}
}

////////
// §6.8: handleMouseClickForA11y

function handleMouseClickForA11y( e ) {
	$( "body" ).removeClass( "user-is-tabbing" )
	window.removeEventListener( "mousedown", handleMouseClickForA11y )
	window.addEventListener( "keydown", handleTabPressForA11y )
}

////////
// §6.9: handleTabPressForA11y

function handleTabPressForA11y( e ) {
	if ( e.keyCode === 9 ) {
		$( "body" ).addClass( "user-is-tabbing" )
		window.removeEventListener( "keydown", handleTabPressForA11y )
		window.addEventListener( "mousedown", handleMouseClickForA11y )
	}
}

////////
// §6.10: initContentFlippers

function initContentFlippers( slctrCntntFlppr, slctrFlppdFront, slctrFlppdBack, animDuration ) {
	$( slctrCntntFlppr ).click( function () {
		var $this = $( this );
		$this.next( slctrFlppdFront ).toggle( animDuration );
		$this.next( slctrFlppdFront ).next( slctrFlppdBack ).fadeToggle( animDuration );
	} );
	$( slctrFlppdFront ).click( function () {
		var $this = $( this );
		$this.toggle( animDuration );
		$this.next( slctrFlppdBack ).fadeToggle( animDuration );
	} );
}

////////
// §6.11: initDefinitionLists

function initDefinitionLists( slctrDefList, slctrLrgFrmtSection, slctrColOne, slctrColTwo,
 dtActivatingClass, ddRevealingClass, animHghtDrtn ) {
	var $listDts = $( slctrDefList + " dt" );
	$listDts.attr( "tabindex", 0 );
	$listDts.click( function() {
		var $this = $( this );
		$this.toggleClass( dtActivatingClass );
		var $thisNext = $this.next( "dd" );
		$thisNext.toggleClass( ddRevealingClass );
		if ( $thisNext.hasClass( ddRevealingClass ) ) {
			$thisNext.stop().animate( {
				maxHeight: $thisNext[0].scrollHeight
			} );
		} else {
			$thisNext.stop().animate( {
				maxHeight: 0
			} );
		}
		var $parent = $this.parents( slctrLrgFrmtSection + ">" + slctrColOne );
		var $prntNxt = $parent.next( slctrColTwo );
		$prntNxt.delay( 400 ).animate( {height: $parent.css( 'height' )}, animHghtDrtn );
	} );
	$listDts.on( "keydown", function( e ) {
		var regExMask = /Enter| /g; // TODO: Divide and conquer
		if ( regExMask.exec( e.key ) != null ) {
			e.preventDefault();
			var $this = $( this );
			$this.toggleClass( dtActivatingClass );
			var $thisNext = $this.next( "dd" );
			$thisNext.toggleClass( ddRevealingClass );
			if ( $thisNext.hasClass( ddRevealingClass ) ) {
				$thisNext.stop().animate( {
					maxHeight: $thisNext[0].scrollHeight
				} );
			} else {
				$thisNext.stop().animate( {
					maxHeight: 0
				} );
			}
			var $parent = $this.parents( slctrLrgFrmtSection + ">" + slctrColOne );
			var $prntNxt = $parent.next( slctrColTwo );
			$prntNxt.delay( 400 ).animate( {height: $parent.css( 'height' )}, animHghtDrtn );
		}
	} );
	$( slctrDefList + " dd" ).removeClass( ddRevealingClass );
}

////////
// §6.12: initDropDownToggles

function initDropDownToggles( slctrToggle, slctrWhatsToggled, activatingClass, animDuration ) {
	var $toggles =  $( slctrToggle );
	$toggles.attr( "tabindex", 0 );
	$toggles.addClass( "no-anchor-highlighting" );
	effectDropDownTogglePermanence( $toggles, slctrWhatsToggled, activatingClass, animDuration );
	$toggles.click( function () {
		var $this = $( this );
		$this.blur();
		$this.toggleClass( activatingClass );
		setupDropDownTogglePermanence( $this, activatingClass );
	} );
	$toggles.on( "keydown", function( e ) {
		var regExMask = /Enter| /g;
		if ( regExMask.exec( e.key ) != null ) {
			e.preventDefault();
			var $this = $( this );
			$this.toggleClass( activatingClass );
			setupDropDownTogglePermanence( $this, activatingClass );
		}
	} );
}

////////
// §6.13: initFancyHrH2Motif

function initFancyHrH2Motif( slctrFancyH2, slctrPrevHr, hrClassesAdded, animAddDrtn ) {
	$( slctrFancyH2 ).each( function () {
			$( this ).prev( slctrPrevHr ).addClass( hrClassesAdded, animAddDrtn );
	} );
}

////////
// §6.14: initFancyHrH3Motif

function initFancyHrH3Motif( slctrFancyH3, slctrPrevHr, hrClassesAdded, animAddDrtn ) {
	$( slctrFancyH3 ).each( function () {
		$( this ).prev( slctrPrevHr ).addClass( hrClassesAdded, animAddDrtn );
	} );
}

////////
// §6.15: initHrH2Motif

function initHrH2Motif( slctrStandardH2, slctrPrevHr, h2ClassesAdded, hrClassesAdded,
		animAddDrtn ) {
	$( slctrStandardH2 ).each( function () {
			var $this = $( this );
			var $prevElem = $this.prev( slctrPrevHr );
			if ( $prevElem.length > 0 ) {
				$this.addClass( h2ClassesAdded );
				$prevElem.addClass( hrClassesAdded, animAddDrtn );
			}
	} );
}

////////
// §6.16: initHrH3Motif

function initHrH3Motif( slctrStandardH3, slctrPrevHr, hrClassesAdded, animAddDrtn ) {
	$( slctrStandardH3 ).each( function () {
		$( this ).prev( slctrPrevHr ).addClass( hrClassesAdded, animAddDrtn );
	} );
}

////////
// §6.17: initQuickTabs

// TODO: Convert to a class-based initialization module
function initQuickTabs( slctrQtSctn ) {
	var $qtSctn = $( slctrQtSctn );
	$qtSctn.each( function () {
		var $thisSctn = $( this );
		var $tabCntnr = $thisSctn.find( "div.column > ul" );
		var $tabs = $tabCntnr.find( "li" );
		var $panelCntnr = $thisSctn.find( "table" );
		var $panels = $panelCntnr.find( "tbody:first-child > tr" );
		if( $tabs.length == $panels.length ) {
			var idx;
			var jdx;
			for ( idx = 0; idx < $tabs.length; idx++ ) {
				$tabs.eq( idx ).click( function() {
					var $thisTab = $( this );
					var kdx = $tabs.index( $thisTab );
					if ( kdx == 0 ) {
						if ( $thisTab.hasClass( "deactivated" ) ) {
							$thisTab.removeClass( "deactivated" );
							$panels.eq( kdx ).removeClass( "deactivated" );
							for ( jdx = 1; jdx < $tabs.length; jdx++ ) {
								if ( $tabs.eq( jdx ).hasClass( "activated" ) ) {
									$tabs.eq( jdx ).removeClass( "activated" );
									$panels.eq( jdx ).removeClass( "activated" );
								}
							}
							$( "html, body" ).animate( {
								scrollTop: $thisTab.offset().top
							}, 500 );								
						}
					} else {
						if ( !$thisTab.hasClass( "activated" ) ) {
							if ( !$tabs.eq( 0 ).hasClass( "deactivated" ) ) {
								$tabs.eq( 0 ).addClass( "deactivated" );
								$panels.eq( 0 ).addClass( "deactivated" );
							}
							for ( jdx = 1; jdx < kdx; jdx++ ) {
								if ( $tabs.eq( jdx ).hasClass( "activated" ) ) {
									$tabs.eq( jdx ).removeClass( "activated" );
									$panels.eq( jdx ).removeClass( "activated" );
								}
							}
							$thisTab.addClass( "activated" );
							$panels.eq( kdx ).addClass( "activated" );
							for ( jdx = kdx + 1; jdx < $tabs.length; jdx++ ) {
								if ( $tabs.eq( jdx ).hasClass( "activated" ) ) {
									$tabs.eq( jdx ).removeClass( "activated" );
									$panels.eq( jdx ).removeClass( "activated" );
								}
							}
							$( "html, body" ).animate( {
								scrollTop: $thisTab.offset().top
							}, 500 );								
						}
					}
				} );
			}
		}
	} );
}

////////
// §6.18: initReadMoreToggles

function initReadMoreToggles( slctrToggleIn, slctrToggleOut, slctrPanel, animDuration ) {
	$( slctrToggleIn ).click( function () {
		var $this = $( this );
		var $next = $this.next( slctrPanel );
		$this.toggle( animDuration );
		$this.$next.toggle( animDuration );
		$this.$next.next( slctrToggleOut ).toggle( animDuration );
	} );
	$( slctrToggleOut ).click( function () {
		var $this = $( this );
		var $next = $this.next( slctrPanel );
		$this.toggle( animDuration );
		$this.$next.toggle( animDuration );
		$this.$next.next( slctrToggleIn ).toggle( animDuration );
	} );
}

////////
// §6.19: initTocFloating

function initTocFloating( slctrToc, slctrBackToToc ) {
	var thisFuncName = "initTocFloating";
	var thisFuncDesc = "Cause the table of contents element to float after scrolling past a \
certain point";
	var $toc = $( slctrToc );
	var $backToToc = $( slctrBackToToc );
	var $linkToTop = $backToToc.first().children( "a" );
	var $mainHeader = $( "header.main-header" );
	if ( $toc.length === 1 && $mainHeader.length === 1 ) {
		var $window = $( window );
		var tocTrigger = $toc.offset().top + $toc.height() + 100;
		var $tocClone = $toc.clone().addClass( "floating" ).removeAttr( "id" ).insertAfter( $toc );
		$tocClone.find( "span.title + br").remove();
		$tocClone.find( "span.title").remove();
		var counter = 1;
		$tocClone.find( "br").each( function () {
			if ( counter % 2 != 0 ) {
				$( this ).before( " //");
			}
			$( this ).remove();
			counter++;
		} );
		if ( $linkToTop.length === 1 ) {
			var linkText = $linkToTop.text();
			var idxMatched = linkText.search( /\u2014Back to ([^\u2014]+)\u2014/ );
			if ( idxMatched != -1 ) {
				var $linkToTopClone = $linkToTop.clone();
				$linkToTopClone.text( linkText.replace( /\u2014Back to ([^\u2014]+)\u2014/,
					"$1" ) );
				$tocClone.prepend( " //&nbsp;" );
				$linkToTopClone.prependTo( $tocClone );
				$backToToc.remove();
			} else {
				$.logError( thisFileName, thisFuncName, thisFuncDesc, "Did not find the correct \
textual pattern within the link back to the top of the page." );
			}
		} else {
			console.log( thisFileName, thisFuncName, thisFuncDesc,  "Did not find a single \
hyperlink within the first link back to the top of the page." );
		}
		$window.scroll( function( e ) {
			var windowScrollPos = $window.scrollTop();
			if ( windowScrollPos > tocTrigger && !$tocClone.is( ":visible" ) ) {
				$tocClone.width( $mainHeader.width() * .8 );
				$tocClone.css( {
					left: $mainHeader.offset().left + $mainHeader.width() / 2,
				} );
				$tocClone.fadeIn( 300 );
			}
			else if ( windowScrollPos <= tocTrigger && $tocClone.is( ":visible" ) ) {
				$tocClone.hide();
			}
		} );
		$window.resize( function () {
			$tocClone.width( $mainHeader.width() * .8 );
			$tocClone.css( {
				left: $mainHeader.offset().left + $mainHeader.width() / 2,
			} );
		} );
	} else {
		if ( $toc.length > 1 ) {
			console.log( thisFileName, thisFuncName, thisFuncDesc, "Found more than one table of \
contents elements; this function only works with one table of contents." );
		}
		if ( $mainHeader.length === 0 ) {
			console.log( thisFileName, thisFuncName, thisFuncDesc, "Could not find the main header \
element within the DOM." );
		} else if ( $mainHeader.length > 1 ) {
			console.log( thisFileName, thisFuncName, thisFuncDesc, "Found more than one table of \
contents elements; this function only works with one table of contents.' }" );
		}
	}
}

////////
// §6.20: initTriggeredByHover

function initTriggeredByHover( slctrTrggrdOnHvr, slctrCntntRvld, slctrCntntHddn, animDuration ) {
	$( slctrTrggrdOnHvr ).mouseenter( function () {
		var $this = $( this );
		var $rvldCntnt = $this.find( slctrCntntRvld );
		var $hddnCntnt = $this.find( slctrCntntHddn );
		$rvldCntnt.stop().show( animDuration );
		$hddnCntnt.stop().hide( animDuration );
	} ).mouseleave( function () {
		var $this = $( this );
		var $rvldCntnt = $this.find( slctrCntntRvld );
		var $hddnCntnt = $this.find( slctrCntntHddn );
		$rvldCntnt.stop().hide( animDuration );
		$hddnCntnt.stop().show( animDuration );
	} );
}

////////
// §6.21: initWelcomeMessage

function initWelcomeMessage( slctrWlcmMsg, slctrPostWlcmMsg, msgDelay, fadeOutDuration, 
		fadeInDuration ) {
	$( slctrWlcmMsg ).delay( msgDelay ).fadeOut( fadeOutDuration, function () {
		$( slctrPostWlcmMsg ).fadeIn( fadeInDuration );
	} );
}

////////
// §6.22: resizeLrgFrmtSideRight

function resizeLrgFrmtSideRight( slctrSideRight, slctrColOne, slctrColTwo, trggrWidth,
		animDuration ) {
	finalizeLrgFrmtSideRight( slctrSideRight, slctrColOne, slctrColTwo, trggrWidth, animDuration );
}

////////
// §6.23: setupDropDownTogglePermanence

function setupDropDownTogglePermanence( $toggle, activatingClass ) {
	var thisFuncName = "setupDropDownTogglePermanence";
	var thisFuncDesc = "Records the expansion state of a drop down toggle element in local storage \
to later effect permanence.";
	if ( $.isJQueryObj( $toggle ) ) {
		if ( $toggle[0].id ) {
			try {
				var state = $toggle.hasClass( activatingClass ) ? "expanded" : "collapsed";
				sessionStorage.setItem( $toggle[0].id, state );
			} catch( e ) {
				$.logError( thisFileName, thisFuncName, thisFuncDesc, e.message );
			}
		} else {
			$.logError( thisFileName, thisFuncName, thisFuncDesc,
				"No ID was set for this drop down toggle element; thus, expansion state permanence \
cannot be effected." );
		}
	} else {
		$.logError( thisFileName, thisFuncName, thisFuncDesc,
			"I was not passed a valid jQuery object." );
	}
}

////////
// §6.24: showDefinitionListButtons

/**
 * Display expand/collapse all buttons, which were initially hidden
 * 
 * @param {string} slctrDefList - Selector string for locating definition list elements within the
 *     DOM that contain collapsible definitions.
 * @param {string} expandAllClass - CSS class for controlling the layout of expand all buttons.
 * @param {string} collapseAllClass - CSS class for controlling the layout of collapse all buttons.
 * @param {number} animFadeInDrtn - The animation speed in ms by which definitions fade into view.
 */
function showDefinitionListButtons( slctrDefList, expandAllClass, collapseAllClass,
		animFadeInDrtn ) {
	var thisFuncName = "addDefinitionListButtons";
	var thisFuncDesc = "Display expand/collapse all buttons, which were initially hidden";
	
	// Display expand/collapse all buttons
	var $lists = $( slctrDefList );
	var $expandAlls = $lists.children( "." + expandAllClass );
	var $collapseAlls = $lists.children( "." + collapseAllClass );
	$lists.animate( {
		marginTop: "+=39px"
	}, animFadeInDrtn, function() {
		$expandAlls.fadeIn( animFadeInDrtn );
		$collapseAlls.fadeIn( animFadeInDrtn );
	} );
}
	
} )( jQuery, 'jQuery.oue-custom.js' );
