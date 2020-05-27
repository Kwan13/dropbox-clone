class DropBoxController {
    constructor() {
        this.btnSendFileEl = document.querySelector('#btn-send-file');
        this.snackbarModalEl = document.querySelector('#react-snackbar-root');
        this.uploadProgressEl = this.snackbarModalEl.querySelector('.mc-progress-bar-fg');
        this.fileNameEl = this.snackbarModalEl.querySelector('.filename');
        this.timeLeftEl = this.snackbarModalEl.querySelector('.timeleft');
        this.inputFilesEl = document.querySelector('#files');
        this.initEvents();
    }


    initEvents() {

        this.btnSendFileEl.addEventListener('click', event => {
            this.inputFilesEl.click();
        });

        this.inputFilesEl.addEventListener('change', event => {

            this.modalShow()
            this.uploadTask(event.target.files);

        });

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
                    try{
                        resolve(JSON.parse(ajax.responseText))
                    }catch(err){
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

        if(hours > 0) {
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`
        }

        if(minutes > 0) {
            return `${minutes} minutos e ${seconds} segundos`
        }

        if(seconds > 0) {
            return `${seconds} segundos`
        }

        return '';
    }

}

