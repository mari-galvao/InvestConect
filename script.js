
  // Dados armazenados localmente
const users = [];
const visualizacoes = [];
let chatData = null; // { empresa, investidor, messages: [] }

// Elementos
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
  empresa: document.getElementById("nav-empresa"),
  chat: document.getElementById("nav-chat"),
};

const btnComecar = document.getElementById("btn-comecar");
const tipoSelect = document.getElementById("tipo");
const investidorFields = document.getElementById("investidor-fields");
const empresaFields = document.getElementById("empresa-fields");
const formCadastro = document.getElementById("form-cadastro");

const listaEmpresas = document.getElementById("lista-empresas");
const listaInvestidores = document.getElementById("lista-investidores");
const listaVisualizacoes = document.getElementById("lista-visualizacoes");

const chatWindow = document.getElementById("chat-window");
const chatInput = document.getElementById("chat-input");
const chatSend = document.getElementById("chat-send");

// Função para mostrar uma página e esconder as outras
function showPage(pageName) {
  Object.keys(pages).forEach((key) => {
    pages[key].classList.toggle("active", key === pageName);
  });
  // Mostrar ou esconder botão chat no nav
  navButtons.chat.classList.toggle("hidden", pageName !== "chat");
}

// Navegação
navButtons.home.onclick = () => showPage("home");
navButtons.cadastro.onclick = () => showPage("cadastro");
navButtons.investidor.onclick = () => {
  renderEmpresas();
  showPage("investidor");
};
navButtons.empresa.onclick = () => {
  renderInvestidores();
  renderVisualizacoes();
  showPage("empresa");
};
navButtons.chat.onclick = () => {
  if (chatData) {
    renderChat();
    showPage("chat");
  } else {
    alert("Nenhum chat ativo.");
  }
};

btnComecar.onclick = () => {
  showPage("cadastro");
};

// Alternar campos do formulário conforme tipo
tipoSelect.onchange = () => {
  if (tipoSelect.value === "investidor") {
    investidorFields.classList.remove("hidden");
    empresaFields.classList.add("hidden");
  } else {
    investidorFields.classList.add("hidden");
    empresaFields.classList.remove("hidden");
  }
  clearErrors();
};

// Limpar mensagens de erro
function clearErrors() {
  const errors = document.querySelectorAll(".error");
  errors.forEach((e) => (e.textContent = ""));
}

// Validação simples do formulário
function validateForm(data) {
  clearErrors();
  let valid = true;

  if (!data.nome.trim()) {
    document.getElementById("error-nome").textContent = "Campo obrigatório";
    valid = false;
  }
  if (!data.cpf.trim()) {
    document.getElementById("error-cpf").textContent = "Campo obrigatório";
    valid =
