document.addEventListener('DOMContentLoaded', () => {
            // Redirect legacy category parameters to their dedicated HTML pages
            const params = new URLSearchParams(window.location.search);
            const category = params.get('category');
            const redirects = {
                'branding': 'branding-works.html',
                'motion-design': 'motion-design-works.html',
                'ui-ux': 'uiux-works.html',
                'video-production': 'video-production-works.html'
            };
            if (category && redirects[category.toLowerCase()]) {
                window.location.href = redirects[category.toLowerCase()];
            }
        });