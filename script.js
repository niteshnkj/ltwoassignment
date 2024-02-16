window.addEventListener("load", () => {
  const selectedCategory = document.querySelector(
    'input[name="category"]:checked'
  ).value;
  fetchDataAndPopulateCategory(selectedCategory);
});

document.getElementById("menTab").addEventListener("change", () => {
  fetchDataAndPopulateCategory("Men");
});

document.getElementById("womenTab").addEventListener("change", () => {
  fetchDataAndPopulateCategory("Women");
});

document.getElementById("kidsTab").addEventListener("change", () => {
  fetchDataAndPopulateCategory("Kids");
});

async function fetchDataAndPopulateCategory(categoryName) {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json"
    );
    const data = await response.json();

    const categoryData = data.categories.find(
      (category) => category.category_name === categoryName
    );
    renderCategory(categoryData, categoryName);
    hideOtherTabs(categoryName);
  } catch (error) {
    console.error(`Error fetching data for ${categoryName} category:`, error);
  }
}

function renderCategory(categoryData, categoryName) {
  const categoryTabContent = document.getElementById(
    categoryName.toLowerCase()
  );

  categoryTabContent.innerHTML = "";

  if (categoryData && categoryData.category_products) {
    const productElements = categoryData.category_products.map((product) => {
      const itemContainer = document.createElement("div");
      itemContainer.classList.add("product-item");


      const actualPrice = parseFloat(product.price);
      const compareAtPrice = parseFloat(product.compare_at_price);
      const discountPercentage =
        ((compareAtPrice - actualPrice) / compareAtPrice) * 100;


      const maxLettersToShow = 10;
      const truncatedTitle = truncateTitle(product.title, maxLettersToShow);

      itemContainer.innerHTML = `
      <div class="card_top_container">
      <img src="${product.image}" alt="${truncatedTitle}" class="product_img">
      ${product.badge_text ? `<p class="badge">${product.badge_text}</p>` : ""}
      </div>
      <div class="card_middle_container">
      <p class="title">${truncatedTitle}</p>
      <span class="black_dot"></span>
      <p class="vendor">${product.vendor}</p>
      </div>
      <div class="card_bottom_container">
      <p class="price">RS ${product.price}</p>
      <p class="compare">${product.compare_at_price}</p>
      <p class="discount_per">${discountPercentage.toFixed(0)}%off</p>
      </div>
      
      <button class="cart_btn">Add to Cart</button>
    `;
      return itemContainer;
    });

    categoryTabContent.style.display = "flex";
    categoryTabContent.style.gap = "4px";
    if (productElements) {
      categoryTabContent.append(...productElements);
    }
  }
}



function hideOtherTabs(selectedTab) {
  const allTabs = ["men", "women", "kids"];
  allTabs.forEach((tab) => {
    if (tab !== selectedTab.toLowerCase()) {
      document.getElementById(tab).style.display = "none";
    }
  });
}


function truncateTitle(title, maxLetters) {
  if (title.length > maxLetters) {
    return title.substring(0, maxLetters) + ".";
  } else {
    return title;
  }
}
