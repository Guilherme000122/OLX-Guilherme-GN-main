// BOTÃO DE ABRIR LOGIN

const botaoLogin = document.getElementById("botaoLogin");

const modalLogin = document.getElementById("modalLogin");

const fechar = document.getElementById("fechar");


// Abrir janela

botaoLogin.addEventListener("click", function () {

    modalLogin.style.display = "flex";

});


// Fechar janela

fechar.addEventListener("click", function () {

    modalLogin.style.display = "none";

});


// Fechar clicando fora

modalLogin.addEventListener("click", function (event) {

    if (event.target === modalLogin) {

        modalLogin.style.display = "none";

    }

});


// ÁREAS

const areaLogin = document.getElementById("areaLogin");

const areaCadastro = document.getElementById("areaCadastro");


// Ir para cadastro

document.getElementById("irCadastro").addEventListener("click", function (event) {

    event.preventDefault();

    areaLogin.style.display = "none";

    areaCadastro.style.display = "block";

});


// Voltar para login

document.getElementById("irLogin").addEventListener("click", function (event) {

    event.preventDefault();

    areaCadastro.style.display = "none";

    areaLogin.style.display = "block";

});


// CADASTRAR

document.getElementById("cadastrar").addEventListener("click", function () {

    const nome = document.getElementById("nomeCadastro").value.trim();

    const email = document.getElementById("emailCadastro").value.trim().toLowerCase();

    const senha = document.getElementById("senhaCadastro").value;

    const confirmarSenha = document.getElementById("confirmarSenha").value;

    const mensagem = document.getElementById("mensagemCadastro");


    // Verificar campos

    if (nome === "" || email === "" || senha === "") {

        mensagem.textContent = "Preencha todos os campos.";

        mensagem.style.color = "red";

        return;
    }


    // Conferir senha

    if (senha !== confirmarSenha) {

        mensagem.textContent = "As senhas não são iguais.";

        mensagem.style.color = "red";

        return;
    }


    // Verificar se já existe

    const usuarioExistente = localStorage.getItem("usuario_" + email);


    if (usuarioExistente) {

        mensagem.textContent = "Esse e-mail já está cadastrado.";

        mensagem.style.color = "red";

        return;
    }


    // Criar usuário

    const usuario = {

        nome: nome,

        email: email,

        senha: senha

    };


    // Salvar

    localStorage.setItem(
        "usuario_" + email,
        JSON.stringify(usuario)
    );


    mensagem.textContent = "Cadastro realizado com sucesso!";

    mensagem.style.color = "green";


    // Limpar campos

    document.getElementById("nomeCadastro").value = "";

    document.getElementById("emailCadastro").value = "";

    document.getElementById("senhaCadastro").value = "";

    document.getElementById("confirmarSenha").value = "";


    // Voltar para login depois de 1 segundo

    setTimeout(function () {

        areaCadastro.style.display = "none";

        areaLogin.style.display = "block";

        mensagem.textContent = "";

    }, 1000);

});


// ENTRAR

document.getElementById("entrar").addEventListener("click", function () {

    const email = document.getElementById("emailLogin").value.trim().toLowerCase();

    const senha = document.getElementById("senhaLogin").value;

    const mensagem = document.getElementById("mensagemLogin");


    // Procurar usuário

    const dados = localStorage.getItem("usuario_" + email);


    // Usuário não existe

    if (!dados) {

        mensagem.textContent =
            "Usuário não encontrado. Faça seu cadastro.";

        mensagem.style.color = "red";

        return;
    }


    // Converter dados

    const usuario = JSON.parse(dados);


    // Conferir senha

    if (usuario.senha !== senha) {

        mensagem.textContent =
            "Senha incorreta.";

        mensagem.style.color = "red";

        return;
    }


    // Salvar login

    localStorage.setItem(
        "usuarioLogado",
        JSON.stringify(usuario)
    );


    mensagem.textContent =
        "Login realizado com sucesso!";

    mensagem.style.color = "green";


    // Alterar botão

    setTimeout(function () {

        modalLogin.style.display = "none";

        botaoLogin.textContent =
            "Olá, " + usuario.nome;

        document.getElementById("emailLogin").value = "";

        document.getElementById("senhaLogin").value = "";

        mensagem.textContent = "";

    }, 800);

});