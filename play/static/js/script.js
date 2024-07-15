console.log("lets write javascript");
let currentSong = new Audio();
let songs;
function formatTime(seconds) {
    seconds = Math.round(seconds);
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

// Async function to fetch and display songs
async function getSongs() {
    try {
        const response = await fetch('/api/songs/');
        const data = await response.json();

        // Display list of songs in the console
        console.log("List of songs:", data.songs);

        // Return the list of songs
        return data.songs;
    } catch (error) {
        console.error('Error fetching songs:', error);
    }
}

const playMusic = (track, pause = false) => {
    const audioSrc = track.endsWith(".mp3") ? track : track + ".mp3";
    currentSong.src = "static/songs/" + audioSrc;

    if (!pause) {
        currentSong.play();
        play.src = "static/img/pause-circle.svg";
    }
    document.querySelector(".songInfo").innerHTML = track.replaceAll('.mp3','');
    document.querySelector(".songTime").innerHTML = "00:00/00:00";
}


// Main function
async function main() {
    // Fetch and display songs
    songs = await getSongs();
    playMusic(songs[0],true);
    //Show all the songs in the playlist 
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML+`<li>
        <img class="invert" src="static/img/music.svg">
							<div class="info">
								<div>${song.replaceAll('.mp3',"")}</div>
							</div>
							<div class="playNow">
								<span>Play Now</span>
								<img class="invert" src="static/img/play-circle.svg">
							</div>
        </li>`;
    }
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
        
    })
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.src="static/img/pause-circle.svg"
        }
        else{
            currentSong.pause()
            play.src="static/img/play-circle.svg"
        }
    })
    //timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        console.log(currentSong.currentTime, currentSong.duration);
        const currentTimeFormatted = formatTime(currentSong.currentTime);
        const durationFormatted = formatTime(currentSong.duration);
        document.querySelector(".songTime").innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;
        document.querySelector(".circle").style.left = ((currentSong.currentTime)/(currentSong.duration))*100 + "%";
    });

    //seekbar 
    document.querySelector(".seekbar").addEventListener("click", e => {
        const progress = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        console.log('Progress:', progress);
        console.log('Duration:', currentSong.duration);
    
        document.querySelector(".circle").style.left = progress + "%";
        currentSong.currentTime = (currentSong.duration * progress) / 100;
        console.log('New currentTime:', currentSong.currentTime);
    });

    //previous and next
    let currentSongIndex = 0; // Keep track of the index of the current song

// Previous button functionality
document.getElementById("previous").addEventListener("click", () => {
    // Decrement the current song index
    currentSongIndex--;

    // If the index is less than 0, loop back to the last song
    if (currentSongIndex < 0) {
        currentSongIndex = songs.length - 1;
    }

    // Play the previous song
    playMusic(songs[currentSongIndex]);
});

// Next button functionality
document.getElementById("next").addEventListener("click", () => {
    // Increment the current song index
    currentSongIndex++;

    // If the index is greater than the number of songs, loop back to the first song
    if (currentSongIndex >= songs.length) {
        currentSongIndex = 0;
    }

    // Play the next song
    playMusic(songs[currentSongIndex]);
});



       





}


// Call the main function when the DOM content is loaded
document.addEventListener("DOMContentLoaded", main);
