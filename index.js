import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles, eventSource, event_types } from '../../../../script.js';

const extensionName = 'fetish-manager';

const FETISHES = {
    bdsm: { name: "БДСМ", icon: "⛓️", cat: "power", prompt: `[FETISH: BDSM] {{char}} has interest in BDSM.` },
    domination: { name: "Доминация", icon: "👑", cat: "power", prompt: `[FETISH: Domination] {{char}} takes control.` },
    masochism: { name: "Мазохизм", icon: "🔥", cat: "power", prompt: `[FETISH: Masochism] {{char}} enjoys pain.` },
    bondage: { name: "Бондаж", icon: "🪢", cat: "power", prompt: `[FETISH: Bondage] {{char}} enjoys restraints.` },
    brat_taming: { name: "Приручение", icon: "😈", cat: "power", prompt: `[FETISH: Brat Taming] {{char}} provokes punishment.` },
    freeuse: { name: "Freeuse", icon: "🔓", cat: "power", prompt: `[FETISH: Free Use] {{char}} available anytime.` },
    humiliation: { name: "Унижение", icon: "😳", cat: "psych", prompt: `[FETISH: Humiliation] {{char}} enjoys degradation.` },
    praise: { name: "Похвала", icon: "✨", cat: "psych", prompt: `[FETISH: Praise] {{char}} loves praise.` },
    money: { name: "Фин.Доминирование", icon: "💵", cat: "psych", prompt: `[FETISH: Financial dominance] {{char}} derives profound sexual and psychological pleasure from financially dominating their partner, which includes the mandatory purchase of expensive gifts, jewelry, or property. They must insist on the partner accepting large sums of money or having full financial reliance on them. The act of "gifting" is a core element of sexual arousal and control` },
    daddy: { name: "Папочка", icon: "🎩", cat: "psych", prompt: `[FETISH: Daddy] {{char}} enjoys daddy role.` },
    lactation: { name: "Лактация", icon: "🍼", cat: "psych", prompt: `[FETISH: Lactation] {{char}} has a lactation fetish and focuses on breast milk and nursing.` },
    pregnancy: { name: "Беременность", icon: "🤰", cat: "psych", prompt: `[FETISH: Pregnancy] {{char}} has a pregnancy fetish and focuses on the state of being pregnant and gravidity.` },
    corruption: { name: "Развращение", icon: "🍎", cat: "psych", prompt: `[FETISH: Corruption] {{char}} corrupts innocence.` },
    public: { name: "Публичный", icon: "🏙️", cat: "risk", prompt: `[FETISH: Public] {{char}} enjoys public intimacy.` },
    risk: { name: "Риск", icon: "👀", cat: "risk", prompt: `[FETISH: Risk] {{char}} craves discovery risk.` },
    voyeurism: { name: "Вуайеризм", icon: "🔭", cat: "risk", prompt: `[FETISH: Voyeurism] {{char}} watches others.` },
    anal: { name: "Анал", icon: "🍑", cat: "body", prompt: `[FETISH: Anal] {{char}} enjoys anal.` },
    hair: { name: "Волосы", icon: "👩🏻‍🦳", cat: "body", prompt: `[FETISH: Long hair] {{char}} loves long hair on girls.` },
    impact: { name: "Шлепки", icon: "✋", cat: "body", prompt: `[FETISH: Impact] {{char}} enjoys spanking.` },
    groping: { name: "Лапанье", icon: "🤲", cat: "body", prompt: `[FETISH: Groping] {{char}} touches constantly.` },
    breasts: { name: "Грудь", icon: "🍈", cat: "body", prompt: `[FETISH: Breasts] {{char}} obsessed with big breasts.` },
    foot: { name: "Ноги", icon: "🦶", cat: "body", prompt: `[FETISH: Foot] {{char}} enjoys feet.` },
    blindfold: { name: "Повязка", icon: "🙈", cat: "sense", prompt: `[FETISH: Blindfold] {{char}} enjoys blindfolds.` },
    mirror: { name: "Зеркала", icon: "🪞", cat: "sense", prompt: `[FETISH: Mirror] {{char}} watches in mirrors.` },
    toys: { name: "Игрушки", icon: "🎀", cat: "sense", prompt: `[FETISH: Toys] {{char}} uses toys.` },
    roleplay: { name: "Ролеплей", icon: "🎭", cat: "sense", prompt: `[FETISH: Roleplay] {{char}} enjoys roles.` },
    petplay: { name: "Петплей", icon: "🐾", cat: "sense", prompt: `[FETISH: Petplay] {{char}} enjoys pet play.` },
    aftercare: { name: "Aftercare", icon: "🫂", cat: "rel", prompt: `[FETISH: Aftercare] {{char}} gives aftercare.` },
    dirty_talk: { name: "Dirty Talk", icon: "🗣️", cat: "rel", prompt: `[FETISH: Dirty Talk] {{char}} talks dirty.` },
    worship: { name: "Поклонение", icon: "🛐", cat: "rel", prompt: `[FETISH: Worship] {{char}} worships partner.` }
};

