document.addEventListener('DOMContentLoaded', () => {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_blogs') || '[]');
    if (bookmarks.length === 0) return;

    const grid = document.querySelector('.articles-grid');
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll('.article-card'));
    
    // Sort cards so bookmarked ones are placed first
    cards.sort((a, b) => {
        const aLink = a.querySelector('.read-more-btn')?.getAttribute('href');
        const bLink = b.querySelector('.read-more-btn')?.getAttribute('href');
        
        // Extract plain filename (in case it contains paths/hashes)
        const aFile = aLink ? aLink.split('/').pop() : '';
        const bFile = bLink ? bLink.split('/').pop() : '';
        
        const aBookmarked = bookmarks.includes(aFile);
        const bBookmarked = bookmarks.includes(bFile);

        if (aBookmarked && !bBookmarked) return -1;
        if (!aBookmarked && bBookmarked) return 1;
        return 0;
    });

    // Re-append sorted cards to the grid
    cards.forEach(card => grid.appendChild(card));
});