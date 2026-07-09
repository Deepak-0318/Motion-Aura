document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('lightboxModal');
    const closeBtn = document.getElementById('lightboxClose');
    const lightboxImg = document.getElementById('lightboxImage');
    const lightboxVid = document.getElementById('lightboxVideo');
    const caption = document.getElementById('lightboxCaption');

    if (!modal || !closeBtn || !lightboxImg || !lightboxVid || !caption) return;

    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', () => {
            const type = card.getAttribute('data-type');
            const src = card.getAttribute('data-fullsrc');
            const capText = card.getAttribute('data-caption') || '';

            if (type === 'video') {
                lightboxImg.style.display = 'none';
                lightboxImg.src = '';
                lightboxVid.src = src;
                lightboxVid.style.display = 'block';
                lightboxVid.play().catch(err => console.log("Auto-play blocked", err));
            } else {
                lightboxVid.style.display = 'none';
                lightboxVid.pause();
                lightboxVid.src = '';
                lightboxImg.src = src;
                lightboxImg.style.display = 'block';
            }
            caption.textContent = capText;
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            lightboxImg.src = '';
            lightboxVid.pause();
            lightboxVid.src = '';
            lightboxImg.style.display = 'none';
            lightboxVid.style.display = 'none';
        }, 300);
    }

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target === closeBtn) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});