const CATEGORIES = {
    power: { name: "Власть", icon: "⛓️" },
    psych: { name: "Психология", icon: "🧠" },
    risk: { name: "Риск", icon: "👀" },
    body: { name: "Тело", icon: "💋" },
    sense: { name: "Сенсорика", icon: "✨" },
    rel: { name: "Отношения", icon: "💕" }
};

const INTENSITY_MODIFIERS = {
    low: { name: "Низкая", multiplier: 0.5, desc: "Лёгкие намёки" },
    medium: { name: "Средняя", multiplier: 1.0, desc: "Умеренное проявление" },
    high: { name: "Высокая", multiplier: 1.5, desc: "Яркое доминирование" }
};

let state = { 
    enabled: true, 
    active: [], 
    intensity: 'medium', 
    chance: 70, 
    custom: [],
    lastRoll: null 
};

function load() { 
    try { 
        const s = localStorage.getItem('fm'); 
        if(s) state = {...state, ...JSON.parse(s)}; 
    } catch(e){} 
}

function save() { 
    localStorage.setItem('fm', JSON.stringify(state)); 
}

function rollChance() {
    const roll = Math.random() * 100;
    state.lastRoll = roll; 
    return roll <= state.chance;
}

function buildPrompt() {
    if (!state.enabled || !state.active.length) return '';

    const triggered = rollChance();
    
    if (!triggered) {

        return `[FETISH SYSTEM: INACTIVE - Roll: ${state.lastRoll.toFixed(1)}% > ${state.chance}%]\n[Vanilla scene, subtle hints only]`;
    }

    const intensityData = INTENSITY_MODIFIERS[state.intensity];
    let p = `[FETISH SYSTEM: ACTIVE - Roll: ${state.lastRoll.toFixed(1)}% ≤ ${state.chance}%]\n`;
    p += `[Intensity: ${intensityData.name} (${intensityData.desc})]\n\n`;

    state.active.forEach(k => {
        if (FETISHES[k]) {
            let prompt = FETISHES[k].prompt;

            if (state.intensity === 'low') {
                prompt = prompt.replace('{{char}}', '{{char}} subtly');
            } else if (state.intensity === 'high') {
                prompt = prompt.replace('{{char}}', '{{char}} intensely and explicitly');
            }
            
            p += prompt + '\n';
        }
        
        const c = state.custom.find(f => f.id === k);
        if (c) p += c.prompt + '\n';
    });
    
    return p;
}

function apply() {
    const prompt = buildPrompt();
    setExtensionPrompt(
        extensionName, 
        prompt, 
        extension_prompt_types.IN_PROMPT, 
        1000, 
        true, 
        false, 
        null, 
        extension_prompt_roles.SYSTEM
    );

    if (state.enabled && state.active.length > 0) {
        console.log(`[Fetish Manager] Roll: ${state.lastRoll?.toFixed(1)}% | Chance: ${state.chance}% | Result: ${state.lastRoll <= state.chance ? '✅ ACTIVE' : '❌ INACTIVE'}`);
    }
}

