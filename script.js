/**
 * 1. SINGLE PAGE NAVIGATION LOGIC
 * Pinamamahalaan ang paglipat ng "pages" nang hindi nagre-refresh.
 */
function showPage(pageId, element) {
    const pages = document.querySelectorAll('section, header.hero');
    
    pages.forEach(page => {
        page.classList.remove('active-page');
        page.style.display = 'none'; 
    });

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.style.display = 'block';
        // Timeout para sa smooth CSS entry animation
        setTimeout(() => {
            targetPage.classList.add('active-page');
        }, 20);
    }

    // Update active state sa nav links
    const allLinks = document.querySelectorAll('.nav-links a');
    allLinks.forEach(link => link.classList.remove('active'));
    
    if (element) {
        element.classList.add('active');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * 2. SHOPPING CART LOGIC
 */
var cart = [];
var cartCount = 0;

function addToCart(itemName, price) {
    cart.push({ name: itemName, price: price });
    cartCount = cart.length;
    updateCartBadge();
    
    // Optional: Auto-show cart notification
    console.log(`Added ${itemName} to cart.`);
}

function updateCartBadge() {
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.innerText = cartCount;
        badge.style.transform = "scale(1.3)";
        setTimeout(() => { badge.style.transform = "scale(1)"; }, 200);
    }
}

function showCart() {
    const modal = document.getElementById('cart-modal');
    const cartList = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (!modal) return;

    cartList.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartList.innerHTML = '<li style="padding:20px; text-align:center; opacity:0.6;">Your cart is empty</li>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            const li = document.createElement('li');
            li.className = 'cart-item-row'; // Gamitin ito para sa CSS styling
            li.innerHTML = `
                <span>${item.name}</span>
                <span>₱${item.price} <button onclick="removeCartItem(event, ${index})" class="remove-btn">✕</button></span>
            `;
            cartList.appendChild(li);
        });
    }

    cartTotal.innerText = total.toLocaleString(); // Add commas sa price
    modal.classList.add('show');
}

function closeCart(event) {
    if (event) event.stopPropagation();
    const modal = document.getElementById('cart-modal');
    if (modal) modal.classList.remove('show');
}

function removeCartItem(event, index) {
    if (event) event.stopPropagation();
    cart.splice(index, 1);
    cartCount = cart.length;
    updateCartBadge();
    showCart();
}

/**
 * 3. MENU SLIDER LOGIC
 */
function changeSlide(sliderId, contentId, direction) {
    const slider = document.getElementById(sliderId);
    const content = document.getElementById(contentId);
    const slides = slider.querySelectorAll('.slides img');
    const items = content.querySelectorAll('.menu-item');
    
    let activeIndex = Array.from(slides).findIndex(img => img.classList.contains('active'));

    slides[activeIndex].classList.remove('active');
    items[activeIndex].classList.remove('active-highlight');

    activeIndex += direction;
    if (activeIndex >= slides.length) activeIndex = 0;
    if (activeIndex < 0) activeIndex = slides.length - 1;

    slides[activeIndex].classList.add('active');
    items[activeIndex].classList.add('active-highlight');
}

function moveSlide(sliderId, contentId, index) {
    const slider = document.getElementById(sliderId);
    const content = document.getElementById(contentId);
    const slides = slider.querySelectorAll('.slides img');
    const items = content.querySelectorAll('.menu-item');

    slides.forEach(img => img.classList.remove('active'));
    items.forEach(item => item.classList.remove('active-highlight'));

    slides[index].classList.add('active');
    items[index].classList.add('active-highlight');
}

/**
 * 4. ULTRA-SMOOTH GALLERY FILTERING
 */
