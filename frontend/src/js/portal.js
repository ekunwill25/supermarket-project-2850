/* 
   FRESHMART — portal.js
   javascript for the landing page portal selection.
   this file has no dependency on either css framework.
*/

/* ── RIPPLE EFFECT  */
function rippleEffect(e) {
  /* the card element that was clicked */
  const card = e.currentTarget;

  /* create a new empty <span> that will become the ripple circle */
  const circle = document.createElement('span');

  /* make the circle large enough to cover the whole card */
  const diameter = Math.max(card.clientWidth, card.clientHeight);
  const radius = diameter / 2;

  /* get the card's position on the screen */
  const rect = card.getBoundingClientRect();

  /* set the circle's size */
  circle.style.width  = `${diameter}px`;
  circle.style.height = `${diameter}px`;

  /* position the circle centred on where the user clicked
     e.clientX = mouse x position on screen
     rect.left  = where the card starts on screen (x axis)
     subtracting gives the click position relative to the card */
  circle.style.left = `${e.clientX - rect.left - radius}px`;
  circle.style.top  = `${e.clientY - rect.top  - radius}px`;

  /* add the css class that triggers the ripple animation (in styles.css) */
  circle.classList.add('ripple');

  /* remove any existing ripple on this card first */
  const existing = card.querySelector('.ripple');
  if (existing) existing.remove();

  /* append the ripple circle inside the card */
  card.appendChild(circle);
}