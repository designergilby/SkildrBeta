
// import bot from './assets/bot.svg'
// import user from './assets/user.svg'

const form = document.querySelector('form') //Calls in the form, where the user inputs chat.
const chatContainer = document.querySelector('#chat_container') //Chat container contains all the messages from the user. 

let loadInterval;

function loader(element) {
  element.textContent = ''

  loadInterval = setInterval(() => {
      // Update the text content of the loading indicator
      element.textContent += '.';

      // If the loading indicator has reached three dots, reset it
      if (element.textContent === '....') {
          element.textContent = '';
      }
  }, 300);
} //Creates a loading animation when the bot is thinking. !!!!!Can make this into a loading screen instead?

function typeText(element, text) {

  let index = 0

  let interval = setInterval(() => {
      if (index < text.length) {
          element.innerHTML += text.charAt(index)
          index++
      } else {
          clearInterval(interval)
      }
  }, 20)
} //Types out the message. !!!!!Don't need this!

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
} //Returns the ID!

function chatStripe(isAi, value, uniqueId) {
  return (
      `
      <div class="wrapper ${isAi && 'ai'}">
          <div class="chat">
              <div class="message" id=${uniqueId}>${value}</div>
          </div>
      </div>
      `
  )
} //Creates the chat stripe, either for the AI or the user. 
//isAI is a variable that determines if the chat stripe should be for the ai. If it is, it adds the ai class.
//message is the class that creates the messages/ Formats, etc. 
//value is the AI generated message. 
//A unique ID is generated for each response, so that we can manipulate each message when we write it out. 

const handleSubmit = async (e) =>{
  e.preventDefault();

  const data = new FormData(form) //This grabs the data from the form the user submitted.



  console.log(data.get('prompt'))
  //the user's chat stripe
  chatContainer.innerHTML += chatStripe(false, data.get('prompt')); //This goes into the chatContainer html and calls the chat stripe function, which will add a chat stripe to the inner html.
  //Most likely don't need this, since we won't be adding the user chat to the output.

  form.reset(); //Resets whats inside the form.

  //bot's chat
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId); //This generates the response for the ai. True because it's AI, a blank space to write, and passing in the id.

  chatContainer.scrollTop = chatContainer.scrollHeight; //Scrolls the chat container ot the top so it can be used.
  //!!!!Don't need this one.

  const messageDiv = document.getElementById(uniqueId);
  //Grabs the chatstripe from it's id, and puts that location into messageDiv

  loader(messageDiv);
  //grabs the current AI controlled chatstripe and calls the load function, so the ... are active. 

  //!! Fetching data from the server!

  const response = await fetch('http://localhost:5001', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
  })

  //Clears the message div to type out. Maybe don't need this? 
  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if (response.ok) {
    console.log("hit");
    const data = await response.json(); 
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n' !!!

    console.log({parsedData});

    typeText(messageDiv, parsedData)
  } else {
    const err = await response.text()

    messageDiv.innerHTML = "Something went wrong" //!! if there was an error!
    alert(err)
  }
}

form.addEventListener('submit', handleSubmit, console.log("submit?"));
// form.addEventListener('keyup', (e) => {
//   if(e.keyCode === 13){
//     handleSubmit(e);
//   }
// })
//Calls the submit function if the button is pressed, or the user presses enter. 





//=================== JQUERY ==================//

$(document).ready(function() {
					
	// VARIABLES
	
	
	// EVENT HANDLERS
	$(".startButton").on("click", function(event){
		event.preventDefault();
		console.log("hit")
		$(".startCont").fadeOut(1000, function(){
			$(".skillInputCont").fadeIn(1000);
		});
		$(".skillInputCont").animate({
			"margin-left":"0vw"
		})
    $(".tetris").animate({
      "top":"80vh"
    })
	})

	$(".skillBtn").on("click", function(event){
		
		console.log("hit")
		
		$(".nextBtn").fadeIn(1000);

    loadMessage();
	})

  $(".nextBtn").on("click", function(event){
    event.preventDefault();
    $(".skillInputCont").fadeOut(1000, function(){
			$(".emailInputCont").fadeIn(1000);
		});
  })
	
	// FUNCTIONS
	
  function loadMessage(){
    $(".beforeSubmit").fadeOut(1000, function(){
      $("#chat_container").animate({
        "opacity":"1"
      }, 2000)
    })
  }

  function unloadMessage(){
    $(".skildrLoading").fadeOut(1000, function(){
      $(".afterSubmit").fadeIn(1000);
    })
  }
	
	// INITIALIZATION
	
	
});
