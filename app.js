const cartPanel = document.querySelector('#cart-panel')
const cartOverlay = document.querySelector('#cart-overlay')
const cartClose = document.querySelector('#cart-close')
const cartToggle = document.querySelector('#cart-toggle')
const productGrid = document.querySelector('#product-grid')
const searchInput = document.querySelector('#search-input')
const resultsCount = document.querySelector('#results-count')
const catalogEmpty = document.querySelector('#catalog-empty')
const searchForm = document.querySelector('#search-form')
const priceMin = document.querySelector('#price-min')
const priceMax = document.querySelector('#price-max')
const sortSelect = document.querySelector('#sort-select')
const filtersReset = document.querySelector('#filters-reset')
const cartItems = document.querySelector('#cart-items')
const cartEmpty = document.querySelector('#cart-empty')
const cartCount = document.querySelector('#cart-count')
const cartTotal = document.querySelector('#cart-total')
const cartFooter = document.querySelector('#cart-footer')

function openCart () {
  cartPanel.hidden = false
  cartOverlay.hidden = false
}

function closeCart () {
  cartPanel.hidden = true
  cartOverlay.hidden = true
}

function handleKeydown (event) {
  if (event.key === 'Escape') {
    closeCart()
  }
}

function handleSearchSubmit (event) {
  event.preventDefault()
}

const products = [
  {
    id: 1,
    name: 'Ноутбук Air 13',
    price: 899,
    category: 'laptops',
    image: 'images/laptop-air.jpg'
  },
  {
    id: 2,
    name: 'Ноутбук Pro 15',
    price: 1299,
    category: 'laptops',
    image: 'images/laptop-pro.jpg'
  },
  {
    id: 3,
    name: 'Смартфон Nova',
    price: 599,
    category: 'phones',
    image: 'images/phone-nova.jpg'
  },
  {
    id: 4,
    name: 'Смартфон Nova Plus',
    price: 799,
    category: 'phones',
    image: 'images/phone-plus.jpg'
  },
  {
    id: 5,
    name: 'Беспроводные наушники',
    price: 149,
    category: 'audio',
    image: 'images/headphones.jpg'
  },
  {
    id: 6,
    name: 'Портативная колонка',
    price: 89,
    category: 'audio',
    image: 'images/speaker.jpg'
  },
  {
    id: 7,
    name: 'Механическая клавиатура',
    price: 119,
    category: 'accessories',
    image: 'images/keyboard.jpg'
  },
  {
    id: 8,
    name: 'Беспроводная мышь',
    price: 49,
    category: 'accessories',
    image: 'images/mouse.jpg'
  },
  {
    id: 9,
    name: 'Монитор 27″',
    price: 299,
    category: 'accessories',
    image: 'images/monitor.jpg'
  }
]
const cart = []

function renderProducts (items) {
  productGrid.replaceChildren()

  resultsCount.textContent = `Найдено товаров: ${items.length}`
  catalogEmpty.hidden = items.length > 0

  items.forEach(product => {
    const article = `
            <article class="product-card" data-id="${product.id}" data-category="${product.category}" data-price="${product.price}">
                <div class="product-card__image">
                  <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <p class="product-card__category">${product.category}</p>
                <h3 class="product-card__name">${product.name}</h3>
                <p class="product-card__price">${product.price} $</p>
                <button type="button" class="product-card__add" data-add-to-cart>
                  В корзину
                </button>
            </article>`
    productGrid.insertAdjacentHTML('beforeend', article)
  })
}

function renderCart () {
  cartItems.replaceChildren()
  cartEmpty.hidden = cart.length > 0
  let totalQuantity = 0
  let totalPrice = 0

  cart.forEach(cartItem => {
    const product = products.find(item => item.id === cartItem.id)

    totalQuantity += cartItem.quantity
    totalPrice += product.price * cartItem.quantity

    const list = document.createElement('li')
    list.className = 'cart-item'
    const info = document.createElement('div')
    info.className = 'cart-item__info'

    const name = document.createElement('p')
    name.className = 'cart-item__name'
    name.textContent = product.name

    const price = document.createElement('p')
    price.className = 'cart-item__price'
    price.textContent = `${product.price} $ × ${cartItem.quantity} шт.`

    info.append(name, price)
    list.append(info)
    const removeButton = document.createElement('button')
    removeButton.type = 'button'
    removeButton.className = 'cart-item__remove'
    removeButton.textContent = '✕'
    removeButton.setAttribute('aria-label', 'Удалить товар')
    removeButton.addEventListener('click', () => {
      removeFromCart(cartItem.id)
    })
    const increaseButton = document.createElement('button')
    increaseButton.type = 'button'
    increaseButton.className = 'cart-item__increase'
    increaseButton.textContent = '+'
    increaseButton.setAttribute('aria-label', 'Увеличить количество')

    increaseButton.addEventListener('click', () => {
      increaseQuantity(cartItem.id)
    })
    const decreaseButton = document.createElement('button')
    decreaseButton.type = 'button'
    decreaseButton.className = 'cart-item__decrease'
    decreaseButton.textContent = '−'
    decreaseButton.setAttribute('aria-label', 'Уменьшить количество')
    decreaseButton.disabled = cartItem.quantity <= 1
    decreaseButton.addEventListener('click', () => {
      decreaseQuantity(cartItem.id)
    })

    const quantityControls = document.createElement('div')
    quantityControls.className = 'cart-item__quantity'

    const quantityText = document.createElement('span')
    quantityText.className = 'cart-item__count'
    quantityText.textContent = cartItem.quantity

    quantityControls.append(decreaseButton, quantityText, increaseButton)

    list.append(quantityControls, removeButton)

    cartItems.append(list)
  })
  cartCount.textContent = totalQuantity
  cartCount.hidden = totalQuantity === 0

  cartTotal.textContent = `${totalPrice} $`
  cartFooter.hidden = cart.length === 0
}

