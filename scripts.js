// Seleciona os elementos do formulário
const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");

//Seleciona os elementos da lista
const expenseList = document.querySelector("ul");
const expensesTotal = document.querySelector("aside header h2");
const expensesQuantity = document.querySelector("aside header p span");

// Monitorando o evento de input no campo 'amount'
amount.oninput = () => {
  // Capturando o valor digitado no input
  let value = amount.value;

  // Usando uma expressão regular para remover tudo que não for número
  // \D => Qualquer caractere que não seja um dígito (0-9)
  // g  => Faz a substituição global (em todas as ocorrências)
  value = value.replace(/\D/g, "");

  // Transforma o valor em centavos (exemplo 150/100 = 1.50 que é equivalente a R$1,50)
  value = Number(value) / 100;

  // Atualizando o valor do input apenas com os números restantes
  amount.value = formatCurrencyBRL(value);
};

function formatCurrencyBRL(value) {
  //Formata o valor de currency no padrão brasileiro(BRL)
  value = value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
  //Retorna o valor formatado
  return value;
}

// Captura o evento de submit do formulário para obter os valores.
form.onsubmit = (event) => {
  //Previne o comportamento padão de recarregar a página.
  event.preventDefault();

  // Cria um objeto com os detalhes na nova despesa.
  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value,
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: amount.value,
    created_at: new Date(),
  };
  //Chama a função que irá adicionar o item na lista
  expenseAdd(newExpense);
};

// Adiciona um novo item na lista.
function expenseAdd(newExpense) {
  try {
    //Cria o elemento  para adicionar o item)(li) na lista(ul)
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    //Cria o icone da categoria.
    const expenseIcon = document.createElement("img");

    // Pega o src da imagem dinamicamente
    expenseIcon.setAttribute("src", `img/${newExpense.category_id}.svg`);
    expenseIcon.setAttribute("alt", newExpense.category_name);

    // Criar a info da despesa
    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    //Cria o nome da despesa
    const expenseName = document.createElement("strong");
    expenseName.textContent = newExpense.expense;

    //Cria categoria da despesa
    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = newExpense.category_name;

    //Adicionar nome e categoria na div das informações da despesa
    expenseInfo.append(expenseName, expenseCategory);

    //Cria valor da despesa
    const expenseAmount = document.createElement("span");
    expenseAmount.classList.add("expense-amount");
    expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
      .toUpperCase()
      .replace("R$", "")}`;

    //Cria icone de remoção
    const removeIcon = document.createElement("img");
    removeIcon.classList.add("remove-icon");
    removeIcon.setAttribute("src", "img/remove.svg");
    removeIcon.setAttribute("alt", "remover");

    //Adiciona as informações no item.
    expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);

    //Adiciona o item na lista
    expenseList.append(expenseItem);

    //Limpa o formulário
    formClear();

    //Atualiza os totais
    updateTotals();
  } catch (error) {
    alert("Não foi possível atualizar a lista de despesas");
    console.log(error);
  }
}

//Atualizar os totais.
function updateTotals() {
  try {
    //Recupera todos os itens(li) da lista (ul)
    const items = expenseList.children;

    //Atualiza a quantidade de intens da lista
    expensesQuantity.textContent = `${items.length} ${
      items.length > 1 ? "despesas" : "despesa"
    }`;

    //Variavel para incrementar o total
    let total = 0;

    //Percorre cada item (li) da lista (ul)
    for (let item = 0; item < items.length; item++) {
      const itemAmount = items[item].querySelector(".expense-amount");

      //Remover caracteres não numericos e substitui a virgula pelo ponto.
      let value = itemAmount.textContent
        .replace(/[^\d,]/g, "")
        .replace(",", ".");

      //Converte o valor para float
      value = parseFloat(value);

      //Verifica se é um número válido
      if (isNaN(value)) {
        return alert("Não foi possível calcular o total.");
      }

      //Incrementa o valor total
      total += Number(value);
    }

    // Cria a span para adicionar o R$ formatado.
    const symbolBRL = document.createElement("small");
    symbolBRL.textContent = "R$";

    //Formata o valor e remove o R$ que será exibido pela small com um stilo customizado
    total = formatCurrencyBRL(total).toUpperCase().replace("R$", "");

    //Limpa o conteúdo do elemento
    expensesTotal.innerHTML = "";

    //Adiciona o symbol da moeda e o valor formatado
    expensesTotal.append(symbolBRL, total);
  } catch (error) {
    alert("Não foi possível atualizar os totais!");
    console.log(error);
  }
}

//Evento que captura o clique nos itens da lista.
expenseList.addEventListener("click", function (event) {
  //Verifca se o elemento clicado é o icone de remover
  if (event.target.classList.contains("remove-icon")) {
    // Obtém a li pai do elemento clicado
    const item = event.target.closest(".expense");
    //Remove o item da lista
    item.remove();
  }
  //Atualiza os totais
  updateTotals();
});

//Função que limpa o formulário
function formClear() {
  expense.value = "";
  category.value = "";
  amount.value = "";

  expense.focus();
}
