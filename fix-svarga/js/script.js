  function openPopup(menu) {
    document.getElementById("popupOrder").style.display = "flex";
    document.getElementById("popupTitle").textContent = menu;
  }

  function closePopup() {
    document.getElementById("popupOrder").style.display = "none";
  }

  function kirimPesanWA() {
    const menu = document.getElementById("popupTitle").textContent;
    const jumlah = document.getElementById("jumlah").value;
    const level = document.getElementById("level").value;
    const pesan = `Halo, saya ingin pesan ${menu} (Isi: ${jumlah}, Pedas: ${level})`;
    window.open(`https://wa.me/6285213963005?text=${encodeURIComponent(pesan)}`, '_blank');
  }


  // Maskot
document.addEventListener('DOMContentLoaded', function () {
  const text = "🎉 Hai! Mainkan Memory Game dan dapatkan voucher potongan harga spesial dari Svarga Dimsum hari ini juga!";
  const typedText = document.getElementById('typed-text');
  const playBtn = document.getElementById('playGameBtn');
  const maskot = document.querySelector('.maskot');
  const bubbleSection = document.querySelector('.bubble-section');
  const promoContent = document.querySelector('.promo-content');

  let index = 0;
  let hasAnimated = false;

  function typeWriter() {
    if (index < text.length) {
      typedText.innerHTML += text.charAt(index);
      index++;
      setTimeout(typeWriter, 25);
    } else {
      playBtn.classList.add('show');
    }
  }

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        promoContent.classList.add('show');
        maskot.classList.add('animated');
        bubbleSection.classList.add('animated');

        setTimeout(typeWriter, 600);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.4
  });

  observer.observe(document.querySelector('.promo-container'));

  playBtn.addEventListener('click', () => {
    document.querySelector('.game').scrollIntoView({ behavior: 'smooth' });
  });
});

maskot.classList.add('animated');

