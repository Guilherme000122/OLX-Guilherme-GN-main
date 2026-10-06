const $=id=>document.getElementById(id);

if($("dataAtual")){
$("dataAtual").textContent="Data: "+new Date().toLocaleDateString("pt-BR");
}

/* MENUS */

function abrirMenu(botao,submenu){
const b=$(botao);
const s=$(submenu);

if(b&&s){
b.onclick=function(e){
e.stopPropagation();
s.classList.toggle("ativo");
};
}
}

abrirMenu("btn-sobre","menu-vertical-sobre");
abrirMenu("btn-contato","menu-vertical-contato");

document.addEventListener("click",function(){
const sobre=$("menu-vertical-sobre");
const contato=$("menu-vertical-contato");

if(sobre)sobre.classList.remove("ativo");
if(contato)contato.classList.remove("ativo");
});

if($("linkTelefone")){
$("linkTelefone").onclick=function(e){
e.preventDefault();
alert("Telefone: (32) 99999-9999");
};
}

/* CADASTRO */

const formCadastro=$("formCadastro");

if(formCadastro){

formCadastro.onsubmit=function(e){

e.preventDefault();

const nome=$("nomeCadastro").value.trim();
const cpf=$("cpfCadastro").value.trim();
const endereco=$("enderecoCadastro").value.trim();
const email=$("emailCadastro").value.trim().toLowerCase();
const senha=$("senhaCadastro").value;
const confirmar=$("confirmarSenha").value;
const msg=$("mensagemCadastro");

if(senha!==confirmar){
msg.textContent="As senhas não são iguais.";
msg.style.color="red";
return;
}

if(localStorage.getItem("usuario_"+email)){
msg.textContent="Este email já está cadastrado.";
msg.style.color="red";
return;
}

const usuario={
nome:nome,
cpf:cpf,
endereco:endereco,
email:email,
senha:senha
};

localStorage.setItem("usuario_"+email,JSON.stringify(usuario));
localStorage.setItem("usuarioLogado",JSON.stringify(usuario));

let usuarios=JSON.parse(localStorage.getItem("usuariosComprae"))||[];

usuarios.push(usuario);

localStorage.setItem("usuariosComprae",JSON.stringify(usuarios));

msg.textContent="Cadastro realizado! Entrando...";
msg.style.color="green";

setTimeout(function(){
window.location.href="site.html";
},500);

};

}

/* LOGIN */

const formLogin=$("formLogin");

if(formLogin){

formLogin.onsubmit=function(e){

e.preventDefault();

const email=$("emailLogin").value.trim().toLowerCase();
const senha=$("senhaLogin").value;
const msg=$("mensagemLogin");

const dados=localStorage.getItem("usuario_"+email);

if(!dados){
msg.textContent="Email ou senha incorretos.";
msg.style.color="red";
return;
}

const usuario=JSON.parse(dados);

if(usuario.senha!==senha){
msg.textContent="Email ou senha incorretos.";
msg.style.color="red";
return;
}

localStorage.setItem("usuarioLogado",JSON.stringify(usuario));

msg.textContent="Login realizado! Entrando...";
msg.style.color="green";

setTimeout(function(){
window.location.href="site.html";
},500);

};

}

/* PROTEÇÃO DO SITE */

if(
location.pathname.endsWith("site.html")&&
!localStorage.getItem("usuarioLogado")
){
window.location.href="login.html";
}

/* MOSTRAR USUÁRIO */

const usuarioLogado=JSON.parse(
localStorage.getItem("usuarioLogado")||"null"
);

if($("nomeUsuario")&&usuarioLogado){
$("nomeUsuario").textContent=usuarioLogado.nome;
}

/* SAIR */

if($("botaoSair")){

$("botaoSair").onclick=function(){

localStorage.removeItem("usuarioLogado");

window.location.href="index.html";

};

}

/* PUBLICAR PRODUTO */

const formProduto=$("formProduto");

