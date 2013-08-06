!function ($) {

	var registrationForm = $('#registration-form').validate({
		rules: {
			email: { required: true, email: true }, 
			password1: { required: true },
			accountant: { email: true }, 
		},
		submitHandler: function(form) {
			$.ajax({
				url: '/registration-async/',
				data: $('#registration-form').serialize(),
				type: 'post',
				cache: false,
				dataType: 'json',
				success: function(data) {
					if (data.status === 1) {
						window.authenticated = true;
						_gaq.push(['_trackEvent', 'User', 'Register']);
						
						$('#RegistrationModal .input').addClass('hide');
						if (intuit.calculator.need_save() === true) {
							$('#RegistrationModal .result-save').removeClass('hide');																		
							intuit.calculator.save_calculation(false);
						}
						else
							$('#RegistrationModal .result').removeClass('hide');							
					}
					else {
						if (data.error)
							$('#registration-form .alert-error p.error-info').html("Oh snap! " + data.error)
						else
							$('#registration-form .alert-error p.error-info').html("Oh snap! ")
						$('#registration-form .alert-error').show();
					}						

					$('#btn-signup').button('reset');					
				},
				error: function(data) {
					$('#btn-signup').button('reset');					
				}
			})

			return false;
		}
	});
	
	$('#RegistrationModal').on('hidden', function() {
		if (! $('#RegistrationModal .result').hasClass('hide') || ! $('#RegistrationModal .result-save').hasClass('hide')) {
			window.location = "/";
			return			
		}
		registrationForm.resetForm();
		$('#RegistrationModal .input').removeClass('hide');
		$('#RegistrationModal .result').addClass('hide');
		$('#RegistrationModal .result-save').addClass('hide');
		$('#registration-form input').removeClass('error');
		$('#registration-form input').val('');
		$('#btn-signup').addClass('disabled');			

	});

	$('#registration-form input').change(function() {
		if (registrationForm.valid()) {
			$('#btn-signup').removeClass('disabled');
		}		
		else {
			$('#btn-signup').addClass('disabled');			
		}
	});

}(window.jQuery);