function notify(msg) {
    if (typeof toastr !== 'undefined') {
        toastr.info(msg, 'Fetish Manager', { timeOut: 2000, positionClass: 'toast-top-center' });
    }
}

function updateUI() {
    $('.fm-fetish-btn').each(function() {
        $(this).toggleClass('fm-active', state.active.includes($(this).data('key')));
    });
    
    $('.fm-custom-item').each(function() {
        $(this).toggleClass('fm-custom-active', state.active.includes($(this).data('id')));
    });
    
    const count = state.active.length;
    $('#fm-mini-btn').html(count > 0 ? `🔥${count}` : '🔥');
    
    $('#fm-active-display').html(
        count > 0
            ? state.active.map(k => {
                const f = FETISHES[k] || state.custom.find(c => c.id === k);
                return f ? `<span class="fm-active-tag" data-key="${k}">${f.icon || '🔹'} ${f.name} <span class="fm-remove">✕</span></span>` : '';
            }).join('')
            : '<span class="fm-empty">Не выбрано</span>'
    );

    $('.fm-intensity-btn').removeClass('fm-intensity-active');
    $(`.fm-intensity-btn[data-level="${state.intensity}"]`).addClass('fm-intensity-active');

    $('#fm-chance-value').text(`${state.chance}%`);
    $('#fm-chance-slider').val(state.chance);
    
    renderCustomList();

    $('.fm-active-tag .fm-remove').off('click').on('click', function(e) {
        e.stopPropagation();
        const key = $(this).closest('.fm-active-tag').data('key');
        toggle(key);
    });
}

function toggle(key) {
    const i = state.active.indexOf(key);
    const f = FETISHES[key] || state.custom.find(c => c.id === key);
    
    if (i < 0) {
        state.active.push(key);
        notify(`${f?.icon || '🔹'} ${f?.name || key} +`);
    } else {
        state.active.splice(i, 1);
        notify(`${f?.name || key} −`);
    }
    
    updateUI();
    apply();
    save();
}

function renderCustomList() {
    const $list = $('#fm-custom-list');
    if (state.custom.length === 0) {
        $list.html('<div class="fm-custom-empty">Нет кастомных</div>');
    } else {
        $list.html(state.custom.map(f => `
            <div class="fm-custom-item ${state.active.includes(f.id) ? 'fm-custom-active' : ''}" data-id="${f.id}">
                <span class="fm-custom-icon">${f.icon || '🔹'}</span>
                <span class="fm-custom-name">${f.name}</span>
                <button class="fm-custom-delete" data-id="${f.id}">🗑️</button>
            </div>
        `).join(''));
        
        $('.fm-custom-item').off('click').on('click', function(e) {
            if (!$(e.target).hasClass('fm-custom-delete')) {
                toggle($(this).data('id'));
            }
        });
        
        $('.fm-custom-delete').off('click').on('click', function(e) {
            e.stopPropagation();
            deleteCustom($(this).data('id'));
        });
    }
}

function deleteCustom(id) {
    state.custom = state.custom.filter(f => f.id !== id);
    state.active = state.active.filter(k => k !== id);
    updateUI();
    apply();
    save();
    notify('Удалено');
}

function addCustom() {
    const name = $('#fm-custom-name').val().trim();
    const icon = $('#fm-custom-icon').val().trim() || '🔹';
    const prompt = $('#fm-custom-prompt').val().trim();
    
    if (!name || !prompt) {
        notify('⚠️ Заполни имя и промпт');
        return;
    }
    
    const id = `custom_${Date.now()}`;
    state.custom.push({ id, name, icon, prompt });
    
    $('#fm-custom-name, #fm-custom-icon, #fm-custom-prompt').val('');
    
    updateUI();
    save();
    notify(`${icon} ${name} создан`);
}

