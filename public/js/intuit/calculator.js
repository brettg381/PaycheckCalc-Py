var intuit = intuit || {};

//Intuit Api Calculator
intuit.api = (function(window,document,$,undefined){
	//localStorage keys
	var LS_STATES_KEY = 'states',
	employee_list,
	today = new Date();

	var API_V1 = {
		endpoint:'/v1/',
		default_params:{
			periodsInYear: 52,
			payDate: today.getFullYear()  +''+('0' + today.getMonth()+1).slice(-2)+('0'+today.getDate()).slice(-2),
			federalFilingStatus: 'Single',
			federalExemptions: 0,
			federalAdditionalWithholding: 0,
			grossPay: 0,
			grossYTD:0,
			residenceCounty:'',
			residenceCity:'',
			residenceZip:'',
			workSiteCounty:'',
			workSiteCity:'',
			workSiteZip:''
		},

		/////////////////////////////////////////
		// Send request to the API
		// @param endpoint
		// @param method
		// @param data
		// @param callback
		//
		//  The request is sent to "endpoint" using "method" width "data" parameters
		// - On Error calls the callback function with status_ok = false
		// function callback(status_ok,data){}
		/////////////////////////////////////////
		send_request:function(endpoint,method,data,callback){
			return $.ajax("/proxy/",{
					'headers' : {
						'X-RESTProxy-endPoint':endpoint,
						'X-RESTProxy-debug':true
					},
					'timeout': 30e3, //30 segundos
					'type': method,
					'dataType': 'json',
					'data': extend({},data),
					cache: false
				}).fail(function(xhr,textStatus){
					callback && callback(false,{
							statusCode:xhr.status,
							description:textStatus,
							e:textStatus
					});
				});
		},

		/////////////////////////////////////////
		//  Gets the list of employees associated with logged user
		/////////////////////////////////////////
		get_employees:function(callback, callback_new){
			if (window.authenticated) {
				$.ajax({
				        url: '/calculator/autocomplete-employee',
				        dataType: 'json'
				    }).done(function (source) {
				    	var employees = $.map(source, function (value, key) { return { value: value, data: key }; });
				    	employee_list = employees;
				        $('#employee').autocomplete({
				            lookup: employees,
				            onSelect: function (obj) {
								if (obj.data===0&&typeof callback_new === 'function') {
				            		callback_new(obj.value);
									return;
								}
								if(typeof callback === 'function'){
				            		callback(obj.value);
				            	}
				            }
				        });
				});
			}
		},

		/////////////////////////////////////////
		//  Adds an employee associated with the logged in user
		/////////////////////////////////////////
		add_employee:function(employee, callback) {
			$('#spinner').show();
			$.ajax({
				url: '/employee/save/',
				data: $('#calculator-form').serialize(),
				type: 'POST',
				dataType: 'json',
				cache: false,
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console&&console.log(XMLHttpRequest);
				}
			}).done(
				function (source) {
					var timeout = setTimeout(function () {
						$('#spinner').hide();
						$('#state').focus();
						clearTimeout(timeout);
	    		    }, 650);
				    var employees = $.map(source, function (value, key) { return { value: value, data: key }; });
				    employee_list = employees;
				    $('#employee').autocomplete('setOptions', {lookup:employee_list});
				    if (typeof callback === 'function') {
				    	callback();
				    }
			});
		},

		/////////////////////////////////////////
		//  Gets the last info for selected employee
		/////////////////////////////////////////
		get_last:function(employee, callback){
			if (window.authenticated) {
				var employee_url = '/last-calculation/'
				if (employee !== undefined)
					employee_url = employee_url + encodeURIComponent(employee)
				$.ajax({
				        url: employee_url,
				        dataType: 'json'
				    }).done(function (response) {
						if(typeof callback === 'function'){
							callback(response);
						}
						return true;
					});
			}
		},

		/////////////////////////////////////////
		//  Gets the list of supported states from API and try to cache it using localStorage
		/////////////////////////////////////////
		get_states:function(callback){
			var ss = [{
				name: "Alabama",
				stateCode: "al",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/al"
				},
				{
				name: "Alaska",
				stateCode: "ak",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/ak"
				},
				{
				name: "Arizona",
				stateCode: "az",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/az"
				},
				{
				name: "California",
				stateCode: "ca",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/ca"
				},
				{
				name: "Florida",
				stateCode: "fl",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/fl"
				},
				{
				name: "Georgia",
				stateCode: "ga",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/ga"
				},
				{
				name: "Illinois",
				stateCode: "il",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/il"
				},
				{
				name: "Louisiana",
				stateCode: "la",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/la"
				},
				{
				name: "Maryland",
				stateCode: "md",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/md"
				},
				{
				name: "Nevada",
				stateCode: "nv",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/nv"
				},
				{
				name: "New Hampshire",
				stateCode: "nh",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/nh"
				},
				{
				name: "New York",
				stateCode: "ny",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/ny"
				},
				{
				name: "North Carolina",
				stateCode: "nc",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/nc"
				},
				{
				name: "South Dakota",
				stateCode: "sd",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/sd"
				},
				{
				name: "Tennessee",
				stateCode: "tn",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/tn"
				},
				{
				name: "Texas",
				stateCode: "tx",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/tx"
				},
				{
				name: "Virginia",
				stateCode: "va",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/va"
				},
				{
				name: "Washington",
				stateCode: "wa",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/wa"
				},
				{
				name: "Wyoming",
				stateCode: "wy",
				supported: true,
				url: "https://pocketpayroll-lb-qa-ssl-1602432401.us-east-1.elb.amazonaws.com/v1/usa/wy"
				}
			]
			callback(true,ss);
			return true;

			var states, jqhr;
			states = localStorage.getItem(LS_STATES_KEY);

			if(states ){
				states = JSON.parse(states);
				if(( (Date.now() - states.last_updated) * 0.001 ) < 7200){//Cached only for two hours
					if(typeof callback === 'function'){
						callback(true,states.statesSupported);
					}
					return true;
				}else{
					localStorage.clear();
				}
			}

			jqhr = this.send_request(this.endpoint + 'usa','GET',{},callback);
			jqhr.done(function(data,textStatus,xhr){
				var status_ok = data && data.status == "ok", i,count,stateCode;
				if(status_ok){
					count = data.statesSupported.length;
					for(i = 0; i < count; i += 1){
						stateCode = data.statesSupported[i].url.slice(-2);
						data.statesSupported[i].stateCode = stateCode;
						data.statesSupported[i].supported = true;
					}

					data.last_updated = Date.now();
					localStorage.setItem(LS_STATES_KEY,JSON.stringify(data));
				}

				if(typeof callback === 'function'){
					callback(status_ok,status_ok ? data.statesSupported : data.error);
				}

			});

			return true;
		},

		/////////////////////////////////////////
		// Calculate Results
		/////////////////////////////////////////
		get_results:function(state,params,callback){
			var jqhr = this.send_request(this.endpoint + 'usa/' + state,'POST',params,callback);
			jqhr.done(function(data,xhr){

				var status_ok = data && data.status == "ok";
				if(typeof callback === 'function'){
					callback(status_ok,status_ok ? {parsedInput: data.parsedInput,employeeTaxes:data.employeeTaxes} : data.error);
				}
			});
			return true;
		},

		/////////////////////////////////////////
		// Save Calculation Results
		/////////////////////////////////////////
		save_results:function(params,callback){

			var result = {};
			var prefix = 'result_'
			$.each(params.r, function(key, val) {
				result[prefix+key] = val;
			});

			$.ajax({
				url: '/calculator/save/',
				data: $('#calculator-form').serialize() + '&' + $.param(result),
				type: 'POST',
				cache: false,
				dataType: 'json',
				success: function(data) {
					var status_ok = data && data.status == "ok";
					if(typeof callback === 'function'){
						callback(status_ok);
					}
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console&&console.log(XMLHttpRequest);
				}
			})

			return true;
		}
	}

	return {
		default_params:API_V1.default_params,
		employees: function() {
			return employee_list
		},
		get_states: function (callback){
			return API_V1.get_states(callback);
		},
		get_employees: function (callback, callback_new){
			return API_V1.get_employees(callback, callback_new);
		},
		add_employee: function (employee, callback){
			return API_V1.add_employee(employee, callback);
		},
		get_results: function(state, params, callback){
			return API_V1.get_results(state, params, callback);
		},
		get_last: function(employee, callback){
			return API_V1.get_last(employee, callback);
		},
		save_results: function(params, callback){
			return API_V1.save_results(params, callback);
		}
	}
})(window,window.document,window.jQuery);


