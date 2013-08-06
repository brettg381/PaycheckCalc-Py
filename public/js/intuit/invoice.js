var intuit = intuit || {};

//Intuit Paycheck
intuit.invoice = (function(window,document,$,undefined){

	var defaults = {
		elementId: '#invoice'		
	}
	
	var iinvoice = {
		init: function() {
			console.log('init')
		}	
	} 
	
	return {
		init: function() {
			iinvoice.init()
		}
	}	
})(window,window.document,window.jQuery);
