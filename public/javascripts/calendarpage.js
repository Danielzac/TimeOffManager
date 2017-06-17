$(document).ready(function() {
      // page is now ready, initialize the calendar...
      $('#calendar').fullCalendar({
        eventSources: [
          {url: '/getevents'}, 
          {url: "/javascripts/Holidays.json"},
        ],
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        dayClick: function(date, jsEvent, view) {
            $('#calendar').fullCalendar('changeView', 'agendaDay');
            $('#calendar').fullCalendar('gotoDate', date);
        },
        eventClick: function(event, jsEvent, view) {
            $('#editModalTitle').html(event.title);
            if(Cookies.get("fullAdmin") != "undefined"){
              var sdate = event.start.format().split("T")[0];
              var stime = event.start.format().split("T")[1];
              var edate = event.end.format().split("T")[0];
              var etime = event.end.format().split("T")[1];
              $("#startday").val(sdate);
              $("#starttime").val(stime);
              $("#endday").val(edate);
              $("#endtime").val(etime);
            } else {
              $('#startDate').html("Start date: "+event.start.format());
              $('#endDate').html(" End Date: "+event.end.format());
            }
            $('#dayoffid').val(event.id);
            $('#fullCalModal').modal();
            return false;
        }
      });
      if(Cookies.get("date") != "undefined"){
        $('#calendar').fullCalendar('gotoDate', Cookies.get("date"));
        Cookies.remove("date");
      }
      $('#allday').change(function() {
        if(document.getElementById('allday').checked == true) {
          $('#starttime').val("09:00:00");
          $('#endtime').val("17:00:00");
        } 
        });
      $('#startday').change(function () {
        $('#endday').val($('#startday').val());
        });
      $('#saveevent').click(function(){
        $.ajax({
          type: "POST",
          url: "/calendar/"+$('#startday').val()+"/"+$('#starttime').val()+"/"+$('#endday').val()+"/"+$('#endtime').val()+"/"+$('#typeoptions').val()+"/"+$('#useroptions').val()      
          }).success(function(msg){
            window.location.reload();
          });
        });
      $('#updateEvent').click(function(){
        $.ajax(
{          type: "PUT",
          url: "/calendar/"+$('#dayoffid').val()+"/"+$('#startday').val()+"/"+$('#starttime').val()+"/"+$('#endday').val()+"/"+$('#endtime').val()+"/"+$('#typeoptions').val()+"/"+$('#useroptions').val()      
          }).success(function(msg){
            window.location.reload();
          });
        });
      $('#addEvent').click(function(){
          $('#createModalTitle').html("Book a day off!");
          $('#inputCalModal').modal();
          return false;
        });
      $('#removeEvent').click(function() {
        if(confirm("Are you sure you want to delete the event?")) {
          $.ajax({
          type: "DELETE",
            url: "/calendar/"+$('#dayoffid').val()             
            }).success(function(msg){
              window.location.reload();
          });
        }
      });
      //validation for saving
      $("#saveevent").fadeTo("fast", 0.5);
      $(".inputform").change(function() {
          if(!($("#startday").val() === '' || $("#starttime").val() === '' || $("#endday").val() === '' || $("#endtime").val() === '')){
            if($("#startday").val() > $("#endday").val()) {
              alert("Event cannot end before it has started");
              $("#saveevent").prop("disabled", true).fadeTo("fast", 0.5);
              return false;
            } else if($("#startday").val() == $("#endday").val()) {
              if($("#starttime").val() >= $("#endtime").val()) {
                alert("Event cannot end before it has started");
                $("#saveevent").prop("disabled", true).fadeTo("fast", 0.5);
                return false;
              }
            }
            $("#saveevent").prop("disabled", false).fadeTo("fast", 1);
          } else {
            $("#saveevent").prop("disabled", true).fadeTo("fast", 0.5);
          }
        });
    }); 