intuit.store = (function(window, document, $, undefined) {
	var store_days = 90,
		store = {
		createCookie: function (name, value, days) {
			var date, expires;

			if (days) {
				date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				expires = "; expires="+date.toGMTString();
			} else {
				expires = "";
			}
			document.cookie = name+"="+value+expires+"; path=/";
		},

		readCookie: function (name) {
			var nameEQ = name + "=",
					ca = document.cookie.split(';'),
					i, c;

			for (i=0; i < ca.length; i++) {
				c = ca[i];
				while (c.charAt(0)==' ') {
					c = c.substring(1,c.length);
				}

				if (c.indexOf(nameEQ) === 0) {
					return c.substring(nameEQ.length,c.length);
				}
			}
			return null;
		}
	}

	return {
		createCookie: function (name, values){
			return store.createCookie(name, values, store_days);
		},
		readCookie: function(name) {
			return store.readCookie(name);
		}
	}
})(window,window.document,window.jQuery);

intuit.location_service = (function(window, document, $, undefined){
	var service_url = '/proxyLS/';
	var LocationService = function(){
	}

	LocationService.prototype.getLocations = function(state, zip, callback) {
		if(typeof callback != 'function'){
			throw new TypeError('callback must be a function');
		}
		if(!state){
			throw new TypeError('state is mandatory');
		}

		if(!zip){
			throw new TypeError('zip is mandatory');
		}

		var xhr = $.ajax(service_url,{
			dataType: 'json',
			type: 'GET',
			cache: true,
			data: {state: state, zip: zip}
		});

		xhr.done(function(data){
			var status_ok = data && data.status == "ok";
			callback(status_ok,status_ok ? {parsedInput: data.parsedInput,locations:data.locations} : data.error);
		});

		xhr.fail(function(xhr,textStatus){
			callback(false,{statusCode:xhr.status,description:textStatus,e:textStatus});
		});
	};

	return new LocationService();
}(window,window.document, window.jQuery));


