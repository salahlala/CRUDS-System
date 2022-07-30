// select all element
let nameInput = document.querySelector(".nameInput"),
  priceInput = document.querySelector(".priceInput"),
  discInput = document.querySelector(".discInput"),
  categoryInput = document.querySelector(".catInput"),
  amountInput = document.querySelector(".amountInput"),
  addBtn = document.querySelector(".add"),
  updateBtn = document.querySelector(".update"),
  allInput = document.querySelectorAll(".userInput input"),
  searchInput = document.getElementById("search"),
  cleanBtn = document.querySelector("form .clean"),
  creatHead = document.querySelector(".create-box h3"),
  headDetails = document.querySelector(".create-box h2"),
  bodyTable = document.getElementById("tbody"),
  deleteAllBtn = document.querySelector(".deleteall"),
  correct = new Audio("audios/suc.mp3"),
  removeEle = new Audio("audios/remove.wav");

addBtn.addEventListener("click", showElement);
updateBtn.addEventListener("click", showElement);
// let delItem;
let arrData = [];
let index;

let chngCreate = "create";
let delProduct;

if (localStorage.productContent) {
  arrData = JSON.parse(localStorage.productContent);
} else {
  arrData = [];
}

function showElement() {
  let productDetails = {
    name: nameInput.value.toLowerCase(),
    price: priceInput.value,
    discount: discInput.value,
    category: categoryInput.value,
    total: +priceInput.value - +discInput.value,
  };
  if (
    nameInput.value != "" &&
    priceInput.value != "" &&
    categoryInput.value != "" &&
    amountInput.value < 150
  ) {
    if (chngCreate == "create") {
      if (amountInput.value > 1) {
        for (let i = 0; i < amountInput.value; i++) {
          arrData.push(productDetails);
        }
      } else {
        arrData.push(productDetails);
      }
    } else {
      arrData[index] = productDetails;
      amountInput.style.display = "block";
      addBtn.classList.remove("active");
      updateBtn.classList.remove("active");
      creatHead.classList.remove("active");
      headDetails.classList.remove("active");
      chngCreate = "create";
    }
    clean();
    correct.play();
    deleteAllBtn.classList.remove("hid");
    // delItem.classList.remove("hid");
  }

  localStorage.setItem("productContent", JSON.stringify(arrData));

  showData();
}

function showData() {
  let content = "";
  // focus on first input
  nameInput.focus();
  // check if the array has element
  if (arrData.length > 0) {
    deleteAllBtn.innerHTML = `Delete All (${arrData.length})`;
    deleteAllBtn.style.display = "block";
  } else {
    deleteAllBtn.style.display = "none";
  }

  for (let i = 0; i < arrData.length; i++) {
    content += `
        <tr> 
          <td>${i + 1}</td>
          <td>${arrData[i].name}</td>
          <td>${arrData[i].price}$</td>
          <td>${arrData[i].discount}$</td>
          <td>${arrData[i].total}$</td>
          <td>${arrData[i].category}</td>
          <td>
            <i class="fa-solid fa-pen-to-square" onclick= "updateData(${i})"></i> 
            <i class="fa-solid fa-trash-can delitem" onclick= "deleteElement(${i})"></i>
          </td>
        </tr>
      `;
  }

  bodyTable.innerHTML = content;
  let delItem = bodyTable.querySelectorAll(".delitem");
  if (arrData.length >= 1) {
    delProduct = delItem;
  }
}
showData();

// delete function
function deleteElement(idx) {
  if (chngCreate != "update") {
    arrData.splice(idx, 1);
    localStorage.setItem("productContent", JSON.stringify(arrData));
    showData();
    removeEle.play();
    // location.reload();
  }
}

deleteAllBtn.onclick = deleteAll;

// deleteAll function
function deleteAll() {
  if (chngCreate != "update") {
    arrData.splice(0);
    localStorage.setItem("productContent", JSON.stringify(arrData));
    showData();
    removeEle.play();
  }
}

// update function
function updateData(id) {
  nameInput.value = arrData[id].name;
  priceInput.value = arrData[id].price;
  discInput.value = arrData[id].discount;
  categoryInput.value = arrData[id].category;
  amountInput.style.display = "none";
  chngCreate = "update";
  index = id;
  addBtn.classList.add("active");
  updateBtn.classList.add("active");
  creatHead.classList.add("active");
  headDetails.classList.add("active");
  let mainTr = bodyTable.querySelectorAll("tr");
  mainTr.forEach((ele) => ele.classList.remove("active"));
  mainTr[id].classList.add("active");
  deleteAllBtn.classList.add("hid");
  delProduct.forEach((x) => x.classList.add("hid"));

  // delItem.classList.add("hid");
  scroll({
    top: 0,
    behavior: "smooth",
  });
}

// clean input
function clean() {
  allInput.forEach((el) => (el.value = ""));
}
document.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    showElement();
  }
});

searchInput.addEventListener("input", (e) => {
  searchElement(e.target.value.toLowerCase());
});
// search function
function searchElement(value) {
  let content = "";
  if (chngCreate != "update") {
    for (let i = 0; i < arrData.length; i++) {
      if (arrData[i].name.includes(value)) {
        content += `
        <tr> 
          <td>${i + 1}</td>
          <td>${arrData[i].name}</td>
          <td>${arrData[i].price}$</td>
          <td>${arrData[i].discount}$</td>
          <td>${arrData[i].total}$</td>
          <td>${arrData[i].category}</td>
          <td>
            <i class="fa-solid fa-pen-to-square" onclick= "updateData(${i})"></i> 
            <i class="fa-solid fa-trash-can" onclick= "deleteElement(${i})"></i>
          </td>
        </tr>
      `;
      }
    }
    bodyTable.innerHTML = content;
  }
}

cleanBtn.addEventListener("click", () => {
  if (chngCreate != "update") {
    searchInput.value = "";
    showData();
  }
});
