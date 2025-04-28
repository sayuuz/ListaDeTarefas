const input = document.getElementById("inputTarefa");
const lista = document.getElementById("lista");
let tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

tarefas.forEach(tarefa => criarTarefa(tarefa.texto, tarefa.concluida));

// Adicionando elemento na lista ao apertar enter
input.addEventListener("keydown", function (e){
    if (e.key === "Enter") adicionarTarefa();
});

function adicionarTarefa (){
    const texto = input.value.trim();
    if (texto === "") return;

    criarTarefa(texto);
    tarefas.push({texto, concluida: false});
    salvarLocalStorage();

    input.value = "";
    input.focus();
}

// Criando item por item 
function criarTarefa(texto, concluida = false) {
    const li = document.createElement("li");
    li.className = "itemLista";
    li.setAttribute("draggable", "true");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "btnCheckBox";
    checkbox.checked = concluida;

    const span = document.createElement("span");
    span.className = "tituloTarefa";
    span.textContent = texto;
    if (concluida) span.style.textDecoration = "line-through";
    span.addEventListener("dblclick", () =>{
        const inputEdit = document.createElement("input");
        inputEdit.type = "text";
        inputEdit.value = texto;
        inputEdit.className = "inputEditar";
        span.replaceWith(inputEdit);
        inputEdit.focus();

        inputEdit.addEventListener("keydown", (e) => {
            if (e.key === "enter") {
                salvarEdicao();
            }
        });

        inputEdit.addEventListener("blur", salvarEdicao);

        function salvarEdicao () {
            const novoTexto = inputEdit.value.trim();
            if (novoTexto === ""){
                inputEdit.replaceWith(span);
                return;
            }
            span.textContent = novoTexto;
            inputEdit.replaceWith(span);

            tarefas = tarefas.map(t =>
                t.texto === texto ? {...t, texto: novoTexto} : t
            );
            salvarLocalStorage();
        }
    });

    
    checkbox.addEventListener("change", () => {
        span.style.textDecoration = checkbox.checked ? "line-through" : "none";
        atualizarTarefa(texto, checkbox.checked);
    });

    const btnExcluir = document.createElement("button");
    btnExcluir.className = "btnExcluir";
    btnExcluir.textContent = "X";
    btnExcluir.addEventListener("click", () => {
        li.remove();
        tarefas = tarefas.filter(t => t.texto !== texto);
        salvarLocalStorage();
    });

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btnExcluir);
    lista.appendChild(li);
}

function atualizarTarefa(texto, concluida){
    tarefas = tarefas.map(t =>
        t.texto === texto ? {...t, concluida} : t
    );
    salvarLocalStorage();
}

// iniciando o sortable
new Sortable(lista, {
    animation: 150,
    onEnd: function(){
        ordemNova();
    }
});

function ordemNova() {
    const novasTarefas = [];
    lista.querySelectorAll(".itemLista").forEach( li => {
        const texto = li.querySelector(".tituloTarefa").textContent;
        const concluida = li.querySelector("input[type='checkbox']").checked;
        novasTarefas.push({texto, concluida});
    });
    salvarLocalStorage();
}

function salvarLocalStorage() {
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
}