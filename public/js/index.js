
// ********** Get References To Page Elements **********

// All Events / Search Event
var $eventList = $("#event-list");

// Reservation Page
var $eventDate = $("#datepicker");
var $customerName = $("#customerName");
var $customerEmail = $("#customerEmail");
var $roomName = $("#roomName");
var $partySize = $("#partySize");
var $submitEvent = $("#submit-event");

// Add Employee Page
var $employeeName = $("#employeeName");
var $employeeWage = $("#employeeWage");
var $employeeImage = $("#employeeImage");
var $submitEmployee = $("#addEmployee");

// All Employees Page
var $employeeList = $("#employee-list");

// Update Employee
var $updateEmployee = $("#update-employee");
// ********** Get References To Page Elements End **********


// The API object contains methods for each kind of request we'll make
var API = {
  saveEvent: function(event) {
    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/events",
      data: JSON.stringify(event)
    });
  },
  getEvents: function() {
    return $.ajax({
      url: "api/events",
      type: "GET"
    });
  },
  deleteEvent: function(id) {
    return $.ajax({
      url: "api/events/" + id,
      type: "DELETE"
    });
  },
  updateEvent: function() {
    return $.ajax({
      url: "api/events/",
      type: "PUT"
    });
  },
  saveEmployee: function(employee) {
    console.log("index.js employee" + employee);

    return $.ajax({
      headers: {
        "Content-Type": "application/json"
      },
      type: "POST",
      url: "api/employees",
      data: JSON.stringify(employee)
    });
  },
  getEmployees: function() {
    return $.ajax({
      url: "api/employees",
      type: "GET"
    });
  },
  deleteEmployee: function(id) {
    return $.ajax({
      url: "api/employees/" + id,
      type: "DELETE"
    });
  },
  updateEmployee: function(data) {
    return $.ajax({
      url: "/api/employees/",
      type: "PUT",
      data: data
    });
  },
  deleteLayout: function(id) {
    return $.ajax({
      url: "/" + id,
      type: "DELETE"
    });
  },
};


// ***** addEvent
// called whenever a new event is created
// Save the new event to the db and refresh the list
var addEvent = function(event) {
  event.preventDefault();

  var event = {
    eventDate: $eventDate
      .val()
      .trim()
      .split("/")
      .join("-"),
    customerName: $customerName.val().trim(),
    customerEmail: $customerEmail.val().trim(),
    roomName: $roomName.val().trim(),
    partySize: $partySize.val().trim()
  };

  if (
    !(
      event.eventDate &&
      event.customerName &&
      event.customerEmail &&
      event.roomName &&
      event.partySize
    )
  ) {
    alert("Please make sure to fill in all the form fields");
    return;
  }

  API.saveEvent(event);

  $eventDate.val("");
  $customerName.val("");
  $customerEmail.val("");
  $roomName.val("");
  $partySize.val("");
};


// ***** deleteEvent
var deleteEvent = function() {
  var idToDelete = $(this)
    .closest(".list-group-item")
    .attr("data-id")

  API.deleteEvent(idToDelete).then(function() {
    $('li[data-id="' + idToDelete +'"]').remove();
  });
};


// ***** refreshEmployees
// Gets new employee from the db and repopulates the list
var refreshEmployees = function() {
  API.getEmployees().then(function(data) {
    var $employees = data.map(function(employee) {
      
      var $editButton = $("<a>") 
        .attr("href", "employees/" + employee.id)
        .attr("type", "button")
        .addClass("btn btn-warning adminItemsActionButton edit")
        .text("Edit Employee")

      var $deleteButton = $("<button>")
        .addClass("btn btn-danger adminItemsActionButton delete")
        .text("Delete Employee");
  
      var $employeeActionsDelete = $("<li>")  
        .addClass("employeeActions")
        .append($deleteButton)

      var $employeeActionsEdit = $("<li>")  
        .addClass("employeeActions")
        .append($editButton)  

      var $employeeActionsUL = $("<ul>")  
        .addClass("employeeActions")
        .append($employeeActionsEdit)
        .append($employeeActionsDelete)

      var $employeeButtonList = $("<li>")  
        .addClass("adminItemsWrapper float-right")
        .append($employeeActionsUL)
              
      var $img = $("<img />")
        .attr({
          src: employee.image,
          width: 100,
          height: 100,
          alt: "Employee"
        })
        .attr("data-toggle", "popover")  
        .attr("data-trigger", "hover")
        .attr("title", "")
        .attr("data-original-title", employee.name)
        .attr("data-content", "Wage: $" + employee.wage + "/hr")

      var $employeeWrapperLI = $("<li>")  
        .addClass("adminItemsWrapper cursorPointer")
        .append($img);

      var $employeeWrapperUL = $("<ul>")  
        .addClass("adminItemsWrapper")
        .append($employeeWrapperLI)
        .append($employeeButtonList)
      
      var $li = $("<li>")
        .attr({
          class: "list-group-item",
          "data-id": employee.id
        })
        .append($employeeWrapperUL);

      return $li;
    });

    $employeeList.empty();
    $employeeList.append($employees);
  });
};


// ***** addEmployee ***** 
// Called whenever we submit a new employee
// Save the new employee to the db and refresh the list
var addEmployee = function(event) {
  event.preventDefault();

  var employee = {
    name: $employeeName.val().trim(),
    wage: $employeeWage.val().trim(),
    image: $employeeImage.val().trim()
  };

  if (!(employee.name && employee.wage && employee.image)) {
    alert("Please enter an Employee Name, Wage and Image!");
    return;
  }

  API.saveEmployee(employee).then(function() {
    refreshEmployees();
  });

  $employeeName.val("");
  $employeeWage.val("");
  $employeeImage.val("");
};

var updateEmployee = function(event) {
  event.preventDefault();

  var id = window.location.pathname.split("/")[2];
  console.log(id)
  var employee = {
    id: id,
    name: $employeeName.val().trim(),
    wage: $employeeWage.val().trim(),
    image: $employeeImage.val().trim()
  };

  API.updateEmployee(employee).then(function(){
    window.location.reload();

  });
    $employeeName.val("");
    $employeeWage.val("");
    $employeeImage.val("");
  };
// ***** deleteEmployee *****
// Called when an employee's delete button is clicked
// Remove the employee from the db and refresh the list
var deleteEmployee = function() {
  var idToDelete = $(this)
    .closest(".list-group-item")
    .attr("data-id")

  API.deleteEmployee(idToDelete).then(function() {
    $('li[data-id="' + idToDelete +'"]').remove();
  });
};


// Add event listeners to the submit and delete buttons
$submitEvent.on("click", addEvent);
$submitEmployee.on("click", addEmployee);
$eventList.on("click", ".delete", deleteEvent);
$employeeList.on("click", ".delete", deleteEmployee);
$updateEmployee.on("click", updateEmployee);


