const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

const cartButton = document.querySelector('.button-cart');
const modalCart = document.querySelector('#modal-cart');
const modalClose = document.querySelector('.modal-close');
const more = document.querySelector('.more');
const navigationLink = document.querySelectorAll('.navigation-link');
const longGoodsList = document.querySelector('.long-goods-list');
const cartTableGoods = document.querySelector('.cart-table__goods');
const cartTableTotal = document.querySelector('.card-table__total');


const getGoods = async () => {
	const result = await fetch('db/db.json');
	if (!result.ok){
		throw 'Ошибочка вышла:' + result.status
	}
	return await result.json();
}
//Создадим свои собственные методы
const cart = {
	cartGoods: [
		{
			id: '099',
			name: 'Часы Dior',
			price: 999,
			count: 2
		},
		{
			id: '090',
			name: 'Кеды Vdici',
			price: 9,
			count: 3,
		},
	],
	renderCart (){
		cartTableGoods.textContent = '';
		this.cartGoods.forEach(({id, name, price, count }) => {
			const trGood = document.createElement('tr');
			trGood.className = 'cart-item';
			trGood.dataset.id = id;
			trGood.innerHTML = `
			<td>${name}</td>
			<td>${price}</td>
			<td><button class="cart-btn-minus">-</button></td>
			<td>${count}</td>
			<td><button class="cart-btn-plus">+</button></td>
			<td>${price*count}</td>
			<td><button class="cart-btn-delete">x</button></td>
			`;
			cartTableGoods.append(trGood);
		});
		const totalPrice = this.cartGoods.reduce((sum, item) => {
			return sum + (item.price*item.count);
		}, 0);
		//Вывод результата
		cartTableTotal.textContent = totalPrice + '$'
	},
	deleteGood(id){
		this.cartGoods = this.cartGoods.filter(item => id !== item.id);
		this.renderCart();
	},
	minusGood(id){
		for(const item of this.cartGoods){
			if(item.id === id){
				if(item.count <= 1){
					this.deleteGood(id)
				} else {
					item.count--;
				}
				break;
			}
		}
		this.renderCart();
	},
	plusGood(id){
		for(const item of this.cartGoods){
			if(item.id === id){
				item.count++;
				break;
			}
		}
		this.renderCart();
	},
	addCartGood(id){
		const goodItem = this.cartGoods.find(item => item.id ===id);
		if(goodItem){
			this.plusGood(id);
		} else {
			getGoods()
			.then(data => data.find(item => item.id === id))
			.then(({id, name, price}) => {
				this.cartGoods.push({
					id,
					name,
					price,
					count: 1,
				});
			}); 
		}
	},
}

document.body.addEventListener('click', event => {
	const addToCart = event.target.closest('.add-to-cart');

	if(addToCart){
		cart.addCartGood(addToCart.dataset.id)
	}
});

cartTableGoods.addEventListener('click', event => {
	const target = event.target;

	if(target.tagName = 'BUTTON') {
		const id = target.closest('.cart-item').dataset.id;

		if(target.classList.contains('cart-btn-delete')){
			cart.deleteGood(id);
		}

		if(target.classList.contains('cart-btn-minus')){
			cart.minusGood(id);
		}

		if(target.classList.contains('cart-btn-plus')){
			cart.plusGood(id);
		}
	}
	
});

//Функции заменены на стрелочные функции, константы
const openModal = () => {
	cart.renderCart();
	modalCart.classList.add('show');
}
const closeModal = () => {
	modalCart.classList.remove('show');
}

cartButton.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

(function () {

	let scrollLinks = document.querySelectorAll('a.scroll-link');
	for (let i = 0; i < scrollLinks.length; i++) {
		scrollLinks[i].addEventListener('click', event => {
			event.preventDefault();
			const id = this.getAttribute('href');
			document.querySelector(id).scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		});
	}
}) ()

// Lesson 2



const createCard = function(objCard) {
	const card = document.createElement('div');
	card.className = 'col-lg-3 col-sm-6';
	console.log(objCard)
	card.innerHTML = `
					<div class="goods-card">
					${objCard.label ? 
						`<span class="label">${objCard.label}</span>` :
						 ''}
						<img src="db/${objCard.img}" alt="${objCard.name}" class="goods-image">
						<h3 class="goods-title">${objCard.name}</h3>
						<p class="goods-description">${objCard.description}</p>
						<button class="button goods-card-btn add-to-cart" data-id=${objCard.id}>
							<span class="button-price">${objCard.price}</span>
						</button>
					</div>
	`;
	return card;
}
const renderCards = function(data) {
	longGoodsList.textContent = '';
	const cards = data.map(createCard);
	cards.forEach(function (card){
		longGoodsList.append(card)
	});
	document.body.classList.add('show-goods');
};

more.addEventListener('click', event => {
	event.preventDefault;

	document.querySelector('.header').scrollIntoView({
		behavior: 'smooth',
		block: 'start',
	});
	getGoods().then(renderCards);
});

const filterCards = function(field, value) {
	getGoods()
	.then( data => data.filter( good => good[field] === value))
	.then(renderCards);
};

navigationLink.forEach(function(link){
	link.addEventListener('click', event => {
		event.preventDefault();
		const field = link.dataset.field;
		const value = link.textContent;
		filterCards(field, value);
	})
});