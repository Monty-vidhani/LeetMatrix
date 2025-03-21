document.addEventListener('DOMContentLoaded',()=>{
    const searchbutton = document.getElementById("search-btn") ;
    const usernameinput = document.getElementById("user-input");
    const statscontainer = document.querySelector(".stats-container");
    const easyprogresscircle = document.querySelector(".easy-progress");
    const mediumprogresscircle = document.querySelector(".medium-progress");
    const hardprogresscircle = document.querySelector(".hard-progress");
    const easylabel = document.getElementById("easy-label");
    const mediumlabel = document.getElementById("medium-label");
    const hardlabel = document.getElementById("hard-label");
    const cardstatscontainer = document.querySelector(".stats-card");


 function validate(username){
        if(username.trim() === ""){
            alert("Username should not be empty") ;
            return false ;
        }
        const regex = /^[a-zA-Z0-9_-]{1,15}$/ ;
        const isMatching = regex.test(username) ;
        if(!isMatching){
            alert("Invalid Username") ;
        }
        return isMatching ;
 }
 async function fetchUserName(username){
    
        try{
            searchbutton.textContent = 'Searching...' ;
            searchbutton.disabled = true ;
            // const response = await fetch(url) ;
            const proxy = 'https://cors-anywhere.herokuapp.com/' ;
            const url = 'https://leetcode.com/graphql/' ;
            // concatinated URL 
    const myheaders = new Headers() ;
    myheaders.append("content-type" , "application/json")
    
const graphql = JSON.stringify({
    query:"query getUserProfile($username: String!){allQuestionsCount{difficulty count} matchedUser(username: $username) { submitStats { acSubmissionNum { difficulty count submissions } } } }" ,
    
    variables: {"username" : `${username}`}
})
const requestOptions = {
    method: "POST" ,
    headers : myheaders ,
    body: graphql ,
    redirect: "follow"
} ;
 const response = await fetch(proxy + url, requestOptions);
            if(!response.ok){
                throw new Error("unable to fetch user details");
            }
            const parsedData = await response.json() ;
       
            changeStats(parsedData);
        }catch(error){
            statscontainer.innerHTML = `<p>No data found!!!!</p>` ;
        }finally{
            searchbutton.textContent = 'Search' ;
            searchbutton.disabled = false ;
        }
 }

    searchbutton.addEventListener('click',()=>{
            const username = usernameinput.value ;
            if(validate(username)){
                fetchUserName(username) ;
            } ;

    })

    function updateProgress(solved,total,label,circle){
        const progressDegree = (solved/total)*100 ;
        circle.style.setProperty("--progress-bar",`${progressDegree}%`) ;
        label.textContent = `${solved} / ${total}` ;
    }

   function changeStats(parsedData){
     const total = parsedData.data.allQuestionsCount[0].count ;
     const totaleasy = parsedData.data.allQuestionsCount[1].count ;
     const totalmedium = parsedData.data.allQuestionsCount[2].count ;
     const totalhard = parsedData.data.allQuestionsCount[3].count ;

     const totalSolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[0].count ;     
     const totalEasySolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[1].count ;
     const totalMediumSolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[2].count ;
     const totalHardSolved = parsedData.data.matchedUser.submitStats.acSubmissionNum[3].count ;
     
        updateProgress(totalEasySolved,totaleasy,easylabel,easyprogresscircle);
        updateProgress(totalMediumSolved,totalmedium,mediumlabel,mediumprogresscircle);
        updateProgress(totalHardSolved,totalhard,hardlabel,hardprogresscircle);


        const cardsData = [
            {
                label:"Total Submissions",
                value:parsedData.data.matchedUser.submitStats.acSubmissionNum[0].submissions
            },
            {
                label:"Total Easy Submissions",
                value:parsedData.data.matchedUser.submitStats.acSubmissionNum[1].submissions
            },
            {
                label:"Total Medium Submissions",
                value:parsedData.data.matchedUser.submitStats.acSubmissionNum[2].submissions
            },
            {
                label:"Total Hard Submissions",
                value:parsedData.data.matchedUser.submitStats.acSubmissionNum[3].submissions
            }
        ];


        cardstatscontainer.innerHTML = cardsData.map(
            data=>{
                return`
                <div class="card">
                <h4>${data.label}</h4>
                <p>${data.value}</p>
                </div>        
                `
            }
                
        ).join("");
   }

})