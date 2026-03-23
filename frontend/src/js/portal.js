/* 
   FRESHMART — portal.js
   JavaScript for the landing page portal selection.
   This file has no dependency on either CSS framework. */


/* ── RIPPLE EFFECT

   How the ripple works:
   1. Get the card element that was clicked
   2. Create a new <span> element to be the ripple circle
   3. Calculate how big it needs to be (diameter of the card)
   4. Position it exactly where the user clicked
   5. Add the 'ripple' CSS class which triggers the animation
   6. Remove any previous ripple so they don't pile up
   ---------------------------------------------------------- */
function rippleEffect(e) {

  // The card element that was clicked
  const card = e.currentTarget;

  // Create a new empty <span> that will become the ripple circle
  const circle = document.createElement('span');

  // Make the circle large enough to cover the whole card
  const diameter = Math.max(card.clientWidth, card.clientHeight);
  const radius = diameter / 2;

  // Get the card's position on the screen
  const rect = card.getBoundingClientRect();

  // Set the circle's size
  circle.style.width  = `${diameter}px`;
  circle.style.height = `${diameter}px`;

  // Position the circle centred on where the user clicked
  // e.clientX = mouse X position on screen
  // rect.left  = where the card starts on screen (X axis)
  // Subtracting gives the click position relative to the card
  circle.style.left = `${e.clientX - rect.left - radius}px`;
  circle.style.top  = `${e.clientY - rect.top  - radius}px`;

  // Add the CSS class that triggers the ripple animation (in styles.css)
  circle.classList.add('ripple');

  // Remove any existing ripple on this card first
  const existing = card.querySelector('.ripple');
  if (existing) existing.remove();

  // Append the ripple circle inside the card
  card.appendChild(circle);
}
