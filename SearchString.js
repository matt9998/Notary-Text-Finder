//Load a book from our folder
function loadBook(filename, displayName) { //Inputs filename of the book and the display name for the book
  let currentBook = ""; //Sets the currentBook to an empty string
  let url = "books/" + filename; //Creates url string to match the book's file name
  
  //Reset our user interface each time a new book is selected
  document.getElementById("fileName").innerHTML = displayName; //Gets filename and sets its innerHTML text to the book's display name
  document.getElementById("searchstat").innerHTML = ""; //Resets the innterHTML of searchstat to an empty string
  document.getElementById("keyword").value = ""; //Resets the keyword that is being searched for in the search bar
  
  //Use an XMLHttp request to load the book
  var xhr = new XMLHttpRequest(); //Creates a new HttpRequest. Lets us retrieve url data without refreshing web page
  xhr.open("GET", url, true); //Uses GET method, fetches the url, true means to perform the operation asynchronously
  xhr.send(); //Sends the request to the server
  
  xhr.onreadystatechange = function() { //Executes a callback function when the readyState property of the HTML Request changes
    if (xhr.readyState == 4 && xhr.status == 200) { //readyState of 4 means the operation is complete. status of 200 means request has succeeded
      currentBook = xhr.responseText; //Returns text received from a server following the request
      getDocStats (currentBook); //Calls the getDocStats function for the book that has been loaded
      currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>'); //Replaces line breaks and carriage returns with a <br> (line break) tag
      document.getElementById("fileContent").innerHTML = currentBook; //Replaces innHTML of the filecontent to the currentbook text
      var elmnt = document.getElementById("fileContent"); //Assigns fileContent to elmnt
      elmnt.scrollTop = 0; //Scrolls to the top when this new file is loaded
    }
    
  };
}

//get the stats for the loaded book
function getDocStats(fileContent) { //Inputs the fileContent, which contains the book text
  var docLength = document.getElementById("docLength"); //Assigns the docLength html id element to a variable
  var wordCount = document.getElementById("wordCount"); //Assigns wordCount html id to a variable
  var charCount = document.getElementById("charCount"); //Assigns charCount html id to a variable
  
  let text = fileContent.toLowerCase(); //Converts all words to lowercase for analysis
  let wordArray = text.match(/\b\S+\b/g); //Matches all words and puts them into array
  let wordDictionary = {}; //Sets word dictionary to empty object
  var uncommonWords = []; //Sets uncommonWords to empty array
  uncommonWords = filterStopWords(wordArray); //Calls function that will filter 'noise' words we aren't interested in from the array
  
  for (let word in uncommonWords) { //Iterates through each word
    let wordValue = uncommonWords[word]; //Sets value to word at current index
    if (wordDictionary[wordValue] > 0) { //If the current word is already in wordDictionary
      wordDictionary[wordValue] += 1; //Add 1 to the value of that index to increase the count
    } else { //If the current word is not already in wordDictionary
      wordDictionary[wordValue] = 1; //Set the value to 1 to start the count
    }  
  }
  
  let wordList = sortProperties(wordDictionary); //Uses function to sort the wordDictionary
  var top5Words = wordList.slice(0,6); //Returns the top 5 most used words from the sorted list
  var least5Words = wordList.slice(-6, wordList.length); //Returns the least 5 frequent words
  
  ULTemplate(top5Words, document.getElementById("mostUsed")); //Writes top5Words to the html using ULTemplate function
  ULTemplate(least5Words, document.getElementById("leastUsed")); //Writes least5Words to html
  
  docLength.innerText = "Document Length: " + text.length; //Writes length of book value to docLength id
  wordCount.innerText = "Word Count: " + wordArray.length; //Writes word length to wordCount id
}

function ULTemplate(items, element) { //Inputs a variable called items and an html element to replace it with
  let rowTemplate = document.getElementById('template-ul-items'); //Gets html element and assigns it to variable
  let templateHTML = rowTemplate.innerHTML; //We only use the inner html text for rowTemplate
  let resultsHTML = ""; //Sets results to an empty string
  
  for (i = 0; i < items.length - 1; i++) { //Iterates through each element in items
    resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)"); //Adds item stats for each word   
  }
  
  element.innerHTML = resultsHTML; //sets the innerHTML to the results from above
} //

function sortProperties(obj) { //Takes in an object
  let rtnArray = Object.entries(obj); //Converts object to array
  rtnArray.sort(function (first,second) {
    return second[1] - first[1]; //Sorts array in descending order
  });
  return rtnArray; //Outputs the sorted array
}

function filterStopWords(wordArray) { //function that filters noise words from wordArray
    var commonWords = getStopWords(); //Calls function that gets the noise words
    var commonObj = {}; //Sets commonObj to empty
    var uncommonArr = []; //Sets array to empty
    
    for (i = 0; i < commonWords.length; i++) { //Iterates through the common words
      commonObj[commonWords[i].trim()] = true; //Will add the current index to the object if it doesn't find it
    }
    
    for (i = 0; i < wordArray.length; i++) { //Iterates through wordArray
      word = wordArray[i].trim().toLowerCase(); //Puts current index to lower case
      if (!commonObj[word]) { //If the word is not one of the noise words
        uncommonArr.push(word); //Add the word to uncommonArr
      }
    }
    return uncommonArr; //Returns array of non-noise words
}

function getStopWords() { //Provides the noise words we don't want to include
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

function performMark() { //Function that will highlight the words we searched for
   var keyword = document.getElementById("keyword").value; //Gets the keyword being searched for
   var display = document.getElementById("fileContent"); //Gets the book
   var newContent = ""; //Sets newContent to empty string
   let spans = document.querySelectorAll('mark'); //Finds all the currently marked items. Returns of list of document's elements that match the selector
  
  for (var i = 0; i < spans.length; i++) { //Iterates through marked items
    spans[i].outerHTML = spans[i].innerHTML; //<mark>Harry</mark> --> Harry (Removes outer html tags)
  }
  
  var re = new RegExp(keyword, "gi"); //Looks globally for case-insensitive keywords
  var replaceText = "<mark id='markme'>$&</mark>"; //Creates a mark tag that lets us take current content and stick it between mark tags
  var bookContent = display.innerHTML; //Gets the actual book content without html tags
  
  newContent = bookContent.replace(re, replaceText); //Replaces keywords with marked replaceText
  
  display.innerHTML = newContent; //Displays the newContent with marked words
  var count = document.querySelectorAll('mark').length; //Counts the number of html elements with mark
  document.getElementById("searchstat").innerHTML = "found " + count + " matches"; //Displays number of keywords found
  
  if (count > 0) {
    var element = document.getElementById("markme"); //Gets the element with the id markme
    element.scrollIntoView(); //Automatically scrolls to the marked element
  };
}