if(formProduto){

formProduto.onsubmit=function(e){

e.preventDefault();

const usuario=JSON.parse(
localStorage.getItem("usuarioLogado")
);

const arquivo=$("imagemProduto").files[0];
const msg=$("mensagemProduto");

if(!arquivo){
msg.textContent="Escolha uma imagem.";
msg.style.color="red";
return;
}

const leitor=new FileReader();

leitor.onload=function(){

const produto={
id:Date.now(),
nome:$("nomeProduto").value.trim(),
preco:Number($("precoProduto").value),
categoria:$("tipoProduto").value,
imagem:leitor.result,
vendedor:usuario.nome,
emailVendedor:usuario.email,
comprado:false,
comprador:""
};

let produtos=JSON.parse(
localStorage.getItem("produtosComprae")
)||[];

produtos.push(produto);

localStorage.setItem(
"produtosComprae",
JSON.stringify(produtos)
);

formProduto.reset();

msg.textContent="Produto publicado com sucesso!";
msg.style.color="green";

mostrarProdutos();

};

leitor.readAsDataURL(arquivo);

};

}

/* MOSTRAR PRODUTOS */

function mostrarProdutos(){

const lista=$("listaProdutos");

if(!lista)return;

const usuario=JSON.parse(
localStorage.getItem("usuarioLogado")
);

if(!usuario)return;

const produtos=JSON.parse(
localStorage.getItem("produtosComprae")
)||[];

const busca=$("buscaProdutos")
?$("buscaProdutos").value.toLowerCase()
:"";

lista.innerHTML="";

produtos
.filter(function(p){
return p.nome.toLowerCase().includes(busca)||
p.categoria.toLowerCase().includes(busca);
})
.forEach(function(p){

const card=document.createElement("article");

card.className="produto-card";

let botoes="";

if(p.comprado){

botoes='<button class="botao" disabled>Produto vendido</button>';

}else if(p.emailVendedor===usuario.email){

botoes='<button class="botao-sair" onclick="excluirProduto('+p.id+')">Excluir</button>';

}else{

botoes='<button class="botao" onclick="comprarProduto('+p.id+')">Comprar</button>';

botoes+='<button class="botao botao-secundario" onclick="tenhoInteresse('+p.id+')">Interesse</button>';

}

card.innerHTML=
'<img src="'+p.imagem+'" alt="'+p.nome+'">'+
'<div class="produto-info">'+
'<span class="categoria">'+p.categoria+'</span>'+
'<h3>'+p.nome+'</h3>'+
'<p class="preco">R$ '+p.preco.toFixed(2).replace(".",",")+'</p>'+
'<p>Vendedor: <strong>'+p.vendedor+'</strong></p>'+
'<div class="botoes-produto">'+botoes+'</div>'+
'</div>';

lista.appendChild(card);

});

}

/* PESQUISA */

if($("buscaProdutos")){

$("buscaProdutos").oninput=function(){
mostrarProdutos();
};

}

/* COMPRAR */

function comprarProduto(id){

let produtos=JSON.parse(
localStorage.getItem("produtosComprae")
)||[];

const produto=produtos.find(function(p){
return p.id===id;
});

const usuario=JSON.parse(
localStorage.getItem("usuarioLogado")
);

if(!produto)return;

if(produto.emailVendedor===usuario.email){
alert("Você não pode comprar seu próprio produto.");
return;
}

if(produto.comprado){
alert("Este produto já foi vendido.");
return;
}

if(!confirm("Deseja comprar "+produto.nome+"?"))return;

produto.comprado=true;
produto.comprador=usuario.email;

localStorage.setItem(
"produtosComprae",
JSON.stringify(produtos)
);

alert("Compra realizada com sucesso!");

mostrarProdutos();

}

/* INTERESSE */

function tenhoInteresse(id){

const produtos=JSON.parse(
localStorage.getItem("produtosComprae")
)||[];

const produto=produtos.find(function(p){
return p.id===id;
});

if(!produto)return;

const assunto=encodeURIComponent(
"Tenho interesse em "+produto.nome
);

const texto=encodeURIComponent(
"Olá! Tenho interesse no produto "+
produto.nome+
" anunciado no Compraê."
);

window.location.href=
"mailto:"+produto.emailVendedor+
"?subject="+assunto+
"&body="+texto;

}

/* EXCLUIR */

function excluirProduto(id){

let produtos=JSON.parse(
localStorage.getItem("produtosComprae")
)||[];

const usuario=JSON.parse(
localStorage.getItem("usuarioLogado")
);

const produto=produtos.find(function(p){
return p.id===id;
});

if(!produto||produto.emailVendedor!==usuario.email)return;

if(!confirm("Deseja excluir este produto?"))return;

produtos=produtos.filter(function(p){
return p.id!==id;
});

localStorage.setItem(
"produtosComprae",
JSON.stringify(produtos)
);

mostrarProdutos();

}

mostrarProdutos();