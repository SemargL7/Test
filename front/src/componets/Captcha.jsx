import React, { Component } from 'react';

class Captcha extends Component {
    constructor() {
        super();
        this.state = {
            captchaText: this.generateCaptcha(),
            userInput: '',
            isValid: false,
        };
    }

    generateCaptcha() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let captcha = '';
        for (let i = 0; i < 6; i++) { // Генерувати CAPTCHA з 6 символів
            const randomIndex = Math.floor(Math.random() * characters.length);
            captcha += characters[randomIndex];
        }
        return captcha;
    }

    handleUserInput(event) {
        this.setState({ userInput: event.target.value });
    }

    validateCaptcha() {
        const { userInput, captchaText } = this.state;
        const isCaptchaValid = userInput === captchaText;
        this.setState({ isValid: isCaptchaValid });

        // Додайте перевірку CAPTCHA до функції onVerify, якщо вона передана
        if (this.props.onVerify) {
            this.props.onVerify(isCaptchaValid);
        }
    }

    resetCaptcha() {
        this.setState({
            captchaText: this.generateCaptcha(),
            userInput: '',
            isValid: false,
        });
    }

    render() {
        const { captchaText, userInput, isValid } = this.state;

        // Створюємо зображення CAPTCHA
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 150;
        canvas.height = 50;

        ctx.fillStyle = '#EEE'; // Колір фону
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.font = '24px sans-serif'; // Розмір та шрифт тексту
        ctx.fillStyle = '#333'; // Колір тексту
        ctx.fillText(captchaText, 10, 30); // Розміщення тексту

        const captchaImage = canvas.toDataURL(); // Конвертуємо зображення до формату Data URL

        return (
            <div className="captcha">
                <div className="captcha-form">
                    <img
                        src={captchaImage}
                        alt="CAPTCHA"
                    />
                    <input
                        type="text"
                        placeholder="Enter CAPTCHA"
                        value={userInput}
                        onChange={(e) => this.handleUserInput(e)}
                    />
                </div>


                <div>
                    <button onClick={() => this.validateCaptcha()}>Verify</button>
                    <button onClick={() => this.resetCaptcha()}>Reset</button>
                </div>
                {isValid ? <p>CAPTCHA is valid!</p> : null}
            </div>
        );
    }
}

export default Captcha;