intuit.states = (function(window,document,undefined){
	var formElement = document.querySelector('#calculator-form');

	getStateValue = function(state,field){
		return getValue(formElement[state + '_' + field]);
	}

	zipError = function(el, clean) {

		var $el = $(el);

		// remove error
		if (clean) {
			$('.zip-error').remove()
		}
		else {
			$('.zip-error').remove();
			var $lbl = $('<label />').addClass('zip-error error').html('Invalid&nbsp;ZIP&nbsp;code')
			$el.addClass('error').closest('.form-line').append($lbl);
		}
	}

	/////////////////////////////////////////
	// Objects to handle each state independently.
	// object.state: state code, Eg. ny, ca, etc
	// object.init: called after state is selected.
	// object.parse: called before to send the data to the API. Returns an object with all fields (required and optionals)
	// object.reset: not used yet
	/////////////////////////////////////////
	return{
		al:{
			state: 'al',
			init:function(container){
				var that = this;
				if(container.getAttribute('data-initialized')){
					return;
				}
				container.setAttribute('data-initialized',true);
				this.container = container;

				addEvent(formElement['al_workSiteZip'],'keyup',function(e){

					if (this.value.length < 5){
						formElement['al_workSiteCity'].options.length = 0;
						formElement['al_workSiteCounty'].options.length = 0;

						formElement['al_workSiteCity'].disabled = true;
						formElement['al_workSiteCounty'].disabled = true;
						return true;
					}
					var el = this;

					// Clear dropdowns
					formElement['al_workSiteCity'].options.length = 0;
					formElement['al_workSiteCounty'].options.length = 0;

					formElement['al_workSiteCity'].disabled = true;
					formElement['al_workSiteCounty'].disabled = true;

					zipError(el, true);

					intuit.location_service.getLocations(that.state,this.value, function(status_ok,data){
						if(!status_ok) {
							zipError(el, false);
						}
						else {
							var i = 0, count = data.locations.length, cities = [], counties = [];
							formElement['al_workSiteCity'].disabled = false;
							formElement['al_workSiteCounty'].disabled = false;

							data.locations.forEach(function(el,idx){
								if(counties.indexOf(el.county) == -1){
									counties.push(el.county);
								}

								if(cities.indexOf(el.city) == -1){
									cities.push(el.city);
								}
							});


							if (counties.length == 0 && cities.length == 0) {
								zipError(el, false);
							}
							else {
								var citiesFrag = document.createDocumentFragment();
								cities.forEach(function(el,idx){
									var opt = document.createElement('option');
									opt.value = el;
									opt.text = el;
									opt.label = el;
									citiesFrag.appendChild(opt);
								});


								var countiesFrag = document.createDocumentFragment();
								counties.forEach(function(el,idx){
									var opt = document.createElement('option');
									opt.value = el;
									opt.text = el;
									opt.label = el;
									countiesFrag.appendChild(opt);
								});

								formElement['al_workSiteCity'].appendChild(citiesFrag);
								formElement['al_workSiteCounty'].appendChild(countiesFrag);
							}
						}
					});
				});

				$('#al_workSiteZip').rules('add',{
					required: {
						depends: function(element){
							return getComboValue(formElement['state']) == that.state;
						}
					},
					minlength: 5,
					maxlength: 5,
					digits: true
				});

				$('#al_workSiteCity, #al_workSiteCounty').rules('add',{
					required: {
						depends: function(element){
							return getComboValue(formElement['state']) == that.state;
						}
					}
				});

			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding'),
					workSiteCounty: getStateValue(this.state,'workSiteCounty'),
					workSiteCity: getStateValue(this.state,'workSiteCity'),
					workSiteZip: getStateValue(this.state,'workSiteZip')
				}
			},
			reset:function(){

			}
		},
		az:{
			state: 'az',
			init:function(container){
				this.container = container;
			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding')
				}
			},
			reset:function(){

			}
		},
		ca:{
			state: 'ca',
			init:function(container){
				this.container = container;
			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding')
				}
			},
			reset:function(){

			}
		},
		ga:{
			state: 'ga',
			init:function(container){
				this.container = container;
			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding')
				}
			},
			reset:function(){

			}
		},
		il:{
			state: 'il',
			init:function(container){
				this.container = container;
			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding')
				}
			},
			reset:function(){

			}
		},
		la:{
			state: 'la',
			init:function(container){
				this.container = container;
			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateSecondaryExemptions: getStateValue(this.state,'stateSecondaryExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding')
				}
			},
			reset:function(){

			}
		},
		md:{
			state: 'md',
			init:function(container){
				var that = this;
				if(container.getAttribute('data-initialized')){
					return;
				}
				container.setAttribute('data-initialized',true);
				this.container = container;
				$('#md_stateFilingStatus').rules('add',{
					required: false
				});
				$('#md_residenceCounty').rules('add',{
					required: {
						depends: function(element){
							return getComboValue(formElement['state']) == 'md' && getComboValue(formElement['md_stateFilingStatus']) != 'DoNotWithhold';
						}
					}
				});
			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding'),
					residenceCounty: getStateValue(this.state,'residenceCounty'),
					workSiteCounty: getStateValue(this.state,'workSiteCounty'),
					workSiteCity: getStateValue(this.state,'workSiteCity'),
					workSiteZip: getStateValue(this.state,'workSiteZip')
				}
			},
			reset:function(){

			}
		},
		ny:{
			state: 'ny',
			init:function(container){
				var that = this;
				if(container.getAttribute('data-initialized')){
					return;
				}

				container.setAttribute('data-initialized',true);
				this.container = container;

				this.residenceNL = document.querySelectorAll('.ny-residence');
				this.worksiteNL = document.querySelectorAll('.ny-worksite');

				formElement['ny_residenceCity'].selectedIndex = 0;
				formElement['ny_workSiteCity'].selectedIndex = 0;
/*
				eachNL(that.residenceNL,function(el){
					el.setAttribute('disabled',true);
					el.setAttribute('readonly',true);
				});

				eachNL(that.worksiteNL,function(el){
					el.setAttribute('disabled',true);
					el.setAttribute('readonly',true);
				});

				addEvent(formElement['ny_residenceCity'],'change',function(e){
					var val = getComboValue(this) ;
					if(val){
						eachNL(that.residenceNL,function(el){
							if(el.id == 'ny_residenceFilingStatus'){
								if(getComboValue(formElement['ny_workSiteCity']) !== ''){
									el.removeAttribute('disabled');
									el.removeAttribute('readonly');
								}else{
									el.setAttribute('disabled',true);
									el.setAttribute('readonly',true);
								}
							}else{
								el.removeAttribute('disabled');
								el.removeAttribute('readonly');
							}
						});
					}else{
						eachNL(that.residenceNL,function(el){
							el.setAttribute('disabled',true);
							el.setAttribute('readonly',true);
						});
					}
				});

				addEvent(formElement['ny_workSiteCity'],'change',function(e){
					var val = getComboValue(this),i, el ;
					if(val){
						if(getComboValue(formElement['ny_residenceCity']) !== ''){
							formElement['ny_residenceFilingStatus'].removeAttribute('disabled');
							formElement['ny_residenceFilingStatus'].removeAttribute('readonly');
						}

						eachNL(that.worksiteNL,function(el){
							el.removeAttribute('disabled');
							el.removeAttribute('readonly');
						});
					}else{
						formElement['ny_residenceFilingStatus'].setAttribute('disabled', true);
						formElement['ny_residenceFilingStatus'].setAttribute('readonly', true);

						eachNL(that.worksiteNL,function(el){
							el.setAttribute('disabled',true);
							el.setAttribute('readonly',true);
						});
					}
				});
*/
			},
			parse:function(){

				var residenceExemptions,
					residenceAdditionalWithholding,
					workSiteExemptions,
					workSiteAdditionalWithholding;

				if (getStateValue(this.state, 'residenceCity') == 'Yonkers') {
					residenceExemptions = getStateValue(this.state,'stateExemptions');
					residenceAdditionalWithholding = getStateValue(this.state,'workSiteAdditionalWithholding')
				}
				else if (getStateValue(this.state, 'residenceCity') == 'New York') {
					residenceExemptions = getStateValue(this.state,'residenceExemptions');
					residenceAdditionalWithholding = getStateValue(this.state,'residenceAdditionalWithholding')
				}
				else {
					residenceExemptions = null;
					residenceAdditionalWithholding = null;
				}

				if (getStateValue(this.state, 'workSiteCity') == 'Yonkers') {
					workSiteExemptions = getStateValue(this.state,'stateExemptions');
					workSiteAdditionalWithholding = getStateValue(this.state,'workSiteAdditionalWithholding');
				}
				else {
					workSiteExemptions = null;
					workSiteAdditionalWithholding = null;
				}

				return {
					residenceCity: getStateValue(this.state,'residenceCity'),
					workSiteCity: getStateValue(this.state,'workSiteCity'),
					residenceFilingStatus: getStateValue(this.state,'residenceFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding'),
					stateFilingStatus: getStateValue(this.state,'residenceFilingStatus'),
					residenceExemptions: residenceExemptions,
					residenceAdditionalWithholding: residenceAdditionalWithholding,
					workSiteAdditionalWithholding: workSiteAdditionalWithholding,
					workSiteFilingStatus: getStateValue(this.state,'residenceFilingStatus'),
					workSiteExemptions: workSiteExemptions
				}

			},
			reset:function(){

			}
		},
		nc:{
			state: 'nc',
			init:function(container){
				this.container = container;
			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding')
				}
			},
			reset:function(){

			}
		},
		va:{
			state: 'va',
			init:function(container){
				this.container = container;
			},
			parse:function(){
				return {
					stateFilingStatus: getStateValue(this.state,'stateFilingStatus'),
					stateExemptions: getStateValue(this.state,'stateExemptions'),
					stateAdditionalWithholding: getStateValue(this.state,'stateAdditionalWithholding')
				}
			},
			reset:function(){

			}
		},
		wa:{
			state: 'wa',
			init:function(container){
				var that = this;
				if(container.getAttribute('data-initialized')){
					return;
				}

				container.setAttribute('data-initialized',true);
				this.container = container;

				$('#wa_workersCompRate').rules('add',{
					number: true,
					min: 0,
					required: {
						depends: function(element){
							return getComboValue(formElement['state']) == 'wa';
						}
					}
				});
			},
			parse:function(){
				return {
					workersCompRate: getStateValue(this.state,'workersCompRate')
				}
			},
			reset:function(){

			}
		}
	}
}(window,window.document));

