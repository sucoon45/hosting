// Basic script for future interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('HostNexus website loaded');

    // Example: Smooth scroll for anchor links (if any)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            try {
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            } catch (error) {
                console.warn("Smooth scroll target not found: ", this.getAttribute('href'));
            }
        });
    });

    // Mobile menu toggle (basic example)
    const nav = document.querySelector('header nav ul');
    const menuButton = document.createElement('button');
    menuButton.textContent = 'Menu';
    menuButton.style.display = 'none'; // Hidden by default, shown via CSS media query
    menuButton.classList.add('mobile-menu-button');

    if (nav && nav.parentNode) {
        nav.parentNode.insertBefore(menuButton, nav);

        menuButton.addEventListener('click', () => {
            if (nav.style.display === 'block' || getComputedStyle(nav).display === 'block') {
                nav.style.display = 'none';
            } else {
                nav.style.display = 'block';
            }
        });
    }

    // Adjust nav display based on window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            if (nav) nav.style.display = ''; // Reset to CSS default
            if (menuButton) menuButton.style.display = 'none';
        } else {
            if (menuButton) menuButton.style.display = 'block'; // Show menu button on mobile
             if (nav && getComputedStyle(nav).display !== 'block' && getComputedStyle(nav).display !== 'none') { // if its not explicitly set by click
                if (nav) nav.style.display = 'none'; // Hide nav by default on mobile
            }
        }
    });

    // Initial check
    if (window.innerWidth <= 768) {
        if (menuButton) menuButton.style.display = 'block';
        if (nav) nav.style.display = 'none';
    } else {
         if (menuButton) menuButton.style.display = 'none';
    }


    // Domain Page Specific JavaScript
    const domainSearchFormPage = document.querySelector('.domain-search-form-page');
    const domainNameInputPage = document.getElementById('domainNameInput');
    const domainSearchResultsPage = document.getElementById('domainSearchResults');
    const quickSearchBtns = document.querySelectorAll('.quick-search-btn');

    if (domainSearchFormPage) {
        domainSearchFormPage.addEventListener('submit', function(e) {
            e.preventDefault();
            const domainName = domainNameInputPage.value.trim();
            if (domainName) {
                checkDomainAvailability(domainName);
            } else {
                if (domainSearchResultsPage) {
                    domainSearchResultsPage.innerHTML = '<p class="search-placeholder">Please enter a domain name to search.</p>';
                }
            }
        });
    }

    if (quickSearchBtns) {
        quickSearchBtns.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const tld = this.getAttribute('data-tld');
                let currentDomainValue = domainNameInputPage.value.trim();
                // Remove existing TLD if present before appending new one
                currentDomainValue = currentDomainValue.split('.')[0]; // Get base name
                domainNameInputPage.value = currentDomainValue + tld;
                domainNameInputPage.focus();
                 // Optionally, trigger search immediately
                if (currentDomainValue) { // only search if there's a base name
                    checkDomainAvailability(domainNameInputPage.value);
                }
            });
        });
    }

    function checkDomainAvailability(domainName) {
        if (!domainSearchResultsPage) return;

        domainSearchResultsPage.innerHTML = '<p class="search-placeholder">Checking availability for ' + escapeHTML(domainName) + '...</p>';

        // Simulate API call for domain availability
        setTimeout(() => {
            const isAvailable = Math.random() < 0.5; // Random availability
            const price = Math.floor(Math.random() * (15000 - 2000 + 1)) + 2000; // Random price between ₦2000 - ₦15000

            let resultHTML = '';
            if (isAvailable) {
                resultHTML = `
                    <div class="domain-result-item">
                        <div>
                            <span class="domain-name">${escapeHTML(domainName)}</span>
                            <span class="domain-status-available">is Available!</span>
                        </div>
                        <div>
                            <span class="domain-price">₦${price.toLocaleString()}/year</span>
                            <a href="#" class="cta-button-secondary">Register Now</a>
                        </div>
                    </div>
                `;
            } else {
                resultHTML = `
                    <div class="domain-result-item">
                         <div>
                            <span class="domain-name">${escapeHTML(domainName)}</span>
                            <span class="domain-status-unavailable">is Not Available.</span>
                        </div>
                        <a href="#domain-search-section" class="cta-button-secondary try-another-btn">Try Another Search</a>
                    </div>
                `;
                // Suggest alternatives (very basic)
                const parts = domainName.split('.');
                const name = parts[0];
                const tld = parts.length > 1 ? '.' + parts.slice(1).join('.') : '.com';
                const suggestions = [name + 'hq' + tld, name + 'online' + tld, 'my' + name + tld];

                resultHTML += '<h5>Suggestions:</h5>';
                suggestions.forEach(sugg => {
                     const suggestedPrice = Math.floor(Math.random() * (15000 - 2000 + 1)) + 2000;
                     resultHTML += `
                        <div class="domain-result-item">
                            <div>
                                <span class="domain-name">${escapeHTML(sugg)}</span>
                                <span class="domain-status-available">is Available!</span>
                            </div>
                            <div>
                                <span class="domain-price">₦${suggestedPrice.toLocaleString()}/year</span>
                                <a href="#" class="cta-button-secondary">Register Now</a>
                            </div>
                        </div>
                     `;
                });

            }
            domainSearchResultsPage.innerHTML = resultHTML;

            // Add event listener for dynamically added "Try Another Search" button
            const tryAnotherBtn = domainSearchResultsPage.querySelector('.try-another-btn');
            if (tryAnotherBtn) {
                tryAnotherBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    domainNameInputPage.value = '';
                    domainNameInputPage.focus();
                    domainSearchResultsPage.innerHTML = '<p class="search-placeholder">Enter a domain name above to check its availability.</p>';
                });
            }

        }, 1500); // Simulate network delay
    }

     // Helper to escape HTML to prevent XSS, basic version
    function escapeHTML(str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    // FAQ Accordion for SSL page (and potentially others)
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Optional: Close other open FAQs
            // faqQuestions.forEach(q => {
            //     q.classList.remove('active');
            //     q.nextElementSibling.style.maxHeight = null;
            //     q.nextElementSibling.style.paddingTop = null;
            //     q.nextElementSibling.style.paddingBottom = null;
            // });

            if (isActive) {
                question.classList.remove('active');
                answer.style.maxHeight = null;
                answer.style.paddingTop = null;
                answer.style.paddingBottom = null;
            } else {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
                answer.style.paddingTop = "20px"; // Match p padding
                answer.style.paddingBottom = "20px"; // Match p padding
            }
        });
    });

    // Support Page - Live Chat Button Mock
    const liveChatButton = document.getElementById('liveChatButton');
    const chatStatusElement = document.getElementById('chatStatus');

    function updateChatStatus() {
        if (!liveChatButton || !chatStatusElement) return;

        const now = new Date();
        const day = now.getDay(); // 0 (Sun) - 6 (Sat)
        const hour = now.getHours(); // 0 - 23 in local time (assuming WAT is server/user's local for mock)

        // Monday to Friday (1-5), 9 AM to 5 PM (17:00)
        const isOnline = day >= 1 && day <= 5 && hour >= 9 && hour < 17;

        if (isOnline) {
            chatStatusElement.textContent = 'Chat Online';
            chatStatusElement.className = 'support-note online';
            liveChatButton.disabled = false;
            liveChatButton.textContent = 'Start Live Chat';
        } else {
            chatStatusElement.textContent = 'Chat Offline (Mon-Fri, 9am-5pm WAT)';
            chatStatusElement.className = 'support-note offline';
            liveChatButton.disabled = true;
            liveChatButton.textContent = 'Live Chat (Offline)';
        }
    }

    if (liveChatButton) {
        liveChatButton.addEventListener('click', () => {
            if (!liveChatButton.disabled) {
                alert('Live chat functionality would open a chat window here. (This is a demo)');
                // In a real application, this would trigger a live chat widget/API.
            }
        });
    }

    // Initial check and update chat status every minute
    updateChatStatus();
    setInterval(updateChatStatus, 60000);

    // Support Page - KB Search Form Mock
    const kbSearchForms = document.querySelectorAll('.knowledgebase-search-form');
    kbSearchForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('.kb-search-input');
            const query = searchInput ? searchInput.value.trim() : '';
            if (query) {
                // Redirect to knowledgebase page with search query
                window.location.href = `knowledgebase.html?search=${encodeURIComponent(query)}`;
            } else {
                // Optionally, just go to KB page if query is empty
                window.location.href = 'knowledgebase.html';
            }
        });
    });


});
