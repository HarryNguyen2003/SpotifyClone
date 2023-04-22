// Selector a element
const $ = document.querySelector.bind(document);

// Selector a lot of element
const $$ = document.querySelectorAll.bind(document);

// Create consts
const PLAYER_STORAGE_KEY = 'HarryNguyen'
const player = $('.player');
const playlist = $('.playlist');
const titleCd = $('.cd-title');
const authorCd = $('.cd-author');
const thumbCd = $('.cd-thumb');
const audio = $('#audio');
const progress = $('#progress');
const volume = $('#volume');
const playBtn = $('.btn-toggle-play');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

// Biggest 
const app = {
    isPlaying:false,
    isRanDom:false,
    isRepeat:false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    currentIndex:0,
    songs:[
        {   image:'./assets/img/AnhSeQuenThoiMa.jpeg',
            path:'./assets/music/songA.mp3',
            name:'Anh Sẽ Quên Thôi Mà',
            singer:'Frank'
        },{
            image:'./assets/img/cupid.jpeg',
            path:'./assets/music/songC.mp3',
            name:'Cupid',
            singer:'Fifty Fifty'
        },{
            image:'./assets/img/HanhPhucMoi.jpeg',
            path:'./assets/music/songH.mp3',
            name:'Hạnh Phúc Mới',
            singer:'Son Tung Cover'
        },{
            image:'./assets/img/muonDuocCungEm.jpeg',
            path:'./assets/music/songM.mp3',
            name:'Muốn Được Cùng Em',
            singer:'CM1X (ft. QUỲNH GAI)'
        },{
            image:'./assets/img/khiMa.jpeg',
            path:'./assets/music/KhiMa.mp3',
            name:'Khi Mà',
            singer:'RONBOOGZ'
        },{
            image:'./assets/img/song5.jpeg',
            path:'./assets/music/song5.mp3',
            name:'Not About Love',
            singer:'Khoi Vu'
        },{
            image:'./assets/img/song6.jpeg',
            path:'./assets/music/song6.mp3',
            name:'Anh Đã Từ Bỏ Rồi',
            singer:'Nguyenn & Aric'
        },{
            image:'./assets/img/LanMan.png',
            path:'./assets/music/LanMan.mp3',
            name:'Lan Man',
            singer:'RONBOOGZ'
        },{
            image:'./assets/img/ThuCuoi.jpeg',
            path:'./assets/music/ThuCuoi.mp3',
            name:'Thu Cuối',
            singer:'Mr.T'
        },{
            image:'./assets/img/YeuMotNguoiCoUocMo.jpeg',
            path:'./assets/music/YeuMotNguoiCoUocMo.mp3',
            name:'Yêu Một Người Có Ước Mơ',
            singer:'buitruonglinh'
        }
    ],
    setConfig:function(key,value){
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(this.config));
    },
    render: function(){
        const htmls = this.songs.map((song,index) =>{
            return `
                <div class = "song ${index === this.currentIndex ? 'active':''}" data-index = "${index}">
                    <div class = 'thumb' style = 'background-image:url(${song.image})'>
                    </div>
                    <div class = "body">
                        <h3 class = 'title'>${song.name}</h3>
                        <p class = 'author'>${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>   
                </div> 
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    // get first song
    defineProperties:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex];
            }
        })
    },

    // Handles event
    handeleEvents:function(){
        const _this = this;
        const thumbCDAnimate =  thumbCd.animate([
            {transform:'rotate(360deg)'}
        ],{
            duration:10000, // 10s
            iterations:Infinity,
        })

        //when click play or pause.
        playBtn.onclick = function(){
            thumbCDAnimate.pause();
            // check state of audio define audio:pause
            if(!_this.isPlaying){     
                audio.play();
            }else{
                audio.pause();
            }
            //when audio playing
            audio.onplay = function(){
                thumbCDAnimate.play();
                _this.isPlaying = true;
                player.classList.add('playing');
            }     
            //when audio is pausing
            audio.onpause = function(){
                _this.isPlaying = false;
                thumbCDAnimate.pause();
                player.classList.remove('playing');
            }

            // change time following song
            audio.ontimeupdate = function(){
                const progressPersent = audio.currentTime/audio.duration*100;
                progress.value = progressPersent;
            }   
            // rewind song
            progress.onchange = function(){
                audio.play();
                audio.currentTime =audio.duration/100*progress.value;
            }

            // Change volume
            volume.onchange= function(){
                audio.volume = volume.value/100;
            }   

        }
        
        // nextSong
        nextBtn.onclick = function(){
            if(_this.isRanDom){
                _this.randomSong()
            }else{
                _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        // prevSong
        prevBtn.onclick = function(){
            if(_this.isRanDom){
                _this.randomSong()
            }else{
                _this.prevSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
        }

        //random Song
        randomBtn.onclick = function(){
            _this.isRanDom = !_this.isRanDom; 
            let repeatActive = $(".btn.btn-repeat.active");
            if(repeatActive != null){
                repeatActive.classList.remove('active');
            }           
            randomBtn.classList.toggle('active', _this.isRanDom);
            if(_this.isRanDom){
                audio.onended = function(){
                    nextBtn.click();
                }
            }
            _this.setConfig('isRandom',_this.isRanDom );
        }

       //when repeat Song
        repeatBtn.onclick = function(){
            let randomActive = $(".btn.btn-random.active")
            _this.isRepeat = !_this.isRepeat;
            if(randomActive != null){
                randomBtn.classList.remove('active');
            }
            repeatBtn.classList.toggle('active', _this.isRepeat);
            audio.onended = function(){
                if(_this.isRepeat){
                    audio.play();
                }else{
                    nextBtn.click();
                }
            }
            _this.setConfig('isRepeat',_this.isRepeat);

        } 

        // click playlist
        playlist.onclick = function(e){
            const songNode =e.target.closest('.song:not(.active)')
            if(songNode || e.target.closest('.option')){
                // when click song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // when click song option
                if(e.target.closest('.option')){

                }
            }
        }
    },
    // Change color Heart
    handleEventHeart:function(){
        var iConHeart = $('.fas.fa-heart.hearColor');
        var heartBtn = $('.cd-heart');   
        heartBtn.addEventListener("click", function(){
            iConHeart = $('.fas.fa-heart.hearColor')
            if(iConHeart === null){
                heartBtn.innerHTML = '<i class="fas fa-heart hearColor"></i>';
            }else{
                heartBtn.innerHTML = '<i class="far fa-heart"></i>'
            }
        })
    },
    // when scroll change
    scrollToActiveSong: function(){ 
        setTimeout(()=>{
            $('.song.active').scrollIntoView({
                behavior:"smooth",
                block:"center"
            });
        },500)
    },
    // Load first music
    loadCurrentSong: function(){
        titleCd.textContent = this.currentSong.name;
        authorCd.textContent = this.currentSong.singer;
        thumbCd.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = `${this.currentSong.path}`;
    },

    loadConfig:function(){
        this.isRanDom = this.config.isRanDom
        this.isRepeat = this.config.isRepeat
    },
    // next song
    nextSong:function(){
        this.currentIndex++
        if(this.currentIndex > this.songs.length - 1){
            this.currentIndex = 0;
        };
        this.loadCurrentSong();
    },

    // prev song
    prevSong:function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentIndex = this.songs.length - 1;
        };
        this.loadCurrentSong();
    },

    // random song
    randomSong:function(){
        do{
            var randomIndex = Math.floor(Math.random()*this.songs.length);
        }while(randomIndex === this.currentIndex);
        this.currentIndex = randomIndex;
        this.loadCurrentSong();  
    },


    // Start app
    start: function(){
        // Past config explain when reload lost in future example:repeat, reload.
        this.loadConfig();

        // Define property for object
        this.defineProperties();

        // Listen and handle Like event 
        this.handleEventHeart();

        // Listen and handle event 
        this.handeleEvents();

        // Perform play current song 
        this.loadCurrentSong();

        // Render playlist
        this.render(); 
        randomBtn.classList.toggle('active', this.isRanDom);
        repeatBtn.classList.toggle('active', this.isRepeat);

    }
}


// Run web();
app.start();