let data = JSON.parse(localStorage.getItem("finance")) || [];
const list = document.getElementById("list");

const incomeEl = document.getElementById("totalIncome");
const expenseEl = document.getElementById("totalExpense");
const balanceEl = document.getElementById("balance");

const ctx = document.getElementById("chart").getContext("2d");
let chart;

document.getElementById("financeForm").addEventListener("submit", e => {
  e.preventDefault();
  const desc = document.getElementById("desc").value;
  const amount = +document.getElementById("amount").value;
  const type = document.getElementById("type").value;
  const category = document.getElementById("category").value;

  if(amount <= 0) return alert("Amount must be greater than zero");

  data.push({ desc, amount, type, category });
  save();
  e.target.reset();
});

document.getElementById("exportCSV").addEventListener("click", exportCSV);

function save(){
  localStorage.setItem("finance", JSON.stringify(data));
  render();
}

function deleteItem(i){
  data.splice(i,1);
  save();
}

function render(){
  list.innerHTML = "";
  let income = 0, expense = 0;

  data.forEach((item, i) => {
    if(item.type === "income") income += item.amount;
    else expense += item.amount;

    list.innerHTML += `
      <tr>
        <td>${item.desc}</td>
        <td>£${item.amount}</td>
        <td>${item.type}</td>
        <td>${item.category}</td>
        <td><button onclick="deleteItem(${i})">X</button></td>
      </tr>`;
  });

  incomeEl.textContent = income;
  expenseEl.textContent = expense;
  balanceEl.textContent = income - expense;

  drawChart(income, expense);
}

function drawChart(income, expense){
  if(chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Income", "Expense"],
      datasets: [{
        data: [income, expense],
        backgroundColor: ["#28a745", "#dc3545"]
      }]
    }
  });
}

function exportCSV(){
  let csv = "Description,Amount,Type,Category\n";
  data.forEach(i => {
    csv += `${i.desc},${i.amount},${i.type},${i.category}\n`;
  });

  const blob = new Blob([csv], {type: "text/csv"});
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "finance.csv";
  link.click();
}

render();
