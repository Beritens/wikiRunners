autocomplete($("#startInput").get(0));
autocomplete($("#stopInput").get(0));


// Get a reference to the form element
var form = document.querySelector('form');

// Define the function to be called when the submit button is clicked
async function formSubmitted(event) {
  event.preventDefault();

  var startInputValue = form.elements['Article'][0].value;
  var stopInputValue = form.elements['Article'][1].value;
  let start = true;

  if (!(await testPage(startInputValue))) {
    start = false;
    $("#startError").text("not a valid page");
  } else {
    $("#startError").text("");
  }

  if (!(await testPage(stopInputValue))) {
    start = false;
    $("#stopError").text("not a valid page");
  } else {
    $("#stopError").text("");
  }

  if (start) {
    startGame(startInputValue, stopInputValue);
  }
}

async function testPage(page) {
  $("#checking").css({
    display: `block`
    // top: -y+(window.innerHeight/2) + "px"
  }); 
  try {
    const data = await $.get(getWikiURL(page));
    $("#checking").css({
      display: `none`
      // top: -y+(window.innerHeight/2) + "px"
    }); 
    if (data.error) {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    $("#checking").css({
      display: `none`
      // top: -y+(window.innerHeight/2) + "px"
    });
    console.error(error);
    return false;
  }
}

function rollDice(inputId) {
  // Get the input element by ID
  var inputElement = document.getElementById(inputId);

  // Generate a random number between 1 and 6 (representing dice faces)
  $.get("https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*", function(data){
    inputElement.value = data.query.random[0].title;
  })

  // Append the random number to the input value
  
}

// Attach the event listener to the submit button
form.addEventListener('submit', formSubmitted);