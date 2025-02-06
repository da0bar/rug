const prefix = `resources/img/carousel/`;
const allImages = [
    `${prefix}1000031343.png`, `${prefix}1000031345.jpg`, `${prefix}1000031347.png`, `${prefix}1000031349.png`,
    `${prefix}1000031351.png`, `${prefix}1000031353.jpg`, `${prefix}1000031355.jpg`, `${prefix}1000031357.jpg`,
    `${prefix}1000031359.jpg`, `${prefix}1000031361.jpg`, `${prefix}1000031363.jpg`, `${prefix}1000031365.jpg`,
    `${prefix}1000031367.jpg`, `${prefix}1000031369.jpg`, `${prefix}1000031371.jpg`, `${prefix}1000031373.jpg`,
    `${prefix}1000031375.jpg`, `${prefix}1000031377.jpg`, `${prefix}1000031379.jpg`,
    `${prefix}1000031381.jpg`, `${prefix}1000031383.jpg`, `${prefix}1000031385.png`, `${prefix}1000031387.png`,
    `${prefix}1000031389.jpg`, `${prefix}1000031391.png`, `${prefix}1000031393.png`, `${prefix}1000031395.png`,
    `${prefix}1000031397.jpg`, `${prefix}1000031399.png`, `${prefix}1000031401.png`, `${prefix}1000031403.png`,
    `${prefix}1000031405.png`, `${prefix}1000031407.png`, `${prefix}1000031409.jpg`, `${prefix}1000031411.png`,
    `${prefix}1000031413.png`, `${prefix}1000031415.png`, `${prefix}1000031417.png`, `${prefix}1000031419.jpg`,
    `${prefix}1000031421.jpg`, `${prefix}1000031341.jpg`,  `${prefix}1000031339.jpg`, `${prefix}1000031337.jpg`, 
    `${prefix}1000031335.jpg`, `${prefix}1000031333.png`,  `${prefix}1000031331.jpg`, `${prefix}1000031325.jpg`,
    `${prefix}1000031323.jpg`, `${prefix}1000031321.jpg`,  `${prefix}1000031319.jpg`, `${prefix}1000031317.jpg`,
    `${prefix}1000031316.jpg`, `${prefix}1000031314.jpg`,  `${prefix}1000031312.jpg`, `${prefix}1000031310.png`,
    `${prefix}1000031308.jpg`, `${prefix}1000031306.jpg`,  `${prefix}1000031302.png`, `${prefix}1000031300.png`,
    `${prefix}1000031298.png`, `${prefix}1000031296.png`,  `${prefix}1000031294.png`, `${prefix}1000031292.png`,
    `${prefix}1000031290.png`, `${prefix}1000031288.jpg`,  `${prefix}1000031286.png`, `${prefix}1000031284.png`,
    `${prefix}1000031282.png`, `${prefix}1000031280.png`,  `${prefix}1000031278.jpg`, `${prefix}1000031276.jpg`,
    `${prefix}1000031274.jpg`, `${prefix}1000031272.jpg`,
  ];
  
const visibleCount = 15;
let currentIndex = 0;

const container = document.getElementById(`random-path-container`);

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
function getRandomImages(images, count) {
  const shuffled = [...images].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
function createRandomImage(imgSrc) {
  const img = document.createElement(`img`);
  img.src = imgSrc;
  img.loading = `lazy`; 
  img.classList.add(`random-image`);

  img.style.setProperty('--start-x', `${Math.random() * 70}vw`);
  img.style.setProperty('--start-y', `${Math.random() * 30}vh`);
  img.style.setProperty('--end-x', `${Math.random() * 70}vw`);
  img.style.setProperty('--end-y', `${Math.random() * 80}vh`);
  img.style.animationDuration = `${Math.floor(Math.random() * 13 + 7)}s`;
  img.style.animationDelay = `${getRandom(0, 1)}s`;
  return img;
}

function updateVisibleImages() {
  container.innerHTML = ``; 
  const nextImages = getRandomImages(allImages,  visibleCount);
  nextImages.forEach((imgSrc) => {
    container.appendChild(createRandomImage(imgSrc));
  });

}
setInterval(updateVisibleImages, 15000);
updateVisibleImages();