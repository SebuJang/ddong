const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let imagesLoaded = 0;

function imageLoaded() {
	imagesLoaded++;

	// 모든 이미지가 로드되면 게임 시작
	if (imagesLoaded == 4) {
		// startGame();
	}
}

const heartImage = new Image();
const poopImage = new Image();
const rabbitImage = new Image();
const princessImage = new Image();

heartImage.onload = imageLoaded;
poopImage.onload = imageLoaded;
rabbitImage.onload = imageLoaded;
princessImage.onload = imageLoaded;

heartImage.src = 'heart.png';
poopImage.src = 'ddong.png';
rabbitImage.src = 'rabbit.png';
princessImage.src = 'princess.png'; // 공주 이미지 파일 경로

let hearts = [];
let poops = [];
let rabbit = { x: canvas.width / 2, y: canvas.height - 50, size: 50, speed: 10, life: 3, score: 0 };
let speed = 2;

function createHeart() {
	const x = Math.random() * canvas.width;
	hearts.push({ x: x, y: 0, size: 20 });
}

function createPoop() {
	const x = Math.random() * canvas.width;
	poops.push({ x: x, y: 0, size: 20 });
}

function moveItems() {
	for (let heart of hearts) {
		heart.y += speed;
	}

	for (let poop of poops) {
		poop.y += speed;
	}

	hearts = hearts.filter(heart => heart.y < canvas.height);
	poops = poops.filter(poop => poop.y < canvas.height);
}

function checkCollision() {
	for (let i = hearts.length - 1; i >= 0; i--) {
		if (hearts[i].x < rabbit.x + rabbit.size &&
			hearts[i].x + hearts[i].size > rabbit.x &&
			hearts[i].y < rabbit.y + rabbit.size &&
			hearts[i].y + hearts[i].size > rabbit.y) {

			rabbit.score += 10;
			if (rabbit.score % 100 === 0) {
				speed += 0.5;
			}
			hearts.splice(i, 1);
		}
	}

	for (let i = poops.length - 1; i >= 0; i--) {
		if (poops[i].x < rabbit.x + rabbit.size &&
			poops[i].x + poops[i].size > rabbit.x &&
			poops[i].y < rabbit.y + rabbit.size &&
			poops[i].y + poops[i].size > rabbit.y) {

			rabbit.life--;
			if (rabbit.life <= 0) {
				gameOver();
				return;
			}
			poops.splice(i, 1);
		}
	}
}

function gameOver() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillText("게임 종료! 최종 점수: " + rabbit.score, canvas.width / 2 - 100, canvas.height / 2);
	document.removeEventListener('keydown', moveRabbit);
	cancelAnimationFrame(animate);
}

function moveRabbit(event) {
	switch (event.keyCode) {
		case 37: // Left arrow key
			rabbit.x -= rabbit.speed;
			break;
		case 39: // Right arrow key
			rabbit.x += rabbit.speed;
			break;
	}
}

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(rabbitImage, rabbit.x, rabbit.y, rabbit.size, rabbit.size);

	for (let heart of hearts) {
		ctx.drawImage(heartImage, heart.x, heart.y, heart.size, heart.size);
	}

	for (let poop of poops) {
		ctx.drawImage(poopImage, poop.x, poop.y, poop.size, poop.size);
	}

	ctx.fillStyle = 'black';
	ctx.fillText("점수: " + rabbit.score, 10, 10);
	ctx.fillText("생명: " + rabbit.life, 10, 30);
}

let isPaused = false;

document.getElementById('pauseButton').addEventListener('click', function () {
	isPaused = !isPaused; // 일시정지 상태를 토글

	if (isPaused) {
		this.textContent = '계속하기'; // 버튼 텍스트를 "계속하기"로 변경
	} else {
		this.textContent = '일시정지'; // 버튼 텍스트를 "일시정지"로 변경
		animate(); // 게임 애니메이션 재시작
	}
});

function animate() {
	if (isPaused) return; // 일시정지 상태일 경우 애니메이션 중지

	moveItems();
	checkCollision();
	draw();

	if (Math.random() < 0.02) createHeart();
	if (Math.random() < 0.02) createPoop();

	requestAnimationFrame(animate);
}

document.addEventListener('keydown', moveRabbit);
//animate();

function startGame(character) {
	document.getElementById('characterSelection').style.display = 'none';
	document.getElementById('gameCanvas').style.display = 'block';
	document.getElementById('pauseButton').style.display = 'block';

	if (character === 'rabbit') {
		rabbitImage.src = 'rabbit.png';
	} else if (character === 'princess') {
		rabbitImage.src = 'princess.png'; // 공주 캐릭터를 사용할 경우 이미지를 변경
	}

	animate();
}