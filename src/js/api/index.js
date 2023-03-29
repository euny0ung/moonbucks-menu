const BASE_URL = 'http://localhost:3000/api';

const HTTP_METHOD = {
    POST(data) {
        return {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', //대부분 json 형태
            },
            body: JSON.stringify(data), // key value값을 넣어서 요청
        };
    },
    PUT(data) {
        return {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', //대부분 json 형태
            },
            body: data ? JSON.stringify(data) : null, // key value값을 넣어서 요청
        };
    },
    DELETE() {
        return {
            method: 'DELETE',
        };
    },
};

const request = async (url, option) => {
    const response = await fetch(url, option);
    if (!response.ok) {
        alert('에러가 발생했습니다.');
        console.error('에러가 발생했습니다.'); // response의 상태를 확인하려면 ok 속성사용.
    }
    return response.json();
};

const requestWithoutJson = async (url, option) => {
    const response = await fetch(url, option);
    if (!response.ok) {
        alert('에러가 발생했습니다.');
        console.error('에러가 발생했습니다.'); // response의 상태를 확인하려면 ok 속성사용.
    }
    return response;
};

const MenuApi = {
    getAllMenuByCategory(category) {
        return request(`${BASE_URL}/category/${category}/menu`);
    }, // 불러오는건 option 없어도 됨.
    createMenu(category, name) {
        return request(`${BASE_URL}/category/${category}/menu`, HTTP_METHOD.POST({ name }));
    },
    async updateMenu(catagory, name, menuID) {
        return request(`${BASE_URL}/category/${catagory}/menu/${menuID}`, HTTP_METHOD.PUT({ name }));
    },
    async toggleSoldOutMenu(category, menuId) {
        // const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, {
        //     method: 'PUT',
        // });
        // if (!response.ok) {
        //     console.error('에러가 발생했습니다.');
        // }
        return request(`${BASE_URL}/category/${category}/menu/${menuId}/soldout`, HTTP_METHOD.PUT());
    },
    async deleteMenu(category, menuId) {
        return requestWithoutJson(`${BASE_URL}/category/${category}/menu/${menuId}`, HTTP_METHOD.DELETE());
        // const response = await fetch(`${BASE_URL}/category/${category}/menu/${menuId}`, {
        //     method: 'DELETE',
        // });
        // if (!response.ok) {
        //     console.error('에러가 발생했습니다.');
        // }
    },
};

export default MenuApi;
