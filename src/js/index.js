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
// - [] localStorage에 데이터를 저장한다. write
// - [] 메뉴를 수정할 때 저장
// - [] 메뉴를 추가할 때 저장
// - [] 메뉴를 삭제할 때 저장
// - [] 새로고침하면 localStorage에 있는 데이터를 읽어온다. read

// TODO 카테고리별 메뉴판 관리
// - [] 에스프레소 메뉴판 관리
// - [] 프라푸치노 메뉴판 관리
// - [] 블렌디드 메뉴판 관리
// - [] 티바나 메뉴판 관리
// - [] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [] 페이지에 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [] 에스프레소 메뉴를 페이지에 그려준다.
// - [] 품절 상태인 경우를 보여줄 수 있게, 품절 버튼을 추가하고 sold-out class를 추가하여 상태를 변경한다.
// - [] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [] 클릭 이벤트에서 가장 가까운 li태그의 class 속성 값에 sold-out을 추가한다.

const $ = (selector) => document.querySelector(selector);
// 달러 표시는 보통 html의 element를 가져올 때 쓰는 관용적 표현. =>로 바로 씀 (저걸 리턴해 준다는 이야기)

const store = {
    setLocalStorage(menu) {
        localStorage.setItem('menu', JSON.stringify(menu));
    },
    getLocalStorage() {
        localStorage.getItem('menu');
    },
};
// setStorage로 다이렉트로 하지 않고 store 객체를 만들어준 이유? 상태 변경은 최소한의 light한 로직을 만들어서 써야함. 꼬일 수 있다.

function App() {
    // 상태(변할 수 있는 데이터) - 메뉴명 (개수는 굳이 저장하고 읽어오며 관리할 대상이 아님)

    this.menu = [];
    const updateMenuCount = () => {
        const menuCount = $('#espresso-menu-list').querySelectorAll('li').length; // 그냥 querySelector이라고 하면 맨 첫번째 li 태그만 가져옴.
        $('.menu-count').innerText = `총 ${menuCount}개`;
    };

    const addMenuName = () => {
        if ($('#espresso-menu-name').value === '') {
            alert('값을 입력해주세요.');
            return;
        }

        const espressoMenuName = $('#espresso-menu-name').value;
        this.menu.push({ name: espressoMenuName });
        store.setLocalStorage(this.menu); // 상태가 변경되면 바로 저장하기.
        const template = this.menu
            .map((menuItem, index) => {
                return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2"><span class="w-100 pl-2 menu-name">
          ${menuItem.name}</span>
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

        $('#espresso-menu-list').innerHTML = template;
        updateMenuCount();
        $('#espresso-menu-name').value = ''; // 입력창을 비워줌.
    };

    const updateMenuName = (e) => {
        // addMenuName과 통일성
        // html 코드에 수정 버튼이 없으므로 이벤트 위임함.
        // class를 배열처럼 가져올 수 있는 classList 메서드. contains 메서드는 해당 클래스 name이 있는지 확인.

        const menuId = e.target.closest('li').dataset.menuId; // 속성을 dataset으로 가져올 수 있음. menuId는 인덱스.
        const $menuName = e.target.closest('li').querySelector('.menu-name');
        // 가장 가까운 li태그 가져오기.
        const updatedMenuName = prompt('메뉴명을 수정해주세요', $menuName.innerText);
        this.menu[menuId].name = updatedMenuName;
        store.setLocalStorage(this.menu);
        $menuName.innerText = updatedMenuName;
        // 변수명이 길어도 의미가 명확하면 괜찮다.
    };

    const removeMenuName = (e) => {
        e.target.closest('li').remove();
        updateMenuCount();
    };

    // 수정 삭제 기능
    $('#espresso-menu-list').addEventListener('click', (e) => {
        if (e.target.classList.contains('menu-edit-button')) {
            updateMenuName(e);
        }
        if (e.target.classList.contains('menu-remove-button')) {
            if (confirm('정말 삭제하시겠습니까?')) {
                // 확인 버튼을 누르면 true 리턴.
                removeMenuName(e);
            }
        }
    });

    // form 태그가 자동으로 전송되는걸 막아준다.
    $('#espresso-menu-form').addEventListener('submit', (e) => {
        e.preventDefault();
    });

    $('#espresso-menu-submit-button').addEventListener('click', addMenuName);
    // 이벤트 객체를 사용하지 않을 땐 이렇게 줄여서 써도 됨.

    $('#espresso-menu-name').addEventListener('keypress', (e) => {
        if (e.key !== 'Enter') {
            //enter이라고 치면 안됨.
            return;
        }

        if (e.key === 'Enter') {
            addMenuName();
        }
    });
}

const app = new App();

// refactoring
// 재사용하는 함수는 한 곳에 모아주기
// 이벤트 위임 코드 나중에 보면 헷갈림. 따로 함수로 분리해주기.
// 리팩토링 후 반드시 동작되는지 확인. -> 테스트 코드를 짜야하는 이유!
