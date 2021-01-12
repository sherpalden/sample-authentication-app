const stringValidation = (str) => {
	if (/^[a-z A-Z]+$/.test(str)) {
		str = str.trim();//trim leading and trailling spaces..
		str = str.replace(/\s\s+/g, ' ');//trim middle spaces more than one.\
		return true;
	}else{
		return false;
	}
}

const numberValidation = (req) => {
	if (/^[0-9]+$/.test(req)){
		return true;
	}else{
		return false;
	}
}

const phoneNumberLengthValidation = (req) => {
	if(req.length == 10) {
		return true;
	}
	else return false;
}

const emailValidation = (req) => {
	if(req == null) return false;
	if(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(req)){
		return true;
	}else{
		return false;
	}
}

const passwordValidation = (req) => {
	if(/(?=^.{8,50}$)(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&amp;*()_+}{&quot;:;'?/&gt;.&lt;,])(?!.*\s).*$/.test(req)){
		return true;
	}
	else return false;
}

const noSpaceValidation = (req) => {
	if(req.split(" ").length > 1){
		return false;
	}else{
		return true;
	}
}

const dateValidation = (dateString) => {
	let inputDate = dateString;
	if( (inputDate.split('/')[0].length == 4) || (inputDate.split('-')[0].length == 4) ){
		let date;
		if (inputDate.split('/').length>1) {
			date = inputDate.split('/');
		}
		else if (inputDate.split('-').length>1) {
			date = inputDate.split('-');
		}
		inputDate = `${date[2]}-${date[1]}-${date[0]}`;
	}
	if(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(inputDate)) {
		//Test which seperator is used '/' or '-'
		let date;
		if (inputDate.split('/').length>1) {
			date = inputDate.split('/');
		}
		else if (inputDate.split('-').length>1) {
			date = inputDate.split('-');
		}
		const dd = parseInt(date[0]);
		const mm  = parseInt(date[1]);
		const yy = parseInt(date[2]);
		// Create list of days of a month [assume there is no leap year by default]
		const listOfDays = [31,28,31,30,31,30,31,31,30,31,30,31];
		if (mm==1 || mm>2) {
			if (dd>listOfDays[mm-1]) {
				return false;
			}
			return true;
		}
		if (mm==2) {
			let lyear = false;
			if ( (!(yy % 4) && yy % 100) || !(yy % 400) ) {
				lyear = true;
			}
			if ((lyear==false) && (dd>=29)) {
				return false;
			}
			if ((lyear==true) && (dd>29)) {
				return false;
			}
			return true;
		}
	}
	else {
		return false;
	}
}

const notEmptyValidation = (input) => {
	if(typeof(input) == "boolean"){
		return true
	}
	else if(input == null || input == undefined || input == '') {
		return false;
	}
	else if(toString(input).replace(/\s/g, "").length == 0){
		return false;
	}
	else return true;
}



module.exports = { 	
	stringValidation,
	numberValidation,
	phoneNumberLengthValidation,
	emailValidation,
	passwordValidation,
	noSpaceValidation,
	dateValidation,
	notEmptyValidation
}