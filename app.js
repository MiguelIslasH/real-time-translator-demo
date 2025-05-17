const startBtn = document.getElementById('start');
const originalSpan = document.getElementById('original');
const traducidoSpan = document.getElementById('traducido');
const stopBtn = document.getElementById('stop');

startBtn.addEventListener('click', () => {
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "es-ES";
    recognition.continuous = true;

    recognition.onresult = async (event) => {
        const texto = event.results[event.results.length - 1][0].transcript;
        animateTyping(originalSpan, texto);

        const res = await fetch('https://api.mymemory.translated.net/get?q=' + encodeURIComponent(texto) + "&langpair=es|en");
        const data = await res.json();
        const translatedText = data.responseData.translatedText;

        animateTyping(traducidoSpan, translatedText);

        const utterance = new SpeechSynthesisUtterance(translatedText);
        utterance.lang = 'en-US';

        speechSynthesis.speak(utterance);
    };

    recognition.start();

    stopBtn.addEventListener('click', () => {
        recognition.stop();
    });
});




function animateTyping(element, text) {
    element.textContent = "";
    let i = 0;
    const typing = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 40);
}