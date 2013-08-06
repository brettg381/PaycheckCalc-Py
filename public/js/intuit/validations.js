$(document).ready(function(){

	jQuery.extend(jQuery.validator.messages,{
		number: 'Only&nbsp;numbers',
		digits: 'Only&nbsp;digits',
		required: 'Required&nbsp;field',
		min:'Only&nbsp;numbers'
	});
	
	jQuery.validator.addMethod(
	    "idate",
	    function ( value, element ) {
	        var bits = value.match( /([0-9]+)/gi ), str;
	        if ( ! bits )
	            return this.optional(element) || false;
	        str = bits[ 0 ] + '/' + bits[ 1 ] + '/' + bits[ 2 ];
	        return this.optional(element) || !/Invalid|NaN/.test(new Date( str ));
	    },
	    "Only date (dd/mm/yyyy)"
	);
	$('#calculator-form').validate({
		rules: {
			state:{
				required: false
			},
			pay_date: {
				required: true,
				idate: true
			},
			hours_worked: {
				/*required: {
					depends: function(element){
						return $('#pay_rate').val() == 'hourly';
					}
				},*/
				required: false,
				number: true,
				min: 0
			},
			pay_rate_hs: {
				required: false,
				number: true,
				min: 0
			},
			gross_ytd: {
				number: true,
				min: 0
			},
			overtime_worked: {
				number: true,
				min: 0
			},
			salary: {
				number: true,
				min: 0
			},
			bonus: {
				number: true,
				min: 0
			},
			commission: {
				number: true,
				min: 0
			},
			exemptions: {
				digits: true,
				min: 0
			},
			additional_withholding: {
				number: true,
				min: 0
			},
			al_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			az_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			ca_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			ga_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			il_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			la_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			md_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			ny_residenceAdditionalWithholding: {
				number: true,
				min: 0
			},
			ny_workSiteAdditionalWithholding: {
				number: true,
				min: 0
			},
			ny_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			nc_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			va_stateAdditionalWithholding: {
				number: true,
				min: 0
			},
			wa_workersCompRate: {
				number: true,
				min: 0
			},
			'not-supported-email': {
				email: true
			}
		},
		errorPlacement: function(error, element) {
    		element.closest('.form-line').append(error);
//    		error.insertBefore(element);
		}
	});

	$('input[name$=stateExemptions]').each(function(){
		$(this).rules('add',{digits:true, min:0})
	});
});
