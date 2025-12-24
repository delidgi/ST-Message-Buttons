const extensionName = 'ST-Message-Buttons';


function sendMessageToChat(text) {
    const textarea = document.querySelector('#send_textarea');
    const sendBtn = document.querySelector('#send_but');
    
    if (textarea && sendBtn) {
        textarea.value = text;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        setTimeout(() => {
            sendBtn.click();
        }, 100);
        
        console.log(`[${extensionName}] Отправлено: ${text}`);
        
        if (typeof toastr !== 'undefined') {
            toastr.info(`➤ ${text}`, '', { 
                timeOut: 1500,
                positionClass: 'toast-bottom-center'
            });
        }
        
        return true;
    } else {
        console.warn(`[${extensionName}] Не найдено поле ввода или кнопка отправки`);
        return false;
    }
}


function insertMessageToChat(text) {
    const textarea = document.querySelector('#send_textarea');
    
    if (textarea) {
        textarea.value = text;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.focus();
        
        console.log(`[${extensionName}] Вставлено: ${text}`);
        return true;
    }
    
    return false;
}


function handleButtonAction(element) {
    const sendText = element.getAttribute('data-st-send');
    const insertText = element.getAttribute('data-st-insert');
    
    if (sendText && sendText.trim()) {
        sendMessageToChat(sendText.trim());
        return true;
    }
    
    if (insertText && insertText.trim()) {
        insertMessageToChat(insertText.trim());
        return true;
    }
    
    return false;
}


function initButtonListeners() {
   
    let touchHandled = false;
    
   
    document.addEventListener('touchstart', function(e) {
        const button = e.target.closest('[data-st-send], [data-st-insert]');
        if (button) {
            touchHandled = true;
           
            button.style.opacity = '0.7';
        }
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        const button = e.target.closest('[data-st-send], [data-st-insert]');
        if (button) {
            e.preventDefault();
            button.style.opacity = '1';
            handleButtonAction(button);
            
           
            setTimeout(() => {
                touchHandled = false;
            }, 300);
        }
    }, { passive: false });
    
   
    document.addEventListener('click', function(e) {
        if (touchHandled) {
            touchHandled = false;
            return;
        }
        
        const button = e.target.closest('[data-st-send], [data-st-insert]');
        if (button) {
            e.preventDefault();
            e.stopPropagation();
            handleButtonAction(button);
        }
    }, true);
    
    console.log(`[${extensionName}] Слушатели кнопок активированы (touch + click)`);
}


window.sendST = sendMessageToChat;
window.insertST = insertMessageToChat;


jQuery(async () => {
    try {
        initButtonListeners();
        console.log(`[${extensionName}] Расширение загружено успешно`);
    } catch (error) {
        console.error(`[${extensionName}] Ошибка загрузки:`, error);
    }
});
