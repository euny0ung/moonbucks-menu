// step1 요구사항 구현을 위한 전략
// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력 받고 확인 버튼을 누르면 메뉴가 추가된다.
// - [x] 메뉴의 이름을 입력 받고 엔터키 입력으로 추가한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되고 나면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력이 빈 값이라면 추가되지 않는다.
// - [x] - 추가되는 메뉴의 마크업은 '<ul id="espresso-menu-list" class="mt-3 pl-0"></ul>' 안에 삽입해야 한다.

// TODO 메뉴 수정
// - [x] 메뉴의 수정 버튼 클릭 이벤트를 받으면 메뉴를 수정하는 모달창이 뜬다.
// - [x] 모달창에서 신규 메뉴명을 입력 받고, 확인버튼을 누르면 메뉴가 수정된다.

// TODO 메뉴 삭제
// - [x] 메뉴 삭제 버튼 클릭 이벤트를 받으면 메뉴 삭제 컨펌 모달창이 뜬다.
// - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [x] 총 메뉴 개수를 count하여 상단에 보여준다.

// TODO localStorage Read & Write
// - [x] localStorage에 데이터를 저장한다. write
// - [x] 메뉴를 수정할 때 저장
// - [x] 메뉴를 추가할 때 저장
// - [x] 메뉴를 삭제할 때 저장
// - [x] 새로고침하면 localStorage에 있는 데이터를 읽어온다. read

// TODO 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// - [] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [] 클릭 이벤트에서 가장 가까운 li태그의 class 속성 값에 sold-out을 추가한다.

import { $ } from './utils/dom.js';
import store from './store/index.js';

function App() {
    // 상태(변할 수 있는 데이터) - 메뉴명 (개수는 굳이 저장하고 읽어오며 관리할 대상이 아님)

    this.menu = {
        espresso: [],
        frappuccino: [],
        blended: [],
        teavana: [],
        desert: [],
    };

    this.currentCategory = 'espresso'; // 현재 어떤 카테고리인지 상태값으로 관리.

    this.init = () => {
        if (store.getLocalStorage()) {
            // 객체의 길이를 바로 구하려하면 문제가 됨. 따라서 삭제.
            this.menu = store.getLocalStorage();
        }
        render();
        initEventListeners(); // 초기화할때 render와 이벤트 리스너 실행
    };

    const render = () => {
        const template = this.menu[this.currentCategory]
            // ? 식을 이용하여 soldOut이 true면 class에 sold-out을 추가하고 그렇지 않으면 아무것도 추가 안함.
            .map((menuItem, index) => {
                return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2"><span class="w-100 pl-2 menu-name ${
                    menuItem.soldOut ? 'sold-out' : ''
                }">
      ${menuItem.name}</span>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
        >
        품절
        </button>
      <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
      >
      수정
      </button>
      <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
      >
      삭제
      </button>
      </li>`;
            })
            .join('');
        // join이 ["<li>~</li>", "<li>~</li>"]; 이걸 <li>~</li><li>~</li> 이런식으로 붙여줌.

        $('#menu-list').innerHTML = template;
        updateMenuCount();
    };

    const updateMenuCount = () => {
        const menuCount = this.menu[this.currentCategory].length; // 그냥 querySelector이라고 하면 맨 첫번째 li 태그만 가져옴.
        $('.menu-count').innerText = `총 ${menuCount}개`;
    };

    const addMenuName = () => {
        if ($('#menu-name').value === '') {
            alert('값을 입력해주세요.');
            return;
        }

        const menuName = $('#menu-name').value;
        this.menu[this.currentCategory].push({ name: menuName }); // 에스프레소 키값에 value를 넣어주는 형태로 변경.
        store.setLocalStorage(this.menu); // 상태가 변경되면 바로 저장하기.
        render();
        $('#menu-name').value = ''; // 입력창을 비워줌.
    };

    const updateMenuName = (e) => {
        // addMenuName과 통일성
        // html 코드에 수정 버튼이 없으므로 이벤트 위임함.
        // class를 배열처럼 가져올 수 있는 classList 메서드. contains 메서드는 해당 클래스 name이 있는지 확인.

        const menuId = e.target.closest('li').dataset.menuId; // 속성을 dataset으로 가져올 수 있음. menuId는 인덱스.
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        // 가장 가까운 li태그 가져오기.
        const updatedMenuName = prompt('메뉴명을 수정해주세요', $menuName.innerText);
        this.menu[this.currentCategory][menuId].name = updatedMenuName;
        store.setLocalStorage(this.menu);
        render();
        // 변수명이 길어도 의미가 명확하면 괜찮다.
    };

    const removeMenuName = (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        this.menu[this.currentCategory].splice(menuId, 1); // 배열의 특정 원소를 삭제하는 메소드. 삭제 후 결과를 반환한다.
        // const a = this.menu.splice(menuId,1) 이렇게 하면 삭제된 원소가 반환됨.
        store.setLocalStorage(this.menu);
        render();
    };

    const soldOutMenu = (e) => {
        const menuId = e.target.closest('li').dataset.menuId;
        this.menu[this.currentCategory][menuId].soldOut = !this.menu[this.currentCategory][menuId].soldOut; // 처음엔 undefined의 부정이므로 true가 됨.
        store.setLocalStorage(this.menu);
        render(); // soldout된 상태를 보여주는 로직. 이거 없으면 새로고침해야 적용된거 보임.
    };

    const initEventListeners = () => {
        // 수정 삭제 기능
        $('#menu-list').addEventListener('click', (e) => {
            if (e.target.classList.contains('menu-edit-button')) {
                updateMenuName(e);
                return; // return을 해주면 불필요한 연산을 하지 않는다.
            }
            if (e.target.classList.contains('menu-remove-button')) {
                if (confirm('정말 삭제하시겠습니까?')) {
                    // 확인 버튼을 누르면 true 리턴.
                    removeMenuName(e);
                }
                return;
            }
            if (e.target.classList.contains('menu-sold-out-button')) {
                soldOutMenu(e);
                return;
            }
        });

        // form 태그가 자동으로 전송되는걸 막아준다.
        $('#menu-form').addEventListener('submit', (e) => {
            e.preventDefault();
        });

        $('#menu-submit-button').addEventListener('click', addMenuName);
        // 이벤트 객체를 사용하지 않을 땐 이렇게 줄여서 써도 됨.

        // 입력 기능
        $('#menu-name').addEventListener('keypress', (e) => {
            if (e.key !== 'Enter') {
                //enter이라고 치면 안됨.
                return;
            }

            if (e.key === 'Enter') {
                addMenuName();
            }
        });

        $('nav').addEventListener('click', (e) => {
            // 메뉴 사이의 빈 공간을 눌러도 e가 들어옴. 예외처리
            const isCategoryButton = e.target.classList.contains('cafe-category-name'); // bool값으로 리턴되기 때문에.
            if (isCategoryButton) {
                const categoryName = e.target.dataset.categoryName;
                this.currentCategory = categoryName;
                $('#category-title').innerText = `${e.target.innerText} 메뉴 관리`;
                render();
            }
        });
    };
}

const app = new App();
app.init();
// 파일명 짓기 어려워지므로 파일 하나엔 하나의 객체만 있는게 좋다. => 파일 분리

// refactoring
// 재사용하는 함수는 한 곳에 모아주기
// 이벤트 위임 코드 나중에 보면 헷갈림. 따로 함수로 분리해주기.
// 리팩토링 후 반드시 동작되는지 확인. -> 테스트 코드를 짜야하는 이유!
