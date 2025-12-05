document.addEventListener('DOMContentLoaded', function () {
    const popupOverlay = document.getElementById('popupOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const openBtn = document.querySelector('.btn-open-form');
    const contactForm = document.getElementById('contactForm');
    const messageDiv = document.getElementById('formMessage'); 
    function loadFormData() {
        const saved = JSON.parse(localStorage.getItem('contactForm')) || {};
        Object.keys(saved).forEach(key => {
            const el = document.getElementById(key);
            if (el) {
                if (el.type === 'checkbox') {
                    el.checked = saved[key];
                } else {
                    el.value = saved[key];
                }
            }
        });
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
        if (window.location.hash === '#form') {
            history.back();
        }
        clearFormData();
        messageDiv.style.display = 'none'; 
    }
    function showMessage(text, isSuccess) {
        messageDiv.textContent = text;
        messageDiv.className = 'message ' + (isSuccess ? 'success' : 'error');
        messageDiv.style.display = 'block';
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
   contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const data = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        organization: document.getElementById('organization').value,
        message: document.getElementById('message').value,
        privacyAgreement: document.getElementById('privacyAgreement').checked
    };

    try {
        console.log('Отправляю данные:', data);

        const response = await fetch('https://formcarry.com/s/da7g4RAoKGe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json' 
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showMessage('✅ Ваше сообщение отправлено! Спасибо!', true);
            clearFormData();
            setTimeout(closePopup, 2000);
        } else {
            const errorText = await response.text();
            console.error('Ошибка сервера:', response.status, errorText);
            showMessage(`❌ Ошибка: ${response.status}`, false);
        }
    } catch (err) {
        console.error('Ошибка сети:', err);
        showMessage(`❌ Нет соединения: ${err.message}`, false);
    }
});
