// API URL's
const fetchAllChannels = `https://api.sr.se/api/v2/channels?format=json`

// Channel ID's p1 = 132, p2 = 163, p3 = 164

// DOM Selectors all channels
const channelInfo = document.getElementById('channelInfo')
const channelDescription = document.getElementById('channelDescription')
const scheduleInfo = document.getElementById('scheduleInfo')
const channelAudio = document.getElementById('channelAudio')
const channelSchedule = document.getElementById('channelSchedule')
const seeChannelSchedule = document.getElementById('seeChannelSchedule')


// DOM Selectors schedule for specific channel
const scheduleContainer = document.getElementById('scheduleContainer')
const displaySchedule = document.getElementById('displaySchedule')



fetch(fetchAllChannels)
  .then((response) => {
    return response.json()
  })
  .then((channelArray) => {

    //Filter array to only show P1, P2 and P3
    const filteredChannels = channelArray.channels.filter(item => item.id < 200)
    console.log(filteredChannels)


    filteredChannels.forEach((channel) => {

      let channelId = channel.id
      const description = channel.tagline
      const image = channel.image
      const audio = channel.liveaudio.url
      console.log(channel.color)


      // Print information to DOM
      channelInfo.innerHTML +=
        `
        <div class="channel-image" id="channelImg">
        <img src="${image}" alt="">
        </div>
        `




      // Fetch program that sends right now for each channel
      const fetchProgramRightNow = `https://api.sr.se/api/v2/scheduledepisodes/rightnow?format=json&channelid=${channelId}`

      const sendRightNow = (channelId) => {
        fetch(fetchProgramRightNow)
          .then((response) => {
            return response.json()
          })
          .then((rightNowArray) => {
            //console.log(rightNowArray)

            const titleNow = rightNowArray.channel.currentscheduledepisode.title
            const descrNow = rightNowArray.channel.currentscheduledepisode.description

            scheduleInfo.innerHTML +=
              `<div class="container">
              <div class="channel-program-now" id="channelProgramNow">
              <p>Spelas nu: ${titleNow} <br>
              <audio src="${audio}" controls></audio></p>
              </div>
              <div class="channel-schedule" id="channelSchedule">
              <a href="" id="seeChannelSchedule" value=${channelId}>Se tablå >></a>
              </div>
              </div>
              `
            //channelAudio.innerHTML += `<audio src="${audio}" controls></audio>`

          })
      }

      sendRightNow()

      //End tag filteredChannels.forEach
    });

    // End tag fetchAllChannels
  })


// Function for get program schedule 

// Get program schedule for different dates

// Get todays date



const today = new Date()
const month = today.getMonth() + 1
const day = today.getDate()
const yyyy = today.getFullYear()
console.log(today)

console.log(yyyy)


if (month < 10) {
  const mm = '0' + month
  console.log(mm)
}

if (day < 10) {
  const dd = '0' + day
  console.log(dd)
}

//const todaysDate = `${yyyy}-${mm}-${dd}`
//console.log(todaysDate)



// Get tomorrows date
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 1)
console.log(tomorrow)

const tomorrowDay = tomorrow.getDate()
const tomorrowMonth = tomorrow.getMonth() + 1
const tomorrowyyyy = tomorrow.getFullYear()
console.log(tomorrowDay)
console.log(tomorrowMonth)
console.log(tomorrowyyyy)

// Get date for second next day
const secondNextDay = new Date(tomorrow)
secondNextDay.setDate(tomorrow.getDate() + 1)
console.log(secondNextDay)



//Function for todays schedule

//const seeTodaysSchedule = () => {


// API url for 
const fetchChannelSchedule = `http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=132`
// http://api.sr.se/api/v2/scheduledepisodes?format=json&channelid=${channelId}&date=${today}


fetch(fetchChannelSchedule)
  .then((response) => {
    return response.json()
  })
  .then((schedules) => {

    const scheduleArray = schedules.schedule
    console.log(scheduleArray)

    scheduleArray.forEach((program) => {

      let startTimeUtc = program.starttimeutc
      //console.log(startTimeUtc)

      let startTime = new Date(Number(startTimeUtc.match(/^\/Date\((\d+)\)\/$/)[1]))
      const programStart = startTime.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
      console.log(programStart)

      const programTitle = program.title
      console.log(programTitle)
      //console.log(program.program.name)

      const programImage = program.imageurl



      // Print information to DOM

      displaySchedule.innerHTML +=
        `
        <div class="episode" id="episode">
        <p>${programStart}</p>
        <img src="${programImage}" alt="">
        <p>${programTitle}</p>
        </div>
      `

    })


  })

  //End tag for function to see todays schedule
//}


//seeChannelSchedule.addEventListener("onclick", () => seeTodaysSchedule())
