/**************************************************************************************************\
| JQUERY-MEDIATED ENHANCED INTERACTIVITY OF GRAVITY FORM FIELDS                                    |
\**************************************************************************************************/
(function ($) {
    "use strict";
    
	$(document).ready(function () {
        if($("div.gform_body").length > 0) {
            hghlghtRqrdInpts(".oue-gf-rqrd-input");
            hghlghtRqrdChckbxs(".oue-gf-rqrd-checkbox");
            hghlghtRqrdTxtAreas(".oue-gf-rqrd-txtarea");
            setupActvtrChckbxs(".oue-gf-actvtr-checkbox");
            setupActvtrChain(".oue-gf-actvtr-chain");
            setupUploadChain(".oue-gf-upload-chain");
        }
    });
    
    /******************************************************************************************\
    | Highlight required INPUTS until a value has been properly entered                        |
    \******************************************************************************************/
    function hghlghtRqrdInpts (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $this = $(this);
                var $inputs = $this.find("input");
                $inputs.each(function () {
                    var $thisChild = $(this);
                    if ($thisChild.val() == "") {
                        $thisChild.removeClass("gf-value-entered");
                    }
                    else {
                        $thisChild.addClass("gf-value-entered");
                    }
                    $thisChild.blur(function () {
                        if ($thisChild.val() == "") {
                            $thisChild.removeClass("gf-value-entered");
                        }
                        else {
                            $thisChild.addClass("gf-value-entered");
                        }
                    });
                });
            });
        }
    }

    /******************************************************************************************\
    | Highlight required CHECKBOXES until at least one has been checked                        |
    \******************************************************************************************/
    function hghlghtRqrdChckbxs (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $this = $(this);
                var $inputs = $this.find("input");
                $inputs.each(function () {
                    var $thisChild = $(this);
                    $thisChild.change(function () {
                        var $thisParent, $parentsInputs;
                        var inputReady = false;
                        
                        $thisParent = $thisChild.parents("ul.gfield_checkbox");
                        $parentsInputs = $thisParent.find("input");
                        $parentsInputs.each(function () {
                            if ($(this).prop("checked") == true && !inputReady) {
                                inputReady = true;
                            }
                        });
                        if (inputReady) {
                            $thisParent.addClass("gf-value-entered");
                        }
                        else {
                            $thisParent.removeClass("gf-value-entered");
                        }
                    });
                });
            });
        }
    }

    /******************************************************************************************\
    | Highlight required TEXT AREA inputs until a value has been properly entered              |
    \******************************************************************************************/
    function hghlghtRqrdTxtAreas (selector) {
        if ($.type(selector) === "string") {
            $(selector).each(function () {
                var $this = $(this);
                var $inputs = $this.find("textarea");
                $inputs.each(function () {
                    var $thisChild = $(this);
                    if ($thisChild.val() == "") {
                        $thisChild.removeClass("gf-value-entered");
                    }
                    else {
                        $thisChild.addClass("gf-value-entered");
                    }
                    $thisChild.change(function () {
                        if ($thisChild.val() == "") {
                            $thisChild.removeClass("gf-value-entered");
                        }
                        else {
                            $thisChild.addClass("gf-value-entered");
                        }
                    });
                });
            });
        }
    }

    /******************************************************************************************\
    | Setup activator checkboxes that disappear once one is selected                           |
    \******************************************************************************************/
    function setupActvtrChckbxs (selector) {
        if ($.type(selector) === "string") {
            $(".gform_body").on("change", selector + " input", function () {
                var $thisChild = $(this);
                var $thisParent = $thisChild.parents(selector);
                $thisParent.addClass("gf-activated");
            });
        }
    }
    
    /******************************************************************************************\
    | Setup a chain of activator checkboxes, wherein once a checkbox is activated/deactivated, |
    | only its closest previous sibling is hidden/shown.                                       |
    \******************************************************************************************/
    function setupActvtrChain (selector) {
        if ($.type(selector) === "string") {
            $(".gform_body").on("change", selector + " input", function () {
                var $thisChild = $(this);
                var $thisParent = $thisChild.parents(selector);
                var $parentPrevSblngs = $thisParent.prevAll(selector);
                if($thisChild.prop("checked")) {
                    $parentPrevSblngs.first().addClass("gf-hidden");
                }
                else {
                    $parentPrevSblngs.first().removeClass("gf-hidden");
                }
            });
        }
    }

    /******************************************************************************************\
    | Setup a chain of file uploading inputs, wherein only the left-most input in the tree is  |
    | visible. As the user uploads files in sequence, the next nearest neighbor is unveiled.   |
    \******************************************************************************************/
    function setupUploadChain (selector) {
        if ($.type(selector) === "string") {
            /* CHECK IF UPLOADS ALREADY EXIST:
             *  It is possible to arrive at this point in execution after the user has submitted a
             *  form containing errors that also already contains transcripts uploaded to input
             *  fields that will be hidden by default. The following blocks of code resolve this
             *  situation by showing such fields, as well as their nearest neighbors.
             */
            var $inputs = $(selector + " input[type='file']");
            $inputs.each(function () {
                var $thisInput = $(this);
                var $nextDiv = $thisInput.nextAll("div[id]").first();
                if($nextDiv.length > 0) {
                    $thisChild.addClass("gf-value-entered");
                    var $thisParent = $thisChild.parents(selector).first();
                    $thisParent.removeClass("gf-hidden");
                    var $parentNextSblngs = $thisParent.nextAll(selector).first();
                    $parentNextSblngs.removeClass("gf-hidden");
                }
            });
            $(".gform_body").on("change", selector + " input[type='file']", function () {
                var $thisChild = $(this);
//                if($thisChild.attr('type') == 'file') {
                if($thisChild.prop("files").length > 0) {
                    $thisChild.addClass("gf-value-entered");
                    var $thisParent = $thisChild.parents(selector).first();
                    var $parentNextSblngs = $thisParent.nextAll(selector).first();
                    $parentNextSblngs.first().removeClass("gf-hidden");
                }
                else {
                    $thisChild.removeClass("gf-value-entered");
                }
//                }
            });
        }
    }
    
 })(jQuery);
