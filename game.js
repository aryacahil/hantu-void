// Mengambil elemen dari HTML
const storyTextElement = document.getElementById('story-text');
const choicesContainerElement = document.getElementById('choices-container');
const imageElement = document.getElementById('scene-image');
const gameContainer = document.getElementById('game-container');
const backgroundMusic = document.getElementById('background-music');

// Elemen baru untuk layar pembuka
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');

let typeInterval; // Variabel untuk menyimpan interval efek mengetik

// Definisikan alur cerita (tetap sama)
const storyNodes = [
    { id: 1, text: 'Anda terbangun di sebuah ruangan yang gelap dan lembap. Bau anyir menusuk hidung. Di depan Anda berdiri sebuah pintu kayu tua yang tampak rapuh. Dari baliknya terdengar bisikan-bisikan lirih.', image: 'images/door.jpg', options: [{ text: 'Mencoba membuka pintu.', nextText: 2 }, { text: 'Mencari jalan lain di sekitar ruangan.', nextText: 3 }] },
    { id: 2, text: 'ANDA TIDAK SEHARUSNYA MEMBUKA PINTU ITU!', image: 'images/jumpscare.jpg', soundEffect: 'jumpscare-sound', isJumpscare: true, options: [{ text: 'GAME OVER. Coba lagi?', nextText: 1 }] },
    { id: 3, text: 'Anda meraba-raba dinding yang dingin dan berlumut. Tangan Anda menemukan sebuah benda logam kecil di lantai. Itu adalah sebuah kunci tua.', image: 'images/key.jpg', options: [{ text: 'Menggunakan kunci untuk membuka pintu.', nextText: 4 }, { text: 'Tetap mencari, mengabaikan kunci itu.', nextText: 5 }] },
    { id: 4, text: 'Dengan tangan gemetar, Anda memasukkan kunci ke lubang pintu. Terdengar bunyi "klik". Pintu terbuka sedikit, memperlihatkan lorong panjang yang remang-remang. Anda berhasil keluar dari ruangan. Namun, petualangan mengerikan Anda sepertinya baru saja dimulai...', image: 'images/hallway.jpg', options: [{ text: 'Selamat! (Untuk sekarang). Main lagi?', nextText: 1 }] },
    { id: 5, text: 'Anda mengabaikan kunci itu dan terus meraba-raba dalam kegelapan. Tiba-tiba, lantai di bawah Anda runtuh! Anda jatuh ke dalam kehampaan tak berujung.', image: '', options: [{ text: 'GAME OVER. Coba lagi?', nextText: 1 }] }
];

// FUNGSI UNTUK MEMULAI GAME
function startGame() {
    // Sembunyikan layar pembuka
    startScreen.classList.add('hidden');
    // Tampilkan kontainer game
    gameContainer.classList.remove('hidden');

    // Putar musik latar
    backgroundMusic.play();

    // Tampilkan cerita pertama
    showStoryNode(1);
}

// Tambahkan event listener ke tombol start
startButton.addEventListener('click', startGame);


// --- FUNGSI-FUNGSI LAINNYA TETAP SAMA, NAMUN ADA SEDIKIT PENYESUAIAN ---

function typewriterEffect(text, options) {
    let i = 0;
    storyTextElement.innerHTML = '';
    choicesContainerElement.innerHTML = ''; 

    clearInterval(typeInterval);

    typeInterval = setInterval(() => {
        if (i < text.length) {
            storyTextElement.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
            showChoices(options);
        }
    }, 50);
}

function showChoices(options) {
    options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option.text;
        button.addEventListener('click', () => selectOption(option));
        choicesContainerElement.appendChild(button);
    });
}

function showStoryNode(storyNodeId) {
    const storyNode = storyNodes.find(node => node.id === storyNodeId);

    gameContainer.classList.remove('jumpscare-active');
    imageElement.classList.remove('jumpscare-glitch');
    
    if (storyNode.image) {
        imageElement.src = storyNode.image;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none';
    }

    if (storyNode.isJumpscare) {
        clearInterval(typeInterval);
        storyTextElement.innerHTML = storyNode.text;
        choicesContainerElement.innerHTML = '';

        if (storyNode.soundEffect) {
            const sound = document.getElementById(storyNode.soundEffect);
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }
        }

        gameContainer.classList.add('jumpscare-active');
        imageElement.classList.add('jumpscare-glitch');

        setTimeout(() => {
            showChoices(storyNode.options);
        }, 1500);

    } else {
        typewriterEffect(storyNode.text, storyNode.options);
    }
}

// Fungsi selectOption sekarang lebih sederhana
function selectOption(option) {
    showStoryNode(option.nextText);
}

// TIDAK ADA LAGI FUNGSI YANG DIPANGGIL OTOMATIS DI SINI
// PERMAINAN DIMULAI OLEH TOMBOL START