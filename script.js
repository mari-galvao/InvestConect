// Dados armazenados localmente
const users = [];
const visualizacoes = [];
let chatData = null; // { empresa, investidor, messages: [] }

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
    valid = false;
  }
  if (!data.endereco.trim()) {
    document.getElementById("error-endereco").textContent = "Campo obrigatório";
    valid = false;
  }
  if (!data.docUrl.trim()) {
    document.getElementById("error-docUrl").textContent = "Campo obrigatório";
    valid = false;
  } else {
    try {
      new URL(data.docUrl);
    } catch {
      document.getElementById("error-docUrl").textContent = "URL inválida";
      valid = false;
    }
  }

  if (data.tipo === "investidor") {
    if (!data.fonteInvestimento.trim()) {
      document.getElementById("error-fonteInvestimento").textContent = "Campo obrigatório";
      valid = false;
    }
    if (!data.areasInvestimento.trim()) {
      document.getElementById("error-areasInvestimento").textContent = "Campo obrigatório";
      valid = false;
    }
  } else if (data.tipo === "empresa") {
    if (!data.descricaoProduto.trim()) {
      document.getElementById("error-descricaoProduto").textContent = "Campo obrigatório";
      valid = false;
    }
    if (!data.necessidadeInvestimento.trim()) {
      document.getElementById("error-necessidadeInvestimento").textContent = "Campo obrigatório";
      valid = false;
    }
  }

  return valid;
}

// Cadastro
formCadastro.onsubmit = (e) => {
  e.preventDefault();

  const data = {
    tipo: tipoSelect.value,
    nome: formCadastro.nome.value.trim(),
    cpf: formCadastro.cpf.value.trim(),
    endereco: formCadastro.endereco.value.trim(),
    docUrl: formCadastro.docUrl.value.trim(),
    fonteInvestimento: formCadastro.fonteInvestimento.value.trim(),
    areasInvestimento: formCadastro.areasInvestimento.value.trim(),
    descricaoProduto: formCadastro.descricaoProduto.value.trim(),
    necessidadeInvestimento: formCadastro.necessidadeInvestimento.value.trim(),
  };

  if (!validateForm(data)) return;

  users.push(data);
  alert("Cadastro realizado com sucesso!");

  // Limpar formulário
  formCadastro.reset();
  tipoSelect.value = "investidor";
  investidorFields.classList.remove("hidden");
  empresaFields.classList.add("hidden");
  clearErrors();

  // Redirecionar para página correta
  if (data.tipo === "investidor") {
    renderEmpresas();
    showPage("investidor");
  } else {
    renderInvestidores();
    renderVisualizacoes();
    showPage("empresa");
  }
};

// Renderizar lista de empresas para investidor
function renderEmpresas() {
  listaEmpresas.innerHTML = "";
  const empresas = users.filter((u) => u.tipo === "empresa");
  if (empresas.length === 0) {
    listaEmpresas.innerHTML = "<li>Nenhuma empresa cadastrada ainda.</li>";
    return;
  }
  empresas.forEach((empresa, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${empresa.nome}</strong><br/>
      <em>Descrição:</em> ${empresa.descricaoProduto}<br/>
      <em>Necessidade:</em> ${empresa.necessidadeInvestimento}<br/>
      <button data-idx="${idx}">Investir / Conversar</button>
    `;
    const btn = li.querySelector("button");
    btn.onclick = () => startChat(empresa);
    listaEmpresas.appendChild(li);
  });
}

// Renderizar lista de investidores para empresa
function renderInvestidores() {
  listaInvestidores.innerHTML = "";
  const investidores = users.filter((u) => u.tipo === "investidor");
  if (investidores.length === 0) {
    listaInvestidores.innerHTML = "<li>Nenhum investidor cadastrado ainda.</li>";
    return;
  }
  investidores.forEach((inv) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${inv.nome}</strong><br/>
      <em>Fonte do investimento:</em> ${inv.fonteInvestimento}<br/>
      <em>Áreas:</em> ${inv.areasInvestimento}
    `;
    listaInvestidores.appendChild(li);
  });
}

// Renderizar visualizações para empresa
function renderVisualizacoes() {
  listaVisualizacoes.innerHTML = "";
  if (visualizacoes.length === 0) {
    listaVisualizacoes.innerHTML = "<li>Ninguém visualizou sua ideia ainda.</li>";
    return;
  }
  visualizacoes.forEach((inv) => {
    const li = document.createElement("li");
    li.textContent = `Investidor: ${inv.nome} visualizou sua ideia.`;
    listaVisualizacoes.appendChild(li);
  });
}

// Iniciar chat entre investidor e empresa
function startChat(empresa) {
  // Pega o último investidor cadastrado
  const investidor = [...users].reverse().find((u) => u.tipo === "investidor");
  if (!investidor) {
    alert("Nenhum investidor cadastrado para iniciar chat.");
    return;
  }
  // Registrar visualização
  visualizacoes.push(investidor);

  chatData = {
    empresa,
    investidor,
    messages: [
      { from: "empresa", text: `Olá, sou ${empresa.nome}. Como posso ajudar?` },
    ],
  };
  renderChat();
  showPage("chat");
  navButtons.chat.classList.remove("hidden");
}

// Renderizar chat
function renderChat() {
  chatWindow.innerHTML = "";
  chatData.messages.forEach((msg) => {
    const div = document.createElement("div");
    div.classList.add("chat-message");
    div.classList.add(msg.from);
    div.innerHTML = `<b>${msg.from === "investidor" ? chatData.investidor.nome : chatData.empresa.nome}:</b> ${msg.text}`;
    chatWindow.appendChild(div);
  });
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Enviar mensagem no chat
chatSend.onclick = () => {
  const text = chatInput.value.trim();
  if (!text) return;
  chatData.messages.push({ from: "investidor", text });
  renderChat();
  chatInput.value = "";
};

// Inicializa mostrando home
showPage("home");
