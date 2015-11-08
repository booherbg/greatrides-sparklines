var tripsData;
var originalTripsData;
/* {
"checkins_sum": 2, "checkouts_sum": 2, 
"date": "2015-03-07", "stations_in": [], "stations_out": [], 
"totals_in": [0, ...], "totals_out": [0, 0, ...]
}
*/
// NDSU: Barry Hall, High Rise Complex, Memorial Union, Rennaisance Hall, University Village, Wallman Wellness Center
// NDSU: 0, 3, 5, 6, 9, 10
stations = ['University Village', 'High Rise Complex', 'Wallman Wellness Center', 'Memorial Union',
'Sanford Medical Center', 'Great Northern Bicycle Co.', 'Barry Hall', 'US Bank Plaza',  'Renaissance Hall',  
'MATBUS Center Downtown',  'Fercho YMCA'];
stationColors = {
   '#1b4b85': 'University Village',
   '#557499': 'High Rise Complex',
   '#528acd': 'Wallman Wellness Center',
   '#7faee6': 'Memorial Union',
   '#9abde6': 'Sanford Medical Center',
   '#ffdca4': 'Great Northern Bicycle Co.',
   '#ffcf83': 'Barry Hall',
   '#ffbf59': 'US Bank Plaza',
   '#bf9b62': 'Rennaisance Hall',
   '#a6711d': 'MATBUS Center Downtown',
   '#000000': 'Fercho YMCA'
}

// ndsu filter
filter_indexes = [0, 1, 2, 3, 6, 8];

weeklyColors = ["#3C8642", "#3C873D", "#3E883B", "#43893B", "#488A3B", "#4D8B3B", "#528C3B", "#578E3B", "#5D8F3B", "#62903B", "#68913B", "#6E923B", "#74933B", "#7A943B", "#80963B", "#86973B", "#8D983B", "#93993A", "#9A9A3A", "#9B953A", "#9C903A", "#9E8B3A", "#9F863A", "#A08139", "#A17B39", "#A27639", "#A37039", "#A46A39", "#A66438", "#A75D38", "#A85738", "#A95038", "#AA4937", "#AB4237", "#AC3B37", "#AE3739"];
buildDashboard = function() {
   $('#dashboard').empty();
   tripsData = JSON.parse(JSON.stringify(originalTripsData));
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
      graph_type = 'bar';
      if($('#controls input[name=dataType]:checked').val() == 'checkout') {
         if ($('#chk-stations').is(':checked')) {
            data_set = row.stacked_out;
            graph_type = 'stacked'
         } else {
            data_set = row.totals_out;
            graph_type = 'bar';
         }
      } else {
         if ($('#chk-stations').is(':checked')) {
            data_set = row.stacked_in;
            graph_type = 'stacked';
         } else {
            data_set = row.totals_in;
            graph_type = 'bar';
         }
      }

      // only do this if we're using a stacked type
      max_val = 12000;
      if (graph_type == 'stacked')
      {
         if ($('#controls input[name=stationType]:checked').val() == 'no_ndsu') {
            max_val = 600;
            // filter out ndsu station data
            for (k = 0; k < filter_indexes.length; k++) {
               for (j = 0; j < 24; j++) {
                  data_set[j][filter_indexes[k]] = 0;
               }
            }
         }
      }

      $(obj).sparkline(data_set, {
         type: 'bar', 
         barColor: weeklyColors[w],
         barWidth: '5px',
         barSpacing: '1px',
         tooltipValueLookups: {
            'stations': stations
         },
         fillColor: false,
         stackedBarColor: Object.keys(stationColors),
         tooltipFormatter: function(a, b, c) {
            // change the tooltip based on normal bar or stacked
            s = '';
            if (c.length == 1) {
               color = c[0].color;
               offset = c[0].offset;
               value = c[0].value;
               return "<span style=\"color: " + color + "\">&#9679;</span> " + offset + ":00 (" + value + ")<br/>";
            }
            total = 0;
            for (i=0; i<c.length; i++) {
               color = c[i].color;
               offset = c[i].offset;
               value = c[i].value;
               if (value > 0) {
                  alert(color);
                  s += "<span style=\"color: " + color + "\">&#9679;</span> (" + value + ") " + stationColors[color] + "<br/>";
               }
               total += value;
            }
            s += "Total: " + total
            return s;
         }
      })
      i++;
      total_week_out = total_week_out + math.sum(data_set);

      if (i % 7 == 0) {
         // pop on the end of the row bullet graph

         width = 150 * (total_week_out / max_val);
         bullet = $("<span class='spark week-summary'><span style='width: " + width + "'></span>");
         $("#dashboard .week:last").append(bullet);
      }
   });
}


$(document).ready(function() {
   $.getJSON('scripts/computed.array.json', function(d) {
      console.log("Data loaded: " + d.length + " data points");
      originalTripsData = d;
      buildDashboard();
   });

   $('#controls input').change(function(e) {
      buildDashboard();
   });
});