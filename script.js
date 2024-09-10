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
    const canvas = document.getElementById('visualizer');
    const ctx = canvas.getContext('2d');

    // Resize canvas to fit player screen
    canvas.width = playerScreen.clientWidth;
    canvas.height = 100; // Set height for the waveform visualization

    // Web Audio API setup
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioSource = audioContext.createMediaElementSource(audioPlayer);
    const analyzer = audioContext.createAnalyser();
    audioSource.connect(analyzer);
    analyzer.connect(audioContext.destination);

    analyzer.fftSize = 2048; // Higher fftSize for smoother waveform
    const bufferLength = analyzer.fftSize;
    const dataArray = new Uint8Array(bufferLength);
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
    let isShuffle = false;
    let isRepeat = false;

        // Shuffle Toggle
        const shuffleButton = document.getElementById('shuffle-button');
        shuffleButton.addEventListener('click', () => {
            isShuffle = !isShuffle;
            shuffleButton.classList.toggle('active', isShuffle);
        });

    // Repeat Toggle
    const repeatButton = document.getElementById('repeat-button');
    repeatButton.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatButton.classList.toggle('active', isRepeat);
    });

    // Load track function
    function loadTrack(index) {
        const track = musicList[index];
        audioPlayer.src = track.src;
        songTitle.textContent = track.title;
        artistName.textContent = track.artist;
        albumCover.src = track.cover;
    }

    // Play/Pause Toggle
    function togglePlayPause() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.innerHTML = '<img src="assets/pause-removebg-preview.png" width="50px" height="50px"></img>';
            audioContext.resume();
        } else {
            audioPlayer.pause();
            playPauseButton.innerHTML = '<img src="assets/play-removebg-preview.png" width="50px" height="50px">';
        }
    }

    // Next Track
    function nextTrack() {
        if (isShuffle) {
            currentTrack = Math.floor(Math.random()* musicList.length);
        } else {
            currentTrack = (currentTrack + 1) % musicList.length;
        }
        loadTrack(currentTrack);
        audioPlayer.play();
        playPauseButton.innerHTML = '<img src="assets/pause-removebg-preview.png" width="50px" height="50px"></img>';
    }

    // Previous Track
    function prevTrack() {
        if (isShuffle) {
            currentTrack = Math.floor(Math.random()* musicList.length);
        } else {
            currentTrack = (currentTrack - 1 + musicList.length) % musicList.length;
        }
        loadTrack(currentTrack);
        audioPlayer.play();
        playPauseButton.innerHTML = '<img src="assets/pause-removebg-preview.png" width="50px" height="50px"></img>';
    }

    // Event Listeners for Play/Pause, Next, Previous buttons
    playPauseButton.addEventListener('click', togglePlayPause);
    nextButton.addEventListener('click', nextTrack);
    prevButton.addEventListener('click', prevTrack);

    // Event Listener for each album in Top Mix to load and play the track
    const topMixAlbums = document.querySelectorAll('#top-mix .album');
    topMixAlbums.forEach(album => {
        album.addEventListener('click', function() {
            const trackIndex = parseInt(this.getAttribute('data-index'));
            currentTrack = trackIndex;
            loadTrack(currentTrack);
            playerScreen.classList.remove('hidden');
            homeScreen.classList.add('hidden');
            audioPlayer.play();
            playPauseButton.innerHTML = '<img src="assets/pause-removebg-preview.png" width="50px" height="50px"></img>';
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

        // Event listener for when the track ends
        audioPlayer.addEventListener('ended', () => {
            if (isRepeat) {
                audioPlayer.currentTime = 0;
                audioPlayer.play();
            } else {
                nextTrack();
            }
        });

    // Audio Visualization
    function drawVisualizer() {
        requestAnimationFrame(drawVisualizer);

        analyzer.getByteFrequencyData(dataArray);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 1.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i] / 2;

            const r = barHeight + 25 * (i / bufferLength);
            const g = 250 * (i / bufferLength);
            const b = 50;

            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

        // Load the first track initially
        loadTrack(currentTrack);
    drawVisualizer();
});
