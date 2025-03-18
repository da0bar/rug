const showNotification = (message, duration = 3000, style = "success") => {
    const banner = document.getElementById('notificationBanner');

    if (!banner) {
        console.error("Notification banner element not found!");
        return;
    }

    banner.className = ""; 
    banner.classList.add("show");
    banner.classList.add(style); 
    banner.querySelector("#notificationMessage").textContent = message;
    setTimeout(() => {
        banner.classList.remove('show');
    }, duration);
};
const showTransactionHash = (txHash) => {
    const txSection = document.getElementById("transactionDetails");

    if (!txSection) {
        console.error("Transaction details section not found!");
        return;
    }

    txSection.innerHTML = `Transaction Hash:
    <a href="https://sepolia.basescan.org/tx/${txHash}" target="_blank" rel="noopener noreferrer" style="color: #4caf50; text-decoration: none;">
        ${txHash}
    </a>`;
    txSection.classList.add("visible"); 
};
function showStack(message, winningNumber, hash, type) {
    const notificationContainer = document.getElementById("notificationContainer");
    const notificationCard = document.createElement("div");
    const color = type === "success" ? "#c70069" : "#4caf50";
    notificationCard.className = `notification-card ${type}`;
    notificationCard.innerHTML = `
        <div style="display: flex; width: 100%; justify-content: space-between;">
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        </div>
        <div>🤑 Winning number: <b>${winningNumber}</b></div>
        <div>⚙️ Round hash: 
            <a href="https://sepolia.basescan.org/tx/${hash}" target="_blank" rel="noopener noreferrer" style="color:${color}; text-decoration: none;">
                ${hash.slice(0, 6) + '...' + hash.slice(-4)}
            </a>
        </div>
      
    `;

    const closeButton = notificationCard.querySelector(".close-btn");
    closeButton.addEventListener("click", () => {
        closeNotification(notificationCard);
    });

    notificationContainer.appendChild(notificationCard);
}

function closeNotification(notificationCard) {
    notificationCard.style.animation = "fadeOut 0.3s ease-in-out";
    notificationCard.addEventListener("animationend", () => {
        notificationCard.remove();
    });
}
function updateWalletUI(account) {
    let text;
    account !== null ? (text = account.slice(0, 6) + '...' + account.slice(-4)) : (text = "Connect Wallet");
    connectWalletButton.innerHTML = `
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
        </div>
        <span>${text}</span>
    `;

    if (account !== null) {
        connectWalletButton.classList.add("connected");
        showNotification("Wallet connected!", 3000, "success");
    }
    else {
        connectWalletButton.classList.remove("connected");
        showNotification("Wallet disconnected", 3000, "success");
    }
  
}
async function initTimer() {    
    const getTimer = await fetch("https://gamblecigars-03493e521f39.herokuapp.com/timer");
    const timerData = await getTimer.json();
    const {start} = timerData;
    
    timerStart(start);
}
async function updateGameState(contract, account) {
    const activePlayersCount = await contract.activePlayers();
    const inGame = await contract.hasPlacedBet(account)
    player(activePlayersCount, inGame);
}

async function updateRewards(rewards, account) {
    const reward = await rewards.getRewardBalance(account);
    const gameReward = await contract.getRewardBalance(account);

    const rewardValue = parseFloat(ethers.utils.formatEther(reward)).toFixed(4);
    const gameRewardValue = parseFloat(ethers.utils.formatEther(gameReward)).toFixed(4)
    const getBalance = await contract.roundPot();
    const balance = parseFloat(ethers.utils.formatEther(getBalance)).toFixed(4)

    const rewardsInput = document.getElementById('rewardsInUsd');
    const claimInput = document.getElementById('claimInUsd');
    const potInput = document.getElementById('potInUsd');
    const usdValue = await getEthPrice()

    rewardsInput.textContent = `≈ $${(rewardValue * usdValue).toFixed(1)}`;
    claimInput.textContent = `≈ $${(gameRewardValue * usdValue).toFixed(1)}`;

    potInput.textContent = `≈ $${(balance * usdValue).toFixed(1)}`;


   rewardValue && (document.getElementById('currency1').style.display = 'block')
   reward && (document.getElementById('currency2').style.display = 'block')
   balance && (document.getElementById('currency3').style.display = 'block')
    document.getElementById("pot").textContent = balance;

    document.getElementById("pot").textContent = balance;

    document.getElementById("userTokens").textContent = rewardValue;
    document.getElementById("claimRewards").disabled = reward.lte(0);

    document.getElementById("gameRewardz").textContent = gameRewardValue;
    document.getElementById("withdraw").disabled = gameReward.lte(0);

}

async function handleRoundEnded(contract, winners, account, playerInGame, winningNumber, hash) {
    // document.getElementById("random-path-container").style.display = "none";
    // document.body.style.backgroundRepeat = "repeat";
    // document.body.style.backgroundSize = "auto";
    const number1 = document.getElementById('falling-number1');
    const number2 = document.getElementById('falling-number2');

    await updateGameState(contract, account);
    await updateRewards(rewards, account);
    initTimer();
    if(!playerInGame) return;

    const isWinner = winners.includes(ethers.utils.getAddress(account));
    const winningNum = winningNumber.toString();
    showStack(
        isWinner ? "🫦 You won, ginormous CHAD" : "🤡 You lost. Because you are a cuck",
        winningNumber,
        hash,
        isWinner ? "success" : "error"
    );
    number1.style.background ='#49be78'
    number2.style.background ='#49be78'

    if (winningNum.length === 1) {
        number1.textContent = "0"; // Show 0 in the first slot
        number2.textContent = winningNum; // Show the single digit in the second slot
    } else {
        number1.textContent = winningNum.charAt(0); // First digit
        number2.textContent = winningNum.charAt(1); // Second digit
    }
    if(isWinner){
         number1.style.background ='#49be78'
        number2.style.background ='#49be78'
    }else{
        number1.style.background ='#d73030'
        number2.style.background ='#d73030'
    }
   
    triggerConfetti(number1);
    triggerConfetti(number2);
    //document.body.style.backgroundImage = `url('resources/img/${isWinner ? "gigachad" : "cuck"}.gif')`;

    setTimeout(() => {
        // document.body.style.background = "";

        document.getElementById("random-path-container").style.display = "block";
        number1.style.top = "-170px"
         number2.style.top = "-170px"
    }, 8000);

    document.getElementById("betValue").value = "";
    document.getElementById("betAmount").value = "";
    playerInGame = false;
}
async function getEthPrice(ethAmount) {
    try {
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      let usdValue
      const data = await response.json();
      ethAmount ? usdValue = ethAmount * data.ethereum.usd : usdValue = data.ethereum.usd

      return usdValue.toFixed(1);
    } catch (error) {
      console.error('Error fetching ETH price:', error);
    }
  }
const betInput = document.getElementById('betAmount');

betInput.addEventListener('input', async() => {
    const betAmountInUsd = document.getElementById('betAmountInUsd');
    const usdValue = await getEthPrice(parseFloat(betInput.value))
    betAmountInUsd.textContent = `≈ $${usdValue}`;
});
function checkWalletConnection() {
    if (!signer || !contract) {
        showNotification("Connect your wallet first, cuck.", 3000, "error");
        return false;
    }
    return true;
}
function triggerConfetti(element) {
    const rect = element.getBoundingClientRect(); 
    confetti({
        particleCount: 100, 
        spread: 60, 
        startVelocity: 30, 
        origin: {
            x: (rect.left + rect.width / 2) / window.innerWidth,
            y: (rect.top + rect.height / 2) / window.innerHeight, 
        }
    });
}