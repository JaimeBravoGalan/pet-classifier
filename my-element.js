import {
  LitElement,
  html,
  css
} from 'lit-element';

class PetClassifier extends LitElement {

  static get properties() {
    return {
      results: Array,
      convertedFile: String,
      loading: Boolean
    };
  }
  constructor() {
    super();
  }

  static get styles() {
    return css `
    *{
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;
      line-height: 22px;
    }
  
    .wc-classifier__screen{
      height: auto;
      min-height: 100%;
      background: url(dog-face.jpg);
      background-attachment: fixed;
      background-size: cover;
      padding: 50px 30px;
    }
    
    .wc-classifier__title{
        max-width: 340px;
        font-size: 60px;
        line-height: 65px;
        margin-bottom: 40px;
    }

    .wc-classifier__box{
      min-height: 300px;
      position: relative;
    }

  .wc-classifier__btn{
    display: inline-block;
      background: transparent;
      border: 3px solid black;
      color: black;
      padding: 10px 20px;
      border-radius: 20px; 
      font-weight: black;
      margin: 0 auto;
      cursor: pointer;
      transition: border-color 0.5s linear 0.2s;
  }

  .wc-classifier__btn:hover{
    border-color: white;
  }

  .wc-classifier__btn span{
    font-size: 22px;
    line-heigth: 26px;
    font-weight: bold;
  }

  input{
    border:0!important;
    clip:rect(0 0 0 0)!important;
    height:1px!important;
    margin:-1px!important;
    overflow:hidden!important;
    padding:0!important;
    position: absolute!important;
    width:1px!important;
  }

  .wc-classifier__figure{
    width: (calc(100% / 4) - 30px);
    min-width: 200px;
    height: 125px; 
    display: inline-block;
  }

  .wc-classifier__selected{
    display: inline-block;
    min-width: 200px;
    height: 200px; 
    display: inline-block;
    margin: 35px 0;
    border-radius: 4px;
    overflow: hidden;
  }

  .wc-classifier__img{
      max-height: 100%;
  }

  .wc-classifier__list{
      display: inline-block;
      padding-top: 20px;
      vertical-align: top;
  }
  
  .wc-classifier__item{
    display: block;
      font-size: 28px;
      line-height: 32px;
      font-weight: bold;
      margin-bottom: 30px;
  }

  .spinner {
    animation: rotate 2s linear infinite;
    z-index: 2;
    position: absolute;
    top: 45%;
    left: 500px;
    margin: -25px 0 0 -25px;
    width: 70px;
    height: 70px;
  }
  .spinner .path {
      stroke: #fff;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }
  
  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }
  
  @keyframes dash {
    0% {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
    }
    50% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -35;
    }
    100% {
      stroke-dasharray: 90, 150;
      stroke-dashoffset: -124;
    }
  }
  
    `;
  }

  render() {
    return html `
      <div class="wc-classifier__screen">
          <h1 class="wc-classifier__title">PET CLASSIFIER</h1>
          <label class="wc-classifier__btn" for="pet">
            <span>click me papafritas!</span>
            <input type="file" label="Adjuntar" name="pet" id="pet" @change=${(e) => this.controlUploadFile(e)}/>
          </label>
          <div class="wc-classifier__box">
            ${this.convertedFile?html`<figure class="wc-classifier__selected"><img class="wc-classifier__img" src="${this.convertedFile}" /></figure>`:html``}
            <svg class="spinner" viewBox="0 0 50 50">
              <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
            </svg>
            <ul class="wc-classifier__list">
            ${this.results ? html`${this.results.map(result=> html`
              <li class="wc-classifier__item">${result.className} ${Math.round(((result.probability)*100) * 100) / 100}%</li>
            `)}`:html`${this.loading ? html`<span>Pensando</span>`:html``}`}
            </ul>
          </div>
          <div class="wc-classifier__footer">
            <figure class="wc-classifier__figure"><img class="wc-classifier__img" src="node.svg" /></figure>
            <figure class="wc-classifier__figure"><img class="wc-classifier__img" src="polymer.svg" /></figure>
            <figure class="wc-classifier__figure"><img class="wc-classifier__img" src="docker.png" /></figure>
            <figure class="wc-classifier__figure"><img class="wc-classifier__img" src="tensorflow.png" /></figure>
          </div>
      </div>
    `;
  }

  async controlUploadFile(e) {
    const file = e.srcElement.files[0];
    this.convertedFile = await this.filteToBase64(file);
    if (this.convertedFile) {
      this.results = undefined;
      this.loading = true;
    }
    this.results = await this.postNewCandidate(this.convertedFile.split(",")[1]);
    if(this.results){
      this.loading = false;
    }
  }

  filteToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(console.log(error));
    })
  }

  async postNewCandidate(image) {
    const body = {
      imageBase64: image
    };
    const url = `http://localhost:8000/file`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body),
      credentials: 'same-origin'
    });
    return await response.json();
  }
}

customElements.define('my-element', PetClassifier);