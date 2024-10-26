window.addEventListener('DOMContentLoaded', () => {

    const imgBg = document.querySelector('.img__bg'),
          imgPlayer = document.querySelector('.img__player'),
          singerName = document.querySelector('.audio-player__title'),
          songName = document.querySelector('.audio-player__subtitle'),

          play = document.querySelector('.svg_play'),
          pause = document.querySelector('.svg_pause'),
          next = document.querySelector('.svg_next'),
          prev = document.querySelector('.svg_prev'),

          timeLine = document.querySelector('.audio-player__timeline'),
          line = document.querySelector('.audio-player__line'),
          progress = document.querySelector('.progress'),
          current = document.querySelector('.audio-player__current-time'),
          totalTime = document.querySelector('.audio-player__total-time'),

          volume = document.querySelector('.volume'),
          volumeSlash = document.querySelector('.volume_slash');

    const songs = [
        {
        'singer': 'One Republic',
        'song': 'Apologize',
        'link': 'audio/onerepublicapologize.mp3',
        'img': 'img/one_republic.jpg',
        'alt': 'one_republic'
        },
        {
        'singer': 'Ed Sheeran',
        'song': "Perfect",
        'link': 'audio/edsheeranperfect.mp3',
        'img': 'img/ed.jpg',
        'alt': 'ed_sheeran'
        },
        {
        'singer': 'Imagine Dragons',
        'song': "Birds",
        'link': 'audio/imaginedragons_birds.mp3',
        'img': 'img/dragons.jpg',
        'alt': 'imagine_dragons'
        }
    ];

    const audio = new Audio();
    let songIndex = 0;
    let time = 0;


    // функция перед закрузкой аудио на страницу, узнаем duration
    audio.addEventListener("loadeddata", () => {
        const audioDuration = audio.duration;
        const totalCurretTime = changeTime(audioDuration);
        totalTime.innerHTML = totalCurretTime;
    });

    

    // событие - куда нажали, туда перешла шкала прогресса и время аудио
    line.addEventListener("click", (target) => {
        const widthLine = window.getComputedStyle(line).width;
        console.log(target.offsetX) //какой отступ от края блока - timeline
        audio.currentTime = (target.offsetX / +widthLine.slice(0, widthLine.length - 2)) * audio.duration;
    });

    // функция и два события - меняем время и прогресс шкалы нажатием и перетаскиванием мыши
    function changeProgressTime(move) {
        audio.currentTime = (move.offsetX / line.clientWidth) * audio.duration;
        audio.play();
        play.style.display = 'none';
        pause.style.display = 'block';
        imgPlayer.style.transform = 'scale(1.1)';
        imgPlayer.style.transition = '0.6s all';
      }
    line.addEventListener('mousedown', (move) => {
        changeProgressTime(move);
        line.addEventListener('mousemove', changeProgressTime);
    });
    line.addEventListener('mouseup', () => {
            line.removeEventListener('mousemove', changeProgressTime);
        })

    
    
    // функция перевода мс в минуты и секунды
    function changeTime(duration) {
        let min = Math.floor(duration / 60);
        let sec = Math.floor(duration - min * 60);
        if(sec < 10) {
            sec = `0${sec}`;
        } else {
            sec = sec;
        }
        return `${min}:${sec}`;
    }
    
    function playAudio() {
        audio.src = songs[songIndex].link;
        audio.currentTime = time;
        audio.volume = 0.4;
        audio.play();
        play.style.display = 'none';
        pause.style.display = 'block';
        next.addEventListener('click', nextAudio);
        imgPlayer.style.transform = 'scale(1.1)';
        imgPlayer.style.transition = '0.6s all';
        updateTime(audio);
        volume.addEventListener('click', () => {
            audio.volume = 0;
            volume.style.display = 'none';
            volumeSlash.style.display = 'block';
        })
        volumeSlash.addEventListener('click', () => {
            audio.volume = 0.4;
            volume.style.display = 'block';
            volumeSlash.style.display = 'none';
        })
    }

    function pauseAudio() {
        console.log(audio.currentTime)
        time = audio.currentTime;
        audio.pause();
        pause.style.display = 'none';
        play.style.display = 'block';
        imgPlayer.style.transform = 'none';
        imgPlayer.style.transition = '0.6s all';
    }

    function nextAudio() {
        if (songIndex >= 0 && songIndex < 2) {
            songIndex += 1;
        } else if (songIndex === 2) {
            songIndex = 0;
        }
        time = 0;
        imgBg.src = songs[songIndex].img;
        imgBg.alt = songs[songIndex].alt;
        imgPlayer.src = songs[songIndex].img;
        imgPlayer.alt = songs[songIndex].alt;
        singerName.innerHTML = songs[songIndex].singer;
        songName.innerHTML = songs[songIndex].song;
        playAudio();
    }

    function prevAudio() {
        if (songIndex === 2 || songIndex === 1) {
            songIndex -= 1;
        } else if (songIndex === 0) {
            songIndex = 2;
        }
        time = 0;
        imgBg.src = songs[songIndex].img;
        imgBg.alt = songs[songIndex].alt;
        imgPlayer.src = songs[songIndex].img;
        imgPlayer.alt = songs[songIndex].alt;
        singerName.innerHTML = songs[songIndex].singer;
        songName.innerHTML = songs[songIndex].song;
        playAudio();
    }

    // функция с событием, которое отвечает за обновление времени. Меняем текущее время и ширину прогресса.
    function updateTime(audio) {
        audio.addEventListener('timeupdate', () => {
            current.innerHTML = changeTime(audio.currentTime);
            const progressWidth = audio.currentTime * 100 / audio.duration;
            progress.style.width = progressWidth + '%';
        })
    }

    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        progress.style.width = 0 + '%';
        nextAudio();
    })

    

    play.addEventListener('click', playAudio);
    pause.addEventListener('click', pauseAudio);

    next.addEventListener('click', nextAudio);
    prev.addEventListener('click', prevAudio);


})