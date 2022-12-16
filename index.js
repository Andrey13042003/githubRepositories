class View {
    constructor() {
        this.input = document.querySelector('.select__input');
        this.menu = document.querySelector('.select__menu');
        this.list = document.querySelector('.select__list');
    }

    whenClick(name, login, stars) {
        let elem = this.createUser('li', 'select__item', this.menu, name); 
        elem.addEventListener('click', () => this.showUserData(name, login, stars));
    }

    showUserData(name, login, stars) {
        let elem = this.createUser('li', 'select__li', this.list, `name: ${name}<br><br> owner: ${login}<br><br> stars: ${stars} `);
        elem.append(this.createUser('button', 'close'));
        const btn = elem.querySelector('.close');
        btn.addEventListener("click", () => {
            btn.parentElement.remove();
        });
        this.input.value = '';
        this.menu.innerHTML = '';
    }

    createUser(element, nameClass, container, into) {
        let elem = document.createElement(element);
        elem.className = nameClass;
        if (container && into) {
            elem.innerHTML = into;
            container.append(elem);
        }

        return elem;
    }
}

class Search {
    constructor(view) {
        this.view = view;

        this.view.input.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 600));
    }

    async searchUsers() {
        try {
            if (this.view.input.value) {
                this.clearUsers();
                return await fetch(`https://api.github.com/users/${this.view.input.value}/repos`).then((res) => {
                    if (res.ok) {
                        res.json().then(res => {
                            for (let i = 0; i < 5; i++) {
                                this.view.whenClick(res[i].name, res[i].owner.login, res[i].stargazers_count);
                            }
                        });
                    }
                })
            }
            else {
                this.clearUsers();
            }
        }
        catch (err){
            console.log('Error' + err.name);
        }
    }

    clearUsers() {
        this.view.menu.innerHTML = '';
    }

    debounce(fn, ms) {
        let timeout;
        return function() {
            const fnCall = () => { fn.apply(this, arguments) }
            clearTimeout(timeout);
            timeout = setTimeout(fnCall, ms);
        }
    }
}

new Search(new View());


