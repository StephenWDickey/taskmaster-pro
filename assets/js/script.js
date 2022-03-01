var tasks = {};

var createTask = function(taskText, taskDate, taskList) {
  // create elements that make up a task item
  var taskLi = $("<li>").addClass("list-group-item");
  var taskSpan = $("<span>")
    .addClass("badge badge-primary badge-pill")
    .text(taskDate);
  var taskP = $("<p>")
    .addClass("m-1")
    .text(taskText);

  // append span and p element to parent li
  taskLi.append(taskSpan, taskP);


  // append to ul list on the page
  $("#list-" + taskList).append(taskLi);
};

var loadTasks = function() {
  tasks = JSON.parse(localStorage.getItem("tasks"));

  // if nothing in localStorage, create a new object to track all task status arrays
  if (!tasks) {
    tasks = {
      toDo: [],
      inProgress: [],
      inReview: [],
      done: []
    };
  }

  // loop over object properties
  $.each(tasks, function(list, arr) {
    console.log(list, arr);
    // then loop over sub-array
    arr.forEach(function(task) {
      createTask(task.text, task.date, list);
    });
  });
};

var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};
/////////////////////////////////////////
/* this expression is part of jQuery UI to implement
list sorting/order with drag/drop functionality */
/* sortable() turned elements with class .list-group 
into sortable list */
/* connectWith property links sortable lists to other 
lists with same class */
// sortable() is considered a widget
$(".card .list-group").sortable({
  connectWith: $(".card .list-group"),
  scroll: false,
  tolerance: "pointer",
  /* we work with clone of element so click events dont
  accidentally get triggered */
  helper: "clone",
  // event listener, triggers when dragging starts
  activate: function(event) {
    console.log("activate", this);
  },
  // event listener, triggers when dragging stops
  deactivate: function(event) {
    console.log("deactivate", this);
  },
  // event listener, triggers when dragged item enters list
  over: function(event) {
    console.log("over", event.target);
  },
  // event listener, triggers when dragged item exits list
  out: function(event) {
    console.log("out", event.target);
  },
  // triggers when contents of a list has changed
  // this involves re-saving tasks in localStorage
  update: function(event) {
    // we need to create an array to store task data
    // this is so the data can be moved from one column to another
    var tempArr = []
    // loop over current set of children in sortable list
    $(this).children().each(function() {
      var text = $(this).find("p").text().trim();
      var date = $(this).find("span").text().trim();
      // in this expression, this refers to child element
      // remember: scoped variables!
    });
    // we must determine column id so we can 
    // attach correct property to new object
    var arrName = $(this).attr("id").replace("list-", "");
    // updates array
    tasks[arrName] = tempArrr;
    saveTasks();
    // adds task data to the temp array as an object
    tempArr.push({
      text: text,
      date: date
    });
  }
});
///////////////////////////////////////////////////////

// these expression will implement the droppable widget
// we can drop elements into the drag here to remove area
$("#trash").droppable( {
  accept: ".card .list-group-item",
  tolerance: "touch",
  // ui parameter specifies task we want to drop
  drop: function(event, ui) {
    console.log("drop");
    // if something is draggable, allow it to be removed
    ui.draggable.remove();
  },
  over: function(event, ui) {
    console.log("over");
  },
  out: function(event, ui) {
    console.log("out");
  }
});

//////////////////////////////////
// replaces p element with textarea
$(".list-group").on("click", "p", function(){
  var text = $(this).text().trim();
  var textInput = $("<textarea>").addClass("form-control").val(text);
  $(this).replaceWith(textInput);
  textInput.trigger("focus");
});

// obtains textarea text info, gets id for status, gets index for array
// replaces text area with p element using same text
$(".list-group").on("blur", "textarea", function(){
  // gets text area's current value/text
  var text = $(this).val().trim();
  // gets parent ul id attribute
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  // get tasks position in list
  var index = $(this).closest("list-group-item").index();
  tasks[status][index].text = text;
  saveTasks();
  // recreate p element
  var taskP = $("<p>").addClass("m-1").text(text);
  // replace textarea with p element
  $(this).replaceWith(taskP);
});
////////////////////////////////////////////

//add an event listener to date area
// we use event delegation to target parent .list-group
/* we tell the event listener to wait for a click on any 
element that is a child of the parent with class .list-group, 
when it does we call an anonymous function */
$(".list-group").on("click", "span", function() {
  // gets date info
  var date = $(this).text().trim();
  // create new input element
  var dateInput = $("<input>").attr("type", "text").addClass("form-control").val(date);
  // swap out elements
  $(this).replaceWith(dateInput);
  // focus on new element
  dateInput.trigger("focus");
});
// change date value
$(".list-group").on("blur", "input[type='text']", function(){
  // gets current text
  var date = $(this).val().trim();
  // get parent ul id attribute
  var status = $(this).closest(".list-group").attr("id").replace("list-", "");
  // get task's position in list
  var index = $(this).closest(".list-group-item").index();
  // updates task in array and re-saves to localStorage
  tasks[status][index].date = date;
  saveTasks();
  // recreate span element with bootstrap classes
  var taskSpan = $("<span>").addClass("badge badge-primary badge-pill").text(date);
  // replace input with span element
  $(this).replaceWith(taskSpan);
});


////////////////////////////////////////////
// modal was triggered
$("#task-form-modal").on("show.bs.modal", function() {
  // clear values
  $("#modalTaskDescription, #modalDueDate").val("");
});

// modal is fully visible
$("#task-form-modal").on("shown.bs.modal", function() {
  // highlight textarea
  $("#modalTaskDescription").trigger("focus");
});

// save button in modal was clicked
$("#task-form-modal .btn-primary").click(function() {
  // get form values
  var taskText = $("#modalTaskDescription").val();
  var taskDate = $("#modalDueDate").val();

  if (taskText && taskDate) {
    createTask(taskText, taskDate, "toDo");

    // close modal
    $("#task-form-modal").modal("hide");

    // save in tasks array
    tasks.toDo.push({
      text: taskText,
      date: taskDate
    });

    saveTasks();
  }
});

// remove all tasks
$("#remove-tasks").on("click", function() {
  for (var key in tasks) {
    tasks[key].length = 0;
    $("#list-" + key).empty();
  }
  saveTasks();
});

// load tasks for the first time
loadTasks();


