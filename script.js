const slides = [
    {
        id: 1,
        title: "Imaginando a mi audiencia",
        description: "Al comenzar a diseñar esta experiencia digital, imaginé una audiencia profundamente conectada con lo tecnológico. Visualicé usuarios que integran lo digital en todos los momentos de su vida cotidiana, incluso en espacios físicos como el entrenamiento o el bienestar personal. Esta percepción inicial surge de observar comportamientos cercanos, pero también de proyectar mis propias prácticas digitales sobre otros, evidenciando una mirada construida desde la sociología espontánea.",
        image: "imagen1.png",
        audio: "audio1.mp4"
    },
    {
        id: 2,
        title: "La interacción que imaginé",
        description: "Proyecté una audiencia activa, participativa y comprometida con la experiencia. Imaginé usuarios que no solo observan, sino que se involucran, exploran y permanecen dentro de la narrativa interactiva. Esta idea de participación surge desde mi expectativa como diseñador de generar experiencias que requieran atención, esfuerzo y permanencia, trasladando simbólicamente la lógica del compromiso físico al entorno digital.",
        image: "imagen2.png",
        audio: "audio2.mp4"
    },
    {
        id: 3,
        title: "¿Por qué sería significativa?",
        description: "Consideré que la experiencia sería significativa en la medida en que lograra capturar la atención de la audiencia de forma inmersiva. Imaginé usuarios absorbidos por estímulos visuales, narrativos y sensoriales que los desconectaran momentáneamente de su entorno inmediato. Esta proyección responde a mi interés por crear experiencias que no solo informen, sino que envuelvan emocional y perceptivamente al espectador.",
        image: "imagen3.jpeg",
        audio: "audio3.mp4"
    },
    {
        id: 4,
        title: "Riesgos y distancias",
        description: "Al ampliar la reflexión, reconocí que mis percepciones podían estar mediadas por suposiciones. No todas las audiencias interactúan de la manera que imagino. Comprender realmente sus motivaciones, expectativas y limitaciones exige diálogo, escucha y procesos de investigación. Esta distancia entre lo que supongo y lo que realmente ocurre evidencia los límites de diseñar desde la intuición.",
        image: "imagen4.png",
        audio: "audio4.mp4"
    },
    {
        id: 5,
        title: "Rompiendo la sociología espontánea",
        description: "Este ejercicio me permitió reconocer que diseñar para audiencias digitales implica pasar de la suposición a la metodología. Entendí la necesidad de investigar, analizar comportamientos y validar percepciones antes de tomar decisiones de diseño. Romper con la sociología espontánea significa construir experiencias desde el conocimiento real de los usuarios y no únicamente desde nuestras proyecciones.",
        image: "imagen5.jpeg",
        audio: "audio5.mp4"
    }
];

