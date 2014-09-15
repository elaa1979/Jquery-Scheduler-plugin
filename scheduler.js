(function ($) {
    /*
        scheduler v1.0.1
        Copyright 2014 elaa1979 - MIT License
        https://github.com/elaa1979/Jquery-Scheduler-plugin
    */
    var scheduler = function () {
        return {
            init: function (options) {
                var Categories = [{ Name: 'default', Schedules: [] }];
                var defaults = {
                    Schedules: [],
                    Modes: ['timeline', 'day', 'month', 'year'],
                    StartTimeField: 'Start',
                    EndTimeField: 'End',
                    DurationField: 'Duration', // in minutes
                    CategoryField: '',
                    UseDuration: false,
                    Format: ''
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

                    var ConvertToMilliseconds = function (d) {
                        if (settings.Format) {
                            // TODO: format the date
                            return new Date(d).getMilliseconds();
                        }
                        return new Date(d).getMilliseconds();
                    }

                    var AddToCategoryList = function (item) {
                        if (settings.CategoryField) {
                            var index = GetListItemIndex(Categories, 'Name', item[settings.CategoryField]);
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


                    var GetListItemIndex = function (list, key, property) {
                        if (!list) return -1;
                        for (var i = 0; i < list.length; i++) {
                            if (list[i][property] == key)
                                return i;
                        }
                        return -1;
                    }
                });
            }
        }
    }();

    $.fn.extend({
        scheduler: scheduler.init
    });

})(jQuery)
