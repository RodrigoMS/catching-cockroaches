let baratas = [];
let totalBaratas = 1;
let baratasCapturadas = 0;
let tempoDeJogo = 0;
let bloqueado = false;
let novaRodada = 120;

// Contador global do tempo de jogo
setInterval(() => {
  bloqueado = true;
  tempoDeJogo += novaRodada;

  setTimeout(() => {
    bloqueado = false; // Permite criar baratas novamente após 10s
  }, 10000);
}, 120000);

function criarBarata() {
  if (bloqueado) return; // Se estiver bloqueado, não cria novas baratas.

  if (baratas.length >= 10) {
    document.body.innerHTML = `<h1 style='color: white; text-align: center; margin-top: 50vh;'>Game Over! Muitas baratas na tela.</h1>
                                   <h2 style='color: white; text-align: center;'>Baratas capturadas: ${baratasCapturadas}</h2>`;

    bloqueado = true;

    return;
  }

  let barata = document.createElement("div");
  barata.classList.add("barata");

  let lado = Math.floor(Math.random() * 4);
  switch (lado) {
    case 0:
      barata.style.left = "0px";
      barata.style.top = Math.random() * window.innerHeight + "px";
      break;
    case 1:
      barata.style.left = window.innerWidth - 200 + "px";
      barata.style.top = Math.random() * window.innerHeight + "px";
      break;
    case 2:
      barata.style.top = "0px";
      barata.style.left = Math.random() * window.innerWidth + "px";
      break;
    case 3:
      barata.style.top = window.innerHeight - 200 + "px";
      barata.style.left = Math.random() * window.innerWidth + "px";
      break;
  }

  barata.dx = Math.random() * 4 - 2;
  barata.dy = Math.random() * 4 - 2;
  barata.velocidade = Math.random() * 5 + 2;
  barata.anguloAtual = 0;
  barata.intervaloImagem = Math.max(100, 500 / barata.velocidade);

  barata.style.backgroundImage = "url('./assets/img/barata.png')";

  atualizarRotacao(barata);

  barata.addEventListener("click", () => {
    let quantidadeBaratas = document.getElementsByClassName("barata").length;

    if (quantidadeBaratas === 1 && tempoDeJogo >= novaRodada) {
      document.body.innerHTML = `<iframe src="./pages/confete.html" frameborder="0"></iframe>
                                      <div class="texto">
                                        <h1>Parabéns! Você capturou todas as baratas.</h1>
                                        <h2>Baratas capturadas: ${baratasCapturadas}</h2>
                                      </div>`;
      return;
    }

    barata.remove();
    baratas = baratas.filter((b) => b !== barata);
    baratasCapturadas++;
    atualizarContador();
    setTimeout(criarBarata, 500);
  });

  document.body.appendChild(barata);
  baratas.push(barata);

  alternarImagemBarata(barata);
}

function moverBaratas() {
  baratas.forEach((barata) => {
    let novaEsquerda =
      parseFloat(barata.style.left) + barata.dx * barata.velocidade;
    let novaTopo = parseFloat(barata.style.top) + barata.dy * barata.velocidade;

    if (novaEsquerda < 0 || novaEsquerda > window.innerWidth - 200)
      barata.dx *= -1;
    if (novaTopo < 0 || novaTopo > window.innerHeight - 200) barata.dy *= -1;

    barata.style.left =
      Math.min(window.innerWidth - 200, Math.max(0, novaEsquerda)) + "px";
    barata.style.top =
      Math.min(window.innerHeight - 200, Math.max(0, novaTopo)) + "px";

    atualizarRotacao(barata);
  });
}

function atualizarRotacao(barata) {
  let novoAngulo = Math.atan2(barata.dy, barata.dx) * (180 / Math.PI);
  let diferenca = novoAngulo - barata.anguloAtual;
  if (diferenca > 180) diferenca -= 360;
  if (diferenca < -180) diferenca += 360;

  barata.anguloAtual += diferenca * 0.5;
  barata.style.transform = `rotate(${barata.anguloAtual}deg)`;
}

function atualizarContador() {
  document.getElementById("contador").innerText =
    "Baratas capturadas: " + baratasCapturadas;
}

// Alterna a imagem da barata conforme sua velocidade
function alternarImagemBarata(barata) {
  setInterval(() => {
    barata.style.backgroundImage = barata.style.backgroundImage.includes(
      "./assets/img/barata.png"
    )
      ? "url('./assets/img/barata-2.png')"
      : "url('./assets/img/barata.png')";
  }, barata.intervaloImagem);
}

// Sistema de colisão entre baratas
function detectarColisoes() {
  baratas.forEach((barata1, index1) => {
    baratas.forEach((barata2, index2) => {
      if (index1 !== index2) {
        let x1 = parseFloat(barata1.style.left);
        let y1 = parseFloat(barata1.style.top);
        let x2 = parseFloat(barata2.style.left);
        let y2 = parseFloat(barata2.style.top);

        let distancia = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

        if (distancia < 200) {
          let angulo = Math.atan2(y2 - y1, x2 - x1);
          barata1.dx = Math.cos(angulo) * -2;
          barata1.dy = Math.sin(angulo) * -2;

          barata2.dx = Math.cos(angulo) * 2;
          barata2.dy = Math.sin(angulo) * 2;
        }
      }
    });
  });
}

setInterval(moverBaratas, 30);
setInterval(detectarColisoes, 50);

setInterval(() => {
  baratas.forEach((barata) => {
    barata.dx = Math.random() * 4 - 2;
    barata.dy = Math.random() * 4 - 2;
    atualizarRotacao(barata);
  });
}, 3000);

setInterval(() => {
  baratas.forEach((barata) => {
    barata.velocidade += 0.5;
    barata.intervaloImagem = Math.max(100, 500 / barata.velocidade);
  });
}, 10000);

setInterval(() => {
  criarBarata();
}, 20000);

criarBarata();
