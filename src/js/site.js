// Header: once scrolled, go translucent; on large screens hide on scroll down and reveal on scroll up
const initHeader = () => {
	const header = document.querySelector( '[data-header]' );
	const desktop = window.matchMedia( '(min-width: 992px)' );
	let lastY = window.scrollY;

	if ( !header ) return;

	const update = () => {
		const y = window.scrollY;
		const scrolled = y > 10;

		header.toggleAttribute( 'data-scrolled', scrolled );
		header.toggleAttribute( 'data-hidden', desktop.matches && scrolled && y > lastY && y > header.offsetHeight );

		lastY = y;
	};

	const setHeight = () => document.documentElement.style.setProperty( '--header-height', `${ header.offsetHeight }px` );

	setHeight();
	update();

	window.addEventListener( 'scroll', update, { passive: true } );
	window.addEventListener( 'resize', setHeight );
};

// Mobile navigation toggle and the "Past Tournaments" sub menu
const initNav = () => {
	const toggle = document.querySelector( '[data-nav-toggle]' );
	const menu = document.getElementById( 'navBar' );

	toggle?.addEventListener( 'click', () => {
		const open = toggle.getAttribute( 'aria-expanded' ) !== 'true';

		toggle.setAttribute( 'aria-expanded', open );
		menu.toggleAttribute( 'data-open', open );
	} );

	document.querySelectorAll( '[data-submenu]' ).forEach( ( item ) => {
		const button = item.querySelector( 'button' );

		const setOpen = ( open ) => {
			button.setAttribute( 'aria-expanded', open );
			item.toggleAttribute( 'data-open', open );
		};

		button.addEventListener( 'click', () => setOpen( !item.hasAttribute( 'data-open' ) ) );
		item.addEventListener( 'mouseleave', () => setOpen( false ) );
		document.addEventListener( 'keydown', ( event ) => event.key === 'Escape' && setOpen( false ) );
		document.addEventListener( 'click', ( event ) => !item.contains( event.target ) && setOpen( false ) );
	} );
};

// Cross-fading background slideshow on the home page
const initSlideshow = () => {
	document.querySelectorAll( '[data-slideshow]' ).forEach( ( slideshow ) => {
		const slides = [ ...slideshow.children ];
		const interval = Number( slideshow.dataset.slideshow ) || 8000;
		let current = 0;

		if ( slides.length < 2 || window.matchMedia( '(prefers-reduced-motion: reduce)' ).matches ) return;

		setInterval( () => {
			slides[ current ].classList.replace( 'opacity-100', 'opacity-0' );
			current = ( current + 1 ) % slides.length;
			slides[ current ].classList.replace( 'opacity-0', 'opacity-100' );
		}, interval );
	} );
};

// Paged photo carousel with arrows and dots, wrapping at either end
const initCarousels = () => {
	document.querySelectorAll( '[data-carousel]' ).forEach( ( carousel ) => {
		const track = carousel.querySelector( '[data-carousel-track]' );
		const dots = carousel.querySelector( '[data-carousel-dots]' );

		const pageCount = () => Math.max( 1, Math.round( track.scrollWidth / track.clientWidth ) );
		const currentPage = () => Math.round( track.scrollLeft / track.clientWidth );

		const goTo = ( page ) => {
			const pages = pageCount();

			track.scrollTo( { left: ( ( page + pages ) % pages ) * track.clientWidth, behavior: 'smooth' } );
		};

		const renderDots = () => {
			const pages = pageCount();
			const active = currentPage();

			dots.replaceChildren( ...Array.from( { length: pages }, ( _, page ) => {
				const dot = document.createElement( 'li' );
				const button = document.createElement( 'button' );

				button.type = 'button';
				button.className = `mx-[5px] block size-2.5 cursor-pointer rounded-full border border-primary ${ page === active ? 'bg-primary' : 'bg-transparent' }`;
				button.setAttribute( 'aria-label', `Show photo page ${ page + 1 }` );
				button.addEventListener( 'click', () => goTo( page ) );

				dot.append( button );

				return dot;
			} ) );

			carousel.querySelectorAll( '[data-carousel-prev], [data-carousel-next]' ).forEach( ( arrow ) => arrow.hidden = pages < 2 );
		};

		carousel.querySelector( '[data-carousel-prev]' ).addEventListener( 'click', () => goTo( currentPage() - 1 ) );
		carousel.querySelector( '[data-carousel-next]' ).addEventListener( 'click', () => goTo( currentPage() + 1 ) );

		track.addEventListener( 'scrollend', renderDots );
		window.addEventListener( 'resize', renderDots );

		renderDots();
	} );
};

// Lightbox for gallery photos
const initLightbox = () => {
	const dialog = document.querySelector( '[data-lightbox-dialog]' );
	const links = [ ...document.querySelectorAll( '[data-lightbox]' ) ];
	let current = 0;

	if ( !dialog || !links.length ) return;

	const image = dialog.querySelector( '[data-lightbox-image]' );
	const caption = dialog.querySelector( '[data-lightbox-caption]' );

	const show = ( index ) => {
		current = ( index + links.length ) % links.length;

		image.src = links[ current ].href;
		image.alt = links[ current ].dataset.lightbox;
		caption.textContent = links[ current ].dataset.lightbox;
	};

	links.forEach( ( link, index ) => link.addEventListener( 'click', ( event ) => {
		event.preventDefault();

		show( index );
		dialog.showModal();
	} ) );

	dialog.querySelector( '[data-lightbox-close]' ).addEventListener( 'click', () => dialog.close() );
	dialog.querySelector( '[data-lightbox-prev]' ).addEventListener( 'click', () => show( current - 1 ) );
	dialog.querySelector( '[data-lightbox-next]' ).addEventListener( 'click', () => show( current + 1 ) );

	dialog.addEventListener( 'click', ( event ) => event.target.closest( 'figure' ) && event.target.tagName !== 'IMG' && dialog.close() );
	dialog.addEventListener( 'keydown', ( event ) => {
		if ( event.key === 'ArrowLeft' ) show( current - 1 );
		if ( event.key === 'ArrowRight' ) show( current + 1 );
	} );
};

// Back to top button, shown after scrolling down
const initGoToTop = () => {
	const button = document.querySelector( '[data-go-to-top]' );

	if ( !button ) return;

	const update = () => button.toggleAttribute( 'data-visible', window.scrollY > 400 );

	button.addEventListener( 'click', ( event ) => {
		event.preventDefault();

		window.scrollTo( { top: 0, behavior: 'smooth' } );
	} );

	window.addEventListener( 'scroll', update, { passive: true } );

	update();
};

initHeader();
initNav();
initSlideshow();
initCarousels();
initLightbox();
initGoToTop();
