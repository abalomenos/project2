// ************** Draggable **************

// target elements with the "draggable" class
interact('.draggable')
  .draggable({
    // enable inertial throwing
    inertia: true,
    // keep the element within the area of it's parent
    modifiers: [
      interact.modifiers.restrict({
        restriction: "#eventLayoutItems",
        endOnly: true,
        elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
      }),
    ],
    // enable autoScroll
    autoScroll: true,

    // call this function on every dragmove event
    onmove: dragMoveListener

  });

  function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }


// ************** Draggable End **************

// ************** Slide Show **************

$(function() {
  /* SET PARAMETERS */
  var changeImgTime = 5000;
  var transitionSpeed = 100;

  var simpleSlideshow = $("#exampleSlider"),
    listItems = simpleSlideshow.children("li"),
    listLen = listItems.length,
    i = 0,
    changeList = function() {
      listItems.eq(i).fadeOut(transitionSpeed, function() {
        i += 1;
        if (i === listLen) {
          i = 0;
        }
        listItems.eq(i).fadeIn(transitionSpeed);
      });
    };

  listItems.not(":first").hide();
  setInterval(changeList, changeImgTime);
});

// ************** Slide Show End **************

// ************** Event Tables **************

// Add Table
$("#addTable").click(function() {
  var table = $(".draggable").length + 1;
  $("#eventLayoutItems").append(
    $(
      '<div id="drag-' +
        table +
        '" class="draggable">' +
        table +
        '<button id="deleteTable-' +
        table +
        '" class="deleteTable">X</button></div>'
    )
  );
});

// Delete Table
$(document).on("click", ".deleteTable", function() {
  // Delete the Div
  $(this)
    .parent()
    .closest("div")
    .remove();

  $(".draggable").each(function(i) {
    i++;
    // Reset Table ID
    $("#" + this.id).attr("id", "drag-" + i);

    // Reset Table Data
    $("#" + this.id).html(
      i + '<button id="deleteTable-drag-' + i + '" class="deleteTable">X</button>'
    );

    // Delete Tables from DB
    var idToDelete = window.location.pathname.split("/")[2];
      API.deleteLayout(idToDelete).then(function() {
    });
  });
});

// ************ Save Event *****************

$("#saveEvent").click(function() {
  
  // Get Event ID from URL
  var eventRef = window.location.pathname.split("/")[2];
  
  // Delete Tables from DB so no Duplicate
    API.deleteLayout(eventRef).then(function() {
  });

  $(".draggable").each(function() {
    tableID = this.id.split("-").pop();
    xCoords = $("#" + this.id).attr("data-x");
    if (xCoords == null) {
      xCoords = 0;
    }
    yCoords = $("#" + this.id).attr("data-y");
    if (yCoords == null) {
      yCoords = 0;
    }
    // console.log("eventRef " + eventRef);
    // console.log("TableID " + tableID);
    // console.log("x " + xCoords);
    // console.log("y " + yCoords);

    // Save to Database
    // Need async: false for ajax to be synchronous in order to save event tables in order for interact.js to work properly
    $.ajax({
      url: "/api/layouts/",
      type: "POST",
      async: false,
      data: {
        eventRef: eventRef,
        tableID: tableID,
        xCoords: xCoords,
        yCoords: yCoords
      }
    });
  });
  // console.log(tablesArray);
      
});

// ************** Event Tables End **************


// ************* Get Event by Date **************
$("#searchEvent").click(function(e) {
  
  // Menu Items Toggle
  e.preventDefault();
  $(this).siblings('ul').slideToggle();

  var date = moment(new Date($("#datepicker").val())).format("MM-DD-YYYY");
  console.log(date);
  $.ajax({
    url: "api/events/" + date,
    type: "GET"
  }).then(function(data) {
    var $events = data.map(function(event) {
      var $editButton = $("<a>") 
        .attr("href", "events/" + event.id)
        .attr("type", "button")
        .attr("id", "edit-event")
        .addClass("btn btn-warning adminItemsActionButton edit")
        .text("Edit Event")

      var $deleteButton = $("<button>")
        .addClass("btn btn-danger adminItemsActionButton delete")
        .text("Delete Event");
  
      var $eventActionsDelete = $("<li>")  
        .addClass("adminItemsActions")
        .append($deleteButton)

      var $eventActionsEdit = $("<li>")  
        .addClass("adminItemsActions")
        .append($editButton)  

      var $eventActionsUL = $("<ul>")  
        .addClass("adminItemsActions")
        .append($eventActionsEdit)
        .append($eventActionsDelete)

      var $eventButtonList = $("<li>")  
        .addClass("adminItemsWrapper float-right")
        .append($eventActionsUL)
              
      var $div = $("<div>")
        .attr("data-toggle", "popover")  
        .attr("data-trigger", "hover")
        .attr("title", event.roomName)
        .attr("data-content", "Date: " + event.eventDate + ", Guests: " + event.partySize)
        
      var $h2 = $("<h2>")
        .html(event.eventDate)
        
      var $h5 = $("<h5>")
        .html(event.customerName)

      var $eventWrapperLI = $("<li>")
        .addClass("adminItemsWrapper cursorPointer")
        .append($div)
        .append($h2)
        .append($h5);

      var $eventWrapperUL = $("<ul>")  
        .addClass("adminItemsWrapper")
        .append($eventWrapperLI)
        .append($eventButtonList)
      
      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": event.id
        })
        .append($eventWrapperUL);

      return $li;
    });

    $eventList.empty();
    $eventList.append($events);
  });
});


// ************* GET LAYOUT **************
$("#edit-event").on("click", function() {
  var eventID = window.location.pathname.split("/")[2];
  $.ajax({
    url: "/api/events/" + eventID,
    type: "GET"
  }).then(function(data) {
    console.log(data)
  })
})


// Enable popovers
$('[data-toggle="popover"]').popover();

// Enable datepicker
$(function() {
  $('#datepicker').datepicker();
});




// ************** Admin Page ********************

// Action Items
$('a.expand').on('click', function(e) {
  e.preventDefault();
  $(this).siblings('ul').slideToggle();
  $(this).parent('ul').siblings('li').slideToggle();
});

// Add Employee
$('#addEmployeeButton').click(function(e){
  e.preventDefault();

  $('#employee-list').hide();
  $('#event-list').hide();

  $('#addEmployeeContainer').fadeIn();
});

// All Employees
$('#showEmployeesButton').click(function(e){
  e.preventDefault();

  $('#addEmployeeContainer').hide();
  $('#event-list').hide();

  $('#employee-list').fadeIn();
});

// All Events
$('#showEventsButton').click(function(e){
  e.preventDefault();

  $('#addEmployeeContainer').hide();
  $('#employee-list').hide();

  $('#event-list').fadeIn();
});

// Search Event
$('#searchEvent').click(function(e){
  e.preventDefault();

  $('#addEmployeeContainer').hide();
  $('#employee-list').hide();

  $('#event-list').fadeIn();
});


// ************** Admin Page ********************
