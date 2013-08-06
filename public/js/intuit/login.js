!function ($) {

	var loginForm = $('#login-form').validate({
		rules: {
			username: { required: true, email: true },
			password: { required: true }
		},
		submitHandler: function(form) {
			$('#btn-signin').button('loading');
			_gaq.push(['_trackEvent', 'User', 'Login']);			
			$.ajax({
				url: $('#login-form').attr('action'),
				data: $('#login-form').serialize(),
				type: 'post',
				cache: false,
				dataType: 'json',
				success: function(data) {
					if (data.status === 1)
						window.location = "/";
					else
						$('#login-form .alert-error').show();

					$('#btn-signin').button('reset');					
				},
				error: function(data) {
					$('#btn-signin').button('reset');					
				}
			})
			return false;
		}
	});

	var resetForm = $('#reset-form').validate({
		rules: {
			username: { required: true, email: true }
		},
		submitHandler: function(form) {
			$('#LoginModal .reset-password').addClass('hide');
			$('#LoginModal .reset-password-complete').removeClass('hide');

			return true;
		}
	});

	$('#login-form input').change(function() {
		if (loginForm.valid()) {
			$('#btn-signin').removeClass('disabled');
		}		
		else {
			$('#btn-signin').addClass('disabled');			
		}
	});

	$("#LoginModal a.cta-signup").click(function() {
		$('#LoginModal').modal('hide');
		$('#LoginModal').on('hidden', function() {
			$('#RegistrationModal').modal('show');
		});
		return false;
	});

	$("#LoginModal a.cta-reset").click(function() {
		$('#LoginModal .input').addClass('hide');
		$('#LoginModal .reset-password').removeClass('hide');
		return false;
	});

	$("#LoginModal a.cta-signin").click(function() {
		$('#LoginModal .reset-password').addClass('hide');
		$('#LoginModal .input').removeClass('hide');
		return false;
	});

	$('#LoginModal').on('hidden', function() {
		$('#LoginModal .reset-password-complete').addClass('hide');
		$('#LoginModal .reset-password').addClass('hide');
		$('#LoginModal .input').removeClass('hide');
	});
	
}(window.jQuery);