function initUI() {
    const html = `
        <div id="fm-panel" class="fm-panel">
            <div class="fm-header">
                <h3>🔥 Fetish Manager</h3>
                <button id="fm-close" class="fm-close">✕</button>
            </div>
            
            <div class="fm-content">
                <!-- Активные фетиши -->
                <div class="fm-section">
                    <div class="fm-section-title">🎯 Активные</div>
                    <div id="fm-active-display" class="fm-active-list"></div>
                </div>
                
                <!-- Настройки -->
                <div class="fm-section">
                    <div class="fm-section-title">⚙️ Настройки</div>
                    
                    <div class="fm-setting">
                        <label>💪 Интенсивность:</label>
                        <div class="fm-intensity-group">
                            <button class="fm-intensity-btn" data-level="low">Низкая</button>
                            <button class="fm-intensity-btn fm-intensity-active" data-level="medium">Средняя</button>
                            <button class="fm-intensity-btn" data-level="high">Высокая</button>
                        </div>
                    </div>
                    
                    <div class="fm-setting">
                        <label>🎲 Шанс срабатывания: <span id="fm-chance-value">70%</span></label>
                        <input type="range" id="fm-chance-slider" min="10" max="100" step="5" value="70" class="fm-slider">
                    </div>
                </div>
                
                <!-- Категории фетишей -->
                ${Object.entries(CATEGORIES).map(([cat, data]) => `
                    <div class="fm-section">
                        <div class="fm-section-title">${data.icon} ${data.name}</div>
                        <div class="fm-fetish-grid">
                            ${Object.entries(FETISHES)
                                .filter(([_, f]) => f.cat === cat)
                                .map(([key, f]) => `
                                    <button class="fm-fetish-btn" data-key="${key}" title="${f.prompt}">
                                        ${f.icon} ${f.name}
                                    </button>
                                `).join('')}
                        </div>
                    </div>
                `).join('')}
                
                <!-- Кастомные фетиши -->
                <div class="fm-section">
                    <div class="fm-section-title">➕ Кастомные</div>
                    <div id="fm-custom-list" class="fm-custom-list"></div>
                    
                    <div class="fm-custom-form">
                        <input type="text" id="fm-custom-name" placeholder="Название" class="fm-input">
                        <input type="text" id="fm-custom-icon" placeholder="🔹" class="fm-input fm-input-icon">
                        <textarea id="fm-custom-prompt" placeholder="[FETISH: ...] {{char}} ..." class="fm-textarea"></textarea>
                        <button id="fm-custom-add" class="fm-btn-primary">Создать</button>
                    </div>
                </div>
            </div>
        </div>
        
        <button id="fm-mini-btn" class="fm-mini-btn" title="Fetish Manager">🔥</button>
    `;
    
    $('body').append(html);
    
    $('#fm-mini-btn').on('click', () => $('#fm-panel').toggleClass('fm-panel-open'));
    $('#fm-close').on('click', () => $('#fm-panel').removeClass('fm-panel-open'));
    
    $('.fm-fetish-btn').on('click', function() {
        toggle($(this).data('key'));
    });
    
    $('.fm-intensity-btn').on('click', function() {
        state.intensity = $(this).data('level');
        updateUI();
        apply();
        save();
        notify(`Интенсивность: ${INTENSITY_MODIFIERS[state.intensity].name}`);
    });
    
    $('#fm-chance-slider').on('input', function() {
        state.chance = parseInt($(this).val());
        $('#fm-chance-value').text(`${state.chance}%`);
        apply();
        save();
    });
    
    $('#fm-custom-add').on('click', addCustom);
    
    updateUI();
}

function setupEventListeners() {
    eventSource.on(event_types.CHAT_CHANGED, apply);
    eventSource.on(event_types.MESSAGE_SENT, apply);
    eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, apply);
}

jQuery(async () => {
    load();
    initUI();
    setupEventListeners();
    apply();
    
    console.log('[Fetish Manager] Loaded with REAL probability system');
});
