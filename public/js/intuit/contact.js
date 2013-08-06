!function ($) {

	var contactForm = $('#contact-form').validate({
		rules: {
			username: { required: true, email: true }, 
			password: { required: true }
		},
		submitHandler: function(form) {
			$('#ContactModal .input').addClass('hide');
			$('#ContactModal .result').removeClass('hide');
			_gaq.push(['_trackEvent', 'User', 'Contact']);			
			xhr = $.ajax('/contact',{
				type: 'POST',
				dataType: 'json',
				data:{
					email: form.id_email.value,
					message: form.id_message.value
				}
			});

			return false;
		}
	});
	
	$('#ContactModal').on('hidden', function() {
		contactForm.resetForm();
		$('#ContactModal .input').removeClass('hide');
		$('#ContactModal .result').addClass('hide');
		$('#contact-form input,textarea').removeClass('error');
		$('#contact-form input,textarea').val('');
		$('#btn-contact-us').addClass('disabled');			
	});

	$('#contact-form input,textarea').change(function() {
		if (contactForm.valid()) {
			$('#btn-contact-us').removeClass('disabled');
		}		
		else {
			$('#btn-contact-us').addClass('disabled');			
		}
	});


}(window.jQuery);
