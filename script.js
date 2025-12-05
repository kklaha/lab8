document.addEventListener('DOMContentLoaded', function() {
    const popupOverlay = document.getElementById('popupOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const openBtn = document.querySelector('.btn-open-form');
    const contactForm = document.getElementById('contactForm');
    const messageDiv = document.getElementById('formMessage');
    function loadFormData() {
        const saved = JSON.parse(localStorage.getItem('contactForm')) || {};
        Object.keys(saved).forEach(key => {
            const el = document.getElementById(key);
            if (el) el.value = saved[key];
        });
        if (saved.privacyAgreement !== undefined) {
            document.getElementById('privacyAgreement').checked = saved.privacyAgreement;
        }
    }
    function saveFormData() {
        const data = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            organization: document.getElementById('organization').value,
            message: document.getElementById('message').value,
            privacyAgreement: document.getElementById('privacyAgreement').checked
        };
        localStorage.setItem('contactForm', JSON.stringify(data));
    }
    function clearFormData() {
        localStorage.removeItem('contactForm');
        contactForm.reset();
    }

    function openPopup() {
        popupOverlay.style.display = 'flex';
        history.pushState({ formOpen: true }, '', '#form');
        loadFormData();
    }

    function closePopup() {
        popupOverlay.style.display = 'none';
        history.back(); 
        clearFormData();
        showMessage('', false);
    }
    function showMessage(text, isSuccess) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + (isSuccess ? 'success' : 'error');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('https://formcarry.com/s/da7g4RAoKGe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                showMessage('✅ Сообщение успешно отправлено!', true);
                clearFormData();
                setTimeout(closePopup, 2000);
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (err) {
            showMessage('❌ Ошибка отправки: ' + err.message, false);
        }
    });
    openBtn.addEventListener('click', openPopup);
    closeBtn.addEventListener('click', closePopup);
    popupOverlay.addEventListener('click', function(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && popupOverlay.style.display === 'flex') {
            closePopup();
        }
    });
    window.addEventListener('popstate', function(e) {
        if (!e.state || !e.state.formOpen) {
            closePopup();
        }
    });
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', saveFormData);
    });
});