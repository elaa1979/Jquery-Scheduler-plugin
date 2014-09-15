(function ($) {
    /*
        scheduler v1.0.1
        Copyright 2014 elaa1979 - MIT License
        https://github.com/elaa1979/Jquery-Scheduler-plugin
    */
    var scheduler = function () {
        return {
            init: function (options) {
                var defaults = {
                    Schedules: [],
                    StartTimeField: 'Start',
                    EndTimeField: 'End',
                    DurationField: 'Duration', // in minutes
                    UseDuration: false
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
                    }

                    // sort the schedules in ascending order
                    settings.Schedules.sort(function (a, b) { return a._StartTime - b._EndTime; })
                    var ConvertToMilliseconds = function (d) {
                        return new Date(d).getMilliseconds();
                    }
                });
            }
        }
    }();

    $.fn.extend({
        scheduler: scheduler.init
    });

})(jQuery)
