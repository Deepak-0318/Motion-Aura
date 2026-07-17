function shareArticle() {
    const shareData = {
        title: document.title,
        text: 'Check out this article on MotionAura:',
        url: window.location.href
    };

    if (navigator.share) {
        navigator.share(shareData).catch((error) => console.log('Error sharing:', error));
    } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copied to clipboard!');
        }).catch((err) => {
            showToast('Failed to copy link.');
        });
    }
}

function showToast(message) {
    let toast = document.getElementById('share-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'share-toast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: linear-gradient(90deg, #9b5cff, #ff4fa3);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 500;
            box-shadow: 0 10px 25px rgba(155, 92, 255, 0.4);
            z-index: 10000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    
    // Trigger animation
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    }, 10);

    // Hide after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
    }, 3000);
}

function updateBookmarkUI() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarked_blogs') || '[]');
    const isBookmarked = bookmarks.includes('creating-content-people-watch-brands-people-remember.html');
    const icon = document.getElementById('bookmarkIcon');
    if (icon) {
        if (isBookmarked) {
            icon.className = 'fas fa-bookmark';
            icon.style.color = '#ff4fa3';
        } else {
            icon.className = 'far fa-bookmark';
            icon.style.color = '';
        }
    }
}

function toggleBookmark() {
    let bookmarks = JSON.parse(localStorage.getItem('bookmarked_blogs') || '[]');
    const index = bookmarks.indexOf('creating-content-people-watch-brands-people-remember.html');
    if (index > -1) {
        bookmarks.splice(index, 1);
        showToast('Bookmark removed.');
    } else {
        bookmarks.push('creating-content-people-watch-brands-people-remember.html');
        showToast('Article bookmarked!');
    }
    localStorage.setItem('bookmarked_blogs', JSON.stringify(bookmarks));
    updateBookmarkUI();
}

document.addEventListener('DOMContentLoaded', updateBookmarkUI);
