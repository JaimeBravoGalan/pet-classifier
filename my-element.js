import {
  LitElement,
  html
} from 'lit-element';

class PetClassifier extends LitElement {

  static get properties() {
    return { results: Array,
    convertedFile: String};
  }
  constructor() {
    super();
  }

  render() {
    return html `
      <p>PET CLASSIFIER</p>
      <input class="" type="file"s label="Adjuntar" name="pet" @change=${(e) => this.controlUploadFile(e)}/>
      ${this.results?html`${this.results.map(result=> html`
        <li>${result.className} ${Math.round(((result.probability)*100) * 100) / 100}%</li>`)}`:html``}
      ${this.convertedFile?html`<img src="${this.convertedFile}" />`:html``}
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