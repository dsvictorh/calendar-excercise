Date.prototype.addDays = function(days) {
   var dat = new Date(this.valueOf())
   dat.setDate(dat.getDate() + days);
   return dat;
}

function getDates(startDate, stopDate) {
	if(!isDate(startDate) || !isDate(stopDate)){
		throw new Exception('Value not date');
	}

	var dateArray = new Array();
	var currentDate = startDate;
	while (currentDate <= stopDate) {
		dateArray.push(currentDate)
		currentDate = currentDate.addDays(1);
	}
	return dateArray;
}


function isDate(date){
	if (Object.prototype.toString.call(date) === "[object Date]") {
	  if (isNaN(date.getTime())) { 
	    return false;
	  }
	  else {
	    return true;
	  }
	}
	else {
	  return false;
	}
}