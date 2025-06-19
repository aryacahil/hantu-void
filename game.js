// Mengambil elemen dari HTML
const storyTextElement = document.getElementById('story-text');
const choicesContainerElement = document.getElementById('choices-container');
const imageElement = document.getElementById('scene-image');
const gameContainer = document.getElementById('game-container'); // Ambil game-container
const backgroundMusic = document.getElementById('background-music');

let musicStarted = false;
let typeInterval;

// Definisikan alur cerita
const storyNodes = [
    { id: 1, text: 'Anda terbangun di sebuah ruangan yang gelap dan lembap. Bau anyir menusuk hidung. Di depan Anda berdiri sebuah pintu kayu tua yang tampak rapuh. Dari baliknya terdengar bisikan-bisikan lirih.', image: 'images/door.jpg', options: [{ text: 'Mencoba membuka pintu.', nextText: 2 }, { text: 'Mencari jalan lain di sekitar ruangan.', nextText: 3 }] },
    { id: 2, text: 'ANDA TIDAK SEHARUSNYA MEMBUKA PINTU ITU!', image: 'images/jumpscare.jpg', soundEffect: 'jumpscare-sound', isJumpscare: true, options: [{ text: 'GAME OVER. Coba lagi?', nextText: 1 }] },
    { id: 3, text: 'Anda meraba-raba dinding yang dingin dan berlumut. Tangan Anda menemukan sebuah benda logam kecil di lantai. Itu adalah sebuah kunci tua.', image: 'images/key.jpg', options: [{ text: 'Menggunakan kunci untuk membuka pintu.', nextText: 4 }, { text: 'Tetap mencari, mengabaikan kunci itu.', nextText: 5 }] },
    { id: 4, text: 'Dengan tangan gemetar, Anda memasukkan kunci ke lubang pintu. Terdengar bunyi "klik". Pintu terbuka sedikit, memperlihatkan lorong panjang yang remang-remang. Anda berhasil keluar dari ruangan. Namun, petualangan mengerikan Anda sepertinya baru saja dimulai...', image: 'images/hallway.jpg', options: [{ text: 'Selamat! (Untuk sekarang). Main lagi?', nextText: 1 }] },
    { id: 5, text: 'Anda mengabaikan kunci itu dan terus meraba-raba dalam kegelapan. Tiba-tiba, lantai di bawah Anda runtuh! Anda jatuh ke dalam kehampaan tak berujung.', image: '', options: [{ text: 'GAME OVER. Coba lagi?', nextText: 1 }] }
];

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
    }, 10);
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

    // Hapus efek jumpscare dari node sebelumnya
    gameContainer.classList.remove('jumpscare-active');
    imageElement.classList.remove('jumpscare-glitch');
    
    // Tampilkan gambar
    if (storyNode.image) {
        imageElement.src = storyNode.image;
        imageElement.style.display = 'block';
    } else {
        imageElement.style.display = 'none';
    }

    // Cek apakah ini adalah adegan JUMPSCARE
    if (storyNode.isJumpscare) {
        // Hentikan pengetikan teks untuk efek kejut
        clearInterval(typeInterval);
        
        // Tampilkan teks jumpscare secara instan dan dengan huruf besar
        storyTextElement.innerHTML = storyNode.text;
        
        // Sembunyikan pilihan untuk sesaat agar fokus pada jumpscare
        choicesContainerElement.innerHTML = '';

        // Mainkan efek suara
        if (storyNode.soundEffect) {
            const sound = document.getElementById(storyNode.soundEffect);
            if (sound) {
                sound.currentTime = 0;
                sound.play();
            }
        }

        // Terapkan efek guncangan dan glitch
        gameContainer.classList.add('jumpscare-active');
        imageElement.classList.add('jumpscare-glitch');

        // Tampilkan tombol pilihan setelah beberapa saat untuk memberi waktu pada efek
        setTimeout(() => {
            showChoices(storyNode.options);
        }, 1500); // Tunda pilihan selama 1.5 detik

    } else {
        // Jika bukan jumpscare, jalankan alur normal dengan efek mengetik
        typewriterEffect(storyNode.text, storyNode.options);
    }
}

function selectOption(option) {
    if (!musicStarted) {
        backgroundMusic.play();
        musicStarted = true;
    }
    
    showStoryNode(option.nextText);
}

// Memulai permainan
showStoryNode(1);