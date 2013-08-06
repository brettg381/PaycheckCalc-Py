var intuit = intuit || {};

//Intuit Paycheck
intuit.analytics = (function(window,document,$,undefined){

	var defaults = {
		code: 'UA-41027601-1'	
	}
	
	var ia = {
		init: function() {
		},
		page: function() {
		},
		event: function() {
		}
	} 
	
	return {
		init: function() {
			ia.init()
		},
		page: function() {
			ia.page()
		},
		event: function() {
			ia.event()
		}
	}	
})(window,window.document,window.jQuery);
