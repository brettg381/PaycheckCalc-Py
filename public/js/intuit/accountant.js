!function ($) {
	// Send this to plugins.js
	jQuery.validator.addMethod(
	    "multiemails",
	     function(value, element) {
	         if (this.optional(element)) // return true on optional element
	             return true;
	         var emails = value.split(/[;,]+/); // split element by , and ;
	         valid = true;
	         for (var i in emails) {
	             value = emails[i];
	             valid = valid &&
	                     jQuery.validator.methods.email.call(this, $.trim(value), element);
	         }
	         return valid;
	     },

	   jQuery.validator.messages.multiemails
	);	

	var accountantForm = $('#accountant-form').validate({
		rules: {
			clients: { required: true, multiemails: true }, 
			email: { required: true, email: true }, 
			message: { required: true }
		},
		messages: {
            clients: {
                multiemails: "You need separate multiple emails with comma."
            }
        },		
        submitHandler: function(form) {
			$('#AccountantModal .input').addClass('hide');
			$('#AccountantModal .result').removeClass('hide');
			_gaq.push(['_trackEvent', 'Anonymous', 'Recommend from', form.id_email.value]);
			_gaq.push(['_trackEvent', 'Anonymous', 'Recommend to', form.id_clients.value]);
			xhr = $.ajax('/recommend',{
				type: 'POST',
				dataType: 'json',
				data:{
					email: form.id_email.value,
					clients: form.id_clients.value,
					message: form.id_message.value
				}
			});

			return false;
		}
	});
	
	// Set up the accountant recommendation div for clicks
	$('#accountant-share').on('click', function(e) {
		if ($(e.target).is('a')){
        	//this will stop event bubbling and will open the href of the anchor
        	e.stopPropagation();
    	}
		$('#AccountantModal').modal();
	});

	$('#AccountantModal').on('shown', function() {
		console.log('show');
		$('#accountant-form textarea').val("Try out this new paycheck calculator from Intuit.\n\nWhen it's time to cut checks, just enter your employee info and calculate the check amounts. When you save checks, the details from your payroll will appear in my accounting software. I'll be able to access all the details\nyou won't have to send me anything! It will be a big time saver at tax time, and it's free.");
	});
	
	$('#AccountantModal').on('hidden', function() {
		accountantForm.resetForm();
		$('#AccountantModal .input').removeClass('hide');
		$('#AccountantModal .result').addClass('hide');
		$('#accountant-form input,textarea').removeClass('error');
		$('#accountant-form input,textarea').val('');
		$('#btn-send-accountant').addClass('disabled');			
	});

	$('#accountant-form input,textarea').change(function() {
		if (accountantForm.valid()) {
			$('#btn-send-accountant').removeClass('disabled');
		}		
		else {
			$('#btn-send-accountant').addClass('disabled');			
		}
	});


}(window.jQuery);
