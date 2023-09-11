// Definições iniciais
const inputValor = <HTMLInputElement>document.getElementById("inputValor");
inputValor.addEventListener("keydown", (event) => (event.key === "Enter" ? event.preventDefault() : ""));

type stringNumber = string | number;

// Class e tudo que da
class ContaBancaria {
  id: stringNumber;
  nome: string;
  saldo: number;
  senha: number;
  constructor(id: stringNumber, nome: string, saldo: number, senha: number) {
    this.id = id;
    this.nome = nome;
    this.saldo = saldo;
    this.senha = senha;
  }
}

class Banco {
  contasBanco: ContaBancaria[] = [];
  contaMain: ContaBancaria = this.contasBanco[0];

  addConta(id: stringNumber, nome: string, saldo: number, senha: number) {
    const addNome = <HTMLInputElement>document.getElementById("addNome");
    const addId = <HTMLInputElement>document.getElementById("addId");
    const addSenha = <HTMLInputElement>document.getElementById("addSenha");
    const addSaldo = <HTMLInputElement>document.getElementById("addSaldo");
    id = addId.value;
    nome = addNome.value;
    saldo = Number(addSaldo.value);
    senha = Number(addSenha.value);

    const existeID = this.contasBanco.find((conta) => conta.id == id);

    if (id && nome && saldo && senha && id.length < 6 && !existeID) {
      if (/^[a-zA-Z\s]+$/.test(nome)) {
        let novaConta = new ContaBancaria(id, nome, saldo, senha);
        this.contasBanco.push(novaConta);
        this.attLista();
        addId.value = "";
        addNome.value = "";
        addSaldo.value = "";
        addSenha.value = "";
        avisos("addConta-01");
      } else {
        avisos("addConta-04");
      }
    } else if (existeID) {
      avisos("addConta-02");
    } else {
      avisos("addConta-03");
    }
  }

  removerConta(id: stringNumber) {
    const indexConta = this.contasBanco.findIndex((conta) => conta.id === id);
    if (indexConta > -1) {
      this.contasBanco.splice(indexConta, 1);
      this.attLista();
    } else {
      throw "ID não encontrado";
    }
  }

  logar(id: stringNumber, senha: number) {
    const loginId = <HTMLInputElement>document.getElementById("loginId");
    const loginSenha = <HTMLInputElement>document.getElementById("loginSenha");
    id = loginId.value;
    senha = Number(loginSenha.value);

    const verificarID = bank.contasBanco.find((conta) => conta.id == id);
    if (!verificarID) {
      avisos("login-03");
      return;
    }

    bank.contasBanco.forEach((conta) => {
      if (conta.id == id) {
        if (conta.senha == senha) {
          this.contaMain = conta;
          loginId.value = "";
          loginSenha.value = "";
          avisos("login-01");
          attLogin();
        } else {
          avisos("login-02");
        }
      }
    });
  }

  attLista() {
    const ulLista = document.getElementById("listaContas");
    if (ulLista) {
      while (ulLista.firstChild) {
        ulLista.removeChild(ulLista.firstChild);
      }
      this.contasBanco.forEach((conta) => {
        const contaHtml = document.createElement("li");
        contaHtml.classList.add("li-conta");
        contaHtml.innerHTML = `
          <p>ID: ${conta.id}</p>
          <p>Nome: ${conta.nome}</p>
          <h4>Saldo: ${conta.saldo.toLocaleString("pt-br", { style: "currency", currency: "BRL" })}</h4>`;
        ulLista.appendChild(contaHtml);
      });
    }
  }
}

class Cliente extends Banco {
  sacar(valor: number) {
    valor = Number(inputValor.value);
    if (valor > 0 && valor <= bank.contaMain.saldo) {
      bank.contaMain.saldo -= valor;
      bank.attLista();
      inputValor.value = "";
      attLogin();
      avisos("operacao-01");
    } else {
      avisos("operacao-02");
    }
  }

  depositar(valor: number) {
    valor = Number(inputValor.value);
    if (valor > 0) {
      bank.contaMain.saldo += valor;
      bank.attLista();
      inputValor.value = "";
      attLogin();
      avisos("operacao-01");
    } else {
      avisos("operacao-03");
    }
  }

