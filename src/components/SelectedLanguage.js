import Component from "../core/Component.js";

export default class SelectedLanguage extends Component {
  template() {
    const { selectedLanguages } = this.props;

    return `
    <ul>
      ${selectedLanguages.map((language) => `<li>${language}</li>`).join('')}
    </ul>
    `;
  }
}
