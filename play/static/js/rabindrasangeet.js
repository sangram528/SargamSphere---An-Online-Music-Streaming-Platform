document.addEventListener("DOMContentLoaded", function() {
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
            const response = await fetch('/rabindrasongs');
            const data = await response.json();
            console.log("List of songs:", data.songs);
            return data.songs;
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    const playMusic = (track, pause = false) => {
        const audioSrc = track.endsWith(".mp3") ? track : track + ".mp3";
        currentSong.src = "static/rabindrasangeet/" + audioSrc;

        if (!pause) {
            currentSong.play();
            play.src = "static/img/pause-circle.svg";
        }
        document.querySelector(".songInfo").innerHTML = track.replaceAll('.mp3','');
        document.querySelector(".songTime").innerHTML = "00:00/00:00";
    }

    // Main function
    async function main() {
        songs = await getSongs();
        playMusic(songs[0], true);

        let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
        for (const song of songs) {
            songUL.innerHTML += `<li>
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

        Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
            e.addEventListener("click", element => {
                console.log(e.querySelector(".info").firstElementChild.innerHTML)
                playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
            });
        });

        document.getElementById("play").addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play();
                play.src = "static/img/pause-circle.svg";
            } else {
                currentSong.pause();
                play.src = "static/img/play-circle.svg";
            }
        });

        currentSong.addEventListener("timeupdate", () => {
            const currentTimeFormatted = formatTime(currentSong.currentTime);
            const durationFormatted = formatTime(currentSong.duration);
            document.querySelector(".songTime").innerHTML = `${currentTimeFormatted} / ${durationFormatted}`;
            document.querySelector(".circle").style.left = ((currentSong.currentTime) / (currentSong.duration)) * 100 + "%";
        });

        document.querySelector(".seekbar").addEventListener("click", e => {
            const progress = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
            document.querySelector(".circle").style.left = progress + "%";
            currentSong.currentTime = (currentSong.duration * progress) / 100;
        });

        let currentSongIndex = 0;

        document.getElementById("previous").addEventListener("click", () => {
            currentSongIndex--;
            if (currentSongIndex < 0) {
                currentSongIndex = songs.length - 1;
            }
            playMusic(songs[currentSongIndex]);
        });

        document.getElementById("forward").addEventListener("click", () => {
            currentSongIndex++;
            if (currentSongIndex >= songs.length) {
                currentSongIndex = 0;
            }
            playMusic(songs[currentSongIndex]);
        });
    }

    main();
});