class App {
    constructor() {
        this.currentSlide = 0;
        this.isPlaying = false;
        this.transitioning = false;
        this.showExperience = false;
        this.touchStartX = 0;
        this.touchStartY = 0;

        this.landingPage = document.getElementById('landingPage');
        this.closingPage = document.getElementById('closingPage');
        this.experienceContainer = document.getElementById('experienceContainer');
        this.slidesWrapper = document.getElementById('slidesWrapper');
        this.progressIndicator = document.getElementById('progressIndicator');
        this.audioPlayer = document.getElementById('audioPlayer');
        this.startBtn = document.getElementById('startBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.slideCounter = document.getElementById('slideCounter');
        this.homeBtn = document.getElementById('homeBtn');

        this.init();
    }

    init() {
        this.renderSlides();
        this.renderProgressDots();
        this.attachEventListeners();
        this.updateActiveSlide();
    }

    renderSlides() {
        this.slidesWrapper.innerHTML = slides.map((slide, index) => `
        <div class="slide ${index === 0 ? 'active' : ''}">
            <div class="slide-image-wrapper">
                <img src="${slide.image}" alt="${slide.title}" class="slide-image">
                <div class="image-overlay"></div>
            </div>
            <div class="slide-content">
                <div class="slide-number">0${slide.id}</div>
                <h2 class="slide-title">${slide.title}</h2>
                <p class="slide-description">${slide.description}</p>
                ${slide.audio ? `
                    <div class="audio-controls">
                        <button class="audio-button" data-slide="${index}">
                            <span class="play-icon">▶</span>
                            <span class="pause-icon" style="display:none;">⏸</span>
                        </button>
                        <span class="volume-icon">🔊</span>
                        <span class="audio-label">Audio Reflection</span>
                    </div>
                ` : ''}
            </div>
            <div class="geometric-overlay">
                <div class="overlay-shape os-1"></div>
                <div class="overlay-shape os-2"></div>
            </div>
        </div>
        `).join('');
    }

    renderProgressDots() {
        this.progressIndicator.innerHTML = slides.map((_, index) => `
            <div class="progress-dot ${index === 0 ? 'active' : ''}" data-slide="${index}"></div>
        `).join('');
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startExperience());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.homeBtn.addEventListener('click', () => this.resetToLanding());
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: true });
        this.experienceContainer.addEventListener('touchstart', (e) => this.handleTouchStart(e));
        this.experienceContainer.addEventListener('touchend', (e) => this.handleTouchEnd(e));

        this.progressIndicator.addEventListener('click', (e) => {
            if (e.target.classList.contains('progress-dot')) {
                const index = parseInt(e.target.dataset.slide);
                if (!this.transitioning) this.goToSlide(index);
            }
        });

        this.slidesWrapper.addEventListener('click', (e) => {
            const btn = e.target.closest('.audio-button');
            if (btn) {
                const slideIndex = parseInt(btn.dataset.slide);
                this.toggleAudio(slideIndex);
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (!this.showExperience || this.closingPage.classList.contains('hidden') === false) {
                const x = (window.innerWidth / 2 - e.pageX) / 30;
                const y = (window.innerHeight / 2 - e.pageY) / 30;
                document.querySelectorAll('.shape-1').forEach(s => s.style.transform = `rotate(45deg) translate(${x}px, ${y}px)`);
                document.querySelectorAll('.shape-2').forEach(s => s.style.transform = `translate(${-x * 2}px, ${-y * 2}px)`);
                document.querySelectorAll('.shape-3').forEach(s => s.style.transform = `translate(${x * 1.5}px, ${-y * 0.5}px)`);
            }
        });
    }

    startExperience() {
        const curtain = document.getElementById('transition-curtain');
        curtain.classList.add('active');
        setTimeout(() => {
            this.showExperience = true;
            this.landingPage.classList.add('hidden');
            this.experienceContainer.classList.remove('hidden');
            document.body.style.background = 'var(--black)';
            curtain.classList.remove('active');
            curtain.classList.add('up');
            this.updateActiveSlide(); // Lanza el primer audio
            setTimeout(() => curtain.classList.remove('up'), 800);
        }, 800);
    }

    resetToLanding() {
        this.showExperience = false;
        this.landingPage.classList.remove('hidden');
        this.experienceContainer.classList.add('hidden');
        this.closingPage.classList.add('hidden');
        document.body.style.background = 'var(--cream)';
        this.currentSlide = 0;
        this.stopAllAudio();
        this.updateActiveSlide();
    }

    nextSlide() {
        if (this.transitioning) return;
        if (this.currentSlide === slides.length - 1) {
            this.showClosingLanding();
            return;
        }
        this.goToSlide(this.currentSlide + 1);
    }

    showClosingLanding() {
        const curtain = document.getElementById('transition-curtain');
        curtain.classList.add('active');
        this.stopAllAudio();
        setTimeout(() => {
            this.experienceContainer.classList.add('hidden');
            this.closingPage.classList.remove('hidden');
            document.body.style.background = 'var(--cream)';
            curtain.classList.remove('active');
            curtain.classList.add('up');
            setTimeout(() => curtain.classList.remove('up'), 800);
        }, 800);
    }

    prevSlide() {
        if (this.transitioning || this.currentSlide === 0) return;
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(index) {
        if (this.transitioning) return;
        this.transitioning = true;
        this.currentSlide = index;
        this.updateActiveSlide();
        setTimeout(() => this.transitioning = false, 800);
    }

    updateActiveSlide() {
        const slidesArr = document.querySelectorAll('.slide');
        const dotsArr = document.querySelectorAll('.progress-dot');

        slidesArr.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.currentSlide);
            slide.classList.toggle('past', index < this.currentSlide);
        });

        dotsArr.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
            dot.classList.toggle('completed', index < this.currentSlide);
        });

        this.slidesWrapper.style.transform = `translateY(-${this.currentSlide * 100}vh)`;
        this.slideCounter.textContent = `${this.currentSlide + 1} / ${slides.length}`;

        this.updateButtonStates();

        // Autoplay Logic
        if (this.showExperience) {
            this.stopAllAudio();
            const currentAudio = slides[this.currentSlide].audio;
            if (currentAudio) this.playAudio(this.currentSlide);
        }
    }

    // --- FUNCIONES DE AUDIO CORREGIDAS ---
    playAudio(slideIndex) {
        this.audioPlayer.src = slides[slideIndex].audio;
        this.audioPlayer.play().then(() => {
            this.isPlaying = true;
            this.updateAudioUI(slideIndex, true);
        }).catch(e => console.log("Autoplay esperando interacción"));
    }

    toggleAudio(slideIndex) {
        if (this.isPlaying && this.currentSlide === slideIndex) {
            this.audioPlayer.pause();
            this.isPlaying = false;
            this.updateAudioUI(slideIndex, false);
        } else {
            this.playAudio(slideIndex);
        }
    }

    updateAudioUI(slideIndex, playing) {
        const btns = document.querySelectorAll('.audio-button');
        const btn = btns[slideIndex];
        if (btn) {
            btn.querySelector('.play-icon').style.display = playing ? 'none' : 'inline';
            btn.querySelector('.pause-icon').style.display = playing ? 'inline' : 'none';
        }
    }

    stopAllAudio() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.isPlaying = false;
        document.querySelectorAll('.audio-button').forEach((btn, idx) => this.updateAudioUI(idx, false));
    }

    updateButtonStates() {
        this.prevBtn.disabled = this.currentSlide === 0;
        this.nextBtn.disabled = false;
    }

    handleKeyDown(e) {
        if (!this.showExperience) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') this.nextSlide();
        else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') this.prevSlide();
    }

    handleWheel(e) {
        if (this.transitioning) return;
        if (!this.showExperience) {
            if (e.deltaY > 30) this.startExperience();
            return;
        }
        if (e.deltaY > 30) this.nextSlide();
        else if (e.deltaY < -30) this.prevSlide();
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
    }

    handleTouchEnd(e) {
        const deltaX = this.touchStartX - e.changedTouches[0].clientX;
        const deltaY = this.touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
                if (deltaY > 0) this.nextSlide(); else this.prevSlide();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new App());