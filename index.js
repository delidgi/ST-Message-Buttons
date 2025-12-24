const extensionName = 'ST-Message-Buttons';


function sendMessageToChat(text) {
    const textarea = document.querySelector('#send_textarea');
    const sendBtn = document.querySelector('#send_but');
    
    if (textarea && sendBtn) {
        
        textarea.value = text;
        
        
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        
       
        setTimeout(() => {
            sendBtn.click();
        }, 50);
        
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


function initButtonListeners() {

    $(document).on('click', '[data-st-send]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const text = $(this).attr('data-st-send');
        if (text && text.trim()) {
            sendMessageToChat(text.trim());
        }
    });
    
    
    $(document).on('click', '[data-st-insert]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const text = $(this).attr('data-st-insert');
        if (text && text.trim()) {
            insertMessageToChat(text.trim());
        }
    });
    
    
    $(document).on('touchend', '[data-st-send], [data-st-insert]', function(e) {
        // Предотвращаем двойное срабатывание на мобильных
        if (e.cancelable) {
            e.preventDefault();
        }
    });
    
    console.log(`[${extensionName}] Слушатели кнопок активированы`);
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
