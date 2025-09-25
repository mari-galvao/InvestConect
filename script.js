// Dados armazenados localmente
const users = [];
const visualizacoes = [];
let chatData = null; // { empresa, investidor, messages: [] }
let tipoSelecionado = null; // Armazena o tipo escolhido na Etapa 1

// Elementos do DOM
const pages = {
  home: document.getElementById("page-home"),
  cadastro: document.getElementById("page-cadastro"),
  investidor: document.getElementById("page-investidor"),
  empresa: document.getElementById("page-empresa"),
  chat: document.getElementById("page-chat"),
};

const navButtons = {
  home: document.getElementById("nav-home"),
  cadastro: document.getElementById("nav-cadastro"),
  investidor: document.getElementById("nav-investidor"),
  empresa: document.getElementById
