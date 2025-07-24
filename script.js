
const form = document.getElementById("expense-form");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const descriptionInput = document.getElementById("description");
const expenseTableBody = document.getElementById("expense-table-body");
const monthlyTotal = document.getElementById("monthly-total");
const categorySummary = document.getElementById("category-summary");

// Load expenses from localStorage or initialize as empty array
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Save to localStorage
function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

// Add expense to table
function renderExpenses() {
    expenseTableBody.innerHTML = "";

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));

    sortedExpenses.forEach((exp, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${exp.category}</td>
      <td>${exp.description || "-"}</td>
      <td>₹${exp.amount}</td>
      <td>${exp.date}</td>
      <td><button class="delete-btn" data-index="${index}">❌</button></td>
    `;
        expenseTableBody.appendChild(row);
    });

    // ✅ Add delete functionality
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const index = e.target.getAttribute("data-index");
            expenses.splice(index, 1); // remove item
            saveExpenses();            // update localStorage
            renderExpenses();          // re-render table
            renderSummary();           // re-render totals
        });
    });
}

// Calculate and show summary
function renderSummary() {
    let total = 0;
    const categoryTotals = {};

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    expenses.forEach(exp => {
        const expDate = new Date(exp.date);
        if (expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear) {
            total += Number(exp.amount);
            categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + Number(exp.amount);
        }
    });

    monthlyTotal.textContent = total;

    categorySummary.innerHTML = "";
    for (let cat in categoryTotals) {
        const li = document.createElement("li");
        li.textContent = `${cat}: ₹${categoryTotals[cat]}`;
        categorySummary.appendChild(li);
    }
}

// Form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newExpense = {
        amount: amountInput.value,
        category: categoryInput.value,
        date: dateInput.value,
        description: descriptionInput.value.trim(),
    };

    expenses.push(newExpense);
    saveExpenses();
    renderExpenses();
    renderSummary();

    // Reset form
    form.reset();
});

// Initial render
renderExpenses();
renderSummary();