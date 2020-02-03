import {
  LitElement,
  html,
  css
} from 'lit-element';

class PetClassifier extends LitElement {

  static get properties() {
    return { results: Array,
    convertedFile: String};
  }
  constructor() {
    super();
  }

  static get styles() {
    return css`
    *{
      font-family: Arial, Helvetica, sans-serif;
      font-size: 16px;
      line-height: 22px;
    }
  
  .wc-classifier__screen{
    height: 700px;
    background: url(dog-face.jpg);
    background-attachment: fixed;
    background-size: cover;
    padding: 50px 30px;
  }

  .wc-classifier__box{
    min-height: 300px;
    width: 390px;
  }
  
  .wc-classifier__title{
      max-width: 330px;
      font-size: 60px;
      line-height: 65px;
      margin-bottom: 40px;
  }
  
  .wc-classifier__list{
      
  }
  
  .wc-classifier__item{
      
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
    min-width: 200px;
    height: 200px; 
    display: inline-block;
    margin: 35px 0;
  }

  .wc-classifier__img{
      max-height: 100%;
  }
    `;
  }

  render() {
    return html `
      <div class="wc-classifier__screen">
          <h1 class="wc-classifier__title">PET CLASSIFIER</h1>
          <label class="wc-classifier__btn" for="pet">
            <span>click me papafritas!</span>
            <input  type="file" label="Adjuntar" name="pet" id="pet" @change=${(e) => this.controlUploadFile(e)}/>
          </label>
          <div class="wc-classifier__box">
          ${this.convertedFile?html`<figure class="wc-classifier__selected"><img class="wc-classifier__img" src="${this.convertedFile}" /></figure>`:html``}
          ${this.results?html`${this.results.map(result=> html`
          <ul class="wc-classifier__list">
            <li class="wc-classifier__item">${result.className} ${Math.round(((result.probability)*100) * 100) / 100}%</li>
          </ul>`)}`:html``}
          </div>
          <div class="wc-classifier__footer">
            <figure class="wc-classifier__figure"><img class="wc-classifier__img" src="node.svg" /></figure>
            <figure class="wc-classifier__figure"><img class="wc-classifier__img" src="polymer.svg" /></figure>
            <figure class="wc-classifier__figure"><img class="wc-classifier__img" src="docker.png" /></figure>
            <figure class="wc-classifier__figure"><img class="wc-classifier__img" src="tensorflow.png" /></figure>
          </div>
        </div>
      </div>
    `;
  }

  async controlUploadFile(e) {
    const file = e.srcElement.files[0];
    this.convertedFile = await this.filteToBase64(file);
    this.results = await this.postNewCandidate(this.convertedFile.split(",")[1]);

  }

  filteToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(console.log(error));
    })
  }

  async postNewCandidate(image){
    const body = {imageBase64: image};
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