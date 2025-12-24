/**
 * ST-Message-Buttons Extension
 * Позволяет кнопкам в HTML-сообщениях отправлять текст в чат
 * 
 * Использование в HTML:
 * <button data-st-send="Текст для отправки">Кнопка</button>
 * <button data-st-insert="Текст для вставки">Кнопка</button> (без авто-отправки)
 */

const extensionName = 'ST-Message-Buttons';

/**
 * Отправить сообщение в чат (с авто-отправкой)
 */
function sendMessageToChat(text) {
    const textarea = document.querySelector('#send_textarea');
    const sendBtn = document.querySelector('#send_but');
    
    if (textarea && sendBtn) {
        // Устанавливаем текст
        textarea.value = text;
        
        // Триггерим input event для SillyTavern
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        
        // Небольшая задержка перед кликом
        setTimeout(() => {
            sendBtn.click();
        }, 50);
        
        console.log(`[${extensionName}] Отправлено: ${text}`);
        
        // Уведомление
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

/**
 * Вставить текст в поле ввода (без авто-отправки)
 */
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

/**
 * Инициализация слушателей
 */
function initButtonListeners() {
    // Делегирование событий на document для всех текущих и будущих кнопок
    
    // data-st-send — отправка с авто-кликом
    $(document).on('click', '[data-st-send]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const text = $(this).attr('data-st-send');
        if (text && text.trim()) {
            sendMessageToChat(text.trim());
        }
    });
    
    // data-st-insert — только вставка, без отправки
    $(document).on('click', '[data-st-insert]', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const text = $(this).attr('data-st-insert');
        if (text && text.trim()) {
            insertMessageToChat(text.trim());
        }
    });
    
    // Поддержка touch событий для мобильных
    $(document).on('touchend', '[data-st-send], [data-st-insert]', function(e) {
        // Предотвращаем двойное срабатывание на мобильных
        if (e.cancelable) {
            e.preventDefault();
        }
    });
    
    console.log(`[${extensionName}] Слушатели кнопок активированы`);
}

/**
 * Делаем функции глобальными для прямого вызова из HTML (fallback)
 */
window.sendST = sendMessageToChat;
window.insertST = insertMessageToChat;

/**
 * Запуск расширения
 */
jQuery(async () => {
    try {
        initButtonListeners();
        console.log(`[${extensionName}] Расширение загружено успешно`);
    } catch (error) {
        console.error(`[${extensionName}] Ошибка загрузки:`, error);
    }
});