function removeFromCart (productId) {
  const index = cart.findIndex(item => item.id === productId)

  if (index === -1) return

  cart.splice(index, 1)
  saveCart()
  renderCart()
}

function increaseQuantity (productId) {
  const cartItem = cart.find(item => item.id === productId)
  if (cartItem === undefined) return
  cartItem.quantity++
  saveCart()
  renderCart()
}

function decreaseQuantity (productId) {
  const cartItem = cart.find(item => item.id === productId)
  if (cartItem === undefined) return
  if (cartItem.quantity <= 1) return
  cartItem.quantity--
  saveCart()
  renderCart()
}

function searchProducts () {
  const query = searchInput.value.trim().toLowerCase()
  const selectedCategories = getSelectedCategories()

  const min = priceMin.value === '' ? 0 : Number(priceMin.value)
  const max = priceMax.value === '' ? Infinity : Number(priceMax.value)

  const filteredProducts = products.filter(product => {
    return (
      product.name.toLowerCase().includes(query) &&
      selectedCategories.includes(product.category) &&
      product.price >= min &&
      product.price <= max
    )
  })

  if (sortSelect.value === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price)
  } else if (sortSelect.value === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price)
  } else if (sortSelect.value === 'name-asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
  }

  renderProducts(filteredProducts)
}

function resetFilters () {
  priceMin.value = ''
  priceMax.value = ''
  searchInput.value = ''
  sortSelect.value = 'default'
  document.querySelectorAll('input[name="category"]').forEach(input => {
    input.checked = true
  })
  searchProducts()
}

function handleProductClick (event) {
  const button = event.target.closest('[data-add-to-cart]')

  if (button === null) return

  const card = button.closest('.product-card')
  const productId = Number(card.dataset.id)

  const product = products.find(item => item.id === productId)

  if (product === undefined) return

  addToCart(product)
}

function addToCart (product) {
  const cartItem = cart.find(item => item.id === product.id)
  if (cartItem) {
    cartItem.quantity++
  } else {
    cart.push({
      id: product.id,
      quantity: 1
    })
  }
  saveCart()
  renderCart()
}
function getSelectedCategories () {
  const checkedInputs = document.querySelectorAll(
    'input[name="category"]:checked'
  )

  return Array.from(checkedInputs, input => input.value)
}
function saveCart () {
  try {
    localStorage.setItem('techCart', JSON.stringify(cart))
  } catch (error) {
    console.error('Не удалось сохранить корзину', error)
  }
}
function loadCart () {
  try {
    const saved = localStorage.getItem('techCart')

    if (saved === null) return

    const items = JSON.parse(saved)
    if (!Array.isArray(items)) return
    const validItems = items.filter(item => {
      return (
        item !== null &&
        typeof item === 'object' &&
        Number.isInteger(item.quantity) &&
        item.quantity > 0 &&
        products.some(product => product.id === item.id)
      )
    })

    cart.length = 0
    cart.push(...validItems)
  } catch (error) {
    console.error('Не удалось загрузить корзину', error)
  }
}

document.querySelectorAll('input[name="category"]').forEach(input => {
  input.addEventListener('change', searchProducts)
})

document.addEventListener('keydown', handleKeydown)
cartToggle.addEventListener('click', openCart)
cartClose.addEventListener('click', closeCart)
cartOverlay.addEventListener('click', closeCart)
searchForm.addEventListener('submit', handleSearchSubmit)
searchInput.addEventListener('input', searchProducts)
priceMin.addEventListener('input', searchProducts)
priceMax.addEventListener('input', searchProducts)
sortSelect.addEventListener('change', searchProducts)
filtersReset.addEventListener('click', resetFilters)
productGrid.addEventListener('click', handleProductClick)

loadCart()
renderCart()
searchProducts()
