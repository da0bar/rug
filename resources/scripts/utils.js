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
function showStack(message, type) {
    const notificationContainer = document.getElementById("notificationContainer");
    const notificationCard = document.createElement("div");
    notificationCard.className = `notification-card ${type}`;
    notificationCard.innerHTML = `
        <span>${message}</span>
        <button class="close-btn">&times;</button>
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
    if (account) {
    connectWalletButton.innerHTML = `
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
        </div>
        <span>${account.slice(0, 6)}...${account.slice(-4)}</span>
    `;

    connectWalletButton.classList.add("connected");

    showNotification("Wallet connected!", 3000, "success");
    } else {
    connectWalletButton.innerHTML = `
        <div>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        </div>
        <span>Connect Wallet</span>
    `;
    connectWalletButton.classList.remove("connected");

    showNotification("Wallet disconnected", 3000, "success");
    }
}
async function updateGameState(contract, forceUpdate = false) {
    const activePlayersCount = await contract.activePlayers();
    const roundStart = await contract.getRoundTime();
    
    const formattedRoundStart = ethers.BigNumber.from(roundStart).toNumber();
    console.log('formattedRoundStart', formattedRoundStart);
    player(activePlayersCount, formattedRoundStart, forceUpdate);
}

async function updateRewards(rewards, account) {
    const reward = await rewards.getRewardBalance(account);
    const gameReward = await contract.getRewardBalance(account);

    const rewardValue = parseFloat(ethers.utils.formatEther(reward)).toFixed(6);
    const gameRewardValue = parseFloat(ethers.utils.formatEther(gameReward)).toFixed(6)


    document.getElementById("userTokens").textContent = rewardValue;
    document.getElementById("claimRewards").disabled = reward.lte(0);

    document.getElementById("gameRewardz").textContent = gameRewardValue;
    document.getElementById("withdraw").disabled = gameReward.lte(0);

}

async function handleRoundEnded(contract, winners, account) {
    document.getElementById("random-path-container").style.display = "none";
    document.body.style.backgroundRepeat = "repeat";
    document.body.style.backgroundSize = "auto";

    await updateGameState(contract, true);
    await updateRewards(rewards, account);

    const isWinner = winners.includes(ethers.utils.getAddress(account));
    showStack(
        isWinner ? "🫦 You won, ginormous CHAD" : "🤡 You lost. Because you are a cuck",
        isWinner ? "success" : "error"
    );
    document.body.style.backgroundImage = `url('resources/img/${isWinner ? "gigachad" : "cuck"}.gif')`;

    setTimeout(() => {
        document.body.style.background = "";
        document.getElementById("random-path-container").style.display = "block";
    }, 10000);

    document.getElementById("betValue").value = "";
    document.getElementById("betAmount").value = "";
}
function checkWalletConnection() {
    if (!signer || !contract) {
        showNotification("Connect your wallet first, cuck.", 3000, "error");
        return false;
    }
    return true;
}