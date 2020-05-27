class DropBoxController {
    constructor() {
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.snackbarModalEl = document.querySelector('#react-snackbar-root');
        this.uploadProgressEl = this.snackbarModalEl.querySelector('.mc-progress-bar-fg');
        this.fileNameEl = this.snackbarModalEl.querySelector('.filename');
        this.timeLeftEl = this.snackbarModalEl.querySelector('.timeleft');
        this.inputFilesEl = document.querySelector('#files');
        this.connectToFirebase();
        this.initEvents();
    }

    connectToFirebase() {
        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyBiuhu-1TotGPpvEm5B7pzuf4qhuHFm7Tk",
            authDomain: "dropbox-clone-52852.firebaseapp.com",
            databaseURL: "https://dropbox-clone-52852.firebaseio.com",
            projectId: "dropbox-clone-52852",
            storageBucket: "dropbox-clone-52852.appspot.com",
            messagingSenderId: "563009566058",
            appId: "1:563009566058:web:df4c87bd490b5750ad2113"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    initEvents() {

        this.btnSendFileEl.addEventListener('click', event => {
            this.inputFilesEl.click();
        });

        this.inputFilesEl.addEventListener('change', event => {

            this.modalShow()
            this.uploadTask(event.target.files).then(responses => {

                responses.forEach(resp => {
                    this.getFirebaseRef().push().set(resp.files['input-file']);
                });

            }).catch(err => {
                reject(err)
                console.error(err);
            });

        });

    }

    getFirebaseRef() {
        return firebase.database().ref('files');
    }

    modalShow(show = true) {
        this.snackbarModalEl.style.display = (show) ? 'block' : 'none';
    }

    uploadTask(files) {

        let promises = [];

        [...files].forEach(file => {

            promises.push(new Promise((resolve, reject) => {

                let ajax = new XMLHttpRequest();

                ajax.open('POST', '/upload');

                ajax.onload = event => {
                    this.modalShow(false);
                    try {
                        resolve(JSON.parse(ajax.responseText))
                    } catch (err) {
                        reject(err)
                        console.error(err);
                    }

                }

                ajax.upload.onprogress = event => {
                    this.uploadProgress(event, file);
                }

                ajax.onerror = event => {
                    this.modalShow(false);
                    reject(event);
                }

                let formData = new FormData();
                formData.append('input-file', file);
                this.startUploadTime = Date.now();
                ajax.send(formData);

            }));

        });

        return Promise.all(promises);

    }

    uploadProgress(data, file) {

        let timespent = Date.now() - this.startUploadTime;
        let loaded = data.loaded;
        let total = data.total;
        let porcent = parseInt((loaded / total) * 100);
        let timeleft = ((100 - porcent) * timespent) / porcent;

        this.uploadProgressEl.style.width = `${porcent}%`;
        this.fileNameEl.innerHTML = file.name;
        this.timeLeftEl.innerHTML = this.formatTime(timeleft);

    }

    formatTime(duration) {
        let seconds = parseInt((duration * 1000) % 60);
        let minutes = parseInt((duration / (1000 * 60)) % 60);
        let hours = parseInt((duration / (1000 * 60 * 60)) % 24);

        if (hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`
        }

        if (minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`
        }

        if (seconds > 0) {
            return `${seconds} segundos`
        }

        return '';
    }

}

