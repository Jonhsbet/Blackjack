let saldo = 1000.00;
let aposta = 0;
let deck = [];
let playerHand = [];
let dealerHand = [];

function atualizarSaldo() {
    document.getElementById("saldo").textContent = saldo.toFixed(2);
}

function gerarDeck() {
    const tipos = ['♠', '♥', '♦', '♣'];
    const valores = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];

    for (let tipo of tipos) {
        for (let valor of valores) {
            deck.push({ valor, tipo });
        }
    }

    deck = deck.sort(() => Math.random() - 0.5); // Embaralha o deck
}

function calcularPontuacao(mao) {
    let pontuacao = 0;
    let ases = 0;

    for (let carta of mao) {
        if (carta.valor === 'A') {
            pontuacao += 11;
            ases += 1;
        } else if (['K', 'Q', 'J'].includes(carta.valor)) {
            pontuacao += 10;
        } else {
            pontuacao += parseInt(carta.valor);
        }
    }

    while (pontuacao > 21 && ases > 0) {
        pontuacao -= 10;
        ases -= 1;
    }

    return pontuacao;
}

function distribuirCarta(mao) {
    const carta = deck.pop();
    mao.push(carta);
    return carta;
}

function exibirCartas() {
    document.getElementById('player-hand').innerHTML = playerHand.map(carta => `<div class="card">${carta.valor}${carta.tipo}</div>`).join('');
    document.getElementById('dealer-hand').innerHTML = dealerHand.map(carta => `<div class="card">${carta.valor}${carta.tipo}</div>`).join('');
}

function verificarResultado() {
    const playerScore = calcularPontuacao(playerHand);
    const dealerScore = calcularPontuacao(dealerHand);

    if (playerScore > 21) {
        saldo -= aposta;
        document.getElementById("mensagem").textContent = `Você perdeu R$${aposta.toFixed(2)}.`;
    } else if (dealerScore > 21 || playerScore > dealerScore) {
        saldo += aposta;
        document.getElementById("mensagem").textContent = `Você ganhou R$${(aposta * 2).toFixed(2)}!`;
    } else if (playerScore === dealerScore) {
        document.getElementById("mensagem").textContent = "Empate!";
    } else {
        saldo -= aposta;
        document.getElementById("mensagem").textContent = `Você perdeu R$${aposta.toFixed(2)}.`;
    }

    atualizarSaldo();
}

function jogar() {
    aposta = parseFloat(document.getElementById("aposta").value);

    if (isNaN(aposta) || aposta <= 0 || aposta > saldo) {
        alert("Insira um valor de aposta válido.");
        return;
    }

    document.getElementById("mensagem").textContent = "";
    gerarDeck();
    playerHand = [distribuirCarta([]), distribuirCarta([])];
    dealerHand = [distribuirCarta([]), distribuirCarta([])];
    exibirCartas();

    if (calcularPontuacao(playerHand) === 21) {
        document.getElementById("mensagem").textContent = "Blackjack! Você ganhou!";
        saldo += aposta * 1.5;
        atualizarSaldo();
    }
}

function hit() {
    if (calcularPontuacao(playerHand) < 21) {
        distribuirCarta(playerHand);
        exibirCartas();

        if (calcularPontuacao(playerHand) > 21) {
            document.getElementById("mensagem").textContent = "Você estourou! Perdeu.";
            saldo -= aposta;
            atualizarSaldo();
        }
    }
}

function stand() {
    while (calcularPontuacao(dealerHand) < 17) {
        distribuirCarta(dealerHand);
    }

    exibirCartas();
    verificarResultado();
}

atualizarSaldo();

// Função para expandir ou colapsar a seção de ajuda
function toggleFaq() {
    const faqContent = document.getElementById("faq-content");
    faqContent.style.display = faqContent.style.display === "none" || faqContent.style.display === "" ? "block" : "none";
}

// Inicializar o FAQ como oculto ao carregar a página
window.onload = () => {
    document.getElementById("faq-content").style.display = "none";
};

