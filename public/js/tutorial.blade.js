/**
 * VIMSYS Interactive Tutorial System
 * 5-Step Workflow: Walkin → Category → Policies → Series → Insurance
 */

(function() {
    'use strict';

    // Tutorial Configuration
    const CONFIG = {
        steps: [
            {
                id: 1,
                title: 'Create Walkin',
                desc: 'Walkins are the processors of vehicles. Click "New Walkin" to start.',
                target: '[data-tutorial-target="walkin-create"]',
                route: '/walkin',
                fields: ['#email', '#accountID', '#name', '#color', '#description', '#status'],
                submit: '#submitBtn'
            },
            {
                id: 2,
                title: 'Create Category',
                desc: 'Categories define vehicle types. Click "New Category" to continue.',
                target: '[data-tutorial-target="category-create"]',
                route: '/category',
                fields: ['#name', '#description', '#status'],
                submit: '#submitBtn'
            },
            {
                id: 3,
                title: 'Create Policy',
                desc: 'Policies define price lists. Click "New Policy" to proceed.',
                target: '[data-tutorial-target="policies-create"]',
                route: '/policies',
                fields: ['#category_id', '#code', '#name', '#cost'],
                submit: '#submitBtn'
            },
            {
                id: 4,
                title: 'Create Series',
                desc: 'Series are COC numbers from brokers. Click "New Series" to continue.',
                target: '[data-tutorial-target="series-create"]',
                route: '/series',
                fields: ['#name', '#range_start', '#range_stop', '#type'],
                submit: '#submitBtn'
            },
            {
                id: 5,
                title: 'Issue Insurance',
                desc: 'Finally, issue an insurance policy. Click "New Insurance" to finish.',
                target: '[data-tutorial-target="insurance-create"]',
                route: '/insurances',
                fields: ['#modal-coc_no', '#modal-client_id', '#modal-policy_id', '#modal-registration_no'],
                submit: '#insuranceSubmitBtn'
            }
        ],
        storageKey: 'vimsy_tutorial_step',
        completedKey: 'vimsy_tutorial_done'
    };

    // State
    let currentStep = 0;
    let isActive = false;
    let fieldIndex = 0;
    let els = {};
    let currentField = null;
    let hoverListeners = [];

    // Initialize
    function init() {
        if (localStorage.getItem(CONFIG.completedKey)) return;

        const saved = parseInt(localStorage.getItem(CONFIG.storageKey)) || 0;
        currentStep = saved;

        // Check if tutorial was explicitly started (from dashboard)
        const tutorialActive = sessionStorage.getItem('vimsy_tutorial_active');

        // Show welcome on dashboard
        if (location.pathname === '/dashboard' && currentStep === 0 && !tutorialActive) {
            setTimeout(showWelcome, 500);
        }

        // Auto-resume if on correct page (for any step including 0)
        if ((currentStep > 0 || tutorialActive) && isOnCorrectPage()) {
            setTimeout(() => start(currentStep), 800);
            // Clear the active flag once we've started
            sessionStorage.removeItem('vimsy_tutorial_active');
        }

        // Listen for form completion events
        window.addEventListener('tutorial:actionCompleted', handleActionComplete);
    }

    function isOnCorrectPage() {
        const step = CONFIG.steps[currentStep];
        return step && location.pathname.includes(step.route);
    }

    function showWelcome() {
        if (document.getElementById('tutorialWelcome')) return;

        const div = document.createElement('div');
        div.id = 'tutorialWelcome';
        div.className = 'tutorial-welcome';
        div.innerHTML = `
            <div style="text-align:center;padding:30px;">
                <div style="font-size:60px;margin-bottom:15px;">🎮</div>
                <h2 style="margin:0 0 15px;color:#1e293b;">Welcome to VIMSYS!</h2>
                <p style="color:#64748b;margin-bottom:25px;">New here? Take our interactive tutorial to learn the system.</p>
                <button onclick="VIMSYSTutorial.start(0);this.closest('.tutorial-welcome').remove()" 
                    style="background:#2563eb;color:white;border:none;padding:12px 30px;border-radius:8px;font-size:16px;cursor:pointer;margin-right:10px;">
                    <i class="bi bi-play-fill"></i> Start Tutorial
                </button>
                <button onclick="this.closest('.tutorial-welcome').remove();localStorage.setItem('${CONFIG.storageKey}',0)" 
                    style="background:#f1f5f9;color:#64748b;border:1px solid #cbd5e1;padding:12px 25px;border-radius:8px;font-size:16px;cursor:pointer;">
                    Skip for Now
                </button>
            </div>
        `;
        document.body.appendChild(div);
    }

    function createElements() {
        // Remove existing
        document.querySelectorAll('.tutorial-overlay, .tutorial-spotlight, .tutorial-tooltip, .tutorial-arrow, .tutorial-animated-arrow').forEach(el => el.remove());

        // Overlay
        els.overlay = document.createElement('div');
        els.overlay.className = 'tutorial-overlay';
        els.overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9998;display:none;pointer-events:none;';
        document.body.appendChild(els.overlay);

        // Spotlight
        els.spotlight = document.createElement('div');
        els.spotlight.className = 'tutorial-spotlight';
        els.spotlight.style.cssText = 'position:absolute;border-radius:8px;box-shadow:0 0 0 9999px rgba(0,0,0,0.7);z-index:9999;display:none;pointer-events:none;transition:all 0.3s;';
        document.body.appendChild(els.spotlight);

        // Tooltip
        els.tooltip = document.createElement('div');
        els.tooltip.className = 'tutorial-tooltip';
        els.tooltip.style.cssText = 'position:absolute;background:white;border:2px solid #2563eb;border-radius:12px;padding:20px;max-width:320px;z-index:10000;display:none;box-shadow:0 10px 40px rgba(0,0,0,0.3);';
        document.body.appendChild(els.tooltip);

        // Animated Arrow - Using CSS-only arrow for better visibility
        els.arrow = document.createElement('div');
        els.arrow.className = 'tutorial-css-arrow down';
        els.arrow.style.cssText = 'position:absolute;width:40px;height:40px;z-index:10002;pointer-events:none;animation:tut-arrow-bounce 1s infinite;display:none;';
        document.body.appendChild(els.arrow);
        
        // Add arrow animation styles if not exists
        if (!document.getElementById('tutArrowStyles')) {
            const style = document.createElement('style');
            style.id = 'tutArrowStyles';
            style.textContent = `
                @keyframes tut-arrow-bounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-15px); }
                }
                .tutorial-css-arrow::before {
                    content: '';
                    position: absolute;
                    width: 0;
                    height: 0;
                    border-left: 20px solid transparent;
                    border-right: 20px solid transparent;
                    border-top: 30px solid #2563eb;
                    filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5));
                    left: 0;
                    top: 0;
                }
                .tutorial-css-arrow.up::before {
                    border-left: 20px solid transparent;
                    border-right: 20px solid transparent;
                    border-bottom: 30px solid #2563eb;
                    border-top: none;
                }
                .tutorial-css-arrow.right::before {
                    border-top: 20px solid transparent;
                    border-bottom: 20px solid transparent;
                    border-left: 30px solid #2563eb;
                    border-right: none;
                    left: 0;
                    top: 0;
                }
                .tutorial-css-arrow.left::before {
                    border-top: 20px solid transparent;
                    border-bottom: 20px solid transparent;
                    border-right: 30px solid #2563eb;
                    border-left: none;
                    left: 0;
                    top: 0;
                }
            `;
            document.head.appendChild(style);
        }
    }

    function start(step = 0) {
        currentStep = step;
        isActive = true;
        // Set flag so tutorial auto-starts after navigation
        sessionStorage.setItem('vimsy_tutorial_active', 'true');
        createElements();
        saveStep();
        showStep(currentStep);
    }

    function showStep(index) {
        const step = CONFIG.steps[index];
        if (!step) {
            showComplete();
            return;
        }

        // Navigate if wrong page
        if (!location.pathname.includes(step.route)) {
            saveStep();
            location.href = step.route;
            return;
        }

        const target = document.querySelector(step.target);
        if (!target) {
            console.warn('Tutorial target not found:', step.target);
            setTimeout(() => showStep(index), 500);
            return;
        }

        highlightElement(target);
        showTooltip(target, step);
        
        // Click handler - hide everything immediately when clicked
        target.addEventListener('click', function onClick() {
            target.removeEventListener('click', onClick);
            // Remove all highlights immediately
            target.classList.remove('tutorial-highlight');
            target.style.zIndex = '';
            target.style.position = '';
            target.style.boxShadow = '';
            target.style.border = '';
            // Hide all overlay elements
            els.spotlight.style.display = 'none';
            els.overlay.style.display = 'none';
            els.arrow.style.display = 'none';
            els.tooltip.style.display = 'none';
            // Small delay then show form guidance
            setTimeout(() => guideForm(step), 300);
        }, { once: true });
    }

    function highlightElement(el) {
        const rect = el.getBoundingClientRect();
        const pad = 8;
        
        els.spotlight.style.width = (rect.width + pad * 2) + 'px';
        els.spotlight.style.height = (rect.height + pad * 2) + 'px';
        els.spotlight.style.left = (rect.left - pad + window.scrollX) + 'px';
        els.spotlight.style.top = (rect.top - pad + window.scrollY) + 'px';
        els.spotlight.style.display = 'block';
        
        els.overlay.style.display = 'block';
        
        el.classList.add('tutorial-highlight');
        el.style.position = 'relative';
        el.style.zIndex = '10002';
    }

    function showTooltip(target, step) {
        const progress = Math.round((step.id / CONFIG.steps.length) * 100);
        
        els.tooltip.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <span style="background:#2563eb;color:white;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Step ${step.id} of ${CONFIG.steps.length}</span>
                <button onclick="VIMSYSTutorial.skip()" style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px;">✕</button>
            </div>
            <h4 style="margin:0 0 8px;color:#1e293b;font-size:18px;">${step.title}</h4>
            <p style="margin:0 0 15px;color:#475569;font-size:14px;line-height:1.5;">${step.desc}</p>
            <div style="background:#dbeafe;border-left:3px solid #2563eb;padding:10px 12px;border-radius:6px;margin-bottom:15px;font-size:13px;color:#1e40af;">
                <i class="bi bi-hand-index-thumb-fill" style="margin-right:6px;"></i>Click the highlighted button
            </div>
            <div style="background:#e2e8f0;height:6px;border-radius:3px;overflow:hidden;margin-bottom:5px;">
                <div style="background:#2563eb;height:100%;width:${progress}%;transition:width 0.3s;"></div>
            </div>
            <div style="text-align:center;font-size:12px;color:#64748b;">${progress}% Complete</div>
            ${step.id > 1 ? `<button onclick="VIMSYSTutorial.prev()" style="margin-top:15px;background:#f1f5f9;border:1px solid #cbd5e1;padding:8px 16px;border-radius:6px;cursor:pointer;"><i class="bi bi-arrow-left"></i> Back</button>` : ''}
        `;
        
        positionTooltip(target);
        els.tooltip.style.display = 'block';
        
        // Show arrow pointing to button
        els.arrow.style.display = 'block';
        positionArrow(target, 'down');
    }

    function positionTooltip(target) {
        const rect = target.getBoundingClientRect();
        let top = rect.bottom + 20 + window.scrollY;
        let left = rect.left + (rect.width / 2) - 160 + window.scrollX;
        
        // Boundary check
        if (left < 10) left = 10;
        if (left + 320 > window.innerWidth) left = window.innerWidth - 330;
        if (top + 250 > window.innerHeight + window.scrollY) {
            top = rect.top - 200 + window.scrollY;
        }
        
        els.tooltip.style.top = top + 'px';
        els.tooltip.style.left = left + 'px';
    }

    function positionArrow(target, direction) {
        const rect = target.getBoundingClientRect();
        const arrowSize = 40;
        
        els.arrow.className = 'tutorial-css-arrow ' + direction;
        
        switch(direction) {
            case 'down':
                // Arrow above target pointing down
                els.arrow.style.top = (rect.top - arrowSize - 10 + window.scrollY) + 'px';
                els.arrow.style.left = (rect.left + rect.width / 2 - arrowSize / 2 + window.scrollX) + 'px';
                break;
            case 'up':
                // Arrow below target pointing up
                els.arrow.style.top = (rect.bottom + 10 + window.scrollY) + 'px';
                els.arrow.style.left = (rect.left + rect.width / 2 - arrowSize / 2 + window.scrollX) + 'px';
                break;
            case 'right':
                // Arrow to the left pointing right
                els.arrow.style.top = (rect.top + rect.height / 2 - arrowSize / 2 + window.scrollY) + 'px';
                els.arrow.style.left = (rect.left - arrowSize - 10 + window.scrollX) + 'px';
                break;
            case 'left':
                // Arrow to the right pointing left
                els.arrow.style.top = (rect.top + rect.height / 2 - arrowSize / 2 + window.scrollY) + 'px';
                els.arrow.style.left = (rect.right + 10 + window.scrollX) + 'px';
                break;
        }
    }

    function guideForm(step) {
        fieldIndex = 0;
        
        // Build form tooltip
        const progress = Math.round((step.id / CONFIG.steps.length) * 100);
        els.tooltip.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
                <span style="background:#2563eb;color:white;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;">Step ${step.id}</span>
                <span style="font-size:12px;color:#64748b;">Fill Form</span>
            </div>
            <h4 style="margin:0 0 8px;color:#1e293b;font-size:18px;">${step.title}</h4>
            <p style="margin:0 0 15px;color:#475569;font-size:14px;">Hover over or click a field to start. Fill all fields to continue.</p>
            <div style="background:#dbeafe;border-left:3px solid #2563eb;padding:10px 12px;border-radius:6px;margin-bottom:15px;font-size:13px;color:#1e40af;">
                <i class="bi bi-cursor-fill" style="margin-right:6px;"></i><span id="tutFieldInstr">Hover over any field</span>
            </div>
            <div style="text-align:center;font-size:12px;color:#64748b;margin-bottom:10px;">
                Field <span id="tutFieldNum">0</span> of ${step.fields.length}
            </div>
            <div style="background:#e2e8f0;height:6px;border-radius:3px;overflow:hidden;">
                <div style="background:#2563eb;height:100%;width:${progress}%;"></div>
            </div>
            <button onclick="VIMSYSTutorial.skip()" style="margin-top:15px;background:#f1f5f9;border:1px solid #cbd5e1;padding:8px 16px;border-radius:6px;cursor:pointer;width:100%;">Skip Tutorial</button>
        `;
        
        positionTooltip(document.querySelector(step.target) || document.body);
        els.tooltip.style.display = 'block';
        
        // Setup hover detection for all fields
        setupFieldHoverDetection(step);
    }

    function setupFieldHoverDetection(step) {
        // Clear previous listeners
        hoverListeners.forEach(({el, handler, type}) => {
            el.removeEventListener(type, handler);
        });
        hoverListeners = [];

        // Add hover and focus listeners to all fields
        step.fields.forEach((selector, index) => {
            const field = document.querySelector(selector);
            if (!field) return;

            // Try to find the best container for highlighting
            let container = field.closest('.floating-label') || 
                           field.closest('.form-group') || 
                           field.closest('.modal-body') ||
                           field.parentElement;
            
            // Hover handler
            const hoverHandler = (e) => {
                e.stopPropagation();
                // Only respond if this field hasn't been filled yet
                if (!field.value?.trim()) {
                    highlightFieldOnHover(step, index, container, field);
                }
            };

            // Focus handler (for Tab key navigation)
            const focusHandler = () => {
                // Only respond if this field hasn't been filled yet
                if (!field.value?.trim()) {
                    highlightFieldOnHover(step, index, container, field);
                }
            };

            // Add listeners to both container and field itself
            container.addEventListener('mouseenter', hoverHandler);
            field.addEventListener('mouseenter', hoverHandler);
            field.addEventListener('focus', focusHandler);
            
            hoverListeners.push(
                {el: container, handler: hoverHandler, type: 'mouseenter'},
                {el: field, handler: hoverHandler, type: 'mouseenter'},
                {el: field, handler: focusHandler, type: 'focus'}
            );
        });

        // Add global Tab key handler for sequential navigation
        document.addEventListener('keydown', handleTabNavigation);
        hoverListeners.push({el: document, handler: handleTabNavigation, type: 'keydown'});
    }

    function handleTabNavigation(e) {
        if (e.key === 'Tab' && isActive) {
            // Let default Tab behavior happen, then highlight the focused field
            setTimeout(() => {
                const focusedField = document.activeElement;
                if (focusedField && focusedField.matches('input, select, textarea')) {
                    // Find which step field this is
                    const step = CONFIG.steps[currentStep];
                    if (!step) return;
                    
                    const fieldIndex = step.fields.findIndex(selector => {
                        const field = document.querySelector(selector);
                        return field === focusedField;
                    });
                    
                    if (fieldIndex !== -1 && !focusedField.value?.trim()) {
                        const container = focusedField.closest('.floating-label') || 
                                         focusedField.closest('.form-group') || 
                                         focusedField.closest('.modal-body') ||
                                         focusedField.parentElement;
                        highlightFieldOnHover(step, fieldIndex, container, focusedField);
                    }
                }
            }, 50);
        }
    }


    function highlightFieldOnHover(step, index, container, field) {
        // Update current field index
        fieldIndex = index;
        currentField = field;

        // Clear previous highlights
        document.querySelectorAll('.tutorial-field-active').forEach(el => {
            el.classList.remove('tutorial-field-active');
            el.style.cssText = '';
        });

        // Highlight current container with higher z-index for modal compatibility
        container.classList.add('tutorial-field-active');
        container.style.cssText = 'position:relative;z-index:10010 !important;background:#fff !important;border-radius:8px;box-shadow:0 0 0 3px #2563eb,0 0 20px rgba(37,99,235,0.5);padding:5px;transition:all 0.3s;pointer-events:auto;';
        
        // Also highlight the field itself
        field.style.cssText = 'position:relative;z-index:10011 !important;';
        
        // Update instruction
        const label = field.closest('.floating-label')?.querySelector('label')?.textContent || 
                      field.getAttribute('placeholder') || 
                      field.getAttribute('name') || 
                      'this field';
        document.getElementById('tutFieldInstr').innerHTML = `<i class="bi bi-pencil-fill" style="margin-right:6px;"></i>Enter <strong>${label.replace('*', '').trim()}</strong>`;
        document.getElementById('tutFieldNum').textContent = index + 1;
        
        // Position arrow pointing to field (adjust for modal)
        els.arrow.style.display = 'block';
        els.arrow.style.zIndex = '10012';
        positionArrow(container, 'right');
        
        // Ensure field is focusable and visible
        field.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Create or update next button
        let nextBtn = container.querySelector('.tut-next-btn');
        if (!nextBtn) {
            nextBtn = document.createElement('button');
            nextBtn.className = 'tut-next-btn';
            nextBtn.innerHTML = 'Next <i class="bi bi-arrow-right"></i>';
            nextBtn.style.cssText = 'position:absolute;right:-100px;top:50%;transform:translateY(-50%);background:#2563eb;color:white;border:none;padding:8px 16px;border-radius:6px;cursor:pointer;display:none;z-index:10013;white-space:nowrap;';
            container.appendChild(nextBtn);
            
            // Next button click handler
            nextBtn.onclick = (e) => {
                e.stopPropagation();
                e.preventDefault();
                if (!field.value?.trim()) {
                    container.classList.add('tutorial-shake');
                    setTimeout(() => container.classList.remove('tutorial-shake'), 500);
                    return;
                }
                
                // Mark field as filled
                container.classList.remove('tutorial-field-active');
                container.style.cssText = '';
                field.style.cssText = '';
                nextBtn.remove();
                
                // Move to next unfilled field
                moveToNextUnfilledField(step);
            };
        }
        
        // Show/hide next button based on value
        const checkValue = () => {
            nextBtn.style.display = field.value?.trim() ? 'inline-block' : 'none';
        };
        
        // Remove old input listener if exists to prevent duplicates
        field.removeEventListener('input', checkValue);
        field.addEventListener('input', checkValue);
        checkValue();
        
        // Enter key handler
        const enterHandler = (e) => {
            if (e.key === 'Enter' && field.value?.trim()) {
                e.preventDefault();
                container.classList.remove('tutorial-field-active');
                container.style.cssText = '';
                field.style.cssText = '';
                nextBtn.remove();
                moveToNextUnfilledField(step);
            }
        };
        field.removeEventListener('keydown', enterHandler);
        field.addEventListener('keydown', enterHandler);
    }


    function moveToNextUnfilledField(step) {
        // Find next unfilled field
        let nextIndex = -1;
        for (let i = 0; i < step.fields.length; i++) {
            const field = document.querySelector(step.fields[i]);
            if (field && !field.value?.trim()) {
                nextIndex = i;
                break;
            }
        }
        
        if (nextIndex === -1) {
            // All fields filled, highlight submit
            highlightSubmit(step);
        } else {
            // Highlight next unfilled field
            const nextField = document.querySelector(step.fields[nextIndex]);
            const nextContainer = nextField.closest('.floating-label') || nextField.parentElement;
            highlightFieldOnHover(step, nextIndex, nextContainer, nextField);
            nextField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    function highlightSubmit(step) {
        const btn = document.querySelector(step.submit);
        if (!btn) return;

        document.getElementById('tutFieldInstr').innerHTML = `<i class="bi bi-check-circle-fill" style="margin-right:6px;color:#22c55e;"></i><strong>All done! Click Save to complete.</strong>`;
        document.getElementById('tutFieldNum').innerHTML = '✓';

        // Position arrow pointing to submit button
        els.arrow.style.display = 'block';
        positionArrow(btn, 'up');
        
        // Highlight submit button
        btn.classList.add('tutorial-submit-highlight');
        btn.style.cssText = 'position:relative;z-index:10001;animation:tut-pulse 1.5s infinite;';
        
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Handle submit
        const form = btn.closest('form');
        const onSubmit = () => {
            btn.classList.remove('tutorial-submit-highlight');
            els.arrow.style.display = 'none';
            showSuccess();
            saveStep(currentStep + 1);
            setTimeout(() => next(), 1500);
        };
        
        if (form) form.addEventListener('submit', onSubmit, { once: true });
        btn.addEventListener('click', () => setTimeout(onSubmit, 100), { once: true });
    }

    function showSuccess() {
        const div = document.createElement('div');
        div.style.cssText = 'position:fixed;top:20px;right:20px;background:#22c55e;color:white;padding:16px 24px;border-radius:12px;z-index:10005;display:flex;align-items:center;gap:10px;font-weight:600;animation:slideIn 0.4s;';
        div.innerHTML = '<i class="bi bi-check-circle-fill" style="font-size:20px;"></i><span>Great! Moving to next step...</span>';
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 1500);
    }

    function showComplete() {
        els.tooltip.style.display = 'none';
        els.spotlight.style.display = 'none';
        els.arrow.style.display = 'none';
        
        const div = document.createElement('div');
        div.className = 'tutorial-complete';
        div.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:40px;border-radius:16px;text-align:center;z-index:10003;box-shadow:0 25px 50px rgba(0,0,0,0.25);max-width:400px;';
        div.innerHTML = `
            <div style="font-size:60px;margin-bottom:15px;">🎉</div>
            <h2 style="margin:0 0 15px;color:#1e293b;">Tutorial Complete!</h2>
            <p style="color:#64748b;margin-bottom:25px;">You've learned to create walkins, categories, policies, series, and issue insurance!</p>
            <button onclick="VIMSYSTutorial.finish()" style="background:#2563eb;color:white;border:none;padding:12px 30px;border-radius:8px;font-size:16px;cursor:pointer;">
                <i class="bi bi-check-lg"></i> Got it!
            </button>
        `;
        document.body.appendChild(div);
        
        localStorage.setItem(CONFIG.completedKey, 'true');
        localStorage.removeItem(CONFIG.storageKey);
    }

    function next() {
        cleanup();
        currentStep++;
        saveStep();
        showStep(currentStep);
    }

    function prev() {
        if (currentStep <= 0) return;
        cleanup();
        currentStep--;
        saveStep();
        showStep(currentStep);
    }

    function cleanup() {
        // Remove all listeners
        hoverListeners.forEach(({el, handler, type}) => {
            if (el && handler && type) {
                el.removeEventListener(type, handler);
            }
        });
        hoverListeners = [];
        
        document.querySelectorAll('.tutorial-highlight, .tutorial-field-active').forEach(el => {
            el.classList.remove('tutorial-highlight');
            el.classList.remove('tutorial-field-active');
            el.style.zIndex = '';
            el.style.position = '';
            el.style.cssText = '';
        });
        
        // Also clean up input fields
        document.querySelectorAll('input, select, textarea').forEach(field => {
            field.style.zIndex = '';
            field.style.position = '';
        });
        
        document.querySelectorAll('.tut-next-btn').forEach(el => el.remove());
        if (els.tooltip) els.tooltip.style.display = 'none';
        if (els.spotlight) els.spotlight.style.display = 'none';
        if (els.arrow) els.arrow.style.display = 'none';
    }


    function saveStep() {
        localStorage.setItem(CONFIG.storageKey, currentStep);
    }

    function skip() {
        if (confirm('Skip tutorial? You can restart from the dashboard anytime.')) {
            cleanup();
            document.querySelectorAll('.tutorial-overlay, .tutorial-spotlight, .tutorial-tooltip, .tutorial-arrow, .tutorial-css-arrow, .tutorial-welcome, .tutorial-complete').forEach(el => el.remove());
            isActive = false;
            sessionStorage.removeItem('vimsy_tutorial_active');
            saveStep();
        }
    }

    function finish() {
        document.querySelectorAll('.tutorial-overlay, .tutorial-spotlight, .tutorial-tooltip, .tutorial-arrow, .tutorial-css-arrow, .tutorial-complete').forEach(el => el.remove());
        isActive = false;
        sessionStorage.removeItem('vimsy_tutorial_active');
    }

    function handleActionComplete(e) {
        if (e.detail?.step === currentStep + 1) {
            showSuccess();
            setTimeout(() => next(), 1500);
        }
    }

    // Public API
    window.VIMSYSTutorial = {
        start,
        next,
        prev,
        skip,
        finish,
        isActive: () => isActive,
        getStep: () => currentStep
    };

    // Auto-init
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
