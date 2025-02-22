let countdownInterval; 
const ROUND_DURATION = 90; 
const timer = {
    interval: null,
    start(roundStart) {
        if (this.interval) clearInterval(this.interval);
        if (roundStart === 0) return;

        const updateTimer = () => {
            
            const currentTime = Math.floor(Date.now() / 1000);
            const elapsedTime = currentTime - roundStart;
            const timeLeft = ROUND_DURATION - elapsedTime;


            const playerLight = document.getElementById("player-light");
            const status = document.getElementById("status");

            document.getElementById('remaining-time').innerHTML = timeLeft >= 0 ? formatTime(timeLeft) : "00:00";
            const player = document.getElementById('player-count');
            const playerCount = parseInt(player.innerHTML);
            if (timeLeft < 0){ 
                playerLight.style.backgroundColor = "yellow";
                status.textContent = "Calling smart contract...";
                clearInterval(this.interval); // Stop the timer first

                if (playerCount < 1) {  
                    handleNoPlayers();
                }
            }
        };

        updateTimer();
        this.interval = setInterval(updateTimer, 1000);
    },
    stop() {
        clearInterval(this.interval);
    }
};
function timerStart(roundStart) {
    timer.start(Math.floor(roundStart/1000));
}
function player(activePlayerCount) {
    const playerCount = document.getElementById('player-count');
    const playerLight = document.getElementById('player-light');
    const isActive = activePlayerCount > 0;
    const status = document.getElementById("status");
    
    playerCount.innerHTML = activePlayerCount;
    status.textContent = isActive ? "Active" : "Inactive";
    playerLight.style.backgroundColor = isActive ? "green" : "red";
    playerLight.style.boxShadow = isActive ? "0 0 10px rgba(0, 255, 0, 0.8)" : "0 0 10px rgba(255, 0, 0, 0.8)";
}
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}
function handleNoPlayers() {
    updateStatus("No player this round", 2000, () => {
        updateStatus("Waiting for next round...", 2000, () => {
            initTimer();
            player(0);
        });
    });
}

function updateStatus(message, delay, callback) {
    setTimeout(() => {
        const status = document.getElementById("status");
        status.textContent = message;
        if (callback) callback();   
    }, delay);
}
document.getElementById('title').addEventListener('click', () => {
    const rect = document.getElementById('title').getBoundingClientRect();
    const trumpCountElem = document.getElementById('trumpCount');
    const trumpCount = parseInt(trumpCountElem.innerHTML)
    if(trumpCount === 0) playSound('resources/audio/trump1.mp3');
    
    document.getElementById('subtitle').style.display = 'block';
    
    let count = trumpCount + 1;
    trumpCountElem.innerHTML = count;
    if (count >= 100  && count < 500) {
        createPoppingImage(rect, 'resources/img/tromp.png');  
        createPoppingImage(rect, 'resources/img/muskrat.png'); 
    } else if(count >= 500  && count < 1000){
        createPoppingImage(rect, 'resources/img/tromp.png'); 
        createPoppingImage(rect, 'resources/img/muskrat.png'); 
        createPoppingImage(rect, 'resources/img/tromp2.png');
    }
    else if(count >= 1000){
        createPoppingImage(rect, 'resources/img/tromp.png'); 
        createPoppingImage(rect, 'resources/img/muskrat.png'); 
        createPoppingImage(rect, 'resources/img/tromp2.png');
        createPoppingImage(rect, 'resources/img/muskrat2.png');
    }
    else {
        createPoppingImage(rect, 'resources/img/tromp.png'); 
    }
    if (count >= 1000) document.getElementById('title').classList.add('celebrate');
    if (count === 100) {
        smallCelebration();
    } else if (count === 500) {
        bigParty();
    } else if (count === 1000) {
        crazyEvent();
    }
});
function createPoppingImage(rect, imageSrc) {
    const imageContainer = document.querySelector('.container');
    const img = document.createElement('img');
    img.src = imageSrc;
    img.classList.add('fountain-image');

    const [randomX, randomY, randomRotation] = [
        Math.random() * 400 - 200,
        Math.random() * -300 - 50,
        Math.random() * 360 - 180
    ];

    img.style.left = `${rect.left + rect.width / 2}px`;
    img.style.top = `${rect.top-30}px`;

    img.style.setProperty('--randomX', `${randomX}px`);
    img.style.setProperty('--randomY', `${randomY}px`);
    img.style.setProperty('--randomRotation', `${randomRotation}deg`);

    imageContainer.appendChild(img);

    setTimeout(() => {
        img.remove();
    }, 2000);
}
function smallCelebration() {
    document.getElementById('title').classList.add('celebrate');
    playSound('resources/audio/trump2.mp3');
    createConfetti();

    setTimeout(() => {
        document.getElementById('title').classList.remove('celebrate');
    }, 8000);
}

function bigParty() {
    document.body.classList.add('flash-screen');
    document.body.classList.add('shake1');
    playSound('resources/audio/trump3.mp3');
    createConfetti(200); // More confetti
    setTimeout(() => {
        document.body.classList.remove('shake1');
        document.body.classList.remove('flash-screen');
    }, 15000);
}

function crazyEvent() {
    document.body.classList.add('crazy-bg');
    document.body.classList.add('shake2');
    playSound('resources/audio/trump4.mp3');
    createConfetti(500); 

    setTimeout(() => {
        document.body.classList.remove('crazy-bg');
        document.body.classList.remove('shake2');
    }, 15000);
}

function playSound(src) {
    const audio = new Audio(src);
    audio.play();
}

function createConfetti(amount = 50) {
    for (let i = 0; i < amount; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 8000);
    }
}
function getRandomColor() {
    const colors = ['#ff0000', '#ff9900', '#33cc33', '#3399ff', '#9900cc', '#ff3399'];
    return colors[Math.floor(Math.random() * colors.length)];
}
function triggerRugged() {
    const container = document.getElementById("container");
    const pathContainer = document.getElementById("random-path-container");
    const textOverlay = document.getElementById("textOverlay");

    container.style.display = "none";
    pathContainer.style.display = "none";
    textOverlay.style.display = "block";
    textOverlay.style.opacity = "1";
    document.body.style.backgroundImage = "url('resources/img/47d5d52b84ca2117c336ab3de3978b3a.gif')";
    document.body.style.backgroundRepeat = "repeat";
    document.body.style.backgroundSize = "auto";
 

    setTimeout(() => {
        container.style.display = "block";
        pathContainer.style.display = "block";
        textOverlay.style.display = "none";
        textOverlay.style.opacity = "0";
        document.body.style.backgroundImage = "url('resources/img/rug_bg.jpg')";
       
        showNotification("Sweating much?!", 5000, "success");
    }, 5000);
}
document.addEventListener("DOMContentLoaded", function() {
    const backgrounds = [
        'resources/img/rug_bg.jpg',
        'resources/img/rug_bg3.jpg',
    ];
    
    document.body.style.backgroundImage = `url(${backgrounds[Math.floor(Math.random() * backgrounds.length)]})`;
    const quickBetButtons = document.querySelectorAll(".quick-bet-btn");
    const betAmountInput = document.getElementById("betAmount");
   

    quickBetButtons.forEach(button => {
        button.addEventListener("click", async function() {
          
            const betAmountInUsd = document.getElementById('betAmountInUsd');
          
            betAmountInput.value = this.getAttribute("data-value");
            const usdValue = await getEthPrice(parseFloat(betAmountInput.value))
            betAmountInUsd.textContent = `≈ $${usdValue}`;
        });
    });
});
