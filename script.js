document.addEventListener('DOMContentLoaded', function() {
    const body = document.body;
    const splashScreen = document.getElementById('splash-screen');
    const homeScreen = document.getElementById('home-screen');
    const playerScreen = document.getElementById('player-screen');
    const skipButton = document.getElementById('skip-button');
    const themeToggle = document.getElementById('theme-toggle');
    
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause-button');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const albumCover = playerScreen.querySelector('.album-cover');
    const songTitle = playerScreen.querySelector('h3');
    const artistName = playerScreen.querySelector('p');

    // Music array
    const musicList = [
        {
            title: "Yummy",
            artist: "Justin Bieber",
            src: "assets/Justin Bieber - Yummy.mp3",
            cover: "assets/yummy.jpg"
        },
        {
            title: "Love Yourself",
            artist: "Justin Bieber",
            src: "assets/justin_bieber_love_yourself.mp3",
            cover: "assets/love.jpeg"
        },
        {
            title: "Chandelie",
            artist: "Sia",
            src: "assets/Sia - Chandelie [128].mp3",
            cover: "assets/chandalia.jpg"
        },
        {
            title: "Lovely",
            artist: "Billie-Eilish-x-Khalid",
            src: "assets/Billie-Eilish-x-Khalid-Lovely-via-Naijafinix.com_.mp3",
            cover: "assets/lovely.jpg"
        },
        {
            title: "Shape of you",
            artist: "Ed sheeran",
            src: "assets/Ed_Sheeran_-_Shape_Of_You_Official_Lyric_Video.imack_.co_.mp3",
            cover: "assets/shape of you.jpg"
        },
        {
            title: "Intension",
            artist: "Justin Bieber ft. Quavo",
            src: "assets/Justin Bieber - Intentions ft. Quavo.mp3",
            cover: "assets//INTENTIONS-JUSTIN-BIEBER.png"
        }
    ];

    let currentTrack = 0;

    // Load track function
    function loadTrack(index) {
        const track = musicList[index];
        audioPlayer.src = track.src;
        songTitle.textContent = track.title;
        artistName.textContent = track.artist;
        albumCover.src = track.cover;
        currentTrack = index;
    }

    // Play/Pause Toggle
    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    }

    // Next Track
    function nextTrack() {
        currentTrack = (currentTrack + 1) % musicList.length;
        loadTrack(currentTrack);
        audioPlayer.play();
        playPauseButton.textContent = 'Pause';
    }

    // Previous Track
    function prevTrack() {
        currentTrack = (currentTrack - 1 + musicList.length) % musicList.length;
        loadTrack(currentTrack);
        audioPlayer.play();
        playPauseButton.textContent = 'Pause';
    }

    // Event Listeners
    playPauseButton.addEventListener('click', togglePlayPause);
    nextButton.addEventListener('click', nextTrack);
    prevButton.addEventListener('click', prevTrack);

    // Link music to album clicks in Top Mix
    const albums = document.querySelectorAll('#top-mix .album');
    albums.forEach(album => {
        album.addEventListener('click', (event) => {
            const index = event.currentTarget.getAttribute('data-index');
            loadTrack(index);
            homeScreen.classList.add('hidden');
            playerScreen.classList.remove('hidden');
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        });
    });

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-theme');
        body.classList.toggle('light-theme');
    });

    // Skip Splash Screen
    skipButton.addEventListener('click', () => {
        splashScreen.classList.add('hidden');
        homeScreen.classList.remove('hidden');
    });

    // Load the first track initially
    loadTrack(currentTrack);
});