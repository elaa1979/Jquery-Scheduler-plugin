(function ($) {
    /*
        scheduler v1.0.1
        Copyright 2014 elaa1979 - MIT License
        https://github.com/elaa1979/Jquery-Scheduler-plugin
    */
    
    /*
    
    #container {
    width: 100px;
    height: 100px;
    position: relative;
}

#navi, 
#infoi {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

#infoi {
    z-index: 10;
}
    
    */
    var scheduler = function () {
        var fullmonths = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMPER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
        var months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL','AUG','SEP','OCT','NOV','DEC'];
        var shortmonths = ['JA', 'FE', 'MR', 'AP', 'MY', 'JN', 'JL', 'AU', 'SE', 'OC', 'NO', 'DE'];
        var fullweeks = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
        var weeks = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
        var shortweeks = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
        var hours = ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'];
        // get date list to fill 7x6 matrix for month calender display
        var GetMonthDays = function (month, year) {
            
            var firstDay = new Date(year, month, 1);
            var lastDay = new Date(year, month + 1, 0);
            var lastDate=lastDay.getDate();
            var monthStartIndex = firstDay.getDay();
            var startDate=1;
            var dates=[];
            
            if (monthStartIndex > 0) {
                // fill previous month dates
                startDate = new Date(year, month, 0).getDate()-monthStartIndex+1;
                for(var i=0;i<monthStartIndex;i++)
                {
                    dates.push(startDate++)
                }
            }
            
            for(var i=1;i<=lastDate;i++)
            {
                // fill current month dates
                dates.push(i);
            }
            
            for(var i=dates.length,j=1;i<42;i++,j++)
            {
                // fill next month dates
                dates.push(j);
            }
            
            return dates;
        }
        
        //  get the index of an item from an object array by property name and value 
        var GetListItemIndex = function (list, key, property) {
            if (!list) return -1;
            for (var i = 0; i < list.length; i++) {
                if (list[i][property] == key)
                    return i;
            }
            return -1;
        }
        
        // get milliseconds of an date (milliseconds since January 1, 1970)
        var ConvertToMilliseconds = function (d) {
            if (settings.Format) {
                // TODO: format the date
                return new Date(d).getMilliseconds();
            }
            return new Date(d).getMilliseconds();
        }
                    
        return {
            init: function (options) {
                
                var Categories = [{ Name: 'default', Schedules: [] }];
                var CurrentDragItems=[];
                var defaults = {
                    Modes: ["timeline", "day", "month", "year"],
                    StartTimeField: 'Start',
                    EndTimeField: 'End',
                    DurationField: 'Duration', // in minutes
                    CategoryField: '',
                    UseDuration: false,
                    Format: '',
                    DraggableItems:[],
                    DragTextField:'Name',
                    DragImageUrlField: 'ImageUrl',
                    Schedules:[]
                };
                var settings = $.extend({}, defaults, options);
                
                return this.each(function () {
                    var elem = this;

                    // converting time into milliseconds
                    for (var i = 0; i < settings.Schedules.length; i++) {
                        settings.Schedules[i]._StartTime = ConvertToMilliseconds(settings.Schedules[i][StartTimeField]);
                        if (settings.UseDuration) {
                            settings.Schedules[i]._EndTime = settings.Schedules[i]._StartTime + settings.Schedules[i][DurationField] * 60 * 1000;
                        }
                        else {
                            settings.Schedules[i]._EndTime = ConvertToMilliseconds(settings.Schedules[i][EndTimeField]);
                        }

                        AddToCategoryList(settings.Schedules[i]);
                    }

                    for (var i = 0; i < Categories.length; i++) {
                        // sort the schedules in ascending order
                        Categories[i].Schedules.sort(function (a, b) { return a._StartTime - b._EndTime; })
                    }

                    var AddToCategoryList = function (item) {
                        if (settings.CategoryField) {
                            var index = GetListItemIndex(Categories, "Name", item[settings.CategoryField]);
                            if (index > -1) {
                                Categories[index].Schedules.push(item);
                            }
                            else {
                                Categories.push({ Name: item[settings.CategoryField], Schedules: [item] });
                            }
                        }
                        else {
                            Categories[0].Schedules.push(item);
                        }
                    }
                    
                    // simple view of month calendar
                    var displayMonthCalendar=function(month,year)
                    {
                        var att=document.createAttribute("class");
                        att.value="sch-month-calendar-container";
                        
                        var dateList=GetMonthDays(month,year);
                        
                        var container=document.createElement("DIV");
                        container.setAttributeNode(att);
                        
                        for(var i=0;i<7;i++)
                        {
                            var daysHeaderAtt = document.createAttribute("class");
                            daysHeaderAtt.value = "sch-month-calendar-days-header";

                            var cellatt = document.createAttribute("class");
                            cellatt.value = "sch-month-calendar-cell";

                            var cell=document.createElement("DIV");
                            cell.setAttributeNode(daysHeaderAtt);
                            cell.innerHTML=weeks[i];
                            container.appendChild(cell);
                        }

                        for(var i=0;i<dateList.length;i++)
                        {
                            var cellatt = document.createAttribute("class");
                            cellatt.value = "sch-month-calendar-cell";

                            var cell=document.createElement("DIV");
                            cell.setAttributeNode(cellatt);
                            cell.innerHTML=dateList[i];
                            container.appendChild(cell);
                        }
                       elem.appendChild(container);
                    }
                    
                    var DisplayDraggableList=function()
                    {
                        var att=document.createAttribute("class");
                        att.value="sch-draggable-list-container";
                        
                       
                        
                        var container=document.createElement("DIV");
                        container.setAttributeNode(att);
                        
                        for(var i=0;i<settings.DraggableList.length;i++)
                        {
                            var daysHeaderAtt = document.createAttribute("class");
                            daysHeaderAtt.value = "sch-draggable-list-item-header";

                            var cellatt = document.createAttribute("class");
                            cellatt.value = "sch-draggable-list-item-cell";

                            var cell=document.createElement("DIV");
                            title.setAttributeNode(cellatt);
                            var title=document.createElement("SPAN");
                            title.setAttributeNode(daysHeaderAtt);
                            cell.innerHTML=settings.DraggableList[i][DragTextField];
                            container.appendChild(cell);
                            //cell.css('background-image',DragImageUrlField);
                                
                        }
                    }

                    displayMonthCalendar(9, 2014);
                });
            }
        }
    }();

    $.fn.extend({
        scheduler: scheduler.init
    });

})(jQuery)