  transferir(valor: number, destinatarioID: stringNumber) {
    const inputID = <HTMLInputElement>document.getElementById("transferirID");
    valor = Number(inputValor.value);
    destinatarioID = inputID.value;
    if (valor > 0) {
      const destinatario = bank.contasBanco.find((conta) => conta.id == destinatarioID);
      if (destinatario) {
        if (bank.contaMain.saldo >= valor) {
          bank.contaMain.saldo -= valor;
          destinatario.saldo += valor;
          bank.attLista();
          inputValor.value = "";
          inputID.value = "";
          attLogin();
          avisos("operacao-01");
        } else {
          avisos("operacao-02");
        }
      } else {
        avisos("operacao-04");
      }
    } else {
      avisos("operacao-03");
    }
  }
}

const bank = new Banco();

const conta01 = new ContaBancaria(222, "Lucas Ambrosio", 6000, 1234);
const conta02 = new ContaBancaria(120, "Gabriele Santos", 12000, 1234);
const cliente = new Cliente();

bank.contasBanco.push(conta01, conta02);
bank.attLista();

// Funções interação DOM

function attLogin() {
  const saudacao = <HTMLInputElement>document.getElementById("conta-ola");
  const saldo = <HTMLInputElement>document.getElementById("conta-saldo");
  let saldoconta = Number(bank.contaMain.saldo);
  saldo.innerHTML = saldoconta.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
  saudacao.innerHTML = bank.contaMain.nome;
}

function avisos(tipo: string) {
  const formLogin = document.getElementById("formLogin");
  const box01 = document.getElementById("box-01");
  const box02 = document.getElementById("box-02");
  const element = document.createElement("span");

  switch (tipo) {
    case "login-01":
      element.innerText = "Login realizado com sucesso!";
      element.classList.add("verde01");
      formLogin?.appendChild(element);
      setTimeout(() => formLogin?.removeChild(element), 2000);
      break;
    case "login-02":
      element.innerText = "Senha incorreta!";
      element.classList.add("vermelho01");
      formLogin?.appendChild(element);
      setTimeout(() => formLogin?.removeChild(element), 2000);
      break;
    case "login-03":
      element.innerText = "ID não cadastrado.";
      element.classList.add("vermelho01");
      formLogin?.appendChild(element);
      setTimeout(() => formLogin?.removeChild(element), 2000);
      break;
    case "operacao-01":
      element.innerText = "Operação realizada com sucesso!";
      element.classList.add("verde02");
      element.classList.add("aviso");
      box01?.appendChild(element);
      setTimeout(() => box01?.removeChild(element), 2000);
      break;
    case "operacao-02":
      element.innerText = "Saldo insuficiente!";
      element.classList.add("vermelho01");
      element.classList.add("aviso");
      box01?.appendChild(element);
      setTimeout(() => box01?.removeChild(element), 2000);
      break;
    case "operacao-03":
      element.innerText = "Valor inválido.";
      element.classList.add("vermelho01");
      element.classList.add("aviso");
      box01?.appendChild(element);
      setTimeout(() => box01?.removeChild(element), 2000);
      break;
    case "operacao-04":
      element.innerText = "Destinatário não encontrado.";
      element.classList.add("vermelho01");
      element.classList.add("aviso");
      box01?.appendChild(element);
      setTimeout(() => box01?.removeChild(element), 2000);
      break;
    case "addConta-01":
      element.innerText = "Conta criada com sucesso!";
      element.classList.add("verde01");
      element.classList.add("aviso");
      box02?.appendChild(element);
      setTimeout(() => box02?.removeChild(element), 2000);
      break;
    case "addConta-02":
      element.innerText = "Esse ID ja está em uso. escolha outra combinação de números.";
      element.classList.add("vermelho01");
      element.classList.add("aviso");
      box02?.appendChild(element);
      setTimeout(() => box02?.removeChild(element), 2000);
      break;
    case "addConta-03":
      element.innerText = "Preencha todos os dados corretamente como descrito!";
      element.classList.add("vermelho01");
      element.classList.add("aviso");
      box02?.appendChild(element);
      setTimeout(() => box02?.removeChild(element), 2000);
      break;
    case "addConta-04":
      element.innerText = "Nome deve conter apenas letras.";
      element.classList.add("vermelho01");
      element.classList.add("aviso");
      box02?.appendChild(element);
      setTimeout(() => box02?.removeChild(element), 2000);
      break;
  }
}
