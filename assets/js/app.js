var tripsData;
/* {
"checkins_sum": 2, "checkouts_sum": 2, 
"date": "2015-03-07", "stations_in": [], "stations_out": [], 
"totals_in": [0, ...], "totals_out": [0, 0, ...]
}
*/

weeklyColors = ["#3C8642", "#3C873D", "#3E883B", "#43893B", "#488A3B", "#4D8B3B", "#528C3B", "#578E3B", "#5D8F3B", "#62903B", "#68913B", "#6E923B", "#74933B", "#7A943B", "#80963B", "#86973B", "#8D983B", "#93993A", "#9A9A3A", "#9B953A", "#9C903A", "#9E8B3A", "#9F863A", "#A08139", "#A17B39", "#A27639", "#A37039", "#A46A39", "#A66438", "#A75D38", "#A85738", "#A95038", "#AA4937", "#AB4237", "#AC3B37", "#AE3739"];
buildDashboard = function() {
   /** This code runs when everything has been loaded on the page */
   /* Inline sparklines take their values from the contents of the tag */
   $('.inlinesparkline').sparkline(); 

   /* Sparklines can also take their values from the first argument 
   passed to the sparkline() function */
   var myvalues = [10,8,5,7,4,4,1];
   //$('.spark.line').sparkline(myvalues);

   /* The second argument gives options such as chart type */
   //$('.spark.bar').sparkline(myvalues, {type: 'bar', barColor: 'green'} );

   i = 0;
   var week;
   w = -1;
   total_week_out = 0;
   $(tripsData).each(function(index, row) {
      if (i % 7 == 0) {
         //$(bullet).sparkline([total_week_out, 10000, 8000, 6000], {type: 'bullet'});

            $("#dashboard").append("<div class='week'><div class='date-label'><span>" + moment(row.date).format("MMM Do YY"));
            w++;
            total_week_out = 0;
      }

      // can't add sparklines until this is added to the dom
      obj = $("<span class='spark day' data-date='" + row.date + "' data-index='" + index +"'>")
      $("#dashboard .week:last").append(obj);

      // draw and set up the sparklines
      //data_set = row.stations_in[10];
      data_set = row.totals_in;
      $(obj).sparkline(data_set, {type: 'bar', barColor: weeklyColors[w]});
      i++;
      total_week_out = total_week_out + math.sum(data_set);

      if (i % 7 == 0) {
         // pop on the end of the row bullet graph
         width = 150 * (total_week_out / 12000);
         bullet = $("<span class='spark week-summary'><span style='width: " + width + "'></span>");
         $("#dashboard .week:last").append(bullet);
      }
   });
}


$(document).ready(function() {
   $.getJSON('scripts/computed.array.json', function(d) {
      console.log("Data loaded: " + d.length + " data points");
      tripsData = d;
      buildDashboard();
   });
});