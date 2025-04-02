document.addEventListener('DOMContentLoaded', () => {
    // Initialize Splitting.js (this automatically splits text based on the data-splitting attribute)
    Splitting();
    
    // Select all generated character elements
    const chars = document.querySelectorAll('.animated-text .char');
    chars.forEach((char, index) => {
      // Generate a small random offset (between -5px and 5px) for each axis
      const offsetX = (Math.random() * 10 - 5).toFixed(2) + 'px';
      const offsetY = (Math.random() * 10 - 5).toFixed(2) + 'px';
      char.style.setProperty('--offset-x', offsetX);
      char.style.setProperty('--offset-y', offsetY);
      // Set a staggered delay for each letter
      char.style.animationDelay = `${index * 0.05}s`;
    });
  });