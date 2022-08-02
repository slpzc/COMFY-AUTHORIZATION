var vm = new Vue({
    el: '#app',
    data() {
        return {
            stage: 1,
            suc: { // !!
                message: '',
                title: '',
                subtitle: '',
            },
            login: '',
            password: '',
            email: '', // !!
            promo: '',
            err: null,
            apiLink: 'http://94.228.121.234:443', // линк для восстановления пароля
            standart: {
                email: ['@mail.ru', '@gmail.com', '@gmail.ru', '@yandex.ru', '@yandex.kz', '@yandex.com']
            },
            inputError: null,
            checkBoxes: {
                rules: false,
                pushMail: false
            },
            specCode: {
                showCodeInput: false,
                buttonINT: true,
                securityCode: null,
                fromInputCode: '',
                errMessage: null,
                timeTo: null,
                date: {
                    minutes: 3,
                    seconds: 59,
                    minutTimer: null,
                    secondsTimer: null
                }
            },
            newPassINFO: {
                newPass: '',
                secondPass: ''
            }
        }
    },
    methods: {
        send() {
            if (!this.output) {
                return
            }
            if (this.stage == 1) {
                alert('пытаешься войти')
            }
        },
        retSo() {
            return this.dateCopy.minutes == 0 && this.dateCopy.seconds == 0 ? this.giveCode() : false;
        },
        giveCode() {
            let url = this.apiLink + '/code'
            let t = this;
            if (!this.email) {
                this.err = 'Почта не должна быть пустой'
                setTimeout(() => {
                    t.err = null
                }, 2000);
                return;
            }
            axios.post(url, {
                    email: t.email
                })
                .then(function (response) {
                    console.log(response)
                    if (response.data.status == 'error') {
                        t.err = response.data.message
                        setTimeout(() => {
                            t.err = null
                        }, 2000);
                        return;
                    }
                    t.specCode.showCodeInput = true; // !
                    t.specCode.buttonINT = false; // !
                })
                .catch(function (err) {
                    console.log(err)
                })
            this.startTimer()
        },
        startTimer() {
            this.specCode.date.minutTimer = setInterval(() => {
                this.specCode.date.minutes--
            }, 60000)
            this.specCode.date.secondsTimer = setInterval(() => {
                if (this.specCode.date.seconds == 0) {
                    this.specCode.date.seconds = 59
                }
                this.specCode.date.seconds--
            }, 1000)
        },
        checkCode() {
            let code = this.specCode.fromInputCode
            let url = this.apiLink + '/changePass'
            let email = this.email;
            let t = this;
            axios.post(url, {
                    code,
                    email
                })
                .then(response => {
                    if (response.data.status == 1) {
                        t.stage = 4
                    } else {
                        t.err = 'Неверный код'
                        setTimeout(() => {
                            t.err = null
                        }, 2000);
                        return;
                    }
                }).catch(error => {
                    console.log(error)
                })
        },
        newPass() {
            let newPass = this.newPassINFO.newPass
            let email = this.email
            let url = this.apiLink + '/setPass'
            let t = this;
            axios.post(url, {
                    newPass,
                    email
                })
                .then(response => {
                    if (response.data.status === 'embed') {
                        t.stage = 5;
                        // !сбрасываем всё нахуй
                        t.email = ''
                        t.specCode.showCodeInput = false;
                        t.specCode.buttonINT = true;;
                        t.specCode.fromInputCode = ''
                        t.newPassINFO.newPass = '';
                        t.newPassINFO.secondPass = '';
                        t.suc.message = 'Вы успешно восстановили пароль, запомните его!'
                        t.suc.title = 'Забыли пароль?'
                        t.suc.subtitle = 'Давайте восстановим пароль'
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        stopTimer() {
            clearTimeout(this.specCode.date.minutTimer)
            clearTimeout(this.specCode.date.secondsTimer)
        },
        register() {
            for (let index = 0; index < this.standart.email.length; index++) {
                const element = this.standart.email[index];
                if (this.email.includes(element)) {
                    return this.inputError = null;
                } else {
                    return this.inputError = 'Неверный формат'
                }
            }
            let login = this.login
            let password = this.password
            let email = this.email
            //  твой код
        }
    },
    watch: {
        dateCopy(time) {
            if (time.minutes === 0 && time.seconds === 0) {
                console.log('стоп!')
                this.stopTimer()
            } else if (time.seconds === -1) {
                if (time.minutes != 0) {
                    this.specCode.date.seconds = 59
                }
            }
        },
        specCodeCopy() {
            if (this.specCode.fromInputCode.length == 6) {
                console.log('asdasd')
            }
        }
    },
    computed: {
        dateCopy() {
            return {
                ...this.specCode.date
            }
        },
        specCodeCopy() {
            return {
                ...this.specCode
            }
        },
        text() {
            let txt = this.stage;
            switch (txt) {
                case 1:
                    txt = 'Войти в аккаунт'
                    break;
                case 2:
                    txt = 'Зарегистрироваться'
                    break;
                case 3:
                    txt = 'Далее'
                    break;
                case 4:
                    txt = 'Далее'
                    break;
                case 5:
                    txt = 'Далее'
                    break;
                default:
                    txt = 'err=?1'
                    break;
            }
            return txt
        },
        output() {
            let st;
            let auth = this.login != '' && this.password != '' ? true : false;
            let reg = this.login != '' && this.password != '' && this.email != '' && this.checkBoxes.rules ? true : false;
            switch (this.stage) {
                case 1:
                    st = auth;
                    break;
                case 2:
                    st = reg;
                    break;
                default:
                    break;
            }
            return st;
        },

    },
})