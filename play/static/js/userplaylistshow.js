document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript loaded");
    const currentSong = new Audio();
    let songs = [];

    function formatTime(seconds) {
        seconds = Math.round(seconds);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    async function getSongs() {
        try {
            const response = await fetch('/userplaylistsongs');
            const data = await response.json();
            console.log("List of songs:", data.songs);
            return data.songs;
        } catch (error) {
            console.error('Error fetching songs:', error);
            return [];
        }
    }

    const playMusic = (track, pause = false) => {
        const audioSrc = track.endsWith(".mp3") ? track : track + ".mp3";
        currentSong.src = "static/usersongs/" + audioSrc;

        if (!pause) {
            currentSong.play();
            document.getElementById("play").src = "static/img/pause-circle.svg";
        }
        document.querySelector(".songInfo").innerHTML = track.replaceAll('.mp3','');
        document.querySelector(".songTime").innerHTML = "00:00/00:00";
    }

    async function main() {
        songs = await getSongs();
        if (songs.length > 0) {
            playMusic(songs[0], true);
        }

        const songList = document.querySelector(".songList ul");
        for (const song of songs) {
            const songName = song.replaceAll('.mp3',"");
            const li = document.createElement("li");
            li.innerHTML = `
                <img class="invert" src="static/img/music.svg">
                <div class="info">
                    <div>${songName}</div>
                </div>
                <div class="playNow">
                    <span>Play Now</span>
                    <img class="invert" src="static/img/play-circle.svg">
                </div>
            `;
            songList.appendChild(li);
        }

        songList.addEventListener("click", (event) => {
            const target = event.target.closest("li");
            if (target) {
                const infoElement = target.querySelector(".info");
                if (infoElement && infoElement.firstElementChild) {
                    const songName = infoElement.firstElementChild.innerHTML.trim();
                    playMusic(songName);
                }
            }
        });

        document.getElementById("play").addEventListener("click", () => {
            if (currentSong.paused) {
                currentSong.play();
                document.getElementById("play").src = "static/img/pause-circle.svg";
            } else {
                currentSong.pause();
                document.getElementById("play").src = "static/img/play-circle.svg";
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