intuit.calculator = (function(window,document,$,undefined){
	var needSave = false,
	grossTextHelp = "Some taxes are calculated based on year-to-date amounts.<br> If you've paid EMPLOYEE_NAME this year, enter the total wages, before taxes, paid so far (Gross Year-To-Date amount).",
	formElement = document.querySelector('#calculator-form'),
	resultElement = document.querySelector('.result-wrapper'),
	calculatorResultElement = document.querySelector('#calculator-result .section-inner'),
	calculatorShareElement = document.querySelector('#calculator-share .section-inner'),
	statesElement = formElement['state'],
	employeeElement = formElement['employee'],
	buttonCalculateElement = document.querySelector('#btn-calculate'),
	buttonRecalculateElement = document.querySelector('#btn-recalculate'),
	buttonSaveElement = document.querySelector('#btn-save'),
	buttonSendEmailElement = document.querySelector('.button-send-email'),
	buttonSendPDFElement = document.querySelector('.button-send-pdf'),
	buttonSendNotSupported = document.querySelector('.button-send-notsupported'),
	buttonBackElement = document.querySelector('.button-back'),
	formBodyElement = document.querySelector('.form-body'),
	notSupportedElement = document.querySelector('#not-supported'),
	fcal = {}, //calculator fields. input and result
	first = true,
	sel_employee,
	new_employee = false,
	selected_state,
	old_selected_state,
	is_disabled = true,
	tpl,
	tpls,
	last_result,
	re_tax_name = /([A-Z]{2})_(Income|SDI,SUI)/i,
	tax_labels = {
		FedIncome : 'Federal Income Tax',
		SocSecurity: 'Social Security',
		Medicare: 'Medicare',
		Income: 'Income Tax',
		SDI: 'State Disability Tax',
		SUI: 'SUI Tax',
		NYC_Resident: 'NYCity local city tax',
		Yonkers_Resident: 'Yonkers local city tax',
		Yonkers_WorkSite: 'Yonkers local city tax'
	},
	help_url = '/help',
	supported_states = [];


	setTimeout(function(){
		init_calculator();
	},100);

	/////////////////////////////////////////
	// Init Calculator
	/////////////////////////////////////////
	function init_calculator() {
		var cta = '<a id="btn-calculate" href="#" class="btn btn-primary btn-large" data-loading-text="Calculating...">Calculate this check!</a>',
			tpl_init = {
				hourly: 1,
				net_pay: "0.00",
				taxes: [
				{
					amount: "0.00",
					amount_ytd: "0.00",
					name: "Federal Income Tax"
				},
				{
					amount: "0.00",
					amount_ytd: "0.00",
					name: "Social Security"
				},
				{
					amount: "0.00",
					amount_ytd: "0.00",
					name: "Medicare"
				},
				]
			}

		tpl = Hogan.compile(document.querySelector('#calculator-result-tpl').innerHTML);
		tpls = Hogan.compile(document.querySelector('#calculator-share-tpl').innerHTML);

		calculatorResultElement.innerHTML = tpl.render(tpl_init) + cta;
		calculatorShareElement.innerHTML = tpls.render();

		// reset form
		buttonCalculateElement = document.querySelector('#btn-calculate');
		addEvent(buttonCalculateElement,'click',function(e){
			cancelEvent(e);
			var btn = $(this);
			if (btn.hasClass('disabled'))
				return;

			btn.button('loading');
			if($('#calculator-form').validate().form()){
				History.pushState({module:"calculate"},'Intuit Easy Paycheck - Result','result');
				calculate();
			}else{
	            btn.button('reset')

				var $error = $('input.error:first');
				if ($error && $error.length == 0) {
					$error = $('select.error:first');
				}
				var el = $error.parents('.accordion-group').find('.accordion-toggle')
				if (el.hasClass('collapsed'))
					el.trigger('click');
			}
			return false;
		});
	}

	/////////////////////////////////////////
	// Callback function to parse API reponse to get_states
	/////////////////////////////////////////
	function get_states(status_ok,data){
		if (status_ok) {
			data.forEach(function(data_state){
				supported_states[data_state.stateCode] = data_state;
			});
		}
	}

	/////////////////////////////////////////
	// Triggered on "State" change
	/////////////////////////////////////////
	function select_state(state){
		var state_container = document.querySelector('.state-' + state),
			not_supported_state_name,
			last_state_container,
			supported_state = false;

		intuit.store.createCookie('selectedState', state);

		if(state in supported_states){
			buttonCalculateElement.classList.remove('hidden');
			formBodyElement.classList.remove('hidden');
			notSupportedElement.classList.add('hidden');
			supported_state = true;
		}else{
			not_supported_state_name = document.querySelector('#not-supported-state-name');
			not_supported_state_name.innerHTML = getComboLabel(statesElement);
		}
		old_selected_state = selected_state;
		selected_state = state;
		if(old_selected_state){
			last_state_container = document.querySelector('.state-' + old_selected_state);
			if(last_state_container){
				last_state_container.classList.add('hidden');
			}
		}

		if(new_employee && state){
			$('#collapseOne').collapse('show');
		}

		if(state_container){
			state_container.classList.remove('hidden');
			intuit.states[state] && intuit.states[state].init(state_container);
		}else if( !supported_state ){
			buttonCalculateElement.classList.add('hidden');
			formBodyElement.classList.add('hidden');
			notSupportedElement.classList.remove('hidden');
		}
	}

	function get_pay_type(){
		return getComboValue(formElement['pay_type']);
	}

	function get_tax_name(tax_name){
		var re_tmp;
		if(tax_labels[tax_name]){
			return tax_labels[tax_name];
		}else{
			re_tmp = re_tax_name.exec(tax_name);
			if(re_tmp){
				return re_tmp[1] + ' ' + tax_labels[re_tmp[2]];
			}else{
				return tax_name.replace(/_/,' ');
			}
		}
	}

	function save_calculation(handle_modal) {
		if (window.authenticated) {
			_gaq.push(['_trackEvent', 'User', 'Save', $('#employee').val()]);
			_gaq.push(['_trackEvent', window.username, 'Save', $('#employee').val()]);
			intuit.api.save_results(fcal, function(data){

			});
			if (handle_modal) {
				$('#RegistrationModal .input').addClass('hide');
				$('#RegistrationModal .result').addClass('hide');
				$('#RegistrationModal .result-save').removeClass('hide');
				$('#RegistrationModal').modal('show');
			}
		}
		else
			if (handle_modal)
				$('#RegistrationModal').modal('show');
	}

	/////////////////////////////////////////
	// Callback function to parse API response and display results
	/////////////////////////////////////////
	function calculate_response(status_ok,data){
		var  i,count,
			total = 0,
			tax_name,
			tmp_value = 0,
			state_upper,
			result = {};

		if(status_ok){
			needSave = true;
			if(data.employeeTaxes && data.employeeTaxes.length){
				total = +data.parsedInput.grossPay;

				result.gross_pay = total.formatMoney();
				result.gross_pay_ytd = getInputValue(formElement['gross_ytd'])

				count = data.employeeTaxes.length;
				result.taxes_temp = [];

				data.employeeTaxes.forEach(function(el){
					result.taxes_temp[el.name] = {
						name: get_tax_name(el.name),
						amount: (Math.abs(el.amount)).formatMoney()
					}
					total += +el.amount;
				});

				result.taxes = [];

				['FedIncome','SocSecurity','Medicare'].forEach(function(tax_name){
					if(result.taxes_temp[tax_name]){
						result.taxes.push(result.taxes_temp[tax_name]);
						delete result.taxes_temp[tax_name];
					}
				});
				state_upper = selected_state.toUpperCase();
				['_Income','_SDI'].forEach(function(tax_name){
					var name = tax_name;

					tax_name = state_upper + tax_name;
					if(result.taxes_temp[tax_name]){
						// Change tax name when this is SDI reeplace with "State Disability Tax"
						if (name == '_SDI') {
							result.taxes_temp[tax_name].name = state_upper + ' ' + tax_labels['SDI'];
						}

						result.taxes.push(result.taxes_temp[tax_name]);
						delete result.taxes_temp[tax_name];
					}
				});

				for(tax_name in result.taxes_temp){
					result.taxes.push(result.taxes_temp[tax_name]);
				}

			}

			result.pay_date = formElement['pay_date'].value;

			result.state = getComboLabel(statesElement);
			result.is_sarary = get_pay_type() == 'salary';

			var salaryVal;
			if(result.is_sarary){
				salaryVal = +getInputValue(formElement['pay_rate_hs']);
			} else {
				salaryVal = +getInputValue(formElement['salary']);
			}

			if (salaryVal)
				result.salary = salaryVal.formatMoney() ;


			tmp_value = +getInputValue(formElement['bonus']);
			if(tmp_value > 0){
				result.bonus = tmp_value.formatMoney();
			}

			tmp_value = +getInputValue(formElement['commission']);
			if(tmp_value > 0){
				result.commission = tmp_value.formatMoney();
			}

			if(!result.is_sarary){
				result.hours_worked = +getInputValue(formElement['hours_worked']);
				result.pay_rate_hs  = (+getInputValue(formElement['pay_rate_hs']));
				result.hours_total = (result.hours_worked * result.pay_rate_hs).formatMoney();
				result.pay_rate_hs = result.pay_rate_hs.formatMoney();

				tmp_value = +getInputValue(formElement['overtime_worked']);

				if(tmp_value > 0){
					result.ot_hours_worked = tmp_value;
					result.ot_pay_rate_hs  = +getInputValue(formElement['pay_rate_hs']) * 1.5;
					result.ot_total = (result.ot_hours_worked * result.ot_pay_rate_hs).formatMoney();
					result.ot_pay_rate_hs  = result.ot_pay_rate_hs.formatMoney();
				}
			}

			//Washington
			if(selected_state == 'wa'){
				result.workers_comp_rate = +getInputValue(formElement['wa_workersCompRate']);
				result.workers_comp_total = result.workers_comp_rate * result.hours_worked;
				total -= result.workers_comp_total;
				result.workers_comp_rate = result.workers_comp_rate.formatMoney(4);
				result.workers_comp_total = result.workers_comp_total.formatMoney();
			}

			result.net_pay = total.formatMoney();
			result.employee = titleCase(getInputValue(formElement['employee']));

			$.ajax({
			        url: '/calculator/ytd',
			        dataType: 'json',
			        type: 'post',
			        data: result
			}).done(function (response) {
				/////////////////////////////////////////
				// Show Result
				/////////////////////////////////////////
				result = extend(result, response.ytd)
				last_result = result;
				fcal.r = result;
				if (result.taxes)
					for (i=0; i<result.taxes.length; i++) {
						result.taxes[i].amount_ytd = response.taxes[result.taxes[i].name]
					}

				$('#btn-calculate').button('reset');
				calculatorResultElement.innerHTML = tpl.render(result);
				calculatorShareElement.innerHTML = tpls.render({employee: result.employee, total: result.net_pay, date: result.pay_date});

				/////////////////////////////////////////
				// Save success alert message
				/////////////////////////////////////////

				$('#RegistrationModal .result-info').html("Don't forget to handwrite and deliver this check for $"+ result.net_pay + " to " + result.employee + " on " + result.pay_date);

				/////////////////////////////////////////
				// onClick save
				/////////////////////////////////////////
				buttonSaveElement = document.querySelector('#btn-save');
				addEvent(buttonSaveElement,'click',function(e){
					save_calculation(true);
					return true;
				});

				buttonRecalculateElement = document.querySelector('#btn-recalculate');
				addEvent(buttonRecalculateElement,'click',function(e){
					// reset form
					e.preventDefault();
					$('#hours_worked').val('');
					$('#overtime_worked').val('');
					$('#bonus').val('');
					$('#commission').val('');
					History.back();
					return false;
				});

				$('section').each(function(){
					$(this).animate({
					    left: '-=' + $(this).width(),
					  }, 500);
//					this.style.left = ($(this).position().left - $(this).width()) + 'px';
				});
			});
		}else {
			$(buttonCalculateElement).button('reset');
			console.log(data);

		}

	}

	function disable_form(val) {
		if (val.length > 3) {
			if (is_disabled) {
				is_disabled=false;
				$('#state').removeAttr("disabled")
				$('a.accordion-toggle').removeClass("disabled")
				$('.accordion-last').removeClass("disabled")
			}
		}
		else {
			if (!is_disabled) {
				is_disabled=true
				$('#state').attr("disabled", "disabled")
				$('a.accordion-toggle').addClass("collapsed disabled")
				$('.accordion-last').addClass('disabled')
				$('.accordion-body').removeClass('in').removeAttr("style")
			}
		}
	}

	function clear_form() {
		var payTypeElement = formElement['pay_type'],
			today = new Date(),
			ee = formElement['employee'].value;

		formElement.reset();
		formElement['pay_date'].value = ('0' + (today.getMonth()+1)).slice(-2)+ "/" + ('0'+today.getDate()).slice(-2) + "/" +today.getFullYear();
		payTypeElement.selectedIndex = 0;
		formElement['pay_period'].selectedIndex = 0;
		formElement['employee'].value = ee;
	  	$('.form-line.question').show();
		$('#gross_ytd').closest('.form-line').hide();

		if(!new_employee){
			var selectedState = intuit.store.readCookie('selectedState');
			if (selectedState) {
				statesElement.value = selectedState;
			}else if(statesElement.value){
				triggerEvent(statesElement,'change');
			}
		}else{
			if(selected_state){
				last_state_container = document.querySelector('.state-' + selected_state);
				if(last_state_container){
					last_state_container.classList.add('hidden');
				}
			}
			statesElement.value = '';
		}

		triggerEvent(payTypeElement,'change');



	}

	/////////////////////////////////////////
	// Get last calculation for selected employee
	// If Employee is null, retrieve last employee entered
	/////////////////////////////////////////
	function get_last_calculation(employee, callback) {

		var name = ''

		if (employee !== undefined) {
			name = employee;
		}

		intuit.api.get_last(name, function(response) {
			if (response.status == 1) {
				$.each(response.data, function(key, val) {
				  	var $elem = $('#' + key),
						decimal = 2;
				  	if (key=='pay_type') {
				  		switch(val) {
				  			case 1: $elem.val('salary'); break;
				  			default: $elem.val('hourly'); break;
				  		}

				  	}
				  	else if (key=='filing_status') {
				  		switch(val) {
				  			case 1: $elem.val('Married'); break;
				  			case 3: $elem.val('DoNotWithhold'); break;
		  					default: $elem.val('Single'); break;
				  		}
				  	}
				  	else
				  		$elem.val(val);
				  	if ($elem.hasClass("currency") && !(isNaN(val))) {
						$elem.val(Number(val).formatMoney(decimal,""));
				  	}
				});
				//
				$('#hours_worked').val('');
				$('#overtime_worked').val('');
				$('#bonus').val('');
				$('#commission').val('');

			  	$('.form-line.question').hide();
			  	$('#gross_ytd').closest('.form-line').hide();
			  	first = true;
				triggerEvent(formElement['pay_type'],'change');
				triggerEvent(formElement['state'],'change');
				disable_form(response.data.employee)
			}

			if(typeof callback === 'function'){
        		callback();
        	}
		});
	}

	/////////////////////////////////////////
	// Triggered when "Employee" created
	/////////////////////////////////////////
	function select_new_employee(employee){
		sel_employee = employee;
		intuit.api.add_employee(employee, function(){
			new_employee = true
			clear_form();
			disable_form(employee);
	  		$('.form-line.question').show();
	  		$('#gross_ytd').closest('.form-line').hide();
		});
	}

	/////////////////////////////////////////
	// Triggered on "Employee" change
	/////////////////////////////////////////
	function select_employee(employee){
		new_employee = true;
		$(intuit.api.employees()).each(function(index, val) {
			if (val.value == employee)
				new_employee = false;
		});

		if (new_employee) {
			clear_form();
			sel_employee = employee;
		}
		else
		{
			$('#spinner').show();
			clear_form();
			new_employee = false
			sel_employee = employee;
			get_last_calculation(employee, function() {
				var timeout = setTimeout(function () {
					$('#spinner').hide();
					$('#collapseOne').collapse('show');
					$('#hours_worked').focus();
					clearTimeout(timeout);
	            }, 650)

			});
		}
	}

	/////////////////////////////////////////
	// Calculate gross pay according the user input
	// @return float
	/////////////////////////////////////////
	function get_gross_pay(){
		var pay_type,
			pay_rate_hs = 0,
			gross_pay = 0;

		pay_type = get_pay_type();
		pay_rate_hs =+getInputValue(formElement['pay_rate_hs']) ;
		switch(pay_type){
			case 'hourly':
				gross_pay = pay_rate_hs * +getInputValue(formElement['hours_worked']);
				gross_pay += ( pay_rate_hs*1.5 ) * +getInputValue(formElement['overtime_worked']); //La hora extra vale +50%
				break;
			case 'salary':
				gross_pay = pay_rate_hs;
				break;
		}

		gross_pay += +getInputValue(formElement['salary']);
		gross_pay += +getInputValue(formElement['bonus']);
		gross_pay += +getInputValue(formElement['commission']);

		return gross_pay;
	}

	/////////////////////////////////////////
	// Returns parsed pay date
	/////////////////////////////////////////
	function get_pay_date(){
		var pay_date = formElement['pay_date'].value,
			date_parts = pay_date.split('/');

		return date_parts[2] + date_parts[0] + date_parts[1];
	}

	/////////////////////////////////////////
	// Triggered when user clicks on "Calculate".
	// Gets the input values and call the API
	/////////////////////////////////////////
	function calculate(){
		var params, state_params;

		last_result = null;
		params = {
			csrfmiddlewaretoken: getInputValue(formElement['csrfmiddlewaretoken']),
			payDate: get_pay_date(),
			periodsInYear: getComboValue(formElement['pay_period']),
			grossPay: get_gross_pay(),
			grossYTD: getInputValue(formElement['gross_ytd']),
			federalFilingStatus: getComboValue(formElement['filing_status']),
			federalExemptions: getInputValue(formElement['exemptions']),
			federalAdditionalWithholding: getInputValue(formElement['additional_withholding'])
		};
		_gaq.push(['_trackEvent', 'User', 'Calculate', window.username]);
		_gaq.push(['_trackEvent', window.username, 'Calculate', $('#employee').val()]);
		selected_state = $('#state').val();
		state_params = (intuit.states[selected_state] && intuit.states[selected_state].parse()) || {} ;
		params = extend({},intuit.api.default_params,params, state_params);
		intuit.api.get_results(selected_state,params,calculate_response);
	}

	DOMReady(function(){
		var	payTypeElement = formElement['pay_type'],
			resetButtonElement = document.querySelector('.reset-button'),
			currencyNL = document.querySelectorAll('.currency');

		intuit.api.get_states(get_states);
		intuit.api.get_employees(select_employee, select_new_employee);

		if (window.authenticated) {
			_gaq.push(['_trackEvent', 'User', 'Return', window.username]);
			get_last_calculation(undefined);
		}

		$('.form_help a').on('click', function(e) {
			var h = e.currentTarget.hash.substr(1);
			_gaq.push(['_trackEvent', 'User', 'Help', h]);
			return true
		});

		History.Adapter.bind(window,'statechange',function(){ // Note: We are using statechange instead of popstate
			// Log the State
			var State = History.getState();
			if (State.url.indexOf("result") == -1) {
				init_calculator();

				$('section').each(function(){
					this.style.left = ($(this).position().left + ($(this).width() * 1)) + 'px';
				});
			}
		});


		/////////////////////////////////////////
		// onChange State combo
		/////////////////////////////////////////
		addEvent(statesElement,'change',function(e){
			if (!window.authenticated) {
				_gaq.push(['_trackEvent', 'Anonymous', 'State Select', getComboValue(this)]);
			}
			select_state(getComboValue(this));
			return true;
		});

		/////////////////////////////////////////
		// onClick Help link
		/////////////////////////////////////////
		$('body').delegate('.form_help > a','click',function(e){
			e.preventDefault();
			var win_help = window.open(this.href,'Help','width=768,height=629,status=0,toolbar=0,menubar=0,resizable=0,scrollbars=1,top=50,left=250');
			win_help.focus();
			return false;
		});

		/////////////////////////////////////////
		// onChange Pay Type Combo
		/////////////////////////////////////////
		addEvent(payTypeElement,'change',function(e){
			var val = getComboValue(this),
				hours_worked_wrapper = document.querySelector('.hours-worked-wrapper'),
				overtime_worked_wrapper = document.querySelector('.overtime-worked-wrapper'),
				indicator = document.querySelector('.pay-rate-time-indicator'),
				salary_wrapper = document.querySelector('.salary-wrapper'),
				pay_rate_label = document.querySelector('.pay-rate-label');

			if (!first) {
				formElement['pay_rate_hs'].value = 0;
			}
			else {
				$('#gross_ytd').closest('.form-line').hide()
			}

			first = false;
			switch(val){
				case 'hourly':
					hours_worked_wrapper.style.display = 'table';
					overtime_worked_wrapper.style.display = 'table';
					indicator.innerHTML = 'per hour';
					salary_wrapper.style.display = 'table';
					pay_rate_label.innerHTML = 'Pay Rate';
					break;
				case 'salary':
					hours_worked_wrapper.style.display = 'none';
					overtime_worked_wrapper.style.display = 'none';
					indicator.innerHTML = '';
					salary_wrapper.style.display = 'none';
					pay_rate_label.innerHTML = 'Pay Amount';
					break;
			}
			return true;
		});

		/////////////////////////////////////////
		// Employee change
		/////////////////////////////////////////
		$('input[name=employee]').on('input',function(e){
			var val = $(this).val();
			disable_form(val);
		});


		/////////////////////////////////////////
		// Employee blur
		/////////////////////////////////////////
		if (window.authenticated) {
			$('input[name=employee]').on('blur',function(e){
				var val = $(this).val()
				if (val != sel_employee && val.length > 0) {
					select_employee(val)
					$('#gross-help').html(grossTextHelp.replace('EMPLOYEE_NAME', val));
					new_employee = true
				}
			});
		}
		else {
			$('input[name=employee]').on('blur',function(e){
				var val = $(this).val()
				if (val != sel_employee && val.length > 0) {
					$('#gross-help').html(grossTextHelp.replace('EMPLOYEE_NAME', val));
					_gaq.push(['_trackEvent', 'Anonymous', 'Create Employee', val]);
					triggerEvent(formElement['state'],'change');
				}
			});
		}
		triggerEvent(employeeElement, 'input');
		triggerEvent(employeeElement, 'blur');

		/////////////////////////////////////////
		// Events for tab selection in accordion
		/////////////////////////////////////////
		$('#grossQuestionNo').keydown(function(e) {
			if (e.keyCode == '9' || e.which == '9') {  // TAB key
				$('.accordion-body.in').collapse('hide');
				$('#collapseTwo').collapse('show');
			}
		});
		$('#commission').keydown(function(e) {
			if (e.keyCode == '9' || e.which == '9') {  // TAB key
				$('.accordion-body.in').collapse('hide');
				$('#collapseThree').collapse('show');
			}
		});
		$('#additional_withholding').keydown(function(e) {
			if (e.keyCode == '9' || e.which == '9') {  // TAB key
				$('.accordion-body.in').collapse('hide');
				$('.accordion-last:not(.hidden) > .accordion-body').collapse('show');
			}
		});

		/////////////////////////////////////////
		// Radio change
		/////////////////////////////////////////
		$("input[name='grossQuestion']").change(function() {
			if ($("input[name='grossQuestion']:checked").val() == 'Yes')
				$('#gross_ytd').closest('.form-line').show()
            else if ($("input[name='grossQuestion']:checked").val() == 'No')
				$('#gross_ytd').closest('.form-line').hide()
		});

		/////////////////////////////////////////
		// onClick Button Not Supported Suscription
		/////////////////////////////////////////
		addEvent(buttonSendNotSupported,'click',function(e){
			cancelEvent(e);
			this.disabled = true;
			var that = this,
				email = getInputValue(formElement['not-supported-email']),
				xhr,
				re_email = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;

			if(email === '' || ! re_email.test(email)){
				this.disabled = false;
				formElement['not-supported-email'].classList.add('error');
				return false;
			}

			if (window.authenticated) {
				_gaq.push(['_trackEvent', 'User', 'Not-Supported', getComboLabel(statesElement)]);
			}
			else {
				_gaq.push(['_trackEvent', 'Anonymous', 'Not-Supported', getComboLabel(statesElement)]);
			}

			formElement['not-supported-email'].classList.remove('error');

			xhr = $.ajax('/not-supported',{
				type: 'POST',
				dataType: 'json',
				data:{
					email: email,
					state: getComboLabel(statesElement)
				}
			});

			xhr.done(function(data, textStatus, jqXHR){
				that.disabled = false;
				var thx = document.querySelector('.not-supported-thanks'),
					frm = document.querySelector('.not-supported-form');
				frm.classList.add('hidden');
				thx.classList.remove("hidden");
				setTimeout(function(){
					formElement['not-supported-email'].value = '';
					frm.classList.remove('hidden');
					thx.classList.add("hidden");
				},5000);
			});
			return false;
		});

		/////////////////////////////////////////
		// onBlur currency elements format money
		/////////////////////////////////////////
		var fixCurrency = function(el){
			addEvent(el,'blur',function(e){
				cancelEvent(e);
				var val = +this.value,
					decimal = this.getAttribute('data-decimal') || 2;
				if(this.value > 0){
					this.value = val.formatMoney(decimal,"");
				}
				return false;
			});
		}
		eachNL(currencyNL,fixCurrency);
		/////////////////////////////////////////
		// end onBlur
		/////////////////////////////////////////

		clear_form();

	});

	return {
		send_email: function(params){
			var data = {
				result: JSON.stringify(last_result)
			}
			var jqhr = $.ajax('/send_mail',{
				'type': 'POST',
				'dataType': 'json',
				'data': extend({},data,params),
				cache: false
			}).done(function(data){

			}).fail(function(data){

			})
		},
		reset: function() {

		},
		save_calculation: function(handle_modal) {
			return save_calculation(handle_modal);
		},
		need_save: function() {
			return needSave;
		},
		result : function() {
			return last_result;
		}
	}
})(window,window.document,window.jQuery);
