import Component from "../core/Component.js";

export default class Suggestion extends Component {
  template() {
    const { suggestions } = this.props;

    return `
    <ul>
      ${suggestions.map((suggestion, i) => this.createSuggestionItem(suggestion, i)).join('')}
    </ul>
    `;
  }

  setEvents() {
    const { selectLanguage } = this.props;
    this.addEventListener("click", "ul", (e) => {
      if (e.target.tagName !== "LI") return;
      selectLanguage(e.target.textContent);
    })
  }

  createSuggestionItem(suggestion, i) {
    const { currentKeyword, selectedSuggestionIndex } = this.props;
    suggestion = suggestion.replaceAll(currentKeyword, `<span class="Suggestion__item--matched">${currentKeyword}</span>`);

    return `<li ${selectedSuggestionIndex === i ? `class="Suggestion__item--selected"` : ""}>${suggestion}</li>`;
  }
}