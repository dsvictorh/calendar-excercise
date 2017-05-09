var app = angular.module('calendar', []);

app.factory('HolidayService', ['$http', function($http){

	var service = {};

    service.getHolidays = function (data) {
        return $http({
            url: 'http://holidayapi.com/v1/holidays?key=55fc857e-4770-47bd-b0f1-1935df6c7471&country=' + data.code + '&year=' + data.year,
            method: 'GET',
            dataType: 'json',
        });
    };

	return {
		getHolidays: service.getHolidays
	}
}]);

app.controller('CalendarController', ['$scope', 'HolidayService', function($scope, HolidayService){
	$scope.filter = {};

	$scope.loadCalendar = function(){
		$scope.calendars = [];
		loadCalendars($scope.filter.date, $scope.filter.days, $scope.filter.code);
	}


	function loadCalendars(dateString, days, code){
		var holidays = [];

		days = parseInt(days);
		if(isNaN(days) || days < 1){
			alert('Days to add need to be a valid number starting from 1');
			return;
		}

		try{
			var dates = getDates(new Date(dateString), new Date(dateString).addDays(days));
		}catch(ex){
			alert('Invalid date format');
			return;
		}

		//Load holidays
		/*HolidayService.getHolidays({
			year: dates[0].getFullYear(),
			code: code
		}).then(function(response){
			holidays.push(angular.fromJSON(response.value));
		}, function(error){
			alert('An error occurred while retriving the holidays for year ' + dates[0].getFullYear());
		});*/

		var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		for(var i = 0; i <= dates.length; i++){
			//Every month that passes a complete calendar gets added and the calendar object
			//resets so we are able to start filling a new calendar
			if((i == 0 || i == dates.length) || dates[i].getMonth() != dates[i - 1].getMonth()){
				if(calendar){
					$scope.calendars.push(calendar);

					if(i == dates.length)
						break;
				}
				
				var calendar = {
					month: months[dates[i].getMonth()],
					year: dates[i].getFullYear(),
					days: [],
				};
			}

			//Add the day to the current calendar
			var holidayIndex = holidays.findIndex(function(item){ return item.date == dates[i].getFullYear() + "-" + (dates[i].getMonth() + 1) + "-" + dates[i].getDate()});
			calendar.days.push({
				value: dates[i].getDate(),
				weekend: dates[i].getDay() > 4,
				dayOfWeek: dates[i].getDay(),
				holiday: holidayIndex >= 0 ? holidays[holidayIndex].description : null,
			});
		}

		//Padding logic to add locked days.
		for(var i = 0; i < $scope.calendars.length; i++)
		{
			var calendarLastDay = $scope.calendars[i].days.length - 1;
			var calendarStart = $scope.calendars[i].days[0].dayOfWeek;
			var calendarEnd = $scope.calendars[i].days[calendarLastDay].dayOfWeek;
			
			//Add necessary days of the week behind the start of the calendar
			//to fill to the start of the week (Sunday)
			for(var j = 0; j < calendarStart; j++){
				$scope.calendars[i].days.unshift({ locked: true });
			}

			//Add necessary days of the week after the last unlocked day of the 
			//calendar to fill to the end of the week (Saturday)
			for(var j = 6; calendarEnd + 1 <= j; calendarEnd++){
				$scope.calendars[i].days.push({ locked: true });
			}
		}
	}	
}]);