function initGallery() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.g-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Instant feedback sa button
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');
            let visibleIndex = 0;

            galleryItems.forEach((item) => {
                const category = item.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    // 1. Ipakita agad sa flow
                    item.style.display = 'block';
                    
                    // 2. Alisin ang hidden state at i-animate
                    setTimeout(() => {
                        item.classList.remove('is-hidden');
                        item.classList.add('is-showing');
                    }, visibleIndex * 40); // 40ms stagger para sa bilis

                    visibleIndex++;
                } else {
                    // 1. Simulan ang fade out
                    item.classList.remove('is-showing');
                    item.classList.add('is-hidden');
                    
                    // 2. Alisin sa display pagkatapos ng animation
                    setTimeout(() => {
                        if (item.classList.contains('is-hidden')) {
                            item.style.display = 'none';
                        }
                    }, 500); 
                }
            });
        });
    });
}


/**
 * 5. INITIALIZATION
 */
document.addEventListener('DOMContentLoaded', () => {
    // I-set ang Home as default page
    const defaultLink = document.querySelector('.nav-links a');
    showPage('home', defaultLink);
    
    // I-start ang Gallery Filter logic
    initGallery();
});


document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('zyric-contact-form');
    const successMsg = document.getElementById('contact-success');
    const emailInput = document.getElementById('email');
    const emailWarning = document.getElementById('email-warning');
    const textarea = document.getElementById('auto-grow-msg');

    // 1. AUTO-GROW TEXTAREA (Optional but nice for UX)
    textarea.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // 2. FORM SUBMISSION LOGIC
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault(); // Pipigilan ang pag-refresh ng page

            // Simple Email Validation Check
            if (!emailInput.value.includes('@')) {
                emailWarning.classList.add('is-visible');
                return;
            } else {
                emailWarning.classList.remove('is-visible');
            }

            // Phase 1: Fade out the form
            contactForm.style.transition = 'opacity 0.5s ease';
            contactForm.style.opacity = '0';

            // Phase 2: Switch views after fade
            setTimeout(() => {
                contactForm.style.display = 'none';
                successMsg.style.display = 'block';
                
                // Scroll to the top of the contact section para makita ang message
                successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        });
    }
});

// 3. RESET FORM FUNCTION (Para sa "Send Another Message" button)
function resetForm() {
    const contactForm = document.getElementById('zyric-contact-form');
    const successMsg = document.getElementById('contact-success');

    // Hide success message
    successMsg.style.display = 'none';
    
    // Show and reset form
    contactForm.style.display = 'block';
    setTimeout(() => {
        contactForm.style.opacity = '1';
    }, 10);
    
    contactForm.reset();
    
    // Reset textarea height
    const textarea = document.getElementById('auto-grow-msg');
    textarea.style.height = 'auto';
}



document.addEventListener('DOMContentLoaded', () => {
    const filterLinks = document.querySelectorAll('.wp-cat-list li');
    const header = document.getElementById('blog-header');
    const quotesView = document.getElementById('quotes-view');
    const articlesView = document.getElementById('articles-view');
    const allPosts = document.querySelectorAll('.wp-post-card');

    filterLinks.forEach(link => {
        link.addEventListener('click', function() {
            // 1. UI: Set Active Link
            filterLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // 2. HEADER FIX: Huwag i-hide, i-minimize lang para manatili sa taas
            if (filter === 'home') {
                header.classList.remove('minimized');
                quotesView.style.display = 'none';
                articlesView.style.display = 'block';
                allPosts.forEach(post => post.style.display = 'block');
            } else {
                header.classList.add('minimized'); // Ito ang magpapanatili sa "Zyric's Coffee Shop" sa taas

                // 3. INDIVIDUAL CONTENT FILTERING
                if (filter === 'quotes-only') {
                    quotesView.style.display = 'block';
                    articlesView.style.display = 'none';
                } else {
                    quotesView.style.display = 'none';
                    articlesView.style.display = 'block';

                    allPosts.forEach(post => {
                        // Individual check: Ipakita lang ang tugma sa category
                        if (post.getAttribute('data-cat') === filter) {
                            post.style.display = 'block';
                        } else {
                            post.style.display = 'none';
                        }
                    });
                }
            }
            
            // 4. SCROLL FIX: Aakyat ang view pero titigil sa ilalim ng sticky header
            const headerHeight = header.classList.contains('minimized') ? 100 : 0;
            window.scrollTo({ 
                top: 0, 
                behavior: 'smooth' 
            });
        });
    });
});