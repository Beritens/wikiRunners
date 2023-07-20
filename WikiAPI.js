function rollDice(inputId) {
  // Get the input element by ID
  var inputElement = document.getElementById(inputId);

  // Generate a random number between 1 and 6 (representing dice faces)
  $.get("https://en.wikipedia.org/w/api.php?action=query&list=random&rnnamespace=0&rnlimit=1&format=json&origin=*", function(data){
    inputElement.value = data.query.random[0].title;
  })

  // Append the random number to the input value
  
}
function fetchWikiExtract(page){
  y = -window.innerHeight/2;
  vx = 0;
  $.getJSON(
    
    getWikiURL(page),
    function(data) {
      y = -window.innerHeight/2;
      vx = 0;
      console.log(data.parse.text["*"])
      // Extract the HTML content from the response
    var htmlContent = data.parse.text["*"].replaceAll('src="//','src="https://');
    $('#currentText').text(data.parse.title)
    $('#pageTitle').text(data.parse.title)

    // Find the target element on your page where you want to insert the content
    var $targetElement = $("#page");
    
    // Set the retrieved HTML as the content of the target element
    $targetElement.html(htmlContent);
    }
    
  );
}
function getWikiURL(page){
return "https://en.wikipedia.org/w/api.php?action=parse&prop=text&page="+page+"&format=json&disableeditsection=1&redirects=true&useskin=minerva&origin=*"
}