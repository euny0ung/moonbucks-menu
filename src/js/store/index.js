const store = {
    setLocalStorage(menu) {
        localStorage.setItem('menu', JSON.stringify(menu));
    },
    getLocalStorage() {
        return JSON.parse(localStorage.getItem('menu')); // 문자열로 저장된걸 다시 json 객체 형태로 만들어줌. 문자열은 배열이 아니므로 순회하지 못한다.
    },
};

export default store;
// setStorage로 다이렉트로 하지 않고 store 객체를 만들어준 이유? 상태 변경은 최소한의 light한 로직을 만들어서 써야함. 꼬일 수 있다.
