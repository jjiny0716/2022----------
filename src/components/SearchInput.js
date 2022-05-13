import Component from "../core/Component.js";

import { debounce } from "../utils/debounce.js";

export default class SearchInput extends Component {
  template() {
    const { currentKeyword } = this.props;
    return `<input class="SearchInput__input" type="text" placeholder="프로그램 언어를 입력하세요." value=${currentKeyword}>`;
  }

  setEvents() {
    const { updateSuggestion, changeSelectedSuggestion, selectLanguage } = this.props;

    // 입력시 추천 목록 업데이트
    this.addEventListener(
      "input",
      ".SearchInput__input",
      debounce((e) => {
        updateSuggestion(e.target.value);
      }),
      200
    );

    // 엔터, 위 아래키 처리
    this.addEventListener("keydown", ".SearchInput__input", (e) => {
      if (e.key === "Enter") {
        selectLanguage();
      }

      changeSelectedSuggestion(e.key);
    });

    // form 기본 동작 막기
    this.addEventListener("submit", ".SearchInput", (e) => {
      e.preventDefault();
    });
  }

  afterMount() {
    this.target.querySelector(".SearchInput__input").focus();
  }
}
