(function(){
    "use strict";

    // Global Variables
    var ariaExpanded = '',
    		ariaPressed = '',
    		ariaLabel = '',
    		isMobileWidth = false,
    		s;

		function checkMobileWidth(){
		  isMobileWidth = ($(window).width() < 1024);
		}


    // Menu actions
    function menu() {
    	var header = $("#header"),
    			navTrigger = $("#nav-trigger"),
    			navItems = $(".inner-container").find("a"),
    			signupBtn = $("#signup .button-wrap"),
    			label = $(".trigger-wrap .label"),
    			signup = $("#signup"),
    			signupLabel = $("#signup .button-wrap"),
    			slideout = $("#slideout"),
    			leaseNow = $("#lease-now"),
    			headerComponents = $("#header-components"),
    			navigationComponents = $("#header .nav-container #navigation-components");

			navItems.prop('tabindex', -1); //Default

	    navTrigger.on('click keyup',function(event){
				if (typeof event.keyCode === 'undefined' || event.keyCode === 13) { //Click or Enter key.

	        header.toggleClass('active');

	        if(isMobileWidth) { navigationComponents.toggleClass('active'); } 

	        $(this).toggleClass('active');

	        // Swap Labels
	        label.text(label.text() == 'Menu' ? 'Close' : 'Menu');

	        // Hide Sign Up/Slideout when menu is active.
	        if(header.hasClass('active')) { signup.addClass('hidden'); } else { signup.removeClass('hidden'); }
	        if(header.hasClass('active')) { slideout.addClass('hidden'); } else { slideout.removeClass('hidden'); }


	        // Hide header components when menu is active.
	        if(header.hasClass('active')) { leaseNow.addClass('hidden'); } else { leaseNow.removeClass('hidden'); }
	        if(header.hasClass('active')) { headerComponents.addClass('hidden'); } else { headerComponents.removeClass('hidden'); }

		      // 508
		      ariaExpanded = header.hasClass('active') ? 'true' : 'false'; // Determine if the content is hidden or shown
		      ariaPressed = header.hasClass('active') ? 'true' : 'false'; // Determine if the content is hidden or shown
		      ariaLabel = header.hasClass('active') ? 'Close Navigation' : 'Open Navigation'; // Determine if the content is hidden or shown

		      header.attr('aria-expanded', ariaExpanded); // Set the aria-expanded attribute accordingly
		      navTrigger.attr('aria-pressed', ariaPressed); // Set the aria-pressed attribute accordingly
		      navTrigger.attr('aria-label', ariaLabel); // Set the aria-label attribute accordingly

	        if(ariaExpanded == 'true'){
	        	$('a, button').prop('tabindex', -1); //remove tabindex on everything...
	        	signupBtn.prop('tabindex', -1);
	        	navItems.prop('tabindex', 0); //...except for the inner container
	        } else{
	        	$('a, button').prop('tabindex', 0);
	        	signupBtn.prop('tabindex', 0);
	        	navItems.prop('tabindex', -1);
	        }

				}
		  });
    }

	 // function clear_active_class(element) {
		// 	if(element.hasClass('active')) { element.removeClass('active'); }
	 // }

  // Slide Out functions
	function signup(){
	  var trigger = $("#signup .button-wrap"),
	  		slideoutTrigger = $("#slideout .button-wrap"),
	      signup = $("#signup"),
	      slideout = $("#slideout"),
	      signupWrapper = $("#signup .inner-wrap");

	  trigger.on('click keyup', function(event){
			if (typeof event.keyCode === 'undefined' || event.keyCode === 13) { // Click or Enter key.

				if(isMobileWidth) {
					signupWrapper.slideToggle();
				}

				// event.stopPropegation();

	      signup.toggleClass("active");
	      // slideout.toggleClass("active");

	      // 508
	      ariaExpanded = signup.hasClass('active') ? 'true' : 'false'; // Determine if the content is hidden or shown
	      ariaPressed = signup.hasClass('active') ? 'true' : 'false'; // Determine if the content is hidden or shown
	      ariaLabel = signup.hasClass('active') ? 'Close Sign Up Content' : 'Open Sign Up Content'; // Determine if the content is hidden or shown

	      signup.attr('aria-expanded', ariaExpanded); // Set the aria-expanded attribute accordingly
	      trigger.attr('aria-label', ariaLabel); // Set the aria-expanded attribute accordingly
 				trigger.attr('aria-pressed', ariaPressed); // Set the aria-expanded attribute accordingly
				
 				// Swap Label
				trigger.text(trigger.text() == 'Sign Up' ? 'Close' : 'Sign Up');

				// Remove class from sign up, if exists.
				if(slideout.hasClass('active')) {
					slideoutTrigger.text(slideoutTrigger.text() == 'Close' ? 'Specials' : 'Close');
					slideout.removeClass('active');
				}

       event.preventDefault();
			}

    });
	}

	function slideout(){
	  var trigger = $("#slideout .button-wrap"),
	  		signupTrigger = $("#signup .button-wrap"),
	      signup = $("#signup"),
	      slideout = $("#slideout"),
	      slideoutWrapper = $("#slideout .inner-wrap");

	  trigger.on('click keyup', function(event){
			if (typeof event.keyCode === 'undefined' || event.keyCode === 13) { // Click or Enter key.

				if(isMobileWidth) {
					slideoutWrapper.slideToggle();
				}
				// event.stopPropegation();
	      slideout.toggleClass("active");
	      // signup.toggleClass("active");

	      // 508
	      ariaExpanded = slideout.hasClass('active') ? 'true' : 'false'; // Determine if the content is hidden or shown
	      ariaPressed = slideout.hasClass('active') ? 'true' : 'false'; // Determine if the content is hidden or shown
	      ariaLabel = slideout.hasClass('active') ? 'Close Special Content' : 'Open Special Content'; // Determine if the content is hidden or shown

	      slideout.attr('aria-expanded', ariaExpanded); // Set the aria-expanded attribute accordingly
	      trigger.attr('aria-label', ariaLabel); // Set the aria-expanded attribute accordingly
 				trigger.attr('aria-pressed', ariaPressed); // Set the aria-expanded attribute accordingly
								
 				// Swap Label
				trigger.text(trigger.text() == 'Specials' ? 'Close' : 'Specials');

				// Remove class from sign up, if exists.
				if(signup.hasClass('active')) {
					signupTrigger.text(signupTrigger.text() == 'Close' ? 'Sign Up' : 'Close');
					signup.removeClass('active');
				}

       event.preventDefault();
			}

    });



	}


  // Responsive images
  function resizeImages(){
    $('.responsive-img').each(function(){
      var desktop = $(this).attr('data-d'),
          tablet = $(this).attr('data-t'),
          mobile = $(this).attr('data-m');
      if($(window).width() < 767) {
        $(this).attr('src', mobile );
      } else if($(window).width() < 1023) {
        $(this).attr('src', tablet );
      } else {
        $(this).attr('src', desktop );
      }
    });
  }

  //returns the width and height of the browser viewable area
  function alertSize(v) {
	  var myWidth = 0, myHeight = 0;
	  if( typeof( window.innerWidth ) == 'number' ) {
      //Non-IE
      myWidth = window.innerWidth;
      myHeight = window.innerHeight;
	  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
      //IE 6+ in 'standards compliant mode'
      myWidth = document.documentElement.clientWidth;
      myHeight = document.documentElement.clientHeight;
	  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
      //IE 4 compatible
      myWidth = document.body.clientWidth;
      myHeight = document.body.clientHeight;
	  }
	  if(v == "w"){
      return(myWidth);
	  }else if(v == "h"){
      return(myHeight);
	  }
  }

  function skrollrInit(){
      if (!((/Android|iPhone|iPad|iPod|BlackBerry/i).test(navigator.userAgent || navigator.vendor || window.opera) || (alertSize('w') < 769))){
          s = skrollr.init({
              forceHeight:false,
              smoothScrolling:false
          });
      }else if (typeof s != "undefined"){
          s.destroy();
      }
  }


	// Do stuff on document ready
	$(document).ready(function(){
		skrollrInit();
		menu();
		signup();
		slideout();
		resizeImages();
		checkMobileWidth();

		// $('#parallax-1').paroller({
		// 	factor: 0.5,
		// 	factorXs: 0.2
		// });

	});

	// Do stuff on Window resize
	$(window).on({
	  resize:function(){
      resizeImages();
      checkMobileWidth();
      skrollrInit();
	  },

	  // Do stuff on Window scroll
	  scroll:function(){
	  }
	})


}());




// Fire form submission success event after Formidable contact form submission
function frmThemeOverride_frmAfterSubmit(formReturned, pageOrder, errObj, object){
    if(typeof(formReturned) == 'undefined'){
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
            event: 'formSubmissionSuccess',
            formId: 'contactForm'
        });
    }
}