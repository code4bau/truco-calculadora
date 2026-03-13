   lucide.createIcons();

        let currentVal = "0";
        let historyVal = "";
        let target = 8596473;
        let isToxicMode = false;
        let isForcingLastNumber = false;
        let forcedNumberString = "";
        let forcedIndex = 0;
        let pressTimer;

        const display = document.getElementById('current-value');
        const historyDisplay = document.getElementById('history');

        function toggleSettings() {
            target = parseFloat(document.getElementById('target-result').value);
            document.getElementById('config-modal').classList.toggle('open');
        }

        function startTimer() {
            pressTimer = window.setTimeout(function() {
                isToxicMode = true;
                if (navigator.vibrate) navigator.vibrate(50);
                console.log("Modo Toxic Activado");
            }, 2000);
        }

        function endTimer() {
            clearTimeout(pressTimer);
            if (!isToxicMode) clearAll();
        }

        function clearAll() {
            currentVal = "0";
            historyVal = "";
            isForcingLastNumber = false;
            updateDisplay();
        }

        function updateDisplay() {
            display.innerText = currentVal;
            historyDisplay.innerText = historyVal;
            display.style.fontSize = currentVal.length > 8 ? "40px" : "70px";
        }

        function pressNum(n) {
            if (isForcingLastNumber) {
                if (forcedIndex < forcedNumberString.length) {
                    if (currentVal === "0") currentVal = "";
                    currentVal += forcedNumberString[forcedIndex];
                    forcedIndex++;
                }
                updateDisplay();
                return;
            }

            if (currentVal === "0") currentVal = n;
            else currentVal += n;
            updateDisplay();
        }

        function performOp(op) {
            if (isToxicMode && op === '+' && historyVal !== "") {
                try {
                    let currentExpression = (historyVal + " " + currentVal)
                        .replace('×', '*').replace('÷', '/').replace('−', '-');
                    let partialResult = eval(currentExpression);
                    
                    let difference = target - partialResult;
                    forcedNumberString = Math.floor(difference).toString();
                    isForcingLastNumber = true;
                    forcedIndex = 0;
                } catch(e) { console.error(e); }
            }

            historyVal = historyVal + " " + currentVal + " " + op;
            currentVal = "0";
            updateDisplay();
        }

        function finish() {
            try {
                let finalExpression = (historyVal + " " + currentVal)
                    .replace('×', '*').replace('÷', '/').replace('−', '-');
                let finalResult = eval(finalExpression);
                
                historyVal = "";
                currentVal = finalResult.toString();
                isToxicMode = false;
                isForcingLastNumber = false;
                updateDisplay();
            } catch(e) {
                currentVal = "Error";
                updateDisplay();
            }
        }

        function deleteLast() {
            if (currentVal.length > 1) currentVal = currentVal.slice(0, -1);
            else currentVal = "0";
            updateDisplay();
        }

        // Registro de Service Worker para PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('sw.js')
                    .then(reg => console.log('SW registrado', reg))
                    .catch(err => console.log('Error SW', err));
            });
        }