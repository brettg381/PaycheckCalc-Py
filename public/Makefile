JS_COMPRESSOR ?= `which uglifyjs`
CSS_COMPRESSOR ?= `which recess`
WATCHR ?= `which watchr`
INTUIT_LESS = ./less/bootstrap.less
INTUIT_RESPONSIVE_LESS = ./less/responsive.less

DATE=$(shell date +%I:%M%p)
CHECK=\033[32m✔\033[39m
HR=\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#\#

all: css js

js:
	@echo "\n${HR}"
	@echo "Building Javascript..."
	@echo "${HR}\n"
	@cat js/bootstrap/bootstrap-datepicker.js js/bootstrap/bootstrap-transition.js js/bootstrap/bootstrap-alert.js js/bootstrap/bootstrap-button.js js/bootstrap/bootstrap-carousel.js js/bootstrap/bootstrap-collapse.js js/bootstrap/bootstrap-dropdown.js js/bootstrap/bootstrap-modal.js js/bootstrap/bootstrap-tooltip.js js/bootstrap/bootstrap-popover.js js/bootstrap/bootstrap-scrollspy.js js/bootstrap/bootstrap-tab.js js/bootstrap/bootstrap-typeahead.js js/bootstrap/bootstrap-affix.js > js/intuit.bootstrap.js
	@cat js/intuit.bootstrap.js js/vendor/jquery.validation.js > js/intuit.js
	# Don't forget include intuit js to min file, removed for test only
	# @cat js/intuit.bootstrap.js js/vendor/jquery.validation.js js/intuit/calculator.js > js/intuit.js
	@${JS_COMPRESSOR} js/intuit.js -nc -m -o > js/intuit.min.js
	@rm js/intuit.bootstrap.js
	@echo "Compiling and minifying javascript...       ${CHECK} Done"

css:
	@echo "\n${HR}"
	@echo "Building Styles..."
	@echo "${HR}\n"
	@${CSS_COMPRESSOR}  --compile ${INTUIT_LESS} > ./css/intuit.css
	@${CSS_COMPRESSOR}  --compress ${INTUIT_LESS} > ./css/intuit.min.css
	@${CSS_COMPRESSOR}  --compile ${INTUIT_RESPONSIVE_LESS} > ./css/intuit-responsive.css
	@${CSS_COMPRESSOR}  --compress ${INTUIT_RESPONSIVE_LESS} > ./css/intuit-responsive.min.css
	@echo "Minifying styles...       ${CHECK} Done"

.PHONY: js css
