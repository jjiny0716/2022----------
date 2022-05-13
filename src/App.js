import Component from "./core/Component.js";

import SelectedLanguage from "./components/SelectedLanguage.js";
import SearchInput from "./components/SearchInput.js";
import Suggestion from "./components/Suggestion.js";

import languageClient from "./clients/LanguageClient.js";

import storage from "./Storage/storage.js";

const suggestionsCache = {};

export default class App extends Component {
  setup() {
    this.state = storage.get("root") ?? {
      selectedLanguages: [],
      currentKeyword: "",
      suggestions: [],
      selectedSuggestionIndex: 0,
    };
  }

  template() {
    // 렌더링 되었을 때의 상태를 저장
    storage.set("root", this.state);

    const { currentKeyword, selectedSuggestionIndex } = this.state;

    return `
    <div class="SelectedLanguage" data-component="SelectedLanguage"></div>
    <form class="SearchInput" data-component="SearchInput"></form>
    ${currentKeyword ? `<div class="Suggestion" data-component="Suggestion"></div>` : ""}
    `;
  }

  generateChildComponent(target, name) {
    switch (name) {
      case "SelectedLanguage":
        return new SelectedLanguage(target, () => {
          const { selectedLanguages } = this.state;
          return {
            selectedLanguages,
          };
        });
      case "SearchInput":
        return new SearchInput(target, () => {
          const { updateSuggestion, changeSelectedSuggestion, selectLanguage } = this;
          const { currentKeyword } = this.state;
          return {
            currentKeyword,
            updateSuggestion: updateSuggestion.bind(this),
            changeSelectedSuggestion: changeSelectedSuggestion.bind(this),
            selectLanguage: selectLanguage.bind(this),
          };
        });
      case "Suggestion":
        return new Suggestion(target, () => {
          const { currentKeyword, suggestions, selectedSuggestionIndex } = this.state;
          const { selectLanguage } = this;
          return {
            currentKeyword,
            suggestions,
            selectedSuggestionIndex,
            selectLanguage: selectLanguage.bind(this),
          };
        });
    }
  }

  async updateSuggestion(keyword) {
    if (!keyword) {
      this.setState({
        currentKeyword: keyword,
        suggestions: [],
        selectedSuggestionIndex: 0,
      });
      return;
    }

    try {
      const suggestions = suggestionsCache[keyword] ? suggestionsCache[keyword] : await languageClient.getRelatedLanguages(keyword);
      suggestionsCache[keyword] = suggestions;

      this.setState({
        currentKeyword: keyword,
        suggestions,
        selectedSuggestionIndex: 0,
      });
    } catch {
      this.setState({
        currentKeyword: keyword,
        suggestions: [],
        selectedSuggestionIndex: 0,
      });
    }
  }

  changeSelectedSuggestion(key) {
    let { suggestions, selectedSuggestionIndex } = this.state;

    switch (key) {
      case "ArrowUp":
        selectedSuggestionIndex = selectedSuggestionIndex === 0 ? suggestions.length - 1 : selectedSuggestionIndex - 1;
        break;
      case "ArrowDown":
        selectedSuggestionIndex = selectedSuggestionIndex === suggestions.length - 1 ? 0 : selectedSuggestionIndex + 1;
        break;
      default:
        return;
    }

    this.setState({
      selectedSuggestionIndex,
    });
  }

  selectLanguage(language) {
    const { selectedLanguages, suggestions, selectedSuggestionIndex } = this.state;
    if (!language) language = suggestions[selectedSuggestionIndex];

    alert(language);

    if (selectedLanguages.includes(language)) {
      selectedLanguages.splice(
        selectedLanguages.findIndex((value) => language === value),
        1
      );
    }
    if (selectedLanguages.length === 5) selectedLanguages.shift();
    selectedLanguages.push(language);

    this.setState({
      selectedLanguages: [...selectedLanguages],
    });
  }
}
